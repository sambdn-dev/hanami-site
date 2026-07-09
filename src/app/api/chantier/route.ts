/**
 * route.ts — API endpoint /api/chantier
 *
 * Reçoit le payload du wizard /mon-chantier en multipart/form-data :
 *   - field 'data'      : JSON.stringify de toutes les réponses + résultat calculé
 *   - field 'photo_0…4' : pièces jointes binaires (max 5, max 10 Mo chacune)
 *
 * Envoie 2 emails via Resend :
 *   1. Notification à Sami (CONTACT_EMAIL) avec récap + photos
 *   2. Confirmation au visiteur avec son estimation et le lien Calendly
 *
 * Variables d'environnement requises :
 *   - RESEND_API_KEY (déjà configurée)
 *   - CONTACT_EMAIL  (par défaut samibouden@gmail.com)
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

import { SERVICES } from '@/lib/chantier/services'
import { OBJECTIFS } from '@/lib/chantier/objectifs'
import { ETAT_PHOTOS } from '@/lib/chantier/etats-photos'
import { formatPrice, formatNumber } from '@/lib/chantier/pricing'
import { COMPLEXITES, ACCES, getCombinedCoefficient } from '@/lib/chantier/complexite'
import type { ServiceId, ObjectifId, ArrosageReponse, ComplexiteId, AccesId } from '@/lib/chantier/types'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'samibouden@gmail.com'
/* Expéditeur : onboarding@resend.dev (sandbox Resend) ne délivre QUE vers
   l'adresse du propriétaire du compte — les visiteurs ne reçoivent rien.
   Vérifier le domaine hanami-gazon.fr dans le dashboard Resend, puis définir
   RESEND_FROM_EMAIL='Hanami <noreply@hanami-gazon.fr>' sur Vercel. */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Hanami <onboarding@resend.dev>'
const CALENDLY_URL = 'https://calendly.com/samibouden/30min'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

// ── Payload attendu côté client ─────────────────────────────────────────────
interface ChantierPayload {
  surface: number
  etatPhotos: string[]
  objectif: ObjectifId | null
  arrosageAuto: ArrosageReponse | null
  complexite: ComplexiteId | null
  acces: AccesId | null
  adresseComplete: string
  ville: string
  codePostal: string
  prenom: string
  email: string
  telephone: string
  serviceRecommande: ServiceId
  estimationMin: number
  estimationMax: number
  /** Prix avec option Terreau pro (Express uniquement, sinon null) */
  estimationTerreauMin: number | null
  estimationTerreauMax: number | null
  fraisDeplacement: number
  zoneType: 'free' | 'paid' | 'out'
}

// ── Sécurité : échappement HTML pour les emails ─────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ── Helpers de formatage des labels ─────────────────────────────────────────
function getEtatLabels(ids: string[]): string[] {
  return ids
    .map(id => ETAT_PHOTOS.find(p => p.id === id)?.label)
    .filter((l): l is string => !!l)
}

function getObjectifLabel(id: ObjectifId | null): string {
  if (!id) return '—'
  return OBJECTIFS.find(o => o.id === id)?.label ?? id
}

function getArrosageLabel(id: ArrosageReponse | null): string {
  if (id === 'oui') return 'Oui'
  if (id === 'non') return 'Non'
  if (id === 'je-ne-sais-pas') return 'Pas encore décidé'
  return '—'
}

/** Couleur de fond selon la réponse arrosage — utilisé dans le récap email
 *  pour permettre à Sami de scanner ses leads en 1 coup d'œil. */
function getArrosageBadge(id: ArrosageReponse | null): { bg: string, text: string, label: string } {
  if (id === 'oui')   return { bg: '#e8f0e6', text: '#1a2e1a', label: '✓ Arrosage automatique' }
  if (id === 'non')   return { bg: '#fef3c7', text: '#7a5e1a', label: '⚠ Pas d\'arrosage automatique' }
  return { bg: '#f5f5f4', text: '#78716c', label: '? Arrosage à confirmer' }
}

function formatEstimationLine(payload: ChantierPayload): string {
  const service = SERVICES[payload.serviceRecommande]
  if (payload.serviceRecommande === 'coaching') {
    return `${formatPrice(payload.estimationMin)}/mois TTC (${service.nom})`
  }
  if (payload.estimationMin === payload.estimationMax) {
    return `${formatPrice(payload.estimationMin)} TTC (${service.nom})`
  }
  return `${formatPrice(payload.estimationMin)} – ${formatPrice(payload.estimationMax)} TTC (${service.nom})`
}

// ── POST handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const formData = await request.formData()

    // 1. Lecture du payload JSON
    const rawData = formData.get('data')
    if (!rawData || typeof rawData !== 'string') {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    let payload: ChantierPayload
    try {
      payload = JSON.parse(rawData) as ChantierPayload
    } catch {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // 2. Validation minimale
    if (!payload.prenom || !payload.email || !payload.telephone) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    // Service et surface : contrôlés côté client mais jamais garantis —
    // valider AVANT toute construction d'email (SERVICES[...] planterait sinon)
    if (!payload.serviceRecommande || !(payload.serviceRecommande in SERVICES)) {
      return NextResponse.json({ error: 'Service invalide' }, { status: 400 })
    }
    if (!Number.isFinite(payload.surface) || payload.surface < 1 || payload.surface > 50000) {
      return NextResponse.json({ error: 'Surface invalide' }, { status: 400 })
    }

    // 3. Lecture et validation des photos
    const attachments: { filename: string; content: Buffer }[] = []
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`photo_${i}`)
      if (!file || !(file instanceof File)) continue

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non autorisé : ${file.name}` },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Photo trop volumineuse (max 10 Mo) : ${file.name}` },
          { status: 400 }
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      attachments.push({
        filename: file.name,
        content: Buffer.from(arrayBuffer),
      })
    }

    // 4. Variables sécurisées pour l'HTML
    const complexiteOpt = COMPLEXITES.find(c => c.id === payload.complexite)
    const accesOpt = ACCES.find(a => a.id === payload.acces)
    const coeff = getCombinedCoefficient(payload.complexite, payload.acces)
    const safe = {
      prenom: escapeHtml(payload.prenom),
      email: escapeHtml(payload.email),
      tel: escapeHtml(payload.telephone),
      adresse: escapeHtml(payload.adresseComplete || ''),
      ville: escapeHtml(payload.ville || ''),
      cp: escapeHtml(payload.codePostal),
      surface: formatNumber(payload.surface),
      objectif: escapeHtml(getObjectifLabel(payload.objectif)),
      etats: getEtatLabels(payload.etatPhotos).map(escapeHtml),
      complexite: escapeHtml(complexiteOpt?.label ?? '—'),
      acces: escapeHtml(accesOpt?.label ?? '—'),
      coeff: coeff.value.toFixed(2),
      service: escapeHtml(SERVICES[payload.serviceRecommande].nom),
      estimation: escapeHtml(formatEstimationLine(payload)),
    }

    // ── 5. Email à Sami : notification interne ─────────────────────────────
    // Sujet en texte brut — valeur brute trimée, PAS d'échappement HTML
    // (sinon des entités &#039; apparaîtraient dans l'objet du mail)
    const adminSubject = `[Hanami Chantier] ${payload.prenom.trim()} · ${safe.surface} m² · ${SERVICES[payload.serviceRecommande].tag}`

    const photosNote = attachments.length > 0
      ? `<p style="color:#4a8c3f;font-weight:600;margin:0 0 12px;">${attachments.length} photo(s) jointe(s)</p>`
      : '<p style="color:#78716c;font-style:italic;margin:0 0 12px;">Aucune photo jointe — relancer sur WhatsApp</p>'

    const arrosage = getArrosageBadge(payload.arrosageAuto)
    const arrosageBanner = `<p style="margin:8px 0;padding:10px 14px;background:${arrosage.bg};color:${arrosage.text};font-size:14px;font-weight:600;border-radius:6px;">${arrosage.label}</p>`

    const zoneNote = payload.zoneType === 'out'
      ? '<p style="margin:8px 0;padding:10px 12px;background:#fef3c7;border-left:3px solid #d4a853;color:#7a5e1a;font-size:13px;">⚠ Hors zone d\'intervention — bascule auto sur Coaching.</p>'
      : payload.zoneType === 'paid'
      ? `<p style="margin:8px 0;padding:10px 12px;background:#e8f0e6;border-left:3px solid #4a8c3f;color:#1a2e1a;font-size:13px;">📍 Zone étendue (limitrophe IdF) — forfait déplacement ${Number(payload.fraisDeplacement) || 0} € TTC inclus dans l\'estimation.</p>`
      : ''

    const adminHtml = `
      <h2 style="color:#1a2e1a;margin:0 0 8px;font-family:Georgia,serif;">Nouvelle simulation Mon Chantier</h2>
      ${arrosageBanner}
      ${photosNote}
      ${zoneNote}
      <table style="border-collapse:collapse;width:100%;max-width:640px;font-family:Arial,sans-serif;font-size:14px;">
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;width:180px;">Prénom</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safe.prenom}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Email</td>
          <td style="padding:8px;border:1px solid #e7e5e4;"><a href="mailto:${safe.email}">${safe.email}</a></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Téléphone</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">
            <div>${safe.tel}</div>
            ${payload.telephone ? `
              <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
                <a href="tel:${payload.telephone.replace(/[^\d+]/g, '')}"
                   style="display:inline-block;padding:3px 9px;background:#2d5a27;color:white;text-decoration:none;border-radius:4px;font-size:11px;font-weight:500;">
                  📞 Appeler
                </a>
                <a href="https://wa.me/${payload.telephone.replace(/\D/g, '')}"
                   style="display:inline-block;padding:3px 9px;background:#25D366;color:white;text-decoration:none;border-radius:4px;font-size:11px;font-weight:500;"
                   target="_blank" rel="noopener">
                  💬 WhatsApp
                </a>
              </div>
            ` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;vertical-align:top;">Localisation</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">
            <div style="font-weight:600;">${safe.cp} ${safe.ville || '—'}</div>
            ${payload.codePostal && payload.ville ? `
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${payload.codePostal} ${payload.ville}`)}"
                   style="display:inline-block;padding:4px 10px;background:#2d5a27;color:white;text-decoration:none;border-radius:4px;font-size:12px;font-weight:500;"
                   target="_blank" rel="noopener">
                  📍 Voir sur Google Maps
                </a>
                <a href="https://www.google.com/maps/@?api=1&map_action=pano&query=${encodeURIComponent(`${payload.codePostal} ${payload.ville}`)}"
                   style="display:inline-block;padding:4px 10px;background:#4a8c3f;color:white;text-decoration:none;border-radius:4px;font-size:12px;font-weight:500;"
                   target="_blank" rel="noopener">
                  👁 Street View
                </a>
              </div>
            ` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Surface</td>
          <td style="padding:8px;border:1px solid #e7e5e4;"><strong>${safe.surface} m²</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Objectif</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safe.objectif}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Complexité &amp; accès</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">
            <div>Complexité : <strong>${safe.complexite}</strong> &nbsp;·&nbsp; Accès : <strong>${safe.acces}</strong></div>
            <div style="color:#78716c;font-size:12px;margin-top:4px;">Coefficient appliqué : <strong>×${safe.coeff}</strong></div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Arrosage automatique</td>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;">${escapeHtml(getArrosageLabel(payload.arrosageAuto))}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;vertical-align:top;">État du gazon</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">
            ${safe.etats.length > 0 ? `<ul style="margin:0;padding-left:20px;">${safe.etats.map(e => `<li>${e}</li>`).join('')}</ul>` : '—'}
          </td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#1a2e1a;color:white;">Service recommandé</td>
          <td style="padding:8px;border:1px solid #e7e5e4;background:#e8f0e6;font-weight:600;">${safe.service}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#1a2e1a;color:white;">Estimation (sans terreau)</td>
          <td style="padding:8px;border:1px solid #e7e5e4;background:#e8f0e6;font-weight:600;font-size:16px;">${safe.estimation}</td>
        </tr>
        ${payload.estimationTerreauMin !== null ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#1a2e1a;color:white;">Estimation avec terreau pro</td>
          <td style="padding:8px;border:1px solid #e7e5e4;background:#fef3c7;font-weight:600;font-size:16px;">Dès ${formatNumber(payload.estimationTerreauMin)} € TTC</td>
        </tr>` : ''}
      </table>
      <p style="margin-top:16px;color:#78716c;font-size:12px;font-family:Arial,sans-serif;">
        Source : wizard /mon-chantier · ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
      </p>
    `

    // Le SDK Resend ne throw pas : il retourne { data, error }. Si la
    // notification interne échoue, le lead est perdu → 502 pour que le
    // front affiche le fallback WhatsApp.
    const { error: adminError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: payload.email,
      subject: adminSubject,
      html: adminHtml,
      ...(attachments.length > 0 ? { attachments } : {}),
    })
    if (adminError) {
      console.error('[API /chantier] Échec notification interne Resend:', adminError)
      return NextResponse.json(
        { error: "L'envoi a échoué, contactez-nous sur WhatsApp" },
        { status: 502 }
      )
    }

    // ── 6. Email au visiteur : confirmation + estimation ────────────────────
    const service = SERVICES[payload.serviceRecommande]
    const isReconstruction = payload.serviceRecommande === 'reconstruction'
    const ctaLabel = isReconstruction
      ? 'Prendre RDV pour devis gratuit'
      : 'Réserver mon créneau de 30 min'

    const visitorHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;color:#292524;">
        <h2 style="font-family:Georgia,serif;color:#1a2e1a;margin:0 0 8px;font-size:24px;">
          Bonjour ${safe.prenom},
        </h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
          Merci pour votre simulation. Voici votre estimation Hanami pour ${safe.surface} m² :
        </p>

        <div style="background:#fafaf9;border:2px solid #4a8c3f;border-radius:12px;padding:24px;margin-bottom:24px;">
          <p style="margin:0;color:#4a8c3f;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
            ${escapeHtml(service.tag)}
          </p>
          <h3 style="font-family:Georgia,serif;color:#1a2e1a;margin:6px 0 8px;font-size:22px;">
            ${safe.service}
          </h3>
          <p style="margin:0 0 16px;color:#78716c;font-size:13px;font-style:italic;">
            ${escapeHtml(service.sousTitre)}
          </p>

          <p style="font-family:Georgia,serif;color:#1a2e1a;font-size:28px;font-weight:600;margin:16px 0 4px;">
            ${safe.estimation.split('(')[0].trim()}
          </p>
          <p style="margin:0;color:#78716c;font-size:12px;">
            ${escapeHtml(service.delai)}
          </p>
        </div>

        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
          <strong>Pour valider votre devis</strong>, réservez 30 minutes avec Hanami pour ajuster
          au m² près et lever vos questions.
        </p>

        <p style="text-align:center;margin:24px 0;">
          <a href="${CALENDLY_URL}" style="display:inline-block;background:#2d5a27;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:600;font-size:14px;">
            ${ctaLabel} →
          </a>
        </p>

        <p style="margin:24px 0 0;font-size:13px;color:#78716c;line-height:1.6;border-top:1px solid #e7e5e4;padding-top:16px;">
          Vous avez d&apos;autres photos à partager ?
          <a href="https://wa.me/33667277614" style="color:#2d5a27;">Envoyez-les sur WhatsApp</a>
          (06 67 27 76 14).
        </p>

        <p style="margin:16px 0 0;font-size:12px;color:#a8a29e;">
          Hanami · TROTT SASU · Le Vésinet, Île-de-France
        </p>
      </div>
    `

    // Confirmation visiteur : si elle échoue, le lead est déjà chez Sami —
    // on logge l'erreur sans faire échouer la requête.
    const { error: visitorError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [payload.email],
      replyTo: CONTACT_EMAIL,
      subject: 'Votre estimation Hanami',
      html: visitorHtml,
    })
    if (visitorError) {
      console.error('[API /chantier] Échec email de confirmation visiteur:', visitorError)
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[API /chantier] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur, veuillez réessayer' },
      { status: 500 }
    )
  }
}

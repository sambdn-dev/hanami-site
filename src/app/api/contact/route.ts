/**
 * route.ts — API Route pour le formulaire de contact
 *
 * Cet endpoint reçoit les données du formulaire en multipart/form-data
 * (champs texte dans un champ JSON "data" + photos dans photo_0…photo_4).
 *
 * Les photos sont jointes à l'email Resend sous forme de pièces jointes.
 *
 * Pour que l'envoi fonctionne, créer un fichier .env.local avec :
 *   RESEND_API_KEY=votre_cle_api_resend
 *   CONTACT_EMAIL=samibouden@gmail.com   ← peut être surchargé ici
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Email de destination — modifiable via .env.local (CONTACT_EMAIL)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'samibouden@gmail.com'

// ── Sécurité : échapper les caractères HTML ─────────────────────────────────
// Empêche l'injection HTML dans le corps de l'email.
// Sans ça, un utilisateur malveillant pourrait injecter des balises HTML
// arbitraires dans l'email reçu (ex. liens de phishing, contenu trompeur).
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Taille max autorisée par photo : 10 Mo
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
// Types MIME acceptés côté serveur (double-check du filtre client)
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function POST(request: NextRequest) {
  // Instancié ici pour éviter une erreur au build (clé absente à ce stade)
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // ── 1. Lecture du FormData ────────────────────────────────────────────
    const formData = await request.formData()

    const rawData = formData.get('data')
    if (!rawData || typeof rawData !== 'string') {
      return NextResponse.json(
        { error: 'Données du formulaire manquantes' },
        { status: 400 }
      )
    }

    const data = JSON.parse(rawData) as Record<string, string>

    // ── 2. Validation des champs obligatoires ─────────────────────────────
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Validation basique du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Longueur max des champs texte pour éviter les abus (1000 chars pour le message)
    if ((data.message ?? '').length > 1000) {
      return NextResponse.json(
        { error: 'Message trop long (max 1000 caractères)' },
        { status: 400 }
      )
    }

    // ── 3. Récupération et validation des photos ──────────────────────────
    const attachments: { filename: string; content: Buffer }[] = []

    for (let i = 0; i < 5; i++) {
      const file = formData.get(`photo_${i}`)
      if (!file || !(file instanceof File)) continue

      // Vérification du type MIME côté serveur
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non autorisé : ${file.name}` },
          { status: 400 }
        )
      }

      // Vérification de la taille (max 10 Mo par photo)
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

    // ── 4. Construction de l'email (avec échappement HTML) ────────────────
    const isPro = data.source === 'pro'
    const safeName    = escapeHtml(data.fullName ?? '')
    const safeCompany = escapeHtml(data.companyName ?? '')
    const safeEmail   = escapeHtml(data.email ?? '')
    const safePhone   = escapeHtml(data.phone ?? '')
    const safeSurface = escapeHtml(data.surface ?? '')
    const safePostal  = escapeHtml(data.postalCode ?? '')
    const safeReqType = escapeHtml(data.requestType ?? '')
    const safeProjects= escapeHtml(data.projectsPerYear ?? '')
    // Le message est affiché en texte brut (pre-wrap) — pas besoin d'échapper les \n
    const safeMessage = escapeHtml(data.message ?? '')

    const subject = isPro
      ? `[Hanami Pro] Nouvelle demande de ${safeCompany || safeName}`
      : `[Hanami] Nouvelle demande de ${safeName}`

    const photosNote = attachments.length > 0
      ? `<p style="color:#4a8c3f;font-weight:600;margin:0 0 12px;">${attachments.length} photo(s) jointe(s)</p>`
      : '<p style="color:#78716c;font-style:italic;margin:0 0 12px;">Aucune photo jointe</p>'

    const htmlBody = `
      <h2 style="color:#1a2e1a;margin:0 0 8px;">${isPro ? 'Nouvelle demande Pro' : 'Nouvelle demande Particulier'}</h2>
      ${photosNote}
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        ${isPro && safeCompany ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;width:180px;">Entreprise</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safeCompany}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;width:180px;">Nom</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Email</td>
          <td style="padding:8px;border:1px solid #e7e5e4;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Téléphone</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safePhone}</td>
        </tr>
        ${!isPro && safeSurface ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Surface</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safeSurface} m²</td>
        </tr>` : ''}
        ${!isPro && safePostal ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Code postal</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safePostal}</td>
        </tr>` : ''}
        ${isPro && safeReqType ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Type de demande</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safeReqType}</td>
        </tr>` : ''}
        ${isPro && safeProjects ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Chantiers/an</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${safeProjects}</td>
        </tr>` : ''}
        ${safeMessage ? `
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;vertical-align:top;">Message</td>
          <td style="padding:8px;border:1px solid #e7e5e4;white-space:pre-wrap;">${safeMessage}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:8px;border:1px solid #e7e5e4;font-weight:600;background:#f5f5f4;">Source</td>
          <td style="padding:8px;border:1px solid #e7e5e4;">${escapeHtml(data.source ?? '')}</td>
        </tr>
      </table>
    `

    // ── 5. Envoi via Resend ───────────────────────────────────────────────
    await resend.emails.send({
      from: 'Hanami Contact <noreply@hanami-gazon.fr>',
      to: [CONTACT_EMAIL],
      replyTo: data.email,
      subject,
      html: htmlBody,
      ...(attachments.length > 0 ? { attachments } : {}),
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[API /contact] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur, veuillez réessayer' },
      { status: 500 }
    )
  }
}

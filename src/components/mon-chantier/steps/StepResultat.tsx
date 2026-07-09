/**
 * StepResultat.tsx — Étape 7 (terminal) : récapitulatif + estimation + CTA
 *
 * Affiché après l'envoi à /api/chantier. Le composant reçoit directement
 * le résultat calculé côté client et l'état de la soumission.
 *
 * - Service principal en carte mise en avant (comme sur le flyer)
 * - Estimation chiffrée TTC
 * - CTA Calendly direct (popup)
 * - Cross-sell Coaching si Express
 * - Bouton WhatsApp pour photos additionnelles ou fallback erreur
 */

'use client'

import { Check, Calendar, Mail, MessageCircle, Sparkles } from 'lucide-react'
import { PopupModal } from 'react-calendly'
import { useEffect, useState } from 'react'
import { SERVICES } from '@/lib/chantier/services'
import { computeEstimation, formatEstimation, formatPrice, PRICING_DISPLAY } from '@/lib/chantier/pricing'
import { track } from '@/lib/analytics'
import type { ChantierFormState, ChantierResult } from '@/lib/chantier/types'

const CALENDLY_URL = 'https://calendly.com/samibouden/30min'

interface Props {
  state: ChantierFormState
  result: ChantierResult
  /** Status de l'envoi à /api/chantier */
  submissionStatus: 'success' | 'error'
}

export default function StepResultat({ state, result, submissionStatus }: Props) {
  const service = SERVICES[result.serviceId]
  const altService = result.alternativeServiceId ? SERVICES[result.alternativeServiceId] : null
  const isReconstruction = result.serviceId === 'reconstruction'
  const isCoaching = result.serviceId === 'coaching'

  const [calendlyOpen, setCalendlyOpen] = useState(false)
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null)
  useEffect(() => { setRootEl(document.body) }, [])

  const ctaLabel = isReconstruction
    ? 'Prendre RDV pour obtenir un devis gratuit'
    : 'Réserver mon créneau de 30 min'

  // Lien WhatsApp pré-rempli avec le récap minimal
  const waMessage = encodeURIComponent(
    `Bonjour Sami, je viens de faire ma simulation Hanami.\n` +
    `Surface : ${state.surface} m²\n` +
    `Code postal : ${state.codePostal}\n` +
    `Je voulais ${submissionStatus === 'error' ? 'vous joindre car le formulaire a eu un souci' : 'vous envoyer quelques photos en plus'}.`
  )
  const waUrl = `https://wa.me/33667277614?text=${waMessage}`

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-amber-500">
        Votre estimation
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Voilà ce que je vous recommande, {state.prenom}.
      </h1>

      {/* Bandeau hors zone si applicable */}
      {result.zoneType === 'out' && (
        <div className="mt-5 p-4 rounded-lg bg-amber-100/60 border border-amber-500/30">
          <p className="text-sm text-stone-700 leading-relaxed">
            Vous êtes hors de notre rayon de 30 km autour du Vésinet — je vous oriente
            naturellement vers le <strong>Coaching Hanami</strong>, qui marche partout en France
            via le suivi en ligne.
          </p>
        </div>
      )}

      {/* Bandeau erreur si envoi raté */}
      {submissionStatus === 'error' && (
        <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm font-semibold text-red-800 mb-1">L&apos;envoi par email a échoué.</p>
          <p className="text-sm text-red-700 leading-relaxed">
            Vos réponses restent affichées sur cette page — ne la fermez pas.
            Cliquez sur le bouton WhatsApp en bas de page pour me joindre
            directement avec votre simulation.
          </p>
        </div>
      )}

      {/* ── Carte service recommandé ────────────────────────── */}
      <div className="mt-8 rounded-2xl border-2 border-hanami-500 bg-white p-6 lg:p-8 shadow-lg relative overflow-hidden">
        {/* Tag "Recommandé" */}
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-hanami-700 text-white text-[10px] font-semibold tracking-widest uppercase rounded-bl-xl font-[family-name:var(--font-space-mono)]">
          Recommandé pour vous
        </div>

        <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-[0.18em] uppercase text-hanami-500">
          {service.tag}
        </span>
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 mt-2 leading-tight">
          {service.nom}
        </h2>
        <p className="text-stone-500 italic mt-2">{service.sousTitre}</p>

        <p className="text-sm text-stone-700 mt-4 leading-relaxed">{service.accroche}</p>

        {/* Liste prestations */}
        <ul className="mt-5 space-y-2.5">
          {service.inclus.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
              <Check className="w-4 h-4 text-hanami-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Estimation chiffrée — Express affiche 2 prix (sans / avec terreau pro) */}
        {state.surface !== null && (
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-stone-500 mb-1">
              {result.serviceId === 'reconstruction' ? 'Fourchette estimative' : 'Estimation'}
            </p>
            {/* Chiffre clé en Space Mono (charte) */}
            <p className="font-[family-name:var(--font-space-mono)] text-3xl lg:text-4xl font-bold text-hanami-900">
              {result.estimation.fromOnly && 'Dès '}
              {formatEstimation(result.estimation)}
            </p>
            <p className="text-xs text-stone-500 mt-1.5">{result.estimation.formula}</p>

            {/* Bloc upsell Terreau pro — uniquement Express */}
            {result.estimation.withTerreau && (
              <div className="mt-5 p-4 rounded-lg bg-amber-100/40 border border-amber-500/30">
                <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-amber-700 mb-1">
                  Avec option Terreau professionnel
                </p>
                <p className="font-[family-name:var(--font-space-mono)] text-2xl font-bold text-hanami-900">
                  Dès {formatPrice(result.estimation.withTerreau.min)} TTC
                </p>
                <p className="text-xs text-stone-500 mt-1.5">
                  {result.estimation.withTerreau.formula}
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Le terreau professionnel épandu au-dessus des graines sécurise la levée
                  et accélère la reprise. Surcoût&nbsp;: <strong>+{formatPrice(result.estimation.withTerreau.surcout)} TTC</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-stone-400 mt-3">{service.delai}</p>
      </div>

      {/* ── CTA principal Calendly ─────────────────────────── */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            track('calendly_open', { source: 'wizard_result' })
            setCalendlyOpen(true)
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          {ctaLabel}
        </button>

        {/* WhatsApp pour photos additionnelles */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { source: 'wizard_result' })}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:border-hanami-500 hover:text-hanami-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          Envoyer mes photos sur WhatsApp
        </a>
      </div>

      {submissionStatus === 'success' && (
        <p className="text-xs text-stone-500 mt-4 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          Récap envoyé à <strong>{state.email}</strong>
        </p>
      )}

      {/* ── Cross-sell Coaching (si Express) ──────────────── */}
      {altService && altService.id === 'coaching' && (
        <div className="mt-10 p-6 rounded-2xl bg-hanami-100/40 border border-hanami-500/20">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
            <div>
              <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
                Vous préférez faire vous-même ?
              </p>
              <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 mt-1 leading-tight">
                Coaching Hanami — {formatPrice(PRICING_DISPLAY.coachingMois)}/mois TTC
              </h3>
            </div>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            On vous dit <strong>quoi faire</strong>, <strong>quand le faire</strong>,
            <strong> comment le faire</strong> — et on vous donne accès aux produits
            professionnels que vous ne trouverez pas en jardinerie. Plan 3D zone par zone,
            protocole 12 mois personnalisé, suivi 100 % en ligne.
          </p>
          <button
            onClick={() => setCalendlyOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-hanami-700 hover:text-hanami-900 transition-colors cursor-pointer"
          >
            En parler avec Hanami →
          </button>
        </div>
      )}

      {/* ── Cross-sell inverse : si Coaching, mention rénovation ── */}
      {isCoaching && result.zoneType !== 'out' && (
        <div className="mt-10 p-6 rounded-2xl bg-stone-100 border border-stone-200">
          <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-stone-500">
            Vous préférez ne pas vous en occuper ?
          </p>
          <p className="text-sm text-stone-700 mt-2 leading-relaxed">
            Une rénovation Express (dès {PRICING_DISPLAY.expressMinM2} €/m² TTC) ou
            Reconstruction ({PRICING_DISPLAY.recoMinM2}-{PRICING_DISPLAY.recoMaxM2} €/m² TTC)
            est aussi possible. Réservez un créneau pour en discuter.
          </p>
        </div>
      )}

      {/* Calendly modal */}
      {rootEl && (
        <PopupModal
          url={CALENDLY_URL}
          open={calendlyOpen}
          onModalClose={() => setCalendlyOpen(false)}
          rootElement={rootEl}
          utm={{ utmSource: 'mon-chantier' }}
          prefill={{
            name: state.prenom,
            email: state.email,
            customAnswers: {
              a1: `Surface ${state.surface} m² · ${state.codePostal} · Service reco : ${service.nom}`,
            },
          }}
          pageSettings={{
            backgroundColor: 'fafaf9',
            primaryColor: '2d5a27',
            textColor: '292524',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }}
        />
      )}
    </div>
  )
}

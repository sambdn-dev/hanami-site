/**
 * analytics.ts — Mesure d'audience anonyme (Vercel Web Analytics)
 *
 * MODÈLE : opt-OUT, pas opt-in.
 *
 * Vercel Web Analytics est *cookieless* : aucun cookie n'est déposé, aucun
 * identifiant persistant, aucun suivi inter-sites, aucune revente de données.
 * On est donc sur de la simple mesure d'audience, et la mesure tourne par
 * défaut — sinon la quasi-totalité du trafic serait invisible (la majorité
 * des visiteurs ignore les bandeaux et ne clique jamais "Accepter").
 *
 * Le visiteur qui refuse explicitement via CookieBanner est respecté : on
 * enregistre `analytics: false` et plus rien n'est envoyé.
 *
 * Note : la CNIL exempte de consentement la mesure d'audience strictement
 * anonyme et limitée à cet usage. Vercel ne figure pas nommément sur la liste
 * des solutions pré-exemptées — le choix d'un modèle opt-out relève donc
 * d'une décision de l'éditeur du site.
 *
 * Taxonomie alignée sur les KPIs funnel du doc marketing §1.5 :
 * visiteur → lead (cta_click, wizard_step) → conversion (wizard_submit,
 * contact_submit) — plus les canaux secondaires (whatsapp, calendly, newsletter).
 */

import { track as vercelTrack } from '@vercel/analytics'

export type HanamiEvent =
  | 'cta_click'
  | 'whatsapp_click'
  | 'wizard_step'
  | 'wizard_submit'
  | 'calendly_open'
  | 'contact_submit'
  | 'newsletter_signup'
  | 'calculator_action'
  | 'visualizer_upload'
  | 'visualizer_generate'
  | 'visualizer_gate_shown'
  | 'visualizer_lead'
  | 'visualizer_download'

type EventProps = Record<string, string | number | boolean | null | undefined>

const STORAGE_KEY = 'hanami-cookies-prefs'

/**
 * true uniquement si le visiteur a EXPLICITEMENT refusé la mesure d'audience.
 * Absence de choix = pas de refus = on mesure (cf. modèle opt-out ci-dessus).
 */
export function hasOptedOutOfAnalytics(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    const prefs: unknown = JSON.parse(stored)
    return (
      typeof prefs === 'object' &&
      prefs !== null &&
      (prefs as { analytics?: unknown }).analytics === false
    )
  } catch {
    // localStorage indisponible (mode privé strict, navigateur verrouillé) :
    // aucun refus lisible → on ne bloque pas la mesure anonyme.
    return false
  }
}

/** Envoie un événement custom — ne fait jamais échouer l'UI. */
export function track(event: HanamiEvent, props?: EventProps): void {
  if (typeof window === 'undefined') return
  if (hasOptedOutOfAnalytics()) return
  try {
    vercelTrack(event, props)
  } catch {
    // L'analytics ne doit jamais casser l'expérience.
  }
}

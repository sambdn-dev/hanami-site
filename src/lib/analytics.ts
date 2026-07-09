/**
 * analytics.ts — Tracking d'événements consent-aware (Vercel Analytics)
 *
 * Le consentement vient de CookieBanner (localStorage 'hanami-cookies-prefs').
 * Pas de choix enregistré = pas de tracking (consent-first).
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

/** Lit le consentement analytics posé par CookieBanner. Défaut : false. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    const prefs: unknown = JSON.parse(stored)
    return (
      typeof prefs === 'object' &&
      prefs !== null &&
      (prefs as { analytics?: unknown }).analytics === true
    )
  } catch {
    return false
  }
}

/** Envoie un événement custom — ne fait jamais échouer l'UI. */
export function track(event: HanamiEvent, props?: EventProps): void {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  try {
    vercelTrack(event, props)
  } catch {
    // L'analytics ne doit jamais casser l'expérience.
  }
}

/**
 * analytics.ts — Tracking d'événements consent-aware (Vercel Analytics)
 *
 * Le consentement vient des choix Axeptio (service vercel_analytics).
 * Pas de choix enregistré = pas de tracking (consent-first).
 *
 * Taxonomie alignée sur les KPIs funnel du doc marketing §1.5 :
 * visiteur → lead (cta_click, wizard_step) → conversion (wizard_submit,
 * contact_submit) — plus les canaux secondaires (whatsapp, calendly, newsletter).
 */

import { track as vercelTrack } from '@vercel/analytics'
import { hasAnalyticsConsent } from './consent'
export { hasAnalyticsConsent } from './consent'

export type HanamiEvent =
  | 'cta_click'
  | 'whatsapp_click'
  | 'wizard_step'
  | 'wizard_submit'
  | 'calendly_open'
  | 'contact_submit'
  | 'newsletter_signup'
  | 'calculator_action'

type EventProps = Record<string, string | number | boolean | null | undefined>

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

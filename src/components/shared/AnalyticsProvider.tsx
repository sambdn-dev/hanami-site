'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { hasOptedOutOfAnalytics } from '@/lib/analytics'

/**
 * Monte Vercel Web Analytics + Speed Insights.
 *
 * Modèle opt-out (cf. src/lib/analytics.ts) : la mesure anonyme et sans
 * cookie tourne par défaut, et n'est coupée que si le visiteur a
 * explicitement refusé via CookieBanner.
 *
 * beforeSend est rappelé à chaque événement (pageview inclus) et relit le
 * localStorage : un refus s'applique donc immédiatement, sans rechargement.
 */
export default function AnalyticsProvider() {
  return (
    <>
      <Analytics beforeSend={(event) => (hasOptedOutOfAnalytics() ? null : event)} />
      <SpeedInsights />
    </>
  )
}

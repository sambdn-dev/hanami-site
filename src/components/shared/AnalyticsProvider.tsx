'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { hasAnalyticsConsent } from '@/lib/analytics'

/**
 * Monte Vercel Analytics + Speed Insights, gardés par le consentement
 * CookieBanner. beforeSend est appelé à chaque événement (pageview inclus),
 * donc relit le localStorage : un changement de préférence s'applique
 * immédiatement, sans event bus.
 */
export default function AnalyticsProvider() {
  return (
    <>
      <Analytics beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
      <SpeedInsights />
    </>
  )
}

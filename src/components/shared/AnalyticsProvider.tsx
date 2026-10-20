'use client'

import { useSyncExternalStore } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getConsent, getServerConsent, subscribeConsent, hasAnalyticsConsent, hasPerformanceConsent } from '@/lib/consent'

export default function AnalyticsProvider() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent)
  return (
    <>
      {consent.analytics && <Analytics beforeSend={event => hasAnalyticsConsent() ? event : null} />}
      {consent.performance && <SpeedInsights beforeSend={event => hasPerformanceConsent() ? event : null} />}
    </>
  )
}

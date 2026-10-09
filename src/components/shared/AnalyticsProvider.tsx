'use client'

import { useSyncExternalStore } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { hasAnalyticsConsent, subscribeAnalyticsConsent } from '@/lib/analytics'

const getServerConsent = () => false

/**
 * Charge les mesures après consentement, y compris sur la page déjà ouverte.
 * beforeSend vérifie aussi les préférences pour bloquer les événements d'un
 * script déjà chargé si le consentement est retiré dans un autre onglet.
 */
export default function AnalyticsProvider() {
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    hasAnalyticsConsent,
    getServerConsent,
  )

  if (!consent) return null

  return (
    <>
      <Analytics beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
      <SpeedInsights beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
    </>
  )
}

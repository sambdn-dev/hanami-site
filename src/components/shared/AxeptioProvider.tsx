'use client'

import { useEffect } from 'react'
import { setConsent } from '@/lib/consent'

type Choices = Record<string, unknown>
interface AxeptioSdk {
  isReady?: boolean
  hasAcceptedVendor: (name: string) => boolean | undefined
  on: (event: 'cookies:complete', callback: (choices: Choices) => void) => void
  openCookies: () => void
}
declare global {
  interface Window {
    axeptioSettings?: Record<string, unknown>
    _axcb?: Array<(sdk: AxeptioSdk) => void>
    __axeptioSDK?: AxeptioSdk
  }
}

export default function AxeptioProvider() {
  useEffect(() => {
    let active = true
    window.axeptioSettings = {
      clientId: '6ad7e61996625a67b559c077',
      cookiesVersion: '636df011-16d7-4c66-8bc0-fcead9888c18',
      googleConsentMode: {
        default: {
          analytics_storage: 'denied', ad_storage: 'denied',
          ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500,
        },
      },
    }
    window._axcb = window._axcb || []
    window._axcb.push(sdk => {
      if (!active) return
      setConsent({
        analytics: sdk.hasAcceptedVendor('vercel_analytics') === true,
        performance: sdk.hasAcceptedVendor('vercel_speed_insights') === true,
      })
      sdk.on('cookies:complete', choices => {
        if (!active) return
        setConsent({
          analytics: choices.vercel_analytics === true,
          performance: choices.vercel_speed_insights === true,
        })
      })
    })
    if (!document.getElementById('hanami-axeptio-sdk')) {
      const script = document.createElement('script')
      script.id = 'hanami-axeptio-sdk'
      script.src = 'https://static.axept.io/sdk.js'
      script.async = true
      document.head.appendChild(script)
    }
    return () => { active = false }
  }, [])
  return null
}

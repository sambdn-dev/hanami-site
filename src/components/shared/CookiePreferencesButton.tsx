'use client'

import { useState } from 'react'

export default function CookiePreferencesButton() {
  const [unavailable, setUnavailable] = useState(false)
  return (
    <span>
      <button type="button" className="cursor-pointer underline underline-offset-4 hover:text-[#e5c571]" onClick={() => {
        const sdk = window.__axeptioSDK
        if (sdk?.isReady) { setUnavailable(false); sdk.openCookies() }
        else setUnavailable(true)
      }}>Préférences de cookies</button>
      {unavailable && <small role="status" className="block mt-2 max-w-72">Le module de préférences n’est pas disponible. Réessayez après avoir rechargé la page. Les outils de mesure restent désactivés sans votre accord.</small>}
    </span>
  )
}

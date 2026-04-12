'use client'

import { useState } from 'react'

function getSeasonalMessage(): string {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) {
    return 'Les semis de printemps se préparent maintenant — places limitées en France'
  } else if (month >= 6 && month <= 8) {
    return "Canicule : protégez votre gazon avant qu'il ne soit trop tard"
  } else if (month >= 9 && month <= 11) {
    return "L'automne est LA saison pour rénover votre gazon. Contactez-nous."
  } else {
    return "Préparez le printemps : diagnostic offert jusqu'au 1er mars"
  }
}

export default function SeasonalBanner() {
  const [dismissed, setDismissed] = useState(false)
  const message = getSeasonalMessage()

  const dismiss = () => {
    setDismissed(true)
    window.dispatchEvent(new CustomEvent('hanami:banner-dismiss'))
  }

  if (dismissed) return null

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] flex items-center justify-center px-10 text-white text-xs text-center"
      style={{
        backgroundColor: 'var(--hanami-900)',
        minHeight: '40px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      <span className="font-[family-name:var(--font-dm-sans)]">{message}</span>
      <button
        onClick={dismiss}
        aria-label="Fermer le bandeau"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z" />
        </svg>
      </button>
    </div>
  )
}

/**
 * GeneratingStep.tsx — Écran d'attente pendant la génération IA (~10-20 s)
 *
 * Occupe l'attente avec une rotation d'astuces « Le saviez-vous ? » et un
 * indicateur de progression indéterminé. Purement présentational.
 */

'use client'

import { useEffect, useState } from 'react'
import { LOADING_TIPS } from '@/lib/visualiseur/tips'

export default function GeneratingStep() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % LOADING_TIPS.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {/* Anneau de progression indéterminé */}
      <div className="relative w-16 h-16 mb-8" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-hanami-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-hanami-600 animate-spin" />
      </div>

      <p
        className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900"
        role="status"
      >
        Transformation de votre gazon en cours…
      </p>

      <div className="mt-8 max-w-md min-h-[64px]">
        <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500 mb-2">
          Le saviez-vous ?
        </p>
        <p key={tipIndex} className="text-stone-500 text-sm leading-relaxed animate-[fadeIn_0.5s_ease]">
          {LOADING_TIPS[tipIndex]}
        </p>
      </div>
    </div>
  )
}

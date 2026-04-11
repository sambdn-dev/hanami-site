/**
 * ProSocialProofBanner.tsx — Bandeau preuve sociale (page Pro)
 *
 * 3 stats clés spécifiques aux professionnels, en Space Mono gras.
 * Même design que SocialProofBanner particuliers : fond blanc, bordures discrètes.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

const stats = [
  { value: '6 jours-homme', label: 'économisés par chantier' },
  { value: 'Météo agricole', label: 'jour par jour' },
  { value: '0 concurrence', label: '100% complémentarité' },
]

export default function ProSocialProofBanner() {
  const fadeRef = useFadeIn()

  return (
    <div ref={fadeRef} className="fade-in bg-white border-y border-stone-200 py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:divide-x sm:divide-stone-200">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 sm:px-8 lg:px-12">
              <span className="font-[family-name:var(--font-space-mono)] font-bold text-hanami-700 text-sm lg:text-base whitespace-nowrap">
                {stat.value}
              </span>
              <span className="text-stone-500 text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

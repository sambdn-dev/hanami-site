/**
 * SocialProofBanner.tsx — Bandeau de preuve sociale
 *
 * Affiché juste après le Hero, ce bandeau présente 3 chiffres/faits clés
 * de manière sobre et factuelle. Les chiffres sont en Space Mono (police monospace)
 * pour donner un aspect "données techniques". Séparés par des barres verticales.
 *
 * Design : fond blanc (légèrement différent du fond stone-50 de la page),
 * bordures top/bottom discrètes, pas tape-à-l'œil.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

// Les 3 données à afficher dans le bandeau
const stats = [
  { value: '10 000+', label: 'm² de gazon suivis' },
  { value: '100%', label: 'de renouvellement coaching' },
  { value: 'Produits pro', label: 'inaccessibles en jardinerie' },
]

export default function SocialProofBanner() {
  const fadeRef = useFadeIn()

  return (
    <div
      ref={fadeRef}
      className="fade-in bg-white border-y border-stone-200 py-4"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:divide-x sm:divide-stone-200">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:px-8 lg:px-12"
            >
              {/* Chiffre clé en Space Mono gras */}
              <span className="font-[family-name:var(--font-space-mono)] font-bold text-hanami-700 text-sm lg:text-base whitespace-nowrap">
                {stat.value}
              </span>
              {/* Label descriptif en DM Sans */}
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

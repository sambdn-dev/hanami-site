/**
 * Savings.tsx — Section "Ce que vous économisez"
 *
 * 3 colonnes montrant les 3 bénéfices concrets du coaching Hanami :
 * le budget, le temps et l'eau. Chaque colonne a une icône SVG sobre
 * (pas d'emojis), un chiffre clé en Space Mono et une description courte.
 *
 * Design : fond vert pâle (#e8f0e6 = hanami-100), icônes en vert principal.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import { PiggyBank, Clock, Droplets } from 'lucide-react'

// Les 3 éléments d'économies à afficher
const items = [
  {
    icon: PiggyBank,
    title: 'Votre budget',
    stat: '200€/an',
    statLabel: 'vs 500–1 500€ de rénovation ratée',
    body: 'Plus besoin d\'acheter des produits inutiles ou d\'engager des interventions coûteuses. Le coaching Hanami coûte moins cher qu\'un seul passage de paysagiste à 50€/h.',
  },
  {
    icon: Clock,
    title: 'Votre temps',
    stat: 'Zéro essai',
    statLabel: 'infructueux',
    body: 'Finies les recherches interminables et les essais infructueux. Un protocole clair, des instructions précises, on passe à l\'action. Vous faites les bons gestes du premier coup.',
  },
  {
    icon: Droplets,
    title: 'Votre eau',
    stat: '–40%',
    statLabel: 'd\'arrosage en moins',
    body: 'Une pelouse dense et bien entretenue retient mieux l\'humidité. Jusqu\'à 40% d\'arrosage en moins, votre facture d\'eau baisse. C\'est de l\'agronomie, pas de la promesse.',
  },
]

export default function Savings() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-hanami-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span className="section-label mb-3 block">Bénéfices</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            Ce que vous économisez vraiment
          </h2>
        </div>

        {/* 3 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <SavingsCard key={index} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * SavingsCard — Une carte individuelle de la section Savings
 */
function SavingsCard({
  icon: Icon,
  title,
  stat,
  statLabel,
  body,
  index,
}: {
  icon: React.ElementType
  title: string
  stat: string
  statLabel: string
  body: string
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icône */}
      <div className="w-10 h-10 rounded-lg bg-hanami-500/15 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-hanami-700" strokeWidth={1.5} />
      </div>

      {/* Titre */}
      <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>

      {/* Chiffre clé en Space Mono */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-[family-name:var(--font-space-mono)] font-bold text-2xl text-hanami-700">
          {stat}
        </span>
        <span className="text-stone-500 text-sm">{statLabel}</span>
      </div>

      {/* Description */}
      <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

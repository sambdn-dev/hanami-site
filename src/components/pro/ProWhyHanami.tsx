/**
 * ProWhyHanami.tsx — Section "Pourquoi Hanami" (5 raisons)
 *
 * Fond vert pâle (hanami-100). 5 blocs avec numéro monospace en grand,
 * titre en Fraunces et texte en DM Sans. Layout asymétrique :
 * numéros très grands en arrière-plan, texte au premier plan.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

const reasons = [
  {
    title: 'Vous avez les produits. On a la méthode.',
    body: 'Le bon produit, la bonne méthode, le bon dosage au m², au bon moment. C\'est ça l\'expertise agronomique. Vous continuez à travailler avec vos fournisseurs — on prescrit, vous exécutez.',
  },
  {
    title: 'Vos clients renouvellent et recommandent.',
    body: 'Un gazon qui tient = un contrat qui se renouvelle. Et des voisins qui demandent votre numéro. Le gazon est le service le plus visible — et le plus parlant pour vos futurs clients.',
  },
  {
    title: 'Vos marges augmentent.',
    body: 'Moins de regarnissages, moins de passages, moins de produit gaspillé, moins d\'usure machine. Chaque chantier bien diagnostiqué en amont, c\'est une marge préservée.',
  },
  {
    title: 'Vous libérez votre charge mentale.',
    body: 'Météo agricole jour par jour. Canicule, gel, excès d\'eau — on anticipe et on vous dit quoi faire. Vous vous concentrez sur votre métier, on gère l\'agronomie.',
  },
  {
    title: 'Complémentarité, pas concurrence.',
    body: 'On ne tond pas, on ne taille pas, on ne fait pas d\'aménagement. On diagnostique et on prescrit. Vous exécutez et vous gardez la relation client. Deux expertises, un résultat supérieur.',
  },
]

export default function ProWhyHanami() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-hanami-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span className="section-label mb-3 block">Pourquoi Hanami</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-2xl leading-tight">
            5 raisons de travailler avec nous
          </h2>
        </div>

        {/* Liste des raisons */}
        <div className="flex flex-col divide-y divide-hanami-500/20">
          {reasons.map((reason, index) => (
            <ReasonRow key={index} {...reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReasonRow({
  title,
  body,
  index,
}: {
  title: string
  body: string
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 lg:gap-12 py-8 items-start"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Numéro monospace très grand */}
      <span
        className="font-[family-name:var(--font-space-mono)] font-bold text-5xl lg:text-6xl leading-none select-none"
        style={{ color: 'rgba(45,90,39,0.15)' }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Texte */}
      <div className="flex flex-col gap-2">
        <h3 className="font-[family-name:var(--font-fraunces)] text-xl lg:text-2xl font-semibold text-hanami-900 leading-snug">
          {title}
        </h3>
        <p className="text-stone-600 leading-relaxed text-sm lg:text-base">
          {body}
        </p>
      </div>
    </div>
  )
}

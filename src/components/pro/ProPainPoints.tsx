/**
 * ProPainPoints.tsx — Section "Le gazon, votre service le plus visible"
 *
 * 4 cartes pain points pour les paysagistes : gazon qui ne tient pas,
 * temps et marge perdus, charge mentale, clients qui ne renouvellent pas.
 *
 * Grille 2×2 sur desktop, 1 colonne sur mobile.
 * Fond stone-50, cartes blanches avec bordure fine.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

const painPoints = [
  {
    number: '01',
    title: 'Le gazon ne tient pas',
    body: 'Vous regarnissez, encore et encore. Mais un regarnissage est souvent la moins bonne solution au moment T. C\'est coûteux en temps, en semence et en passages, et ça ne traite pas la cause. Avec Hanami, on explore toutes les solutions en amont pour l\'éviter : correction du sol, fertilisation ciblée, gestion de l\'eau. Quand le regarnissage est vraiment nécessaire, on s\'assure qu\'il prend du premier coup.',
  },
  {
    number: '02',
    title: 'Vous perdez du temps et de la marge',
    body: 'Retourner le sol sur 500 m² à trois personnes pendant deux jours, alors qu\'un protocole adapté aurait donné un meilleur résultat en moins de temps. Chaque passage inutile, c\'est de la main-d\'œuvre perdue, du produit gaspillé et de l\'usure machine pour rien.',
  },
  {
    number: '03',
    title: 'Trop de charge mentale',
    body: 'Quel engrais choisir ? Quand ressemer ? Comment réagir à une canicule, un excès de pluie, une attaque fongique ? Le gazon demande des décisions agronomiques tout au long de l\'année. C\'est de la charge mentale que vous portez en plus de tout le reste — la taille, les haies, les massifs, les chantiers, la gestion d\'équipe.',
  },
  {
    number: '04',
    title: 'Vos clients ne renouvellent pas',
    body: 'Vos haies sont impeccables, vos massifs sont beaux. Mais le gazon jaunit en été, les mauvaises herbes reviennent, et le client se demande pourquoi il paie un contrat annuel. Le gazon est le service qui fait ou défait le renouvellement. Et la recommandation.',
  },
]

export default function ProPainPoints() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span className="section-label mb-3 block">Le constat</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-2xl leading-tight">
            Le gazon, votre service le plus visible et le moins maîtrisé
          </h2>
        </div>

        {/* Grille 2×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((point, index) => (
            <PainPointCard key={index} {...point} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PainPointCard({
  number,
  title,
  body,
  index,
}: {
  number: string
  title: string
  body: string
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in bg-white rounded-xl border border-stone-200 p-7 flex flex-col gap-4 hover:border-hanami-500/30 transition-colors"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Numéro monospace discret */}
      <span className="font-[family-name:var(--font-space-mono)] text-xs text-stone-300 font-bold">
        {number}
      </span>

      {/* Titre */}
      <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone-500 text-sm leading-relaxed">
        {body}
      </p>
    </div>
  )
}

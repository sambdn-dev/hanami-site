/**
 * ProCaseStudies.tsx — Section "Ce que ça change concrètement"
 *
 * 2 études de cas terrain : Ronan et Baptiste.
 * Layout alterné texte/placeholder (même pattern que CaseStudies particuliers).
 * Pas de vraies photos pro pour l'instant — placeholder vert texturé.
 * Stats clés en Space Mono gras.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

const cases = [
  {
    name: 'Ronan',
    tag: 'Consulting · Réparation estivale',
    title: '2 jours-homme et produits économisés',
    body: 'Son client voulait réparer des zones abîmées en août. Classiquement : scarification, regarnissage, arrosage 4×/jour pendant 2 semaines, 3 semaines d\'attente, robot en pause pendant ce temps. Le protocole Hanami : résultat en 24h. Pythium détecté avant propagation. Sans diagnostic, le regarnissage aurait échoué et Ronan aurait dû repasser.',
    stats: [
      { value: '2 jours-homme', label: 'économisés' },
      { value: '24h', label: 'résultat visible' },
      { value: 'Produits', label: 'économisés' },
    ],
    reverse: false,
  },
  {
    name: 'Baptiste',
    tag: 'Optimisation · Rénovation',
    title: '6 jours-homme économisés, résultat en 2 semaines',
    body: 'Il prévoyait de retourner le sol — 2 jours à 3 personnes. 6 jours-homme avant de poser une graine. Protocole Hanami : pas de retournement. Démoussage et nettoyage ciblés, préparation du lit de semences, semis pro. Levée plus rapide, résultat supérieur, moins d\'usure machine. La marge a suivi.',
    stats: [
      { value: '6 jours-homme', label: 'économisés' },
      { value: '0', label: 'retournement sol' },
      { value: '2 semaines', label: 'résultat visible' },
    ],
    reverse: true,
  },
]

export default function ProCaseStudies() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-16">
          <span className="section-label mb-3 block">Cas terrain</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            Ce que ça change concrètement
          </h2>
        </div>

        {/* Études de cas */}
        <div className="flex flex-col gap-20 lg:gap-28">
          {cases.map((c, index) => (
            <CaseRow key={index} {...c} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseRow({
  name,
  tag,
  title,
  body,
  stats,
  reverse,
  index,
}: {
  name: string
  tag: string
  title: string
  body: string
  stats: { value: string; label: string }[]
  reverse: boolean
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className={`fade-in grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Colonne texte */}
      <div className="flex flex-col gap-5">
        <div>
          <span className="section-label">{tag}</span>
          <p className="font-semibold text-stone-800 mt-1">{name} — Paysagiste</p>
        </div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 leading-snug">
          {title}
        </h3>
        <p className="text-stone-500 leading-relaxed">{body}</p>
        <div className="flex flex-wrap gap-6 pt-2">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="font-[family-name:var(--font-space-mono)] font-bold text-xl text-hanami-700">
                {stat.value}
              </span>
              <span className="text-stone-500 text-xs uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Colonne visuel — placeholder gazon */}
      <div
        className="rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d5a27 50%, #4a8c3f 100%)' }}
      >
        {/* Texture herbe en SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={i}
              x1={i * 10}
              y1="300"
              x2={i * 10 + (i % 3 === 0 ? -5 : i % 3 === 1 ? 5 : 0)}
              y2="200"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Badge flottant */}
        <div className="relative z-10 bg-white/95 rounded-xl px-6 py-4 text-center shadow-xl">
          <p className="font-[family-name:var(--font-space-mono)] text-xs text-stone-400 uppercase tracking-wider mb-1">
            Résultat
          </p>
          <p className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-hanami-900">
            {stats[0].value}
          </p>
          <p className="text-stone-500 text-xs mt-0.5">{stats[0].label}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * ProCaseStudies.tsx — Section "Ce que ça change concrètement"
 *
 * 2 études de cas terrain : Ronan et Baptiste.
 * Layout alterné texte/fiche protocole (même pattern que CaseStudies
 * particuliers). En attendant de vraies photos chantier, la colonne visuelle
 * est une "fiche protocole" Diagnostic → Protocole → Résultat — c'est
 * exactement le produit vendu ("la décision et le timing"), pas un substitut.
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
    protocole: [
      { phase: 'Diagnostic', detail: 'Photos + analyse à distance : Pythium détecté avant propagation' },
      { phase: 'Protocole', detail: 'Traitement ciblé immédiat — pas de regarnissage voué à l\'échec' },
      { phase: 'Résultat', detail: 'Visible en 24h, robot jamais mis en pause, client rassuré' },
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
    protocole: [
      { phase: 'Diagnostic', detail: 'Sol analysé : le retournement prévu (6 jours-homme) était inutile' },
      { phase: 'Protocole', detail: 'Démoussage ciblé, lit de semences préparé, semis professionnel' },
      { phase: 'Résultat', detail: 'Levée plus rapide, moins d\'usure machine — la marge a suivi' },
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
  protocole,
  reverse,
  index,
}: {
  name: string
  tag: string
  title: string
  body: string
  stats: { value: string; label: string }[]
  protocole: { phase: string; detail: string }[]
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

      {/* Colonne visuel — fiche protocole Diagnostic → Protocole → Résultat */}
      <div className="rounded-2xl border border-stone-200 bg-hanami-100/50 p-6 lg:p-8 relative overflow-hidden">
        {/* En-tête de fiche */}
        <div className="flex items-center justify-between mb-7">
          <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-700">
            Fiche protocole
          </span>
          <span className="font-[family-name:var(--font-space-mono)] text-[10px] px-2 py-0.5 rounded-full text-amber-600 bg-amber-100 uppercase tracking-wider">
            Cas réel
          </span>
        </div>

        {/* Timeline verticale 3 phases */}
        <ol className="relative space-y-6">
          {/* Ligne de connexion */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px bg-hanami-500/30"
            aria-hidden="true"
          />
          {protocole.map((step, i) => (
            <li key={step.phase} className="relative flex items-start gap-4 pl-0">
              {/* Pastille numérotée */}
              <span className="relative z-10 w-6 h-6 rounded-full bg-hanami-700 text-white flex items-center justify-center shrink-0 font-[family-name:var(--font-space-mono)] text-[10px] font-bold">
                {i + 1}
              </span>
              <div>
                <p className="font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase tracking-wider text-hanami-900">
                  {step.phase}
                </p>
                <p className="text-stone-600 text-sm leading-relaxed mt-1">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Pied de fiche : le chiffre qui résume */}
        <div className="border-t border-hanami-500/20 mt-7 pt-5 flex items-baseline gap-3">
          <p className="font-[family-name:var(--font-space-mono)] text-2xl font-bold text-hanami-700">
            {stats[0].value}
          </p>
          <p className="text-stone-500 text-xs uppercase tracking-wide">{stats[0].label}</p>
        </div>
      </div>
    </div>
  )
}

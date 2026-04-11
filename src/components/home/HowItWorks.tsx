/**
 * HowItWorks.tsx — Section "Comment ça marche"
 *
 * 4 étapes du processus Hanami, avec :
 * - Un numéro géant en Space Mono (très transparent, sert de décoration de fond)
 * - Un titre d'étape
 * - Une description courte
 *
 * Design : fond vert pâle (hanami-100), numéros en Space Mono transparents,
 * layout en grille 2x2 sur desktop, 1 colonne sur mobile.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

// Les 4 étapes du processus
const steps = [
  {
    number: '01',
    title: 'Vous nous contactez',
    body: 'Photos de votre gazon + surface approximative. Par WhatsApp ou formulaire. Pas de formulaire compliqué, pas de rendez-vous à prendre.',
  },
  {
    number: '02',
    title: 'Diagnostic personnalisé',
    body: 'Type de sol, exposition, problèmes identifiés. Pas de devis copié-collé. Chaque jardin est un cas unique — votre diagnostic l\'est aussi.',
  },
  {
    number: '03',
    title: 'Protocole sur mesure',
    body: 'Programme complet et daté : quoi, quand, quelle dose. Des instructions claires, sans jargon. Vous savez exactement quoi faire et dans quel ordre.',
  },
  {
    number: '04',
    title: 'Suivi et ajustements',
    body: 'On reste disponible toute l\'année. Le programme s\'adapte aux conditions — canicule, sécheresse, excès de pluie. Vous n\'êtes pas seul avec un PDF.',
  },
]

export default function HowItWorks() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-hanami-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-16">
          <span className="section-label mb-3 block">Processus</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            4 étapes vers un gazon qui fait parler les voisins
          </h2>
        </div>

        {/* Grille 2x2 desktop, 1 colonne mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * StepCard — Une étape individuelle du processus
 */
function StepCard({
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
      className="fade-in relative flex flex-col gap-4 pl-4"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Numéro géant en arrière-plan (décoratif, transparent) */}
      <span
        className="absolute -top-4 -left-2 font-[family-name:var(--font-space-mono)] font-bold text-7xl lg:text-8xl text-hanami-900 select-none pointer-events-none"
        style={{ opacity: 0.06 }}
        aria-hidden="true"
      >
        {number}
      </span>

      {/* Numéro lisible au-dessus du contenu */}
      <span className="font-[family-name:var(--font-space-mono)] text-hanami-500 text-sm font-bold">
        {number}
      </span>

      {/* Titre de l'étape */}
      <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone-500 leading-relaxed text-sm">
        {body}
      </p>
    </div>
  )
}

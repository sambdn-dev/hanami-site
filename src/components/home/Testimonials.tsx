/**
 * Testimonials.tsx — Section "Ils ont testé, voici leurs retours"
 *
 * 3 cartes de témoignages clients avec :
 * - Un grand guillemet décoratif en vert (simple SVG)
 * - La citation du client
 * - Le prénom et la région
 *
 * Design : fond légèrement différent du stone-50 (stone-100/50),
 * cartes blanches avec bordure fine. Pas de photos de profil.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

// Données des 3 témoignages
const testimonials = [
  {
    quote: 'Un paysagiste était venu il y a 2 ans, mais les résultats n\'ont pas duré. J\'avais peur de mal faire et de perdre encore du temps et de l\'argent. Le diagnostic a tout changé.',
    name: 'Luc',
    region: 'Nouvelle-Aquitaine',
  },
  {
    quote: 'Je ne savais pas par où commencer. Après l\'envoi de mes photos, j\'ai reçu toutes les étapes et les produits professionnels pour arriver à un résultat dont je suis fière, et mes enfants aussi.',
    name: 'Joséphine',
    region: 'Île-de-France',
  },
  {
    quote: 'Récent propriétaire, je n\'avais pas le budget pour un paysagiste. J\'ai trouvé une solution abordable et clé en main pour le faire moi-même.',
    name: 'Guy',
    region: 'Occitanie',
  },
]

export default function Testimonials() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-stone-100/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span className="section-label mb-3 block">Témoignages</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            Ils ont testé, voici leurs retours
          </h2>
        </div>

        {/* Grille de 3 cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * TestimonialCard — Une carte de témoignage individuelle
 */
function TestimonialCard({
  quote,
  name,
  region,
  index,
}: {
  quote: string
  name: string
  region: string
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in bg-white rounded-xl border border-stone-200 p-7 flex flex-col gap-4"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Grand guillemet décoratif en vert */}
      <svg
        viewBox="0 0 40 30"
        fill="none"
        className="w-10 h-7 shrink-0"
        aria-hidden="true"
      >
        {/* Guillemet ouvrant stylisé */}
        <path
          d="M0 18C0 12 4 6 12 0L15 4C10 8 8 12 8 15H16V30H0V18ZM22 18C22 12 26 6 34 0L37 4C32 8 30 12 30 15H38V30H22V18Z"
          fill="#4a8c3f"
          fillOpacity="0.25"
        />
      </svg>

      {/* Citation */}
      <p className="text-stone-700 leading-relaxed flex-1 text-sm lg:text-base">
        {quote}
      </p>

      {/* Auteur */}
      <div className="border-t border-stone-100 pt-4 flex items-center gap-3">
        {/* Avatar initiale */}
        <div className="w-8 h-8 rounded-full bg-hanami-100 flex items-center justify-center shrink-0">
          <span className="font-[family-name:var(--font-fraunces)] text-hanami-700 text-sm font-semibold">
            {name[0]}
          </span>
        </div>
        <div>
          <p className="font-semibold text-stone-800 text-sm">{name}</p>
          <p className="text-stone-500 text-xs">{region}</p>
        </div>
      </div>
    </div>
  )
}

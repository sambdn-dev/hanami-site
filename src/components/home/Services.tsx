/**
 * Services.tsx — Section "Ce que Hanami fait pour vous"
 *
 * 4 cartes sur fond vert très foncé (#1a2e1a = hanami-900).
 * Chaque carte présente un service avec une icône SVG, un titre,
 * une description et un tag prix.
 *
 * Sous la carte Coaching, on ajoute la ligne d'ancrage prix :
 * "Moins cher qu'un sac d'engrais jardinerie par mois."
 *
 * Design : fond hanami-900, cartes semi-transparentes blanc/10,
 * texte blanc, accent ambré pour les tags.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import { Target, RefreshCw, FlaskConical, Wrench } from 'lucide-react'

// Données des 4 services
const services = [
  {
    icon: Target,
    title: 'Coaching agronomique',
    description: 'Protocole personnalisé avec dates précises, suivi toute l\'année. Vous savez exactement quoi faire, quand et comment.',
    tag: 'À partir de 400€/an',
    priceAnchor: 'Moins cher qu\'un semis raté. Suivi illimité inclus. Vous deviendrez un(e) pro du gazon.',
  },
  {
    icon: RefreshCw,
    title: 'Rénovation complète',
    description: 'Scarification, amendement, semis professionnel, suivi post-rénovation. On s\'assure que ça prend du premier coup.',
    tag: 'Sur devis',
    priceAnchor: null,
  },
  {
    icon: FlaskConical,
    title: 'Produits professionnels',
    description: 'Engrais à libération contrôlée, semences pro, agents mouillants. Reconditionnés en format adapté à votre jardin.',
    tag: 'Reconditionnés pour votre jardin',
    priceAnchor: null,
  },
  {
    icon: Wrench,
    title: 'Interventions ponctuelles',
    description: 'Scarification, fertilisation, sur-semis, ou coup de boost effet showcase — un gazon présentable en 48h pour un événement ou une vente. Sans engagement.',
    tag: 'À la carte',
    priceAnchor: null,
  },
]

export default function Services() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-hanami-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête de section — texte blanc car fond sombre */}
        <div ref={headerRef} className="fade-in mb-14">
          <span
            className="section-label mb-3 block"
            style={{ color: '#4a8c3f' }} // hanami-500
          >
            Services
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-white max-w-xl leading-tight">
            Ce que Hanami fait pour vous
          </h2>
        </div>

        {/* Grille de 4 cartes : 2 colonnes sur tablette/desktop, 1 sur mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * ServiceCard — Une carte de service individuelle
 */
function ServiceCard({
  icon: Icon,
  title,
  description,
  tag,
  priceAnchor,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  tag: string
  priceAnchor: string | null
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icône dans un cercle semi-transparent */}
      <div className="w-10 h-10 rounded-lg bg-hanami-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-hanami-500" strokeWidth={1.5} />
      </div>

      {/* Titre du service */}
      <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone-300 text-sm leading-relaxed flex-1">
        {description}
      </p>

      {/* Tag prix en Space Mono — couleur ambrée */}
      <span
        className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full self-start"
        style={{ color: '#d4a853', backgroundColor: 'rgba(212,168,83,0.15)' }}
      >
        {tag}
      </span>

      {/* Ligne d'ancrage prix (uniquement pour le coaching) */}
      {priceAnchor && (
        <p className="text-stone-400 text-xs leading-relaxed italic border-t border-white/10 pt-3 mt-1">
          {priceAnchor}
        </p>
      )}
    </div>
  )
}

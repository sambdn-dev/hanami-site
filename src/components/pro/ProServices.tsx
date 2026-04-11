/**
 * ProServices.tsx — Section services pour professionnels
 *
 * 4 cartes sur fond vert très foncé (hanami-900), texte blanc.
 * Même design que Services particuliers : icônes Lucide, tags ambrés.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import { FlaskConical, Ruler, CloudSun, Handshake } from 'lucide-react'

const services = [
  {
    icon: FlaskConical,
    title: 'Consulting chantier',
    description: 'Diagnostic terrain, protocole précis : quel produit, quelle dose, quelle méthode, quel timing. On vous dit exactement quoi faire avant de poser la première graine.',
    tag: 'Ponctuel ou récurrent',
  },
  {
    icon: Ruler,
    title: 'Dosage et mesure',
    description: 'Surfaces mesurées, dosages exacts par zone. Pas de surplus, pas de sous-dosage. Économies directes sur le produit, résultats supérieurs.',
    tag: 'Prestation ponctuelle',
  },
  {
    icon: CloudSun,
    title: 'Suivi toutes saisons',
    description: 'Conseils calés sur la météo agricole jour par jour de chaque chantier. Canicule, gel, excès d\'eau — on anticipe. Vous libérez votre charge mentale.',
    tag: 'Abonnement annuel',
  },
  {
    icon: Handshake,
    title: 'Sous-traitance expertise',
    description: 'Sous-traitez diagnostic et protocole. Gardez la relation client, montez en qualité perçue. On ne tond pas, on ne taille pas. On prescrit.',
    tag: 'Convention partenariat',
  },
]

export default function ProServices() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-hanami-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span
            className="section-label mb-3 block"
            style={{ color: '#4a8c3f' }}
          >
            Services
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-white max-w-xl leading-tight">
            Ce que Hanami fait pour vous
          </h2>
        </div>

        {/* Grille 4 cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  tag,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  tag: string
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-hanami-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-hanami-500" strokeWidth={1.5} />
      </div>

      <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white leading-snug">
        {title}
      </h3>

      <p className="text-stone-300 text-sm leading-relaxed flex-1">
        {description}
      </p>

      <span
        className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full self-start"
        style={{ color: '#d4a853', backgroundColor: 'rgba(212,168,83,0.15)' }}
      >
        {tag}
      </span>
    </div>
  )
}

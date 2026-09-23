import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SoftwareHeroPreview from '@/components/pro/SoftwareHeroPreview'

export default function ProHero2026() {
  return (
    <section className="border-b border-brand-forest/15 bg-brand-cream pb-20 pt-36 text-brand-forest lg:pb-28 lg:pt-44">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest/70">
            Hanami Pro · Paysagistes &amp; espaces verts
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[clamp(2.9rem,5.5vw,5.4rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Votre métier mérite des outils à sa hauteur.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-brand-forest/75">
            Des journées de terrain aux échanges clients, votre activité ne tient pas dans six applications séparées.
            Hanami Pro réunit l’expertise gazon d’aujourd’hui et prépare les outils métier de demain.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pro/logiciel"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-brand-forest px-6 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-forest-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
            >
              Découvrir le logiciel Hanami Pro <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-brand-forest/25 px-6 text-sm font-semibold transition-colors hover:bg-brand-sage/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
            >
              Parler de mon activité
            </Link>
          </div>
          <p className="mt-5 text-sm text-brand-forest/65">
            Prototype en développement · Studio, le module 2D/3D de Hanami Pro.
          </p>
        </div>

        <SoftwareHeroPreview />
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import SoftwareDemoScreens from '@/components/pro/SoftwareDemoScreens'

export const metadata: Metadata = {
  title: { absolute: 'Hanami Pro — Logiciel paysagiste et Studio 2D/3D' },
  description:
    'Prototype Hanami Pro en développement : planning, dossier chantier avec photos et module Hanami Studio 2D/3D. Demandez une démonstration accompagnée.',
  alternates: { canonical: '/pro/logiciel' },
}

const v1 = [
  {
    number: '01',
    title: 'Planning',
    description: 'Organiser les passages, retrouver les échéances et voir les équipes affectées aux chantiers.',
  },
  {
    number: '02',
    title: 'Dossier chantier',
    description: 'Rassembler les informations du client, les visites, les notes et les photos dans le même dossier.',
  },
  {
    number: '03',
    title: 'Hanami Studio 2D/3D',
    description: 'Esquisser un projet de jardin dans le module Studio, depuis le contexte du chantier.',
  },
] as const

export default function SoftwarePage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="dark" />

      <main className="flex-1">
        <section className="bg-brand-forest pb-24 pt-40 text-brand-cream lg:pb-32 lg:pt-48">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="mb-7 text-xs font-semibold uppercase tracking-[0.22em] text-brand-sage">Hanami Pro · Logiciel paysagiste · Prototype en développement</p>
            <h1 className="max-w-5xl font-[family-name:var(--font-fraunces)] text-[clamp(3rem,7vw,7rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              Votre activité, sans perte de contexte.
            </h1>
            <div className="mt-10 grid gap-8 border-t border-brand-cream/25 pt-8 lg:grid-cols-[1fr_0.45fr]">
              <p className="max-w-2xl text-lg leading-relaxed text-brand-cream/80">
                Planning, dossier chantier et Hanami Studio réunis dans le même espace. Le module Studio permet de travailler le projet en 2D et en 3D sans perdre le contexte du chantier.
              </p>
              <Link href="#contact" className="inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-md bg-brand-cream px-6 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream">
                Demander une démonstration <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-brand-cream py-20 text-brand-forest lg:py-28" aria-labelledby="studio-v1-title">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest/65">Parcours du prototype</p>
              <h2 id="studio-v1-title" className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight sm:text-5xl">Un même chantier, trois étapes.</h2>
              <p className="mt-5 leading-relaxed text-brand-forest/70">Une démonstration accompagnée permet de voir ce qui fonctionne aujourd’hui et ce qui reste en développement.</p>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-sm border border-brand-forest/15 bg-brand-forest/15 lg:grid-cols-3">
              {v1.map((item) => (
                <li key={item.number} className="bg-brand-cream p-8 lg:p-10">
                  <span className="font-[family-name:var(--font-space-mono)] text-xs text-brand-forest/55">{item.number}</span>
                  <h3 className="mt-8 font-[family-name:var(--font-fraunces)] text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-forest/70">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <SoftwareDemoScreens />

        <section className="border-y border-brand-forest/15 bg-white/70 py-20 text-brand-forest lg:py-24" aria-labelledby="studio-next-title">
          <div className="mx-auto grid max-w-7xl gap-9 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest/65">Après la V1</p>
              <h2 id="studio-next-title" className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight tracking-tight sm:text-5xl">La suite se décide avec vous.</h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-brand-forest/75">
              <p>CRM, rendez-vous, devis et automatisations font partie de la direction produit, mais ne sont pas présentés ici comme des fonctions prêtes à l’emploi. La synchronisation entre appareils et l’accès autonome en ligne ne sont pas encore proposés.</p>
              <p>Hanami Studio est un module de Hanami Pro, pas un logiciel distinct. L’expertise gazon actuelle — diagnostic, protocoles et dosages — reste accessible via Hanami Pro.</p>
              <Link href="/pro" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-forest underline underline-offset-4 hover:no-underline">Découvrir Hanami Pro <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </div>
        </section>

        <ContactForm
          variant="pro"
          source="hanami-pro-saas"
          photosEnabled={false}
          title="Demandez une démonstration accompagnée"
          subtitle="Décrivez votre activité. Nous vous recontacterons pour vous montrer le prototype et recueillir votre avis, sans engagement."
        />
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA href="/pro/logiciel#contact" label="Demander une démonstration" reassurance="Prototype · En développement" />
    </>
  )
}

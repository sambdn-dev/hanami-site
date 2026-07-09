/**
 * page.tsx — Visualiseur IA (route /visualiseur)
 *
 * Outil de conversion : le visiteur upload une photo de sa pelouse et
 * découvre son potentiel transformé par IA (slider avant/après). La 1ʳᵉ
 * transformation est offerte ; l'email est capturé pour aller plus loin.
 *
 * Coquille identique aux autres landings (SeasonalBanner + Navbar + main +
 * Footer + WhatsAppButton). Seule l'île interactive est cliente.
 */

import type { Metadata } from 'next'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import VisualizerOrchestrator from '@/components/visualiseur/VisualizerOrchestrator'

export const metadata: Metadata = {
  title: 'Visualiseur IA — Découvrez votre pelouse transformée',
  description:
    "Uploadez une photo de votre pelouse et visualisez son potentiel grâce à l'IA. " +
    'Un aperçu avant/après en quelques secondes, gratuit.',
  openGraph: {
    title: 'Visualiseur IA Hanami — votre pelouse transformée',
    description:
      "Photo de votre gazon → aperçu de son potentiel par l'IA. Gratuit, en quelques secondes.",
  },
}

export default function VisualiseurPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />

      <main className="flex-1 bg-stone-50">
        {/* Hero */}
        <section className="pt-36 pb-10 lg:pt-44 lg:pb-14">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label mb-4 block">
              Visualiseur IA · Gratuit · Sans inscription
            </span>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-hanami-900 mb-5">
              Votre pelouse, version rêvée.
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed max-w-xl mx-auto">
              Prenez une photo de votre gazon actuel, laissez l&apos;IA en révéler
              le potentiel. Un aperçu avant/après en quelques secondes.
            </p>
          </div>
        </section>

        {/* Outil interactif */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <VisualizerOrchestrator />
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}

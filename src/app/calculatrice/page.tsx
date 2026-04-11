import type { Metadata } from 'next'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import HanamiCalculator from '@/components/calculatrice/HanamiCalculator'

export const metadata: Metadata = {
  title: 'Dosage Intelligent',
  description:
    'Calculez précisément vos dosages d\'engrais, semences et produits liquides selon la surface de votre jardin. Outil gratuit Hanami.',
}

export default function CalculatricePage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />
      <main className="flex-1 pt-24">
        <HanamiCalculator />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

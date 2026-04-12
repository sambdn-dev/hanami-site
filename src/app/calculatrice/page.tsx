import type { Metadata } from 'next'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import MobileAppBar from '@/components/shared/MobileAppBar'
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
      {/* Sur mobile : barre app minimale (logo + retour).
          Sur desktop : navbar + bandeau saisonnier habituels. */}
      <MobileAppBar />
      <div className="hidden sm:block">
        <SeasonalBanner />
        <Navbar variant="light" />
      </div>

      {/* pt-14 = 56px (hauteur MobileAppBar) sur mobile
          pt-24 = 96px (navbar 64px + banner 40px) sur desktop */}
      <main className="flex-1 pt-14 sm:pt-24">
        <HanamiCalculator />
      </main>

      <div className="hidden sm:block">
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  )
}

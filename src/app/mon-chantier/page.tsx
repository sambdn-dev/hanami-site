/**
 * page.tsx — Route /mon-chantier (wizard de simulation/estimation)
 *
 * Wizard 7 étapes pour qualifier un projet visiteur et générer une estimation
 * tarifaire instantanée. Le résultat est envoyé par email à Sami (Resend) avec
 * les photos en pièces jointes, et le visiteur reçoit un récap.
 *
 * Layout : pas de Footer ici (le wizard occupe toute la fenêtre, le panneau
 * gauche fait office de "scaffold"). Mobile : MobileAppBar minimale.
 */

import type { Metadata } from 'next'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import MobileAppBar from '@/components/shared/MobileAppBar'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import ChantierWizard from '@/components/mon-chantier/ChantierWizard'

export const metadata: Metadata = {
  title: 'Mon chantier — Estimation gratuite en 2 minutes',
  description:
    'Décrivez votre gazon en 7 étapes et recevez une estimation chiffrée TTC adaptée à votre projet : Express, Reconstruction ou Coaching annuel.',
}

export default function MonChantierPage() {
  return (
    <>
      {/* Mobile : barre app minimale ; Desktop : navbar + bandeau */}
      <MobileAppBar />
      <div className="hidden sm:block">
        <SeasonalBanner />
        <Navbar variant="light" />
      </div>

      {/* Le wizard inclut son propre layout 2 colonnes ; on lui donne juste
          le bon padding-top en fonction de la nav */}
      <main className="flex-1 pt-14 sm:pt-24">
        <ChantierWizard />
      </main>

      <WhatsAppButton />
    </>
  )
}

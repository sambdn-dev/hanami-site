/**
 * page.tsx — Page Professionnels (/pro)
 *
 * Destinée aux paysagistes et entrepreneurs en espaces verts.
 * Le logiciel et ses aperçus précèdent les besoins métier.
 * L’expertise gazon et son appel Calendly restent disponibles plus bas.
 * Studio appartient à Hanami Pro ; la page détaillée est /pro/logiciel.
 */

import type { Metadata } from 'next'

// Composants partagés
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'

// Composants spécifiques à la page Pro
import ProHero2026 from '@/components/pro/ProHero2026'
import ProStudioModules from '@/components/pro/ProStudioModules'
import SoftwareDemoScreens from '@/components/pro/SoftwareDemoScreens'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'

export const metadata: Metadata = {
  // `absolute` : le nom commercial "Hanami Pro" contient déjà la marque,
  // on court-circuite le template '%s | Hanami' du layout (sinon doublon)
  title: { absolute: 'Hanami Pro — Outils métier pour paysagistes' },
  description:
    'Hanami Pro prépare des outils métier pour paysagistes : planning, équipes, interventions, rendez-vous, CRM et devis. Découvrez Hanami Studio.',
  openGraph: {
    title: 'Hanami Pro — Outils métier pour paysagistes',
    description:
      'Une vision claire des outils métier pour les paysagistes, avec l’expertise terrain Hanami.',
  },
}

export default function ProPage() {
  return (
    <>
      {/* Bandeau saisonnier */}
      <SeasonalBanner />

      <Navbar variant="light" />

      <main className="flex-1 bg-brand-cream">

        <ProHero2026 />
        <SoftwareDemoScreens showDetailsLink />
        <ProStudioModules />
        <ContactForm
          variant="pro"
          source="hanami-pro-outils-metier"
          title="Construisons des outils utiles sur le terrain"
          subtitle="Parlez-nous de votre activité et des tâches qui vous prennent le plus de temps. Nous vous répondrons personnellement."
        />

      </main>

      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA
        href="/pro/logiciel"
        label="Découvrir le logiciel Hanami Pro"
        reassurance="Prototype · Démonstration accompagnée"
      />
    </>
  )
}

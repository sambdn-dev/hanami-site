import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import ProLanding from '@/components/pro/ProLanding'

export const metadata: Metadata = {
  title: { absolute: 'Hanami Pro — Expertise gazon et organisation pour paysagistes' },
  description: 'Accompagnement technique gazon pour paysagistes : semences, produits, doses et suivi des interventions. Découvrez aussi le prototype du logiciel métier Hanami Pro.',
  alternates: { canonical: '/pro' },
  openGraph: { title: 'Hanami Pro — Des chantiers maîtrisés, des clients rassurés', description: 'Expertise gazon, préparation des interventions et prototype d’un outil métier pour paysagistes.' },
}

export default function ProPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="dark" />
      <main className="flex-1">
        <ProLanding />
        <ContactForm variant="pro" source="hanami-pro" photosEnabled={false}
          title="Parlons de vos chantiers et de votre organisation."
          subtitle="Décrivez votre besoin gazon, votre équipe ou vos contrats. Nous vous recontacterons pour un échange technique ou une démonstration du prototype, selon votre besoin." />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA href="/pro#contact" label="Parlons de votre chantier" reassurance="Expertise gazon · Logiciel en développement" />
    </>
  )
}

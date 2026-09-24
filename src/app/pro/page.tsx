import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import ProLanding from '@/components/pro/ProLanding'

export const metadata: Metadata = {
  title: { absolute: 'Hanami Pro — Organisation et expertise gazon pour paysagistes' },
  description: 'Hanami Pro : vision d’un outil métier pour paysagistes, réunissant planning, contrats d’entretien, équipes, dossiers clients et assistance gazon directe.',
  alternates: { canonical: '/pro' },
  openGraph: { title: 'Hanami Pro — L’activité paysagiste, au même endroit', description: 'Planning, équipes, clients et expertise gazon dans une même vision.' },
}

export default function ProPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="dark" />
      <main className="flex-1">
        <ProLanding />
        <ContactForm variant="pro" source="hanami-pro" photosEnabled={false}
          title="Voyons ce que Hanami Pro peut simplifier chez vous."
          subtitle="Présentez-nous votre équipe, vos contrats et votre façon d’organiser les tournées. Nous vous recontacterons pour une démonstration du prototype et un échange sur vos besoins." />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA href="/pro#contact" label="Demander une démo" reassurance="Prototype · Démo accompagnée" />
    </>
  )
}

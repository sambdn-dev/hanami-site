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
          title="Parlons de votre façon de travailler."
          subtitle="Racontez-nous votre organisation et vos chantiers gazon. Nous vous recontacterons pour vous présenter la vision Hanami Pro et écouter vos besoins." />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA href="/pro#contact" label="Parler de Hanami Pro" reassurance="Vision produit · Démo accompagnée" />
    </>
  )
}

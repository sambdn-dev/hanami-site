import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import ContactForm from '@/components/shared/ContactForm'
import MobileStickyCTA from '@/components/home/MobileStickyCTA'
import StudioLanding from '@/components/pro/StudioLanding'

export const metadata: Metadata = {
  title: { absolute: 'Hanami Studio Pro — Du jardin réel au projet visualisé' },
  description: 'La vision Hanami Studio Pro : photos du jardin, consignes du paysagiste, proposition photoréaliste puis vue 3D après validation.',
  alternates: { canonical: '/pro/studio' },
  openGraph: { title: 'Hanami Studio Pro — Montrez le jardin de demain', description: 'Une vision créative pour paysagistes : photo, consignes, image photoréaliste puis 3D.' },
}

export default function StudioProPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />
      <main className="flex-1">
        <StudioLanding />
        <ContactForm variant="pro" source="hanami-studio-pro" photosEnabled={true}
          title="Imaginons la suite de Studio."
          subtitle="Décrivez vos projets et, si vous le souhaitez, ajoutez quelques photos. Nous vous recontacterons pour échanger sur le parcours imaginé." />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA href="/pro/studio#contact" label="Parler de Studio Pro" reassurance="Vision produit · Aperçus conceptuels" />
    </>
  )
}

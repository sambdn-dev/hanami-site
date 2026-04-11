import type { Metadata } from 'next'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import PourquoiHanami from '@/components/pourquoi-hanami/PourquoiHanami'

export const metadata: Metadata = {
  title: 'Pourquoi Hanami ?',
  description:
    '5 ans de passion, de terrain et de formation auprès des plus grands agronomes. L\'histoire derrière Hanami et pourquoi je me suis obsédé par le gazon parfait.',
}

export default function PourquoiHanamiPage() {
  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />
      <main className="flex-1 pt-24">
        <PourquoiHanami />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import SeasonalBanner from '@/components/shared/SeasonalBanner'
import LawnSimulator from '@/components/simulator/LawnSimulator'
import styles from '@/components/simulator/Simulator.module.css'

export const metadata: Metadata = {
  title: 'Visualisez votre pelouse avec Hanami',
  description: 'Une projection indicative de votre jardin à partir de votre photo, en conservant les éléments qui l’entourent.',
  robots: { index: false, follow: false },
}

export default function LawnSimulatorPage() {
  if (process.env.HANAMI_LAWN_SIMULATOR_ENABLED !== '1') notFound()
  return <>
    <SeasonalBanner />
    <Navbar variant="light" localOffers />
    <main id="contenu" className={styles.page}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>LE GAZON, SOUS UN NOUVEAU JOUR</span>
          <h1>Votre jardin.<br />Une pelouse à imaginer.</h1>
          <p>Importez une photo, indiquez les contours de votre pelouse et découvrez une projection avec un gazon plus dense. Le point de départ d’un projet à construire pour votre terrain.</p>
          <p className={styles.introNote}>Aucun compte à créer. Vos photos restent privées ; vous choisissez ensuite de les transmettre à Hanami pour un diagnostic ou un devis.</p>
        </header>
        <LawnSimulator />
      </div>
    </main>
    <Footer localOffers />
  </>
}

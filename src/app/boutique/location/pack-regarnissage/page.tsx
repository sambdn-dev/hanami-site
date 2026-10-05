import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, SlidersHorizontal, Sprout } from 'lucide-react'
import { RENTAL_PACK, getRentalProduct } from '@/lib/rentals'
import { RentalPackGallery } from '@/components/rental/RentalPhoto'
import RentalBooking from '@/components/rental/RentalBooking'
import styles from '@/components/rental/Rental.module.css'

export const metadata: Metadata = {
  title: 'Pack regarnissage modulable — Location Hanami',
  description: 'Composez votre pack de location : Landzie Overseeding Tool, un épandeur au choix et des outils complémentaires selon l’état de votre gazon.',
}

export default function RentalPackPage() {
  return <main className={styles.detailPage}>
    <Link className={styles.backLink} href="/boutique/location"><ArrowLeft size={16} aria-hidden="true" /> Tous les équipements</Link>
    <div className={styles.detailGrid}>
      <div className={styles.detailIntro}>
        <p className={styles.eyebrow}>LOCATION / PACK MODULABLE</p>
        <h1>Pack regarnissage.<br /><em>À votre mesure.</em></h1>
        <p className={styles.detailSummary}>{RENTAL_PACK.summary}</p>
        <p className={styles.description}>{RENTAL_PACK.description}</p>
        <a className={styles.jumpLink} href="#reservation">Composer mon pack <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <figure className={styles.detailVisual}>
        <RentalPackGallery />
        <figcaption>Photos des modèles constructeur. La composition dépend des options choisies.</figcaption>
      </figure>
      <div id="reservation" className={styles.bookingPlacement}><RentalBooking pack /></div>
      <div className={styles.detailFeatures}>
        <section aria-labelledby="pack-content-title"><p className={styles.eyebrow}>LE BON OUTIL AU BON ENDROIT</p><h2 id="pack-content-title">Votre jardin donne le rythme.</h2><div className={styles.packContents}>
          <div><span>01 / LA BASE</span><h3>Préparer le contact graines / sol</h3><p>{RENTAL_PACK.requiredIds.map(id => getRentalProduct(id)?.name).filter(Boolean).join(', ')}.</p></div>
          <div><span>02 / AU CHOIX</span><h3>Répartir les semences</h3><p>{RENTAL_PACK.spreaderIds.map(id => getRentalProduct(id)?.name).filter(Boolean).join(' ou ')}. Un seul épandeur suffit dans le pack.</p></div>
          <div><span>03 / SI NÉCESSAIRE</span><h3>Compléter la préparation</h3><p>Landzie Compost Spreader pour répartir un matériau de couverture adapté ; scarificateur Ryobi si l’état du gazon le justifie. La scarification n’est pas systématique.</p></div>
        </div></section>
        <section className={styles.packBenefits} aria-labelledby="pack-benefits-title"><h2 id="pack-benefits-title"><SlidersHorizontal size={20} strokeWidth={1.5} aria-hidden="true" /> Un pack qui s’adapte</h2><ul className={styles.benefitList}>{RENTAL_PACK.benefits.map(benefit => <li key={benefit}><Check size={17} aria-hidden="true" /><span>{benefit}</span></li>)}</ul></section>
        <div className={styles.adviceNote}><Sprout size={21} strokeWidth={1.5} aria-hidden="true" /><p>La location concerne le matériel. Semences, engrais et terreau ne sont pas inclus ; leur choix peut être conseillé séparément selon votre jardin.</p></div>
      </div>
    </div>
  </main>
}

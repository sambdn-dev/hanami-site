import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Check, SlidersHorizontal, Sprout } from 'lucide-react'
import { RENTAL_DURATIONS, RENTAL_PRODUCTS } from '@/lib/rentals'
import RentalIllustration from './RentalIllustration'
import styles from './Rental.module.css'

function formatPrice(cents: number | null) {
  return cents === null ? 'À renseigner' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export default function RentalCatalog() {
  return <main className={styles.rentalPage}>
    <section className={styles.catalogHero} aria-labelledby="rental-title">
      <div>
        <p className={styles.eyebrow}>HANAMI / LOCATION</p>
        <h1 id="rental-title">Le bon outil.<br /><em>Le bon moment.</em></h1>
        <p>Du matériel choisi pour prendre soin de votre gazon, le temps d’une intervention. Et le conseil Hanami pour bien l’utiliser.</p>
      </div>
      <div className={styles.heroAside}>
        <CalendarDays size={27} strokeWidth={1.25} aria-hidden="true" />
        <span>À votre rythme</span>
        <div className={styles.durationPills}>{RENTAL_DURATIONS.map(duration => <span key={duration.id}>{duration.label}</span>)}</div>
        <p>Choisissez vos dates.<br />Hanami confirme le matériel et le tarif.</p>
      </div>
    </section>
    <section className={styles.catalogSection} aria-labelledby="equipment-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>LA SÉLECTION HANAMI</p><h2 id="equipment-title">L’essentiel, selon votre besoin.</h2></div><p>Cinq outils · un pack modulable</p></div>
      <div className={styles.productGrid}>
        {RENTAL_PRODUCTS.map(product => <article key={product.id} className={styles.productCard}>
          <Link className={styles.cardVisual} href={`/boutique/location/${product.slug}`} tabIndex={-1} aria-hidden="true"><RentalIllustration variant={product.illustration} compact /></Link>
          <div className={styles.cardContent}>
            <p className={styles.brand}>{product.brand}</p>
            <h3><Link href={`/boutique/location/${product.slug}`}>{product.name}</Link></h3>
            <p className={styles.cardSummary}>{product.summary}</p>
            <dl className={styles.cardRates}>{RENTAL_DURATIONS.map(duration => <div key={duration.id}><dt>{duration.label}</dt><dd>{formatPrice(product.ratesTtcCents[duration.id])}{product.ratesTtcCents[duration.id] !== null ? ' TTC' : ''}</dd></div>)}</dl>
            <p className={styles.availabilityNote}>Disponibilité à vérifier pour vos dates.</p>
            <Link className={styles.primaryButton} href={`/boutique/location/${product.slug}#reservation`}>Choisir mes dates <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </article>)}
        <article className={styles.packCard}>
          <div className={styles.packCardHeading}><SlidersHorizontal size={25} strokeWidth={1.25} aria-hidden="true" /><span>COMPOSEZ VOTRE PACK</span></div>
          <h3>Un regarnissage.<br /><em>À votre mesure.</em></h3>
          <p>La bonne combinaison d’outils, sans ajouter ce dont votre jardin n’a pas besoin.</p>
          <ul><li><Check size={16} aria-hidden="true" />Landzie Overseeding Tool</li><li><Check size={16} aria-hidden="true" />Un épandeur au choix</li><li><Check size={16} aria-hidden="true" />Deux outils complémentaires en option</li></ul>
          <Link className={styles.lightButton} href="/boutique/location/pack-regarnissage">Composer mon pack <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <span className={styles.packCardNote}>24 h · 48 h · week-end — tarifs à renseigner</span>
        </article>
      </div>
      <p className={styles.catalogNote}>Les visuels sont des illustrations d’usage. Les photos, les références exactes des équipements Ryobi et Gardena, les tarifs et le planning seront renseignés avant l’ouverture des réservations confirmées.</p>
    </section>
    <section className={styles.howSection} aria-labelledby="how-title">
      <div className={styles.howHeading}><Sprout size={27} strokeWidth={1.25} aria-hidden="true" /><h2 id="how-title">Simple du début<br /><em>à la remise du matériel.</em></h2></div>
      <ol className={styles.howSteps}>
        <li><span>01</span><div><h3>Le bon équipement</h3><p>Un outil seul ou un pack adapté à votre intervention.</p></div></li>
        <li><span>02</span><div><h3>Vos dates, votre formule</h3><p>24 h, 48 h ou un week-end, avec un retour clairement indiqué.</p></div></li>
        <li><span>03</span><div><h3>La confirmation Hanami</h3><p>Matériel, tarif et modalités de remise validés avant toute réservation ferme.</p></div></li>
      </ol>
    </section>
  </main>
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, PackageCheck, Sprout } from 'lucide-react'
import { getRentalProduct, RENTAL_PRODUCTS } from '@/lib/rentals'
import RentalIllustration from '@/components/rental/RentalIllustration'
import RentalBooking from '@/components/rental/RentalBooking'
import styles from '@/components/rental/Rental.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return RENTAL_PRODUCTS.map(product => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getRentalProduct(slug)
  if (!product) return { title: 'Matériel introuvable — Hanami' }
  return { title: `${product.name} en location — Hanami`, description: product.summary }
}

export default async function RentalProductPage({ params }: Props) {
  const { slug } = await params
  const product = getRentalProduct(slug)
  if (!product) notFound()

  return <main className={styles.detailPage}>
    <Link className={styles.backLink} href="/boutique/location"><ArrowLeft size={16} aria-hidden="true" /> Tous les équipements</Link>
    <div className={styles.detailGrid}>
      <div className={styles.detailIntro}>
        <p className={styles.eyebrow}>LOCATION / {product.brand}</p>
        <h1>{product.name}</h1>
        <p className={styles.detailSummary}>{product.summary}</p>
        <p className={styles.description}>{product.description}</p>
        <a className={styles.jumpLink} href="#reservation">Choisir mes dates <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <figure className={styles.detailVisual}>
        <RentalIllustration variant={product.illustration} />
        <figcaption>Illustration d’usage. Photo du matériel à ajouter avant ouverture.</figcaption>
      </figure>
      <div id="reservation" className={styles.bookingPlacement}><RentalBooking productId={product.id} /></div>
      <div className={styles.detailFeatures}>
        <section aria-labelledby="benefits-title"><p className={styles.eyebrow}>POUR VOTRE GAZON</p><h2 id="benefits-title">Un outil, quatre atouts.</h2><ul className={styles.benefitList}>{product.benefits.map(benefit => <li key={benefit}><Check size={17} aria-hidden="true" /><span>{benefit}</span></li>)}</ul></section>
        <section className={styles.inclusions} aria-labelledby="included-title"><h2 id="included-title"><PackageCheck size={20} strokeWidth={1.5} aria-hidden="true" /> Ce qui est inclus</h2><ul>{product.included.map(item => <li key={item}>{item}</li>)}</ul></section>
        <div className={styles.adviceNote}><Sprout size={21} strokeWidth={1.5} aria-hidden="true" /><p>Vous hésitez sur le matériel ? Décrivez votre surface et l’état du gazon dans votre demande. Hanami vous aide à choisir ce qui est utile.</p></div>
      </div>
    </div>
    <div className={styles.detailBottomLink}><p>Plusieurs besoins pour un même jardin ?</p><Link href="/boutique/location/pack-regarnissage">Découvrir le pack regarnissage <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </main>
}

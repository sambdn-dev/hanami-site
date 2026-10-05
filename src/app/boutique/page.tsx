import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Leaf, MessageCircle, PackageCheck } from 'lucide-react'
import { SHOP_PRODUCTS, formatShopPrice } from '@/lib/shop-catalog'
import SeedIllustration from '@/components/shop/SeedIllustration'
import ShopFulfillmentNotice from '@/components/shop/ShopFulfillmentNotice'
import styles from '@/components/shop/Shop.module.css'

export const metadata: Metadata = {
  title: 'La boutique Hanami — Sélection professionnelle pour votre gazon',
  description: 'Semences professionnelles Barenbrug et conseil Hanami. Livraison locale : 15 € TTC. Retrait : 4 € TTC. Prix et formats des produits à confirmer.',
}

export default function ShopPage() {
  return <main>
    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>LA BOUTIQUE HANAMI</p><h1>Le bon gazon commence<br />par les <em>bonnes graines.</em></h1><p className={styles.heroCopy}>Une sélection professionnelle, choisie avec soin.<br />Et mes conseils pour en tirer le meilleur, chez vous.</p><a className={styles.primaryButton} href="#selection">Explorer la sélection <ArrowUpRight size={18} aria-hidden="true" /></a><p className={styles.heroNote}><Link href="/boutique/location">Besoin d’un outil ? Découvrir la location <ArrowUpRight size={15} aria-hidden="true" /></Link></p></div>
      <div className={styles.heroArt}><SeedIllustration variant="resilience" /><div className={styles.heroSeal}>LE CONSEIL<br /><em>avec le produit</em></div></div>
    </section>
    <div className={styles.promiseStrip}><span><Leaf size={19} aria-hidden="true" /> Semences professionnelles</span><span><MessageCircle size={19} aria-hidden="true" /> Un conseil adapté à votre jardin</span><span><PackageCheck size={19} aria-hidden="true" /> Livraison locale ou retrait</span></div>
    <section id="selection" className={styles.catalog} aria-labelledby="catalog-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SÉLECTION / SEMENCES</p><h2 id="catalog-title">Choisir selon votre jardin.</h2></div><p>De l’ombre aux jardins plus sollicités,<br />chaque mélange répond à un besoin.</p></div>
      <div className={styles.productGrid}>{SHOP_PRODUCTS.map(product => <article key={product.id} className={styles.productCard}>
        <Link href={`/boutique/${product.slug}`} tabIndex={-1} aria-hidden="true"><SeedIllustration variant={product.illustration} compact /></Link>
        <div className={styles.cardContent}><div className={styles.brandLine}><Image src="/brand/partners/barenbrug.svg" alt="Barenbrug" width={123} height={14} /><span>SEMENCES PROFESSIONNELLES</span></div><p className={styles.eyebrow}>{product.eyebrow}</p><h3><Link href={`/boutique/${product.slug}`}>{product.name}</Link></h3><p>{product.tagline}</p><div className={styles.cardBottom}><div><strong>{formatShopPrice(product.formats[0].priceTtcCents)}</strong><span>Conditionnement à confirmer</span></div><Link href={`/boutique/${product.slug}`} aria-label={`Découvrir Barenbrug ${product.name}`}><ArrowUpRight size={22} aria-hidden="true" /></Link></div></div>
      </article>)}</div>
      <p className={styles.catalogNote}>La boutique se prépare. Vous pouvez composer une sélection et demander un tarif. Aucune commande ni aucun paiement n’est effectué ici.</p>
      <ShopFulfillmentNotice />
    </section>
    <section className={styles.adviceBand}><div><p className={styles.eyebrow}>LE CONSEIL HANAMI</p><h2>Pas sûr du mélange ?<br /><em>Parlons de votre gazon.</em></h2></div><div><p>Exposition, surface, sol, usage : je vous aide à choisir une référence et une quantité cohérentes avec votre jardin.</p><Link href="/boutique/selection" className={styles.lightButton}>Demander conseil <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
  </main>
}

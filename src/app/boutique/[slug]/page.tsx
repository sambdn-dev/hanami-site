import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, MessageCircle } from 'lucide-react'
import { getShopProduct, SHOP_PRODUCTS, formatShopPrice } from '@/lib/shop-catalog'
import SeedIllustration from '@/components/shop/SeedIllustration'
import AddToSelection from '@/components/shop/AddToSelection'
import styles from '@/components/shop/Shop.module.css'

export function generateStaticParams() { return SHOP_PRODUCTS.map(product => ({ slug: product.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getShopProduct((await params).slug)
  return { title: product ? `Barenbrug ${product.name} — Boutique Hanami` : 'Produit introuvable', description: product?.description }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getShopProduct((await params).slug)
  if (!product) notFound()
  return <main className={styles.productPage}>
    <Link href="/boutique" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Toute la sélection</Link>
    <div className={styles.productDetail}><div className={styles.productVisual}><SeedIllustration variant={product.illustration} /><p>Illustration botanique · ne représente pas le conditionnement du produit.</p></div>
      <div className={styles.productInfo}><Image src="/brand/partners/barenbrug.svg" alt="Barenbrug" width={148} height={17} /><p className={styles.eyebrow}>{product.eyebrow}</p><h1>{product.name}</h1><p className={styles.productTagline}>{product.tagline}</p><p className={styles.productDescription}>{product.description}</p><ul className={styles.needs}>{product.needs.map(need => <li key={need}><Check size={16} aria-hidden="true" />{need}</li>)}</ul><div className={styles.productPrice}><strong>{formatShopPrice(product.formats[0].priceTtcCents)}</strong><span>Tarif de vente TTC et format en préparation</span></div><AddToSelection product={product} /></div>
    </div>
    <aside className={styles.productAdvice}><MessageCircle size={26} aria-hidden="true" /><div><p className={styles.eyebrow}>MON CONSEIL</p><h2>Le mélange compte. Le contexte aussi.</h2><p>{product.advice}</p></div><span>Sami<br /><em>Hanami</em></span></aside>
    <section className={styles.productPractical} aria-labelledby="practical-title"><h2 id="practical-title">Avant de confirmer votre achat.</h2><div><p><strong>Le bon format</strong>Nous confirmons le poids et le conditionnement correspondant à votre besoin.</p><p><strong>La disponibilité</strong>Le stock et le délai sont vérifiés pour chaque demande.</p><p><strong>La livraison</strong>Le mode de livraison et son coût vous sont communiqués avec le tarif.</p></div></section>
  </main>
}

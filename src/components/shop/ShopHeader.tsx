'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowUpRight } from 'lucide-react'
import { useShopSelection } from './ShopProvider'
import styles from './Shop.module.css'

export default function ShopHeader() {
  const { itemCount } = useShopSelection()
  return <>
    <div className={styles.draftBanner}>APERÇU BOUTIQUE · TARIFS ET FORMATS EN PRÉPARATION</div>
    <header className={styles.header}>
      <Link href="/" aria-label="Hanami — retour à l’accueil"><Image src="/brand/2026/logo-principal-vert.png" width={112} height={40} alt="Hanami Expert Gazon" /></Link>
      <nav aria-label="Navigation boutique"><Link href="/boutique">La sélection Hanami</Link><Link href="/interventions-locales" className={styles.servicesLink}>Nos interventions <ArrowUpRight size={14} aria-hidden="true" /></Link></nav>
      <Link href="/boutique/selection" className={styles.selectionLink}><ShoppingBag size={18} aria-hidden="true" /><span>Ma sélection</span><strong aria-label={`${itemCount} article${itemCount > 1 ? 's' : ''}`}>{itemCount}</strong></Link>
    </header>
  </>
}

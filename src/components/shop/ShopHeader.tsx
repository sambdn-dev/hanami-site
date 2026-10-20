'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBag, ArrowUpRight } from 'lucide-react'
import styles from './Shop.module.css'

export default function ShopHeader() {
  const pathname = usePathname()
  return <>
    <div className={styles.draftBanner}>HANAMI · PRODUITS ET LOCATION</div>
    <header className={styles.header}>
      <Link href="/" aria-label="Hanami — retour à l’accueil"><Image src="/brand/2026/logo-principal-vert.png" width={112} height={40} alt="Hanami Expert Gazon" /></Link>
      <nav aria-label="Navigation boutique"><a href="/boutique" aria-current={!pathname.startsWith('/boutique/location') ? 'page' : undefined}>Produits</a><Link href="/boutique/location" aria-current={pathname.startsWith('/boutique/location') ? 'page' : undefined}>Location</Link><Link href="/interventions-locales" className={styles.servicesLink}>Nos interventions <ArrowUpRight size={14} aria-hidden="true" /></Link></nav>
      <a href="/boutique?panier=1" aria-label="Ouvrir le panier produits" className={styles.selectionLink}><ShoppingBag size={18} aria-hidden="true" /><span>Panier</span></a>
    </header>
  </>
}

import type { Metadata } from 'next'
import Link from 'next/link'
import ShopProvider from '@/components/shop/ShopProvider'
import ShopHeader from '@/components/shop/ShopHeader'
import styles from '@/components/shop/Shop.module.css'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <ShopProvider><div className={styles.shop}><ShopHeader />{children}<footer className={styles.footer}><div><strong>HANAMI</strong><span>Les bons produits. Le bon conseil.</span></div><Link href="/interventions-locales">Découvrir les interventions Hanami</Link><Link href="/mentions-legales">Mentions légales</Link></footer></div></ShopProvider>
}

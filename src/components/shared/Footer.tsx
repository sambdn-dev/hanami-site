import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import NewsletterCapture from '@/components/shared/NewsletterCapture'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerLead}>
          <div><p>HANAMI / UN NOUVEAU REGARD SUR LE GAZON</p><h2>Les bons projets commencent<br /><em>par une conversation.</em></h2></div>
          <a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">Parler à Sami <ArrowUpRight size={19} aria-hidden="true" /></a>
        </div>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}><Link href="/" aria-label="Hanami — accueil"><Image src="/brand/2026/logo-principal-blanc.png" alt="Hanami Expert Gazon" width={190} height={69} /></Link><p>La décision juste. Le bon moment.<br />Un gazon qui dure.</p><span>Le Vésinet · Île-de-France<br />Coaching partout en France</span></div>
          <div><h3>PARTICULIERS</h3><Link href="/coaching">Coaching gazon</Link><Link href="/mon-chantier">Estimer mon chantier</Link><Link href="/pourquoi-hanami">Notre approche</Link><Link href="/blog">Le journal</Link></div>
          <div><h3>PROFESSIONNELS</h3><Link href="/pro">Hanami Pro</Link><Link href="/pro/studio">Hanami Studio · Pro</Link><Link href="/calculatrice">Dosage Intelligent</Link><a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">Assistance gazon</a></div>
          <div className={styles.footerNewsletter}><h3>LE BON CONSEIL, AU BON MOMENT</h3><p>Un email utile de temps en temps, au rythme du jardin.</p><NewsletterCapture variant="footer" /></div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Hanami · TROTT SASU · SIREN 891 868 143</span><Link href="/mentions-legales">Mentions légales</Link><span>Fait pour les jardins vivants.</span></div>
      </div>
    </footer>
  )
}

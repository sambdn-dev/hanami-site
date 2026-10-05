import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Droplets, Leaf, MessageCircle, Search, Sprout, Video } from 'lucide-react'
import styles from './ServiceDirectory.module.css'

export default function ServiceDirectory({ localBase = '', dark = false }: { localBase?: string; dark?: boolean }) {
  const services = [
    { label: 'Installation d’arrosage automatique', href: '#arrosage-automatique', icon: Droplets, detail: 'Aiper IrriSense 2', featured: true },
    { label: 'Interventions agronomiques', href: `${localBase}#offres`, icon: CalendarDays },
    { label: 'Nutrition du gazon', href: `${localBase}#nutrition-gazon`, icon: Leaf },
    { label: 'Diagnostic', href: `${localBase}#methode`, icon: Search },
    { label: 'Rénovation express', href: '/renovation-express', icon: Sprout },
    { label: 'Coaching', href: '/coaching', icon: MessageCircle, detail: 'Vous réalisez les gestes' },
    { label: 'Suivi à distance', href: '/coaching#suivi-a-distance', icon: Video, detail: 'Avec le coaching' },
  ]

  return <nav className={`${styles.directory} ${dark ? styles.dark : ''}`} aria-label="Choisir un service Hanami">
    <p className={styles.label}>Votre jardin. <span>Le service qui lui correspond.</span></p>
    <div className={styles.services}>{services.map(({ label, href, icon: Icon, featured, detail }) => <Link key={label} href={href} className={`${styles.service} ${featured ? styles.featured : ''}`}>
      <Icon className={styles.icon} size={18} strokeWidth={1.5} aria-hidden="true" />
      <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
      <ArrowUpRight className={styles.arrow} size={14} aria-hidden="true" />
    </Link>)}</div>
  </nav>
}

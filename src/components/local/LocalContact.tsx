import { ArrowUpRight, Phone } from 'lucide-react'
import ContactForm from '@/components/shared/ContactForm'
import styles from './LocalSite.module.css'

export default function LocalContact({ express = false }: { express?: boolean }) {
  return <div className={styles.contactWrap}>
    <div className={`${styles.container} ${styles.directContact}`}><div><p className={styles.eyebrow}>Le Vésinet & alentours</p><h2>Un jardin à regarder.<br /><em>Une conversation à commencer.</em></h2></div><div><a href="https://wa.me/33667277614?text=Bonjour%2C%20je%20souhaite%20parler%20des%20interventions%20locales%20pour%20mon%20gazon." target="_blank" rel="noopener noreferrer">Échanger sur WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a><a href="tel:+33667277614"><Phone size={15} aria-hidden="true" /> +33 6 67 27 76 14</a><p>Quelques photos et votre commune pour commencer.</p></div></div>
    <ContactForm variant="particulier" source={express ? 'renovation-express' : 'interventions-locales'} localServices defaultLocalService={express ? 'Rénovation express' : ''} title={express ? 'Préparons votre rénovation express.' : 'Quel programme pour votre jardin ?'} subtitle="Votre commune, la surface approximative et quelques photos si vous en avez. Nous échangeons sur vos attentes, puis confirmons le programme et le devis." />
  </div>
}

import Link from 'next/link'
import { ArrowUpRight, Check, Globe2 } from 'lucide-react'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import styles from './CoachingSpotlight.module.css'

export default function CoachingSpotlight() {
  return <section id="coaching-distance" className={styles.section} aria-labelledby="coaching-spotlight-title">
    <div className={styles.container}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><Globe2 size={15} aria-hidden="true" />Coaching à distance · Partout en France</p>
        <h2 id="coaching-spotlight-title">Votre jardin.<br />Vos gestes.<br /><span>Mon accompagnement.</span></h2>
        <p className={styles.description}>Vous aimez entretenir votre gazon vous-même ? Je vous prépare un protocole personnalisé et vous accompagne pour savoir quoi faire, quand et à quelle dose. Où que vous habitiez.</p>
        <Link href="/coaching" className={styles.button}>Découvrir le coaching<ArrowUpRight size={18} aria-hidden="true" /></Link>
        <p className={styles.localLink}>Vous préférez me confier les interventions ?<br /><Link href="/interventions-locales#offres">Découvrir les prestations au Vésinet et alentours<ArrowUpRight size={13} aria-hidden="true" /></Link></p>
      </div>
      <div className={styles.offer}>
        <p className={styles.offerLabel}>Pour votre première rénovation</p>
        <h3>2 mois de coaching<br /><span>offerts pour vous lancer.</span></h3>
        <p className={styles.offerIntro}>En abonnement mensuel comme en annuel. Vous passez à l’action avec un programme adapté à votre gazon et à la saison.</p>
        <ul>{['Un diagnostic à partir de vos photos', 'Votre protocole, zone par zone', 'Un échange direct pour ajuster vos gestes'].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
        <p className={styles.price}>Ensuite, à partir de <strong>{PRICING_DISPLAY.coachingMois} € / mois TTC</strong><br />ou à partir de <strong>{PRICING_DISPLAY.coachingAnnuel} € / an TTC.</strong></p>
        <Link href="/coaching#coaching-offre" className={styles.offerLink}>Voir l’offre et ses conditions<ArrowUpRight size={17} aria-hidden="true" /></Link>
        <p className={styles.terms}>Deux mois continus dès l’envoi du premier protocole. Produits proposés séparément. Démarrage confirmé selon les disponibilités.</p>
      </div>
    </div>
  </section>
}

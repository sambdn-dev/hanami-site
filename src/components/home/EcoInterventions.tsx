import Link from 'next/link'
import { ArrowUpRight, Leaf, Volume2, Zap } from 'lucide-react'
import styles from './EcoInterventions.module.css'

export default function EcoInterventions() {
  return (
    <section id="interventions-ecologiques" className={styles.section} aria-labelledby="eco-title">
      <div className={styles.container}>
        <div className={styles.copy} data-reveal>
          <p className={styles.eyebrow}>INTERVENTIONS &amp; CHANTIERS <span aria-hidden="true">/</span> NOTRE ENGAGEMENT</p>
          <h2 id="eco-title">Un chantier soigné.<br /><em>Un jardin respecté.</em></h2>
          <p className={styles.intro}>Soucieux de l’environnement, nous choisissons aussi notre matériel pour la façon dont il accompagne votre jardin.</p>
          <Link href="/mon-chantier" className={styles.link}>Parlons de votre chantier <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </div>

        <div className={styles.commitment} data-reveal data-reveal-delay="1">
          <div className={styles.commitmentTop}>
            <span className={styles.icon} aria-hidden="true"><Zap size={30} fill="currentColor" strokeWidth={1.2} /></span>
            <span className={styles.label}>ENGAGEMENT ÉCOLOGIQUE</span>
          </div>
          <p className={styles.stat}><strong>90<span> %</span></strong><span>de notre parc matériel fonctionne sur batterie.</span></p>
          <div className={styles.benefits}>
            <div><Volume2 size={20} strokeWidth={1.5} aria-hidden="true" /><span>Des interventions plus silencieuses</span></div>
            <div><Leaf size={20} strokeWidth={1.5} aria-hidden="true" /><span>Moins polluantes, plus respectueuses de la nature</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

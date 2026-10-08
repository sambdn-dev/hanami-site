import { ArrowUpRight, Crosshair, Sprout } from 'lucide-react'
import OverseedingExplorer from './OverseedingExplorer'
import OverseedingSoilMotion from './OverseedingSoilMotion'
import styles from './OverseedingSection.module.css'

export default function OverseedingSection() {
  return <section id="regarnissage-cible" className={styles.section} aria-labelledby="overseeding-title">
    <div className={styles.container}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>03 / Le regarnissage de précision</p><h2 id="overseeding-title">Les bonnes graines.<br /><span>Au bon endroit.</span></h2></div>
        <p>Pour les zones faibles, j’utilise le Landzie Overseeding Tool : un outil spécialisé qui prépare de petites poches de semis, là où votre gazon en a besoin.</p>
      </header>
      <div className={styles.origin}><span>LANDZIE / OVERSEEDING TOOL</span><span>Marque américaine · réseau britannique et européen</span></div>
      <OverseedingExplorer />

      <div className={styles.method}>
        <div className={styles.methodCopy}>
          <p className={styles.eyebrow}><Crosshair size={15} aria-hidden="true" /> Cibler, plutôt que tout reprendre</p>
          <h3>Regarnir les zones faibles.<br /><span>Préserver le gazon sain.</span></h3>
          <p>Les pointes rotatives ouvrent la croûte superficielle et créent des micro-poches. J’y apporte ensuite un <strong>mélange Hanami adapté</strong> au terrain, à la saison et à l’usage du jardin.</p>
          <p>Ce travail localisé favorise le contact entre la graine et la terre. Il évite un ratissage agressif de toute la pelouse : les zones en bonne santé sont conservées. Une scarification reste possible si l’état du gazon la justifie.</p>
          <a className={styles.cta} href="#contact">Étudier les zones à regarnir <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <OverseedingSoilMotion />
      </div>

      <aside className={styles.results} aria-labelledby="overseeding-results-title">
        <div className={styles.resultsIntro}><p className={styles.eyebrow}><Sprout size={15} aria-hidden="true" /> Mesures internes Hanami</p><h3 id="overseeding-results-title">Le geste compte.<br />Le protocole aussi.</h3><p>La préparation, le choix du mélange et le suivi d’arrosage travaillent ensemble pour favoriser la germination.</p></div>
        <div className={styles.resultNumbers}>
          <div className={styles.withProtocol}><span>Avec le protocole Hanami</span><strong>≈ 98 <small>%</small></strong><p>de germination observée</p></div>
          <div className={styles.withoutProtocol}><span>Sans suivi du protocole</span><strong>≈ 25 <small>%</small></strong><p>dans la comparaison Hanami</p></div>
        </div>
        <p className={styles.resultNote}>Chiffres issus des mesures internes communiquées par Hanami. Ils concernent le protocole complet et ne constituent pas une garantie de résultat. La levée dépend notamment du sol, des semences, de la météo et de l’arrosage.</p>
      </aside>
    </div>
  </section>
}

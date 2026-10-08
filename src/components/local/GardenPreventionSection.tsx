import { ArrowUpRight } from 'lucide-react'
import styles from './GardenPreventionSection.module.css'
import GardenPreventionVisual from './GardenPreventionVisual'

const actions = [
  {
    title: 'Entretenir les zones de refuge.',
    text: 'Une tonte régulière à une hauteur adaptée au gazon, l’entretien des herbes hautes et des haies, puis le ramassage des débris végétaux contribuent à limiter certains lieux de repos des adultes. La hauteur de coupe reste adaptée à la saison et à la santé du gazon.',
  },
  {
    title: 'Maîtriser l’humidité du jardin.',
    text: 'Adapter l’arrosage aux besoins du sol et de la plante, repérer les accumulations d’eau et vérifier les évacuations : l’objectif est de nourrir le jardin en eau sans entretenir une humidité excessive ni des poches d’eau stagnante.',
  },
  {
    title: 'Supprimer l’eau qui stagne.',
    text: 'Chaque semaine, vider les coupelles et petits récipients, ranger ou retourner les objets qui retiennent l’eau, couvrir les récupérateurs et nettoyer les gouttières. C’est le geste essentiel pour limiter les lieux où se développent les larves.',
  },
]

export default function GardenPreventionSection() {
  return <section id="moustiques-tigres" className={styles.section} aria-labelledby="garden-prevention-title">
    <div className={styles.container}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>JARDIN & MOUSTIQUE TIGRE</p>
        <h2 id="garden-prevention-title">Retrouver le plaisir<br /><em>d’être au jardin.</em></h2>
        <p className={styles.intro}>Les moustiques tigres se reposent dans des endroits ombragés, frais et humides. Un entretien régulier du jardin fait partie de la prévention, en associant la gestion de la végétation, de l’arrosage et des petites eaux stagnantes.</p>
      </div>
      <GardenPreventionVisual />
      <div className={styles.actions}>{actions.map((action, index) => <article key={action.title}>
        <span className={styles.number}>0{index + 1}</span>
        <h3>{action.title}</h3>
        <p>{action.text}</p>
      </article>)}</div>
      <div className={styles.observation}>
        <div><p className={styles.eyebrow}>LE CONSTAT HANAMI DEPUIS AVRIL</p><p>Sur les jardins que j’entretiens, je ressens une présence de moustiques plus faible. C’est une observation de terrain, qui m’encourage à intégrer ces gestes de prévention à l’entretien du jardin.</p></div>
        <p className={styles.observationNote}>Ce ressenti n’est pas un comptage des moustiques. L’effet dépend du jardin, de la météo et des gîtes présents à proximité ; l’entretien seul ne garantit pas leur disparition.</p>
      </div>
      <div className={styles.footer}>
        <a className={styles.cta} href="#contact">Parlons de l’entretien de votre jardin <ArrowUpRight size={17} aria-hidden="true" /></a>
        <div className={styles.sources}><span>Gestes de prévention recommandés par</span><a href="https://signalement-moustique.anses.fr/signalement_albopictus/faq" target="_blank" rel="noopener noreferrer">l’Anses ↗</a><a href="https://moustigre.org/prevention/" target="_blank" rel="noopener noreferrer">l’EID Rhône-Alpes ↗</a></div>
      </div>
    </div>
  </section>
}

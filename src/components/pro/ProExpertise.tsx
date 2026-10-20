import { ArrowDown, ArrowUpRight, Check, Ruler } from 'lucide-react'
import styles from './ProExpertise.module.css'

const deliverables = [
  ['Un terrain à comprendre', 'Exposition, sol, arrosage et état du gazon : les choix partent du jardin réel.'],
  ['Une intervention à préparer', 'Semences, produits, doses par surface et conditions d’application : votre équipe sait quoi prévoir.'],
  ['Un résultat à suivre', 'Les apports sont consignés et le programme s’ajuste selon les observations et la météo.'],
]

export default function ProExpertise() {
  return (
      <div className={styles.container}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Hanami Pro / Pour les paysagistes</p>
          <h1 id="pro-title">L’expertise agronomique.<br /><span>Pour vos chantiers gazon.</span></h1>
          <p>Création, entretien ou rénovation : vous gardez la relation client. Hanami vous accompagne dans les décisions techniques, avant l’intervention et quand le terrain demande un ajustement.</p>
          <div className={styles.actions}><a href="#contact" className={styles.button}>Parlons de votre chantier <ArrowUpRight size={17} aria-hidden="true" /></a><a href="#demo" className={styles.softwareLink}>Découvrir le logiciel <ArrowDown size={16} aria-hidden="true" /></a></div>
          <ul className={styles.deliverables}>
            {deliverables.map(([title, detail]) => <li key={title}><Check size={17} aria-hidden="true" /><div><h3>{title}</h3><p>{detail}</p></div></li>)}
          </ul>
          <p className={styles.contactNote}>Un besoin ponctuel ou un suivi régulier à définir ensemble. <a href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer">Échanger sur WhatsApp</a></p>
        </div>

        <figure className={styles.document} aria-labelledby="protocol-title">
          <div className={styles.documentHeader}><span>HANAMI PRO / EXTRAIT DE PROTOCOLE</span><span className={styles.exampleBadge}>Exemple fictif</span></div>
          <div className={styles.documentIntro}>
            <p>Ce que reçoit le paysagiste</p>
            <h3 id="protocol-title">Un plan pour agir.<br />Des repères pour suivre.</h3>
            <div className={styles.siteFacts}><Ruler size={16} aria-hidden="true" /><span>Jardin d’exemple · 400 m² · Entretien d’automne</span></div>
          </div>
          <ol className={styles.protocolSteps}>
            <li><span className={styles.stepNumber}>01</span><div><h4>Avant l’intervention</h4><p>Observer la densité, l’humidité du sol et les zones faibles. Vérifier les apports précédents avant de choisir la formule.</p></div></li>
            <li><span className={styles.stepNumber}>02</span><div><h4>Préparer la quantité à appliquer</h4><p>Fertilisation de fond avec un engrais granulé adapté au terrain et à la période.</p><div className={styles.calculation}><span>Exemple de calcul</span><strong>20 g/m² × 400 m² = <b>8 kg</b></strong></div><p className={styles.doseNote}>Dose illustrative, à valider selon le produit retenu et l’état du gazon.</p></div></li>
            <li><span className={styles.stepNumber}>03</span><div><h4>Consigner, puis ajuster</h4><p>Référence du produit, dose, date et photos de suivi : un historique pour préparer le prochain passage et adapter le calendrier.</p></div></li>
          </ol>
          <figcaption>Données fictives pour illustrer le livrable. Le programme réel, les produits et les doses sont définis pour chaque chantier.</figcaption>
        </figure>
      </div>
  )
}

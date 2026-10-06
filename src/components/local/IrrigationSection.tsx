import Image from 'next/image'
import { CloudRain, Droplets, MapPinned, Smartphone, Sparkles } from 'lucide-react'
import IrrigationZoneMotion from './IrrigationZoneMotion'
import IrrigationQuoteButton from './IrrigationQuoteButton'
import styles from './IrrigationSection.module.css'

const benefits = [
  { icon: MapPinned, title: 'Votre jardin, zone par zone.', description: 'La pelouse principale, les massifs, un passage étroit ou une zone plus ombragée : les surfaces sont cartographiées et les programmes adaptés aux besoins de chaque zone.' },
  { icon: Smartphone, title: 'Un programme. Moins de contraintes.', description: 'Les horaires et les apports d’eau se règlent dans l’application Aiper. Une fois le programme établi, l’arrosage suit les créneaux définis et vous gardez la main.' },
  { icon: CloudRain, title: 'La météo entre dans le programme.', description: 'Le capteur de pluie intégré et les informations météo permettent d’ajuster ou de suspendre les cycles. Le suivi de consommation aide à adapter les apports au jardin.' },
]

export default function IrrigationSection() {
  return (
    <section id="arrosage-automatique" className={styles.section} aria-labelledby="irrigation-aiper-title">
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}><Droplets size={14} aria-hidden="true" /> ARROSAGE AUTOMATIQUE / AIPER IRRISENSE 2</p>
            <h2 id="irrigation-aiper-title">L’eau au bon endroit.<br /><em>L’esprit tranquille.</em></h2>
            <p className={styles.intro}>Un arrosage de surface intelligent, pensé autour des formes et des besoins de votre jardin. Hanami étudie l’installation, dessine les zones et prépare les réglages avec vous.</p>
            <div className={styles.tags}><span>Zones personnalisées</span><span>Pilotage par application</span><span>Sans réseau enterré</span></div>
            <IrrigationQuoteButton className={styles.quoteButton} />
            <p className={styles.quoteNote}>Le Vésinet & alentours · Étude du terrain et devis personnalisé</p>
          </div>
          <figure className={styles.product}>
            <Image src="/images/irrigation/irrisense2-lifestyle.webp" alt="Aiper IrriSense 2, système d’arrosage intelligent de surface, présenté au milieu du gazon" fill sizes="(max-width: 767px) 700px, (max-width: 1100px) 950px, 1080px" />
            <div className={styles.productShade} />
            <div className={styles.productHeader}><span>AIPER</span><span>IRRISENSE 2</span></div>
            <span className={styles.productLabel}><Sparkles size={14} aria-hidden="true" /> Le jardin suit son rythme.</span>
            <figcaption>Visuel officiel du fabricant · Arrosage de surface</figcaption>
          </figure>
        </div>
        <div className={styles.specs} aria-label="Caractéristiques constructeur">
          <div><strong>10 <span>zones</span></strong><p>au maximum, avec programmes individuels</p></div>
          <div><strong>445 <span>m²</span></strong><p>de couverture maximale annoncée*</p></div>
          <div><strong>12 <span>m</span></strong><p>de portée maximale annoncée*</p></div>
          <div className={styles.specMessage}><Droplets size={22} strokeWidth={1.4} aria-hidden="true" /><p>Une eau mieux ciblée.<br /><strong>Un quotidien plus simple.</strong></p></div>
        </div>
        <div className={styles.benefits}>{benefits.map(({ icon: Icon, title, description }, index) => (
          <article key={title}><div className={styles.benefitTop}><span>0{index + 1}</span><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>
        ))}</div>
        <div className={styles.motionHeading}>
          <div><p className={styles.eyebrow}>LES ZONES, SIMPLEMENT</p><h3>Le bon contour.<br /><em>Le bon programme.</em></h3></div>
          <p>Délimiter la pelouse et les massifs, tenir compte des allées et de la terrasse, puis adapter les apports à chaque zone. Explorez le principe en trois étapes.</p>
        </div>
        <IrrigationZoneMotion />
        <div className={styles.installation}>
          <div><p className={styles.eyebrow}>L’ACCOMPAGNEMENT HANAMI</p><h3>On prépare tout.<br /><em>Vous profitez du jardin.</em></h3><p>Je vérifie l’arrivée d’eau, l’emplacement et les raccordements. Nous définissons les zones et des programmes adaptés au gazon et aux massifs, puis je vous montre comment les faire évoluer.</p></div>
          <div className={styles.installationDetail}><span>01 / ÉTUDE ET DIMENSIONNEMENT</span><span>02 / INSTALLATION ET CARTOGRAPHIE</span><span>03 / RÉGLAGES ET PRISE EN MAIN</span><IrrigationQuoteButton className={styles.quoteButton}>Étudier mon arrosage</IrrigationQuoteButton></div>
        </div>
        <div className={styles.conditions}><p>*Données constructeur. La couverture réelle dépend notamment de la pression, du débit, de l’implantation et des obstacles. Le système nécessite une arrivée d’eau et une alimentation électrique adaptée en extérieur. La notice prévoit notamment au moins 2 bar et 25 L/min, vérifiés avant le devis. Le Wi-Fi 2,4 GHz permet le pilotage à distance. Les économies d’eau dépendent des réglages et des conditions du jardin.</p><a href="https://aiper.com/fr/aiper-irrisense2" target="_blank" rel="noopener noreferrer">Caractéristiques Aiper ↗</a></div>
      </div>
    </section>
  )
}

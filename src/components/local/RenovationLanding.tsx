import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Check, Droplets, Layers3, MapPin, Sprout, Timer, Worm } from 'lucide-react'
import styles from './RenovationLanding.module.css'

const soilReasons = [
  { icon: Layers3, number: '01', title: 'Préserver la structure', text: 'Le sol possède une organisation naturelle. Éviter de le retourner limite le bouleversement de ses horizons et permet de travailler à partir de ce qui est déjà en place.' },
  { icon: Worm, number: '02', title: 'Respecter la vie du sol', text: 'Les organismes du sol et les galeries des vers de terre participent à son fonctionnement. Une rénovation sans retournement préserve mieux leurs habitats et ces voies naturelles de circulation.' },
  { icon: Sprout, number: '03', title: 'Limiter les graines réveillées', text: 'La terre contient des graines d’adventices enfouies. La retourner peut en ramener à la lumière et favoriser leur germination au milieu du nouveau gazon.' },
] as const

export default function RenovationLanding() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="renovation-title">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Link href="/interventions-locales" className={styles.backLink}>Les interventions locales <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <p className={styles.eyebrow}><MapPin size={13} aria-hidden="true" /> Au Vésinet & alentours</p>
            <h1 id="renovation-title">Rénovation express.<br /><em>On ne retourne<br />pas le sol.</em></h1>
            <p>Une pelouse fatiguée n’exige pas toujours de repartir de zéro. Je m’appuie sur l’existant pour renouveler le gazon, tout en préservant les qualités de votre sol.</p>
            <a href="#contact" className={styles.lightButton}>Parlons de votre rénovation <ArrowUpRight size={19} aria-hidden="true" /></a>
            <span className={styles.heroNote}>Diagnostic du terrain · Intervention sur devis · Conseils après chantier</span>
          </div>
          <figure className={styles.heroFigure}><Image src="/images/apres-susan.jpg" alt="Pelouse dense dans un jardin rénové par Hanami au Vésinet" fill preload sizes="(min-width: 1024px) 48vw, 100vw" /><div className={styles.photoShade} /><figcaption><Sprout size={24} strokeWidth={1.25} aria-hidden="true" /><span>Un nouveau départ,<br /><em>sur de bonnes fondations.</em><small>Réalisation Hanami au Vésinet · Photographie réelle</small></span></figcaption></figure>
        </div>
        <div className={`${styles.container} ${styles.stats}`}><div><strong>200 <small>m²</small></strong><span>terrain simple de référence</span></div><div><strong>½ à 1 <small>jour</small></strong><span>durée indicative d’intervention</span></div><div><strong>≈ 3 <small>semaines</small></strong><span>premier résultat visuel visé*</span></div></div>
        <p className={`${styles.container} ${styles.statsNote}`}>Pour environ 200 m² assez rectangulaires et accessibles&nbsp;: une demi-journée, jusqu’à une journée pour un cas plus complexe. *En conditions favorables&nbsp;; la levée et le développement dépendent des semences, de la météo et de l’arrosage. Le gazon s’établit progressivement.</p>
      </section>

      <section className={styles.soilSection} aria-labelledby="soil-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / Pourquoi préserver l’existant</p><h2 id="soil-title" className={styles.title}>Sous vos pieds,<br /><em>un écosystème précieux.</em></h2></div><p>La rénovation express évite le retournement du terrain. Une approche particulièrement intéressante lorsque le sol et la forme du jardin permettent de partir de la pelouse existante.</p></div>
          <div className={styles.reasons}>{soilReasons.map(({ icon: Icon, number, title, text }) => <article key={number}><div><span>{number}</span><Icon size={29} strokeWidth={1.25} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className={styles.soilIllustration}>
            <div className={styles.soilArt} aria-hidden="true"><div className={styles.blades}>{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ left: `${i * 3}%`, height: `${31 + (i % 5) * 6}px`, transform: `rotate(${(i % 4) * 5 - 7}deg)` }} />)}</div><div className={styles.topSoil} /><div className={styles.midSoil} /><div className={styles.deepSoil} /><svg viewBox="0 0 500 180" preserveAspectRatio="none"><path d="M75 0C48 35 120 40 80 75S50 110 83 153M205 0C246 28 184 50 220 80S266 132 218 180M371 0C338 40 398 38 365 79S344 123 384 164" fill="none" stroke="#c8bd99" strokeWidth="5" strokeLinecap="round" /><path d="M145 0C144 21 154 38 166 48M145 16L126 37M296 0C302 22 281 36 284 65M298 16L320 37M425 0L430 63M430 21L451 42" fill="none" stroke="#e5dfc4" strokeWidth="2" strokeLinecap="round" /></svg></div>
            <div className={styles.soilLegend}><span>Illustration du sol</span><strong>La structure, les racines,<br />la vie&nbsp;: tout se tient.</strong><p>La méthode s’adapte au diagnostic. Un nivellement important ou un sol très dégradé peut demander une autre intervention.</p></div>
          </div>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="renovation-process-title">
        <div className={`${styles.container} ${styles.processGrid}`}>
          <div><p className={styles.eyebrow}>02 / La rénovation, simplement</p><h2 id="renovation-process-title" className={styles.title}>Faire évoluer la pelouse.<br /><em>Sans bouleverser le jardin.</em></h2><p className={styles.processIntro}>Le principe&nbsp;: une inversion massive de flore. En clair, favoriser progressivement les graminées choisies pour votre futur gazon, à partir de l’existant.</p><a href="#contact" className={styles.textLink}>Faire étudier mon terrain <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <ol className={styles.steps}><li><span>01</span><div><h3>Observer et dimensionner</h3><p>État du gazon, exposition, surface, accès et possibilité d’arrosage&nbsp;: le chantier commence par un diagnostic et un devis adapté.</p></div></li><li><span>02</span><div><h3>Intervenir sur l’existant</h3><p>La rénovation s’organise autour du gazon en place, sans retourner la terre. Les semences sont choisies selon votre usage et les conditions du jardin.</p></div></li><li><span>03</span><div><h3>Accompagner la reprise</h3><p>Vous recevez les conseils de tonte et d’arrosage nécessaires. La nutrition et le suivi peuvent ensuite être confiés à Hanami, au rythme qui vous convient.</p></div></li></ol>
        </div>
        <div className={`${styles.container} ${styles.timingNote}`}><CalendarDays size={20} aria-hidden="true" /><p><strong>Le bon calendrier fait partie de la méthode.</strong> La période d’intervention tient compte des températures, de l’humidité et de votre capacité à arroser pendant la levée.</p></div>
      </section>

      <section className={styles.irrigationSection} aria-labelledby="irrigation-title">
        <div className={`${styles.container} ${styles.irrigationGrid}`}>
          <div><p className={styles.eyebrow}><Droplets size={15} aria-hidden="true" /> 03 / L’arrosage, bien pensé</p><h2 id="irrigation-title" className={styles.title}>L’eau où il faut.<br /><em>Quand il faut.</em></h2><p>Je peux installer un arrosage automatique adapté à votre jardin&nbsp;: enterré et discret, ou en surface, raccordé à un tuyau et une alimentation en eau.</p><ul><li><Check size={17} aria-hidden="true" /><span><strong>Enterré</strong> · Les équipements se font discrets hors arrosage.</span></li><li><Check size={17} aria-hidden="true" /><span><strong>En surface</strong> · Une solution à dimensionner selon votre terrain et votre arrivée d’eau.</span></li></ul><a href="#contact" className={styles.textLink}>Étudier mon arrosage <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <div className={styles.coverageCard}><div className={styles.coverageHead}><span>Autre configuration · exemple de portée</span><Droplets size={18} aria-hidden="true" /></div><div className={styles.coverageDiagram} aria-hidden="true"><div className={styles.coverageCircle}><span className={styles.radiusLine} /><span className={styles.radiusLabel}>13 m de rayon</span><i /></div></div><div className={styles.coverageNumber}><strong>≈ 531 <span>m²</span></strong><p>surface théorique d’un cercle de 13 m de rayon</p></div><p className={styles.coverageNote}>π × 13² ≈ 531 m². La couverture utile dépend de la pression, du débit, du vent, des obstacles et du recouvrement nécessaire. Elle est vérifiée lors du dimensionnement.</p></div>
        </div>
      </section>

      <section className={styles.rollSection} aria-labelledby="roll-title"><div className={`${styles.container} ${styles.rollGrid}`}><div><p className={styles.eyebrow}>Une autre option pour votre jardin</p><h2 id="roll-title">Et le gazon en rouleaux&nbsp;?</h2><p>La pose de gazon en rouleaux peut aussi être étudiée. La préparation du terrain, l’accès, la période et l’arrosage déterminent la solution et le devis.</p></div><a href="#contact" className={styles.button}>Parlons des possibilités <ArrowUpRight size={18} aria-hidden="true" /></a></div></section>

      <section className={styles.continuity}><div className={styles.container}><div><Timer size={23} strokeWidth={1.4} aria-hidden="true" /><p><strong>Après la rénovation, la régularité fait la différence.</strong><span>Nutrition et interventions agronomiques&nbsp;: de quelques passages par an au suivi premium.</span></p></div><Link href="/interventions-locales#programmes">Découvrir le suivi du gazon <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
    </div>
  )
}

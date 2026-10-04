import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, CalendarDays, Check, CloudSun, Droplets, Leaf, MapPin, Ruler, Sprout, Target } from 'lucide-react'
import styles from './LocalLanding.module.css'

const plans = [
  { number: '01', name: 'L’essentiel', detail: 'Une nutrition de fond', description: 'Quelques interventions dans l’année pour apporter au gazon les nutriments dont il a besoin, au bon moment.', bullets: ['Fertilisation adaptée aux saisons', 'Doses ajustées à votre surface', 'Conseils de tonte et d’arrosage'] },
  { number: '02', name: 'Le suivi régulier', detail: 'Anticiper, puis ajuster', description: 'Un programme évolutif pour accompagner la densité, la couleur et la résistance de votre pelouse.', bullets: ['Nutrition solide et compléments ciblés', 'Préparation aux périodes de stress', 'Ajustements selon l’état du gazon'] },
  { number: '03', name: 'L’exigence premium', detail: 'Le détail fait le jardin', description: 'Des passages rapprochés et une attention continue pour ceux qui souhaitent un gazon particulièrement soigné.', bullets: ['Suivi agronomique plus soutenu', 'Séquences de nutrition préparées', 'Finitions et entretien selon le devis'] },
] as const

export function LocalHero() {
  return (
    <section className={styles.hero} aria-labelledby="local-hero-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><MapPin size={14} aria-hidden="true" /> Le Vésinet & alentours · Particuliers</p>
          <h1 id="local-hero-title" className={styles.heroTitle}>Votre gazon,<br /><em>entre de<br className={styles.desktopBreak} /> bonnes mains.</em></h1>
          <p className={styles.heroDescription}>Une pelouse à rénover ou à entretenir&nbsp;? J’interviens chez vous, avec une méthode précise et un programme pensé pour votre jardin.</p>
          <div className={styles.heroActions}>
            <a href="#contact" className={styles.button}>Parlons de votre jardin <ArrowUpRight size={19} aria-hidden="true" /></a>
            <a href="#offres" className={styles.textLink}>Voir les interventions <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <p className={styles.heroNote}>Interventions sur forfait ou abonnement.<br />Le bon rythme, du passage ponctuel au suivi premium.</p>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.heroPhoto}>
            <Image src="/images/apres-susan.jpg" alt="Pelouse rénovée par Hanami dans un jardin du Vésinet" fill preload sizes="(min-width: 1024px) 49vw, 100vw" />
            <span className={styles.photoLabel}><span /> Un jardin réel, au Vésinet</span>
            <figcaption className={styles.photoCaption}><span>La précision se voit.<small>Jardin de Susan · Photographie d’une réalisation Hanami</small></span><Sprout size={32} strokeWidth={1.2} aria-hidden="true" /></figcaption>
          </div>
          <div className={styles.heroStamp}><Ruler size={19} strokeWidth={1.5} aria-hidden="true" /><span>Une surface mesurée.<br /><strong>Un soin sur mesure.</strong></span></div>
        </figure>
      </div>
      <div className={`${styles.container} ${styles.heroBottom}`}><span>Nutrition · Prévention · Rénovation</span><span>Le jardin commence par le sol.</span></div>
    </section>
  )
}

export function LocalOffers() {
  return (
    <section id="offres" className={styles.section} aria-labelledby="local-offers-title">
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>01 / Les interventions à domicile</p><h2 id="local-offers-title" className={styles.title}>Un nouveau départ.<br /><em>Ou une longueur d’avance.</em></h2></div>
          <p>Je réalise les interventions. Vous profitez de votre jardin. Nous choisissons ensemble le niveau d’entretien qui correspond à vos attentes.</p>
        </div>
        <div className={styles.offerGrid}>
          <article className={styles.renovationCard}>
            <div className={styles.cardTop}><span>Rénovation express</span><Sprout size={25} strokeWidth={1.4} aria-hidden="true" /></div>
            <h3>Changer le gazon.<br /><em>Préserver le sol.</em></h3>
            <p>On part de l’existant, sans retourner la terre, pour redonner sa place à un gazon dense et adapté à votre jardin.</p>
            <div className={styles.renovationFacts}><div><strong>200 m²</strong><span>surface simple de référence</span></div><div><strong>½ à 1 jour</strong><span>intervention indicative*</span></div></div>
            <Link href="/renovation-express" className={styles.lightButton}>Découvrir la rénovation express <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <small>*Pour un terrain assez rectangulaire et accessible. La durée dépend de l’état du gazon et de la complexité du chantier.</small>
          </article>
          <article className={styles.followCard}>
            <div className={styles.cardTop}><span>Interventions agronomiques</span><CalendarDays size={25} strokeWidth={1.4} aria-hidden="true" /></div>
            <h3>Le bon soin.<br /><em>Au bon moment.</em></h3>
            <p>Nutrition, préparation aux chaleurs et corrections ciblées&nbsp;: un suivi régulier pour renforcer le gazon, favoriser sa densité et limiter la place laissée aux adventices.</p>
            <div className={styles.frequency}><span>Le rythme s’adapte</span><strong>2 semaines <span>à</span> 3 mois</strong><p>entre deux passages, selon le niveau d’entretien souhaité.</p></div>
            <a href="#programmes" className={styles.textLink}>Trouver votre programme <ArrowDown size={18} aria-hidden="true" /></a>
          </article>
        </div>
        <div id="programmes" className={styles.planIntro}><h3>De l’essentiel au très soigné.</h3><p>Des programmes personnalisés, sur abonnement ou forfait.<br />Le devis précise les interventions, le rythme et les produits.</p></div>
        <div className={styles.planGrid}>{plans.map((plan) => <article key={plan.number} className={styles.plan}><span className={styles.planNumber}>{plan.number}</span><p className={styles.planDetail}>{plan.detail}</p><h4>{plan.name}</h4><p className={styles.planDescription}>{plan.description}</p><ul>{plan.bullets.map((bullet) => <li key={bullet}><Check size={15} aria-hidden="true" />{bullet}</li>)}</ul><a href="#contact">Parlons de ce programme <ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div>
      </div>
    </section>
  )
}

export function LocalMethod() {
  return (
    <section id="methode" className={styles.methodSection} aria-labelledby="local-method-title">
      <div className={`${styles.container} ${styles.methodGrid}`}>
        <div className={styles.methodCopy}>
          <p className={styles.eyebrow}>02 / La méthode Hanami</p>
          <h2 id="local-method-title" className={styles.title}>Rien au hasard.<br /><em>Tout à sa juste dose.</em></h2>
          <p className={styles.methodIntro}>Avant le premier produit, je prends le temps de comprendre le terrain. La précision commence par la surface, puis se poursuit à chaque intervention.</p>
          <ol className={styles.steps}>
            <li><span>01</span><div><h3>Mesurer, zone par zone</h3><p>Je relève la surface du gazon au dixième de mètre carré près. Chaque zone reçoit une quantité calculée au gramme, pour une application homogène et limiter les différences de couleur.</p></div></li>
            <li><span>02</span><div><h3>Préparer les séquences</h3><p>Je sélectionne les produits selon l’état du gazon, la saison et les applications précédentes. Parmi environ 50 à 60 références d’engrais solides, chaque choix prépare aussi la prochaine intervention.</p></div></li>
            <li><span>03</span><div><h3>Anticiper, puis ajuster</h3><p>Je prépare le gazon avant une période difficile, plutôt que d’attendre les dégâts. Si un problème est déjà présent, nous adaptons le programme pour le corriger.</p></div></li>
          </ol>
        </div>
        <div className={styles.precisionScene}>
          <div className={styles.precisionHead}><span>Mesurer pour mieux agir</span><Target size={20} aria-hidden="true" /></div>
          <div className={styles.plot} aria-hidden="true"><span className={styles.plotTop}>Relevé de surface</span><div className={styles.plotGarden}><span>Zone A</span><i /><span>Zone B</span></div><span className={styles.plotBottom}>Chaque zone a son dosage.</span><span className={styles.plotRule} /></div>
          <div className={styles.precisionNumbers}><div><strong>0,1 <small>m²</small></strong><span>précision du relevé</span></div><div><strong>1 <small>g</small></strong><span>unité de calcul des doses</span></div></div>
          <div className={styles.precisionFoot}><span>Observer → Mesurer → Adapter</span><small>Illustration de la méthode</small></div>
        </div>
      </div>
    </section>
  )
}

export function LocalClimate() {
  return (
    <section id="climat" className={styles.climateSection} aria-labelledby="local-climate-title">
      <div className={styles.container}>
        <div className={styles.climateHeading}><p className={styles.eyebrow}><CloudSun size={16} aria-hidden="true" /> Penser le jardin de demain</p><h2 id="local-climate-title" className={styles.title}>Plus résilient.<br /><em>Plus juste en eau.</em></h2><p>Le changement climatique guide mes choix. Un beau gazon commence par des variétés adaptées et un sol qui fonctionne bien. L’objectif&nbsp;: mieux utiliser l’eau, sans promettre une pelouse qui n’en a jamais besoin.</p></div>
        <div className={styles.climateGrid}>
          <article><Sprout size={28} strokeWidth={1.25} aria-hidden="true" /><h3>Des semences adaptées</h3><p>Choisir les mélanges et variétés selon l’exposition, l’usage et le sol. Certaines variétés plus résistantes à la sécheresse développent un enracinement plus profond.</p></article>
          <article><Leaf size={28} strokeWidth={1.25} aria-hidden="true" /><h3>Un sol mieux accompagné</h3><p>Les amendements organiques adaptés peuvent améliorer le fonctionnement du sol, sa rétention d’eau et la disponibilité des nutriments, notamment en terrain très drainant.</p></article>
          <article><Droplets size={28} strokeWidth={1.25} aria-hidden="true" /><h3>Une eau mieux utilisée</h3><p>Hauteur de tonte, arrosage au bon moment et interventions ciblées travaillent ensemble. Les économies d’eau dépendent de votre terrain et des conditions réelles.</p></article>
        </div>
        <div className={styles.bioNote}><Leaf size={21} aria-hidden="true" /><div><strong>Vous préférez une approche naturelle&nbsp;?</strong><p>Un programme avec des produits biologiques et issus de l’économie circulaire peut être étudié sur demande. L’origine, la composition et les certifications des références retenues sont précisées avant intervention.</p></div><a href="#contact" className={styles.textLink}>En parler <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </div>
    </section>
  )
}

export function LocalApproach() {
  return (
    <section className={styles.approachSection} aria-labelledby="local-approach-title">
      <div className={`${styles.container} ${styles.approachGrid}`}>
        <div><p className={styles.eyebrow}>Le soin du terrain, le goût du partage</p><h2 id="local-approach-title" className={styles.title}>J’interviens.<br /><em>Je vous conseille aussi.</em></h2></div>
        <div className={styles.approachCopy}><p>Autodidacte et passionné, je construis mes programmes à partir de l’observation des jardins, des caractéristiques des produits et du suivi des résultats.</p><p>Vous souhaitez garder la main sur une partie de l’entretien&nbsp;? Je vous guide sur la tonte, le regarnissage et le choix du mélange de semences parmi les nombreuses références disponibles.</p><a href="#contact" className={styles.textLink}>Parlons de votre jardin <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div>
      <div className={`${styles.container} ${styles.coachingNote}`}><span>Vous préférez tout réaliser vous-même, ou habitez plus loin&nbsp;?</span><Link href="/coaching">Le coaching à distance <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  )
}

export default function LocalLanding({ afterMethod }: { afterMethod?: ReactNode }) {
  return <div className={styles.page}><LocalHero /><LocalOffers /><LocalMethod />{afterMethod}<LocalClimate /><LocalApproach /></div>
}

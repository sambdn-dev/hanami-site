'use client'

import { ArrowUpRight, CalendarDays, Camera, Check, MessageCircle } from 'lucide-react'
import { track } from '@/lib/analytics'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import { SERVICES } from '@/lib/chantier/services'
import styles from './Coaching.module.css'

// Illustrative dates and actions; every client receives an adapted protocol.
const SAMPLE_PROTOCOL = [
  { date: '12 mars', action: 'Scarification et regarnissage' },
  { date: '26 mars', action: 'Nutrition adaptée au redémarrage' },
  { date: '14 avril', action: 'Tonte à la hauteur conseillée' },
  { date: '2 mai', action: 'Renforcement de la plante' },
]

const steps = [
  { icon: Camera, title: 'Vous montrez votre jardin.', text: 'Quelques photos de votre gazon et cinq questions. Nous faisons le point sur le sol, la densité, l’exposition et vos habitudes.' },
  { icon: CalendarDays, title: 'Vous recevez votre protocole.', text: 'Votre plan zone par zone et un calendrier sur douze mois : quoi appliquer, à quelle date et à quelle dose.' },
  { icon: MessageCircle, title: 'Vous avancez. On ajuste.', text: 'Un doute, une météo qui change ou une zone qui jaunit : nous adaptons le protocole ensemble, toute l’année.' },
]

function TrialButton({ location, light = false }: { location: string; light?: boolean }) {
  return <a href="#contact" className={light ? styles.lightButton : styles.button} onClick={() => track('cta_click', { location, page: window.location.pathname })}>
    Commencer mon mois offert<ArrowUpRight size={18} aria-hidden="true" />
  </a>
}

export default function CoachingContent() {
  return <>
    <section className={styles.hero} aria-labelledby="coaching-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>Coaching gazon · Partout en France</p>
          <h1 id="coaching-title">Vous prenez soin du gazon.<br /><em>Je vous guide toute l’année.</em></h1>
          <p className={styles.intro}>{SERVICES.coaching.accroche}</p>
          <p className={styles.heroOffer}><strong>{PRICING_DISPLAY.coachingMois}&nbsp;€</strong><span>/ mois TTC</span><span>Premier mois offert</span></p>
          <div className={styles.actions}>
            <TrialButton location="coaching_hero" />
            <a className={styles.textLink} href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { source: 'coaching_hero', page: window.location.pathname })}><MessageCircle size={17} aria-hidden="true" />Échanger sur WhatsApp</a>
          </div>
          <p className={styles.heroNote}>Premier mois offert · Sans engagement · Réponse sous 24 h</p>
        </div>
        <figure className={styles.protocol} data-reveal>
          <div className={styles.protocolHeader}><span>Votre saison, accompagnée</span><CalendarDays size={19} strokeWidth={1.4} aria-hidden="true" /></div>
          <div className={styles.protocolIntro}><p>Un cap pour chaque étape.</p><span>Exemple de calendrier personnalisé</span></div>
          <ol className={styles.protocolList}>{SAMPLE_PROTOCOL.map(item => <li key={item.date}><span>{item.date}</span><p>{item.action}</p></li>)}</ol>
          <figcaption>Exemple illustratif. Les dates, les produits et les doses sont définis pour votre gazon, selon le sol et la météo.</figcaption>
          <div className={styles.protocolFooter}><span>Le coaching Hanami</span><p><strong>{PRICING_DISPLAY.coachingMois}&nbsp;€</strong><span>/ mois TTC</span></p></div>
        </figure>
      </div>
      <div className={`${styles.container} ${styles.heroBottom}`}><span>Vous faites. Hanami vous accompagne.</span><a href="#coaching-tarif">Découvrir l’offre<ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </section>

    <section id="coaching-tarif" className={styles.pricing} aria-labelledby="coaching-price-title">
      <div className={`${styles.container} ${styles.pricingGrid}`}>
        <div data-reveal>
          <p className={styles.eyebrow}>Une offre, un suivi toute l’année</p>
          <h2 id="coaching-price-title">Votre jardin.<br /><em>Un accompagnement continu.</em></h2>
          <p className={styles.trialNote}><Check size={16} aria-hidden="true" />Premier mois d’essai offert</p>
          <p className={styles.price} data-coaching-price><span className={styles.amount}>{PRICING_DISPLAY.coachingMois}&nbsp;€</span><span className={styles.priceUnit}>/ mois <span>TTC</span></span></p>
          <p className={styles.priceTerms}>Après votre mois d’essai, sans engagement.<br />Ou {PRICING_DISPLAY.coachingAnnuel}&nbsp;€ / an TTC, soit deux mois offerts.</p>
          <p className={styles.pricePromise}>Le bon produit. La bonne dose. Le bon moment.</p>
          <p className={styles.priceDescription}>Un plan adapté à votre gazon et des conseils pour éviter les achats inutiles. Vous avancez à votre rythme, avec Hanami à vos côtés.</p>
          <TrialButton location="coaching_price" light />
        </div>
        <div className={styles.includedPanel} data-reveal>
          <p className={styles.panelLabel}>Inclus dans votre coaching</p>
          <div className={styles.priceFacts}><div><strong>12 mois</strong><span>de protocole personnalisé</span></div><div><strong>Illimité</strong><span>suivi et ajustements</span></div></div>
          <ul>{SERVICES.coaching.inclus.map(item => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>
          <p className={styles.panelFootnote}>100 % en ligne · Pour entretenir vous-même votre jardin</p>
        </div>
      </div>
    </section>

    <section className={styles.included} aria-labelledby="coaching-included-title">
      <div className={styles.container}>
        <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>Les bons gestes, simplement</p><h2 id="coaching-included-title">Un protocole précis.<br /><em>Des conseils à chaque étape.</em></h2></div><p>Vous gardez la main sur votre jardin. Hanami vous aide à choisir, à doser et à agir au bon moment, sans multiplier les produits.</p></div>
        <div className={styles.pillars}>{[
          { title: 'Votre gazon, zone par zone.', text: 'Le plan et les recommandations tiennent compte des différentes surfaces, de l’exposition et de l’état de votre pelouse.' },
          { title: 'Une saison préparée.', text: 'La nutrition, la tonte et le regarnissage s’inscrivent dans un calendrier. Les séquences évoluent avec votre gazon et la météo.' },
          { title: 'Un échange direct.', text: 'Vous posez vos questions, vous partagez vos photos. Je vous explique les bons gestes et j’ajuste les conseils quand c’est nécessaire.' },
        ].map((item, index) => <article key={item.title} data-reveal><span className={styles.number}>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </div>
    </section>

    <section className={styles.process} aria-labelledby="coaching-process-title">
      <div className={styles.container}>
        <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>Comment ça marche</p><h2 id="coaching-process-title">Vous faites le premier pas.<br /><em>On prépare la suite.</em></h2></div><p>Le coaching se déroule entièrement à distance. Pour une intervention réalisée par Hanami, découvrez les <a href="/interventions-locales">offres locales</a>.</p></div>
        <ol className={styles.processGrid}>{steps.map((step, index) => <li key={step.title} data-reveal><div className={styles.stepTop}><step.icon size={24} strokeWidth={1.4} aria-hidden="true" /><span className={styles.number}>0{index + 1}</span></div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
        <div className={styles.processAction}><TrialButton location="coaching_steps" /></div>
      </div>
    </section>
  </>
}

'use client'

import { ArrowUpRight, CalendarDays, Check, MessageCircle } from 'lucide-react'
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
  { title: 'Vous montrez votre jardin.', text: 'Quelques photos de votre gazon et cinq questions. Nous faisons le point sur le sol, la densité, l’exposition et vos habitudes.' },
  { title: 'Vous recevez votre protocole.', text: 'Votre plan zone par zone et un calendrier sur douze mois : quoi appliquer, à quelle date et à quelle dose.' },
  { title: 'Vous avancez. On ajuste.', text: 'Un doute, une météo qui change ou une zone qui jaunit : nous adaptons le protocole ensemble, toute l’année.' },
]

function TrialButton({ location, light = false }: { location: string; light?: boolean }) {
  return <a href="#contact" className={light ? styles.lightButton : styles.button} onClick={() => track('cta_click', { location, page: window.location.pathname })}>
    Profiter de l’offre de lancement<ArrowUpRight size={18} aria-hidden="true" />
  </a>
}

export default function CoachingContent() {
  return <>
    <section className={styles.hero} aria-labelledby="coaching-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>Coaching gazon · Partout en France</p>
          <a href="#coaching-offre" className={styles.annualHighlight} onClick={() => track('cta_click', { location: 'coaching_hero_offer', page: window.location.pathname })}>
            <span><strong>Offre de lancement</strong><span>Deux mois de coaching offerts pour commencer</span></span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <h1 id="coaching-title">Améliorer votre gazon.<br /><em>Deux mois offerts.</em></h1>
          <p className={styles.intro}>Quoi faire, avec quel produit, comment et quand : je prépare les premières actions adaptées à votre gazon et à la saison. Vous réalisez les gestes, je vous guide pendant deux mois.</p>
          <p className={styles.heroOffer}><strong>0&nbsp;€</strong><span>pendant 2 mois</span><span>Puis à partir de {PRICING_DISPLAY.coachingMois}&nbsp;€ / mois TTC ou de {PRICING_DISPLAY.coachingAnnuel}&nbsp;€ / an TTC</span></p>
          <div className={styles.actions}>
            <TrialButton location="coaching_hero" />
            <a className={styles.textLink} href="https://wa.me/33667277614" target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { source: 'coaching_hero', page: window.location.pathname })}><MessageCircle size={17} aria-hidden="true" />Échanger sur WhatsApp</a>
          </div>
          <p className={styles.heroNote}>Offre temporaire pour les nouveaux abonnés · Réponse sous 24 h<br />Démarrage confirmé ensemble selon les disponibilités.</p>
        </div>
        <figure className={styles.protocol} data-reveal>
          <div className={styles.protocolHeader}><span>Votre saison, accompagnée</span><CalendarDays size={19} strokeWidth={1.4} aria-hidden="true" /></div>
          <div className={styles.protocolIntro}><p>Un cap pour chaque étape.</p><span>Exemple de calendrier personnalisé</span></div>
          <ol className={styles.protocolList}>{SAMPLE_PROTOCOL.map(item => <li key={item.date}><span>{item.date}</span><p>{item.action}</p></li>)}</ol>
          <figcaption>Exemple illustratif. Les dates, les produits et les doses sont définis pour votre gazon, selon le sol et la météo.</figcaption>
          <div className={styles.protocolFooter}><span>Après vos 2 mois offerts</span><p><span>À partir de</span><strong>{PRICING_DISPLAY.coachingMois}&nbsp;€</strong><span>/ mois TTC</span></p></div>
        </figure>
      </div>
      <div className={`${styles.container} ${styles.heroBottom}`}><span>Vous faites. Hanami vous accompagne.</span><a href="#coaching-tarif">Découvrir l’offre<ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </section>

    <section className={styles.launchValue} aria-labelledby="coaching-launch-value-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>Un projet qui mérite les bons conseils</p>
        <h2 id="coaching-launch-value-title">Une rénovation peut coûter cher.<br /><em>Commencez avec le bon accompagnement.</em></h2>
        <div className={styles.valueGrid}>
          <article className={styles.workValue}>
            <p className={styles.valueLabel}>Faire réaliser la rénovation</p>
            <p className={styles.valueAmount}>{(PRICING_DISPLAY.expressMinM2 * 350).toLocaleString('fr-FR')} à {(PRICING_DISPLAY.expressMinM2 * 500).toLocaleString('fr-FR')}&nbsp;€<span>TTC · exemple de budget</span></p>
            <p>Une prestation réalisée pour vous représente vite plusieurs milliers d’euros selon la surface et les travaux.</p>
            <p className={styles.valueDetail}>Exemple Hanami : 350 à 500 m² à partir de {PRICING_DISPLAY.expressMinM2}&nbsp;€/m² TTC. Montants indicatifs, devis selon le terrain et la prestation. Ce repère ne constitue pas un tarif moyen des paysagistes.</p>
          </article>
          <article className={styles.guidanceValue}>
            <p className={styles.valueLabel}>Réaliser les gestes avec Hanami</p>
            <p className={styles.valueAmount}>0&nbsp;€<span>de coaching pendant 2 mois</span></p>
            <p>Pendant deux mois, le diagnostic, le protocole personnalisé et l’accompagnement sont offerts dans le cadre du lancement.</p>
            <ul>{['Quoi faire, étape par étape', 'Quels produits choisir et à quelle dose', 'Comment appliquer et quand intervenir', 'Quoi observer et comment ajuster'].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
            <p className={styles.valueDetail}>Vous réalisez les travaux. Les semences, produits et le matériel restent à votre charge.</p>
          </article>
        </div>
        <div className={styles.launchReason}>
          <div><p className={styles.eyebrow}>Le temps d’agir, puis de prendre du recul</p><h3>Pourquoi deux mois,<br />plutôt qu’un ?</h3></div>
          <div><p>Un mois permet déjà de se lancer. Nous avons choisi d’en offrir deux pour vous laisser le temps d’appliquer les premières étapes, d’observer la reprise du gazon et d’ajuster ce qui doit l’être.</p><p>Vous commencez par les actions utiles maintenant. Lorsque les conditions permettent un semis ou un regarnissage, nous le préparons ensemble. La pousse et les résultats dépendent de la saison, de la météo, du sol et de la réalisation des gestes.</p></div>
        </div>
        <div className={styles.launchAction}><TrialButton location="coaching_launch_value" /><p>Une offre de lancement temporaire,<br />pour les nouveaux abonnés en mensuel comme en annuel.</p></div>
      </div>
    </section>

    <section id="coaching-tarif" className={styles.pricing} aria-labelledby="coaching-price-title">
      <div className={`${styles.container} ${styles.pricingGrid}`}>
        <div data-reveal>
          <p className={styles.eyebrow}>Une offre, un suivi toute l’année</p>
          <h2 id="coaching-price-title">Votre jardin.<br /><em>Un accompagnement continu.</em></h2>
          <div id="coaching-offre" className={styles.annualOffer} aria-labelledby="coaching-offer-title">
            <p className={styles.annualLabel}>Offre de lancement · 2 mois de coaching offerts</p>
            <h3 id="coaching-offer-title">Deux mois pour agir,<br />observer et ajuster.</h3>
            <p className={styles.annualPromise}>Du diagnostic aux ajustements : je vous dis quoi faire, avec quels produits, comment les appliquer et quand intervenir. Vous améliorez votre gazon avec un cap précis et des conseils adaptés à la saison.</p>
            <p className={styles.annualSaving}>Cette offre de lancement est temporaire et n’a pas vocation à rester permanente. Réservée aux nouveaux abonnés, en mensuel comme en annuel. Les produits sont proposés séparément.</p>
            <TrialButton location="coaching_offer" />
            <p className={styles.offerTiming}>Les deux mois offerts commencent à l’envoi du premier protocole et s’écoulent en continu, même si vous reportez les actions.</p>
          </div>
          <p className={styles.trialNote}><Check size={16} aria-hidden="true" />Après vos 2 mois offerts, au choix :</p>
          <p className={styles.priceFrom}>À partir de</p>
          <p className={styles.price} data-coaching-price><span className={styles.amount}>{PRICING_DISPLAY.coachingMois}&nbsp;€</span><span className={styles.priceUnit}>/ mois <span>TTC</span></span></p>
          <p className={styles.priceTerms}>Formule mensuelle sans engagement.<br />Ou à partir de {PRICING_DISPLAY.coachingAnnuel}&nbsp;€ / an TTC en formule annuelle.<br />Tarif confirmé avant souscription selon l’accompagnement retenu.</p>
          <p className={styles.pricePromise}>Le bon produit. La bonne dose. Le bon moment.</p>
          <p className={styles.priceDescription}>Un plan adapté à votre gazon et des conseils pour éviter les achats inutiles. Vous avancez à votre rythme, avec Hanami à vos côtés.</p>
          <TrialButton location="coaching_price" light />
          <p className={styles.capacityNote}>Pour préserver la qualité du suivi, votre date de démarrage est confirmée ensemble selon les disponibilités.</p>
          <p className={styles.capacityNote}>Les gestes sont adaptés à la saison, à la météo et à votre terrain. Si la période ne se prête pas à une rénovation, le protocole prépare la prochaine fenêtre favorable ; la période offerte continue de s’écouler.</p>
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
        <ol className={styles.processGrid}>{steps.map((step, index) => <li key={step.title} data-reveal><span className={styles.number}>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
        <div className={styles.processAction}><TrialButton location="coaching_steps" /></div>
      </div>
    </section>
  </>
}

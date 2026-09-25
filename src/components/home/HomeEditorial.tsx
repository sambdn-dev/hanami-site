import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Check, CalendarDays, FlaskConical, ScanSearch, Sprout } from 'lucide-react'
import GrassField from '@/components/shared/GrassField'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'
import { getAllArticles, formatArticleDate } from '@/lib/blog'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import styles from './HomeEditorial.module.css'

const caseStudies = [
  {
    name: 'Susan D.', place: 'Le Vésinet', type: 'Rénovation', surface: '600 m²',
    before: '/images/avant-susan.jpg', after: '/images/apres-susan.jpg',
    text: 'Un jardin ombragé, une pelouse fatiguée. Après diagnostic, chaque intervention a trouvé sa place dans le calendrier.',
  },
  {
    name: 'Véronique P.', place: 'Coaching annuel', type: 'Accompagnement', surface: '170 m²',
    before: '/images/veronique-avant-photo-v2.jpg', after: '/images/veronique-apres-photo-v3.jpg',
    text: 'Un suivi pensé pour son jardin, ses habitudes et les saisons.',
  },
  {
    name: 'Noël P.', place: 'Produits professionnels', type: 'Produits adaptés', surface: '700 m²',
    before: '/images/noel-avant-photo-v2.jpg', after: '/images/noel-apres-photo-v3.jpg',
    text: 'Des produits et des quantités choisis pour la surface réelle.',
  },
] as const

const steps = [
  ['01', 'On regarde le vrai terrain', 'Photos, surface, exposition et historique : le diagnostic part de votre jardin, pas d’une recette.'],
  ['02', 'On choisit les bons gestes', 'Vous recevez un protocole clair avec les produits, les doses et les dates.'],
  ['03', 'On ajuste au fil des saisons', 'Vous avancez avec un expert qui suit l’évolution de votre pelouse.'],
] as const

export function HomeProof() {
  return (
    <section className={styles.proofStrip} aria-label="La différence Hanami">
      <div className={styles.container}>
        <div className={styles.proofGrid}>
          <div><span>01</span><strong>Diagnostic personnel</strong><p>Comprendre avant d’agir.</p></div>
          <div><span>02</span><strong>Timing précis</strong><p>Le bon geste à la bonne date.</p></div>
          <div><span>03</span><strong>Suivi à vos côtés</strong><p>Un plan qui évolue avec le jardin.</p></div>
        </div>
      </div>
    </section>
  )
}

export function HomeServices() {
  return (
    <section id="accompagnement" className={styles.section} aria-labelledby="approach-title">
      <div className={styles.container}>
        <div className={styles.sectionIntro} data-reveal>
          <div>
            <p className={styles.eyebrow}><span>01</span> / L’approche Hanami</p>
            <h2 id="approach-title" className={styles.title}>Vous voyez un gazon.<br /><em>Nous voyons son potentiel.</em></h2>
          </div>
          <p className={styles.introText}>Fini les conseils contradictoires et les produits achetés au hasard. Nous transformons vos questions en décisions simples, adaptées à votre terrain.</p>
        </div>
        <div className={styles.offerGrid}>
          <article className={styles.coachingOffer} data-reveal>
            <GrassField tone="dark" className={styles.offerGrass} />
            <div className={styles.offerTop}><span>01 / L’accompagnement signature</span><span>Partout en France</span></div>
            <div className={styles.offerMain}>
              <span className={styles.offerKicker}>COACHING GAZON</span>
              <h3 className={styles.offerTitle}>Vous prenez soin du jardin.<br /><em>Nous guidons chaque geste.</em></h3>
              <ul className={styles.benefits}>
                <li><Check size={18} aria-hidden="true" /> Diagnostic adapté à votre terrain</li>
                <li><Check size={18} aria-hidden="true" /> Protocole daté : gestes, doses et produits</li>
                <li><Check size={18} aria-hidden="true" /> Suivi et ajustements au fil des saisons</li>
              </ul>
            </div>
            <div className={styles.offerBottom}>
              <div><p className={styles.price}><strong>{PRICING_DISPLAY.coachingMois} €</strong><span>/ mois TTC</span></p><p className={styles.offerNote}>1ᵉʳ mois offert · Sans engagement</p></div>
              <Link className={styles.buttonLight} href="/coaching">Découvrir le coaching <ArrowUpRight size={19} aria-hidden="true" /></Link>
            </div>
            <p className={styles.productNote}>Produits proposés séparément selon les besoins de votre pelouse.</p>
          </article>
          <div className={styles.otherOffers}>
            <article className={styles.serviceCard} data-reveal data-reveal-delay="1">
              <div className={styles.serviceCardTop}><span>02 / Sur le terrain</span><Sprout size={29} strokeWidth={1.4} aria-hidden="true" /></div>
              <h3>Votre pelouse mérite<br /><em>un nouveau départ.</em></h3>
              <p>Rénovation, regarnissage ou intervention ponctuelle en Île-de-France. Un chantier dimensionné pour votre jardin.</p>
              <Link href="/mon-chantier" className={styles.textLink}>Estimer mon chantier <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </article>
            <article className={styles.serviceCard} data-reveal data-reveal-delay="2">
              <div className={styles.serviceCardTop}><span>03 / La juste dose</span><FlaskConical size={27} strokeWidth={1.4} aria-hidden="true" /></div>
              <h3>Le niveau pro.<br /><em>À l’échelle de votre jardin.</em></h3>
              <p>Semences, engrais et solutions sélectionnés puis reconditionnés pour la surface dont vous avez réellement besoin.</p>
              <a href="#contact" className={styles.textLink}>Être conseillé <ArrowUpRight size={18} aria-hidden="true" /></a>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeCaseStudies() {
  const [featured, ...more] = caseStudies
  return (
    <section id="resultats" className={styles.caseSection} aria-labelledby="case-title">
      <div className={styles.container}>
        <div className={styles.sectionIntro} data-reveal>
          <div><p className={styles.eyebrow}><span>02</span> / De vrais jardins</p><h2 id="case-title" className={styles.title}>La différence<br /><em>se voit.</em></h2></div>
          <p className={styles.introText}>Trois jardins, trois besoins différents. Glissez le curseur pour voir ce qui change quand la méthode s’adapte au terrain.</p>
        </div>
        <article className={styles.featuredCase} data-reveal>
          <div className={styles.featuredSlider}>
            <BeforeAfterSlider beforeSrc={featured.before} afterSrc={featured.after} beforeAlt="Pelouse de Susan avant rénovation" afterAlt="Pelouse de Susan après rénovation" beforeObjectPosition="center 72%" afterObjectPosition="center 72%" />
            <span className={styles.sliderHint}>Glissez pour comparer <ArrowDown size={14} aria-hidden="true" /></span>
          </div>
          <div className={styles.featuredText}>
            <p className={styles.eyebrow}>CAS 01 / {featured.type}</p>
            <h3>Le jardin a repris<br /><em>sa place.</em></h3>
            <p>{featured.text}</p>
            <div className={styles.caseNumbers}>
              <div><strong>{featured.surface}</strong><span>de pelouse</span></div>
              <div><strong>6 sem.</strong><span>premiers résultats</span></div>
            </div>
            <div className={styles.caseFooter}><span>{featured.name} · {featured.place}</span><span>Photos du chantier réel</span></div>
          </div>
        </article>
        <div className={styles.moreCases}>
          {more.map((study, index) => (
            <article className={styles.miniCase} key={study.name} data-reveal data-reveal-delay={String(index + 1)}>
              <div className={styles.miniSlider}><BeforeAfterSlider beforeSrc={study.before} afterSrc={study.after} beforeAlt={`Pelouse de ${study.name} avant`} afterAlt={`Pelouse de ${study.name} après`} /></div>
              <div className={styles.miniCaseInfo}><span>{study.name}<small>{study.place}</small></span><strong>{study.surface}</strong></div>
              <p>{study.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeProcess() {
  return (
    <section className={styles.processSection} aria-labelledby="process-title">
      <div className={styles.container}>
        <div className={styles.processLayout}>
          <div data-reveal>
            <p className={styles.eyebrow}><span>03</span> / La méthode Hanami</p>
            <h2 id="process-title" className={styles.title}>Un plan précis.<br /><em>Un jardin vivant.</em></h2>
            <p className={styles.processIntro}>Vous savez quoi faire maintenant, ce qui peut attendre et pourquoi. La méthode évolue avec votre pelouse.</p>
            <ol className={styles.steps}>
              {steps.map(([number, title, body]) => <li key={number} className={styles.step}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}
            </ol>
            <Link href="/coaching" className={styles.textLink}>Explorer le coaching <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className={styles.protocolScene} data-reveal data-reveal-delay="1">
            <div className={styles.protocolOrbit} aria-hidden="true" />
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardHead}><span>HANAMI / VOTRE PROTOCOLE</span><ScanSearch size={23} strokeWidth={1.4} aria-hidden="true" /></div>
              <div className={styles.protocolCardTitle}><span>EXEMPLE DE PARCOURS</span><h3>Chaque geste<br />a son moment.</h3></div>
              <div className={styles.protocolLine}><span className={styles.protocolIcon}><ScanSearch size={18} aria-hidden="true" /></span><div><small>ÉTAPE 01</small><strong>Diagnostic du terrain</strong><p>Comprendre le sol, l’exposition, la densité.</p></div><span>✓</span></div>
              <div className={styles.protocolLine}><span className={styles.protocolIcon}><CalendarDays size={18} aria-hidden="true" /></span><div><small>ÉTAPE 02</small><strong>Intervention au bon moment</strong><p>La bonne action, la bonne dose, la bonne date.</p></div><span>→</span></div>
              <div className={styles.protocolLine}><span className={styles.protocolIcon}><Sprout size={18} aria-hidden="true" /></span><div><small>ÉTAPE 03</small><strong>Suivi de la repousse</strong><p>Observer et ajuster au fil des saisons.</p></div><span>→</span></div>
              <div className={styles.protocolCardFoot}><span>DIAGNOSTIC → DÉCISION → SUIVI</span><Image src="/brand/2026/icone-h-cercle-vert.png" alt="" width={30} height={30} aria-hidden="true" /></div>
            </div>
            <span className={styles.protocolFloating}>Le bon conseil, au bon moment.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeClientPreview() {
  return (
    <section className={styles.clientSection} aria-labelledby="client-preview-title">
      <div className={styles.container}>
        <div className={styles.clientCopy} data-reveal>
          <p className={styles.eyebrow}><span>04</span> / Le coaching au quotidien</p>
          <h2 id="client-preview-title" className={styles.title}>Votre plan.<br /><em>Toujours sous les yeux.</em></h2>
          <p>Dans votre espace client particuliers, retrouvez les prochaines étapes, les bonnes doses, les photos de votre jardin et vos échanges avec Hanami.</p>
          <div className={styles.clientTags}><span>Plan d’action</span><span>Calendrier</span><span>Messages</span><span>Photos</span></div>
          <Link href="/coaching" className={styles.textLink}>Voir le coaching en détail <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <figure className={styles.clientScreen} data-reveal data-reveal-delay="1">
          <div className={styles.clientScreenFrame}><Image src="/landing/screens/dashboard.webp" alt="Aperçu illustratif de l’espace client Hanami pour les particuliers, avec plan d’action et conseils gazon" fill sizes="(max-width: 767px) 100vw, 55vw" /></div>
          <figcaption>APERÇU ILLUSTRATIF · ESPACE CLIENT PARTICULIERS</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function HomeTestimonials() {
  return (
    <section className={styles.manifesto} aria-labelledby="manifesto-title">
      <GrassField tone="dark" className={styles.manifestoGrass} />
      <div className={styles.container}>
        <div className={styles.manifestoTop} data-reveal><span>HANAMI / LA CONVICTION</span><span>LE VÉSINET · PARTOUT EN FRANCE</span></div>
        <div className={styles.manifestoGrid}>
          <h2 id="manifesto-title" data-reveal>La nature n’a pas de recette universelle.<br /><em>Nous non plus.</em></h2>
          <div data-reveal data-reveal-delay="1"><p>Ce qui transforme un gazon, ce n’est pas une liste de conseils. C’est la bonne décision, prise au bon moment, pour ce jardin précis.</p><a href="#contact" className={styles.manifestoLink}>Parlons de votre pelouse <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  )
}

export function HomeJournal() {
  const articles = getAllArticles().slice(0, 3)
  if (articles.length === 0) return null
  return (
    <section className={styles.journalSection} aria-labelledby="journal-title">
      <div className={styles.container}>
        <div className={styles.journalHeader} data-reveal><div><p className={styles.eyebrow}><span>05</span> / Le journal Hanami</p><h2 id="journal-title" className={styles.title}>Savoir lire<br /><em>son jardin.</em></h2></div><Link href="/blog" className={styles.textLink}>Tous les articles <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className={styles.articleGrid}>
          {articles.map((article, index) => <article key={article.slug} data-reveal data-reveal-delay={String(index + 1)}><Link href={'/blog/' + article.slug} className={styles.article}><div className={styles.articlePhoto}>{article.cover ? <Image src={article.cover} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" /> : null}<span>Lire l’article <ArrowUpRight size={16} aria-hidden="true" /></span></div><div className={styles.articleMeta}><span>{article.category}</span><time dateTime={article.date}>{formatArticleDate(article.date)}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p></Link></article>)}
        </div>
      </div>
    </section>
  )
}

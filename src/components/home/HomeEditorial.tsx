import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, Sprout, FlaskConical } from 'lucide-react'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'
import { getAllArticles, formatArticleDate } from '@/lib/blog'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import styles from './HomeEditorial.module.css'

const caseStudies = [
  {
    name: 'Susan D.',
    place: 'Le Vésinet',
    type: 'Rénovation',
    surface: '600 m²',
    title: 'Une pelouse qui retrouve sa place dans le jardin.',
    body: 'Diagnostic du terrain, rénovation adaptée aux zones ombragées et suivi au fil des saisons. Premiers résultats visibles en six semaines.',
    before: '/images/avant-susan.jpg',
    after: '/images/apres-susan.jpg',
    result: '6 semaines',
  },
]

const steps = [
  ['01', 'Vous nous racontez', 'Quelques photos, une surface approximative et ce que vous observez dans votre jardin.'],
  ['02', 'Nous analysons', 'Nous regardons l’état du gazon, son contexte et les causes possibles avant de proposer une réponse.'],
  ['03', 'Vous avez un cap', 'Un protocole clair : les gestes, les produits, les doses et les bonnes dates.'],
  ['04', 'Nous restons à vos côtés', 'Le suivi permet d’ajuster les décisions au fil des saisons et de l’évolution de la pelouse.'],
] as const

const testimonials = [
  {
    quote: 'Un paysagiste était venu il y a 2 ans, mais les résultats n’ont pas duré. J’avais peur de mal faire et de perdre encore du temps et de l’argent. Le diagnostic a tout changé.',
    name: 'Luc',
    place: 'Nouvelle-Aquitaine',
  },
  {
    quote: 'Je ne savais pas par où commencer. Après l’envoi de mes photos, j’ai reçu toutes les étapes et les produits professionnels pour arriver à un résultat dont je suis fière, et mes enfants aussi.',
    name: 'Joséphine',
    place: 'Île-de-France',
  },
  {
    quote: 'Récent propriétaire, je n’avais pas le budget pour un paysagiste. J’ai trouvé une solution abordable et clé en main pour le faire moi-même.',
    name: 'Guy',
    place: 'Occitanie',
  },
]

export function HomeServices() {
  return (
    <section id="accompagnement" className={styles.section} aria-labelledby="approach-title">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>01 / Votre pelouse, notre expertise</p>
            <h2 id="approach-title" className={styles.title}>Moins d’hésitations.<br />Plus de jardin.</h2>
          </div>
          <p className={styles.introText}>Un gazon clairsemé, des conseils qui se contredisent…
            Hanami vous aide à comprendre votre terrain et à savoir quoi faire, quand le faire et pourquoi.</p>
        </div>
        <div className={styles.offerGrid}>
          <div className={styles.coachingOffer}>
            <span className={styles.offerBlades} aria-hidden="true" />
            <div className={styles.offerTop}>
              <p className={styles.eyebrow}>Le coaching Hanami</p>
              <span>À distance · Partout en France</span>
            </div>
            <h3 className={styles.offerTitle}>Vous prenez soin du jardin.<br /><em>Nous vous guidons.</em></h3>
            <ul className={styles.benefits}>
              <li><Check size={17} aria-hidden="true" /> Un diagnostic adapté à votre terrain</li>
              <li><Check size={17} aria-hidden="true" /> Un protocole précis : gestes, doses et dates</li>
              <li><Check size={17} aria-hidden="true" /> Un suivi et des ajustements au fil des saisons</li>
            </ul>
            <div className={styles.offerBottom}>
              <div>
                <p className={styles.price}><strong>{PRICING_DISPLAY.coachingMois} €</strong> / mois TTC</p>
                <p className={styles.offerNote}>1ᵉʳ mois offert · Sans engagement</p>
              </div>
              <Link className={styles.buttonLight} href="/coaching">
                Découvrir l’accompagnement <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.productNote}>Les produits sont proposés séparément, selon les besoins de votre pelouse.</p>
          </div>
          <div className={styles.otherOffers}>
            <article className={styles.serviceCard}>
              <span className={styles.serviceIcon}><Sprout size={25} strokeWidth={1.3} aria-hidden="true" /></span>
              <p className={styles.eyebrow}>Sur le terrain · Île-de-France</p>
              <h3>Un nouveau départ<br />pour votre pelouse.</h3>
              <p>Rénovation, regarnissage ou intervention ponctuelle : un chantier dimensionné pour votre jardin.</p>
              <Link href="/mon-chantier" className={styles.textLink}>Estimer mon projet <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </article>
            <article className={styles.serviceCard}>
              <span className={styles.serviceIcon}><FlaskConical size={24} strokeWidth={1.3} aria-hidden="true" /></span>
              <p className={styles.eyebrow}>La juste dose</p>
              <h3>Des produits professionnels.<br />À l’échelle de votre jardin.</h3>
              <p>Semences, engrais et solutions sélectionnés, reconditionnés au format de votre surface.</p>
              <a href="#contact" className={styles.textLink}>Être conseillé <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeCaseStudies() {
  return (
    <section className={styles.caseSection} aria-labelledby="case-title">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>02 / Des histoires de jardins</p>
            <h2 id="case-title" className={styles.title}>Des résultats qui se voient.</h2>
          </div>
          <p className={styles.introText}>Un jardin du Vésinet, deux photos de chantier, un accompagnement pensé pour son terrain. Faites glisser les images pour voir son évolution.</p>
        </div>
        <div className={styles.caseList}>
          {caseStudies.map((study) => (
            <article className={styles.caseRow} key={study.name}>
              <div className={styles.caseText}>
                <p className={styles.eyebrow}>{study.type} · {study.surface}</p>
                <h3>{study.title}</h3>
                <p>{study.body}</p>
                <div className={styles.caseStats}>
                  <div><strong>{study.surface}</strong><span>de pelouse</span></div>
                  <div><strong>{study.result}</strong><span>premiers résultats</span></div>
                </div>
                <p className={styles.caseAttribution}>{study.name} · {study.place}</p>
              </div>
              <div className={styles.comparison}>
                <BeforeAfterSlider beforeSrc={study.before} afterSrc={study.after}
                  beforeAlt={'Pelouse avant intervention Hanami — ' + study.name}
                  afterAlt={'Pelouse après intervention Hanami — ' + study.name} />
                <p>Avant / Après · Photos du chantier réel</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeProcess() {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.container}>
        <div className={styles.processLayout}>
          <div className={styles.processHeader}>
            <p className={styles.eyebrow}>03 / La méthode Hanami</p>
            <h2 id="process-title" className={styles.title}>Une méthode claire.<br />À votre rythme.</h2>
            <p>Vous savez ce qu’il faut faire aujourd’hui, et ce qui peut attendre la bonne saison.</p>
            <Link href="/coaching" className={styles.textLink}>Découvrir le coaching <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <figure className={styles.processFigure}>
              <Image src="/brand/2026/ambiance-gazon-rosée-fictif.png" alt="Gros plan illustratif sur des brins de gazon couverts de rosée" fill sizes="(max-width: 767px) calc(100vw - 40px), 440px" />
              <figcaption>Visuel d’ambiance illustratif</figcaption>
            </figure>
          </div>
          <ol className={styles.steps}>
            {steps.map(([number, title, body]) => (
              <li key={number} className={styles.step}>
                <span>{number}</span><div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function HomeTestimonials() {
  return (
    <section className={styles.testimonials} aria-labelledby="testimonials-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>04 / La parole aux clients</p>
        <h2 id="testimonials-title" className={styles.title}>Leur jardin, leur expérience.</h2>
        <div className={styles.quoteGrid}>
          {testimonials.map((item) => (
            <figure className={styles.quote} key={item.name}>
              <span aria-hidden="true">“</span>
              <blockquote>{item.quote}</blockquote>
              <figcaption><strong>{item.name}</strong>{item.place} · Coaching 12 mois</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeJournal() {
  const articles = getAllArticles().slice(0, 3)
  if (articles.length === 0) return null
  return (
    <section className={styles.section} aria-labelledby="journal-title">
      <div className={styles.container}>
        <div className={styles.journalHeader}>
          <div><p className={styles.eyebrow}>05 / Le journal Hanami</p>
            <h2 id="journal-title" className={styles.title}>Le bon geste au bon moment.</h2></div>
          <Link href="/blog" className={styles.textLink}>Tous les articles <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.articleGrid}>
          {articles.map((article) => (
            <article key={article.slug}>
              <Link href={'/blog/' + article.slug} className={styles.article}>
                <div className={styles.articlePhoto}>
                  {article.cover ? <Image src={article.cover} alt="" fill sizes="(max-width: 767px) calc(100vw - 40px), 33vw" /> : null}
                </div>
                <div className={styles.articleMeta}><span>{article.category}</span><time dateTime={article.date}>{formatArticleDate(article.date)}</time></div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className={styles.textLink}>Lire l’article <ArrowUpRight size={17} aria-hidden="true" /></span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

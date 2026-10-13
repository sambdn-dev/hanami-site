import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'
import { ArrowUpRight, Eye, MapPin } from 'lucide-react'
import { SHOWCASE_GARDENS, showcaseDirectionsUrl } from '@/lib/showcase-gardens'
import styles from './LocalSite.module.css'

export default function LocalProof() {
  return (
    <section className={styles.proof} aria-labelledby="local-proof-title">
      <div className={styles.container}>
        <div className={styles.proofStory}>
          <div className={styles.proofCopy}>
            <p className={styles.eyebrow}>Un jardin, une histoire réelle</p>
            <h2 id="local-proof-title">La méthode prend<br /><em>racine chez vous.</em></h2>
            <p>Au Vésinet, le jardin de Susan a retrouvé sa place. Une rénovation adaptée au terrain, puis un accompagnement au fil des saisons.</p>
            <div className={styles.proofDetails}><span><strong>600 m²</strong>de pelouse</span><span><strong>Le Vésinet</strong>réalisation Hanami</span></div>
            <a href="#contact">Parlons de votre pelouse <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <figure className={styles.proofImage}>
            <BeforeAfterSlider beforeSrc="/images/avant-susan.jpg" afterSrc="/images/apres-susan.jpg" beforeAlt="Jardin de Susan avant la rénovation Hanami" afterAlt="Jardin de Susan après la rénovation Hanami" beforeObjectPosition="center 43%" afterObjectPosition="center 88%" afterTransform="scale(1.08)" afterTransformOrigin="center 15%" />
            <figcaption>Photographies du chantier · Glissez pour comparer · Chaque jardin évolue à son rythme.</figcaption>
          </figure>
        </div>
        <div id="vitrines" className={styles.showcases} aria-labelledby="showcase-title">
          <div className={styles.showcaseHeading}>
            <div>
              <p className={styles.eyebrow}>{SHOWCASE_GARDENS.length > 1 ? `${SHOWCASE_GARDENS.length} vitrines locales` : 'La vitrine Hanami'}</p>
              <h3 id="showcase-title">Voyez le gazon,<br />en vrai.</h3>
            </div>
            <p>{SHOWCASE_GARDENS.length > 1 ? 'Des pelouses que j’ai rénovées, à découvrir depuis la rue.' : 'Ma pelouse de référence, à découvrir depuis la rue.'} Un détour lors de votre prochaine promenade pour voir le résultat par vous-même.</p>
          </div>
          <div className={`${styles.showcaseGrid} ${SHOWCASE_GARDENS.length === 1 ? styles.showcaseSingle : ''}`}>
            {SHOWCASE_GARDENS.map((garden, index) => (
              <article key={garden.id} className={styles.showcaseCard}>
                <div className={styles.showcaseCardTop}>
                  <span>Vitrine {String(index + 1).padStart(2, '0')}</span>
                  <MapPin size={20} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <p className={styles.showcaseKind}>{garden.kind}</p>
                <h4>{garden.name}</h4>
                <address>{garden.street}<br />{garden.postalCode} {garden.city}</address>
                <a
                  href={showcaseDirectionsUrl(garden)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Voir l’itinéraire vers ${garden.name}, ${garden.street}, ${garden.city}`}
                >
                  Voir l’itinéraire <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          <p className={styles.showcaseStreetNote}><Eye size={16} aria-hidden="true" />Les jardins s’observent depuis la rue, en restant sur l’espace public.</p>
        </div>
      </div>
    </section>
  )
}

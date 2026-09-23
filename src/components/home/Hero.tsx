'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { track } from '@/lib/analytics'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import styles from './HomeEditorial.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Hanami · L’expertise au naturel</p>
            <h1 id="home-title" className={styles.heroTitle}>
              Des pelouses<br /> plus belles,<br /> <em>durablement.</em>
            </h1>
            <div className={styles.shortRule} aria-hidden="true" />
            <p className={styles.heroDescription}>
              Votre jardin est unique. Son accompagnement aussi.
              Un expert vous guide avec les bons gestes, les bons produits, au bon moment.
            </p>
            <div className={styles.heroActions}>
              <Link href="/coaching" className={styles.button}
                onClick={() => track('cta_click', { location: 'hero_primary', page: '/' })}>
                Découvrir le coaching <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/mon-chantier" className={styles.textLink}
                onClick={() => track('cta_click', { location: 'hero_secondary', page: '/' })}>
                Estimer mon chantier <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.reassurance}>
              1ᵉʳ mois offert · Puis {PRICING_DISPLAY.coachingMois} €/mois · Sans engagement
            </p>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroPhoto}>
              <Image src="/images/apres-susan.jpg"
                alt="La pelouse de Susan au Vésinet après rénovation Hanami"
                fill preload sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 610px"
                className={styles.coverPhoto} />
              <span className={styles.photoLabel}>Un vrai jardin accompagné par Hanami</span>
              <span className={styles.photoBlades} aria-hidden="true" />
            </div>
            <figcaption className={styles.heroCaption}>
              <span>Le Vésinet <span aria-hidden="true">—</span> jardin de Susan</span>
              <span className={styles.mono}>600 m²</span>
            </figcaption>
          </figure>
        </div>
        <div className={styles.heroFoot}>
          <p>Nature <span>·</span> Expertise <span>·</span> Résultats durables</p>
          <a href="#accompagnement" className={styles.textLink}>L’approche Hanami <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}

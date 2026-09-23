'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import GrassField from '@/components/shared/GrassField'
import { track } from '@/lib/analytics'
import styles from './HomeEditorial.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroAura} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}><span className={styles.heroEyebrowLine} /> Hanami · L’expert de votre gazon</p>
            <h1 id="home-title" className={styles.heroTitle}>
              Tout change<br />au bon<br /><em>moment.</em>
            </h1>
            <p className={styles.heroDescription}>
              Un diagnostic pour comprendre. Un protocole daté pour agir. Un expert à vos côtés pour faire de votre pelouse le cœur du jardin.
            </p>
            <div className={styles.heroActions}>
              <Link href="/coaching" className={styles.heroButton}
                onClick={() => track('cta_click', { location: 'hero_primary', page: '/' })}>
                Découvrir le coaching <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <a href="#resultats" className={styles.heroTextLink}>Voir les résultats <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
            <div className={styles.heroMicroProof}>
              <span className={styles.heroMicroMark}>H.</span>
              <span>Votre pelouse est unique.<br />Votre plan doit l’être aussi.</span>
            </div>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroPhoto}>
              <Image src="/images/apres-susan.jpg" alt="Pelouse rénovée de Susan D. au Vésinet, entourée d’arbres" fill preload sizes="(max-width: 767px) 100vw, 50vw" className={styles.coverPhoto} />
              <span className={styles.heroPhotoShade} aria-hidden="true" />
              <span className={styles.heroPhotoTop}>01 / Une histoire de jardin</span>
              <figcaption className={styles.heroPhotoCaption}>
                <span>Le jardin de Susan D.<small>Le Vésinet · Rénovation réelle</small></span>
                <strong>600 <small>m²</small></strong>
              </figcaption>
            </div>
          </figure>
        </div>
        <div className={styles.heroBottom}>
          <span>Diagnostic · Décision · Résultat</span>
          <a href="#accompagnement">Explorer l’approche <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </div>
      <GrassField tone="dark" className={styles.heroGrass} />
    </section>
  )
}

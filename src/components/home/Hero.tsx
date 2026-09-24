'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Maximize2 } from 'lucide-react'
import GrassField from '@/components/shared/GrassField'
import PhotoLightbox from '@/components/shared/PhotoLightbox'
import { track } from '@/lib/analytics'
import styles from './HomeEditorial.module.css'

export default function Hero() {
  const [photoOpen, setPhotoOpen] = useState(false)
  return (
    <><section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroAura} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}><span className={styles.heroEyebrowLine} /> Hanami · Coaching gazon sur mesure</p>
            <h1 id="home-title" className={styles.heroTitle}>
              Votre gazon<br /><em>mérite un expert.</em>
            </h1>
            <p className={styles.heroDescription}>
              Un diagnostic pour comprendre. Un protocole daté pour agir. Un accompagnement précis pour faire de votre pelouse le cœur du jardin.
            </p>
            <div className={styles.heroActions}>
              <Link href="/coaching" className={styles.heroButton}
                onClick={() => track('cta_click', { location: 'hero_primary', page: '/' })}>
                Découvrir le coaching <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <a href="#resultats" className={styles.heroTextLink}>Voir les résultats <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
            <div className={styles.heroMicroProof}>
              <Image src="/brand/2026/icone-h-cercle-vert.png" alt="" width={42} height={42} className={styles.heroMicroMark} aria-hidden="true" />
              <span>Votre pelouse est unique.<br />Votre plan doit l’être aussi.</span>
            </div>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroPhoto}>
              <Image src="/images/apres-susan.jpg" alt="Pelouse rénovée de Susan D. au Vésinet, entourée d’arbres" fill loading="eager" sizes="(max-width: 767px) 100vw, 50vw" className={styles.coverPhoto} />
              <button className={styles.heroPhotoOpen} type="button" onClick={() => setPhotoOpen(true)} aria-label="Agrandir la photo du jardin de Susan D." />
              <span className={styles.heroPhotoShade} aria-hidden="true" />
              <span className={styles.heroPhotoTop}>01 / Une histoire de jardin</span>
              <span className={styles.heroPhotoZoom}><Maximize2 size={16} aria-hidden="true" /> Agrandir le jardin</span>
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
    </section><PhotoLightbox src={photoOpen ? '/images/apres-susan.jpg' : null} caption="Le jardin de Susan D. · Le Vésinet · 600 m²" onClose={() => setPhotoOpen(false)} /></>
  )
}

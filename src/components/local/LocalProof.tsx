import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'
import { ArrowUpRight } from 'lucide-react'
import styles from './LocalSite.module.css'

export default function LocalProof() {
  return (
    <section className={styles.proof} aria-labelledby="local-proof-title">
      <div className={styles.container}>
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
    </section>
  )
}

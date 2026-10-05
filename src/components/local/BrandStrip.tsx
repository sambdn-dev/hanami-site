import Image from 'next/image'
import styles from './BrandStrip.module.css'

const brands = [
  { name: 'Barenbrug', url: 'https://www.barenbrug.fr/', image: '/brand/partners/barenbrug.svg', width: 247, height: 28 },
  { name: 'Frayssinet', url: 'https://frayssinet.fr/fr/', image: '/brand/partners/frayssinet.png', width: 191, height: 80 },
  { name: 'ICL', url: 'https://icl-growingsolutions.com/fr-fr/turf-landscape/', image: '/brand/partners/icl.svg', width: 85, height: 33 },
  { name: 'COMPO EXPERT', url: 'https://www.compo-expert.com/fr-FR', image: '/brand/partners/compo-expert.svg', width: 714, height: 768 },
]

export default function BrandStrip() {
  return (
    <section className={styles.section} aria-labelledby="brands-title">
      <div className={styles.container}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>SEMENCES / NUTRITION / VIE DU SOL</p>
          <h2 id="brands-title">Les marques que j’utilise.</h2>
          <p>Je sélectionne des références de gammes professionnelles non disponibles en jardinerie, à un coût sensiblement équivalent. Chaque produit est choisi selon votre gazon, la saison et les apports déjà réalisés.</p>
        </div>
        <div className={styles.brands}>
          {brands.map(brand => <a key={brand.name} href={brand.url} target="_blank" rel="noopener noreferrer" aria-label={`${brand.name}, site du fabricant (nouvel onglet)`}>
            {brand.image ? <Image src={brand.image} width={brand.width} height={brand.height} alt={brand.name} className={styles.logo} /> : <span className={styles.brandName}>{brand.name}</span>}
          </a>)}
        </div>
        <div className={styles.standards}>
          <blockquote className={styles.appreciation}>
            <p>« À coût sensiblement équivalent, je considère ces produits trois à quatre fois plus qualitatifs que ceux proposés en jardinerie. »</p>
            <footer>MON APPRÉCIATION, ISSUE DU TERRAIN</footer>
          </blockquote>
          <div className={styles.ambition}>
            <p className={styles.ambitionLabel}>L’AMBITION HANAMI</p>
            <p>La qualité des plus beaux terrains de sport et des plus beaux golfs, <em>chez vous.</em></p>
          </div>
        </div>
        <p className={styles.note}>Semences adaptées, fertilisation de fond, compléments foliaires et amendements : chaque référence trouve sa place dans un programme préparé pour votre jardin.</p>
      </div>
    </section>
  )
}

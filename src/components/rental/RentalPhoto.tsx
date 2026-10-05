import Image from 'next/image'
import { getRentalProduct, type RentalProduct } from '@/lib/rentals'
import styles from './Rental.module.css'

export default function RentalPhoto({ product, compact = false }: { product: RentalProduct; compact?: boolean }) {
  return <div className={`${styles.photo} ${compact ? styles.compactPhoto : ''}`}>
    <Image
      src={product.photo.src}
      alt={product.photo.alt}
      fill
      sizes={compact
        ? '(max-width: 650px) calc(100vw - 42px), (max-width: 900px) calc((100vw - 103px) / 2), (max-width: 1260px) calc((100vw - 130px) / 3), 377px'
        : '(max-width: 650px) calc(100vw - 40px), (max-width: 1260px) calc((100vw - 132px) / 2), 564px'}
    />
  </div>
}

const galleryItems = [
  { id: 'landzie-overseeding-tool', label: 'La préparation' },
  { id: 'epandeur-rotatif-gardena', label: 'Un épandeur au choix' },
  { id: 'landzie-compost-spreader', label: 'La couverture · en option' },
  { id: 'scarificateur-ryobi', label: 'La scarification · si nécessaire' },
] as const

export function RentalPackGallery() {
  return <div className={styles.packGallery}>
    {galleryItems.map(item => {
      const product = getRentalProduct(item.id)
      if (!product) return null
      return <div key={item.id} className={styles.packGalleryItem}>
        <div className={styles.packGalleryPhoto}><Image src={product.photo.src} alt={product.photo.alt} fill sizes="(max-width: 650px) calc((100vw - 50px) / 2), (max-width: 1260px) calc((100vw - 145px) / 4), 275px" /></div>
        <span>{item.label}</span>
      </div>
    })}
  </div>
}

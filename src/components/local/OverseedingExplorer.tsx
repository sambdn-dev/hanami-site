'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Box, Camera } from 'lucide-react'
import styles from './OverseedingSection.module.css'

const photos = [
  { src: '/images/location/landzie-overseeder-detail.webp', label: 'La tête de l’outil', alt: 'Photo officielle Landzie : disques métalliques étoilés et tête verte de l’Overseeding Tool' },
  { src: '/images/location/landzie-overseeder.webp', label: 'L’outil complet', alt: 'Photo officielle du Landzie Overseeding Tool complet' },
]
function Loading() {
  return <div className={styles.loading} role="status"><Box size={26} aria-hidden="true" /><span>Préparation des disques en 3D…</span></div>
}
const Tool3D = dynamic(() => import('./LandzieTool3D'), { ssr: false, loading: Loading })

export default function OverseedingExplorer() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState(0)
  const [view, setView] = useState<'photo' | '3d'>('3d')
  const [readyToLoad, setReadyToLoad] = useState(false)
  const [threeUnavailable, setThreeUnavailable] = useState(false)

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReadyToLoad(true); observer.disconnect() }
    }, { rootMargin: '300px' })
    observer.observe(gallery)
    return () => observer.disconnect()
  }, [])

  return <div className={styles.explorer} data-overseeding-explorer>
    <div className={styles.gallery} ref={galleryRef}>
      <div className={styles.galleryHeader}>
        <span className={styles.brandLogo} role="img" aria-label="Logo officiel Landzie, photographié sur l’outil">
          <Image src="/images/location/landzie-overseeder-detail.webp" alt="" width={1400} height={1400} sizes="910px" className={styles.brandPhoto} />
        </span>
        <span>{view === 'photo' ? <Camera size={16} aria-hidden="true" /> : <Box size={16} aria-hidden="true" />}</span>
      </div>
      <div className={styles.stage}>
        {view === 'photo' ? <div className={styles.photoSurface}><Image src={photos[photo].src} alt={photos[photo].alt} fill sizes="(min-width: 1024px) 650px, (min-width: 768px) 55vw, 90vw" className={styles.mainPhoto} /></div>
          : readyToLoad ? <Tool3D onUnavailable={() => { setThreeUnavailable(true); setView('photo') }} /> : <Loading />}
      </div>
      <div className={styles.galleryFooter}>
        <div className={styles.thumbnails} role="group" aria-label="Choisir une photographie officielle">
          {photos.map((item, index) => <button key={item.src} type="button" aria-pressed={view === 'photo' && photo === index} onClick={() => { setPhoto(index); setView('photo') }}><span><Image src={item.src} alt="" fill sizes="64px" /></span><span>{item.label}</span></button>)}
        </div>
        <button type="button" className={styles.viewButton} onClick={() => setView(view === '3d' ? 'photo' : '3d')} aria-pressed={view === '3d'} disabled={threeUnavailable}><Box size={16} aria-hidden="true" />{threeUnavailable ? 'Vue 3D indisponible' : view === '3d' ? 'Voir les photos' : 'Voir les disques en 3D'}</button>
      </div>
      <p className={styles.visualNote} role={threeUnavailable ? 'status' : undefined}>{threeUnavailable ? 'Cet appareil ne permet pas la vue 3D. Les photographies officielles restent disponibles.' : view === 'photo' ? 'Photographies officielles Landzie · représentation du produit fabricant' : 'Détail illustratif du rouleau à disques · proportions indicatives'}</p>
    </div>
    <div className={styles.annotations}>
      <p className={styles.eyebrow}>Les disques étoilés, au plus près</p>
      <div className={styles.annotation}><h3>Ouvrir de petites poches de semis.</h3><p>Les pointes métalliques en rotation travaillent la surface du sol et améliorent le contact graine–terre, sans retourner le terrain.</p><p>J’interviens précisément sur les zones faibles, en conservant le gazon sain autour.</p></div>
      <p className={styles.annotationFoot}>Une préparation de surface, suivie de l’épandage du mélange Hanami et d’un arrosage adapté.</p>
    </div>
  </div>
}

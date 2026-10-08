'use client'

import { useId, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Box, Camera, ChevronRight } from 'lucide-react'
import styles from './OverseedingSection.module.css'

type Part = 'spikes' | 'frame' | 'handle'
const parts: { id: Part; name: string; title: string; text: string }[] = [
  { id: 'spikes', name: 'Les disques étoilés', title: 'Ouvrir de petites poches de semis.', text: 'Les pointes métalliques en rotation travaillent la surface du sol et améliorent le contact graine–terre, sans retourner le terrain.' },
  { id: 'frame', name: 'Le châssis et l’axe', title: 'Un passage maîtrisé, zone par zone.', text: 'L’axe porte les disques rotatifs dans un châssis en acier. Le travail se concentre sur les zones dégarnies ou peu denses.' },
  { id: 'handle', name: 'Le manche de guidage', title: 'Intervenir avec précision.', text: 'Le guidage manuel permet d’adapter les passages aux zones faibles et de conserver le gazon en bonne santé autour.' },
]
const photos = [
  { src: '/images/location/landzie-overseeder-detail.webp', label: 'La tête de l’outil', alt: 'Photo officielle Landzie : disques métalliques étoilés, axe et châssis vert de l’Overseeding Tool' },
  { src: '/images/location/landzie-overseeder.webp', label: 'L’outil complet', alt: 'Photo officielle du Landzie Overseeding Tool, avec manche de guidage et tête à disques étoilés' },
]
const positions = [
  { spikes: [54, 70], frame: [72, 31], handle: [30, 9] },
  { spikes: [55, 86], frame: [64, 79], handle: [42, 38] },
] as const

const Tool3D = dynamic(() => import('./LandzieTool3D'), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status"><Box size={26} aria-hidden="true" /><span>Préparation de la vue 3D…</span></div>,
})

export default function OverseedingExplorer() {
  const id = useId()
  const [photo, setPhoto] = useState(0)
  const [view, setView] = useState<'photo' | '3d'>('photo')
  const [part, setPart] = useState<Part>('spikes')
  const [threeUnavailable, setThreeUnavailable] = useState(false)
  const current = parts.find(item => item.id === part)!

  function choosePart(next: Part) {
    setPart(next)
    if (view === 'photo' && next === 'handle') setPhoto(1)
  }

  return <div className={styles.explorer} data-overseeding-explorer>
    <div className={styles.gallery}>
      <div className={styles.galleryHeader}><span>{view === 'photo' ? 'L’outil, en détail' : 'Explorer les formes et les pièces'}</span><span>{view === 'photo' ? <Camera size={16} aria-hidden="true" /> : <Box size={16} aria-hidden="true" />}</span></div>
      <div className={styles.stage}>
        {view === 'photo' ? <div className={styles.photoSurface}>
          <Image src={photos[photo].src} alt={photos[photo].alt} fill sizes="(min-width: 1024px) 650px, (min-width: 768px) 55vw, 90vw" className={styles.mainPhoto} />
          {parts.filter(item => photo === 1 || item.id !== 'handle').map((item, index) => {
            const position = positions[photo][item.id]
            return <button key={item.id} type="button" className={`${styles.pin} ${part === item.id ? styles.activePin : ''}`} style={{ left: `${position[0]}%`, top: `${position[1]}%` }} aria-label={`Explorer ${item.name.toLowerCase()}`} aria-pressed={part === item.id} aria-controls={`${id}-annotation`} onClick={() => choosePart(item.id)}>{String(index + 1).padStart(2, '0')}</button>
          })}
        </div> : <Tool3D selectedPart={part} onSelectPart={choosePart} onUnavailable={() => { setThreeUnavailable(true); setView('photo') }} />}
      </div>
      <div className={styles.galleryFooter}>
        <div className={styles.thumbnails} role="group" aria-label="Choisir une photographie officielle">
          {photos.map((item, index) => <button key={item.src} type="button" aria-pressed={view === 'photo' && photo === index} onClick={() => { setPhoto(index); setView('photo'); if (index === 0 && part === 'handle') setPart('spikes') }}><span><Image src={item.src} alt="" fill sizes="64px" /></span><span>{item.label}</span></button>)}
        </div>
        <button type="button" className={styles.viewButton} onClick={() => setView(view === '3d' ? 'photo' : '3d')} aria-pressed={view === '3d'} disabled={threeUnavailable}><Box size={16} aria-hidden="true" />{threeUnavailable ? 'Vue 3D indisponible' : view === '3d' ? 'Revenir aux photos' : 'Explorer en 3D'}</button>
      </div>
      <p className={styles.visualNote} role={threeUnavailable ? 'status' : undefined}>{threeUnavailable ? 'Cet appareil ne permet pas la vue 3D. Les photographies officielles restent disponibles.' : view === 'photo' ? 'Photographies officielles Landzie · représentation du produit fabricant' : 'Reconstitution 3D illustrative à partir des photos · proportions indicatives'}</p>
    </div>

    <div className={styles.annotations}>
      <p className={styles.eyebrow}>Un outil. Trois points de précision.</p>
      <div className={styles.partButtons} role="group" aria-label="Explorer les différentes parties de l’outil">
        {parts.map((item, index) => <button key={item.id} type="button" onClick={() => choosePart(item.id)} aria-pressed={part === item.id} aria-controls={`${id}-annotation`}><span className={styles.partNumber}>{String(index + 1).padStart(2, '0')}</span><span>{item.name}</span><ChevronRight size={16} aria-hidden="true" /></button>)}
      </div>
      <div id={`${id}-annotation`} className={styles.annotation} aria-live="polite" aria-atomic="true"><span>{current.name}</span><h3>{current.title}</h3><p>{current.text}</p></div>
      <p className={styles.annotationFoot}>Une préparation de surface, suivie de l’épandage du mélange Hanami et d’un arrosage adapté.</p>
    </div>
  </div>
}

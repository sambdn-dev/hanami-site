'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Check, MoveUpRight } from 'lucide-react'
import type { GardenId } from './Garden3DViewer'
import styles from './StudioShowcase.module.css'

const Garden3DViewer = dynamic(() => import('./Garden3DViewer'), {
  ssr: false,
  loading: () => <div className={styles.viewerLoading}>Préparation de la maquette 3D…</div>,
})

const gardens: { id: GardenId; number: string; name: string; subtitle: string; prompt: string; image: string; features: string[] }[] = [
  { id: 'cour', number: '01', name: 'La cour contemporaine', subtitle: 'Pelouse centrale · pas japonais à gauche · massifs à droite', prompt: 'Une pelouse rectangulaire bien délimitée, cinq pas japonais sur gravier à gauche, un massif fleuri à droite et trois bouleaux au fond.', image: '/images/studio/jardin-a-contemporain.jpg', features: ['Pelouse cadrée', '5 dalles', 'Massif fleuri'] },
  { id: 'lineaire', number: '02', name: 'Le jardin linéaire', subtitle: 'Gazon allongé · allée à droite · bacs en corten', prompt: 'Un jardin étroit et généreux : gazon central, six dalles sur gravier à droite, deux bacs en corten à gauche et un olivier au fond.', image: '/images/studio/jardin-b-lineaire.jpg', features: ['Jardin étroit', '6 dalles', 'Bacs en corten'] },
  { id: 'patio', number: '03', name: 'Le patio botanique', subtitle: 'Gazon central · chemin vers la pergola · massifs libres', prompt: 'Une pelouse rectangulaire, quatre pas japonais à gauche menant à la pergola, des massifs souples à droite et un arbre à plusieurs troncs.', image: '/images/studio/jardin-c-patio.jpg', features: ['Pergola', '4 dalles', 'Plantations libres'] },
]

export default function StudioShowcase() {
  const [selected, setSelected] = useState(0)
  const garden = gardens[selected]
  return (
    <section className={styles.section} aria-labelledby="studio-gardens-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>02 / TROIS JARDINS, TROIS DIRECTIONS</p><h2 id="studio-gardens-title">Le même jardin.<br /><em>Deux façons de le voir.</em></h2></div>
          <p>Chaque photographie et son modèle 3D reprennent le même plan : emplacement du gazon, des dalles, des massifs et des éléments clés. Choisissez un jardin, puis tournez autour de la maquette.</p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Choisir un jardin">
          {gardens.map((item, index) => <button key={item.id} type="button" role="tab" id={`garden-tab-${item.id}`} aria-selected={selected === index} aria-controls="garden-panel" className={selected === index ? styles.tabActive : ''} onClick={() => setSelected(index)}><span>{item.number}</span>{item.name}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
        </div>
        <div id="garden-panel" role="tabpanel" aria-labelledby={`garden-tab-${garden.id}`} className={styles.panel} key={garden.id}>
          <div className={styles.panelTop}><div><span>PROJET FICTIF / {garden.number}</span><h3>{garden.name}</h3><p>{garden.subtitle}</p></div><div className={styles.features}>{garden.features.map(item => <span key={item}><Check size={13} aria-hidden="true" />{item}</span>)}</div></div>
          <div className={styles.pair}>
            <figure className={styles.photo}><div className={styles.imageWrap}><Image src={garden.image} alt={`Projection photoréaliste du jardin fictif « ${garden.name} » : ${garden.subtitle}`} fill sizes="(max-width: 767px) 100vw, 50vw" /></div><figcaption><span>01 / PROJECTION PHOTORÉALISTE</span><span>Image conceptuelle</span></figcaption></figure>
            <figure className={styles.model}><Garden3DViewer garden={garden.id} /><figcaption><span>02 / VUE 3D DU MÊME PLAN</span><span>Maquette interactive</span></figcaption></figure>
          </div>
          <div className={styles.prompt}><span>CONSIGNE DE DÉPART</span><p>« {garden.prompt} »</p><MoveUpRight size={23} strokeWidth={1.3} aria-hidden="true" /></div>
        </div>
        <div className={styles.ctaBar}><div><strong>Votre prochain projet mérite cette clarté.</strong><span>Discutons du parcours Studio avec vos vrais chantiers.</span></div><a href="#contact">Parler de Hanami Studio <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <p className={styles.disclosure}>Démonstration de concept : ces images et maquettes ont été créées pour illustrer la vision Studio. L’outil ne génère pas encore ces rendus en direct.</p>
      </div>
    </section>
  )
}

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

const gardens: { id: GardenId; number: string; name: string; subtitle: string; prompt: string; image: string; aerial: string; features: string[] }[] = [
  { id: 'cour', number: '01', name: 'La cour des bouleaux', subtitle: 'Pelouse aux courbes douces · pas japonais à gauche · jardin vivace', prompt: 'Depuis la terrasse, une pelouse aux lignes souples, cinq pas japonais sur gravier à gauche, des massifs de vivaces généreux et trois bouleaux au fond.', image: '/images/studio/jardin-a-organique-v2.jpg', aerial: '/images/studio/jardin-a-vue-haute-v2.jpg', features: ['Pelouse souple', '5 pas japonais', 'Trois bouleaux'] },
  { id: 'lineaire', number: '02', name: 'Le jardin des oliviers', subtitle: 'Ruban de gazon · chemin courbe à droite · corten et lavandes', prompt: 'Un jardin profond et vivant : un ruban de gazon souple, six pas japonais sur la droite, deux bacs en corten fleuris à gauche et un olivier avec banc au fond.', image: '/images/studio/jardin-b-organique-v2.jpg', aerial: '/images/studio/jardin-b-vue-haute-v2.jpg', features: ['Ruban de gazon', '6 pas japonais', 'Corten et olivier'] },
  { id: 'patio', number: '03', name: 'Le patio des saisons', subtitle: 'Îlot de gazon · chemin vers la pergola · floraisons libres', prompt: 'Un patio enveloppant : un îlot de gazon aux bords arrondis, quatre pas japonais à gauche vers la pergola, des massifs souples et un arbre à plusieurs troncs.', image: '/images/studio/jardin-c-organique-v2.jpg', aerial: '/images/studio/jardin-c-vue-haute-v2.jpg', features: ['Pergola', '4 pas japonais', 'Arbre multitrons'] },
]

export default function StudioShowcase() {
  const [selected, setSelected] = useState(0)
  const [explore, setExplore] = useState(false)
  const garden = gardens[selected]
  return (
    <section className={styles.section} aria-labelledby="studio-gardens-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>02 / TROIS JARDINS, TROIS DIRECTIONS</p><h2 id="studio-gardens-title">Trois lieux vivants.<br /><em>De l’idée au volume.</em></h2></div>
          <p>Trois jardins avec chacun sa personnalité. La projection donne l’ambiance ; la maquette interactive reprend les grands éléments du plan et permet d’en explorer les volumes.</p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Choisir un jardin">
          {gardens.map((item, index) => <button key={item.id} type="button" role="tab" id={`garden-tab-${item.id}`} aria-selected={selected === index} aria-controls="garden-panel" className={selected === index ? styles.tabActive : ''} onClick={() => { setSelected(index); setExplore(false) }}><span>{item.number}</span>{item.name}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
        </div>
        <div id="garden-panel" role="tabpanel" aria-labelledby={`garden-tab-${garden.id}`} className={styles.panel} key={garden.id}>
          <div className={styles.panelTop}><div><span>PROJET FICTIF / {garden.number}</span><h3>{garden.name}</h3><p>{garden.subtitle}</p></div><div className={styles.features}>{garden.features.map(item => <span key={item}><Check size={13} aria-hidden="true" />{item}</span>)}</div></div>
          <div className={styles.pair}>
            <figure className={styles.photo}><div className={styles.imageWrap}><Image src={garden.image} alt={`Projection photoréaliste du jardin fictif « ${garden.name} » : ${garden.subtitle}`} fill sizes="(max-width: 767px) 100vw, 50vw" /></div><figcaption><span>01 / PROJECTION PHOTORÉALISTE</span><span>Image conceptuelle</span></figcaption></figure>
            <figure className={styles.model}>
              {explore ? <Garden3DViewer garden={garden.id} /> : <div className={styles.imageWrap}><Image src={garden.aerial} alt={`Vue haute conceptuelle du jardin « ${garden.name} » avec son gazon, son chemin et ses plantations`} fill sizes="(max-width: 767px) 100vw, 50vw" /></div>}
              <button type="button" className={styles.modelToggle} onClick={() => setExplore(value => !value)}>{explore ? 'Revenir à la vue haute' : 'Explorer la maquette 3D'} <ArrowUpRight size={15} aria-hidden="true" /></button>
              <figcaption><span>{explore ? '02 / MAQUETTE 3D INTERACTIVE' : '02 / VUE HAUTE DU PROJET'}</span><span>{explore ? 'Volumes et angles de caméra' : 'Visualisation conceptuelle'}</span></figcaption>
            </figure>
          </div>
          <div className={styles.prompt}><span>CONSIGNE DE DÉPART</span><p>« {garden.prompt} »</p><MoveUpRight size={23} strokeWidth={1.3} aria-hidden="true" /></div>
        </div>
        <div className={styles.ctaBar}><div><strong>Votre prochain projet mérite cette clarté.</strong><span>Discutons du parcours Studio avec vos vrais chantiers.</span></div><a href="#contact">Parler de Hanami Studio <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <p className={styles.disclosure}>Démonstration de concept : les projections et vues hautes sont des illustrations. La maquette interactive reprend les grands volumes et implantations, sans reproduire chaque détail végétal. Studio ne génère pas encore ces rendus en direct.</p>
      </div>
    </section>
  )
}

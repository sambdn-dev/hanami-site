'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Check, Moon, MoveUpRight, Sun } from 'lucide-react'
import type { GardenId } from './Garden3DViewer'
import styles from './StudioShowcase.module.css'

const Garden3DViewer = dynamic(() => import('./Garden3DViewer'), {
  ssr: false,
  loading: () => <div className={styles.viewerLoading}>Préparation de la maquette 3D…</div>,
})

type LightMode = 'jour' | 'nuit'
type GardenImagePair = Record<LightMode, string>
type Garden = { id: GardenId; number: string; name: string; subtitle: string; prompt: string; image: GardenImagePair; aerial: GardenImagePair; features: string[] }

const gardens: Garden[] = [
  { id: 'cour', number: '01', name: 'Le jardin graphique', subtitle: 'Pelouse rectangulaire · dalles à droite · gravier d’ardoise', prompt: 'Une grande pelouse aux quatre angles nets, des dalles de calcaire rectangulaires sur gravier d’ardoise à droite, des bouleaux au fond et un éclairage discret des cheminements.', image: { jour: '/images/studio/jardin-geometrique-jour-v3.jpg', nuit: '/images/studio/jardin-geometrique-nuit-v3.jpg' }, aerial: { jour: '/images/studio/jardin-geometrique-haut-jour-v3.jpg', nuit: '/images/studio/jardin-geometrique-haut-nuit-v3.jpg' }, features: ['Gazon rectangulaire', 'Dalles sur ardoise', 'Bouleaux éclairés'] },
  { id: 'lineaire', number: '02', name: 'Le jardin anglais', subtitle: 'Grande courbe de gazon · pierres irrégulières · massifs libres', prompt: 'Une pelouse à la courbe anglaise très marquée, un chemin diagonal de pierres irrégulières sur gravier ocre menant au portail, des vivaces foisonnantes et un arbre mis en lumière.', image: { jour: '/images/studio/jardin-anglais-jour-v3.jpg', nuit: '/images/studio/jardin-anglais-nuit-v3.jpg' }, aerial: { jour: '/images/studio/jardin-anglais-haut-jour-v3.jpg', nuit: '/images/studio/jardin-anglais-haut-nuit-v3.jpg' }, features: ['Courbe anglaise', 'Gravier ocre', 'Chemin diagonal'] },
  { id: 'patio', number: '03', name: 'Le patio des saisons', subtitle: 'Îlot de gazon ovale · pas ronds à l’arrière · pergola', prompt: 'Un îlot de gazon presque circulaire, de petits pas ronds en basalte dans un gravier clair derrière la pelouse, une pergola à droite et un érable éclairé le soir.', image: { jour: '/images/studio/jardin-patio-jour-v3.jpg', nuit: '/images/studio/jardin-patio-nuit-v3.jpg' }, aerial: { jour: '/images/studio/jardin-patio-haut-jour-v3.jpg', nuit: '/images/studio/jardin-patio-haut-nuit-v3.jpg' }, features: ['Gazon ovale', 'Basalte sur gravier clair', 'Pergola illuminée'] },
]

export default function StudioShowcase() {
  const [selected, setSelected] = useState(0)
  const [explore, setExplore] = useState(false)
  const [lightMode, setLightMode] = useState<LightMode>('jour')
  const garden = gardens[selected]
  return (
    <section className={styles.section} aria-labelledby="studio-gardens-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>02 / TROIS JARDINS, TROIS DIRECTIONS</p><h2 id="studio-gardens-title">Trois lieux vivants.<br /><em>De l’idée au volume.</em></h2></div>
          <p>Un gazon géométrique, une courbe anglaise, un patio ovale. Explorez chaque jardin de jour et de nuit, puis faites tourner sa maquette pour comprendre les volumes.</p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Choisir un jardin">
          {gardens.map((item, index) => <button key={item.id} type="button" role="tab" id={`garden-tab-${item.id}`} aria-selected={selected === index} aria-controls="garden-panel" className={selected === index ? styles.tabActive : ''} onClick={() => { setSelected(index); setExplore(false) }}><span>{item.number}</span>{item.name}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
        </div>
        <div id="garden-panel" role="tabpanel" aria-labelledby={`garden-tab-${garden.id}`} className={styles.panel} key={garden.id}>
          <div className={styles.panelTop}><div><span>PROJET FICTIF / {garden.number}</span><h3>{garden.name}</h3><p>{garden.subtitle}</p></div><div className={styles.panelTools}><div className={styles.lightModes} role="group" aria-label="Éclairage du jardin"><button type="button" aria-pressed={lightMode === 'jour'} className={lightMode === 'jour' ? styles.lightModeActive : ''} onClick={() => setLightMode('jour')}><Sun size={15} aria-hidden="true" /> Jour</button><button type="button" aria-pressed={lightMode === 'nuit'} className={lightMode === 'nuit' ? styles.lightModeActive : ''} onClick={() => setLightMode('nuit')}><Moon size={15} aria-hidden="true" /> Nuit</button></div><div className={styles.features}>{garden.features.map(item => <span key={item}><Check size={13} aria-hidden="true" />{item}</span>)}</div></div></div>
          <div className={styles.pair}>
            <figure className={styles.photo}><div className={styles.imageWrap} key={`${garden.id}-${lightMode}-photo`}><Image src={garden.image[lightMode]} alt={`Projection ${lightMode === 'nuit' ? 'de nuit avec éclairages paysagers' : 'de jour'} du jardin fictif « ${garden.name} » : ${garden.subtitle}`} fill sizes="(max-width: 767px) 100vw, 50vw" /></div><figcaption><span>01 / PROJECTION PHOTORÉALISTE</span><span>{lightMode === 'nuit' ? 'Vue de nuit' : 'Vue de jour'}</span></figcaption></figure>
            <figure className={styles.model}>
              {explore ? <Garden3DViewer garden={garden.id} lightMode={lightMode} /> : <div className={styles.imageWrap} key={`${garden.id}-${lightMode}-aerial`}><Image src={garden.aerial[lightMode]} alt={`Vue haute ${lightMode === 'nuit' ? 'de nuit' : 'de jour'} du jardin « ${garden.name} » avec sa pelouse et son chemin`} fill sizes="(max-width: 767px) 100vw, 50vw" /></div>}
              <button type="button" className={styles.modelToggle} onClick={() => setExplore(value => !value)}>{explore ? 'Revenir à la vue haute' : 'Explorer la maquette 3D'} <ArrowUpRight size={15} aria-hidden="true" /></button>
              <figcaption><span>{explore ? '02 / MAQUETTE 3D INTERACTIVE' : '02 / VUE HAUTE DU PROJET'}</span><span>{explore ? 'Volumes et angles de caméra' : `Vue ${lightMode === 'nuit' ? 'de nuit' : 'de jour'}`}</span></figcaption>
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Leaf, Volume2, Zap } from 'lucide-react'
import styles from './EquipmentSection.module.css'

const mowerViews = [
  { image: 'mower-main.webp', label: 'Vue d’ensemble', alt: 'Tondeuse à batterie EGO LM2135E-SP de 52 cm, vue de trois quarts' },
  { image: 'mower-02.webp', label: 'Vue de face', alt: 'Tondeuse EGO LM2135E-SP vue de face' },
  { image: 'mower-03.webp', label: 'Double lame', alt: 'Vue du système de coupe à double lame de la tondeuse EGO LM2135E-SP' },
  { image: 'mower-01.webp', label: 'Commandes', alt: 'Commandes au guidon de la tondeuse EGO LM2135E-SP' },
]

export default function EquipmentSection() {
  const [view, setView] = useState(0)

  return (
    <section id="materiel" className={styles.section} aria-labelledby="equipment-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>LE SENS DU DÉTAIL / LE MATÉRIEL</p>
          <h2 id="equipment-title">La précision jusque<br />dans <em>la coupe.</em></h2>
          <p>Un écosystème EGO à batterie pour travailler proprement, avec la puissance et la régularité attendues d’une intervention professionnelle.</p>
        </div>

        <div className={styles.showcase}>
          <div className={styles.mower}>
            <div className={styles.productTop}><span>01 / LA TONTE</span><span className={styles.badge}><Zap size={12} aria-hidden="true" /> SUR BATTERIE</span></div>
            <div className={styles.stage}>
              <span className={styles.stageRing} aria-hidden="true" />
              <Image key={view} className={styles.mowerImage} src={`/images/equipment/${mowerViews[view].image}`} alt={mowerViews[view].alt} fill sizes="(max-width: 760px) 90vw, 56vw" />
            </div>
            <div className={styles.productInfo}>
              <div><p className={styles.productModel}>EGO LM2135E-SP</p><h3>Une coupe nette.<br />Une finition soignée.</h3></div>
              <div className={styles.width}><strong>52</strong><span>CM DE COUPE</span></div>
            </div>
            <div className={styles.gallery} role="group" aria-label="Choisir une vue de la tondeuse">
              {mowerViews.map((item, index) => <button key={item.image} type="button" aria-pressed={view === index} onClick={() => setView(index)}>{item.label}</button>)}
            </div>
            <p className={styles.bladeNote}>Double lame et lames entretenues pour une coupe régulière, sans déchirer les brins.</p>
          </div>

          <div className={styles.side}>
            <article className={styles.blower}>
              <p className={styles.productTop}>02 / LES FINITIONS</p>
              <div className={styles.blowerStage}><Image src="/images/equipment/blower-main.webp" alt="Souffleur professionnel à batterie EGO LBX1000" fill sizes="(max-width: 760px) 85vw, 35vw" /></div>
              <p className={styles.productModel}>EGO LBX1000</p>
              <h3>Un jardin laissé impeccable.</h3>
              <p className={styles.description}>Le souffleur professionnel accompagne les finitions et le nettoyage après l’intervention.</p>
            </article>
            <article className={styles.tools}>
              <p className={styles.productTop}>03 / LES GESTES PRÉCIS</p>
              <h3>Chaque détail compte.</h3>
              <p className={styles.description}>Bloc multi-outils, réciprocateur, coupe-bordure et dresse-bordure : des outils adaptés pour dessiner les contours et travailler au plus près du jardin.</p>
              <div className={styles.accessoryPhotos}>
                <figure><Image src="/images/equipment/edger-main.webp" width={800} height={566} sizes="(max-width: 760px) 40vw, 16vw" alt="Illustration constructeur du dresse-bordure EGO EA0800" /><figcaption>Dresse-bordure</figcaption></figure>
                <figure><Image src="/images/equipment/rotocut-main.webp" width={800} height={566} sizes="(max-width: 760px) 40vw, 16vw" alt="Illustration constructeur de l’accessoire de coupe EGO RTA2300" /><figcaption>Coupe de précision</figcaption></figure>
              </div>
              <p className={styles.illustrationNote}>Illustrations de la gamme EGO. Références des accessoires à confirmer.</p>
              <p className={styles.toolNote}>La pulvérisation complète le matériel pour les applications foliaires et les interventions agronomiques.</p>
            </article>
          </div>
        </div>

        <div className={styles.benefits}>
          <div><Volume2 size={22} strokeWidth={1.5} aria-hidden="true" /><p><strong>Moins de bruit</strong><span>Des interventions plus discrètes qu’avec un équipement thermique comparable.</span></p></div>
          <div><Leaf size={22} strokeWidth={1.5} aria-hidden="true" /><p><strong>Sans gaz d’échappement à l’usage</strong><span>Le choix de la batterie contribue à un jardin et à un cadre de travail plus agréables.</span></p></div>
          <div><Zap size={22} strokeWidth={1.5} aria-hidden="true" /><p><strong>La précision professionnelle</strong><span>Un matériel choisi pour sa qualité de coupe, ses finitions et sa régularité.</span></p></div>
        </div>
      </div>
    </section>
  )
}

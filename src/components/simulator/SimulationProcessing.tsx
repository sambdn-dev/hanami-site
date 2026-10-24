'use client'

import {useEffect, useState} from 'react'
import styles from './SimulationProcessing.module.css'

type Tip = {title: string; text: string}
type Props = {originalSrc: string; startedAt?: string | null; tips?: readonly Tip[]; connectionLost?: boolean; phase?: 'generation' | 'saving'; onImageError?: () => void}

/** Real running state only. Advice rotates independently from provider progress. */
export default function SimulationProcessing({originalSrc, startedAt, tips = [], connectionLost = false, phase = 'generation', onImageError}: Props) {
  const [tipIndex, setTipIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const entries = Array.isArray(tips) ? tips.filter(tip => tip && typeof tip.title === 'string' && typeof tip.text === 'string').slice(0, 8) : []
  const tipCount = entries.length
  const tip = entries[tipIndex % (tipCount || 1)]

  useEffect(() => {
    if (paused || tipCount < 2) return
    const timer = setInterval(() => { if (!document.hidden) setTipIndex(index => (index + 1) % tipCount) }, 8000)
    return () => clearInterval(timer)
  }, [paused, tipCount])
  useEffect(() => {
    if (!startedAt) return
    const start = Date.parse(startedAt)
    if (!Number.isFinite(start)) return
    const timer = setInterval(() => { if (!document.hidden) setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000))) }, 1000)
    return () => clearInterval(timer)
  }, [startedAt])

  return <section className={styles.panel} aria-label="Traitement de votre photo">
    <div className={styles.photo}>
      {/* The unchanged original is a waiting backdrop, never a generated preview. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={originalSrc} alt="Votre photo originale pendant le traitement" onError={onImageError}/>
      <span className={styles.photoLabel}>PHOTO ORIGINALE</span>
      <div className={styles.photoStatus} aria-hidden="true"><span className={styles.orbit}/><span>Votre projection<br/>prend forme.</span></div>
    </div>
    <div className={styles.body}>
      <p className={styles.eyebrow}>UN NOUVEAU REGARD SUR VOTRE GAZON</p>
      <h3 className={styles.title}>{connectionLost ? 'Le suivi est momentanément interrompu.' : phase === 'saving' ? 'Votre projection est en cours d’enregistrement.' : 'Votre pelouse est en cours de simulation.'}</h3>
      <p className={styles.status} role="status">{connectionLost ? 'Le traitement peut continuer. Actualisez le suivi ; aucune nouvelle génération n’est lancée.' : phase === 'saving' ? 'Le rendu a été reçu. Nous conservons le résultat avant de vous l’afficher.' : 'Votre photo est enregistrée. Nous attendons le résultat de l’IA.'}</p>
      <progress className={styles.indeterminate} aria-label={connectionLost ? 'Dernier état connu : génération en cours' : phase === 'saving' ? 'Enregistrement du résultat en cours' : 'Génération IA en cours, durée totale inconnue'}/>
      <ol className={styles.steps} aria-label="Avancement confirmé">
        <li className={styles.confirmed}>Photo enregistrée</li>
        <li aria-current={phase === 'generation' ? 'step' : undefined}>{connectionLost ? phase === 'saving' ? 'Génération terminée' : 'Dernier état : génération' : phase === 'saving' ? 'Génération terminée' : 'Génération en cours'}</li>
        <li aria-current={phase === 'saving' ? 'step' : undefined}>{phase === 'saving' ? 'Enregistrement du résultat' : 'Enregistrement à venir'}</li>
        <li>Comparaison à venir</li>
      </ol>
      {elapsed !== null && <p className={styles.elapsed}>Depuis le lancement : <span>{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}</span></p>}
      {tip && <aside className={styles.tip} aria-label="Conseils pendant l’attente" aria-live="off">
        <div className={styles.tipHeader}><span>LE SAVIEZ-VOUS ?</span><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Reprendre les conseils' : 'Mettre les conseils en pause'}</button></div>
        <div key={tipIndex} className={styles.tipContent}><strong>{tip.title}</strong><p>{tip.text}</p></div>
      </aside>}
      <p className={styles.reassurance}>Vous pouvez quitter cet écran et retrouver le suivi en revenant sur ce navigateur. Le traitement n’est pas relancé.</p>
    </div>
  </section>
}

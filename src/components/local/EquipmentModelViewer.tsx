'use client'

import { useRef, useState, type ComponentType } from 'react'
import { Box, LoaderCircle, Minus, Pause, Play, Plus, RotateCcw, X } from 'lucide-react'
import type { MowerSceneProps } from './EquipmentMowerScene'
import styles from './EquipmentModelViewer.module.css'

export default function EquipmentModelViewer() {
  const [Scene, setScene] = useState<ComponentType<MowerSceneProps> | null>(null)
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [rotating, setRotating] = useState(true)
  const [action, setAction] = useState({ kind: 'reset' as 'reset' | 'in' | 'out', sequence: 0 })
  const latestRequest = useRef(0)

  async function open() {
    setOpened(true)
    setError(false)
    if (Scene) return
    const request = ++latestRequest.current
    setLoading(true)
    try {
      const sceneModule = await import('./EquipmentMowerScene')
      if (request === latestRequest.current) setScene(() => sceneModule.default)
    } catch {
      if (request === latestRequest.current) setError(true)
    } finally {
      if (request === latestRequest.current) setLoading(false)
    }
  }

  function command(kind: 'reset' | 'in' | 'out') {
    setAction(previous => ({ kind, sequence: previous.sequence + 1 }))
  }

  if (!opened) return (
    <button className={styles.open} onClick={open} type="button">
      <span className={styles.icon}><Box size={19} strokeWidth={1.4} aria-hidden="true" /></span>
      <span><strong>Explorer en 3D</strong><small>Une autre façon de voir le matériel</small></span>
      <span className={styles.arrow} aria-hidden="true">↗</span>
    </button>
  )

  return (
    <div className={styles.viewer}>
      <div className={styles.top}><span>LM2135E-SP / ÉTUDE EN VOLUME</span><button type="button" aria-label="Fermer la vue 3D" onClick={() => setOpened(false)}><X size={16} aria-hidden="true" /></button></div>
      <div className={styles.stage}>
        {loading && <p className={styles.loading} role="status"><LoaderCircle size={21} className={styles.spinner} aria-hidden="true" />Préparation de la vue 3D…</p>}
        {error ? <p className={styles.fallback}>La vue 3D est indisponible sur cet appareil.<a href="/images/equipment/mower-main.webp" target="_blank" rel="noreferrer">Voir la photo du modèle ↗</a></p> : Scene && <Scene rotating={rotating} action={action} onError={() => setError(true)} />}
        <span className={styles.dimension} aria-hidden="true">52 cm</span>
      </div>
      <div className={styles.bottom}>
        <p>Glissez pour tourner</p>
        <div className={styles.controls} role="group" aria-label="Contrôles de la vue 3D">
          <button type="button" onClick={() => command('out')} aria-label="Éloigner la vue"><Minus size={15} aria-hidden="true" /></button>
          <button type="button" onClick={() => command('in')} aria-label="Rapprocher la vue"><Plus size={15} aria-hidden="true" /></button>
          <button type="button" onClick={() => command('reset')} aria-label="Réinitialiser la vue"><RotateCcw size={14} aria-hidden="true" /></button>
          <button type="button" onClick={() => setRotating(value => !value)} aria-label={rotating ? 'Arrêter la rotation' : 'Activer la rotation'} aria-pressed={rotating}>{rotating ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}</button>
        </div>
      </div>
      <p className={styles.disclaimer}>Étude 3D illustrative · proportions approximatives</p>
    </div>
  )
}

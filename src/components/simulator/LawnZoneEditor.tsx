'use client'

import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { LawnPoint, LawnPolygon } from './types'
import styles from './Simulator.module.css'

interface Props {
  src: string
  width: number
  height: number
  polygons: LawnPolygon[]
  onChange: (polygons: LawnPolygon[]) => void
  disabled?: boolean
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const coords = (polygon: LawnPolygon, width: number, height: number) => polygon.map(([x, y]) => `${x * width},${y * height}`).join(' ')

/** One simple outline per lawn area. Keyboard and touch use the same coordinates. */
export default function LawnZoneEditor({ src, width, height, polygons, onChange, disabled = false }: Props) {
  const helpId = useId()
  const cursorId = useId()
  const [cursor, setCursor] = useState<LawnPoint>([0.5, 0.6])
  const current = polygons.length - 1
  const active = polygons[current] ?? []
  const markerScale = Math.max(width, height) / 1000

  function addPoint(point: LawnPoint) {
    if (disabled || active.length >= 40) return
    setCursor(point)
    onChange(polygons.length ? polygons.map((polygon, index) => index === current ? [...polygon, point] : polygon) : [[point]])
  }

  function onPointer(event: PointerEvent<SVGSVGElement>) {
    if (disabled || event.button !== 0) return
    const bounds = event.currentTarget.getBoundingClientRect()
    addPoint([clamp((event.clientX - bounds.left) / bounds.width), clamp((event.clientY - bounds.top) / bounds.height)])
  }

  function onKeyboard(event: KeyboardEvent<SVGSVGElement>) {
    if (disabled) return
    const step = event.shiftKey ? 0.05 : 0.01
    const directions: Record<string, LawnPoint> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    }
    if (directions[event.key]) {
      event.preventDefault()
      const [x, y] = directions[event.key]
      setCursor(([cx, cy]) => [clamp(cx + x), clamp(cy + y)])
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      addPoint(cursor)
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      undo()
    }
  }

  function undo() {
    if (disabled || !polygons.length) return
    if (active.length === 0) onChange(polygons.slice(0, -1))
    else onChange(polygons.map((polygon, index) => index === current ? polygon.slice(0, -1) : polygon))
  }

  return <div>
    <p id={helpId} className={styles.help}>Touchez les contours du gazon, point par point. Laissez les massifs, arbres, allées et terrasses en dehors de la zone. Pour deux pelouses séparées, ajoutez une zone.</p>
    <svg
      className={styles.editor}
      viewBox={`0 0 ${width} ${height}`}
      style={{ aspectRatio: width / height }}
      role="application"
      aria-label="Délimiter la pelouse sur votre photo"
      aria-describedby={`${helpId} ${cursorId}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onPointerUp={onPointer}
      onKeyDown={onKeyboard}
    >
      <title>Photo du jardin et contours de gazon sélectionnés</title>
      <image href={src} width={width} height={height} />
      {polygons.map((polygon, index) => <g key={index}>
        {polygon.length > 2 && <polygon points={coords(polygon, width, height)} fill="rgba(167,194,154,.35)" stroke="#f8f6ef" strokeWidth="3" vectorEffect="non-scaling-stroke" />}
        {polygon.length < 3 && <polyline points={coords(polygon, width, height)} fill="none" stroke="#f8f6ef" strokeWidth="3" vectorEffect="non-scaling-stroke" />}
        {polygon.map(([x, y], pointIndex) => <circle key={pointIndex} cx={x * width} cy={y * height} r={6 * markerScale} fill="#0f3d28" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
      </g>)}
      <g className={styles.keyboardCursor} stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none">
        <circle cx={cursor[0] * width} cy={cursor[1] * height} r={12 * markerScale} fill="rgba(15,61,40,.55)" />
        <path d={`M ${cursor[0] * width - 20 * markerScale} ${cursor[1] * height} h ${40 * markerScale} M ${cursor[0] * width} ${cursor[1] * height - 20 * markerScale} v ${40 * markerScale}`} />
      </g>
    </svg>
    <span id={cursorId} className={styles.srOnly} aria-live="polite">Cible : {Math.round(cursor[0] * 100)} % depuis la gauche, {Math.round(cursor[1] * 100)} % depuis le haut de la photo.</span>
    <div className={styles.editorToolbar}>
      <span className={styles.help} aria-live="polite">{polygons.filter(p => p.length >= 3).length} zone(s) tracée(s) · {active.length} point(s) sur la zone active</span>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={undo} disabled={disabled || !polygons.length}>Annuler le dernier point</button>
        <button type="button" className={styles.secondary} onClick={() => onChange([...polygons, []])} disabled={disabled || active.length < 3 || polygons.length >= 4}>Ajouter une zone</button>
        <button type="button" className={styles.textButton} onClick={() => onChange([])} disabled={disabled || !polygons.length}>Effacer les zones</button>
      </div>
    </div>
    <details className={styles.keyboardHelp}>
      <summary>Délimiter au clavier</summary>
      <p>Placez le focus sur la photo. Les flèches déplacent la cible ; Maj + flèche augmente le pas. Entrée ajoute un point et Retour arrière retire le dernier point. Ajoutez au moins trois points autour du gazon.</p>
    </details>
  </div>
}

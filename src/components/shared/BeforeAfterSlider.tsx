/**
 * BeforeAfterSlider.tsx — Comparateur avant/après interactif
 *
 * Affiche deux photos superposées avec une barre verticale que l'utilisateur
 * peut glisser de gauche à droite.
 *
 * Convention visuelle :
 * - Côté GAUCHE = photo "Avant" (l'état original, moins bien)
 * - Côté DROIT  = photo "Après" (le résultat, le beau gazon)
 * - Glisser vers la GAUCHE révèle davantage l'"Après"
 *
 * Fonctionne à la souris (desktop) et au doigt (mobile/tactile).
 *
 * Props :
 * - beforeSrc            : chemin de la photo "avant"
 * - afterSrc             : chemin de la photo "après"
 * - beforeAlt            : texte alternatif avant (accessibilité)
 * - afterAlt             : texte alternatif après (accessibilité)
 * - initialPosition      : position de départ du curseur en % (défaut : 50)
 * - beforeObjectPosition : contrôle quelle partie de la photo AVANT est visible
 *                          ex: "center 43%" = légèrement au-dessus du centre
 * - afterObjectPosition  : idem pour la photo APRÈS
 *                          Ces deux props permettent d'aligner les deux photos
 *                          sur le même point de référence visuel.
 */

'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { Expand, X } from 'lucide-react'
import { usePortalRoot } from '@/hooks/usePortalRoot'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

interface PhotoCrop {
  x: number
  y: number
  width: number
  height: number
  sourceWidth: number
  sourceHeight: number
}

// Both crops describe the same view in source-photo coordinates. Container
// units preserve their registration when the comparison changes aspect ratio.
function cropStyle(crop: PhotoCrop): CSSProperties {
  const cover = (pixels: number) =>
    `max(${pixels / crop.width * 100}cqw, ${pixels / crop.height * 100}cqh)`
  return {
    width: cover(crop.sourceWidth),
    height: cover(crop.sourceHeight),
    left: `calc(50% - ${cover(crop.x + crop.width / 2)})`,
    top: `calc(50% - ${cover(crop.y + crop.height / 2)})`,
    maxWidth: 'none',
    objectFit: 'fill',
  }
}

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  initialPosition?: number
  /** Matching source-photo crops, without altering the original photographs. */
  beforeCrop?: PhotoCrop
  afterCrop?: PhotoCrop
  beforeObjectPosition?: string
  afterObjectPosition?: string
  /**
   * Transformation CSS appliquée à la photo "après" (zoom, translation...).
   * Exemple : "scale(1.3)" pour zoomer, combined avec afterTransformOrigin
   * pour définir le point d'ancrage du zoom.
   */
  afterTransform?: string
  /**
   * Point d'ancrage du zoom sur la photo "après".
   * "center 40%" = ancré au centre horizontal, 40% du haut.
   * Zoomer depuis le haut-centre pousse les éléments du bas hors du cadre.
   */
  afterTransformOrigin?: string
  /**
   * Précharge les images (candidat LCP au-dessus de la ligne de flottaison).
   * À réserver au slider du Hero — les instances below-fold (Cas clients)
   * restent en lazy loading natif.
   */
  priority?: boolean
  /** Preserve an uploaded photo's framing; defaults to the existing 4:3 view. */
  aspectRatio?: number
  /** Private image routes require the visitor's session cookie. */
  unoptimized?: boolean
  onImageError?: () => void
  className?: string
  allowFullscreen?: boolean
  animateHint?: boolean
  onPositionChange?: (position: number) => void
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Avant',
  afterAlt = 'Après',
  initialPosition = 50,
  beforeCrop,
  afterCrop,
  beforeObjectPosition = 'center 50%',
  afterObjectPosition = 'center 50%',
  afterTransform,
  afterTransformOrigin = 'center 40%',
  priority = false,
  aspectRatio = 4 / 3,
  unoptimized = false,
  onImageError,
  className = '',
  allowFullscreen = true,
  animateHint = true,
  onPositionChange,
}: BeforeAfterSliderProps) {
  // Position du curseur en pourcentage (0 = tout à gauche, 100 = tout à droite)
  const [position, setPosition] = useState(initialPosition)
  const [expanded, setExpanded] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const expandButton = useRef<HTMLButtonElement>(null)
  const openingPosition = useRef(initialPosition)
  const portalRoot = usePortalRoot()

  useEffect(() => { onPositionChange?.(position) }, [position, onPositionChange])
  useEffect(() => {
    if (!expanded || !portalRoot) return
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = expandButton.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [expanded, portalRoot])

  // Référence vers le conteneur pour calculer les coordonnées relatives
  const containerRef = useRef<HTMLDivElement>(null)

  // true pendant qu'on glisse le curseur
  const isDragging = useRef(false)

  // ── Animation automatique avant/après ────────────────────────────────────
  // Oscillation sinusoïdale continue et lente — s'arrête au premier clic/toucher.
  // Onde sinus : démarre au centre, part vers la gauche (révèle l'Après),
  // puis vers la droite (révèle l'Avant), en boucle.
  const hintRafRef = useRef<number | null>(null)
  const userMoved  = useRef(false)

  const cancelHint = useCallback(() => {
    if (hintRafRef.current) cancelAnimationFrame(hintRafRef.current)
    userMoved.current = true
  }, [])

  useEffect(() => {
    // Respecte la préférence système : pas d'oscillation d'amorce si
    // l'utilisateur a demandé de réduire les animations.
    if (!animateHint || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const startTime = performance.now()
    const PERIOD    = 6000  // ms — durée d'un aller-retour complet (lent)
    const AMPLITUDE = 38    // ±38% autour de initialPosition

    const CYCLES = 1 // nombre d'allers-retours avant l'arrêt

    const tick = (now: number) => {
      if (userMoved.current) return
      const t = (now - startTime) / PERIOD
      if (t >= CYCLES) {
        // Revient exactement à la position initiale après 3 cycles
        setPosition(initialPosition)
        return
      }
      // sin démarre à 0 → va vers -1 (gauche/Après) → +1 (droite/Avant) → boucle
      const pos = initialPosition - AMPLITUDE * Math.sin(2 * Math.PI * t)
      setPosition(Math.min(95, Math.max(5, pos)))
      hintRafRef.current = requestAnimationFrame(tick)
    }
    hintRafRef.current = requestAnimationFrame(tick)

    return () => {
      if (hintRafRef.current) cancelAnimationFrame(hintRafRef.current)
    }
  }, [initialPosition, animateHint])

  /**
   * Calcule la nouvelle position du curseur en % à partir d'une position X en pixels.
   */
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = (x / rect.width) * 100
    // Clamp entre 2% et 98% pour garder le curseur toujours visible
    setPosition(Math.min(98, Math.max(2, pct)))
  }, [])

  // ── Gestion souris ────────────────────────────────────────────────────────

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    cancelHint()
    isDragging.current = true
    updatePosition(e.clientX)

    const onMouseMove = (ev: MouseEvent) => {
      if (isDragging.current) updatePosition(ev.clientX)
    }
    const onMouseUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [cancelHint, updatePosition])

  // ── Gestion tactile (mobile) ──────────────────────────────────────────────
  // onTouchMove React est passif par défaut → preventDefault() n'y fonctionne pas.
  // On attache un listener natif { passive: false } pour bloquer le scroll pendant
  // le glissement, et on le nettoie au démontage.

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    cancelHint()
    isDragging.current = true
    updatePosition(e.touches[0].clientX)
  }, [cancelHint, updatePosition])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  // ── Pilotage clavier de la poignée ────────────────────────────────────────
  // Flèches gauche/droite = déplacement par pas de 5 %, bornes identiques
  // au drag souris/tactile (2–98 %).

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    cancelHint()
    const STEP = 5
    setPosition((prev) => {
      const next = e.key === 'ArrowLeft' ? prev - STEP : prev + STEP
      return Math.min(98, Math.max(2, next))
    })
  }, [cancelHint])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      updatePosition(e.touches[0].clientX)
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [updatePosition])

  return (
    <>
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] overflow-hidden rounded-lg select-none cursor-ew-resize ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitUserSelect: 'none', userSelect: 'none', aspectRatio, ...(beforeCrop || afterCrop ? { containerType: 'size' } : {}) }}
      /* role="group" (pas "img") : un rôle image rendrait la poignée
         role="slider" invisible aux technologies d'assistance */
      role="group"
      aria-label={`Comparaison avant/après : ${beforeAlt} et ${afterAlt}`}
    >
      {allowFullscreen && <button ref={expandButton} type="button" aria-label="Ouvrir la comparaison avant/après en plein écran" aria-haspopup="dialog"
        className="absolute top-3 right-3 z-10 flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-brand-forest px-3 text-white shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onMouseDown={event => event.stopPropagation()} onTouchStart={event => event.stopPropagation()}
        onClick={event => { event.stopPropagation(); cancelHint(); openingPosition.current = position; setExpanded(true) }}>
        <Expand size={18} aria-hidden="true" /><span className="sr-only">Plein écran</span>
      </button>}

      {/* ── Photo APRÈS — fond complet, toujours visible (côté droit) ─── */}
      {/*
        Cette image est en dessous de tout. Elle est toujours visible à droite
        du curseur, et disparaît à gauche quand l'image "avant" la recouvre.
        - objectPosition : contrôle le cadrage vertical de la photo
        - afterTransform  : zoom CSS (ex: scale(1.3)) pour recadrer le sujet
        - afterTransformOrigin : point d'ancrage du zoom
          "center 40%" = ancrée en haut-centre → le zoom pousse les éléments
          du bas (premier plan) hors du cadre, tout en gardant le fond visible
      */}
      <Image
        src={afterSrc}
        onError={onImageError}
        alt={afterAlt}
        fill
        className="object-cover pointer-events-none"
        style={{
          objectPosition: afterObjectPosition,
          ...(afterCrop && cropStyle(afterCrop)),
          ...(afterTransform && {
            transform: afterTransform,
            transformOrigin: afterTransformOrigin,
          }),
        }}
        sizes={allowFullscreen ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
        priority={priority}
        unoptimized={unoptimized}
      />

      {/* ── Photo AVANT — visible uniquement sur le côté GAUCHE ────────── */}
      {/*
        clip-path: inset(0 X% 0 0) signifie "couper X% depuis la droite".
        - inset(0 38% 0 0) → visible dans les 62% gauche
        - Quand position = 62% : avant visible à gauche, après à droite ✓
        - En glissant vers la GAUCHE (position diminue) : avant se réduit,
          après se révèle progressivement.
      */}
      {/*
        La photo AVANT recouvre partiellement la photo APRÈS côté gauche.
        Le clip-path la coupe à la position du curseur.
        Elle est au-dessus (z-index implicite via l'ordre DOM).
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          onError={onImageError}
          alt={beforeAlt}
          fill
          className="object-cover"
          style={{ objectPosition: beforeObjectPosition, ...(beforeCrop && cropStyle(beforeCrop)) }}
          sizes={allowFullscreen ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
          priority={priority}
          unoptimized={unoptimized}
        />
      </div>

      {/* ── Barre verticale séparatrice ───────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Poignée centrale — cercle blanc avec icône double flèche.
            Focusable et pilotable au clavier (role="slider" + flèches). */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Curseur de comparaison avant/après"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hanami-500"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a2e1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M8 9l-4 3 4 3" />
            <path d="M16 9l4 3-4 3" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </div>
      </div>

      {/* ── Labels "Avant" / "Après" dans les coins ──────────────────── */}
      {/* Disparaissent discrètement quand le curseur passe sur eux */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <span
          className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full bg-brand-forest text-white transition-opacity duration-200"
          style={{ opacity: position > 15 ? 1 : 0 }}
        >
          Avant
        </span>
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span
          className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full bg-brand-forest text-white transition-opacity duration-200"
          style={{ opacity: position < 85 ? 1 : 0 }}
        >
          Après
        </span>
      </div>

    </div>
    {expanded && portalRoot && createPortal(<dialog ref={dialogRef}
      aria-label="Comparaison avant/après en plein écran"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#071b12] p-4 text-white backdrop:bg-black/90 sm:p-8"
      onCancel={event => { event.preventDefault(); setExpanded(false) }}>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="text-sm">Avant / Après · Glissez pour comparer</p>
          <button type="button" autoFocus onClick={() => setExpanded(false)} aria-label="Fermer la comparaison plein écran"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/40 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X size={22} aria-hidden="true" /></button>
        </div>
        <div style={{ width: `min(100%, calc((100dvh - 10rem) * ${aspectRatio}))`, aspectRatio }}>
          <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} beforeAlt={beforeAlt} afterAlt={afterAlt}
            beforeCrop={beforeCrop} afterCrop={afterCrop} beforeObjectPosition={beforeObjectPosition} afterObjectPosition={afterObjectPosition}
            afterTransform={afterTransform} afterTransformOrigin={afterTransformOrigin} initialPosition={openingPosition.current}
            aspectRatio={aspectRatio} priority unoptimized={unoptimized} onImageError={onImageError}
            allowFullscreen={false} animateHint={false} onPositionChange={setPosition} className="!rounded-none" />
        </div>
        <p className="text-xs text-white/70">Utilisez les flèches du clavier sur le curseur. Échap pour fermer.</p>
      </div>
    </dialog>, portalRoot)}
    </>
  )
}

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
import { useCallback, useEffect, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  initialPosition?: number
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
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Avant',
  afterAlt = 'Après',
  initialPosition = 50,
  beforeObjectPosition = 'center 50%',
  afterObjectPosition = 'center 50%',
  afterTransform,
  afterTransformOrigin = 'center 40%',
}: BeforeAfterSliderProps) {
  // Position du curseur en pourcentage (0 = tout à gauche, 100 = tout à droite)
  const [position, setPosition] = useState(initialPosition)

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
  }, [initialPosition])

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
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      role="img"
      aria-label={`Comparaison avant/après : ${beforeAlt} et ${afterAlt}`}
    >

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
        alt={afterAlt}
        fill
        className="object-cover pointer-events-none"
        style={{
          objectPosition: afterObjectPosition,
          ...(afterTransform && {
            transform: afterTransform,
            transformOrigin: afterTransformOrigin,
          }),
        }}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
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
          alt={beforeAlt}
          fill
          className="object-cover"
          style={{ objectPosition: beforeObjectPosition }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* ── Barre verticale séparatrice ───────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Poignée centrale — cercle blanc avec icône double flèche */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
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
          className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity duration-200"
          style={{ opacity: position > 15 ? 1 : 0 }}
        >
          Avant
        </span>
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span
          className="font-[family-name:var(--font-space-mono)] text-xs px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity duration-200"
          style={{ opacity: position < 85 ? 1 : 0 }}
        >
          Après
        </span>
      </div>

    </div>
  )
}

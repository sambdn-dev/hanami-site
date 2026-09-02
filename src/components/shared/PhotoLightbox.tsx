/**
 * PhotoLightbox.tsx — Modal stylé pour visualiser une photo en grand
 *
 * Utilisé dans la calculatrice quand l'utilisateur clique sur la miniature
 * d'une zone. Affiche la photo plein écran sur fond noir blurré.
 *
 * Features :
 *  - Fond opaque + backdrop blur, hors espace photo
 *  - Bouton fermeture (X) en haut à droite + Esc + click hors photo
 *  - Animation d'apparition douce (fade + scale)
 *  - Empêche le scroll de la page derrière
 *  - Affiche le titre de la zone en bas
 *  - Préserve le ratio d'origine (object-contain) — jamais d'étirement
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface PhotoLightboxProps {
  /** dataUrl ou URL de l'image. null = lightbox fermé. */
  src: string | null
  /** Légende optionnelle affichée en bas */
  caption?: string
  onClose: () => void
}

/**
 * Modal lightbox stylé. Rendu via Portal dans document.body pour échapper
 * à toute contrainte de positionnement (parent avec `transform` ou `filter`
 * casserait `fixed inset-0`, le portail garantit qu'on couvre bien le viewport).
 */
export default function PhotoLightbox({ src, caption, onClose }: PhotoLightboxProps) {
  // Le portal cible body — initialisé côté client uniquement (SSR-safe)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  useEffect(() => { setPortalRoot(document.body) }, [])

  // Refs pour la gestion du focus (accessibilité clavier)
  const dialogRef   = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Touche Esc pour fermer + piège Tab dans le dialog + bloque le scroll body
  useEffect(() => {
    if (!src) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()

      // Piège le focus dans le dialog : Tab boucle sur les éléments focusables
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last  = focusables[focusables.length - 1]

        if (!dialogRef.current?.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [src, onClose])

  // À l'ouverture : mémorise l'élément déclencheur puis focus le bouton
  // Fermer ; à la fermeture : rend le focus au déclencheur.
  useEffect(() => {
    if (!src || !portalRoot) return

    const trigger = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    closeBtnRef.current?.focus()

    return () => { trigger?.focus() }
  }, [src, portalRoot])

  if (!src || !portalRoot) return null

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo de la zone"
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
    >
      {/* Bouton fermeture en haut à droite */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5" strokeWidth={2.2} />
      </button>

      {/* Image + caption — clic dessus ne ferme pas (stop propagation) */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-full flex flex-col items-center gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ?? 'Photo de la zone'}
          className="max-w-full max-h-[80vh] w-auto h-auto rounded-xl shadow-2xl object-contain"
          draggable={false}
        />
        {caption && (
          <figcaption className="text-white/80 text-sm font-[family-name:var(--font-fraunces)] tracking-wide">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>,
    portalRoot,
  )
}

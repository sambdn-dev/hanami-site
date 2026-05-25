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

import { useEffect, useState } from 'react'
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

  // Touche Esc pour fermer + bloque le scroll body pendant l'ouverture
  useEffect(() => {
    if (!src) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [src, onClose])

  if (!src || !portalRoot) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo de la zone"
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
    >
      {/* Bouton fermeture en haut à droite */}
      <button
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

/**
 * StepEtat.tsx — Étape 2 : sélection 1-6 photos parmi 10 états types
 *
 * Grille adaptative : 2 cols mobile, 3 cols tablette, 4-5 cols desktop.
 * Sélection : tap pour ajouter, retap pour retirer. Max 6 photos.
 *
 * Chaque vignette a un bouton "loupe" en haut à droite qui ouvre la
 * photo en grand via PhotoLightbox (modal portail). Tap sur la vignette
 * = sélectionner ; tap sur la loupe = agrandir (propagation stoppée).
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Expand } from 'lucide-react'
import StepNav from '../StepNav'
import PhotoLightbox from '@/components/shared/PhotoLightbox'
import { ETAT_PHOTOS } from '@/lib/chantier/etats-photos'
import type { ChantierFormState } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
}

const MAX_SELECTION = 6

export default function StepEtat({ state, onUpdate, onNext, onBack }: Props) {
  const selected = state.etatPhotos
  const isValid = selected.length >= 1 && selected.length <= MAX_SELECTION
  const canSelectMore = selected.length < MAX_SELECTION

  // État du lightbox (modal photo agrandie)
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)

  function toggle(id: string) {
    if (selected.includes(id)) {
      onUpdate({ etatPhotos: selected.filter(s => s !== id) })
    } else if (canSelectMore) {
      onUpdate({ etatPhotos: [...selected, id] })
    }
  }

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape 2
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        À quoi ressemble votre gazon aujourd&apos;hui ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Sélectionnez jusqu&apos;à 6 photos qui correspondent le mieux à l&apos;état actuel de votre pelouse.
        Touchez l&apos;icône <Expand className="inline w-3.5 h-3.5 -mt-0.5" /> pour agrandir.
      </p>

      {/* Compteur */}
      <p className="font-[family-name:var(--font-space-mono)] text-xs text-stone-500 mt-6">
        <span className="font-bold text-hanami-700">{selected.length}</span>
        <span className="mx-1">/</span>
        <span>{MAX_SELECTION} photos sélectionnées</span>
      </p>

      {/* Grille de photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {ETAT_PHOTOS.map(photo => {
          const isSelected = selected.includes(photo.id)
          const disabled = !isSelected && !canSelectMore
          return (
            <div
              key={photo.id}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-hanami-500 ring-2 ring-hanami-500/30'
                  : disabled
                    ? 'border-stone-200 opacity-40'
                    : 'border-stone-200 hover:border-hanami-400 hover:scale-[1.02]'
              }`}
            >
              {/* Bouton principal — toggle sélection sur toute la surface */}
              <button
                type="button"
                onClick={() => toggle(photo.id)}
                disabled={disabled}
                className="absolute inset-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Désélectionner' : 'Sélectionner'} : ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  draggable={false}
                />
              </button>

              {/* Overlay sombre + badge sélectionné (au-dessus du bouton mais pointer-events:none) */}
              {isSelected && (
                <div className="absolute inset-0 bg-hanami-900/30 pointer-events-none" />
              )}

              {/* Bouton "agrandir" en haut à droite.
                  - Desktop (lg+) : invisible par défaut, apparaît au hover de la vignette
                  - Mobile/tablette : visible discrètement (pas de hover possible
                    sur écrans tactiles, sinon le bouton serait inaccessible). */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({ src: photo.src, caption: photo.label })
                }}
                aria-label={`Agrandir la photo : ${photo.label}`}
                title="Agrandir"
                className="absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full bg-black/55 backdrop-blur-sm text-white flex items-center justify-center opacity-60 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-black/75 transition-all cursor-pointer"
              >
                <Expand className="w-3.5 h-3.5" strokeWidth={2.2} />
              </button>

              {/* Badge "sélectionné" en haut à droite quand actif (sous le bouton expand) */}
              {isSelected && (
                <span className="absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-full bg-hanami-500 flex items-center justify-center shadow-lg pointer-events-none">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </span>
              )}

              {/* Label en bas — non interactif */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                <p className="text-white text-[11px] font-medium leading-tight text-left line-clamp-2">
                  {photo.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <StepNav onBack={onBack} onNext={onNext} canProceed={isValid} />

      {/* Lightbox plein écran portail vers <body> */}
      <PhotoLightbox
        src={lightbox?.src ?? null}
        caption={lightbox?.caption}
        onClose={() => setLightbox(null)}
      />
    </div>
  )
}

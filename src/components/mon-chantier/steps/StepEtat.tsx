/**
 * StepEtat.tsx — Étape 2 : sélection 1-4 photos parmi 10 états types
 *
 * Grille 2 col × 5 lignes mobile, 5 col × 2 lignes desktop.
 * Sélection : tap pour ajouter, retap pour retirer. Max 4 photos.
 */

'use client'

import { Check } from 'lucide-react'
import StepNav from '../StepNav'
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
            <button
              key={photo.id}
              type="button"
              onClick={() => toggle(photo.id)}
              disabled={disabled}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-hanami-500 ring-2 ring-hanami-500/30'
                  : disabled
                    ? 'border-stone-200 opacity-40 cursor-not-allowed'
                    : 'border-stone-200 hover:border-hanami-400 hover:scale-[1.02]'
              }`}
              aria-pressed={isSelected}
              aria-label={photo.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlay sombre + badge "sélectionné" */}
              {isSelected && (
                <div className="absolute inset-0 bg-hanami-900/30 flex items-start justify-end p-2">
                  <span className="w-6 h-6 rounded-full bg-hanami-500 flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </span>
                </div>
              )}

              {/* Label en bas */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="text-white text-[11px] font-medium leading-tight text-left line-clamp-2">
                  {photo.label}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <StepNav onBack={onBack} onNext={onNext} canProceed={isValid} />
    </div>
  )
}

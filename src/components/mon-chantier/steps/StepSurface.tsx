/**
 * StepSurface.tsx — Étape 1 : surface du gazon en m²
 *
 * 6 puces presets (Moins de 100 / 100 / 300 / 500 / 1000 / Plus de 1000) pour
 * saisie rapide + champ numérique pour les valeurs précises.
 *
 * Pour les chips extrêmes ("Moins de 100" et "Plus de 1 000"), on pose une
 * valeur médiane par défaut (75 et 1500) ET on focus le champ précis pour
 * inviter l'utilisateur à préciser. Si rien n'est saisi, le default sera
 * gardé pour le calcul.
 *
 * Validation : surface > 0 && surface ≤ 50 000 m².
 */

'use client'

import { useRef, useState } from 'react'
import StepNav from '../StepNav'
import type { ChantierFormState } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
}

interface Preset {
  label: string
  /** Valeur posée dans l'état au clic — sert de fallback si l'utilisateur ne précise pas */
  value: number
  /** Si true, on focus l'input précis au clic pour inviter à affiner */
  promptPrecise?: boolean
}

const PRESETS: Preset[] = [
  { label: 'Moins de 100 m²', value: 75, promptPrecise: true },
  { label: '100 m²',          value: 100 },
  { label: '300 m²',          value: 300 },
  { label: '500 m²',          value: 500 },
  { label: '1 000 m²',        value: 1000 },
  { label: 'Plus de 1 000 m²', value: 1500, promptPrecise: true },
]

export default function StepSurface({ state, onUpdate, onNext }: Props) {
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isValid = state.surface !== null && state.surface > 0 && state.surface <= 50_000

  function handlePresetClick(preset: Preset) {
    onUpdate({ surface: preset.value })
    setTouched(true)
    // Pour les extrêmes, focus l'input pour que l'utilisateur précise
    if (preset.promptPrecise) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value === '' ? null : Number(e.target.value)
    onUpdate({ surface: v })
    setTouched(true)
  }

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape 1
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Quelle est la surface de votre gazon ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Une estimation suffit. Si vous hésitez, choisissez la valeur la plus proche —
        vous pourrez toujours préciser dans le champ ci-dessous.
      </p>

      {/* Presets en chips */}
      <div className="flex flex-wrap gap-2 mt-8">
        {PRESETS.map(p => {
          const active = state.surface === p.value
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePresetClick(p)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                active
                  ? 'bg-hanami-700 border-hanami-700 text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-hanami-500'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Champ numérique pour valeur précise */}
      <div className="mt-8 max-w-xs">
        <label htmlFor="surface" className="text-sm font-medium text-stone-700 block mb-1.5">
          Valeur précise <span className="text-stone-400 font-normal">(modifiable)</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="surface"
            type="number"
            inputMode="numeric"
            min="1"
            max="50000"
            step="10"
            value={state.surface ?? ''}
            onChange={handleInputChange}
            placeholder="350"
            className="w-full px-4 py-3 pr-14 rounded-md border border-stone-200 bg-white text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-hanami-500/40 focus:border-hanami-500 transition-shadow"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-space-mono)] text-sm text-stone-400">
            m²
          </span>
        </div>
        {state.surface !== null && state.surface > 0 && state.surface <= 50_000 && (
          <p className="text-xs text-stone-500 mt-1.5">
            Valeur enregistrée : <span className="font-medium text-hanami-700 font-[family-name:var(--font-space-mono)]">{state.surface} m²</span>
          </p>
        )}
        {touched && state.surface !== null && (state.surface <= 0 || state.surface > 50_000) && (
          <p className="text-red-500 text-xs mt-2">Surface invalide (1 – 50 000 m²)</p>
        )}
      </div>

      <StepNav onNext={onNext} canProceed={isValid} />
    </div>
  )
}

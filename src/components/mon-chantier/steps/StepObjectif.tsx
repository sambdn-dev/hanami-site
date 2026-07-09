/**
 * StepObjectif.tsx — Étape 3 : objectif principal (4 cartes radios)
 *
 * Sélection unique. Le choix combine avec les photos d'état pour
 * déterminer le service recommandé.
 */

'use client'

import StepNav from '../StepNav'
import { OBJECTIFS } from '@/lib/chantier/objectifs'
import type { ChantierFormState } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  stepNumber: number
}

export default function StepObjectif({ state, onUpdate, onNext, onBack, stepNumber }: Props) {
  const isValid = state.objectif !== null

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape {stepNumber}
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Quel est votre objectif principal ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Une seule réponse. C&apos;est ce qui détermine le service le plus adapté pour vous.
      </p>

      {/* Grille de cartes objectifs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {OBJECTIFS.map(obj => {
          const isSelected = state.objectif === obj.id
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => onUpdate({ objectif: obj.id })}
              className={`text-left p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-hanami-500 bg-hanami-100/40 ring-2 ring-hanami-500/20'
                  : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-stone-50'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" aria-hidden="true">{obj.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-base leading-tight ${
                    isSelected ? 'text-hanami-900' : 'text-stone-800'
                  }`}>
                    {obj.label}
                  </p>
                  <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <StepNav onBack={onBack} onNext={onNext} canProceed={isValid} />
    </div>
  )
}

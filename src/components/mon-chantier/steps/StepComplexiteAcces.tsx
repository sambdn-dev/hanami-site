/**
 * StepComplexiteAcces.tsx — Étape Complexité du terrain + Accès au jardin
 *
 * Deux questions dans la même étape, chacune avec 3-4 cartes :
 *  - Complexité (forme, obstacles, finitions) → coefficient prix
 *  - Accès (escaliers, passage) → coefficient logistique
 *
 * Les coefficients sont définis dans lib/chantier/complexite.ts et
 * multipliés dans pricing.ts pour Express et Reconstruction uniquement.
 */

'use client'

import { Square, TreeDeciduous, Trees, Puzzle, DoorOpen, Footprints, Mountain, type LucideIcon } from 'lucide-react'
import StepNav from '../StepNav'
import { COMPLEXITES, ACCES } from '@/lib/chantier/complexite'
import type { ChantierFormState, ComplexiteId, AccesId } from '@/lib/chantier/types'

/* Icônes Lucide mappées côté client — lib/chantier/complexite.ts reste des
 * données pures (aussi importé côté serveur pour les emails). */
const COMPLEXITE_ICONS: Record<ComplexiteId, LucideIcon> = {
  simple: Square,
  moyenne: TreeDeciduous,
  elevee: Trees,
  tres_elevee: Puzzle,
}

const ACCES_ICONS: Record<AccesId, LucideIcon> = {
  facile: DoorOpen,
  moyen: Footprints,
  difficile: Mountain,
}

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  stepNumber: number
}

export default function StepComplexiteAcces({ state, onUpdate, onNext, onBack, stepNumber }: Props) {
  const isValid = state.complexite !== null && state.acces !== null

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape {stepNumber}
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Comment décririez-vous votre terrain ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Le temps de travail varie selon la forme du jardin et l&apos;accès. Ces deux
        informations permettent d&apos;ajuster l&apos;estimation au plus juste.
      </p>

      {/* ── Complexité du terrain ─────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-hanami-900 mb-3">
          Complexité du jardin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMPLEXITES.map(opt => {
            const isSelected = state.complexite === opt.id
            const Icon = COMPLEXITE_ICONS[opt.id]
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate({ complexite: opt.id as ComplexiteId })}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-hanami-500 bg-hanami-100/40 ring-2 ring-hanami-500/20'
                    : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-stone-50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-hanami-500 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm leading-tight ${
                      isSelected ? 'text-hanami-900' : 'text-stone-800'
                    }`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Accès au jardin ───────────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-hanami-900 mb-3">
          Accès au jardin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ACCES.map(opt => {
            const isSelected = state.acces === opt.id
            const Icon = ACCES_ICONS[opt.id]
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate({ acces: opt.id as AccesId })}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-hanami-500 bg-hanami-100/40 ring-2 ring-hanami-500/20'
                    : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-stone-50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex flex-col items-start gap-2">
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-hanami-500 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </span>
                  <p className={`font-semibold text-sm leading-tight ${
                    isSelected ? 'text-hanami-900' : 'text-stone-800'
                  }`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <StepNav onBack={onBack} onNext={onNext} canProceed={isValid} />
    </div>
  )
}

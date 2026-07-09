/**
 * StepArrosage.tsx — Étape 4 : possession d'un système d'arrosage automatique
 *
 * Question de qualification commerciale (signal fort pour Sami) :
 * un client avec arrosage auto a un taux de réussite très supérieur sur
 * une rénovation de gazon (l'arrosage post-semis est déterminant).
 *
 * 3 réponses possibles : Oui · Non · Je ne sais pas. La 3e laisse une
 * porte de sortie aux gens qui hésitent (locataire, copropriété, neuf…).
 */

'use client'

import { Droplets, X, HelpCircle } from 'lucide-react'
import StepNav from '../StepNav'
import type { ChantierFormState, ArrosageReponse } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  stepNumber: number
}

interface Choice {
  id: ArrosageReponse
  label: string
  description: string
  icon: React.ReactNode
}

const CHOICES: Choice[] = [
  {
    id: 'oui',
    label: 'Oui',
    description: "J'ai un système d'arrosage automatique enterré ou un programmateur",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    id: 'non',
    label: 'Non',
    description: "J'arrose à la main, ou je n'arrose pas du tout",
    icon: <X className="w-5 h-5" />,
  },
  {
    id: 'je-ne-sais-pas',
    label: 'Je ne sais pas encore',
    description: "Je suis en location, en construction, ou je compte en installer un",
    icon: <HelpCircle className="w-5 h-5" />,
  },
]

export default function StepArrosage({ state, onUpdate, onNext, onBack, stepNumber }: Props) {
  const isValid = state.arrosageAuto !== null

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape {stepNumber}
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Avez-vous un système d&apos;arrosage automatique ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        L&apos;arrosage post-semis est <strong>le facteur n°1</strong> de réussite d&apos;une
        rénovation de gazon. Cette information nous aide à adapter le protocole
        et à prioriser les chantiers qui ont les meilleures chances de réussite.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
        {CHOICES.map(choice => {
          const isSelected = state.arrosageAuto === choice.id
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onUpdate({ arrosageAuto: choice.id })}
              className={`text-left p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-hanami-500 bg-hanami-100/40 ring-2 ring-hanami-500/20'
                  : 'border-stone-200 bg-white hover:border-hanami-400 hover:bg-stone-50'
              }`}
              aria-pressed={isSelected}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                isSelected ? 'bg-hanami-500 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {choice.icon}
              </div>
              <p className={`font-semibold text-base leading-tight ${
                isSelected ? 'text-hanami-900' : 'text-stone-800'
              }`}>
                {choice.label}
              </p>
              <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                {choice.description}
              </p>
            </button>
          )
        })}
      </div>

      <StepNav onBack={onBack} onNext={onNext} canProceed={isValid} />
    </div>
  )
}

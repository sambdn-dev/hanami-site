/**
 * ProgressPanel.tsx — Panneau de progression vertical (desktop only)
 *
 * Affiché à gauche du wizard sur écrans ≥ lg. Liste les 7 étapes,
 * met en avant l'étape courante, coche les étapes complétées.
 *
 * Les étapes déjà visitées (status "done") sont cliquables pour permettre
 * à l'utilisateur de revenir en arrière modifier une réponse — le bouton
 * "Retour" sous chaque étape ne permettait que de reculer d'un cran.
 */

'use client'

import { Check } from 'lucide-react'

export interface StepDefinition {
  index: number
  label: string
  /** Sous-titre court affiché sous le label de l'étape active */
  hint?: string
}

interface ProgressPanelProps {
  steps: StepDefinition[]
  currentStep: number
  /** Plus haute étape jamais atteinte — détermine ce qui est cliquable */
  maxVisitedStep: number
  /** Callback déclenché quand l'utilisateur clique sur une étape déjà visitée */
  onStepClick: (stepIndex: number) => void
}

export default function ProgressPanel({ steps, currentStep, maxVisitedStep, onStepClick }: ProgressPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col bg-hanami-900 text-white px-8 py-8 sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
      {/* En-tête */}
      <div className="mb-6 shrink-0">
        <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-[0.18em] uppercase text-hanami-100/60">
          Mon chantier
        </span>
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold leading-tight mt-2">
          Votre estimation Hanami en 2 minutes.
        </h2>
      </div>

      {/* Liste des étapes — scrollable mais barre masquée pour rester épuré */}
      <ol className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 scrollbar-hide">
        {steps.map((step, i) => {
          // Une étape est "done" si on l'a déjà dépassée OU si on est revenu en
          // arrière mais qu'on était allé plus loin (maxVisitedStep > i).
          const isVisited = i <= maxVisitedStep && i !== currentStep
          const status =
            i === currentStep ? 'active'
            : isVisited ? 'done'
            : 'pending'

          // Navigation libre vers les étapes de SAISIE (0 à length-2).
          // L'étape Estimation (dernière) reste verrouillée jusqu'à la
          // soumission — un accès direct afficherait une page vide.
          const onFinalStep = currentStep >= steps.length - 1
          const isFinalStep = i === steps.length - 1
          const clickable = i !== currentStep && !onFinalStep && !isFinalStep

          const Tag = clickable ? 'button' : 'div'

          return (
            <li key={step.index} className="relative pb-6 last:pb-0">

              {/* Ligne verticale reliant les puces */}
              {i < steps.length - 1 && (
                <span
                  className={`absolute left-[15px] top-8 bottom-0 w-px ${
                    status === 'done' ? 'bg-amber-500/60' : 'bg-white/15'
                  }`}
                  aria-hidden="true"
                />
              )}

              <Tag
                {...(clickable ? {
                  type: 'button' as const,
                  onClick: () => onStepClick(i),
                  'aria-label': `Revenir à l'étape ${i + 1} : ${step.label}`,
                } : {})}
                className={`flex items-start gap-4 w-full text-left ${
                  clickable
                    ? 'cursor-pointer group hover:opacity-90 transition-opacity'
                    : ''
                }`}
              >
                {/* Puce numéro / icône */}
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                    status === 'done'
                      ? 'bg-amber-500 border-amber-500 text-hanami-900 group-hover:scale-110'
                      : status === 'active'
                        ? 'bg-white text-hanami-900 border-white'
                        : 'bg-transparent border-white/25 text-white/50'
                  }`}
                >
                  {status === 'done' ? <Check className="w-4 h-4" strokeWidth={2.5} /> : i + 1}
                </span>

                {/* Label + hint */}
                <div className="flex-1 pt-1">
                  <p
                    className={`text-sm font-medium leading-tight transition-colors ${
                      status === 'pending' ? 'text-white/50' : 'text-white'
                    } ${clickable ? 'group-hover:text-amber-100' : ''}`}
                  >
                    {step.label}
                  </p>
                  {status === 'active' && step.hint && (
                    <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                      {step.hint}
                    </p>
                  )}
                  {clickable && (
                    <p className="text-[10px] text-white/40 mt-1 group-hover:text-amber-100/60 transition-colors">
                      {status === 'done' ? 'Modifier ma réponse' : 'Aller à cette étape'}
                    </p>
                  )}
                </div>
              </Tag>
            </li>
          )
        })}
      </ol>

      {/* Footer rassurant — toujours visible en bas du panneau, hors scroll */}
      <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
        <p className="text-[11px] text-white/50 leading-relaxed">
          Vos réponses servent uniquement à établir votre estimation.
          Elles ne sont jamais partagées sans votre accord.
        </p>
      </div>
    </aside>
  )
}

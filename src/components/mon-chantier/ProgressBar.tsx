/**
 * ProgressBar.tsx — Barre de progression horizontale (mobile only)
 *
 * Affichée en haut du wizard sur écrans < lg. Tap → ouvre un menu déroulant
 * listant toutes les étapes (analogue au panneau gauche desktop).
 *
 * Les étapes "done" sont tapables pour revenir/sauter ; les "pending"
 * (jamais visitées) sont grisées et inertes.
 *
 * Sur l'écran final (Estimation), la barre devient inerte (envoi déjà fait).
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { StepDefinition } from './ProgressPanel'

interface ProgressBarProps {
  steps: StepDefinition[]
  currentStep: number
  /** Plus haute étape jamais atteinte */
  maxVisitedStep: number
  /** Callback déclenché quand l'utilisateur tape sur une étape déjà visitée */
  onStepClick: (stepIndex: number) => void
}

export default function ProgressBar({ steps, currentStep, maxVisitedStep, onStepClick }: ProgressBarProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = steps.length
  const current = steps[currentStep]
  const percent = Math.round(((currentStep + 1) / total) * 100)
  const onFinalStep = currentStep >= total - 1

  // Click extérieur ferme le menu
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Ferme le menu quand l'étape change
  useEffect(() => { setOpen(false) }, [currentStep])

  function handleStepTap(i: number) {
    // Navigation libre vers n'importe quelle étape (sauf depuis l'écran final)
    if (onFinalStep || i === currentStep) return
    onStepClick(i)
  }

  return (
    <div ref={containerRef} className="lg:hidden sticky top-14 z-20 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      {/* Bouton principal — toggle le menu */}
      <button
        type="button"
        onClick={() => !onFinalStep && setOpen(o => !o)}
        disabled={onFinalStep}
        className="w-full flex items-center gap-3 px-4 py-3 text-left disabled:cursor-default cursor-pointer"
        aria-expanded={open}
        aria-label="Menu de navigation des étapes"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-stone-500">
              Étape {currentStep + 1} / {total}
            </span>
            <span className="text-[10px] font-medium text-hanami-700 font-[family-name:var(--font-space-mono)]">
              {percent}%
            </span>
          </div>
          <p className="text-sm font-medium text-hanami-900 leading-tight truncate">
            {current?.label}
          </p>

          {/* Barre de progression */}
          <div className="h-1 mt-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Chevron — masqué sur écran final */}
        {!onFinalStep && (
          <ChevronDown
            className={`w-5 h-5 text-stone-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Menu déroulant — liste des étapes */}
      {open && (
        <ol className="absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-lg max-h-[70vh] overflow-y-auto">
          {steps.map((step, i) => {
            const isVisited = i <= maxVisitedStep && i !== currentStep
            const status =
              i === currentStep ? 'active'
              : isVisited ? 'done'
              : 'pending'
            const tappable = i !== currentStep && !onFinalStep

            return (
              <li key={step.index}>
                <button
                  type="button"
                  onClick={() => handleStepTap(i)}
                  disabled={!tappable}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-stone-100 last:border-b-0 transition-colors ${
                    tappable ? 'hover:bg-hanami-100/40 active:bg-hanami-100/60 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Puce */}
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border ${
                      status === 'done'
                        ? 'bg-amber-500 border-amber-500 text-hanami-900'
                        : status === 'active'
                          ? 'bg-hanami-700 border-hanami-700 text-white'
                          : 'bg-transparent border-stone-300 text-stone-400'
                    }`}
                  >
                    {status === 'done' ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : i + 1}
                  </span>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight ${
                      status === 'pending' ? 'text-stone-400' : 'text-stone-800'
                    } ${status === 'active' ? 'font-semibold' : 'font-medium'}`}>
                      {step.label}
                    </p>
                    {tappable && (
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {status === 'done' ? 'Modifier ma réponse' : 'Aller à cette étape'}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

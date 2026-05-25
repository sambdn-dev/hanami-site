/**
 * StepNav.tsx — Boutons "Retour" + "Continuer" partagés par toutes les étapes
 *
 * Présentation cohérente : retour à gauche (lien discret), CTA principal à droite.
 * Le CTA est désactivé tant que la validation locale de l'étape n'est pas OK.
 */

'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'

interface StepNavProps {
  /** Affiché si l'utilisateur peut revenir en arrière (pas à l'étape 1) */
  onBack?: () => void
  onNext: () => void
  /** Désactive le CTA "Continuer" tant que l'étape n'est pas valide */
  canProceed: boolean
  /** Override du label du bouton principal (défaut: "Continuer") */
  nextLabel?: string
  /** True quand on est sur l'étape coordonnées (envoi en cours) */
  loading?: boolean
}

export default function StepNav({
  onBack,
  onNext,
  canProceed,
  nextLabel = 'Continuer',
  loading,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-stone-200">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-hanami-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      ) : (
        <span aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed || loading}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Envoi...' : nextLabel}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

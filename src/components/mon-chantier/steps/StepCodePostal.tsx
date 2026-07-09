/**
 * StepCodePostal.tsx — Étape 4 : adresse avec autocomplete BAN
 *
 * Utilise l'API publique data.gouv.fr (Base Adresse Nationale) pour suggérer
 * les adresses pendant la saisie. À la sélection, on extrait automatiquement
 * code postal + ville. Si l'utilisateur ne sélectionne pas, on tente
 * d'extraire un CP de la chaîne libre (5 chiffres présents).
 *
 * Validation : on a besoin d'un code postal 5 chiffres pour pouvoir avancer.
 * Si hors zone 30km Vésinet, message d'avertissement avec bascule auto Coaching.
 */

'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import StepNav from '../StepNav'
import AdresseAutocomplete, { type SelectedAdresse } from '../AdresseAutocomplete'
import { isValidCodePostalFormat, getZoneType, TRAVEL_FEE_PAID_ZONE } from '@/lib/chantier/postal-codes'
import type { ChantierFormState } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  stepNumber: number
}

/** Tente d'extraire un CP français (5 chiffres) d'un texte libre */
function extractCodePostal(text: string): string {
  const match = text.match(/\b\d{5}\b/)
  return match ? match[0] : ''
}

export default function StepCodePostal({ state, onUpdate, onNext, onBack, stepNumber }: Props) {
  const [touched, setTouched] = useState(false)

  /** Quand l'utilisateur tape librement, on tente d'extraire un CP au passage.
   *  Sinon il sera setté proprement à la sélection d'une suggestion. */
  function handleAdresseChange(label: string) {
    const cp = extractCodePostal(label)
    onUpdate({
      adresseComplete: label,
      codePostal: cp,
      // Si on retape, on reset la ville (sera reseté à la prochaine sélection)
      ville: cp ? state.ville : '',
    })
  }

  function handleSelect(adr: SelectedAdresse) {
    onUpdate({
      adresseComplete: adr.label,
      codePostal: adr.postcode,
      ville: adr.city,
    })
    setTouched(true)
  }

  // Le bouton continuer s'active dès qu'on a un CP valide (sélection ou texte libre)
  const formatOk = isValidCodePostalFormat(state.codePostal)
  const zoneType = formatOk ? getZoneType(state.codePostal) : 'out'
  const showPaidZone = formatOk && zoneType === 'paid'
  const showOutOfZone = formatOk && zoneType === 'out'

  // Marque comme touched une fois que l'utilisateur a tapé
  useEffect(() => {
    if (state.adresseComplete.length > 0) setTouched(true)
  }, [state.adresseComplete])

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape {stepNumber}
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Dans quelle ville se trouve votre jardin ?
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Sélectionnez votre commune — les suggestions apparaîtront automatiquement.
        Cliquez sur <em>Me géolocaliser</em> pour suggérer la vôtre en premier.
        L&apos;adresse précise sera demandée plus tard, si on convient d&apos;un RDV.
      </p>

      <div className="mt-8 max-w-xl">
        <label htmlFor="ville" className="text-sm font-medium text-stone-700 block mb-1.5">
          Votre ville <span className="text-red-500">*</span>
        </label>

        <AdresseAutocomplete
          value={state.adresseComplete}
          onChange={handleAdresseChange}
          onSelect={handleSelect}
          isValid={formatOk}
        />

        {/* Confirmation visuelle quand la ville est sélectionnée */}
        {formatOk && state.ville && (
          <p className="mt-2 text-xs text-hanami-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ville reconnue · <span className="font-medium">{state.codePostal} {state.ville}</span>
          </p>
        )}

        {/* Erreur si pas de CP détecté */}
        {touched && state.adresseComplete.length > 0 && !formatOk && (
          <p className="text-red-500 text-xs mt-2">
            Aucune ville détectée. Sélectionnez une suggestion dans la liste.
          </p>
        )}
      </div>

      {/* Message zone étendue (déplacement +100€) */}
      {showPaidZone && (
        <div className="mt-6 p-4 rounded-xl bg-hanami-100/40 border border-hanami-500/30 max-w-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-hanami-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-800 text-sm">
              Zone d&apos;intervention étendue (limitrophe IdF).
            </p>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">
              Hanami se déplace dans votre département. Un <strong>forfait déplacement
              de {TRAVEL_FEE_PAID_ZONE} € TTC</strong> sera ajouté à votre estimation pour
              les services Express et Reconstruction.
            </p>
          </div>
        </div>
      )}

      {/* Message hors zone */}
      {showOutOfZone && (
        <div className="mt-6 p-4 rounded-xl bg-amber-100/60 border border-amber-500/30 max-w-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-800 text-sm">
              Vous êtes hors zone d&apos;intervention sur place.
            </p>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">
              Pas de problème : on vous proposera notre <strong>Coaching Hanami</strong> (29 €/mois TTC),
              un suivi 100 % en ligne avec protocole personnalisé sur 12 mois et accès aux produits
              professionnels. Disponible partout en France.
            </p>
          </div>
        </div>
      )}

      <StepNav onBack={onBack} onNext={onNext} canProceed={formatOk} />
    </div>
  )
}

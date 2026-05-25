/**
 * ChantierWizard.tsx — Orchestrateur du wizard /mon-chantier
 *
 * State machine 7 étapes :
 *   0 Surface → 1 État → 2 Objectif → 3 Code postal → 4 Photos → 5 Coordonnées → 6 Résultat
 *
 * À la fin de l'étape Coordonnées :
 *   - calcule le service recommandé via scoring.ts
 *   - calcule l'estimation chiffrée via pricing.ts
 *   - envoie un FormData à /api/chantier (Resend récap + pièces jointes)
 *   - bascule vers l'étape Résultat avec status success/error
 *
 * Layout :
 *   - Desktop ≥ lg : 2 cols (panneau gauche fixe + contenu scrollable)
 *   - Mobile : 1 col avec barre de progression sticky en haut
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import ProgressPanel, { type StepDefinition } from './ProgressPanel'
import ProgressBar from './ProgressBar'

import StepSurface from './steps/StepSurface'
import StepEtat from './steps/StepEtat'
import StepObjectif from './steps/StepObjectif'
import StepArrosage from './steps/StepArrosage'
import StepCodePostal from './steps/StepCodePostal'
import StepPhotos from './steps/StepPhotos'
import StepCoordonnees from './steps/StepCoordonnees'
import StepResultat from './steps/StepResultat'

import { recommendService, adjustForOutOfZone } from '@/lib/chantier/scoring'
import { computeEstimation } from '@/lib/chantier/pricing'
import { getZoneType } from '@/lib/chantier/postal-codes'
import type { ChantierFormState, ChantierResult } from '@/lib/chantier/types'

// ── Définition statique des étapes (panneau de progression) ─────────────────

const STEP_DEFS: StepDefinition[] = [
  { index: 0, label: 'Surface',           hint: "Quelques m² près suffisent." },
  { index: 1, label: 'État du gazon',     hint: 'Sélectionnez jusqu\'à 6 photos qui ressemblent au vôtre.' },
  { index: 2, label: 'Objectif',          hint: 'Une seule réponse — la plus importante pour vous.' },
  { index: 3, label: 'Arrosage',          hint: 'Information clé pour la réussite de votre rénovation.' },
  { index: 4, label: 'Ville',             hint: 'Pour vérifier la zone d\'intervention. L\'adresse précise sera demandée plus tard.' },
  { index: 5, label: 'Photos (facultatif)', hint: 'Optionnel. Vos photos affineront mon devis.' },
  { index: 6, label: 'Coordonnées',       hint: 'Pour vous envoyer le récap et vous recontacter.' },
  { index: 7, label: 'Estimation',        hint: 'Votre service recommandé et son tarif TTC.' },
]

// ── État initial ────────────────────────────────────────────────────────────

const INITIAL_STATE: ChantierFormState = {
  surface: null,
  etatPhotos: [],
  objectif: null,
  arrosageAuto: null,
  adresseComplete: '',
  ville: '',
  codePostal: '',
  photosFiles: [],
  prenom: '',
  email: '',
  telephone: '',
}

// ── Composant principal ─────────────────────────────────────────────────────

export default function ChantierWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  /** Étape la plus avancée jamais atteinte (pour permettre la nav avant/arrière
   *  sur les étapes déjà visitées sans avoir à re-cliquer "Continuer" partout). */
  const [maxVisitedStep, setMaxVisitedStep] = useState(0)
  const [state, setState] = useState<ChantierFormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Scroll en haut à chaque changement d'étape pour visibilité claire
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  /** Calcule le résultat (service + estimation) en se basant sur l'état courant.
   *  Mémorisé pour éviter de recalculer entre re-renders. */
  const result = useMemo<ChantierResult | null>(() => {
    if (state.surface === null) return null

    const zoneType = getZoneType(state.codePostal)
    const baseReco = recommendService({
      etatPhotoIds: state.etatPhotos,
      objectif: state.objectif,
    })
    // Hors zone (out) → bascule auto Coaching ; free/paid → service normal
    const finalReco = zoneType === 'out' ? adjustForOutOfZone(baseReco) : baseReco

    return {
      serviceId: finalReco.serviceId,
      alternativeServiceId: finalReco.alternativeServiceId,
      estimation: computeEstimation(finalReco.serviceId, state.surface, zoneType),
      zoneType,
    }
  }, [state.surface, state.etatPhotos, state.objectif, state.codePostal])

  function update(patch: Partial<ChantierFormState>) {
    setState(prev => ({ ...prev, ...patch }))
  }

  function next() {
    setCurrentStep(s => {
      const target = Math.min(s + 1, STEP_DEFS.length - 1)
      setMaxVisitedStep(m => Math.max(m, target))
      return target
    })
  }

  function back() {
    setCurrentStep(s => Math.max(s - 1, 0))
  }

  /** Saut direct via le panneau : navigation libre entre toutes les étapes.
   *  L'utilisateur peut explorer dans l'ordre qu'il veut — chaque étape gère
   *  sa propre validation et bloque "Continuer" si données manquantes.
   *  Seule restriction : pas de retour depuis l'écran Résultat (envoi fait,
   *  modification post-soumission incohérente). */
  function jumpTo(stepIndex: number) {
    if (currentStep >= STEP_DEFS.length - 1) return
    setCurrentStep(stepIndex)
    // Met à jour maxVisitedStep si on saute en avant pour que le visuel
    // (panneau + barre) reflète l'étape la plus haute atteinte.
    setMaxVisitedStep(m => Math.max(m, stepIndex))
  }

  /** Soumet le formulaire à /api/chantier puis avance vers le résultat.
   *  Bascule sur l'étape Résultat dans tous les cas — l'état d'erreur est
   *  affiché in-page avec un bouton WhatsApp de fallback. */
  async function handleSubmit() {
    if (!result || state.surface === null) return

    setSubmitting(true)

    // Construit la payload texte (sans les fichiers)
    const payload = {
      surface: state.surface,
      etatPhotos: state.etatPhotos,
      objectif: state.objectif,
      arrosageAuto: state.arrosageAuto,
      adresseComplete: state.adresseComplete,
      ville: state.ville,
      codePostal: state.codePostal,
      prenom: state.prenom,
      email: state.email,
      telephone: state.telephone,
      // Données calculées (utiles dans l'email Sami pour qu'il sache déjà ce qu'on a recommandé)
      serviceRecommande: result.serviceId,
      estimationMin: result.estimation.min,
      estimationMax: result.estimation.max,
      estimationTerreauMin: result.estimation.withTerreau?.min ?? null,
      estimationTerreauMax: result.estimation.withTerreau?.max ?? null,
      fraisDeplacement: result.estimation.fraisDeplacement,
      zoneType: result.zoneType,
    }

    const fd = new window.FormData()
    fd.append('data', JSON.stringify(payload))
    state.photosFiles.forEach((p, i) => fd.append(`photo_${i}`, p.file))

    try {
      const res = await fetch('/api/chantier', { method: 'POST', body: fd })
      setSubmissionStatus(res.ok ? 'success' : 'error')
    } catch {
      setSubmissionStatus('error')
    } finally {
      setSubmitting(false)
      next()
    }
  }

  // ── Rendu de l'étape courante ─────────────────────────────────────────────
  function renderStep() {
    switch (currentStep) {
      case 0:
        return <StepSurface state={state} onUpdate={update} onNext={next} />
      case 1:
        return <StepEtat state={state} onUpdate={update} onNext={next} onBack={back} />
      case 2:
        return <StepObjectif state={state} onUpdate={update} onNext={next} onBack={back} />
      case 3:
        return <StepArrosage state={state} onUpdate={update} onNext={next} onBack={back} />
      case 4:
        return <StepCodePostal state={state} onUpdate={update} onNext={next} onBack={back} />
      case 5:
        return <StepPhotos state={state} onUpdate={update} onNext={next} onBack={back} />
      case 6:
        return (
          <StepCoordonnees
            state={state}
            onUpdate={update}
            onNext={handleSubmit}
            onBack={back}
            loading={submitting}
          />
        )
      case 7:
        if (!result) return null
        return (
          <StepResultat
            state={state}
            result={result}
            submissionStatus={submissionStatus === 'error' ? 'error' : 'success'}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] min-h-screen bg-stone-50">
      {/* Panneau de progression (desktop) */}
      <ProgressPanel
        steps={STEP_DEFS}
        currentStep={currentStep}
        maxVisitedStep={maxVisitedStep}
        onStepClick={jumpTo}
      />

      {/* Barre de progression (mobile) */}
      <ProgressBar
        steps={STEP_DEFS}
        currentStep={currentStep}
        maxVisitedStep={maxVisitedStep}
        onStepClick={jumpTo}
      />

      {/* Contenu de l'étape */}
      <main className="px-5 py-8 sm:px-8 lg:px-16 lg:py-16 max-w-3xl">
        {renderStep()}
      </main>
    </div>
  )
}

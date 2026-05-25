/**
 * StepCoordonnees.tsx — Étape 6 : coordonnées du visiteur
 *
 * Trois champs : prénom, email, téléphone (FR mobile/fixe).
 * Le bouton final déclenche l'envoi à /api/chantier (parent gère).
 *
 * UX autocomplete navigateur :
 * - Wrapper <form> + name explicites améliorent la détection Chrome/Safari
 * - autoComplete="given-name" / "email" / "tel-national" → autofill profil OS
 *
 * Validation côté client : format email + tel français (10 chiffres).
 */

'use client'

import { useState } from 'react'
import StepNav from '../StepNav'
import type { ChantierFormState } from '@/lib/chantier/types'

interface Props {
  state: ChantierFormState
  onUpdate: (patch: Partial<ChantierFormState>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEL_REGEX = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/

export default function StepCoordonnees({ state, onUpdate, onNext, onBack, loading }: Props) {
  const [touched, setTouched] = useState({ prenom: false, email: false, telephone: false })

  const prenomOk = state.prenom.trim().length >= 2
  const emailOk = EMAIL_REGEX.test(state.email.trim())
  const telOk = TEL_REGEX.test(state.telephone.trim())
  const isValid = prenomOk && emailOk && telOk

  /** Format français progressif : 0612345678 → 06 12 34 56 78 */
  function formatTelephone(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }

  /** Submit propre — empêche le rechargement si l'utilisateur tape Entrée */
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isValid && !loading) onNext()
  }

  return (
    <div>
      <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
        Étape 6
      </span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 mt-2 leading-tight">
        Vos coordonnées
      </h1>
      <p className="text-stone-500 mt-3 max-w-lg">
        Une fois validé, vous obtenez votre estimation et recevez le récap par email.
        Sami vous recontacte sous 24 h pour valider le devis.
      </p>

      {/* Wrapper <form> + name explicites = autofill navigateur fiable.
          method/action sont nominaux, on intercepte onSubmit. */}
      <form
        onSubmit={handleFormSubmit}
        method="post"
        action="#"
        autoComplete="on"
        className="mt-8 max-w-md flex flex-col gap-5"
      >

        {/* Prénom */}
        <div>
          <label htmlFor="prenom" className="text-sm font-medium text-stone-700 block mb-1.5">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            id="prenom"
            name="given-name"
            type="text"
            autoComplete="given-name"
            enterKeyHint="next"
            value={state.prenom}
            onChange={e => onUpdate({ prenom: e.target.value })}
            onBlur={() => setTouched(t => ({ ...t, prenom: true }))}
            placeholder="Sami"
            className={inputClass(touched.prenom && !prenomOk)}
          />
          {touched.prenom && !prenomOk && (
            <p className="text-red-500 text-xs mt-1.5">Au moins 2 caractères</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-stone-700 block mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
            spellCheck={false}
            autoCapitalize="off"
            value={state.email}
            onChange={e => onUpdate({ email: e.target.value })}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            placeholder="sami@exemple.fr"
            className={inputClass(touched.email && !emailOk)}
          />
          {touched.email && !emailOk && (
            <p className="text-red-500 text-xs mt-1.5">Adresse email invalide</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="text-sm font-medium text-stone-700 block mb-1.5">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            id="telephone"
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            enterKeyHint="done"
            value={state.telephone}
            onChange={e => onUpdate({ telephone: formatTelephone(e.target.value) })}
            onBlur={() => setTouched(t => ({ ...t, telephone: true }))}
            placeholder="06 12 34 56 78"
            className={inputClass(touched.telephone && !telOk)}
          />
          {touched.telephone && !telOk && (
            <p className="text-red-500 text-xs mt-1.5">Numéro français invalide (10 chiffres)</p>
          )}
        </div>

        {/* Mention RGPD discrète */}
        <p className="text-xs text-stone-400 leading-relaxed">
          En validant, vous acceptez d&apos;être recontacté par Hanami. Vos coordonnées ne sont
          jamais partagées avec des tiers.
        </p>

        <StepNav
          onBack={onBack}
          onNext={onNext}
          canProceed={isValid}
          nextLabel="Voir mon estimation"
          loading={loading}
        />
      </form>
    </div>
  )
}

function inputClass(hasError: boolean): string {
  const base = 'w-full px-4 py-3 rounded-md border bg-white text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-hanami-500/40 transition-shadow'
  return `${base} ${hasError ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-hanami-500'}`
}

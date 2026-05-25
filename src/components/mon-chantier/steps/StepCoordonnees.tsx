/**
 * StepCoordonnees.tsx — Étape 6 : coordonnées du visiteur
 *
 * Trois champs : prénom, email, téléphone (international avec sélecteur pays).
 * Le bouton final déclenche l'envoi à /api/chantier (parent gère).
 *
 * Téléphone international :
 * - Sélecteur pays avec drapeau + indicatif (par défaut +33 FR)
 * - Saisie locale formatée (paires pour FR, triplets sinon)
 * - Validation souple : 6-15 chiffres → couvre tous les formats
 * - Stockage final : "+33 6 12 34 56 78" (indicatif inclus pour WhatsApp)
 *
 * UX autocomplete navigateur :
 * - Wrapper <form> + name explicites améliorent la détection Chrome/Safari
 * - autoComplete="given-name" / "email" / "tel-national" → autofill profil OS
 * - enterKeyHint guide le clavier mobile (Next/Done)
 */

'use client'

import { useEffect, useState } from 'react'
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

/**
 * Liste des indicatifs pays supportés. Ordre : FR + voisins francophones
 * + pays anglo-saxons + grands pays européens.
 * `id` est unique (les indicatifs +1 sont partagés Canada/USA, on les dédoublonne via l'id). */
const COUNTRIES = [
  { id: 'fr', code: '+33',  flag: '🇫🇷', label: 'France',         maxDigits: 9 },
  { id: 'be', code: '+32',  flag: '🇧🇪', label: 'Belgique',       maxDigits: 9 },
  { id: 'ch', code: '+41',  flag: '🇨🇭', label: 'Suisse',         maxDigits: 9 },
  { id: 'lu', code: '+352', flag: '🇱🇺', label: 'Luxembourg',     maxDigits: 9 },
  { id: 'mc', code: '+377', flag: '🇲🇨', label: 'Monaco',         maxDigits: 8 },
  { id: 'gb', code: '+44',  flag: '🇬🇧', label: 'Royaume-Uni',    maxDigits: 11 },
  { id: 'us', code: '+1',   flag: '🇺🇸', label: 'États-Unis',     maxDigits: 10 },
  { id: 'ca', code: '+1',   flag: '🇨🇦', label: 'Canada',         maxDigits: 10 },
  { id: 'de', code: '+49',  flag: '🇩🇪', label: 'Allemagne',      maxDigits: 12 },
  { id: 'es', code: '+34',  flag: '🇪🇸', label: 'Espagne',        maxDigits: 9 },
  { id: 'it', code: '+39',  flag: '🇮🇹', label: 'Italie',         maxDigits: 11 },
  { id: 'pt', code: '+351', flag: '🇵🇹', label: 'Portugal',       maxDigits: 9 },
  { id: 'nl', code: '+31',  flag: '🇳🇱', label: 'Pays-Bas',       maxDigits: 9 },
  { id: 'ie', code: '+353', flag: '🇮🇪', label: 'Irlande',        maxDigits: 11 },
  { id: 'au', code: '+61',  flag: '🇦🇺', label: 'Australie',      maxDigits: 11 },
] as const

type CountryId = typeof COUNTRIES[number]['id']

/** Formate les chiffres selon le pays.
 *  France (+33) : XX XX XX XX XX (paires) — convention française
 *  Autres       : XXX XXX XXX… (triplets) — convention internationale */
function formatLocal(raw: string, code: string, maxDigits: number): string {
  const digits = raw.replace(/\D/g, '').slice(0, maxDigits)
  if (code === '+33') {
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

/** Extrait l'indicatif et le numéro local depuis la valeur stockée
 *  (ex: "+33 6 12 34 56 78" → { code: '+33', local: '6 12 34 56 78' }) */
function parseStored(stored: string): { code: string; local: string } {
  const m = stored.match(/^(\+\d{1,3})\s*(.*)$/)
  if (m) return { code: m[1], local: m[2] }
  return { code: '+33', local: stored }
}

export default function StepCoordonnees({ state, onUpdate, onNext, onBack, loading }: Props) {
  const [touched, setTouched] = useState({ prenom: false, email: false, telephone: false })

  // État local du sélecteur pays — distinct du state.telephone qui stocke le
  // tout (indicatif + numéro). On synchronise les 2 via setTel().
  const initial = parseStored(state.telephone)
  const initialCountry = COUNTRIES.find(c => c.code === initial.code) ?? COUNTRIES[0]
  const [countryId, setCountryId] = useState<CountryId>(initialCountry.id)
  const [local, setLocal] = useState(initial.local)

  const country = COUNTRIES.find(c => c.id === countryId)!

  // Validations
  const prenomOk = state.prenom.trim().length >= 2
  const emailOk = EMAIL_REGEX.test(state.email.trim())
  // Validation souple : 6 à 15 chiffres dans la partie locale.
  // Couvre tous les formats internationaux sans bloquer un numéro valide.
  const localDigits = local.replace(/\D/g, '')
  const telOk = localDigits.length >= 6 && localDigits.length <= 15
  const isValid = prenomOk && emailOk && telOk

  /** Sync : à chaque changement de pays OU de numéro local, on met à jour
   *  state.telephone avec le format "indicatif + numéro". */
  function setTel(newCode: string, newLocal: string) {
    const cleaned = newLocal.trim()
    onUpdate({ telephone: cleaned ? `${newCode} ${cleaned}` : '' })
  }

  function handleCountryChange(id: CountryId) {
    setCountryId(id)
    const c = COUNTRIES.find(x => x.id === id)!
    // Reformate le numéro existant selon le nouveau pays
    const reformatted = formatLocal(local, c.code, c.maxDigits)
    setLocal(reformatted)
    setTel(c.code, reformatted)
  }

  function handleLocalChange(raw: string) {
    const formatted = formatLocal(raw, country.code, country.maxDigits)
    setLocal(formatted)
    setTel(country.code, formatted)
  }

  // Si le parent reset le tel (ex: bouton Nouveau calcul), on reset l'UI locale
  useEffect(() => {
    if (!state.telephone) {
      setLocal('')
      setCountryId('fr')
    }
  }, [state.telephone])

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
        Sami vous recontacte sous 24 h pour valider le devis (WhatsApp ou téléphone).
      </p>

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

        {/* Téléphone — sélecteur pays + numéro local */}
        <div>
          <label htmlFor="telephone" className="text-sm font-medium text-stone-700 block mb-1.5">
            Téléphone <span className="text-red-500">*</span>
            <span className="ml-1.5 text-stone-400 font-normal">(international accepté)</span>
          </label>
          <div className={`flex rounded-md border overflow-hidden bg-white focus-within:ring-2 focus-within:ring-hanami-500/40 transition-shadow ${
            touched.telephone && !telOk ? 'border-red-300' : 'border-stone-200'
          }`}>
            {/* Sélecteur indicatif pays */}
            <select
              value={countryId}
              onChange={e => handleCountryChange(e.target.value as CountryId)}
              aria-label="Indicatif pays"
              className="shrink-0 bg-stone-50 border-r border-stone-200 text-sm text-stone-700 px-3 py-3 focus:outline-none cursor-pointer hover:bg-stone-100 transition-colors"
            >
              {COUNTRIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.flag}  {c.code}
                </option>
              ))}
            </select>

            {/* Numéro local */}
            <input
              id="telephone"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              enterKeyHint="done"
              value={local}
              onChange={e => handleLocalChange(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, telephone: true }))}
              placeholder={country.code === '+33' ? '6 12 34 56 78' : 'Numéro de téléphone'}
              className="flex-1 px-4 py-3 text-base text-stone-800 bg-white focus:outline-none"
            />
          </div>
          {touched.telephone && !telOk && (
            <p className="text-red-500 text-xs mt-1.5">
              Numéro invalide ({localDigits.length} chiffre{localDigits.length > 1 ? 's' : ''} — 6 à 15 attendus)
            </p>
          )}
          {telOk && (
            <p className="text-xs text-stone-400 mt-1.5">
              Sera enregistré : <span className="font-[family-name:var(--font-space-mono)] text-stone-600">{country.code} {local}</span>
            </p>
          )}
        </div>

        {/* Mention RGPD discrète */}
        <p className="text-xs text-stone-400 leading-relaxed">
          En validant, vous acceptez d&apos;être recontacté par Hanami (WhatsApp,
          téléphone ou email). Vos coordonnées ne sont jamais partagées avec des tiers.
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

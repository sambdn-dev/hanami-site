/**
 * EmailGateDialog.tsx — Capture email qui débloque le Visualiseur
 *
 * S'ouvre quand l'utilisateur veut aller plus loin (régénérer, télécharger)
 * après la 1ʳᵉ génération offerte. Poste sur /api/visualiser-lead (avec les
 * visuels avant/après) puis débloque via onSuccess.
 *
 * Modale maison (overlay fixe) — léger, sans dépendance, focus-piégé simple.
 */

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Season } from '@/lib/visualiseur/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type GateReason = 'regenerate' | 'download'

interface Props {
  reason: GateReason
  beforeImage: string | null
  afterImage: string | null
  season: Season
  onClose: () => void
  onSuccess: (email: string) => void
}

export default function EmailGateDialog({
  reason,
  beforeImage,
  afterImage,
  season,
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const title =
    reason === 'download'
      ? 'Recevez votre visuel'
      : 'Débloquez les transformations illimitées'
  const subtitle =
    reason === 'download'
      ? 'Entrez votre email pour télécharger votre gazon de rêve en haute définition.'
      : 'Entrez votre email pour régénérer autant que vous voulez et tester les autres saisons.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError('Adresse email invalide')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/visualiser-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          beforeImage,
          afterImage,
          season,
          company,
        }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      onSuccess(trimmed)
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
          1ʳᵉ transformation offerte
        </span>
        <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-hanami-900 mt-2 leading-snug">
          {title}
        </h3>
        <p className="text-stone-500 text-sm mt-2 leading-relaxed">{subtitle}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          {/* Honeypot anti-bot — masqué, ne pas remplir */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] w-px h-px opacity-0"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            aria-label="Votre adresse email"
            required
            autoFocus
            className="w-full text-sm px-4 py-3 rounded-lg bg-white text-stone-800 placeholder:text-stone-400 border border-stone-200 outline-none focus:border-hanami-500 transition-colors"
          />

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? 'Un instant…' : 'Continuer'}
          </button>

          <p className="mt-3 text-[11px] text-stone-400 text-center">
            Pas de spam. Un conseil gazon de temps en temps, c&apos;est tout.
          </p>
        </form>
      </div>
    </div>
  )
}

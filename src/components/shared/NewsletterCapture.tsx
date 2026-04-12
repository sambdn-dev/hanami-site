'use client'

import { useState } from 'react'

const STORAGE_KEY = 'hanami-newsletter-email'

interface NewsletterCaptureProps {
  /** Contexte d'affichage pour adapter le style */
  variant?: 'calculator' | 'footer' | 'section'
}

export default function NewsletterCapture({ variant = 'section' }: NewsletterCaptureProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Adresse email invalide')
      return
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      localStorage.setItem(STORAGE_KEY, trimmed)
      setSubmitted(true)
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    }
  }

  if (submitted) {
    return (
      <div className={variant === 'footer' ? 'text-stone-300' : 'text-stone-700'}>
        <p className="text-sm font-medium">
          ✓ Inscription confirmée !
        </p>
        <p className="text-xs mt-1 opacity-70">
          Vous recevrez nos prochains conseils saisonniers.
        </p>
      </div>
    )
  }

  const isFooter = variant === 'footer'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className={[
            'flex-1 min-w-0 text-sm px-3 py-2 rounded-lg outline-none',
            'transition-colors',
            isFooter
              ? 'bg-stone-700 text-white placeholder:text-stone-500 border border-stone-600 focus:border-[#4a8c3f]'
              : 'bg-white text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:border-[#4a8c3f]',
          ].join(' ')}
          aria-label="Votre adresse email"
          required
        />
        <button
          type="submit"
          className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg bg-[#4a8c3f] hover:bg-[#3a7030] text-white transition-colors cursor-pointer"
        >
          Je m&apos;inscris
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </form>
  )
}

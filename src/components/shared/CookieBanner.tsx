'use client'

import { useEffect, useState } from 'react'

interface CookiePrefs {
  functional: true
  analytics: boolean
  marketing: boolean
}

type BannerState = 'hidden' | 'banner' | 'preferences'

const STORAGE_KEY = 'hanami-cookies-prefs'

export default function CookieBanner() {
  const [state, setState] = useState<BannerState>('hidden')
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setState('banner')
    }
  }, [])

  const save = (prefs: CookiePrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    setState('hidden')
  }

  const acceptAll = () => save({ functional: true, analytics: true, marketing: true })
  const declineAll = () => save({ functional: true, analytics: false, marketing: false })
  const savePrefs = () => save({ functional: true, analytics, marketing })

  if (state === 'hidden') return null

  return (
    <>
      {/* Backdrop pour le panel préférences sur mobile */}
      {state === 'preferences' && (
        <div
          className="fixed inset-0 bg-black/40 z-[99] md:hidden"
          onClick={() => setState('banner')}
          aria-hidden="true"
        />
      )}

      <div
        className={[
          'fixed z-[100] transition-all duration-300',
          // Mobile : pleine largeur en bas
          'bottom-0 left-0 right-0',
          // Desktop : petite card en bas à gauche
          'md:bottom-6 md:left-6 md:right-auto md:max-w-sm md:rounded-2xl',
          'bg-[#1a2e1a] text-white shadow-2xl',
          state === 'preferences' ? 'md:rounded-2xl' : 'rounded-t-2xl md:rounded-2xl',
        ].join(' ')}
        role="dialog"
        aria-label="Gestion des cookies"
        aria-modal="true"
      >
        {/* ── État 1 : Banner ──────────────────────────────────────── */}
        {state === 'banner' && (
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              {/* Icône cookie SVG (sans dépendance Lucide) */}
              <span className="text-2xl flex-shrink-0" aria-hidden="true">🍪</span>
              <div>
                <p className="font-semibold text-sm leading-snug mb-1">
                  Nous respectons votre vie privée
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Ce site utilise des cookies pour améliorer votre expérience et mesurer notre audience de manière anonyme.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={acceptAll}
                className="w-full py-2 px-4 rounded-full bg-[#4a8c3f] hover:bg-[#3a7030] text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Tout accepter
              </button>
              <button
                onClick={declineAll}
                className="w-full py-2 px-4 rounded-full bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm font-medium transition-colors cursor-pointer"
              >
                Refuser
              </button>
              <button
                onClick={() => setState('preferences')}
                className="w-full py-1.5 text-xs text-stone-400 hover:text-stone-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Gérer les préférences
              </button>
            </div>
          </div>
        )}

        {/* ── État 2 : Panel préférences ───────────────────────────── */}
        {state === 'preferences' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm">Mes préférences</p>
              <button
                onClick={() => setState('banner')}
                className="text-stone-400 hover:text-white transition-colors text-xs underline cursor-pointer"
                aria-label="Retour"
              >
                ← Retour
              </button>
            </div>

            <div className="space-y-4">
              {/* Toggle Fonctionnels — toujours ON */}
              <ToggleRow
                label="Fonctionnels"
                description="Nécessaires au fonctionnement du site"
                checked={true}
                disabled={true}
                onChange={() => {}}
              />

              {/* Toggle Analytiques */}
              <ToggleRow
                label="Analytiques"
                description="Statistiques de visite anonymes (pas de tracking publicitaire)"
                checked={analytics}
                disabled={false}
                onChange={setAnalytics}
              />

              {/* Toggle Marketing */}
              <ToggleRow
                label="Marketing"
                description="Personnalisation et réseaux sociaux"
                checked={marketing}
                disabled={false}
                onChange={setMarketing}
              />
            </div>

            <button
              onClick={savePrefs}
              className="mt-5 w-full py-2 px-4 rounded-full bg-[#4a8c3f] hover:bg-[#3a7030] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Sauvegarder mes préférences
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Sous-composant Toggle ──────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className={`text-xs font-medium ${disabled ? 'text-stone-400' : 'text-white'}`}>
          {label}
          {disabled && <span className="ml-2 text-[10px] text-stone-500">(obligatoire)</span>}
        </p>
        <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">{description}</p>
      </div>

      {/* Switch */}
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          'relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200',
          disabled
            ? 'bg-stone-600 cursor-not-allowed'
            : checked
              ? 'bg-[#4a8c3f] cursor-pointer'
              : 'bg-stone-600 cursor-pointer',
        ].join(' ')}
        aria-label={label}
      >
        <span
          className={[
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

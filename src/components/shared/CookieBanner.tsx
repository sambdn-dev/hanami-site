'use client'

import { useEffect, useState } from 'react'
import { Sprout } from 'lucide-react'

/**
 * CookieBanner — Note de transparence sur la mesure d'audience (modèle opt-out)
 *
 * Le site ne dépose AUCUN cookie de mesure : Vercel Web Analytics est
 * cookieless (pas d'identifiant persistant, pas de suivi inter-sites, pas de
 * publicité, pas de revente). Ce bandeau n'est donc plus une barrière de
 * consentement — la mesure tourne par défaut (cf. src/lib/analytics.ts) — mais
 * une information affichée une seule fois, avec un refus possible en un clic.
 *
 * Pourquoi ce changement : en opt-in strict, tout visiteur qui ignorait le
 * bandeau (la grande majorité) était invisible dans les statistiques. Le site
 * ne mesurait donc qu'une petite fraction de son trafic réel.
 *
 * Rétro-compatibilité : le format stocké garde la clé `analytics`, donc un
 * ancien refus (`analytics: false`) continue d'être respecté. L'ancien réglage
 * "marketing" est retiré — aucun script marketing n'existe sur le site, la
 * case ne pilotait rien.
 */

interface CookiePrefs {
  functional: true
  analytics: boolean
}

const STORAGE_KEY = 'hanami-cookies-prefs'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage inaccessible (mode privé strict) : on n'affiche rien
      // plutôt que de ré-afficher le bandeau à chaque navigation.
    }
  }, [])

  const save = (analytics: boolean) => {
    const prefs: CookiePrefs = { functional: true, analytics }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // Pas de stockage possible — on ferme quand même le bandeau.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={[
        'no-print fixed z-[100] transition-all duration-300',
        // Mobile : pleine largeur en bas
        'bottom-0 left-0 right-0 rounded-t-2xl',
        // Desktop : carte discrète en bas à gauche
        'md:bottom-6 md:left-6 md:right-auto md:max-w-xs md:rounded-2xl',
        'bg-[#1a2e1a] text-white shadow-2xl',
      ].join(' ')}
      /* role="region" (pas "dialog") : rien n'est bloqué, la page reste
         entièrement utilisable derrière — pas de piège de focus */
      role="region"
      aria-label="Mesure d'audience"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Sprout className="w-4 h-4 text-[#4a8c3f]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-snug">
              Mesure d&apos;audience anonyme
            </p>
            <p className="text-xs text-stone-300 leading-relaxed mt-1">
              Pour savoir quelles pages vous sont utiles — sans cookie, sans
              publicité, sans revente de données.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => save(true)}
            className="flex-1 py-2 px-4 rounded-full bg-[#4a8c3f] hover:bg-[#3a7030] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            J&apos;ai compris
          </button>
          <button
            onClick={() => save(false)}
            className="py-2 px-3 rounded-full text-stone-300 hover:text-white text-xs font-medium underline underline-offset-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}

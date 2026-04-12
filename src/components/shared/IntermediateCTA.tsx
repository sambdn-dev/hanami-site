/**
 * IntermediateCTA.tsx — Bloc d'appel à l'action intermédiaire (réutilisable)
 *
 * Ce composant s'insère entre les sections pour relancer l'attention du visiteur
 * sans être une répétition du Hero. Design léger : une phrase d'accroche,
 * un bouton vert et un lien WhatsApp secondaire.
 *
 * Props :
 * - message : la phrase d'accroche affichée (ex: "Prêt à changer de méthode ?")
 * - variant : 'light' (fond blanc, texte sombre) ou 'dark' (fond vert foncé)
 *   Par défaut : 'light'
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import CalendlyButton from './CalendlyButton'

interface IntermediateCTAProps {
  message: string
  variant?: 'light' | 'dark'
  ctaLabel?: string
  /** Si true, le CTA principal ouvre un popup Calendly au lieu de scroller
   *  vers le formulaire. Utilisé sur la page /pro où la prise de RDV
   *  directe convertit mieux qu'un formulaire. */
  useCalendly?: boolean
  /** Source UTM pour tracker la provenance dans Calendly analytics. */
  utmSource?: string
}

export default function IntermediateCTA({
  message,
  variant = 'light',
  ctaLabel = 'Diagnostic gratuit',
  useCalendly = false,
  utmSource,
}: IntermediateCTAProps) {
  const fadeRef = useFadeIn()

  // Scroll fluide vers le formulaire de contact
  function scrollToContact(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Classes selon la variante choisie (fond clair ou foncé)
  const sectionBg = variant === 'dark' ? 'bg-hanami-900' : 'bg-amber-100/40'
  const textColor  = variant === 'dark' ? 'text-white' : 'text-stone-800'
  const btnBorder  = variant === 'dark'
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-stone-300 text-stone-700 hover:border-hanami-500 hover:text-hanami-700'

  const primaryBtnClass = 'inline-flex items-center px-5 py-2.5 rounded-md bg-hanami-700 text-white text-sm font-medium hover:bg-hanami-900 transition-colors cursor-pointer whitespace-nowrap'

  return (
    <div className={`${sectionBg} py-10`}>
      <div ref={fadeRef} className="fade-in max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Phrase d'accroche */}
          <p className={`font-[family-name:var(--font-fraunces)] text-xl lg:text-2xl font-semibold ${textColor} text-center sm:text-left`}>
            {message}
          </p>

          {/* Boutons côte à côte */}
          <div className="flex items-center gap-3 shrink-0">
            {useCalendly ? (
              <CalendlyButton utmSource={utmSource} className={primaryBtnClass}>
                {ctaLabel}
              </CalendlyButton>
            ) : (
              <button onClick={scrollToContact} className={primaryBtnClass}>
                {ctaLabel}
              </button>
            )}

            {/* Lien secondaire — WhatsApp pour particuliers, "Écrire" pour pros */}
            {useCalendly ? (
              <button
                onClick={scrollToContact}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${btnBorder}`}
              >
                Écrire
              </button>
            ) : (
              <a
                href="https://wa.me/33667277614"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border text-sm font-medium transition-colors whitespace-nowrap ${btnBorder}`}
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

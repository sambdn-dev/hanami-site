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

import Link from 'next/link'
import { useFadeIn } from '@/hooks/useFadeIn'
import CalendlyButton from './CalendlyButton'

interface IntermediateCTAProps {
  message: string
  variant?: 'light' | 'dark'
  ctaLabel?: string
  /** Si true, le CTA principal ouvre un popup Calendly au lieu de naviguer
   *  vers le wizard. Utilisé sur la page /pro où la prise de RDV
   *  directe convertit mieux qu'un formulaire. */
  useCalendly?: boolean
  /** URL cible du CTA principal. Défaut : '/mon-chantier' (wizard estimation).
   *  Mettre '#contact' pour scroller vers le formulaire en bas de page. */
  href?: string
  /** Source UTM pour tracker la provenance dans Calendly analytics. */
  utmSource?: string
}

export default function IntermediateCTA({
  message,
  variant = 'light',
  ctaLabel = 'Faire ma simulation gratuite',
  useCalendly = false,
  href = '/mon-chantier',
  utmSource,
}: IntermediateCTAProps) {
  const fadeRef = useFadeIn()

  // Scroll fluide vers le formulaire de contact (utilisé pour les ancres #contact)
  function scrollToContact(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith('#')) return
    e.preventDefault()
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
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
              <Link href={href} onClick={scrollToContact} className={primaryBtnClass}>
                {ctaLabel}
              </Link>
            )}

            {/* Lien secondaire — WhatsApp pour particuliers, "Écrire" pour pros */}
            {useCalendly ? (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${btnBorder}`}
              >
                Écrire
              </a>
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

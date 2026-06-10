/**
 * MobileStickyCTA.tsx — Barre CTA fixe en bas d'écran (mobile uniquement)
 *
 * Visible sur mobile (< md) après 400 px de scroll.
 * Cible par défaut : /coaching (l'offre scalable nationale) ; la page pro
 * la reconfigure vers le wizard via les props.
 *
 * Se masque automatiquement quand le formulaire #contact est visible
 * dans le viewport (le visiteur est déjà arrivé au fallback).
 */

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { track } from '@/lib/analytics'

interface MobileStickyCTAProps {
  href?: string
  label?: string
  reassurance?: string
}

export default function MobileStickyCTA({
  href = '/coaching',
  label = 'Découvrir le coaching →',
  reassurance = '1ᵉʳ mois offert · Puis 29 €/mois · Sans engagement',
}: MobileStickyCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function checkVisibility() {
      const scrollY = window.scrollY
      const contactSection = document.getElementById('contact')

      let contactIsVisible = false
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        contactIsVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
      }

      setVisible(scrollY > 400 && !contactIsVisible)
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    checkVisibility()
    return () => window.removeEventListener('scroll', checkVisibility)
  }, [])

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        md:hidden
        bg-white border-t border-stone-200
        px-4 py-3
        transition-transform duration-300
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      aria-hidden={!visible}
    >
      {/* Réassurance compacte au-dessus du bouton */}
      <p className="font-[family-name:var(--font-space-mono)] text-[10px] text-stone-400 uppercase tracking-wider text-center mb-1.5">
        {reassurance}
      </p>
      <Link
        href={href}
        onClick={() => track('cta_click', { location: 'sticky_mobile', page: window.location.pathname })}
        className="block w-full py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors text-center"
      >
        {label}
      </Link>
    </div>
  )
}

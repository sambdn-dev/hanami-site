/**
 * HomeMobileCTA.tsx — Barre CTA fixe en bas d'écran (mobile uniquement)
 *
 * Visible sur mobile (< md) après 400 px de scroll.
 * Réservée à la page particuliers. Pro et Studio conservent MobileStickyCTA.
 *
 * Se masque automatiquement quand le formulaire #contact est visible
 * dans le viewport ou pendant la saisie d'un champ.
 */

'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { track } from '@/lib/analytics'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import styles from './HomeMobileCTA.module.css'

interface HomeMobileCTAProps {
  href?: string
  label?: string
  reassurance?: string
}

export default function HomeMobileCTA({
  href = '/coaching',
  label = 'Découvrir le coaching',
  reassurance = `1ᵉʳ mois offert · Puis ${PRICING_DISPLAY.coachingMois} €/mois · Sans engagement`,
}: HomeMobileCTAProps) {
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function checkVisibility() {
      const scrollY = window.scrollY
      const contactSection = document.getElementById('contact')

      let contactIsVisible = false
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        contactIsVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
      }

      const editing = document.activeElement?.matches('input, select, textarea, [contenteditable="true"]')
      setVisible(scrollY > 400 && !contactIsVisible && !editing)
    }

    // La hauteur varie selon la réassurance, la largeur et la zone sûre iOS.
    // Elle sert aussi à placer WhatsApp et à garder le bas de page accessible.
    const bar = barRef.current
    const measureBar = () => {
      if (bar) document.body.style.setProperty('--mobile-cta-height', `${bar.getBoundingClientRect().height}px`)
    }
    const resizeObserver = new ResizeObserver(measureBar)
    if (bar) resizeObserver.observe(bar, { box: 'border-box' })
    measureBar()

    const contact = document.getElementById('contact')
    const contactObserver = new IntersectionObserver(checkVisibility, { rootMargin: '0px 0px -25% 0px' })
    if (contact) contactObserver.observe(contact)

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)
    document.addEventListener('focusin', checkVisibility)
    document.addEventListener('focusout', checkVisibility)
    checkVisibility()
    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      document.removeEventListener('focusin', checkVisibility)
      document.removeEventListener('focusout', checkVisibility)
      resizeObserver.disconnect()
      contactObserver.disconnect()
      document.body.style.removeProperty('--mobile-cta-height')
    }
  }, [])

  return (
    <>
      <div
        ref={barRef}
        className={`mobile-sticky-cta home-mobile-cta ${styles.bar} ${visible ? styles.visible : ''}`}
        /* Retire aussi le lien du parcours clavier lorsque la barre est masquée. */
        inert={!visible}
        /* Lu par globals.css pour remonter le bouton WhatsApp flottant. */
        data-visible={visible}
      >
        {reassurance && <p className={styles.reassurance}>{reassurance}</p>}
        <Link
          href={href}
          onClick={() => track('cta_click', { location: 'sticky_mobile', page: window.location.pathname })}
          className={styles.button}
        >
          {label}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.spacer} aria-hidden="true" />
    </>
  )
}

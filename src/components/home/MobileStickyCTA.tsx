/**
 * MobileStickyCTA.tsx — Barre CTA fixe en bas d'écran (mobile uniquement)
 *
 * Ce composant est uniquement visible sur mobile (écrans < 768px).
 * Il apparaît après que l'utilisateur a scrollé de 400px vers le bas.
 * Il disparaît automatiquement quand le formulaire de contact est visible à l'écran.
 *
 * Cela évite de bloquer le formulaire avec la barre quand l'utilisateur
 * est prêt à le remplir.
 */

'use client'

import { useEffect, useState } from 'react'

export default function MobileStickyCTA() {
  // true = la barre doit être affichée
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function checkVisibility() {
      const scrollY = window.scrollY

      // Récupère l'élément formulaire (ancre #contact)
      const contactSection = document.getElementById('contact')

      // Vérifie si le formulaire est actuellement visible dans le viewport
      let contactIsVisible = false
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        // Le formulaire est considéré visible s'il est dans les 2/3 supérieurs de l'écran
        contactIsVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
      }

      // Afficher la barre uniquement si :
      // 1. L'utilisateur a scrollé plus de 400px
      // 2. ET le formulaire n'est pas encore visible
      setVisible(scrollY > 400 && !contactIsVisible)
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    checkVisibility() // Vérifier immédiatement au montage

    return () => window.removeEventListener('scroll', checkVisibility)
  }, [])

  // Scroll fluide vers le formulaire de contact
  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Ne pas rendre quoi que ce soit si invisible (et jamais sur desktop via CSS)
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
      <button
        onClick={scrollToContact}
        className="w-full py-3 rounded-md bg-hanami-700 text-white font-medium text-sm hover:bg-hanami-900 transition-colors cursor-pointer"
      >
        Diagnostic gratuit →
      </button>
    </div>
  )
}

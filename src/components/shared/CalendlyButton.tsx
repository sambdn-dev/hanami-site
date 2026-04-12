/**
 * CalendlyButton.tsx — Bouton qui ouvre un modal Calendly en popup
 *
 * Wrappe react-calendly PopupModal pour permettre à n'importe quel bouton
 * stylé Hanami d'ouvrir le calendrier de réservation sans quitter le site.
 *
 * Utilisation :
 *   <CalendlyButton className="bg-hanami-700 text-white px-6 py-3 rounded-md">
 *     Réserver un appel (30 min)
 *   </CalendlyButton>
 *
 * Le modal se portale dans <body> ; le rootElement n'est défini qu'après
 * montage pour éviter le crash SSR (document inexistant côté serveur).
 */

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { PopupModal } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/samibouden/30min'

interface CalendlyButtonProps {
  children: ReactNode
  className?: string
  /** Permet de retrouver les leads Calendly dans analytics plus tard */
  utmSource?: string
}

export default function CalendlyButton({
  children,
  className,
  utmSource = 'hanami-site',
}: CalendlyButtonProps) {
  const [open, setOpen] = useState(false)
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null)

  // PopupModal a besoin d'un rootElement HTML ; on l'initialise côté client
  // uniquement pour éviter l'erreur SSR "document is not defined".
  useEffect(() => {
    setRootEl(document.body)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      {rootEl && (
        <PopupModal
          url={CALENDLY_URL}
          open={open}
          onModalClose={() => setOpen(false)}
          rootElement={rootEl}
          utm={{ utmSource }}
          /* Harmonise les couleurs du widget avec la charte Hanami */
          pageSettings={{
            backgroundColor: 'fafaf9',
            primaryColor: '2d5a27',
            textColor: '292524',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }}
        />
      )}
    </>
  )
}

'use client'

import { ArrowUpRight } from 'lucide-react'
import { track } from '@/lib/analytics'

export default function IrrigationQuoteButton({ className, children = 'Demander mon devis d’arrosage' }: { className?: string; children?: string }) {
  return (
    <a href="#contact" className={className} onClick={() => {
      window.dispatchEvent(new CustomEvent('hanami:local-service-select', { detail: 'Aiper IrriSense 2' }))
      track('cta_click', { location: 'irrigation_aiper', page: window.location.pathname })
    }}>
      {children}<ArrowUpRight size={18} aria-hidden="true" />
    </a>
  )
}

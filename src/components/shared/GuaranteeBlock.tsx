/**
 * GuaranteeBlock.tsx — Bloc de réassurance juste au-dessus du formulaire
 *
 * 3 éléments côte à côte (ou empilés sur mobile) pour rassurer le visiteur
 * avant qu'il remplisse le formulaire. Chaque élément a une icône SVG
 * et un texte court et factuel.
 *
 * Design : fond légèrement coloré (amber-100/40), sobre et discret.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import { ShieldCheck, RefreshCw, Clock } from 'lucide-react'

// Les 3 éléments de réassurance
const items = [
  {
    icon: ShieldCheck,
    text: 'Diagnostic initial offert',
  },
  {
    icon: RefreshCw,
    text: 'Protocole ajusté sans surcoût si besoin',
  },
  {
    icon: Clock,
    text: 'Réponse sous 24h',
  },
]

export default function GuaranteeBlock() {
  const ref = useFadeIn()

  return (
    <div className="bg-amber-100/50 border-y border-amber-200/60 py-5">
      <div
        ref={ref}
        className="fade-in max-w-3xl mx-auto px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              {/* Icône en vert */}
              <item.icon
                className="w-4 h-4 text-hanami-700 shrink-0"
                strokeWidth={1.75}
              />
              {/* Texte court */}
              <span className="text-stone-700 text-sm font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

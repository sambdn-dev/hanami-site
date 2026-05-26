/**
 * UsageSwitcher.tsx — Chip déroulant pour switcher d'usage produit
 *
 * Affiché en bas d'un champ dose après qu'un produit du catalogue ait été
 * sélectionné. Permet de basculer entre les différents cas d'usage du produit
 * (création / rénovation / entretien / etc.) — la dose s'adapte à chaque
 * changement.
 *
 * UX : petit chip discret type "Selon : Rénovation ▾". Clic ouvre une liste
 * compacte d'options avec leur dose. Discret par défaut pour ne pas alourdir
 * le formulaire, mais découvrable.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'

export interface UsageOption {
  /** Identifiant stable (slug) */
  id: string
  /** Libellé affiché (ex: "Rénovation après scarif") */
  label: string
  /** Texte court de la dose à afficher en valeur (ex: "25 g/m²" ou "50 L/ha") */
  doseDisplay: string
  /** Note contextuelle optionnelle (ex: "À appliquer post-scarif") */
  note?: string
}

interface UsageSwitcherProps {
  usages: UsageOption[]
  selectedId: string
  onChange: (newUsageId: string) => void
}

export default function UsageSwitcher({ usages, selectedId, onChange }: UsageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = usages.find(u => u.id === selectedId) ?? usages[0]

  // Click extérieur ferme
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (!selected) return null

  // Cas trivial : 1 seul usage → on affiche juste le label en lecture seule,
  // pas besoin de switcher.
  if (usages.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-1">
        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
        <span>Usage : <span className="text-stone-600 font-medium">{selected.label}</span></span>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative inline-block mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
          open
            ? 'bg-hanami-100 border-hanami-500 text-hanami-900'
            : 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-400'
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Sparkles className="w-3 h-3" />
        <span>Selon : {selected.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 bg-white rounded-md border border-stone-200 shadow-lg overflow-hidden z-30 min-w-[240px]"
        >
          {usages.map(u => (
            <li
              key={u.id}
              role="option"
              aria-selected={u.id === selectedId}
              onClick={() => { onChange(u.id); setOpen(false) }}
              className={`px-3 py-2 cursor-pointer flex items-start justify-between gap-3 border-b border-stone-50 last:border-b-0 ${
                u.id === selectedId ? 'bg-hanami-100/60' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-stone-800 leading-tight">{u.label}</p>
                {u.note && <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">{u.note}</p>}
              </div>
              <span className="text-[11px] font-medium text-hanami-700 font-[family-name:var(--font-space-mono)] shrink-0 self-center whitespace-nowrap">
                {u.doseDisplay}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

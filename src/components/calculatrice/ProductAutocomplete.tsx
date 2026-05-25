/**
 * ProductAutocomplete.tsx — Suggestion de produits depuis le catalogue Hanami
 *
 * Composant générique réutilisable pour les champs "Nom du produit" de la
 * calculatrice. Affiche un dropdown de produits du catalogue qui matchent
 * le texte saisi, avec leur dose recommandée en sous-titre.
 *
 * À la sélection, appelle onSelect avec le produit complet — le parent
 * extrait nom + dose et remplit ses propres états (le champ reste éditable
 * manuellement, autocomplete n'impose rien).
 *
 * Le saisie libre reste possible : si aucun produit du catalogue ne
 * correspond, l'utilisateur tape simplement son nom de produit comme avant.
 *
 * Clavier : ↑↓ navigation, Entrée sélection, Esc fermeture.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface ProductSuggestion {
  /** Identifiant unique pour key React */
  id: string
  /** Nom commercial du produit */
  name: string
  /** Marque */
  brand: string
  /** Sous-titre affiché dans la suggestion (ex: "Dès 25 g/m²") */
  hint: string
}

interface ProductAutocompleteProps<T extends ProductSuggestion> {
  /** Valeur courante du champ (contrôlé par le parent) */
  value: string
  /** Callback quand l'utilisateur tape */
  onChange: (value: string) => void
  /** Callback quand l'utilisateur sélectionne un produit du catalogue */
  onSelect: (product: T) => void
  /** Fonction de recherche fournie par le parent (filtrage local catalogue) */
  search: (query: string, limit?: number) => T[]
  /** Texte d'aide / placeholder */
  placeholder?: string
  /** Classes Tailwind du champ input */
  inputClass: string
  /** Nombre max de suggestions (défaut: 5) */
  limit?: number
}

export default function ProductAutocomplete<T extends ProductSuggestion>({
  value,
  onChange,
  onSelect,
  search,
  placeholder,
  inputClass,
  limit = 5,
}: ProductAutocompleteProps<T>) {
  const [suggestions, setSuggestions] = useState<T[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtre les suggestions à chaque changement de valeur — pas de debounce
  // nécessaire car la recherche est locale (catalogue en mémoire).
  useEffect(() => {
    const list = search(value, limit)
    setSuggestions(list)
    setHighlight(0)
  }, [value, search, limit])

  // Click extérieur → ferme le dropdown
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function pick(p: T) {
    onChange(p.name)
    onSelect(p)
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => (h - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && suggestions[highlight]) {
      e.preventDefault()
      pick(suggestions[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClass}
        autoComplete="off"
      />

      {/* Petit indicateur "catalogue Hanami disponible" — visible quand la
          recherche locale retourne des résultats mais que le dropdown est fermé */}
      {!open && suggestions.length > 0 && value.length > 0 && (
        <button
          type="button"
          onClick={() => { setOpen(true); inputRef.current?.focus() }}
          aria-label="Voir les suggestions catalogue"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-semibold flex items-center gap-1 hover:bg-amber-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          {suggestions.length}
        </button>
      )}

      {/* Dropdown de suggestions */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-md border border-stone-200 shadow-lg overflow-hidden z-30 max-h-80 overflow-y-auto"
        >
          {/* Petite header du catalogue */}
          <li className="px-3 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-700 font-[family-name:var(--font-space-mono)]">
              Catalogue Hanami · doses pré-calculées
            </span>
          </li>
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={highlight === i}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(s) }}
              className={`px-3 py-2 text-sm cursor-pointer flex items-start justify-between gap-3 border-b border-stone-50 last:border-b-0 ${
                highlight === i ? 'bg-hanami-100/60' : 'bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 truncate">{s.name}</p>
                <p className="text-[11px] text-stone-400 truncate">{s.brand}</p>
              </div>
              <span className="text-[11px] font-medium text-hanami-700 font-[family-name:var(--font-space-mono)] shrink-0 self-center whitespace-nowrap">
                {s.hint}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * AdresseAutocomplete.tsx — Champ ville avec suggestions BAN + géolocalisation
 *
 * Utilise l'API publique de la Base Adresse Nationale (api-adresse.data.gouv.fr) :
 * gratuit, sans clé API, sans tracking, couverture France 100 %.
 *
 *   /search?type=municipality : suggestions de COMMUNES uniquement (pas d'adresses
 *                               précises) pour limiter la friction RGPD à ce stade
 *                               du wizard. L'adresse complète sera demandée après
 *                               le RDV Calendly.
 *   /reverse                  : reverse-geocode après navigator.geolocation
 *
 * Une fois géolocalisé, on passe lat/lon dans /search pour biaiser le score
 * vers les communes proches → les villes près de l'utilisateur remontent en
 * premier, sans fuiter ses coordonnées à un tiers (Google/Mapbox).
 *
 * UX :
 * - Debounce 250 ms
 * - 5 suggestions max sous le champ
 * - Clavier ↑↓ Enter Esc
 * - Click extérieur ferme la liste
 * - Bouton "Me géolocaliser" : prefill la ville + active le biais proximité
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, X, Locate, Loader2 } from 'lucide-react'

interface BanFeature {
  properties: {
    label: string
    postcode: string
    city: string
    context: string
    score: number
    type: string
  }
  geometry: { coordinates: [number, number] }
}

interface BanResponse {
  features: BanFeature[]
}

export interface SelectedAdresse {
  /** Label complet, ex: "17 Avenue de la Prise d'Eau 78110 Le Vésinet" */
  label: string
  /** Code postal 5 chiffres */
  postcode: string
  /** Ville */
  city: string
}

interface AdresseAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (adresse: SelectedAdresse) => void
  /** True si l'adresse courante a un CP valide */
  isValid: boolean
  placeholder?: string
}

const DEBOUNCE_MS = 250
const BAN_SEARCH = 'https://api-adresse.data.gouv.fr/search/'
const BAN_REVERSE = 'https://api-adresse.data.gouv.fr/reverse/'

export default function AdresseAutocomplete({
  value,
  onChange,
  onSelect,
  isValid,
  placeholder = 'Le Vésinet, Versailles, Saint-Germain-en-Laye…',
}: AdresseAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<BanFeature[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [loading, setLoading] = useState(false)

  // Coords navigateur — null tant que non accordé. Une fois set, biaise toutes
  // les recherches futures vers les adresses proches.
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number | null>(null)
  const requestIdRef = useRef(0)

  // ── Fetch des suggestions (debounced + biaisé proximité si dispo) ──────────
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    const trimmed = value.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = window.setTimeout(async () => {
      const id = ++requestIdRef.current
      setLoading(true)
      try {
        const params = new URLSearchParams({
          q: trimmed,
          limit: '5',
          autocomplete: '1',
          // Limite aux communes — pas d'adresses précises au stade simulation
          type: 'municipality',
        })
        // Biais proximité si l'utilisateur a accordé sa géolocalisation
        if (userCoords) {
          params.set('lat', String(userCoords.lat))
          params.set('lon', String(userCoords.lon))
        }
        const res = await fetch(`${BAN_SEARCH}?${params}`)
        if (!res.ok) throw new Error(`BAN ${res.status}`)
        const json = await res.json() as BanResponse
        if (id !== requestIdRef.current) return
        setSuggestions(json.features ?? [])
        setOpen((json.features?.length ?? 0) > 0)
        setHighlight(0)
      } catch {
        if (id === requestIdRef.current) {
          setSuggestions([])
          setOpen(false)
        }
      } finally {
        if (id === requestIdRef.current) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [value, userCoords])

  // ── Click extérieur ferme la liste ─────────────────────────────────────────
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function pick(s: BanFeature) {
    const adr: SelectedAdresse = {
      label: s.properties.label,
      postcode: s.properties.postcode,
      city: s.properties.city,
    }
    onChange(adr.label)
    onSelect(adr)
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => (h - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(suggestions[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  /** Demande la géoloc navigateur, reverse-geocode en adresse, prefill le champ.
   *  En cas de refus / erreur, on affiche un message discret sans bloquer. */
  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoError('Géolocalisation non supportée par votre navigateur.')
      return
    }
    setGeoError(null)
    setGeoLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setUserCoords({ lat: latitude, lon: longitude })
        try {
          // /reverse retourne l'adresse la plus proche (housenumber, street, locality).
          // On ne passe PAS type=municipality car cet endpoint ne supporte pas ce
          // filtre en reverse — on extrait juste la ville (`city`) du résultat.
          const res = await fetch(`${BAN_REVERSE}?lon=${longitude}&lat=${latitude}`)
          const json = await res.json() as BanResponse
          const first = json.features?.[0]
          if (first?.properties?.city && first?.properties?.postcode) {
            const adr: SelectedAdresse = {
              // Affiche juste "Ville CP" (pas la rue) pour rester cohérent avec
              // la sélection commune-seule attendue côté UI.
              label: `${first.properties.city} ${first.properties.postcode}`,
              postcode: first.properties.postcode,
              city: first.properties.city,
            }
            onChange(adr.label)
            onSelect(adr)
          } else {
            setGeoError('Aucune ville trouvée à votre position.')
          }
        } catch {
          setGeoError('Échec de la recherche — réessayez.')
        } finally {
          setGeoLoading(false)
        }
      },
      (err) => {
        setGeoLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Géolocalisation refusée. Vous pouvez taper l\'adresse manuellement.')
        } else if (err.code === err.TIMEOUT) {
          setGeoError('Délai dépassé. Réessayez.')
        } else {
          setGeoError('Impossible d\'obtenir votre position.')
        }
      },
      { timeout: 8000, maximumAge: 60_000, enableHighAccuracy: false },
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Champ + bouton géolocaliser côte à côte */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            autoComplete="address-level2"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 py-3 rounded-md border bg-white text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-hanami-500/40 transition-shadow ${
              isValid ? 'border-hanami-500/40 focus:border-hanami-500' : 'border-stone-200 focus:border-hanami-500'
            }`}
            aria-autocomplete="list"
            aria-expanded={open}
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              aria-label="Effacer"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading}
          aria-label="Me géolocaliser"
          title="Me géolocaliser"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 rounded-md border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:border-hanami-500 hover:text-hanami-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {geoLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Locate className="w-4 h-4" />
          }
          <span className="hidden sm:inline">Me géolocaliser</span>
        </button>
      </div>

      {/* Indicateurs sous le champ */}
      {loading && (
        <p className="text-xs text-stone-400 mt-1.5 italic">Recherche d&apos;adresses…</p>
      )}
      {geoError && (
        <p className="text-xs text-amber-700 mt-1.5">{geoError}</p>
      )}
      {userCoords && !geoError && !geoLoading && (
        <p className="text-xs text-hanami-700 mt-1.5">
          📍 Position détectée — les adresses proches apparaîtront en premier.
        </p>
      )}

      {/* Liste de suggestions */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-md border border-stone-200 shadow-lg overflow-hidden z-20"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.properties.label}-${i}`}
              role="option"
              aria-selected={highlight === i}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(s) }}
              className={`px-4 py-2.5 text-sm cursor-pointer flex items-start gap-2.5 ${
                highlight === i ? 'bg-hanami-100/70' : 'bg-white hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-hanami-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 truncate">{s.properties.label}</p>
                <p className="text-xs text-stone-500 truncate">{s.properties.context}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

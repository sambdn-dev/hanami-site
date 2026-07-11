'use client'

/**
 * HanamiCalculator.tsx — Calculatrice de dosages Hanami v2
 *
 * © 2025 Hanami / TROTT SASU — Tous droits réservés.
 * Ce composant est la propriété exclusive de Hanami (TROTT SASU, SIREN 891 868 143).
 * Toute reproduction, copie ou utilisation sans autorisation écrite est interdite.
 *
 * Wizard compact 4 étapes : Surfaces → Type → Config → Résultats
 * Types : Semences (avec scénarios), Engrais, Liquide, Top dressing
 * Features : export PDF + PNG, mode Dev, disclaimer, newsletter inline
 */

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, AlertTriangle, Info, Calculator, Download, ChevronLeft, ImageDown, Camera, Loader2, Share2, Sprout, Sparkles, Droplets, Mountain, Package, Settings, Lightbulb, Mail, Check, Globe, FlaskConical, Timer, Play, X } from 'lucide-react'
import { compressPhoto } from '@/lib/photo-utils'
import { track } from '@/lib/analytics'
import { fmt, plural } from '@/lib/calculatrice/format'
import { downloadDosagePdf, type DosagePdfDoc, type PdfZone } from '@/lib/calculatrice/pdf-export'
import { CALC_PRESETS, type CalcPreset } from '@/lib/calculatrice/presets'
import { OTPInput } from '@/components/motion/otp-input'
import PhotoLightbox from '@/components/shared/PhotoLightbox'
import ProductAutocomplete from './ProductAutocomplete'
import UsageSwitcher from './UsageSwitcher'
import {
  searchSolidCatalog,
  searchLiquidCatalog,
  getDefaultSolidUsage,
  getDefaultLiquidUsage,
  SOLID_CATALOG,
  LIQUID_CATALOG,
  type SolidCatalogProduct,
  type LiquidCatalogProduct,
} from '@/lib/products-catalog'

// ── Types ────────────────────────────────────────────────────────────────────

/** Une zone de pelouse avec optionnellement une photo pour la différencier visuellement.
 *  La photo est compressée côté client (cf. lib/photo-utils.ts) avant d'arriver ici. */
type Zone = {
  name: string
  surface: string
  /** Photo optionnelle de la zone (data: URL JPEG compressée) */
  photo?: {
    dataUrl: string
    width: number
    height: number
  }
}
type ProductType = 'seeds' | 'fertilizer' | 'liquid' | 'topdressing' | ''
type StepKey = 'zones' | 'type' | 'seeds_scenario' | 'fertilizer_scenario' | 'dosage' | 'topdressing_config' | 'results'

/**
 * Un produit liquide dans le mélange. Peut y en avoir plusieurs (ex: H2Pro
 * Trismart + Vitalnova StressBuster appliqués ensemble dans le même
 * pulvérisateur). Chaque produit a sa propre dose, l'eau remplit le reste.
 */
type LiquidProduct = {
  id: string
  name: string
  /** Dose en mode simplifié, ml/L */
  doseSimple: string
  /** Dose en mode expert, L/ha */
  doseExpert: string
  /** Si vient du catalogue : id du produit + id de l'usage sélectionné.
   *  Sert à afficher le UsageSwitcher et à recalculer la dose à chaque switch. */
  catalogProductId?: string
  catalogUsageId?: string
}

/**
 * Un produit solide (semences ou engrais). Plusieurs produits peuvent être
 * calculés en parallèle pour la même surface — chacun aura sa propre quantité
 * affichée dans les résultats. Contrairement aux liquides, ils ne sont pas
 * mélangés mais appliqués séparément.
 */
type SolidProduct = {
  id: string
  name: string
  /** Dose */
  dose: string
  /** Unité — g/m² ou kg/ha (affichage) */
  doseUnit: 'g/m2' | 'kg/ha'
  /** Si vient du catalogue : référence produit + usage sélectionné */
  catalogProductId?: string
  catalogUsageId?: string
}

let _idCounter = 0
const makeUid = () => `${Date.now()}-${++_idCounter}-${Math.random().toString(36).slice(2, 6)}`

const makeProduct = (name = '', doseSimple = '10', doseExpert = '10'): LiquidProduct => ({
  id: makeUid(), name, doseSimple, doseExpert,
})

const makeSolidProduct = (name = '', dose = '20', doseUnit: 'g/m2' | 'kg/ha' = 'g/m2'): SolidProduct => ({
  id: makeUid(), name, dose, doseUnit,
})

const STEPS: Record<string, StepKey[]> = {
  '':            ['zones', 'type'],
  seeds:         ['zones', 'type', 'seeds_scenario', 'dosage', 'results'],
  fertilizer:    ['zones', 'type', 'fertilizer_scenario', 'dosage', 'results'],
  liquid:        ['zones', 'type', 'dosage', 'results'],
  topdressing:   ['zones', 'type', 'topdressing_config', 'results'],
}

// ── Fertilizer scenarios ──────────────────────────────────────────────────────

const FERT_SCENARIOS = [
  { id: 'monthly',   label: 'Mensuel (1×/mois)',     dosage: 12, range: '10–15 g/m²', desc: 'Protocole fractionné, absorption optimale' },
  { id: 'bimonthly', label: 'Tous les 2 mois',       dosage: 17, range: '15–20 g/m²', desc: 'Bon équilibre entretien / simplicité' },
  { id: 'quarterly', label: 'Trimestriel (3–4×/an)', dosage: 27, range: '25–30 g/m²', desc: 'Programme saisonnier classique' },
  { id: 'biannual',  label: '2 fois par an',          dosage: 37, range: '35–40 g/m²', desc: 'Application printemps + automne' },
]

// ── Seed scenarios ────────────────────────────────────────────────────────────

const SEED_OBJECTIVES = [
  { id: 'creation',     label: 'Création (sol nu)',    desc: 'Nouvelle pelouse de zéro',        dosage: 32, range: '30–35 g/m²' },
  { id: 'regarnissage', label: 'Regarnissage',          desc: 'Densifier un gazon existant',     dosage: 20, range: '15–25 g/m²' },
  { id: 'reparation',   label: 'Réparation de zones',  desc: 'Remplir des zones clairsemées',   dosage: 35, range: '30–40 g/m²' },
]

const LAWN_CONDITIONS = [
  { id: 'bare',   label: 'Terre visible',          dosage: 35, color: '#7c5c3a' },
  { id: 'patchy', label: 'Clairsemé & irrégulier', dosage: 25, color: '#d4a853' },
  { id: 'thin',   label: 'Gazon existant fin',     dosage: 15, color: '#4a8c3f' },
]

// ── Top dressing ──────────────────────────────────────────────────────────────

const TD_DEPTHS = [
  { id: '3', label: '3 mm', desc: 'Top dressing fin',        detail: 'Sable fin ou compost tamisé'  },
  { id: '5', label: '5 mm', desc: 'Correction planimétrie',  detail: 'Sable agronomique'             },
  { id: '8', label: '8 mm', desc: 'Rénovation lourde',       detail: 'Mélange sable + terreau'       },
]

const TD_MATERIALS = [
  { id: 'sand',    label: 'Sable agronomique', desc: 'Drainage, terrain de sport, gazon roulant'  },
  { id: 'compost', label: 'Compost tamisé',    desc: 'Nutrition + structure, gazon ornemental'    },
  { id: 'mix',     label: 'Mélange 50/50',     desc: 'Usage polyvalent — équilibre drainant/nutritif' },
]

// ── Result types ──────────────────────────────────────────────────────────────

/** Photo optionnelle d'une zone — copiée depuis les input zones pour
 *  réaffichage dans les résultats sans avoir à matcher les index. */
type ZonePhoto = { dataUrl: string; width: number; height: number } | undefined

type SolidResults = {
  type: 'solid'
  totalSurface: number
  /** Liste des produits avec leur quantité totale en kg */
  products: Array<{
    name: string
    dosePerM2: string
    totalKg: string
  }>
  zones: Array<{
    name: string
    surface: number
    photo?: ZonePhoto
    /** Quantité de chaque produit pour cette zone (kg) */
    productsQuantities: Array<{ name: string; quantity: string }>
  }>
  numberOfZones: number
}

/** Quantité d'un produit donné (total ou par plein), avec son unité */
type ProductQuantity = {
  /** Nom du produit (peut être vide → "Produit 1") */
  name: string
  /** Quantité totale TTC pour la surface */
  totalAmount: string | number
  totalUnit: string
  /** Quantité par plein du pulvérisateur */
  perFillAmount: string | number
  perFillUnit: string
}

type LiquidResults = {
  type: 'liquid'
  totalSurface: number
  totalSprayVolume: string
  /** Liste des produits dans le mélange — peut contenir 1 à N éléments */
  products: ProductQuantity[]
  numberOfFills: number
  zones: Array<{
    name: string
    surface: number
    photo?: ZonePhoto
    sprayVolume: string
    /** Pour chaque produit, la quantité dans cette zone */
    productsAmounts: Array<{ name: string; amount: string | number; unit: string }>
    waterAmount: string
    fills: string
  }>
  numberOfZones: number
}

type TopdressingResults = {
  type: 'topdressing'
  depth: number
  material: string
  totalSurface: number
  totalLitres: number
  bagSize: number
  bagsCount: number
  zones: Array<{ name: string; surface: number; photo?: ZonePhoto; litres: number }>
}

type Results = SolidResults | LiquidResults | TopdressingResults | null

// ── Disclaimer ────────────────────────────────────────────────────────────────

const DISCLAIMER =
  'Les dosages sont donnés à titre indicatif. ' +
  'Vérifiez toujours le dosage avant application sur l\'étiquette du fabricant. ' +
  'En cas de doute, contactez Hanami.'

// ─────────────────────────────────────────────────────────────────────────────

export default function HanamiCalculator() {
  // ── Navigation
  const [stepKey, setStepKey] = useState<StepKey>('zones')

  // ── Zones
  const [zones, setZones] = useState<Zone[]>([
    { name: '', surface: '' },
  ])

  // ── Product
  const [productType, setProductType] = useState<ProductType>('')

  // ── Fertilizer scenario
  const [fertScenario, setFertScenario] = useState<string | null>(null)

  // ── Seeds scenario — Regarnissage sélectionné par défaut
  const [seedObjective, setSeedObjective]   = useState<string | null>('regarnissage')
  const [lawnCondition, setLawnCondition]   = useState<string | null>(null)

  // ── Dosage (solid) — multi-produits : liste de produits avec leur dose individuelle.
  //    Le 1er produit est créé d'office. Les scénarios (seeds/fertilizer) règlent
  //    le doseur du produit 1 ; les produits suivants sont saisis manuellement.
  const [solidProducts, setSolidProducts] = useState<SolidProduct[]>([makeSolidProduct()])
  const [reverseMode, setReverseMode] = useState(false)
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockUnit, setStockUnit]         = useState('kg')
  const [selectedZones, setSelectedZones] = useState<number[]>([])

  // ── Code zones (pré-remplissage 4 chiffres) ─────────────────────────────────
  const [codeInput, setCodeInput] = useState('')
  const [codeMsg, setCodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Helpers SolidProduct
  const updateSolidProduct = (id: string, patch: Partial<SolidProduct>) =>
    setSolidProducts(prods => prods.map(p => p.id === id ? { ...p, ...patch } : p))
  const addSolidProduct = () => setSolidProducts(prods => [...prods, makeSolidProduct()])
  const removeSolidProduct = (id: string) =>
    setSolidProducts(prods => prods.length > 1 ? prods.filter(p => p.id !== id) : prods)

  /** Met à jour la dose du produit 1 (utilisé par les scénarios seeds/fert) */
  const setMainSolidDose = (dose: string, doseUnit: 'g/m2' | 'kg/ha' = 'g/m2') => {
    setSolidProducts(prods => prods.length > 0
      ? prods.map((p, i) => i === 0 ? { ...p, dose, doseUnit } : p)
      : [makeSolidProduct('', dose, doseUnit)]
    )
  }

  // ── Dosage (liquid)
  const [sprayerCapacity, setSprayerCapacity]   = useState('15')
  const [sprayVolume, setSprayVolume]           = useState('600')
  /** Liste des produits liquides dans le mélange (1 à N).
   *  Le 1er produit est créé d'office ; l'utilisateur peut en ajouter d'autres
   *  pour pulvériser un mélange (ex: H2Pro Trismart + Vitalnova StressBuster). */
  const [liquidProducts, setLiquidProducts] = useState<LiquidProduct[]>([makeProduct()])
  const [expertMode, setExpertMode]             = useState(false)
  const [showVolumeConverter, setShowVolumeConverter] = useState(false)

  // Helpers de manipulation de la liste de produits
  const updateLiquidProduct = (id: string, patch: Partial<LiquidProduct>) =>
    setLiquidProducts(prods => prods.map(p => p.id === id ? { ...p, ...patch } : p))
  const addLiquidProduct = () => setLiquidProducts(prods => [...prods, makeProduct()])
  const removeLiquidProduct = (id: string) =>
    setLiquidProducts(prods => prods.length > 1 ? prods.filter(p => p.id !== id) : prods)

  // ── Top dressing
  const [tdDepth, setTdDepth]             = useState('5')
  const [tdCustomDepth, setTdCustomDepth] = useState('')
  const [tdMaterial, setTdMaterial]       = useState('sand')
  const [tdBagSize, setTdBagSize]         = useState('40')

  // ── Results / UI
  const [results, setResults]                   = useState<Results>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [isMobile, setIsMobile]                 = useState(false)
  const [newsletterEmail, setNewsletterEmail]   = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // ── Liquid zone tracking (onglets + chronomètre + terminé) ───────────────
  const [activeZoneTab, setActiveZoneTab]         = useState<'all' | number>('all')
  const [zonesDone, setZonesDone]                 = useState<Set<number>>(new Set())
  const [zoneTimers, setZoneTimers]               = useState<Record<number, number>>({})
  const timerRefs = useRef<Record<number, ReturnType<typeof setInterval>>>({})

  /** Trigger pour relancer le calcul après que tous les setState d'un prefill
   *  dev soient flushés. Incrémenté à chaque clic [Dev]. */
  const [devCalcTrigger, setTriggerDevCalc] = useState(0)

  /** Lightbox photo : null = fermé. Source = dataUrl, caption = nom de zone. */
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)
  /** Index de la zone en cours de compression (UI loader sur la carte) */
  const [photoLoadingIdx, setPhotoLoadingIdx] = useState<number | null>(null)
  /** Erreur de compression (rare — affichée brièvement sous la carte) */
  const [photoError, setPhotoError] = useState<{ idx: number; msg: string } | null>(null)

  const startTimer = (i: number) => {
    if (timerRefs.current[i]) return
    timerRefs.current[i] = setInterval(() => {
      setZoneTimers(prev => ({ ...prev, [i]: (prev[i] || 0) + 1 }))
    }, 1000)
    setZoneTimers(prev => ({ ...prev })) // trigger re-render so isRunning reflects truth
  }

  const stopTimer = (i: number) => {
    clearInterval(timerRefs.current[i])
    delete timerRefs.current[i]
    setZoneTimers(prev => ({ ...prev }))
  }

  const markDone = (i: number) => {
    stopTimer(i)
    setZonesDone(prev => new Set([...prev, i]))
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // ── Persistence localStorage ──────────────────────────────────────────────
  //
  // On stocke les zones + la capacité du pulvérisateur dans localStorage pour
  // que le visiteur retrouve ses données entre les sessions (idéal pour les
  // gestionnaires de plusieurs zones qui reviennent semaine après semaine).
  //
  // Migration douce depuis sessionStorage (ancienne version) : à la 1ère visite
  // après mise à jour, on lit la valeur sessionStorage en fallback.
  //
  // Gestion du quota (5-10 MB selon navigateur) : les photos en base64 peuvent
  // saturer rapidement. Si l'écriture échoue, on retombe sur une sauvegarde
  // sans les photos pour préserver au moins les noms + surfaces.

  const LS_ZONES_KEY = 'hanami-calc-zones-v2'   // v2 = photos incluses
  const LS_SPRAYER_KEY = 'hanami-calc-sprayer-cap'
  const LS_CODES_KEY = 'hanami-calc-codes'      // codes enregistrés par le visiteur

  /** Sauve les zones avec gestion du quota. Si le storage est plein, on retire
   *  les photos et on retente — mieux vaut garder noms/surfaces que tout perdre. */
  function safeSaveZones(zonesToSave: Zone[]) {
    try {
      localStorage.setItem(LS_ZONES_KEY, JSON.stringify(zonesToSave))
    } catch (err) {
      // QuotaExceededError sur la plupart des navigateurs
      console.warn('[HanamiCalc] localStorage plein, on retire les photos pour sauver', err)
      const zonesNoPhoto = zonesToSave.map(z => ({ name: z.name, surface: z.surface }))
      try {
        localStorage.setItem(LS_ZONES_KEY, JSON.stringify(zonesNoPhoto))
      } catch {
        // Si même sans photos ça échoue, on abandonne silencieusement
      }
    }
  }

  useEffect(() => {
    // 1. Tentative localStorage v2
    let savedZones = localStorage.getItem(LS_ZONES_KEY)
    // 2. Migration depuis sessionStorage (ancienne version)
    if (!savedZones) {
      const legacy = sessionStorage.getItem('lawnZones')
      if (legacy) {
        savedZones = legacy
        sessionStorage.removeItem('lawnZones')
      }
    }
    if (savedZones) {
      try {
        const parsed = JSON.parse(savedZones) as Zone[]
        if (Array.isArray(parsed) && parsed.length > 0) setZones(parsed)
      } catch {
        // JSON invalide → on ignore et démarre vierge
      }
    }

    const savedCap = localStorage.getItem(LS_SPRAYER_KEY) ?? sessionStorage.getItem('sprayerCapacity')
    if (savedCap) {
      setSprayerCapacity(savedCap)
      sessionStorage.removeItem('sprayerCapacity')  // migration
    }

    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  /** Lien direct (ex. /calculatrice?code=2016) : charge le code SANS demander
   *  confirmation — contrairement à la saisie manuelle, ce lien a été envoyé
   *  délibérément (par Hanami à un client), donc son intention fait foi.
   *  S'exécute une seule fois au montage (guard via ref, StrictMode-safe),
   *  après l'effet de restauration ci-dessus dont il prend volontairement
   *  le pas — un lien reçu doit toujours gagner sur d'anciennes zones stockées. */
  const urlCodeHandled = useRef(false)
  useEffect(() => {
    if (urlCodeHandled.current || typeof window === 'undefined') return
    urlCodeHandled.current = true
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code || !/^\d{4}$/.test(code)) return
    setCodeInput(code)
    const preset = resolveCode(code)
    if (preset && Array.isArray(preset.zones)) {
      applyPreset(preset)
      track('calculator_action', { action: 'code_load_url' })
    } else {
      setCodeMsg({ type: 'error', text: 'Lien invalide — aucune zone pour ce code.' })
    }
    // Nettoie l'URL pour qu'un simple rafraîchissement (F5) ne re-déclenche pas
    // le chargement (et n'écrase pas des zones que le client aurait modifiées).
    window.history.replaceState(null, '', window.location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // On ne sauve que s'il y a au moins une zone avec une surface saisie,
    // pour ne pas écraser une session précédente avec un état vierge.
    if (zones.length > 0 && zones.some(z => z.surface)) {
      safeSaveZones(zones)
    }
  }, [zones]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (zones.length > 0 && selectedZones.length === 0)
      setSelectedZones(zones.map((_, i) => i))
  }, [zones]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sprayerCapacity) {
      try { localStorage.setItem(LS_SPRAYER_KEY, sprayerCapacity) } catch { /* quota — ignorable */ }
    }
  }, [sprayerCapacity])

  // Lance le calcul après que les states soient flushés par le prefillDev.
  // Ce useEffect n'est déclenché que par devCalcTrigger pour éviter les
  // re-calculs en boucle — les autres deps sont lues via closure.
  useEffect(() => {
    if (devCalcTrigger === 0) return
    console.log('[Dev] Trigger calc — type=', productType, 'liquidProducts=', liquidProducts.length, 'solidProducts=', solidProducts.length)
    if (productType === 'liquid' && !expertMode) {
      calculateResults(undefined, '1000')
    } else {
      calculateResults()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devCalcTrigger])

  // ── Navigation helpers ────────────────────────────────────────────────────

  const steps     = STEPS[productType] || STEPS['']
  const stepIndex = steps.indexOf(stepKey)
  const totalSteps = steps.length

  const goTo   = (key: StepKey) => setStepKey(key)
  const goBack = () => { const p = steps[stepIndex - 1]; if (p) setStepKey(p) }
  const goNext = () => { const n = steps[stepIndex + 1]; if (n) setStepKey(n) }

  // ── Zone helpers ──────────────────────────────────────────────────────────

  // Toute édition manuelle des zones périme le message « … chargés » / « enregistrées »
  const clearCodeMsg = () => setCodeMsg(null)
  const addZone    = () => { clearCodeMsg(); setZones([...zones, { name: '', surface: '' }]) }
  const removeZone = (i: number) => { if (zones.length > 1) { clearCodeMsg(); setZones(zones.filter((_, idx) => idx !== i)) } }
  const updateZone = (i: number, field: 'name' | 'surface', v: string) => {
    // Spread pour créer un nouvel objet zone — évite la mutation en place
    // qui empêche React de détecter le changement (shallow copy insuffisant).
    clearCodeMsg()
    setZones(zones.map((z, idx) => idx === i ? { ...z, [field]: v } : z))
  }
  const setZonePhoto = (i: number, photo: Zone['photo']) => {
    clearCodeMsg()
    setZones(zones.map((z, idx) => idx === i ? { ...z, photo } : z))
  }

  /** Handler upload/capture photo pour une zone donnée. Compresse via
   *  photo-utils (gère HEIC sur tous navigateurs) et stocke en data: URL. */
  const handleZonePhotoUpload = async (i: number, file: File) => {
    setPhotoLoadingIdx(i)
    setPhotoError(null)
    try {
      const compressed = await compressPhoto(file)
      setZonePhoto(i, {
        dataUrl: compressed.dataUrl,
        width: compressed.width,
        height: compressed.height,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Photo invalide'
      setPhotoError({ idx: i, msg })
    } finally {
      setPhotoLoadingIdx(null)
    }
  }
  // ── Codes de zones ──────────────────────────────────────────────────────────
  //
  // Un code à 4 chiffres pré-remplit les zones. Résolution : d'abord les presets
  // officiels (lib/calculatrice/presets.ts, valables partout), puis les codes que
  // le visiteur a lui-même enregistrés dans ce navigateur (localStorage).

  /** Lit la carte des codes enregistrés localement. */
  const readSavedCodes = (): Record<string, CalcPreset> => {
    try {
      const raw = localStorage.getItem(LS_CODES_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }

  /** Résout un code → preset, ou null. Presets officiels prioritaires. */
  const resolveCode = (code: string): CalcPreset | null =>
    CALC_PRESETS[code] ?? readSavedCodes()[code] ?? null

  /** Applique un preset résolu au formulaire — cœur commun entre le chargement
   *  manuel (bouton « Charger ») et le chargement via lien direct (?code=). */
  const applyPreset = (preset: CalcPreset) => {
    const loaded = preset.zones.map(z => ({ name: z.name, surface: z.surface }))
    const nextZones = loaded.length > 0 ? loaded : [{ name: '', surface: '' }]
    setZones(nextZones)
    setSelectedZones(nextZones.map((_, i) => i))
    if (preset.sprayerCapacity) setSprayerCapacity(preset.sprayerCapacity)
    setResults(null) // les anciens résultats ne correspondent plus aux nouvelles zones
    // Purge du suivi de zones (chronos, cases « fait ») indexé par position :
    // sans ça, un ✓ ou un chrono resterait collé à la zone qui prend le même index.
    Object.values(timerRefs.current).forEach(clearInterval)
    timerRefs.current = {}
    setActiveZoneTab('all')
    setZonesDone(new Set())
    setZoneTimers({})
    const total = nextZones.reduce((s, z) => s + (parseFloat(z.surface) || 0), 0)
    setCodeMsg({
      type: 'success',
      text: `${preset.label} — ${nextZones.length} ${plural(nextZones.length, 'zone')}, ${total.toFixed(0)} m² chargés.`,
    })
  }

  /** Charge les zones d'un code dans le formulaire (bouton « Charger », ou
   *  automatiquement dès la 4ᵉ saisie dans les cases OTP). `codeOverride`
   *  permet de passer la valeur composée directement (évite de dépendre de
   *  `codeInput`, pas encore flushé au moment où le 4ᵉ chiffre est tapé).
   *  Demande confirmation si des zones sont déjà saisies — contrairement au
   *  lien direct (?code=), c'est une saisie manuelle qui peut être un essai. */
  const loadCode = (codeOverride?: string) => {
    const code = (codeOverride ?? codeInput).trim()
    if (!/^\d{4}$/.test(code)) {
      setCodeMsg({ type: 'error', text: 'Entrez un code à 4 chiffres.' })
      return
    }
    const preset = resolveCode(code)
    // Garde de forme : une entrée localStorage trafiquée/d'une future version
    // pourrait ne pas avoir de tableau `zones` → on refuse proprement au lieu de crasher.
    if (!preset || !Array.isArray(preset.zones)) {
      setCodeMsg({ type: 'error', text: 'Aucune zone enregistrée pour ce code.' })
      return
    }
    // Anti-écrasement : si l'utilisateur a déjà saisi des données (surface ou photo),
    // on confirme avant de tout remplacer — l'auto-sauvegarde écraserait sinon le backup.
    const hasUserData = zones.some(z => (parseFloat(z.surface) || 0) > 0 || z.photo)
    const hasPhotos = zones.some(z => z.photo)
    if (hasUserData && typeof window !== 'undefined') {
      const warn = hasPhotos
        ? 'Remplacer les zones actuelles ? Vos surfaces ET vos photos seront perdues.'
        : 'Remplacer les zones actuelles par celles du code ?'
      if (!window.confirm(warn)) return
    }
    applyPreset(preset)
    track('calculator_action', { action: 'code_load' })
  }

  /** Enregistre les zones actuelles sous un code, dans ce navigateur. */
  const saveCode = () => {
    const code = codeInput.trim()
    if (!/^\d{4}$/.test(code)) {
      setCodeMsg({ type: 'error', text: 'Choisissez un code à 4 chiffres pour enregistrer.' })
      return
    }
    if (CALC_PRESETS[code]) {
      setCodeMsg({ type: 'error', text: 'Ce code est réservé — choisissez-en un autre.' })
      return
    }
    const filled = zones.filter(z => (parseFloat(z.surface) || 0) > 0)
    if (filled.length === 0) {
      setCodeMsg({ type: 'error', text: 'Ajoutez au moins une zone avec une surface avant d’enregistrer.' })
      return
    }
    try {
      const map = readSavedCodes()
      map[code] = {
        label: `Mes zones (${code})`,
        zones: filled.map(z => ({ name: z.name, surface: z.surface })),
        sprayerCapacity,
      }
      localStorage.setItem(LS_CODES_KEY, JSON.stringify(map))
      setCodeMsg({ type: 'success', text: `Zones enregistrées sous le code ${code}. Retapez-le pour les recharger.` })
      track('calculator_action', { action: 'code_save' })
    } catch {
      setCodeMsg({ type: 'error', text: 'Enregistrement impossible (stockage saturé).' })
    }
  }

  const getTotalSurface    = () => zones.reduce((s, z) => s + (parseFloat(z.surface) || 0), 0)
  const getSelectedSurface = () =>
    zones.filter((_, i) => selectedZones.includes(i)).reduce((s, z) => s + (parseFloat(z.surface) || 0), 0)
  const toggleZoneSelection = (i: number) =>
    setSelectedZones(selectedZones.includes(i) ? selectedZones.filter(x => x !== i) : [...selectedZones, i])

  // ── Dosage helpers ────────────────────────────────────────────────────────

  /** Convertit une dose + unité en g/m² (référence canonique) */
  const doseToGperM2 = (dose: string, unit: 'g/m2' | 'kg/ha') => {
    const d = parseFloat(dose)
    if (isNaN(d)) return 0
    return unit === 'kg/ha' ? d / 10 : d
  }

  /** Wrapper legacy pour les warnings — utilise le 1er produit solide */
  const convertDosageToGperM2 = () => {
    const p = solidProducts[0]
    if (!p) return 0
    return doseToGperM2(p.dose, p.doseUnit)
  }

  const calculateReverseDosage = () => {
    const surface = getSelectedSurface()
    if (productType === 'liquid') {
      const stockL = stockUnit === 'L' ? parseFloat(stockQuantity) : parseFloat(stockQuantity) / 1000
      return (stockL * 10000) / surface
    }
    const stockG = stockUnit === 'kg' ? parseFloat(stockQuantity) * 1000 : parseFloat(stockQuantity)
    return stockG / surface
  }

  const getDosageAlert = () => {
    if (!reverseMode) return null
    const calc = calculateReverseDosage()
    // Référence = dose recommandée du PRODUIT sélectionné quand elle existe
    // (autocomplete catalogue), sinon constante générique par type. L'ancienne
    // constante seule (10 L/ha) marquait « surdosage » un stock parfaitement
    // correct de produit dosé à 25 L/ha.
    const productRec = productType === 'liquid'
      ? parseFloat(liquidProducts[0]?.doseExpert ?? '')
      : convertDosageToGperM2()
    const fallback = productType === 'liquid' ? 10 : productType === 'seeds' ? 25 : 30
    const rec = productRec > 0 ? productRec : fallback
    const pct  = (calc / rec) * 100
    const unit = productType === 'liquid' ? 'L/ha' : 'g/m²'
    if (pct < 50)  return { type: 'error',   message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: 'Effets quasi inexistants — ne pas appliquer.' }
    if (pct < 80)  return { type: 'warning', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: 'Effets limités — concentrez-vous sur vos zones prioritaires.' }
    if (pct <= 120) return { type: 'success', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: 'Dosage correct.' }
    return { type: 'error', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: 'Surdosage — risque de brûlure.' }
  }

  const getWarning = () => {
    const d = convertDosageToGperM2()
    if (productType === 'seeds') {
      if (d > 40)           return { type: 'error',   message: 'Dose >40g/m² : risque de compétition entre brins. Vérifiez le fabricant.' }
      if (d >= 15 && d <= 25) return { type: 'success', message: 'Dose idéale pour un regarnissage (15–25 g/m²).' }
      // Bande contiguë : 25–40 = création (le catalogue dose les créations à 30 g/m²,
      // qui tombait dans un trou muet entre les deux bandes précédentes)
      if (d > 25 && d <= 40)  return { type: 'warning', message: 'Dose correcte pour une création. Ne pas dépasser 40 g/m².' }
    }
    if (productType === 'fertilizer') {
      if (d > 50) return { type: 'error', message: 'ALERTE : Dose >50g/m² — risque élevé de brûlure.' }
      if (d > 40) return { type: 'error', message: 'Dose >40g/m² : risque de brûlure. Vérifiez le fabricant.' }
    }
    return null
  }

  const getTdDepthWarning = () => {
    const depth = parseFloat(tdCustomDepth || tdDepth)
    if (!depth || isNaN(depth) || (tdDepth === 'custom' && !tdCustomDepth)) return null

    if (depth <= 1) return {
      type: 'success' as const,
      title: 'Finition légère — zone très sûre',
      message: 'À 1 mm, on lisse les micro-irrégularités et on améliore l\'enrobage des graines sans aucun stress visible pour le gazon. Idéal avant un sur-semis ou en entretien courant.',
    }
    if (depth <= 2) return {
      type: 'success' as const,
      title: 'Bénéfice fonctionnel réel — zone idéale',
      message: 'À 2 mm, on gagne en homogénéité de germination, en portance et en ressuyage. Zone optimale pour un top dressing d\'entretien régulier, sans aucun risque pour le couvert.',
    }
    if (depth <= 3) return {
      type: 'success' as const,
      title: 'Action visible et très sûre',
      message: 'À 3 mm, on corrige les petits défauts de planéité et on favorise la reprise des zones clairsemées. Zone de confort pour un résultat propre : privilégiez un matériau fin et bien tamisé.',
    }
    if (depth <= 5) return {
      type: 'warning' as const,
      title: depth <= 4 ? 'Épaisseur correcte, restez attentif' : 'Limite haute prudente',
      message: depth <= 4
        ? 'À 4 mm, l\'application reste raisonnable sur un gazon vigoureux. Arrosez bien après et vérifiez que le matériau ne croûte pas en surface.'
        : 'À 5 mm, la reprise peut ralentir temporairement. Acceptable sur un gazon dense et en croissance active — à éviter sur gazon tondu ras ou affaibli.',
    }
    if (depth <= 8) return {
      type: 'error' as const,
      title: 'Épaisseur risquée sur gazon installé',
      message: 'À 8 mm, le feuillage peut être partiellement enterré. Risque de jaunissement, reprise irrégulière et affaiblissement du couvert. Préférez 2 passages à 4 mm espacés de quelques semaines.',
    }
    if (depth <= 10) return {
      type: 'error' as const,
      title: 'Fortement déconseillé en une seule application',
      message: 'À 10 mm, les feuilles sont durablement privées de lumière. Risque d\'affaiblissement réel et de zones sans reprise. Fractionnez en 2 à 3 passages espacés.',
    }
    return {
      type: 'error' as const,
      title: `${depth} mm — correction lourde, évitez en une seule fois`,
      message: 'Au-delà de 10 mm, vous risquez d\'étouffer le gazon existant. Procédez par passes successives de 3 à 5 mm, espacées de quelques semaines, pour un résultat propre et sûr.',
    }
  }

  const fmtLiquid = (ml: number) =>
    ml >= 1000 ? { value: (ml / 1000).toFixed(2), unit: 'L' } : { value: Math.round(ml), unit: 'ml' }

  // ── Calculate results ─────────────────────────────────────────────────────

  const calculateResults = (overrideLiquidDose?: string, overrideSprayVol?: string) => {
    track('calculator_action', { action: 'compute', type: productType })
    const totalSurface  = reverseMode ? getSelectedSurface() : getTotalSurface()
    const zonesToCalc   = reverseMode ? zones.filter((_, i) => selectedZones.includes(i)) : zones
    const numberOfZones = zonesToCalc.filter(z => parseFloat(z.surface) > 0).length

    if (productType === 'topdressing') {
      const depth   = parseFloat(tdCustomDepth || tdDepth)
      const bagSize = parseFloat(tdBagSize) || 40
      const mat     = TD_MATERIALS.find(m => m.id === tdMaterial)?.label ?? tdMaterial
      setResults({
        type: 'topdressing', depth, material: mat,
        totalSurface, totalLitres: totalSurface * depth,
        bagSize, bagsCount: Math.ceil((totalSurface * depth) / bagSize),
        zones: zonesToCalc.map((z, i) => {
          const surf = parseFloat(z.surface) || 0
          return { name: z.name || `Zone ${i + 1}`, surface: surf, photo: z.photo, litres: surf * depth }
        }),
      })
      setStepKey('results')
      return
    }

    if (productType === 'liquid') {
      // Modes :
      //  - Reverse  : 1 seul produit (override fourni), passé via overrideLiquidDose
      //  - Simplifié: chaque produit a sa dose en ml/L (overrideSprayVol='1000' = ml/L)
      //  - Expert   : chaque produit a sa dose en L/ha (sprayVolume = bouillie L/ha)
      const svn = parseFloat(overrideSprayVol ?? sprayVolume)
      const sc  = parseFloat(sprayerCapacity)
      const tsv = (totalSurface * svn) / 10000  // total spray volume en L
      const fills = Math.ceil(tsv / sc)

      // Construit la liste des produits à calculer, normalisée en "L/ha équivalent"
      // pour pouvoir multiplier par la surface uniformément.
      type ProdInput = { name: string; doseLperHa: number }
      let prodInputs: ProdInput[]

      if (overrideLiquidDose !== undefined) {
        // Cas reverse mode : un seul "produit" issu du stock disponible
        // (la valeur passée est déjà en L/ha)
        prodInputs = [{ name: liquidProducts[0]?.name || '', doseLperHa: parseFloat(overrideLiquidDose) }]
      } else if (overrideSprayVol === '1000') {
        // Mode simplifié : dose en ml/L → on la convertit en L/ha sachant que
        // svn=1000 L/ha (10 L/100m²). 10 ml/L × 1000 L/ha = 10 L/ha.
        prodInputs = liquidProducts.map(p => ({
          name: p.name,
          doseLperHa: (parseFloat(p.doseSimple) * svn) / 1000,
        }))
      } else {
        // Mode expert : dose en L/ha directement
        prodInputs = liquidProducts.map(p => ({
          name: p.name,
          doseLperHa: parseFloat(p.doseExpert),
        }))
      }

      // Quantité totale de produit pour la surface (en ml)
      const productAmountsMl = prodInputs.map(p => (p.doseLperHa * totalSurface / 10000) * 1000)
      const totalProductsMl = productAmountsMl.reduce((s, v) => s + v, 0)

      const products: ProductQuantity[] = prodInputs.map((p, idx) => {
        const totalMl = productAmountsMl[idx]
        // Recette par PLEIN COMPLET = concentration (ml par L de bouillie) × capacité.
        // Surtout pas totalMl / nombre de pleins arrondi au supérieur : le dernier
        // plein étant souvent partiel, cette division sous-dosait chaque plein
        // complet (jusqu'à −47 % sur petite surface). La concentration, elle,
        // est constante quel que soit le découpage en pleins.
        const perFillMl = tsv > 0 ? (totalMl / tsv) * sc : 0
        const tf = fmtLiquid(totalMl)
        const pf = fmtLiquid(perFillMl)
        return {
          name: p.name || `Produit ${idx + 1}`,
          totalAmount: tf.value, totalUnit: tf.unit,
          perFillAmount: pf.value, perFillUnit: pf.unit,
        }
      })

      const zoneResults = zonesToCalc.map((z, i) => {
        const surf = parseFloat(z.surface) || 0
        const zsv  = (surf * svn) / 10000
        // Quantité de chaque produit dans cette zone
        const zoneProdsMl = prodInputs.map(p => (p.doseLperHa * surf / 10000) * 1000)
        const zoneProdsTotalMl = zoneProdsMl.reduce((s, v) => s + v, 0)
        const productsAmounts = prodInputs.map((p, idx) => {
          const fp = fmtLiquid(zoneProdsMl[idx])
          return { name: p.name || `Produit ${idx + 1}`, amount: fp.value, unit: fp.unit }
        })
        return {
          name: z.name || `Zone ${i + 1}`,
          surface: surf,
          photo: z.photo,
          sprayVolume: zsv.toFixed(2),
          productsAmounts,
          // Eau = volume bouillie - somme des produits (borné à 0 : un mélange
          // très concentré sur une petite bouillie ne doit pas afficher un négatif)
          waterAmount: (Math.max(0, zsv * 1000 - zoneProdsTotalMl) / 1000).toFixed(1),
          fills: (zsv / sc).toFixed(2),
        }
      })

      // Avertissement console si trop de produit pour le pulvérisateur (rare,
      // mais on prévient le visiteur en silence — ne bloque pas le calcul)
      if (totalProductsMl / fills / 1000 > sc * 0.5) {
        console.warn('[HanamiCalculator] mélange concentré — vérifier la compatibilité produits')
      }

      setResults({
        type: 'liquid',
        totalSurface,
        totalSprayVolume: tsv.toFixed(2),
        products,
        numberOfFills: fills,
        zones: zoneResults,
        numberOfZones,
      })
    } else {
      // Solid (seeds + fertilizer) — multi-produits
      // Chaque produit est calculé indépendamment pour la même surface.
      const productsCalc = solidProducts.map((p, idx) => {
        const dg = doseToGperM2(p.dose, p.doseUnit)
        return {
          name: p.name || `Produit ${idx + 1}`,
          dosePerM2: dg.toFixed(1),
          totalKg: ((totalSurface * dg) / 1000).toFixed(2),
          dgValue: dg,
        }
      })

      setResults({
        type: 'solid',
        totalSurface,
        products: productsCalc.map(({ dgValue, ...p }) => p),
        zones: zonesToCalc.map((z, i) => {
          const surf = parseFloat(z.surface) || 0
          return {
            name: z.name || `Zone ${i + 1}`,
            surface: surf,
            photo: z.photo,
            productsQuantities: productsCalc.map(p => ({
              name: p.name,
              quantity: ((surf * p.dgValue) / 1000).toFixed(2),
            })),
          }
        }),
        numberOfZones,
      })
    }
    setStepKey('results')
  }

  // ── Export ────────────────────────────────────────────────────────────────

  /** Capture le bloc résultats en image PNG dataUrl.
   *  - Largeur forcée à 720 px → rendu cohérent peu importe le viewport
   *    (très lisible sur mobile, pas écrasé sur desktop).
   *  - Filter exclut les éléments .no-print (chronomètre, boutons UI, etc.)
   *    car html-to-image ne respecte pas le CSS @media print.
   *  - Marge blanche autour via canvas pour aérer le rendu final. */
  const captureWithPadding = async (pad = 40): Promise<string> => {
    const el = resultsRef.current
    if (!el) throw new Error('no ref')
    const { toPng } = await import('html-to-image')
    const pixelRatio = 2
    const targetWidth = 720
    const raw = await toPng(el, {
      pixelRatio,
      backgroundColor: '#ffffff',
      skipFonts: false,
      width: targetWidth,
      canvasWidth: targetWidth * pixelRatio,
      style: { width: `${targetWidth}px` },
      // Skip tout élément qui a la classe .no-print (chronomètre, etc.)
      filter: (node) => {
        if (node instanceof Element) {
          if (node.classList?.contains('no-print')) return false
        }
        return true
      },
    })
    const img = new window.Image()
    img.src = raw
    await new Promise<void>(resolve => { img.onload = () => resolve() })
    const padPx = pad * pixelRatio
    const canvas = document.createElement('canvas')
    canvas.width  = img.naturalWidth  + padPx * 2
    canvas.height = img.naturalHeight + padPx * 2
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, padPx, padPx)
    return canvas.toDataURL('image/png')
  }

  /** True si l'utilisateur est sur iOS, iPadOS ou macOS Safari. Sur ces
   *  appareils, navigator.share() ouvre la feuille de partage native
   *  incluant AirDrop, Messages, Mail, etc. */
  const [isApple, setIsApple] = useState(false)
  useEffect(() => {
    if (typeof navigator === 'undefined') return
    const ua = navigator.userAgent
    const isiOS = /iPad|iPhone|iPod/.test(ua)
    const isiPadDesktopUA = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
    const isMac = /Macintosh/.test(ua) && !isiPadDesktopUA
    setIsApple(isiOS || isiPadDesktopUA || isMac)
  }, [])

  /** Conseil d'application affiché en encadré ambre (écran + PDF). */
  const getTip = (): string => {
    if (!results) return ''
    if (results.type === 'solid') {
      return results.products.length > 1
        ? 'Appliquez chaque produit en passes croisées (2–3 passages) pour une répartition homogène.'
        : 'Épandez en passes croisées à réglage faible (2–3 passages) pour une répartition homogène.'
    }
    if (results.type === 'liquid') {
      return results.products.length > 1
        ? 'Mélangez tous les produits dans la même bouillie. Vérifiez la compatibilité chimique avant.'
        : 'Utilisez un traceur bleu pour éviter les doubles passages.'
    }
    return 'Passez à l\'aérateur ou au scarificateur avant application pour une meilleure pénétration.'
  }

  /** Ligne de configuration du bandeau d'en-tête (surface en tête). */
  const getChips = (): string[] => {
    if (!results) return []
    const chips = [`${getTotalSurface().toFixed(0)} m²`]
    if (results.type === 'solid' && productType === 'seeds') {
      chips.push('Semences')
      const obj = SEED_OBJECTIVES.find(o => o.id === seedObjective)?.label
      if (obj) chips.push(obj)
      const cond = LAWN_CONDITIONS.find(c => c.id === lawnCondition)?.label
      if (cond) chips.push(`État : ${cond}`)
    } else if (results.type === 'solid') {
      chips.push('Engrais')
    } else if (results.type === 'liquid') {
      chips.push(results.products.length > 1 ? `Liquide · mélange ${results.products.length} produits` : 'Liquide')
      chips.push(expertMode ? 'Mode expert' : 'Mode simplifié')
      chips.push(`Pulvérisateur ${sprayerCapacity} L`)
    } else {
      chips.push('Top dressing')
      chips.push(`${tdCustomDepth || tdDepth} mm`)
      const mat = TD_MATERIALS.find(m => m.id === tdMaterial)?.label
      if (mat) chips.push(mat)
    }
    return chips
  }

  /** Traduit l'état des résultats en modèle de document PDF (cf. lib/calculatrice/pdf-export.ts).
   *  Toutes les valeurs numériques sont formatées ici — le module PDF ne fait que dessiner. */
  const buildPdfDoc = (): DosagePdfDoc | null => {
    if (!results) return null

    const base = {
      dateLabel: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      chips: getChips(),
      tip: getTip(),
      disclaimer: DISCLAIMER,
    }

    if (results.type === 'solid') {
      const zones: PdfZone[] = results.zones.length > 1
        ? results.zones.map(z => ({
            name: z.name,
            surface: `${z.surface} m²`,
            photo: z.photo,
            rows: z.productsQuantities.map(pq => ({
              label: pq.name || 'Produit',
              value: `${fmt(pq.quantity)} kg`,
            })),
          }))
        : []
      return {
        ...base,
        summaryTitle: results.products.length > 1 ? 'Quantités totales' : 'Quantité totale',
        keyFigures: results.products.map(p => ({
          value: `${fmt(p.totalKg)} kg`,
          label: p.name || 'Produit',
          sub: `${Math.round(parseFloat(p.dosePerM2))} g/m²`,
        })),
        summaryMeta: [`${results.totalSurface} m²`],
        zonesTitle: zones.length ? 'Détail par zone' : undefined,
        zones,
      }
    }

    if (results.type === 'liquid') {
      const cap = parseFloat(sprayerCapacity) || 15
      const totalVol = parseFloat(results.totalSprayVolume)
      const lastVol = totalVol - (results.numberOfFills - 1) * cap
      const isPartial = results.numberOfFills > 1 && lastVol < cap * 0.98
      const singlePartial = results.numberOfFills === 1 && totalVol < cap * 0.98

      const parseMl = (amount: string | number, unit: string) =>
        unit === 'L' ? parseFloat(amount.toString()) * 1000 : parseFloat(amount.toString())

      // Même logique que le bloc Recette à l'écran : plein complet, ou bouillie
      // totale si tout tient dans un unique plein partiel.
      const recipeProducts = results.products.map(p => ({
        name: p.name || 'Produit',
        ml: singlePartial ? parseMl(p.totalAmount, p.totalUnit) : parseMl(p.perFillAmount, p.perFillUnit),
      }))
      const recipeVol = singlePartial ? totalVol : cap
      const water = Math.max(0, recipeVol - recipeProducts.reduce((s, p) => s + p.ml, 0) / 1000)
      const partialNote = isPartial
        ? `Dernier plein partiel (${fmt(lastVol, 1)} L de bouillie) : ` +
          results.products.map(p => {
            const f = fmtLiquid(parseMl(p.perFillAmount, p.perFillUnit) * lastVol / cap)
            return `${fmt(f.value)} ${f.unit} de ${p.name || 'produit'}`
          }).join(' · ') + ", complété d'eau"
        : undefined

      const zones: PdfZone[] = results.zones.map(z => {
        const zFills = parseFloat(z.fills)
        return {
          name: z.name,
          surface: `${z.surface} m²`,
          photo: z.photo,
          rows: [
            { label: 'Eau', value: `${fmt(z.waterAmount)} L`, highlight: true },
            ...z.productsAmounts.map((pa, i) => ({
              label: pa.name || `Produit ${i + 1}`,
              value: `${fmt(pa.amount)} ${pa.unit}`,
            })),
            { label: 'Bouillie', value: `${fmt(z.sprayVolume)} L` },
            { label: `Pulvérisateur (${sprayerCapacity} L)`, value: `${fmt(zFills)} ${plural(zFills, 'plein')}` },
          ],
        }
      })

      return {
        ...base,
        summaryTitle: results.products.length > 1 ? 'Mélange à préparer' : 'Produit nécessaire',
        keyFigures: results.products.map(p => ({
          value: `${fmt(p.totalAmount)} ${p.totalUnit}`,
          label: p.name || 'Produit',
        })),
        summaryMeta: [
          `${results.totalSurface} m²`,
          `${fmt(results.totalSprayVolume)} L bouillie`,
          `${results.numberOfFills} ${plural(results.numberOfFills, 'plein')}`,
        ],
        zonesTitle: zones.length > 1 ? 'Détail par zone' : undefined,
        zones,
        recipeTitle: singlePartial
          ? `Recette pour votre bouillie (${fmt(totalVol, 1)} L)`
          : `Recette par plein complet (${sprayerCapacity} L)`,
        recipe: [
          ...recipeProducts.map(p => {
            const f = fmtLiquid(p.ml)
            return { label: p.name, value: `${fmt(f.value)} ${f.unit}` }
          }),
          { label: singlePartial ? 'Eau' : 'Eau / plein', value: `${fmt(water, 1)} L` },
        ],
        recipeNote: partialNote,
      }
    }

    // Top dressing
    const zones: PdfZone[] = results.zones.length > 1
      ? results.zones.map(z => ({
          name: z.name,
          surface: `${z.surface} m²`,
          photo: z.photo,
          rows: [
            { label: 'Volume', value: `${fmt(z.litres, 0)} L`, highlight: true },
            { label: 'Soit', value: `${fmt(z.litres / 1000)} m³` },
            {
              label: `Sacs de ${results.bagSize} L`,
              value: `≈ ${Math.ceil(z.litres / results.bagSize)}`,
            },
          ],
        }))
      : []

    return {
      ...base,
      summaryTitle: 'Volume nécessaire',
      keyFigures: [{
        value: `${fmt(results.totalLitres, 0)} L`,
        label: results.material,
        sub: `${fmt(results.totalLitres / 1000)} m³`,
      }],
      summaryMeta: [
        `${results.totalSurface} m²`,
        `à ${results.depth} mm`,
        `≈ ${results.bagsCount} ${plural(results.bagsCount, 'sac')} de ${results.bagSize} L`,
      ],
      zonesTitle: zones.length ? 'Détail par zone' : undefined,
      zones,
    }
  }

  /** Export PDF vectoriel : texte net et sélectionnable, fichier léger.
   *  (L'ancien export collait une capture PNG du DOM → ~18 Mo et flou au zoom.) */
  const downloadPDF = async () => {
    track('calculator_action', { action: 'export_pdf' })
    const doc = buildPdfDoc()
    if (!doc) return
    const date = new Date().toISOString().slice(0, 10)
    await downloadDosagePdf(doc, `hanami-plan-dosage-${date}.pdf`)
  }

  const downloadPNG = async () => {
    track('calculator_action', { action: 'export_png' })
    const dataUrl = await captureWithPadding()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `hanami-dosage-${Date.now()}.png`
    a.click()
  }

  // Enregistre l'image dans l'application Photos (iOS/Android)
  // Sur HTTPS (prod) : ouvre la feuille de partage native via Web Share API
  // Sur HTTP (dev local) : ouvre l'image dans un nouvel onglet → long-press → "Enregistrer"
  const saveToPhotos = async () => {
    // On ouvre un onglet AVANT l'opération async pour contourner le
    // bloqueur de popups d'iOS (le geste utilisateur doit rester synchrone)
    const newTab = window.open('', '_blank')

    const dataUrl = await captureWithPadding()
    const blob = await fetch(dataUrl).then(r => r.blob())
    const file = new File([blob], `hanami-dosage-${Date.now()}.png`, { type: 'image/png' })

    // Web Share API avec fichiers — disponible sur HTTPS (iOS 15+, Android)
    if (typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })) {
      newTab?.close()
      await navigator.share({
        files: [file],
        title: 'Plan de dosage Hanami',
        text: 'Mon plan de dosage Hanami — Dosage Intelligent',
      })
      return
    }

    // Fallback : affiche l'image dans le nouvel onglet déjà ouvert
    // iOS Safari : appuie longuement → "Enregistrer l'image"
    if (newTab) {
      const html =
        `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">` +
        `<title>Hanami — Dosage</title><style>body{margin:0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:12px}` +
        `img{max-width:100%;height:auto}p{font-family:sans-serif;font-size:13px;color:#666;text-align:center;margin:0;padding:0 12px}</style></head>` +
        `<body><img src="${dataUrl}" alt="Hanami dosage"><p>Appuyez longuement sur l'image → "Enregistrer l'image"</p></body></html>`
      const htmlBlob = new Blob([html], { type: 'text/html' })
      const htmlUrl = URL.createObjectURL(htmlBlob)
      newTab.location.href = htmlUrl
      setTimeout(() => URL.revokeObjectURL(htmlUrl), 10_000)
    }
  }

  // ── Dev prefill ───────────────────────────────────────────────────────────

  /** Listes de produits Hanami pour les pré-remplissages aléatoires (mode dev) */
  const DEV_LIQUID_NAMES = [
    'H2Pro Trismart', 'H2Pro FlowSmart', 'Vitalnova StressBuster',
    'Kick Pro 0,5L', 'Kick Pro 2,5L', 'Kamasol Brillant Grün', 'Vitanica Si',
  ]
  const DEV_SEED_NAMES = [
    'Barenbrug Pro 12', 'Barenbrug RES+ RPR', 'Barenbrug RES+ Elite',
    'Barenbrug PRO SOS', 'Barenbrug RPR traçant',
  ]
  const DEV_FERT_NAMES = [
    'Floranid Twin Permanent', 'Floranid Twin Club', 'Floranid Twin Racines',
    'Super Floranid Twin BS', 'Sierraform GT Stress Control',
    'Bacteriosol Universel', 'Orgasyl Regarnissage',
  ]
  /** Renvoie N éléments distincts pris au hasard dans une liste */
  const sampleN = <T,>(arr: T[], n: number): T[] => {
    const copy = [...arr]
    const out: T[] = []
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = Math.floor(Math.random() * copy.length)
      out.push(copy.splice(idx, 1)[0])
    }
    return out
  }

  /** Pré-remplit la calculatrice avec un scénario aléatoire et lance le calcul.
   *  Choisit aléatoirement le type (semences / engrais / liquide / topdressing),
   *  pré-remplit avec 1 à 3 produits du catalogue Hanami avec des doses
   *  réalistes, et atterrit directement sur l'écran de résultats. */
  const prefillDev = () => {
    // Zones aléatoires
    const devZones: Zone[] = [
      { name: 'Pelouse principale', surface: String(150 + Math.floor(Math.random() * 200)) },
      { name: 'Jardin arrière',     surface: String(80  + Math.floor(Math.random() * 120)) },
    ]
    setZones(devZones)

    // Type aléatoire
    const types: ProductType[] = ['seeds', 'fertilizer', 'liquid', 'topdressing']
    const t = types[Math.floor(Math.random() * types.length)]
    setProductType(t)
    setReverseMode(false)

    if (t === 'liquid') {
      const nProducts = 1 + Math.floor(Math.random() * 3)  // 1 à 3 produits
      const names = sampleN(DEV_LIQUID_NAMES, nProducts)
      setLiquidProducts(names.map(name => makeProduct(
        name,
        String(5 + Math.floor(Math.random() * 16)),  // doseSimple 5-20 ml/L (entier)
        String(5 + Math.floor(Math.random() * 30)),  // doseExpert 5-34 L/ha (entier)
      )))
      setExpertMode(Math.random() > 0.5)
    } else if (t === 'seeds') {
      const objId = ['regarnissage', 'creation', 'reparation'][Math.floor(Math.random() * 3)]
      const obj = SEED_OBJECTIVES.find(o => o.id === objId)!
      setSeedObjective(objId)
      if (objId === 'regarnissage') {
        const condId = ['bare', 'patchy', 'thin'][Math.floor(Math.random() * 3)]
        const cond = LAWN_CONDITIONS.find(c => c.id === condId)!
        setLawnCondition(condId)
        // La dose découle de la condition (pas un random)
        const nProducts = 1 + Math.floor(Math.random() * 2)
        const names = sampleN(DEV_SEED_NAMES, nProducts)
        setSolidProducts(names.map(name => makeSolidProduct(name, String(cond.dosage), 'g/m2')))
      } else {
        setLawnCondition(null)
        const nProducts = 1 + Math.floor(Math.random() * 2)
        const names = sampleN(DEV_SEED_NAMES, nProducts)
        // Dose = celle de l'objectif sélectionné (cohérent avec le label affiché)
        setSolidProducts(names.map(name => makeSolidProduct(name, String(obj.dosage), 'g/m2')))
      }
    } else if (t === 'fertilizer') {
      const scId = ['monthly', 'bimonthly', 'quarterly', 'biannual'][Math.floor(Math.random() * 4)]
      const scenario = FERT_SCENARIOS.find(s => s.id === scId)!
      setFertScenario(scId)
      const nProducts = 1 + Math.floor(Math.random() * 3)
      const names = sampleN(DEV_FERT_NAMES, nProducts)
      // Dose = celle du scénario sélectionné (pas un random) → header cohérent
      setSolidProducts(names.map(name => makeSolidProduct(name, String(scenario.dosage), 'g/m2')))
    } else if (t === 'topdressing') {
      setTdDepth(['3', '5', '8'][Math.floor(Math.random() * 3)])
      setTdCustomDepth('')
      setTdMaterial(['sand', 'compost', 'mix'][Math.floor(Math.random() * 3)])
    }

    // Toutes les setters ci-dessus sont batchées par React 19 dans un seul
    // re-render. Le useEffect qui watch devCalcTrigger fire APRÈS commit, donc
    // les states sont déjà à jour au moment où il appelle calculateResults().
    setTriggerDevCalc(Date.now())
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = () => {
    setStepKey('zones'); setProductType('')
    setSolidProducts([makeSolidProduct()])
    setLiquidProducts([makeProduct()])
    setFertScenario(null)
    setSeedObjective(null); setLawnCondition(null)
    setSprayerCapacity(''); setSprayVolume('600')
    setExpertMode(false)
    setReverseMode(false); setStockQuantity(''); setStockUnit('kg')
    setTdDepth('5'); setTdCustomDepth(''); setTdMaterial('sand'); setTdBagSize('40')
    setSelectedZones(zones.map((_, i) => i))
    setResults(null); setShowDownloadMenu(false)
    // Clear liquid tracking
    Object.values(timerRefs.current).forEach(clearInterval)
    timerRefs.current = {}
    setActiveZoneTab('all')
    setZonesDone(new Set())
    setZoneTimers({})
  }

  // ── Newsletter inline submit ───────────────────────────────────────────────

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    // TODO: connect to Mailchimp / Resend / Brevo endpoint
    localStorage.setItem('hanami-newsletter-email', newsletterEmail)
    setNewsletterSubmitted(true)
    track('newsletter_signup', { source: 'calculator', status: 'success' })
  }

  // ── Shared classes ────────────────────────────────────────────────────────

  const inputCls = 'border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hanami-500 focus:border-transparent bg-white text-stone-800 text-sm'
  const btnPrimary   = 'w-full py-2.5 px-4 bg-hanami-700 text-white rounded-lg hover:bg-hanami-900 transition-colors text-sm font-medium disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed'
  const btnSecondary = 'w-full py-2.5 px-4 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium'

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 flex items-start justify-center">
      <div className="w-full max-w-xl">

        {/* ── Main card ───────────────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">

          {/* ── Card header ───────────────────────────────────────────────── */}
          <div className="no-print bg-hanami-900 px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-semibold text-base leading-tight truncate" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Dosage Intelligent · Hanami
              </h1>
              <p className="text-hanami-100/60 text-xs mt-0.5">
                {stepKey === 'zones'            && 'Entrez vos surfaces de gazon'}
                {stepKey === 'type'             && `${getTotalSurface().toFixed(0)} m² configurés · Choisissez un produit`}
                {stepKey === 'seeds_scenario'       && `${getTotalSurface().toFixed(0)} m² · Semences`}
                {stepKey === 'fertilizer_scenario' && `${getTotalSurface().toFixed(0)} m² · Engrais`}
                {stepKey === 'dosage'           && `${getTotalSurface().toFixed(0)} m² · ${productType === 'seeds' ? 'Semences' : productType === 'fertilizer' ? 'Engrais' : 'Liquide'}`}
                {stepKey === 'topdressing_config' && `${getTotalSurface().toFixed(0)} m² · Top dressing`}
                {stepKey === 'results'          && (() => {
                  if (productType === 'liquid') {
                    if (liquidProducts.length > 1) return `Mélange · ${liquidProducts.length} produits`
                    return liquidProducts[0]?.name || 'Résultats'
                  }
                  if (productType === 'seeds' || productType === 'fertilizer') {
                    if (solidProducts.length > 1) return `${solidProducts.length} produits`
                    return solidProducts[0]?.name || 'Résultats'
                  }
                  return 'Résultats'
                })()}
              </p>
            </div>
          </div>

          {/* ── Progress dots ─────────────────────────────────────────────── */}
          <div className="no-print px-5 py-2.5 border-b border-stone-100 flex items-center gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s}
                onClick={() => i < stepIndex && goTo(s)}
                disabled={i >= stepIndex}
                aria-label={`Étape ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex ? 'bg-hanami-700' : 'bg-stone-200'
                } ${i < stepIndex ? 'cursor-pointer hover:bg-hanami-500' : 'cursor-default'}`}
                style={{ width: i === stepIndex ? '20px' : '8px' }}
              />
            ))}
            <span className="ml-auto text-xs text-stone-300 font-[family-name:var(--font-space-mono)]">
              {stepIndex + 1}/{totalSteps}
            </span>
          </div>

          {/* ── Back button ───────────────────────────────────────────────── */}
          {stepIndex > 0 && stepKey !== 'results' && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 px-5 pt-3 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Retour
            </button>
          )}

          {/* ── Step content ──────────────────────────────────────────────── */}
          <div className="px-5 py-5">

            {/* ══ STEP: Zones ══════════════════════════════════════════════ */}
            {stepKey === 'zones' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                    Surfaces de votre jardin
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Séparez les zones de gazon distinctes (exposition, type de sol…)
                  </p>
                </div>

                {/* Code zones — pré-remplit / enregistre un jeu de zones (4 chiffres).
                    Pratique pour retrouver ses zones d'une visite à l'autre ou les
                    charger sur un autre appareil (codes gérés par Hanami). */}
                <div className="bg-hanami-100/40 border border-hanami-500/20 rounded-xl px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-hanami-900 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 shrink-0" /> Code zones
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5 mb-2">
                    Un code pré-remplit vos zones. Enregistrez les vôtres pour les retrouver.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      {/* Cases OTP (beui.dev) : saisie chiffre par chiffre, colle/autofill
                          gérés nativement. onComplete déclenche le chargement dès la 4ᵉ
                          case remplie — pas besoin de cliquer « Charger » en plus. */}
                      <OTPInput
                        length={4}
                        value={codeInput}
                        onChange={(v) => { setCodeInput(v); setCodeMsg(null) }}
                        onComplete={(v) => loadCode(v)}
                        status={codeMsg ? (codeMsg.type === 'success' ? 'success' : 'error') : 'idle'}
                        aria-label="Code à 4 chiffres"
                      />
                      {codeInput && (
                        <button
                          type="button"
                          onClick={() => { setCodeInput(''); setCodeMsg(null) }}
                          aria-label="Effacer le code"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => loadCode()}
                        className="px-3 py-1.5 rounded-lg bg-hanami-700 text-white text-xs font-medium hover:bg-hanami-900 transition-colors"
                      >
                        Charger
                      </button>
                      <button
                        onClick={saveCode}
                        className="px-3 py-1.5 rounded-lg border border-hanami-500/30 text-hanami-700 text-xs font-medium hover:bg-hanami-100/60 transition-colors"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                  {codeMsg && (
                    <p className={`text-[11px] mt-2 flex items-start gap-1.5 ${codeMsg.type === 'success' ? 'text-hanami-700' : 'text-red-600'}`}>
                      {codeMsg.type === 'success'
                        ? <Check className="w-3 h-3 mt-0.5 shrink-0" />
                        : <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />}
                      <span>{codeMsg.text}</span>
                    </p>
                  )}
                </div>

                {/* Zone list — ligne horizontale compacte avec slot photo carré
                    à gauche du nom. Slot vide = icône caméra (tap pour ajouter).
                    Slot rempli = miniature de la photo (tap = lightbox). */}
                <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
                  {zones.map((zone, i) => {
                    const isLoading = photoLoadingIdx === i
                    const errMsg = photoError?.idx === i ? photoError.msg : null
                    return (
                      <div key={i} className="bg-white">
                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 transition-colors">

                          {/* Slot photo carré — 56×56 px, à gauche du nom */}
                          <div className="shrink-0 relative w-14 h-14">
                            {zone.photo ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setLightbox({ src: zone.photo!.dataUrl, caption: zone.name || `Zone ${i + 1}` })}
                                  aria-label={`Voir la photo de ${zone.name || `Zone ${i + 1}`}`}
                                  className="w-full h-full rounded-lg overflow-hidden bg-stone-100 cursor-zoom-in border border-stone-200"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={zone.photo.dataUrl}
                                    alt={zone.name || `Zone ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                  />
                                </button>
                                {/* Mini bouton retirer la photo en superposition */}
                                <button
                                  type="button"
                                  onClick={() => setZonePhoto(i, undefined)}
                                  aria-label="Retirer la photo"
                                  className="no-print absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-md hover:bg-red-500 transition-colors text-[10px] leading-none"
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              /* Slot vide tappable — input file caché */
                              <label
                                htmlFor={`zone-photo-${i}`}
                                title="Ajouter une photo de la zone"
                                className="no-print w-full h-full rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 hover:border-hanami-500 hover:bg-hanami-100/40 hover:text-hanami-700 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" strokeWidth={1.6} />}
                                <input
                                  id={`zone-photo-${i}`}
                                  type="file"
                                  accept="image/*,.heic,.heif"
                                  capture="environment"
                                  className="sr-only"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0]
                                    if (f) handleZonePhotoUpload(i, f)
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                            )}
                          </div>

                          {/* Champ nom */}
                          <input
                            type="text"
                            placeholder={`Zone ${i + 1}`}
                            value={zone.name}
                            onChange={(e) => updateZone(i, 'name', e.target.value)}
                            className={`flex-1 min-w-0 px-2 py-1.5 text-xs ${inputCls}`}
                          />
                          {/* Champ surface */}
                          <div className="relative w-20 shrink-0">
                            <input
                              type="number"
                              inputMode="decimal"
                              placeholder="0"
                              value={zone.surface}
                              onChange={(e) => updateZone(i, 'surface', e.target.value)}
                              className={`w-full pl-2 pr-7 py-1.5 text-xs text-right ${inputCls}`}
                            />
                            <span className="absolute right-2 top-1.5 text-xs text-stone-400 pointer-events-none">m²</span>
                          </div>
                          {zones.length > 1 && (
                            <button
                              onClick={() => removeZone(i)}
                              className="text-stone-300 active:text-red-400 hover:text-red-400 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                              aria-label="Supprimer cette zone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Erreur de compression (rare) */}
                        {errMsg && (
                          <div className="px-3 pb-2 -mt-1">
                            <p className="text-[11px] text-red-600 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0" /> {errMsg}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={addZone}
                    className="flex items-center gap-1.5 text-xs text-hanami-700 hover:text-hanami-900 font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter une zone
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Total</span>
                    <span className="font-bold text-hanami-700 font-[family-name:var(--font-space-mono)] text-sm">
                      {getTotalSurface().toFixed(0)} m²
                    </span>
                  </div>
                </div>

                <button onClick={goNext} disabled={getTotalSurface() === 0} className={btnPrimary}>
                  Suivant →
                </button>
              </div>
            )}

            {/* ══ STEP: Type ═══════════════════════════════════════════════ */}
            {stepKey === 'type' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Quel type de produit ?
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { type: 'seeds'       as const, icon: Sprout,   label: 'Semences',       desc: 'Création ou regarnissage',    product: 'Barenbrug RES+ Elite' },
                    { type: 'fertilizer'  as const, icon: Sparkles, label: 'Engrais granulés', desc: 'Fertilisation & nutrition',  product: 'Floranid Twin Club'   },
                    { type: 'liquid'      as const, icon: Droplets, label: 'Produit liquide', desc: 'Traitement, mouillant, fongicide', product: 'H2Pro Trismart' },
                    { type: 'topdressing' as const, icon: Mountain, label: 'Top dressing',    desc: 'Sable, terreau, nivellement', product: ''                    },
                  ].map(({ type, icon: TypeIcon, label, desc, product }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setProductType(type)
                        // Pré-remplit le nom du 1er produit solide à titre de placeholder
                        if (type === 'seeds' || type === 'fertilizer') {
                          setSolidProducts(prev => prev.length > 0
                            ? prev.map((p, i) => i === 0 && !p.name ? { ...p, name: '' } : p)
                            : [makeSolidProduct(product)]
                          )
                        }
                        const nextSteps = STEPS[type]
                        setStepKey(nextSteps[2])
                      }}
                      className="flex flex-col items-start gap-2 p-4 bg-white border-2 border-stone-100 rounded-xl hover:border-hanami-500 hover:bg-hanami-100/20 transition-all text-left group"
                    >
                      <TypeIcon className="w-6 h-6 text-hanami-500 group-hover:text-hanami-700 transition-colors" />
                      <div>
                        <p className="text-sm font-semibold text-stone-800 group-hover:text-hanami-900 leading-tight">{label}</p>
                        <p className="text-xs text-stone-400 mt-0.5 leading-tight">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ STEP: Seeds scenario ══════════════════════════════════════ */}
            {stepKey === 'seeds_scenario' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Quel est votre objectif ?
                </h2>

                {/* Objectives */}
                <div className="space-y-2">
                  {SEED_OBJECTIVES.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => {
                        setSeedObjective(obj.id)
                        setMainSolidDose(obj.dosage.toString(), 'g/m2')
                        // Les conditions de gazon n'ont pas de sens pour création/réparation
                        if (obj.id !== 'regarnissage') setLawnCondition(null)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        seedObjective === obj.id
                          ? 'border-hanami-500 bg-hanami-100/40'
                          : 'border-stone-100 bg-white hover:border-stone-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{obj.label}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{obj.desc}</p>
                      </div>
                      <span className={`text-sm font-semibold font-[family-name:var(--font-space-mono)] ml-4 shrink-0 ${
                        seedObjective === obj.id ? 'text-hanami-700' : 'text-stone-300'
                      }`}>
                        {obj.range}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Lawn condition — uniquement en mode Regarnissage */}
                {seedObjective === 'regarnissage' && (
                  <div>
                    <p className="text-xs font-medium text-stone-500 mb-2.5">
                      Comment est votre gazon actuellement ?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {LAWN_CONDITIONS.map((cond) => (
                        <button
                          key={cond.id}
                          onClick={() => {
                            setLawnCondition(cond.id)
                            setMainSolidDose(cond.dosage.toString(), 'g/m2')
                          }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            lawnCondition === cond.id
                              ? 'border-hanami-500 bg-hanami-100/40'
                              : 'border-stone-100 bg-white hover:border-stone-200'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: cond.color }} />
                          <p className="text-xs font-medium text-stone-700 text-center leading-tight">{cond.label}</p>
                          <span className={`text-xs font-[family-name:var(--font-space-mono)] font-semibold ${
                            lawnCondition === cond.id ? 'text-hanami-700' : 'text-stone-300'
                          }`}>
                            {cond.dosage} g/m²
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={goNext}
                  disabled={!seedObjective}
                  className={btnPrimary}
                >
                  Continuer →
                </button>
              </div>
            )}

            {/* ══ STEP: Fertilizer scenario ════════════════════════════════ */}
            {stepKey === 'fertilizer_scenario' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                    À quelle fréquence appliquez-vous de l'engrais ?
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Plus vous fractionnez, moins vous dosez à chaque passage.
                  </p>
                </div>

                <div className="space-y-2">
                  {FERT_SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setFertScenario(s.id)
                        setMainSolidDose(s.dosage.toString(), 'g/m2')
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        fertScenario === s.id
                          ? 'border-hanami-500 bg-hanami-100/40'
                          : 'border-stone-100 bg-white hover:border-stone-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{s.label}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{s.desc}</p>
                      </div>
                      <span className={`text-sm font-semibold font-[family-name:var(--font-space-mono)] ml-4 shrink-0 ${
                        fertScenario === s.id ? 'text-hanami-700' : 'text-stone-300'
                      }`}>
                        {s.range}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={!fertScenario}
                  className={btnPrimary}
                >
                  Continuer →
                </button>
              </div>
            )}

            {/* ══ STEP: Dosage (solid — seeds + fertilizer) ════════════════ */}
            {stepKey === 'dosage' && productType !== 'liquid' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  {productType === 'seeds' ? 'Confirmer le dosage' : 'Dosage des produits'}
                </h2>

                <div className="space-y-3">
                  {/* Seeds info */}
                  {productType === 'seeds' && (
                    <div className="bg-hanami-100/60 border border-hanami-500/20 rounded-lg p-3 flex gap-2">
                      <Info className="w-4 h-4 text-hanami-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-hanami-900">
                        Regarnissage : 10–20 g/m² · Création : 25–40 g/m² · Respectez toujours le fabricant.
                      </p>
                    </div>
                  )}

                  {/* Liste des produits — chacun a son nom + sa dose individuelle.
                      En mode reverse, seul le 1er produit est éditable (basé sur stock). */}
                  <div className="space-y-2.5">
                    {solidProducts.map((p, idx) => {
                      const isReverseProduct = reverseMode && idx === 0
                      return (
                        <div key={p.id} className="border border-stone-200 rounded-xl p-3 bg-white space-y-2.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-stone-700">
                              Produit {idx + 1}
                              {solidProducts.length > 1 && (
                                <span className="ml-1 text-[10px] text-stone-400 font-normal">
                                  (appliqué séparément, même surface)
                                </span>
                              )}
                            </p>
                            {solidProducts.length > 1 && !reverseMode && (
                              <button
                                type="button"
                                onClick={() => removeSolidProduct(p.id)}
                                aria-label={`Retirer le produit ${idx + 1}`}
                                className="text-stone-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-stone-500 mb-1">Nom du produit</label>
                            <ProductAutocomplete
                              value={p.name}
                              onChange={(v) => updateSolidProduct(p.id, { name: v, catalogProductId: undefined, catalogUsageId: undefined })}
                              onSelect={(prod: { id: string; name: string; brand: string; hint: string; raw: SolidCatalogProduct }) => {
                                // Auto-remplissage : nom + dose de l'usage par défaut du catalogue
                                const u = getDefaultSolidUsage(prod.raw)
                                updateSolidProduct(p.id, {
                                  name: prod.raw.name,
                                  dose: String(u.doseG_m2),
                                  doseUnit: 'g/m2',
                                  catalogProductId: prod.raw.id,
                                  catalogUsageId: u.id,
                                })
                              }}
                              search={(q, limit) => {
                                const cat = productType === 'seeds' ? 'seeds' : 'fertilizer'
                                return searchSolidCatalog(q, limit, cat).map(prod => {
                                  const u = getDefaultSolidUsage(prod)
                                  return {
                                    id: prod.id,
                                    name: prod.name,
                                    brand: prod.brand,
                                    hint: `Dès ${u.doseG_m2} g/m²`,
                                    raw: prod,
                                  }
                                })
                              }}
                              placeholder={
                                productType === 'seeds'
                                  ? (idx === 0 ? 'Ex : Barenbrug Pro 12' : 'Ex : RES+ RPR')
                                  : (idx === 0 ? 'Ex : Floranid Twin Permanent' : 'Ex : Bacteriosol Universel')
                              }
                              inputClass={`w-full px-3 py-2 ${inputCls}`}
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-stone-500 mb-1">
                              Dosage {isReverseProduct ? '(calculé depuis le stock)' : 'recommandé'}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number" inputMode="decimal" step="1"
                                value={p.dose}
                                onChange={(e) => updateSolidProduct(p.id, { dose: e.target.value })}
                                disabled={isReverseProduct}
                                className={`flex-1 px-3 py-2 ${inputCls} ${isReverseProduct ? 'opacity-60' : ''}`}
                                placeholder="Ex : 30"
                              />
                              <select
                                value={p.doseUnit}
                                onChange={(e) => updateSolidProduct(p.id, { doseUnit: e.target.value as 'g/m2' | 'kg/ha' })}
                                disabled={isReverseProduct}
                                className={`px-2 py-2 ${inputCls} ${isReverseProduct ? 'opacity-60' : ''}`}
                              >
                                <option value="g/m2">g/m²</option>
                                <option value="kg/ha">kg/ha</option>
                              </select>
                            </div>

                            {/* Usage switcher — affiché si le produit vient du catalogue Hanami */}
                            {p.catalogProductId && (() => {
                              const cp = SOLID_CATALOG.find(c => c.id === p.catalogProductId)
                              if (!cp) return null
                              return (
                                <UsageSwitcher
                                  usages={cp.usages.map(u => ({
                                    id: u.id,
                                    label: u.label,
                                    doseDisplay: `${u.doseG_m2} g/m²`,
                                    note: u.note,
                                  }))}
                                  selectedId={p.catalogUsageId ?? cp.defaultUsageId}
                                  onChange={(newUsageId) => {
                                    const u = cp.usages.find(x => x.id === newUsageId)
                                    if (!u) return
                                    updateSolidProduct(p.id, {
                                      dose: String(u.doseG_m2),
                                      doseUnit: 'g/m2',
                                      catalogUsageId: newUsageId,
                                    })
                                  }}
                                />
                              )
                            })()}
                          </div>
                        </div>
                      )
                    })}

                    {/* Bouton ajouter — caché en mode reverse (1 seul produit) */}
                    {!reverseMode && (
                      <button
                        type="button"
                        onClick={addSolidProduct}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-sm font-medium text-stone-500 hover:border-hanami-500 hover:text-hanami-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un produit
                      </button>
                    )}
                  </div>

                  {/* Warning sur le produit 1 */}
                  {getWarning() && (
                    <div className={`flex items-start gap-2 p-3 rounded-lg border text-xs ${
                      getWarning()!.type === 'error'   ? 'bg-red-50 border-red-200 text-red-800'     :
                      getWarning()!.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                         'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {getWarning()!.message}
                    </div>
                  )}

                  {/* Reverse mode toggle */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-hanami-100/60 border border-hanami-500/20 rounded-lg">
                    <input
                      type="checkbox" checked={reverseMode}
                      onChange={(e) => { setReverseMode(e.target.checked); if (e.target.checked) setSelectedZones(zones.map((_, i) => i)) }}
                      className="w-4 h-4 accent-hanami-700 rounded shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-stone-700 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 shrink-0" /> Calcul inversé</p>
                      <p className="text-xs text-stone-500">Calculer avec votre stock (un seul produit)</p>
                    </div>
                  </label>

                  {/* Reverse mode fields */}
                  {reverseMode && (
                    <div className="space-y-3 border-l-4 border-hanami-500/30 pl-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Quantité en stock</label>
                        <div className="flex gap-2">
                          <input type="number" inputMode="decimal" step="1" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className={`flex-1 px-3 py-2 ${inputCls}`} placeholder="Ex : 3" />
                          <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value)} className={`px-2 py-2 ${inputCls}`}>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                      </div>
                      {zones.length > 1 && (
                        <ZoneSelector zones={zones} selectedZones={selectedZones} onToggle={toggleZoneSelection} selectedSurface={getSelectedSurface()} inputCls={inputCls} />
                      )}
                      {stockQuantity && getDosageAlert() && <DosageAlert alert={getDosageAlert()!} />}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (reverseMode && stockQuantity) {
                      const newDose = calculateReverseDosage().toString()
                      setMainSolidDose(newDose, 'g/m2')
                    }
                    calculateResults()
                  }}
                  disabled={(() => {
                    if (reverseMode) return !stockQuantity || selectedZones.length === 0
                    return solidProducts.some(p => !p.dose || parseFloat(p.dose) <= 0)
                  })()}
                  className={btnPrimary}
                >
                  Calculer les quantités
                </button>
              </div>
            )}

            {/* ══ STEP: Dosage (liquid) — multi-produits ═══════════════════ */}
            {stepKey === 'dosage' && productType === 'liquid' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Dosage des produits liquides
                </h2>

                <div className="space-y-3">
                  {/* Mode toggle */}
                  <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
                    {[{ v: false, l: 'Simplifié' }, { v: true, l: 'Expert' }].map(({ v, l }) => (
                      <button key={String(v)} onClick={() => setExpertMode(v)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${expertMode === v ? 'bg-white text-hanami-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>{v && <Settings className="w-3.5 h-3.5" />}{l}</button>
                    ))}
                  </div>

                  {!reverseMode ? (
                    <>
                      {!expertMode ? (
                        <div className="bg-hanami-100/60 border border-hanami-500/20 rounded-lg p-3">
                          <p className="text-xs text-hanami-900">Mode simplifié : calcul basé sur 10L de bouillie / 100m² (vitesse de marche normale).</p>
                        </div>
                      ) : null}

                      {/* Liste des produits — chacun avec son nom + sa dose.
                          Tous sont mélangés dans le même pulvérisateur. */}
                      <div className="space-y-2.5">
                        {liquidProducts.map((p, idx) => (
                          <div key={p.id} className="border border-stone-200 rounded-xl p-3 bg-white space-y-2.5">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-stone-700">
                                Produit {idx + 1}
                                {liquidProducts.length > 1 && (
                                  <span className="ml-1 text-[10px] text-stone-400 font-normal">
                                    (mélangé dans le pulvérisateur)
                                  </span>
                                )}
                              </p>
                              {liquidProducts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLiquidProduct(p.id)}
                                  aria-label={`Retirer le produit ${idx + 1}`}
                                  className="text-stone-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-stone-500 mb-1">Nom du produit</label>
                              <ProductAutocomplete
                                value={p.name}
                                onChange={(v) => updateLiquidProduct(p.id, { name: v, catalogProductId: undefined, catalogUsageId: undefined })}
                                onSelect={(prod: { id: string; name: string; brand: string; hint: string; raw: LiquidCatalogProduct }) => {
                                  const u = getDefaultLiquidUsage(prod.raw)
                                  updateLiquidProduct(p.id, {
                                    name: prod.raw.name,
                                    doseSimple: String(u.doseMl_L),
                                    doseExpert: String(u.doseL_ha),
                                    catalogProductId: prod.raw.id,
                                    catalogUsageId: u.id,
                                  })
                                  // Pré-remplit la bouillie experte depuis la fiche.
                                  // (bouillie partagée par le mélange : la dernière sélection l'emporte)
                                  if (u.bouillieL_ha) setSprayVolume(String(u.bouillieL_ha))
                                }}
                                search={(q, limit) => searchLiquidCatalog(q, limit).map(prod => {
                                  const u = getDefaultLiquidUsage(prod)
                                  return {
                                    id: prod.id,
                                    name: prod.name,
                                    brand: prod.brand,
                                    hint: `${u.doseL_ha} L/ha`,
                                    raw: prod,
                                  }
                                })}
                                placeholder={idx === 0 ? 'Ex : H2Pro Trismart' : 'Ex : Vitalnova StressBuster'}
                                inputClass={`w-full px-3 py-2 ${inputCls}`}
                              />
                            </div>

                            {!expertMode ? (
                              <div>
                                <label className="block text-[11px] font-medium text-stone-500 mb-1">Dose recommandée</label>
                                <div className="relative">
                                  <input
                                    type="number" inputMode="decimal" step="1"
                                    value={p.doseSimple}
                                    onChange={(e) => updateLiquidProduct(p.id, { doseSimple: e.target.value })}
                                    className={`w-full px-3 py-2 pr-14 ${inputCls}`}
                                    placeholder="Ex : 10"
                                  />
                                  <span className="absolute right-3 top-2 text-xs text-stone-400">ml/L</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Dose produit pur (L/ha)</label>
                                  <input
                                    type="number" inputMode="decimal" step="1"
                                    value={p.doseExpert}
                                    onChange={(e) => updateLiquidProduct(p.id, { doseExpert: e.target.value })}
                                    className={`w-full px-3 py-2 ${inputCls}`}
                                    placeholder="Ex : 10"
                                  />
                                </div>
                                {p.doseExpert && sprayVolume && (
                                  <div className="bg-green-50 border border-green-100 rounded-lg p-2">
                                    <p className="text-[10px] text-green-600 mb-0.5">Concentration calculée</p>
                                    <p className="text-base font-bold text-hanami-700 font-[family-name:var(--font-space-mono)]">
                                      {((parseFloat(p.doseExpert) * 1000) / parseFloat(sprayVolume)).toFixed(1)} ml/L
                                    </p>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Usage switcher liquide — si le produit vient du catalogue */}
                            {p.catalogProductId && (() => {
                              const cp = LIQUID_CATALOG.find(c => c.id === p.catalogProductId)
                              if (!cp) return null
                              return (
                                <UsageSwitcher
                                  usages={cp.usages.map(u => ({
                                    id: u.id,
                                    label: u.label,
                                    doseDisplay: expertMode ? `${u.doseL_ha} L/ha` : `${u.doseMl_L} ml/L`,
                                    note: u.note,
                                  }))}
                                  selectedId={p.catalogUsageId ?? cp.defaultUsageId}
                                  onChange={(newUsageId) => {
                                    const u = cp.usages.find(x => x.id === newUsageId)
                                    if (!u) return
                                    updateLiquidProduct(p.id, {
                                      doseSimple: String(u.doseMl_L),
                                      doseExpert: String(u.doseL_ha),
                                      catalogUsageId: newUsageId,
                                    })
                                    if (u.bouillieL_ha) setSprayVolume(String(u.bouillieL_ha))
                                  }}
                                />
                              )
                            })()}
                          </div>
                        ))}

                        {/* Bouton "Ajouter un produit" */}
                        <button
                          type="button"
                          onClick={addLiquidProduct}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-sm font-medium text-stone-500 hover:border-hanami-500 hover:text-hanami-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter un produit au mélange
                        </button>
                      </div>

                      {/* Volume bouillie (mode expert seulement) + capacité pulvérisateur — partagés */}
                      {expertMode && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-stone-500">Volume de bouillie (et vitesse de marche)</label>
                            <button
                              onClick={() => setShowVolumeConverter(!showVolumeConverter)}
                              className={`text-xs font-medium transition-colors ${showVolumeConverter ? 'text-hanami-700' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                              {showVolumeConverter ? 'L/100m²' : 'L/ha'} ⇄
                            </button>
                          </div>
                          <SprayVolumeSelector value={sprayVolume} onChange={setSprayVolume} showL100={showVolumeConverter} />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Capacité pulvérisateur (L)</label>
                        <SprayerCapacitySelector value={sprayerCapacity} onChange={setSprayerCapacity} inputCls={inputCls} />
                      </div>
                    </>
                  ) : (
                    // Reverse liquid — un seul produit (le stock disponible)
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <p className="text-xs text-amber-700 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 shrink-0" /> Mode calcul inversé : un seul produit (votre stock).</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Nom du produit</label>
                        <input
                          type="text"
                          value={liquidProducts[0]?.name ?? ''}
                          onChange={(e) => updateLiquidProduct(liquidProducts[0]?.id ?? '', { name: e.target.value })}
                          className={`w-full px-3 py-2 ${inputCls}`}
                          placeholder="Ex : H2Pro Trismart"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Stock disponible</label>
                        <div className="flex gap-2">
                          <input type="number" inputMode="decimal" step="1" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className={`flex-1 px-3 py-2 ${inputCls}`} placeholder="Ex : 5" />
                          <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value)} className={`px-2 py-2 ${inputCls}`}>
                            <option value="L">L</option>
                            <option value="ml">ml</option>
                          </select>
                        </div>
                      </div>
                      <SprayVolumeSelector value={sprayVolume} onChange={setSprayVolume} />
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Capacité pulvérisateur (L)</label>
                        <SprayerCapacitySelector value={sprayerCapacity} onChange={setSprayerCapacity} inputCls={inputCls} />
                      </div>
                      {zones.length > 1 && <ZoneSelector zones={zones} selectedZones={selectedZones} onToggle={toggleZoneSelection} selectedSurface={getSelectedSurface()} inputCls={inputCls} />}
                      {stockQuantity && getDosageAlert() && <DosageAlert alert={getDosageAlert()!} />}
                    </>
                  )}

                  {/* Reverse toggle */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-hanami-100/60 border border-hanami-500/20 rounded-lg">
                    <input type="checkbox" checked={reverseMode} onChange={(e) => { setReverseMode(e.target.checked); if (e.target.checked) setSelectedZones(zones.map((_, i) => i)) }} className="w-4 h-4 accent-hanami-700 rounded shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-700 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 shrink-0" /> Calcul inversé</p>
                      <p className="text-xs text-stone-500">Calculer avec votre stock (un seul produit)</p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (reverseMode && stockQuantity) calculateResults(calculateReverseDosage().toString(), sprayVolume)
                    else if (!expertMode) calculateResults(undefined, '1000')
                    else calculateResults()
                  }}
                  disabled={(() => {
                    if (reverseMode) return !stockQuantity || !sprayerCapacity || selectedZones.length === 0
                    if (!sprayerCapacity) return true
                    return liquidProducts.some(p => {
                      const v = expertMode ? p.doseExpert : p.doseSimple
                      return !v || parseFloat(v) <= 0
                    })
                  })()}
                  className={btnPrimary}
                >
                  Calculer les quantités
                </button>
              </div>
            )}

            {/* ══ STEP: Top dressing config ═════════════════════════════════ */}
            {stepKey === 'topdressing_config' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Configuration top dressing
                </h2>

                {/* Depth */}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-2">Profondeur d'application</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {TD_DEPTHS.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => { setTdDepth(d.id); setTdCustomDepth('') }}
                        className={`flex flex-col items-center gap-0.5 p-3 rounded-xl border-2 transition-all ${
                          tdDepth === d.id && !tdCustomDepth
                            ? 'border-hanami-500 bg-hanami-100/40'
                            : 'border-stone-100 bg-white hover:border-stone-200'
                        }`}
                      >
                        <span className="text-lg font-bold font-[family-name:var(--font-space-mono)] text-stone-800">{d.label}</span>
                        <span className="text-xs text-stone-400 text-center leading-tight">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="number" inputMode="decimal" step="1" min="1"
                      placeholder="Ou entrez une profondeur personnalisée (mm)"
                      value={tdCustomDepth}
                      onChange={(e) => { setTdCustomDepth(e.target.value); setTdDepth('custom') }}
                      className={`w-full px-3 py-2 pr-10 ${inputCls}`}
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-400">mm</span>
                  </div>
                  {/* Show selected depth hint */}
                  {!tdCustomDepth && tdDepth !== 'custom' && (
                    <p className="text-xs text-stone-400 mt-1.5">
                      {TD_DEPTHS.find(d => d.id === tdDepth)?.detail}
                    </p>
                  )}

                  {/* Depth warning */}
                  {getTdDepthWarning() && (() => {
                    const w = getTdDepthWarning()!
                    return (
                      <div className={`mt-2 flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                        w.type === 'success'
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : w.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        {w.type === 'success'
                          ? <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        }
                        <div>
                          <p className="font-semibold mb-0.5">{w.title}</p>
                          <p className="leading-relaxed">{w.message}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Material */}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-2">Matériau</label>
                  <div className="space-y-1.5">
                    {TD_MATERIALS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setTdMaterial(m.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                          tdMaterial === m.id
                            ? 'border-hanami-500 bg-hanami-100/40'
                            : 'border-stone-100 bg-white hover:border-stone-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-stone-800">{m.label}</p>
                          <p className="text-xs text-stone-400">{m.desc}</p>
                        </div>
                        {tdMaterial === m.id && <div className="w-2 h-2 rounded-full bg-hanami-700 shrink-0 ml-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Taille des sacs */}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    Contenance de vos sacs
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {['25', '40', '50'].map(s => (
                        <button
                          key={s} type="button"
                          onClick={() => setTdBagSize(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            tdBagSize === s ? 'bg-hanami-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {s} L
                        </button>
                      ))}
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number" inputMode="decimal" step="1" min="1"
                        placeholder="Autre"
                        value={['25', '40', '50'].includes(tdBagSize) ? '' : tdBagSize}
                        onChange={(e) => e.target.value && setTdBagSize(e.target.value)}
                        className={`w-full px-3 py-1.5 pr-5 text-xs ${inputCls}`}
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-stone-400">L</span>
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                {getTotalSurface() > 0 && (tdCustomDepth || tdDepth !== 'custom') && (
                  <div className="bg-hanami-100/40 border border-hanami-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500 mb-0.5">Estimation préliminaire</p>
                      <p className="text-2xl font-bold text-hanami-700 font-[family-name:var(--font-space-mono)]">
                        {(getTotalSurface() * parseFloat(tdCustomDepth || tdDepth)).toFixed(0)} L
                      </p>
                      <p className="text-xs text-stone-400 font-[family-name:var(--font-space-mono)] mt-0.5">
                        {((getTotalSurface() * parseFloat(tdCustomDepth || tdDepth)) / 1000).toFixed(2)} m³
                      </p>
                    </div>
                    <div className="text-right text-xs text-stone-400 space-y-0.5">
                      <p>{getTotalSurface().toFixed(0)} m²</p>
                      <p>× {tdCustomDepth || tdDepth} mm</p>
                      <p>≈ {Math.ceil((getTotalSurface() * parseFloat(tdCustomDepth || tdDepth)) / (parseFloat(tdBagSize) || 40))} sacs {tdBagSize || '40'}L</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => calculateResults()}
                  disabled={!tdCustomDepth && tdDepth === 'custom'}
                  className={btnPrimary}
                >
                  Calculer
                </button>
              </div>
            )}

            {/* ══ STEP: Results ═════════════════════════════════════════════ */}
            {stepKey === 'results' && results && (
              <div className="space-y-4">
                <div className="no-print flex items-center justify-between">
                  <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                    Résultats
                  </h2>
                  {(() => {
                    let label: string | null = null
                    if (productType === 'liquid') {
                      label = liquidProducts.length > 1
                        ? `Mélange · ${liquidProducts.length} produits`
                        : (liquidProducts[0]?.name || null)
                    } else if (productType === 'seeds' || productType === 'fertilizer') {
                      label = solidProducts.length > 1
                        ? `${solidProducts.length} produits`
                        : (solidProducts[0]?.name || null)
                    }
                    return label ? (
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full truncate max-w-[160px]">
                        {label}
                      </span>
                    ) : null
                  })()}
                </div>

                {/* ── Results content (screenshottable + imprimable) ── */}
                <div ref={resultsRef} className="results-container results-print space-y-3">

                  {/* ── Header export — visible aussi à l'écran, donne un aspect "document" ── */}
                  <div className="bg-gradient-to-br from-hanami-900 to-hanami-700 rounded-xl p-4 text-white relative overflow-hidden">
                    {/* Logo herbe en filigrane derrière */}
                    <svg viewBox="0 0 32 32" className="absolute -right-2 -bottom-2 w-24 h-24 opacity-10" aria-hidden="true">
                      <path d="M9 28 C8 21 7 13 9.5 6 C11 13 11.5 21 11.5 28 Z" fill="white" />
                      <path d="M15 28 C14 19 14.5 10 16 2 C17.5 10 18 19 17 28 Z" fill="white" />
                      <path d="M20.5 28 C20 21 21 14 22.5 8 C24 14 24.5 21 23.5 28 Z" fill="white" />
                    </svg>
                    <div className="relative">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-200">
                          Plan de dosage
                        </span>
                        <span className="text-[10px] text-white/60 font-[family-name:var(--font-space-mono)]">
                          {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold mt-1 leading-tight">
                        Hanami · Dosage Intelligent
                      </h2>
                      {/* Ligne de configuration : type + scénario + état */}
                      <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
                        <span className="font-[family-name:var(--font-space-mono)] font-semibold text-amber-200">
                          {getTotalSurface().toFixed(0)} m²
                        </span>
                        {results.type === 'solid' && productType === 'seeds' && (
                          <>
                            <span>Semences</span>
                            {seedObjective && (
                              <span>{SEED_OBJECTIVES.find(o => o.id === seedObjective)?.label}</span>
                            )}
                            {lawnCondition && (
                              <span>État : {LAWN_CONDITIONS.find(c => c.id === lawnCondition)?.label}</span>
                            )}
                          </>
                        )}
                        {results.type === 'solid' && productType === 'fertilizer' && (
                          <span>Engrais</span>
                        )}
                        {results.type === 'liquid' && (
                          <>
                            <span>Liquide{results.products.length > 1 ? ` · mélange ${results.products.length} produits` : ''}</span>
                            <span>{expertMode ? 'Mode expert' : 'Mode simplifié'}</span>
                            <span>Pulvérisateur {sprayerCapacity} L</span>
                          </>
                        )}
                        {results.type === 'topdressing' && (
                          <>
                            <span>Top dressing</span>
                            <span>{tdCustomDepth || tdDepth} mm</span>
                            <span>{TD_MATERIALS.find(m => m.id === tdMaterial)?.label}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Solid (seeds + fertilizer) — multi-produits ── */}
                  {results.type === 'solid' && (
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          {results.products.length > 1
                            ? 'Appliquez chaque produit en passes croisées (2–3 passages) pour une répartition homogène.'
                            : 'Épandez en passes croisées à réglage faible (2–3 passages) pour une répartition homogène.'}
                        </p>
                      </div>

                      {/* Total — détail par produit si plusieurs */}
                      <div className="bg-hanami-900 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-hanami-100/50 uppercase tracking-wider mb-2">
                              {results.products.length > 1 ? 'Quantités totales' : 'Quantité totale'}
                            </p>
                            <ul className="space-y-1.5">
                              {results.products.map((p, i) => (
                                <li key={i}>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white font-[family-name:var(--font-space-mono)]">
                                      {fmt(p.totalKg)}&nbsp;kg
                                    </span>
                                    <span className="text-xs text-hanami-100/70 truncate">{p.name}</span>
                                  </div>
                                  <p className="text-[10px] text-hanami-100/40 font-[family-name:var(--font-space-mono)]">
                                    {Math.round(parseFloat(p.dosePerM2))} g/m²
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-xs text-hanami-100/50 shrink-0">{results.totalSurface} m²</p>
                        </div>
                      </div>

                      {/* Zone detail */}
                      {results.zones.length > 1 && (
                        <div className="border border-stone-100 rounded-xl overflow-hidden">
                          <div className="px-3 py-2 bg-stone-50 border-b border-stone-100">
                            <p className="text-xs font-medium text-stone-500">Détail par zone</p>
                          </div>
                          <div className="divide-y divide-stone-50">
                            {results.zones.map((z, i) => (
                              <div key={i} className="px-3 py-2.5 flex gap-3 items-start">
                                {z.photo && (
                                  <button
                                    type="button"
                                    onClick={() => setLightbox({ src: z.photo!.dataUrl, caption: z.name })}
                                    className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-stone-100 cursor-zoom-in"
                                    aria-label={`Voir la photo de ${z.name}`}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={z.photo.dataUrl} alt={z.name} className="w-full h-full object-cover" />
                                  </button>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-stone-800 truncate">{z.name}</p>
                                    <p className="text-xs text-stone-400 shrink-0 ml-2">{z.surface} m²</p>
                                  </div>
                                  <ul className="space-y-0.5">
                                    {z.productsQuantities.map((pq, j) => (
                                      <li key={j} className="flex items-center justify-between text-xs">
                                        <span className="text-stone-500 truncate">{pq.name}</span>
                                        <span className="font-semibold text-hanami-700 font-[family-name:var(--font-space-mono)] shrink-0 ml-2">
                                          {fmt(pq.quantity)} kg
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Liquid (multi-produits) ── */}
                  {results.type === 'liquid' && (
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          {results.products.length > 1
                            ? 'Mélangez tous les produits dans la même bouillie. Vérifiez la compatibilité chimique avant.'
                            : 'Utilisez un traceur bleu pour éviter les doubles passages.'}
                        </p>
                      </div>

                      {/* Summary banner — total + détail par produit si plusieurs */}
                      <div className="bg-hanami-900 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-hanami-100/50 uppercase tracking-wider mb-2">
                              {results.products.length > 1 ? 'Mélange à préparer' : 'Produit nécessaire'}
                            </p>
                            <ul className="space-y-1">
                              {results.products.map((p, i) => (
                                <li key={i} className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-white font-[family-name:var(--font-space-mono)]">
                                    {fmt(p.totalAmount)}&nbsp;{p.totalUnit}
                                  </span>
                                  <span className="text-xs text-hanami-100/70 truncate">{p.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right text-xs text-hanami-100/50 space-y-0.5 shrink-0">
                            <p>{results.totalSurface} m²</p>
                            <p>{fmt(results.totalSprayVolume)} L bouillie</p>
                            <p>{results.numberOfFills} {plural(results.numberOfFills, 'plein')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Zone tabs */}
                      {results.zones.length > 1 && (
                        <div className="no-print flex gap-1.5 flex-wrap">
                          <button
                            onClick={() => setActiveZoneTab('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              activeZoneTab === 'all'
                                ? 'bg-hanami-700 text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            Toutes zones
                          </button>
                          {results.zones.map((z, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveZoneTab(i)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                activeZoneTab === i
                                  ? 'bg-hanami-700 text-white'
                                  : zonesDone.has(i)
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {zonesDone.has(i) ? '✓ ' : ''}{z.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Zone cards */}
                      <div className="space-y-3">
                        {(activeZoneTab === 'all' ? results.zones : [results.zones[activeZoneTab as number]]).map((z, idx) => {
                          const zoneIndex  = activeZoneTab === 'all' ? idx : (activeZoneTab as number)
                          const isDone     = zonesDone.has(zoneIndex)
                          const timerVal   = zoneTimers[zoneIndex] || 0
                          const isRunning  = !!timerRefs.current[zoneIndex]
                          const cap        = parseFloat(sprayerCapacity) || 15
                          const zFills     = parseFloat(z.fills)
                          const zFullFills = Math.floor(zFills)
                          const zPartial   = zFills - zFullFills

                          return (
                            <div
                              key={zoneIndex}
                              className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
                            >
                              {/* Header — photo miniature à gauche, nom à droite */}
                              <div className="px-5 py-4 flex items-start gap-3">
                                {z.photo && (
                                  <button
                                    type="button"
                                    onClick={() => setLightbox({ src: z.photo!.dataUrl, caption: z.name })}
                                    aria-label={`Voir la photo de ${z.name}`}
                                    className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-stone-100 cursor-zoom-in border border-stone-200"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={z.photo.dataUrl} alt={z.name} className="w-full h-full object-cover" />
                                  </button>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-base text-stone-900 leading-tight truncate" style={{ fontFamily: 'var(--font-fraunces)' }}>
                                    {z.name}
                                  </p>
                                  <p className="text-sm text-stone-400 mt-0.5">{z.surface} m²</p>
                                </div>
                                {isDone ? (
                                  <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-lg shrink-0">
                                    ✓ Terminé
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => markDone(zoneIndex)}
                                    className="no-print shrink-0 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                                  >
                                    Terminé
                                  </button>
                                )}
                              </div>

                              {/* Eau */}
                              <div className="mx-4 mb-3 bg-hanami-100/60 border border-hanami-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
                                <Droplets className="w-4 h-4 text-hanami-500 shrink-0" />
                                <p className="text-sm text-hanami-900">
                                  Eau : <strong className="font-[family-name:var(--font-space-mono)]">{fmt(z.waterAmount)} L</strong>
                                </p>
                              </div>

                              {/* Produits — un bloc par produit du mélange */}
                              <div className="mx-4 mb-3 bg-stone-50 rounded-xl px-4 py-3 space-y-2.5">
                                {z.productsAmounts.map((pa, i) => (
                                  <div key={i} className={i > 0 ? 'pt-2.5 border-t border-stone-200/70' : ''}>
                                    <p className="text-xs text-stone-400 mb-0.5">{pa.name || `Produit ${i + 1}`}</p>
                                    <p className="text-lg font-bold text-hanami-900 font-[family-name:var(--font-space-mono)]">
                                      {fmt(pa.amount)} {pa.unit}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Pulvérisateur */}
                              <div className="mx-4 mb-4 bg-stone-50 rounded-xl px-4 py-3 flex items-center gap-4">
                                <div className="flex gap-1.5 items-end shrink-0">
                                  {zFullFills > 0 && Array.from({ length: Math.min(zFullFills, 3) }).map((_, i) => (
                                    <SprayerIcon key={i} fill={1} id={`z${zoneIndex}-f${i}`} />
                                  ))}
                                  {zFullFills > 3 && (
                                    <span className="text-xs text-stone-400 self-center pb-2">+{zFullFills - 3}</span>
                                  )}
                                  {zPartial > 0.02 && <SprayerIcon fill={zPartial} id={`z${zoneIndex}-p`} />}
                                  {zFills < 0.02 && <SprayerIcon fill={0.1} id={`z${zoneIndex}-e`} />}
                                </div>
                                <div>
                                  <p className="text-base font-bold text-stone-900 font-[family-name:var(--font-space-mono)]">
                                    {fmt(zFills)} {plural(zFills, 'plein')}
                                  </p>
                                  <p className="text-xs text-stone-400 mt-0.5">{fmt(z.sprayVolume)} L de bouillie</p>
                                </div>
                              </div>

                              {/* Chronomètre (no-print) */}
                              <div className="no-print px-4 pb-4">
                                {!isDone ? (
                                  <button
                                    onClick={() => isRunning ? stopTimer(zoneIndex) : startTimer(zoneIndex)}
                                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                                      isRunning
                                        ? 'bg-hanami-100/60 text-hanami-700 border border-hanami-500/20'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                                  >
                                    {isRunning
                                      ? <><Timer className="w-4 h-4" /> {formatTimer(timerVal)}</>
                                      : timerVal > 0
                                        ? <><Play className="w-4 h-4" /> Reprendre · {formatTimer(timerVal)}</>
                                        : <><Timer className="w-4 h-4" /> Lancer le chronomètre</>
                                    }
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setZonesDone(prev => { const next = new Set(prev); next.delete(zoneIndex); return next })
                                      setZoneTimers(prev => { const next = { ...prev }; delete next[zoneIndex]; return next })
                                    }}
                                    className="w-full py-2.5 rounded-xl text-sm font-medium text-stone-400 bg-stone-50 hover:bg-stone-100 transition-colors"
                                  >
                                    Recommencer cette zone
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Recette — par plein complet, ou pour la bouillie totale si
                          elle tient dans un seul plein partiel (afficher la recette
                          d'un plein COMPLET surdoserait alors la préparation). */}
                      {(() => {
                        const cap       = parseFloat(sprayerCapacity) || 15
                        const totalVol  = parseFloat(results.totalSprayVolume)
                        const n         = results.numberOfFills
                        const lastVol   = totalVol - (n - 1) * cap
                        const isPartial = n > 1 && lastVol < cap * 0.98
                        const singlePartial = n === 1 && totalVol < cap * 0.98

                        const parseMl = (amount: string | number, unit: string) =>
                          unit === 'L' ? parseFloat(amount.toString()) * 1000 : parseFloat(amount.toString())

                        // Quantité de chaque produit dans la recette affichée
                        const recipeProducts = results.products.map(p => ({
                          name: p.name,
                          ml: singlePartial
                            ? parseMl(p.totalAmount, p.totalUnit)
                            : parseMl(p.perFillAmount, p.perFillUnit),
                        }))
                        const recipeVol = singlePartial ? totalVol : cap
                        const water = Math.max(0, recipeVol - recipeProducts.reduce((s, p) => s + p.ml, 0) / 1000)

                        // Doses du dernier plein partiel = concentration × son volume
                        const partialProducts = isPartial
                          ? results.products.map(p => ({
                              name: p.name,
                              ...fmtLiquid(parseMl(p.perFillAmount, p.perFillUnit) * lastVol / cap),
                            }))
                          : []

                        return (
                          <div className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                            <p className="text-xs font-medium text-stone-600 mb-3">
                              {singlePartial
                                ? `Recette pour votre bouillie (${fmt(totalVol, 1)} L)`
                                : `Recette par plein complet (${sprayerCapacity} L)`}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {recipeProducts.map((p, i) => {
                                const f = fmtLiquid(p.ml)
                                return (
                                  <div key={i} className="bg-white border border-stone-100 rounded-lg px-3 py-2.5">
                                    <p className="text-[10px] text-stone-400 mb-0.5 flex items-center gap-1"><FlaskConical className="w-3 h-3 shrink-0" /><span className="truncate">{p.name}</span></p>
                                    <p className="text-sm font-semibold text-hanami-700 font-[family-name:var(--font-space-mono)]">
                                      {fmt(f.value)} {f.unit}
                                    </p>
                                  </div>
                                )
                              })}
                              <div className="bg-white border border-stone-100 rounded-lg px-3 py-2.5">
                                <p className="text-[10px] text-stone-400 mb-0.5 flex items-center gap-1"><Droplets className="w-3 h-3 shrink-0" /> {singlePartial ? 'Eau' : 'Eau / plein'}</p>
                                <p className="text-sm font-semibold text-hanami-700 font-[family-name:var(--font-space-mono)]">
                                  {fmt(water, 1)} L
                                </p>
                              </div>
                            </div>
                            {isPartial && (
                              <p className="text-[10px] text-stone-400 mt-2 italic">
                                Dernier plein partiel ({fmt(lastVol, 1)} L de bouillie) :{' '}
                                {partialProducts.map(p => `${fmt(p.value)} ${p.unit} de ${p.name}`).join(' · ')}, complété d&apos;eau
                              </p>
                            )}
                          </div>
                        )
                      })()}
                    </>
                  )}

                  {/* ── Top dressing ── */}
                  {results.type === 'topdressing' && (
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          Passez à l'aérateur ou au scarificateur avant application pour une meilleure pénétration.
                        </p>
                      </div>

                      <div className="bg-hanami-900 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-hanami-100/50 uppercase tracking-wider mb-1">Volume nécessaire</p>
                            <p className="text-3xl font-bold text-white font-[family-name:var(--font-space-mono)]">
                              {results.totalLitres.toFixed(0)} L
                            </p>
                            <p className="text-xs text-hanami-100/50 mt-0.5 font-[family-name:var(--font-space-mono)]">
                              {(results.totalLitres / 1000).toFixed(2)} m³
                            </p>
                          </div>
                          <div className="text-right text-xs text-hanami-100/50 space-y-0.5">
                            <p>{results.totalSurface} m²</p>
                            <p>à {results.depth} mm</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-hanami-100/50">{results.material}</span>
                          <span className="text-sm font-semibold text-hanami-100">
                            ≈ {results.bagsCount} sac{results.bagsCount > 1 ? 's' : ''} de {results.bagSize}L
                            <span className="text-xs font-normal text-hanami-100/50 ml-1">
                              / {(results.totalLitres / 1000).toFixed(2)} m³
                            </span>
                          </span>
                        </div>
                      </div>

                      {results.zones.length > 1 && (
                        <div className="border border-stone-100 rounded-xl overflow-hidden">
                          <div className="px-3 py-2 bg-stone-50 border-b border-stone-100">
                            <p className="text-xs font-medium text-stone-500">Détail par zone</p>
                          </div>
                          {results.zones.map((z, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-stone-50 last:border-b-0">
                              {z.photo && (
                                <button
                                  type="button"
                                  onClick={() => setLightbox({ src: z.photo!.dataUrl, caption: z.name })}
                                  aria-label={`Voir la photo de ${z.name}`}
                                  className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-stone-100 cursor-zoom-in border border-stone-200"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={z.photo.dataUrl} alt={z.name} className="w-full h-full object-cover" />
                                </button>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 truncate">{z.name}</p>
                                <p className="text-xs text-stone-400">{z.surface} m²</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-hanami-700 font-[family-name:var(--font-space-mono)] text-sm">{z.litres.toFixed(0)} L · {(z.litres / 1000).toFixed(2)} m³</p>
                                <p className="text-xs text-stone-400">≈ {Math.ceil(z.litres / results.bagSize)} sac{Math.ceil(z.litres / results.bagSize) > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Disclaimer ── */}
                  <p className="text-xs text-stone-400 leading-relaxed italic border-t border-stone-100 pt-3">
                    {DISCLAIMER}
                  </p>

                  {/* ── Footer enrichi pour exports PDF/PNG ─────────────────
                      Identité Hanami + coordonnées de contact + mention légale.
                      Le visiteur sait qui contacter, et le PDF est suffisant
                      en lui-même comme support à transmettre / archiver. */}
                  <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 mt-2">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <span
                        className="text-base font-semibold tracking-tight text-hanami-900"
                        style={{ fontFamily: 'var(--font-fraunces)' }}
                      >
                        Hanami.
                      </span>
                      <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-semibold tracking-[0.18em] uppercase text-hanami-500">
                        Expert Gazon
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-stone-600">
                      <a href="https://wa.me/33667277614" className="flex items-center gap-1.5 hover:text-hanami-700 transition-colors">
                        <span className="text-[#25D366]">●</span>
                        <span className="font-[family-name:var(--font-space-mono)]">06 67 27 76 14</span>
                      </a>
                      <a href="https://hanami-gazon.fr" className="flex items-center gap-1.5 hover:text-hanami-700 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-hanami-500 shrink-0" />
                        <span>hanami-gazon.fr</span>
                      </a>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2.5 pt-2.5 border-t border-stone-100 leading-relaxed">
                      Hanami · TROTT SASU · SIREN 891 868 143 · Le Vésinet, Île-de-France ·
                      Coaching agronomique partout en France
                    </p>
                  </div>
                </div>

                {/* ── Newsletter inline ── */}
                <div className="no-print bg-hanami-100/40 border border-hanami-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-hanami-900 mb-0.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0" /> Recevez nos protocoles saisonniers</p>
                  <p className="text-xs text-stone-500 mb-3">Conseils d'entretien, moments clés, nouveaux produits.</p>
                  {newsletterSubmitted ? (
                    <p className="text-xs text-hanami-700 font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5 shrink-0" /> Merci ! Vous êtes inscrit·e.</p>
                  ) : (
                    <form onSubmit={submitNewsletter} className="flex gap-2">
                      <input
                        type="email" required value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="votre@email.fr"
                        className={`flex-1 px-3 py-2 text-xs ${inputCls}`}
                      />
                      <button type="submit" className="px-3 py-2 bg-hanami-700 text-white text-xs font-medium rounded-lg hover:bg-hanami-900 transition-colors shrink-0">
                        S'inscrire
                      </button>
                    </form>
                  )}
                </div>

                <a
                  href="/#contact"
                  className="no-print block text-center text-xs text-stone-400 hover:text-hanami-700 transition-colors underline underline-offset-2"
                >
                  Vous voulez un protocole personnalisé ? Contactez-nous →
                </a>

                {/* ── Export + Reset ── */}
                <div className="no-print flex gap-2">
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="w-full py-2.5 px-4 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" /> Exporter
                    </button>
                    {showDownloadMenu && (
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-10">
                        <button
                          onClick={() => { downloadPDF(); setShowDownloadMenu(false) }}
                          className="w-full px-4 py-2.5 text-left hover:bg-stone-50 text-sm text-stone-700 border-b border-stone-100 flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Format PDF
                        </button>
                        <button
                          onClick={() => { downloadPNG(); setShowDownloadMenu(false) }}
                          className="w-full px-4 py-2.5 text-left hover:bg-stone-50 text-sm text-stone-700 flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Format PNG
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 px-4 bg-hanami-700 text-white rounded-lg hover:bg-hanami-900 text-sm font-medium transition-colors"
                  >
                    Nouveau calcul
                  </button>
                </div>

                {/* Les 2 boutons sont indépendants :
                    - "Enregistrer l'image" → tous les mobiles (iPhone + Android)
                    - "Partager via AirDrop" → appareils Apple (iPhone + Mac).
                    iPhone affiche donc les deux : enregistrer en local OU envoyer
                    via AirDrop à un autre appareil. Mac affiche uniquement AirDrop
                    (pour envoyer au téléphone qui sera utilisé sur le terrain). */}
                {isMobile && (
                  <button
                    onClick={saveToPhotos}
                    className="no-print w-full py-2.5 px-4 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <ImageDown className="w-4 h-4" /> Enregistrer l&apos;image
                  </button>
                )}
                {isApple && (
                  <button
                    onClick={saveToPhotos}
                    className="no-print w-full py-2.5 px-4 bg-stone-50 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-100 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    title="Ouvre la feuille de partage Apple (AirDrop, Messages, Photos…)"
                  >
                    <Share2 className="w-4 h-4" /> Partager via AirDrop
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Dev button — UNIQUEMENT en développement (jamais en prod).
                Clic = pré-remplit aléatoirement zones + type + produits + dose
                avec des valeurs réalistes du catalogue Hanami, et lance le
                calcul. Pratique pour tester rapidement le rendu des résultats. */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={prefillDev}
              title="Pré-remplir avec un scénario aléatoire"
              className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-md bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 transition-colors font-[family-name:var(--font-space-mono)]"
            >
              Dev
            </button>
          )}
        </div>

        {/* ── Disclaimer footer ──────────────────────────────────────────────── */}
        <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed px-4">
          Dosage Intelligent · Hanami · Pour des applications précises et responsables
        </p>
        <p className="text-center text-xs text-stone-300 mt-2 leading-relaxed px-4 italic">
          {DISCLAIMER}
        </p>
      </div>

      {/* Lightbox photo — affiché en overlay par-dessus tout, fermé par défaut.
          Préserve toujours le ratio d'origine via object-contain → zéro étirement. */}
      <PhotoLightbox
        src={lightbox?.src ?? null}
        caption={lightbox?.caption}
        onClose={() => setLightbox(null)}
      />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SprayerCapacitySelector({ value, onChange, inputCls }: { value: string; onChange: (v: string) => void; inputCls: string }) {
  const presets = ['5', '10', '15']
  const isPreset = presets.includes(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        {presets.map(p => (
          <button
            key={p} type="button"
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === p ? 'bg-hanami-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {p} L
          </button>
        ))}
      </div>
      <div className="relative flex-1">
        <input
          type="number" inputMode="decimal" step="0.5" min="1"
          placeholder="Autre"
          value={isPreset ? '' : value}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className={`w-full px-3 py-1.5 pr-5 text-xs ${inputCls}`}
        />
        <span className="absolute right-2 top-1.5 text-xs text-stone-400">L</span>
      </div>
    </div>
  )
}

function SprayVolumeSelector({ value, onChange, showL100 = false }: { value: string; onChange: (v: string) => void; showL100?: boolean }) {
  const opts = [
    { value: '400',  lha: '400 L/ha',  l100: '4 L/100m²',  speed: 'Rapide'      },
    { value: '500',  lha: '500 L/ha',  l100: '5 L/100m²',  speed: 'Normale'     },
    { value: '600',  lha: '600 L/ha',  l100: '6 L/100m²',  speed: 'Modérée'     },
    { value: '800',  lha: '800 L/ha',  l100: '8 L/100m²',  speed: 'Lente'       },
    { value: '1000', lha: '1000 L/ha', l100: '10 L/100m²', speed: 'Très lente'  },
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => (
        <button
          key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === o.value ? 'bg-hanami-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <div>{showL100 ? o.l100 : o.lha}</div>
          <div className="opacity-70">{o.speed}</div>
        </button>
      ))}
    </div>
  )
}

function ZoneSelector({
  zones, selectedZones, onToggle, selectedSurface, inputCls,
}: {
  zones: Zone[]; selectedZones: number[]; onToggle: (i: number) => void
  selectedSurface: number; inputCls: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-2">
        Zones à traiter ({selectedZones.length}/{zones.length})
      </label>
      <div className="space-y-1.5">
        {zones.map((zone, i) => (
          <button
            key={i} onClick={() => onToggle(i)}
            className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-left flex items-center justify-between text-xs ${
              selectedZones.includes(i) ? 'border-hanami-500 bg-hanami-100/30' : 'border-stone-100 bg-stone-50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                selectedZones.includes(i) ? 'bg-hanami-700 border-hanami-700' : 'border-stone-300'
              }`}>
                {selectedZones.includes(i) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium text-stone-700">{zone.name || `Zone ${i + 1}`}</span>
            </div>
            <span className="text-stone-400">{zone.surface} m²</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-stone-400 mt-1.5">
        Surface sélectionnée : <span className="font-semibold text-stone-600">{selectedSurface.toFixed(0)} m²</span>
      </p>
    </div>
  )
}

function SprayerIcon({ fill, id }: { fill: number; id: string }) {
  const h = 44
  const w = 26
  const innerH = h - 10
  const filledH = Math.round(innerH * Math.min(fill, 1))
  const clipId  = `sc-${id}`

  return (
    <svg width={w} height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} fill="none">
      {/* Corps */}
      <rect x="3" y="6" width={w - 6} height={h - 2} rx="4" fill="#E7E5E4" />
      {/* Liquide depuis le bas */}
      <clipPath id={clipId}>
        <rect x="3" y={6 + (innerH - filledH + 2)} width={w - 6} height={filledH + 4} rx="3" />
      </clipPath>
      <rect x="3" y="6" width={w - 6} height={h - 2} rx="4" fill="#93C5FD" clipPath={`url(#${clipId})`} />
      {/* Contour */}
      <rect x="3" y="6" width={w - 6} height={h - 2} rx="4" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Bouchon */}
      <rect x={w / 2 - 4} y="2" width="8" height="6" rx="2" fill="#CBD5E1" />
      {/* Bec verseur */}
      <path d={`M${w - 3} ${h / 2} Q${w + 4} ${h / 2} ${w + 2} ${h - 4}`} stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function DosageAlert({ alert }: {
  alert: { type: string; message: string; advice: string; suggestion?: string }
}) {
  return (
    <div className={`border rounded-lg p-3 text-xs ${
      alert.type === 'error'   ? 'bg-red-50 border-red-200 text-red-800'     :
      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                 'bg-green-50 border-green-200 text-green-800'
    }`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="font-medium">{alert.message}</p>
          <p>{alert.advice}</p>
          {alert.suggestion && <p>{alert.suggestion}</p>}
        </div>
      </div>
    </div>
  )
}

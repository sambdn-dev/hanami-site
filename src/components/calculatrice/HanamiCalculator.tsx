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
import { Plus, Trash2, AlertTriangle, Info, Calculator, Download, ChevronLeft, ImageDown } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type Zone = { name: string; surface: string }
type ProductType = 'seeds' | 'fertilizer' | 'liquid' | 'topdressing' | ''
type StepKey = 'zones' | 'type' | 'seeds_scenario' | 'fertilizer_scenario' | 'dosage' | 'topdressing_config' | 'results'

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

type SolidResults = {
  type: 'solid'
  totalSurface: number
  totalKg: string
  dosePerM2: string
  zones: Array<{ name: string; surface: number; quantity: string }>
  numberOfZones: number
}

type LiquidResults = {
  type: 'liquid'
  totalSurface: number
  totalSprayVolume: string
  totalProductAmount: string | number
  unit: string
  numberOfFills: number
  productPerFill: string | number
  productPerFillUnit: string
  zones: Array<{
    name: string; surface: number; sprayVolume: string
    productAmount: string | number; productUnit: string
    waterAmount: string; fills: string
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
  zones: Array<{ name: string; surface: number; litres: number }>
}

type Results = SolidResults | LiquidResults | TopdressingResults | null

// ── Disclaimer ────────────────────────────────────────────────────────────────

const DISCLAIMER =
  'Les indications portées sur cette calculatrice sont fournies à titre informatif uniquement. ' +
  'Respectez toujours les dosages indiqués par le fabricant. ' +
  'Ces résultats ne sauraient engager la responsabilité de Hanami.'

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
  const [productName, setProductName] = useState('')

  // ── Fertilizer scenario
  const [fertScenario, setFertScenario] = useState<string | null>(null)

  // ── Seeds scenario — Regarnissage sélectionné par défaut
  const [seedObjective, setSeedObjective]   = useState<string | null>('regarnissage')
  const [lawnCondition, setLawnCondition]   = useState<string | null>(null)

  // ── Dosage (solid)
  const [dosage, setDosage]           = useState('20')
  const [dosageUnit, setDosageUnit]   = useState('g/m2')
  const [reverseMode, setReverseMode] = useState(false)
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockUnit, setStockUnit]         = useState('kg')
  const [selectedZones, setSelectedZones] = useState<number[]>([])

  // ── Dosage (liquid)
  const [sprayerCapacity, setSprayerCapacity]   = useState('15')
  const [sprayVolume, setSprayVolume]           = useState('600')
  const [liquidDose, setLiquidDose]             = useState('10')
  const [liquidDoseSimple, setLiquidDoseSimple] = useState('10')
  const [expertMode, setExpertMode]             = useState(false)
  const [showVolumeConverter, setShowVolumeConverter] = useState(false)

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

  // ── Persistence ───────────────────────────────────────────────────────────

  useEffect(() => {
    const savedZones = sessionStorage.getItem('lawnZones')
    if (savedZones) setZones(JSON.parse(savedZones))
    const savedCap = sessionStorage.getItem('sprayerCapacity')
    if (savedCap) setSprayerCapacity(savedCap)
    // Détecte si l'appareil est tactile (mobile/tablette)
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (zones.length > 0 && zones.some(z => z.surface))
      sessionStorage.setItem('lawnZones', JSON.stringify(zones))
  }, [zones])

  useEffect(() => {
    if (zones.length > 0 && selectedZones.length === 0)
      setSelectedZones(zones.map((_, i) => i))
  }, [zones]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sprayerCapacity) sessionStorage.setItem('sprayerCapacity', sprayerCapacity)
  }, [sprayerCapacity])

  // ── Navigation helpers ────────────────────────────────────────────────────

  const steps     = STEPS[productType] || STEPS['']
  const stepIndex = steps.indexOf(stepKey)
  const totalSteps = steps.length

  const goTo   = (key: StepKey) => setStepKey(key)
  const goBack = () => { const p = steps[stepIndex - 1]; if (p) setStepKey(p) }
  const goNext = () => { const n = steps[stepIndex + 1]; if (n) setStepKey(n) }

  // ── Zone helpers ──────────────────────────────────────────────────────────

  const addZone    = () => setZones([...zones, { name: '', surface: '' }])
  const removeZone = (i: number) => zones.length > 1 && setZones(zones.filter((_, idx) => idx !== i))
  const updateZone = (i: number, field: keyof Zone, v: string) => {
    // Spread pour créer un nouvel objet zone — évite la mutation en place
    // qui empêche React de détecter le changement (shallow copy insuffisant).
    setZones(zones.map((z, idx) => idx === i ? { ...z, [field]: v } : z))
  }
  const getTotalSurface    = () => zones.reduce((s, z) => s + (parseFloat(z.surface) || 0), 0)
  const getSelectedSurface = () =>
    zones.filter((_, i) => selectedZones.includes(i)).reduce((s, z) => s + (parseFloat(z.surface) || 0), 0)
  const toggleZoneSelection = (i: number) =>
    setSelectedZones(selectedZones.includes(i) ? selectedZones.filter(x => x !== i) : [...selectedZones, i])

  // ── Dosage helpers ────────────────────────────────────────────────────────

  const convertDosageToGperM2 = () => {
    const d = parseFloat(dosage)
    return dosageUnit === 'kg/ha' ? d / 10 : d
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
    const rec  = productType === 'liquid' ? 10 : productType === 'seeds' ? 25 : 30
    const pct  = (calc / rec) * 100
    const unit = productType === 'liquid' ? 'L/ha' : 'g/m²'
    if (pct < 50)  return { type: 'error',   message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: '⚠️ Effets quasi inexistants — ne pas appliquer.' }
    if (pct < 80)  return { type: 'warning', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: '⚠️ Effets limités — concentrez-vous sur vos zones prioritaires.' }
    if (pct <= 120) return { type: 'success', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: '✅ Dosage correct.' }
    return { type: 'error', message: `${calc.toFixed(1)} ${unit} (${pct.toFixed(0)}% recommandé)`, advice: '⚠️ Surdosage — risque de brûlure.' }
  }

  const getWarning = () => {
    const d = convertDosageToGperM2()
    if (productType === 'seeds') {
      if (d > 40)           return { type: 'error',   message: 'Dose >40g/m² : risque de compétition entre brins. Vérifiez le fabricant.' }
      if (d >= 15 && d <= 25) return { type: 'success', message: 'Dose idéale pour un regarnissage (15–25 g/m²).' }
      if (d > 30 && d <= 40)  return { type: 'warning', message: 'Dose correcte pour une création. Ne pas dépasser 40 g/m².' }
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
          return { name: z.name || `Zone ${i + 1}`, surface: surf, litres: surf * depth }
        }),
      })
      setStepKey('results')
      return
    }

    if (productType === 'liquid') {
      const ldv  = parseFloat(overrideLiquidDose || liquidDose)
      const svn  = parseFloat(overrideSprayVol   || sprayVolume)
      const sc   = parseFloat(sprayerCapacity)
      const tsv  = (totalSurface * svn) / 10000
      const tpa  = (overrideSprayVol === '1000' && overrideLiquidDose)
        ? tsv * ldv
        : (ldv * totalSurface / 10000) * 1000
      const fills = Math.ceil(tsv / sc)
      const zoneResults = zonesToCalc.map((z, i) => {
        const surf = parseFloat(z.surface) || 0
        const zsv  = (surf * svn) / 10000
        const zpa  = (overrideSprayVol === '1000' && overrideLiquidDose) ? zsv * ldv : (ldv * surf / 10000) * 1000
        const fp   = fmtLiquid(zpa)
        return { name: z.name || `Zone ${i + 1}`, surface: surf, sprayVolume: zsv.toFixed(2), productAmount: fp.value, productUnit: fp.unit, waterAmount: ((zsv * 1000 - zpa) / 1000).toFixed(1), fills: (zsv / sc).toFixed(2) }
      })
      const tf = fmtLiquid(tpa), pf = fmtLiquid(tpa / fills)
      setResults({ type: 'liquid', totalSurface, totalSprayVolume: tsv.toFixed(2), totalProductAmount: tf.value, unit: tf.unit, numberOfFills: fills, productPerFill: pf.value, productPerFillUnit: pf.unit, zones: zoneResults, numberOfZones })
    } else {
      const dg = convertDosageToGperM2()
      setResults({
        type: 'solid', totalSurface,
        totalKg: ((totalSurface * dg) / 1000).toFixed(2),
        dosePerM2: dg.toFixed(1),
        zones: zonesToCalc.map((z, i) => ({ name: z.name || `Zone ${i + 1}`, surface: parseFloat(z.surface) || 0, quantity: ((parseFloat(z.surface) || 0) * dg / 1000).toFixed(2) })),
        numberOfZones,
      })
    }
    setStepKey('results')
  }

  // ── Export ────────────────────────────────────────────────────────────────

  // Capture le bloc résultats et ajoute une marge blanche autour via canvas
  const captureWithPadding = async (pad = 40): Promise<string> => {
    const el = resultsRef.current
    if (!el) throw new Error('no ref')
    const { toPng } = await import('html-to-image')
    const pixelRatio = 2
    const raw = await toPng(el, { pixelRatio, backgroundColor: '#ffffff', skipFonts: false })
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

  const downloadPDF = async () => {
    const dataUrl = await captureWithPadding()
    const { jsPDF } = await import('jspdf')
    const img = new window.Image()
    img.src = dataUrl
    await new Promise<void>(resolve => { img.onload = () => resolve() })
    const margin = 15, pageW = 210
    const contentW = pageW - margin * 2
    const contentH = (img.naturalHeight / img.naturalWidth) * contentW
    const pageH = Math.max(297, contentH + margin * 2)
    const pdf = new jsPDF({ unit: 'mm', format: [pageW, pageH], orientation: 'portrait' })
    pdf.addImage(dataUrl, 'PNG', margin, margin, contentW, contentH)
    pdf.save(`hanami-dosage-${Date.now()}.pdf`)
  }

  const downloadPNG = async () => {
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
      await navigator.share({ files: [file], title: 'Hanami — Dosages' })
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

  const prefillDev = () => {
    const devZones: Zone[] = [{ name: 'Pelouse principale', surface: '200' }, { name: 'Jardin arrière', surface: '150' }]
    setZones(devZones)
    setProductType('seeds')
    setProductName('Barenbrug RSP Elite')
    setDosage('25'); setDosageUnit('g/m2')
    setSeedObjective('regarnissage'); setLawnCondition('patchy')
    const dg = 25
    setResults({
      type: 'solid', totalSurface: 350,
      totalKg: (350 * dg / 1000).toFixed(2), dosePerM2: dg.toFixed(1),
      zones: [
        { name: 'Pelouse principale', surface: 200, quantity: (200 * dg / 1000).toFixed(2) },
        { name: 'Jardin arrière',     surface: 150, quantity: (150 * dg / 1000).toFixed(2) },
      ],
      numberOfZones: 2,
    })
    setStepKey('results')
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = () => {
    setStepKey('zones'); setProductType(''); setProductName('')
    setDosage(''); setDosageUnit('g/m2')
    setFertScenario(null)
    setSeedObjective(null); setLawnCondition(null)
    setSprayerCapacity(''); setSprayVolume('600')
    setLiquidDose(''); setLiquidDoseSimple(''); setExpertMode(false)
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
                {stepKey === 'results'          && (productName || 'Résultats')}
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

                {/* Zone list */}
                <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
                  {zones.map((zone, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-stone-50 transition-colors">
                      <input
                        type="text"
                        placeholder={`Zone ${i + 1}`}
                        value={zone.name}
                        onChange={(e) => updateZone(i, 'name', e.target.value)}
                        className={`flex-1 min-w-0 px-2 py-1.5 text-xs ${inputCls}`}
                      />
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
                  ))}
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
                    { type: 'seeds'       as const, emoji: '🌱', label: 'Semences',       desc: 'Création ou regarnissage',    product: 'Barenbrug RES+ Elite' },
                    { type: 'fertilizer'  as const, emoji: '✨', label: 'Engrais granulés', desc: 'Fertilisation & nutrition',  product: 'Floranid Twin Club'   },
                    { type: 'liquid'      as const, emoji: '💧', label: 'Produit liquide', desc: 'Traitement, mouillant, fongicide', product: 'H2Pro Trismart' },
                    { type: 'topdressing' as const, emoji: '🪨', label: 'Top dressing',    desc: 'Sable, terreau, nivellement', product: ''                    },
                  ].map(({ type, emoji, label, desc, product }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setProductType(type)
                        setProductName(product)
                        const nextSteps = STEPS[type]
                        setStepKey(nextSteps[2])
                      }}
                      className="flex flex-col items-start gap-2 p-4 bg-white border-2 border-stone-100 rounded-xl hover:border-hanami-500 hover:bg-hanami-100/20 transition-all text-left group"
                    >
                      <span className="text-2xl">{emoji}</span>
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
                        setDosage(obj.dosage.toString())
                        setDosageUnit('g/m2')
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
                            setDosage(cond.dosage.toString())
                            setDosageUnit('g/m2')
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
                        setDosage(s.dosage.toString())
                        setDosageUnit('g/m2')
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
                  {productType === 'seeds' ? 'Confirmer le dosage' : 'Dosage du produit'}
                </h2>

                <div className="space-y-3">
                  {/* Product name */}
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Nom du produit</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={`w-full px-3 py-2 ${inputCls}`}
                      placeholder="Ex : Barenbrug RSP Elite"
                    />
                  </div>

                  {/* Seeds info */}
                  {productType === 'seeds' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800">
                        Regarnissage : 10–20 g/m² · Création : 25–40 g/m² · Respectez toujours le fabricant.
                      </p>
                    </div>
                  )}

                  {/* Dosage input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Dosage recommandé (sur l'emballage)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number" inputMode="decimal" step="0.1" value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className={`flex-1 px-3 py-2 ${inputCls}`}
                        placeholder="Ex : 30"
                      />
                      <select value={dosageUnit} onChange={(e) => setDosageUnit(e.target.value)} className={`px-2 py-2 ${inputCls}`}>
                        <option value="g/m2">g/m²</option>
                        <option value="kg/ha">kg/ha</option>
                      </select>
                    </div>
                  </div>

                  {/* Warning */}
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
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <input
                      type="checkbox" checked={reverseMode}
                      onChange={(e) => { setReverseMode(e.target.checked); if (e.target.checked) setSelectedZones(zones.map((_, i) => i)) }}
                      className="w-4 h-4 accent-hanami-700 rounded shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-stone-700">📦 Calcul inversé</p>
                      <p className="text-xs text-stone-500">Calculer avec votre stock disponible</p>
                    </div>
                  </label>

                  {/* Reverse mode fields */}
                  {reverseMode && dosage && (
                    <div className="space-y-3 border-l-4 border-blue-200 pl-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Quantité en stock</label>
                        <div className="flex gap-2">
                          <input type="number" inputMode="decimal" step="0.1" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className={`flex-1 px-3 py-2 ${inputCls}`} placeholder="Ex : 3" />
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
                      setDosage(calculateReverseDosage().toString())
                      setDosageUnit('g/m2')
                    }
                    calculateResults()
                  }}
                  disabled={!dosage || (reverseMode && (!stockQuantity || selectedZones.length === 0))}
                  className={btnPrimary}
                >
                  Calculer les quantités
                </button>
              </div>
            )}

            {/* ══ STEP: Dosage (liquid) ═════════════════════════════════════ */}
            {stepKey === 'dosage' && productType === 'liquid' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Dosage du produit liquide
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Nom du produit</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={`w-full px-3 py-2 ${inputCls}`} placeholder="Ex : H2Pro Trismart" />
                  </div>

                  {/* Mode toggle */}
                  <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
                    {[{ v: false, l: 'Simplifié' }, { v: true, l: '⚙️ Expert' }].map(({ v, l }) => (
                      <button key={String(v)} onClick={() => setExpertMode(v)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${expertMode === v ? 'bg-white text-hanami-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>{l}</button>
                    ))}
                  </div>

                  {!reverseMode ? (!expertMode ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-xs text-blue-700">Mode simplifié : calcul basé sur 10L de bouillie / 100m² (vitesse de marche normale).</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Dose recommandée du produit</label>
                        <div className="relative">
                          <input type="number" inputMode="decimal" step="0.1" value={liquidDoseSimple} onChange={(e) => setLiquidDoseSimple(e.target.value)} className={`w-full px-3 py-2 pr-14 ${inputCls}`} placeholder="Ex : 10" />
                          <span className="absolute right-3 top-2 text-xs text-stone-400">ml/L</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Capacité pulvérisateur (L)</label>
                        <SprayerCapacitySelector value={sprayerCapacity} onChange={setSprayerCapacity} inputCls={inputCls} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Dose produit pur (L/ha)</label>
                        <input type="number" inputMode="decimal" step="0.1" value={liquidDose} onChange={(e) => setLiquidDose(e.target.value)} className={`w-full px-3 py-2 ${inputCls}`} placeholder="Ex : 10" />
                        <p className="text-xs text-stone-400 mt-1">Ex : H2Pro Trismart 10 L/ha · Kamasol 40–60 L/ha</p>
                      </div>
                      {liquidDose && sprayVolume && (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                          <p className="text-xs text-green-600 mb-0.5">Concentration calculée automatiquement</p>
                          <p className="text-xl font-bold text-hanami-700 font-[family-name:var(--font-space-mono)]">
                            {((parseFloat(liquidDose) * 1000) / parseFloat(sprayVolume)).toFixed(1)} ml/L
                          </p>
                        </div>
                      )}
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
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Capacité pulvérisateur (L)</label>
                        <SprayerCapacitySelector value={sprayerCapacity} onChange={setSprayerCapacity} inputCls={inputCls} />
                      </div>
                    </>
                  )) : (
                    // Reverse liquid
                    <>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Stock disponible</label>
                        <div className="flex gap-2">
                          <input type="number" inputMode="decimal" step="0.1" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className={`flex-1 px-3 py-2 ${inputCls}`} placeholder="Ex : 5" />
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
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <input type="checkbox" checked={reverseMode} onChange={(e) => { setReverseMode(e.target.checked); if (e.target.checked) setSelectedZones(zones.map((_, i) => i)) }} className="w-4 h-4 accent-hanami-700 rounded shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-700">📦 Calcul inversé</p>
                      <p className="text-xs text-stone-500">Calculer avec votre stock</p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (reverseMode && stockQuantity) calculateResults(calculateReverseDosage().toString(), sprayVolume)
                    else if (!expertMode) calculateResults(liquidDoseSimple, '1000')
                    else calculateResults()
                  }}
                  disabled={reverseMode
                    ? !stockQuantity || !sprayerCapacity || selectedZones.length === 0
                    : expertMode ? !liquidDose || !sprayerCapacity : !liquidDoseSimple || !sprayerCapacity
                  }
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
                  {productName && (
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full truncate max-w-[120px]">
                      {productName}
                    </span>
                  )}
                </div>

                {/* ── Results content (screenshottable + imprimable) ── */}
                <div ref={resultsRef} className="results-container results-print space-y-3">

                  {/* ── Solid (seeds + fertilizer) ── */}
                  {results.type === 'solid' && (
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          💡 Épandez en passes croisées à réglage faible (2–3 passages) pour une répartition homogène.
                        </p>
                      </div>

                      {/* Total */}
                      <div className="bg-hanami-900 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-hanami-100/50 uppercase tracking-wider mb-1">Quantité totale</p>
                          <p className="text-3xl font-bold text-white font-[family-name:var(--font-space-mono)]">{results.totalKg} kg</p>
                        </div>
                        <div className="text-right text-xs text-hanami-100/50 space-y-0.5">
                          <p>{results.totalSurface} m²</p>
                          <p>{Math.round(parseFloat(results.dosePerM2))} g/m²</p>
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
                              <div key={i} className="flex items-center justify-between px-3 py-2.5">
                                <div>
                                  <p className="text-sm font-medium text-stone-800">{z.name}</p>
                                  <p className="text-xs text-stone-400">{z.surface} m²</p>
                                </div>
                                <span className="font-semibold text-hanami-700 font-[family-name:var(--font-space-mono)] text-sm">{z.quantity} kg</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Liquid ── */}
                  {results.type === 'liquid' && (
                    <>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">💡 Utilisez un traceur bleu pour éviter les doubles passages.</p>
                      </div>

                      {/* Summary banner */}
                      <div className="bg-hanami-900 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-hanami-100/50 uppercase tracking-wider mb-1">Produit nécessaire</p>
                          <p className="text-3xl font-bold text-white font-[family-name:var(--font-space-mono)]">
                            {results.totalProductAmount} {results.unit}
                          </p>
                        </div>
                        <div className="text-right text-xs text-hanami-100/50 space-y-0.5">
                          <p>{results.totalSurface} m²</p>
                          <p>{results.totalSprayVolume} L bouillie</p>
                          <p>{results.numberOfFills} plein{results.numberOfFills > 1 ? 's' : ''}</p>
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
                              {/* Header */}
                              <div className="px-5 py-4 flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-base text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-fraunces)' }}>
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
                              <div className="mx-4 mb-3 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
                                <span className="text-base">💧</span>
                                <p className="text-sm text-blue-800">
                                  Eau : <strong className="font-[family-name:var(--font-space-mono)]">{z.waterAmount} L</strong>
                                </p>
                              </div>

                              {/* Produit */}
                              <div className="mx-4 mb-3 bg-stone-50 rounded-xl px-4 py-3">
                                <p className="text-xs text-stone-400 mb-0.5">{productName || 'Produit'}</p>
                                <p className="text-lg font-bold text-hanami-900 font-[family-name:var(--font-space-mono)]">
                                  {z.productAmount} {z.productUnit}
                                </p>
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
                                    {zFills.toFixed(2)} pulvérisateur{zFills > 1 ? 's' : ''}
                                  </p>
                                  <p className="text-xs text-stone-400 mt-0.5">{z.sprayVolume} L de bouillie</p>
                                </div>
                              </div>

                              {/* Chronomètre (no-print) */}
                              <div className="no-print px-4 pb-4">
                                {!isDone ? (
                                  <button
                                    onClick={() => isRunning ? stopTimer(zoneIndex) : startTimer(zoneIndex)}
                                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                                      isRunning
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                                  >
                                    {isRunning
                                      ? `⏱ ${formatTimer(timerVal)}`
                                      : timerVal > 0
                                        ? `▶ Reprendre · ${formatTimer(timerVal)}`
                                        : '⏱ Lancer le chronomètre'
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

                      {/* Recette par plein complet */}
                      {(() => {
                        const cap       = parseFloat(sprayerCapacity) || 15
                        const totalVol  = parseFloat(results.totalSprayVolume)
                        const n         = results.numberOfFills
                        const lastVol   = totalVol - (n - 1) * cap
                        const isPartial = n > 1 && lastVol < cap * 0.98
                        const prodMl    = results.productPerFillUnit === 'L'
                          ? parseFloat(results.productPerFill.toString()) * 1000
                          : parseFloat(results.productPerFill.toString())
                        const waterFull = cap - prodMl / 1000

                        return (
                          <div className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                            <p className="text-xs font-medium text-stone-600 mb-3">
                              Recette par plein complet ({sprayerCapacity} L)
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white border border-stone-100 rounded-lg px-3 py-2.5">
                                <p className="text-[10px] text-stone-400 mb-0.5">🧪 Produit / plein</p>
                                <p className="text-sm font-semibold text-blue-700 font-[family-name:var(--font-space-mono)]">
                                  {results.productPerFill} {results.productPerFillUnit}
                                </p>
                              </div>
                              <div className="bg-white border border-stone-100 rounded-lg px-3 py-2.5">
                                <p className="text-[10px] text-stone-400 mb-0.5">💧 Eau / plein</p>
                                <p className="text-sm font-semibold text-blue-700 font-[family-name:var(--font-space-mono)]">
                                  {waterFull.toFixed(1)} L
                                </p>
                              </div>
                            </div>
                            {isPartial && (
                              <p className="text-[10px] text-stone-400 mt-2 italic">
                                Dernier plein partiel : {lastVol.toFixed(1)} L de bouillie
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
                        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          💡 Passez à l'aérateur ou au scarificateur avant application pour une meilleure pénétration.
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
                            <div key={i} className="flex items-center justify-between px-3 py-2.5 border-b border-stone-50 last:border-b-0">
                              <div>
                                <p className="text-sm font-medium text-stone-800">{z.name}</p>
                                <p className="text-xs text-stone-400">{z.surface} m²</p>
                              </div>
                              <div className="text-right">
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

                  {/* ── Hanami watermark — visible dans les exports PNG/PDF ── */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span
                      className="text-xs text-stone-300 font-semibold tracking-tight"
                      style={{ fontFamily: 'var(--font-fraunces)' }}
                    >
                      Hanami.
                    </span>
                    <span className="text-xs text-stone-300">· hanami-gazon.fr</span>
                  </div>
                </div>

                {/* ── Newsletter inline ── */}
                <div className="no-print bg-hanami-100/40 border border-hanami-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-hanami-900 mb-0.5">📬 Recevez nos protocoles saisonniers</p>
                  <p className="text-xs text-stone-500 mb-3">Conseils d'entretien, moments clés, nouveaux produits.</p>
                  {newsletterSubmitted ? (
                    <p className="text-xs text-hanami-700 font-medium">✅ Merci ! Vous êtes inscrit·e.</p>
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

                {/* ── Enregistrer dans Photos (mobile uniquement) ── */}
                {isMobile && (
                  <button
                    onClick={saveToPhotos}
                    className="no-print w-full py-2.5 px-4 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <ImageDown className="w-4 h-4" /> Enregistrer l&apos;image
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Dev button (development only) ─────────────────────────────── */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={prefillDev}
              className="absolute bottom-3 left-4 text-xs text-stone-300 opacity-40 hover:opacity-100 transition-opacity font-[family-name:var(--font-space-mono)]"
            >
              [Dev]
            </button>
          )}
        </div>

        {/* ── Disclaimer footer ──────────────────────────────────────────────── */}
        <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed px-4">
          💚 Dosage Intelligent · Hanami · Pour des applications précises et responsables
        </p>
        <p className="text-center text-xs text-stone-300 mt-2 leading-relaxed px-4 italic">
          {DISCLAIMER}
        </p>
      </div>
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

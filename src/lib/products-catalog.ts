/**
 * products-catalog.ts — Catalogue des produits vendus et conseillés par Hanami
 *
 * Source : tarifs Cobalys + fiches techniques fabricants + retours terrain Sami.
 * Chaque produit a UN OU PLUSIEURS USAGES (création / rénovation / entretien…),
 * chaque usage ayant sa propre dose recommandée.
 *
 * Quand l'utilisateur sélectionne un produit dans la calculatrice :
 *  - L'usage par défaut (`defaultUsageId`) est appliqué automatiquement
 *  - Un sélecteur inline permet de switcher d'usage → la dose s'adapte
 *
 * Pour les liquides, la dose est exprimée en L/ha (mode expert) ET ml/L
 * (mode simplifié, 10 L bouillie / 100 m²) — les deux sont cohérentes :
 *   dose_ml_L = dose_L_ha / 100
 */

// ── Types ────────────────────────────────────────────────────────────────────

/** Un cas d'usage d'un produit avec sa dose dédiée */
export interface SolidUsage {
  /** Slug stable : 'creation', 'renovation', 'regarnissage', 'entretien', etc. */
  id: string
  /** Libellé affiché dans le UI (ex: "Rénovation après scarification") */
  label: string
  /** Dose recommandée pour cet usage, en g/m² */
  doseG_m2: number
  /** Plage acceptable affichée à titre indicatif (ex: "20–30 g/m²") */
  doseRange?: string
  /** Note contextuelle courte (ex: "À appliquer post-scarif") */
  note?: string
}

export interface LiquidUsage {
  id: string
  label: string
  /** Dose en L/ha (mode expert) */
  doseL_ha: number
  /** Dose en ml/L de bouillie (mode simplifié, calculée mais peut différer
   *  d'un mode arrondi : conservée explicite pour fiabilité d'affichage) */
  doseMl_L: number
  doseRange?: string
  note?: string
}

export interface SolidCatalogProduct {
  /** Identifiant unique (slug, ne change jamais — utilisé pour matching) */
  id: string
  name: string
  brand: string
  category: 'seeds' | 'fertilizer' | 'biostim'
  /** Liste des cas d'usage avec leurs doses */
  usages: SolidUsage[]
  /** ID de l'usage à pré-sélectionner par défaut */
  defaultUsageId: string
  /** Description courte du produit (composition, positionnement) */
  note: string
}

export interface LiquidCatalogProduct {
  id: string
  name: string
  brand: string
  usages: LiquidUsage[]
  defaultUsageId: string
  note: string
}

// ── Solid products (semences + engrais + biostim) ────────────────────────────

export const SOLID_CATALOG: SolidCatalogProduct[] = [
  // Semences Barenbrug
  {
    id: 'pro12',
    name: 'Pro 12',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 32, doseRange: '30–35 g/m²', note: 'Semis complet sur terre amendée' },
      { id: 'renovation', label: 'Rénovation après scarif', doseG_m2: 25, doseRange: '25–35 g/m²' },
      { id: 'regarnissage', label: 'Regarnissage léger', doseG_m2: 18, doseRange: '15–20 g/m²' },
    ],
    note: 'Création et rénovation — finesse et densité',
  },
  {
    id: 'res-rpr',
    name: 'RES+ RPR',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création', doseG_m2: 32, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation après scarif', doseG_m2: 25, doseRange: '25–35 g/m²' },
      { id: 'regarnissage', label: 'Regarnissage sport', doseG_m2: 22, note: 'Auto-réparation RPR' },
    ],
    note: 'RPR traçant — auto-réparation, indice sport élevé',
  },
  {
    id: 'res-elite',
    name: 'RES+ Elite',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création', doseG_m2: 32, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation', doseG_m2: 25, doseRange: '25–35 g/m²' },
    ],
    note: 'Tolérance pyriculariose — résistance piétinement',
  },
  {
    id: 'pro-sos',
    name: 'PRO SOS',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'regarnissage',
    usages: [
      { id: 'regarnissage', label: 'Regarnissage hivernal', doseG_m2: 22, doseRange: '15–30 g/m²', note: 'Germination basse température' },
      { id: 'reparation', label: 'Réparation zones', doseG_m2: 30, doseRange: '25–35 g/m²' },
    ],
    note: 'Regarnissage hivernal — germination basse température',
  },

  // Engrais granulaires Compo Expert
  {
    id: 'floranid-perm',
    name: 'Floranid Twin Permanent',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'bimonthly',
    usages: [
      { id: 'monthly', label: 'Mensuel', doseG_m2: 12, doseRange: '10–15 g/m²', note: 'Fractionné, absorption optimale' },
      { id: 'bimonthly', label: 'Tous les 2 mois', doseG_m2: 17, doseRange: '15–20 g/m²' },
      { id: 'quarterly', label: 'Trimestriel', doseG_m2: 27, doseRange: '25–30 g/m²' },
      { id: 'biannual', label: '2× par an', doseG_m2: 37, doseRange: '35–40 g/m²' },
    ],
    note: 'Universel printemps — N16 P7 K15 + Mg + S',
  },
  {
    id: 'floranid-club',
    name: 'Floranid Twin Club',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'bimonthly',
    usages: [
      { id: 'monthly', label: 'Mensuel', doseG_m2: 12 },
      { id: 'bimonthly', label: 'Tous les 2 mois', doseG_m2: 17 },
      { id: 'quarterly', label: 'Trimestriel', doseG_m2: 27 },
      { id: 'biannual', label: '2× par an', doseG_m2: 37 },
    ],
    note: 'Été/automne — sans phosphore, résistance et densité',
  },
  {
    id: 'floranid-rac',
    name: 'Floranid Twin Racines',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'plantation',
    usages: [
      { id: 'plantation', label: 'Plantation / semis', doseG_m2: 25, doseRange: '20–30 g/m²', note: 'Stimule l\'enracinement' },
      { id: 'aeration', label: 'Aération / scarif', doseG_m2: 20, doseRange: '20–25 g/m²' },
    ],
    note: 'Stimule l\'enracinement — à appliquer post-scarif',
  },
  {
    id: 'super-floranid',
    name: 'Super Floranid Twin BS',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'regeneration',
    usages: [
      { id: 'regeneration', label: 'Régénération sport', doseG_m2: 27, doseRange: '25–35 g/m²', note: 'Bacillus E4CDX2' },
      { id: 'entretien-sport', label: 'Entretien sport', doseG_m2: 20 },
    ],
    note: 'Sport intensif — régénération rapide + Bacillus',
  },
  {
    id: 'floranid-eagle',
    name: 'Floranid Twin Eagle NK BS',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'bimonthly',
    usages: [
      { id: 'bimonthly', label: 'Tous les 2 mois', doseG_m2: 25 },
      { id: 'quarterly', label: 'Trimestriel', doseG_m2: 35, doseRange: '30–40 g/m²' },
    ],
    note: 'Premium sans phosphore + Bacillus E4CDX2',
  },

  // Engrais ICL
  {
    id: 'sierraform-stress',
    name: 'Sierraform GT Stress Control',
    brand: 'ICL',
    category: 'fertilizer',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'renovation', label: 'Rénovation', doseG_m2: 25, doseRange: '20–30 g/m²', note: 'Poly-S 3 mois' },
      { id: 'entretien', label: 'Entretien anti-stress', doseG_m2: 20 },
    ],
    note: 'Poly-S libération contrôlée 3 mois',
  },

  // Biostimulants / Activateurs sol
  {
    id: 'bacteriosol',
    name: 'Bacteriosol Universel',
    brand: 'SOBAC',
    category: 'biostim',
    defaultUsageId: 'annuel',
    usages: [
      { id: 'annuel', label: 'Application annuelle', doseG_m2: 25, doseRange: '20–30 g/m²', note: 'Active la vie du sol' },
      { id: 'choc', label: 'Choc démarrage', doseG_m2: 30, doseRange: '25–35 g/m²' },
    ],
    note: 'Activateur biologique sol — structure et humus',
  },
]

// ── Liquid products ─────────────────────────────────────────────────────────

export const LIQUID_CATALOG: LiquidCatalogProduct[] = [
  {
    id: 'vitalnova-stress',
    name: 'Vitalnova StressBuster',
    brand: 'ICL',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'entretien', label: 'Entretien préventif', doseL_ha: 25, doseMl_L: 2.5, doseRange: '25 L/ha' },
      { id: 'curatif', label: 'Curatif (stress installé)', doseL_ha: 50, doseMl_L: 5, doseRange: '50 L/ha', note: 'À appliquer dès symptômes' },
    ],
    note: 'Biostimulant foliaire — acides aminés + oligo-éléments',
  },
  {
    id: 'h2pro-trismart',
    name: 'H2Pro TriSmart',
    brand: 'ICL',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'premiere', label: '1ʳᵉ application', doseL_ha: 25, doseMl_L: 2.5, note: 'Choc d\'humectation' },
      { id: 'entretien', label: 'Entretien mensuel', doseL_ha: 10, doseMl_L: 1, doseRange: '10 L/ha' },
    ],
    note: 'Agent mouillant triple action — +40% économie d\'eau',
  },
  {
    id: 'h2pro-flowsmart',
    name: 'H2Pro FlowSmart',
    brand: 'ICL',
    defaultUsageId: 'mensuel',
    usages: [
      { id: 'mensuel', label: 'Mensuel anti Dry Patch', doseL_ha: 10, doseMl_L: 1 },
    ],
    note: 'Super pénétrant drainage — 1×/mois Dry Patch',
  },
  {
    id: 'kick-pro',
    name: 'Kick Pro',
    brand: 'Compo Expert',
    defaultUsageId: 'standard',
    usages: [
      { id: 'standard', label: 'Pulvérisation standard', doseL_ha: 18, doseMl_L: 1.8, doseRange: '1–2.8 ml/L' },
    ],
    note: 'Agent mouillant concentré — 58% sulfosuccinate',
  },
  {
    id: 'kamasol',
    name: 'Kamasol Brillant Grün',
    brand: 'Compo Expert',
    defaultUsageId: 'foliaire',
    usages: [
      { id: 'foliaire', label: 'Engrais foliaire', doseL_ha: 50, doseMl_L: 5, doseRange: '40–60 L/ha' },
    ],
    note: 'Engrais foliaire — coloration verte intense',
  },
  {
    id: 'vitanica-si',
    name: 'Vitanica Si',
    brand: 'Compo Expert',
    defaultUsageId: 'preventif',
    usages: [
      { id: 'preventif', label: 'Préventif stress hydrique', doseL_ha: 15, doseMl_L: 1.5, doseRange: '10–20 L/ha' },
      { id: 'choc', label: 'Choc piétinement', doseL_ha: 20, doseMl_L: 2 },
    ],
    note: 'Silicium — résistance stress hydrique et piétinement',
  },
]

// ── Helpers de recherche ─────────────────────────────────────────────────────

/** Récupère l'usage par défaut d'un produit (toujours présent par contrat).
 *  Fallback sur le 1er usage si l'id n'existe pas (devrait pas arriver). */
export function getDefaultSolidUsage(p: SolidCatalogProduct): SolidUsage {
  return p.usages.find(u => u.id === p.defaultUsageId) ?? p.usages[0]
}

export function getDefaultLiquidUsage(p: LiquidCatalogProduct): LiquidUsage {
  return p.usages.find(u => u.id === p.defaultUsageId) ?? p.usages[0]
}

/** Filtre les produits dont le nom ou la marque contient la requête (case-insensitive).
 *  Retourne au max `limit` résultats, triés par pertinence (match au début > au milieu). */
export function searchSolidCatalog(query: string, limit = 5, category?: SolidCatalogProduct['category']): SolidCatalogProduct[] {
  return searchInArray(SOLID_CATALOG.filter(p => !category || p.category === category || p.category === 'biostim'), query, limit)
}

export function searchLiquidCatalog(query: string, limit = 5): LiquidCatalogProduct[] {
  return searchInArray(LIQUID_CATALOG, query, limit)
}

function searchInArray<T extends { name: string; brand: string }>(arr: T[], query: string, limit: number): T[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return arr.slice(0, limit)
  const scored = arr
    .map(p => {
      const nameL = p.name.toLowerCase()
      const brandL = p.brand.toLowerCase()
      let score = 0
      if (nameL.startsWith(q)) score += 10
      else if (nameL.includes(q)) score += 5
      if (brandL.startsWith(q)) score += 3
      else if (brandL.includes(q)) score += 1
      return { p, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p)
  return scored
}

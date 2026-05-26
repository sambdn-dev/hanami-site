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
    name: 'PRO 12',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Semis complet sur terre amendée' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Mélange Ray-grass + Fétuques fines (75%) — finesse, densité, autoréparation. Polyvalent piétinement léger',
  },
  {
    id: 'res-rpr',
    name: 'RES+ RPR',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '30 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '100% Ray-grass anglais dont 3 traçants — autoréparation par stolons, indice sport 7,2. Idéal terrains sport / golf / ornement résistant',
  },
  {
    id: 'res-elite',
    name: 'RES+ ÉLITE',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'renovation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '30 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '100% Ray-grass anglais — tolérance pyriculariose (maladie estivale), réduction azote possible, excellente résistance piétinement',
  },
  {
    id: 'pro-sos',
    name: 'PRO SOS',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'regarnissage_hivernal',
    usages: [
      { id: 'regarnissage_hivernal', label: 'Regarnissage hivernal', doseG_m2: 45, doseRange: '35–45 g/m²', note: 'Saison froide (oct→mars) — germe dès 5°C grâce au Ray-grass multiflorum' },
    ],
    note: 'Spécial sols froids (< 10°C) — 50% RGA AMIATA + 50% Ray-grass multiflorum BARTERRA. À utiliser juste avant ou après l\'hiver pour préserver la pelouse',
  },
  {
    id: 'pro-ombre',
    name: 'PRO OMBRE',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création zones ombragées', doseG_m2: 25, doseRange: '20–25 g/m²', note: 'Sous arbres, en lisière, exposition nord' },
    ],
    note: 'Spécial ombre — 40% Canche cespiteuse (meilleure tolérance à l\'ombre) + Fétuques fines + Ray-grass traçant. S\'adapte aux sols pauvres et filtrants. Astuce : remonter la hauteur de tonte pour compenser le manque de lumière',
  },
  {
    id: 'res-rpr-patch',
    name: 'RES+ RPR PATCH',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'reparation',
    usages: [
      { id: 'reparation', label: 'Réparation de zones / trous', doseG_m2: 2000, doseRange: '1500–2000 g/m²', note: 'Application en remplissage (épaisseur 1–2 cm). Le sac couvre ~7–10 m² de réparations' },
    ],
    note: 'Produit "rebouche-trous" prêt-à-l\'emploi — 30% semences RPR (4 RGA dont 3 traçants) + 55% fibres de coco + 15% engrais organique 3-1-6. Installation rapide même en période sèche grâce à la rétention d\'eau de la coco',
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
  {
    id: 'floranid-n31',
    name: 'Floranid N 31',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'parcs',
    usages: [
      { id: 'parcs', label: 'Parcs et gazons d\'agrément', doseG_m2: 30, doseRange: '20–30 g/m²', note: 'Mars à septembre' },
      { id: 'sport', label: 'Terrain de sport', doseG_m2: 30, doseRange: '20–30 g/m²' },
      { id: 'golf', label: 'Fairways de golf', doseG_m2: 20, doseRange: '15–20 g/m²' },
    ],
    note: 'Azote pur 31-0-0 longue durée (3–4 mois) — Isodur à 95% d\'indice d\'activité, biodégradable. Idéal grands espaces verts ou renforcement d\'azote ciblé',
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
  {
    id: 'sierrablen-renovator',
    name: 'Sierrablen Plus Renovator',
    brand: 'ICL',
    category: 'fertilizer',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (au semis)', doseG_m2: 35, doseRange: '25–35 g/m²', note: 'À épandre au moment du semis pour booster les jeunes racines' },
      { id: 'regarnissage', label: 'Regarnissage (sursemis)', doseG_m2: 35, doseRange: '25–35 g/m²', note: 'Post-scarif, après le sursemis' },
    ],
    note: 'NPK 20-20-8 riche en phosphore — Poly-S libération contrôlée 3 mois. Engrais de démarrage idéal création / rénovation (mai → octobre)',
  },
  {
    id: 'sierrablen-nstart',
    name: 'Sierrablen Plus N-Start 3M',
    brand: 'ICL',
    category: 'fertilizer',
    defaultUsageId: 'demarrage',
    usages: [
      { id: 'demarrage', label: 'Démarrage printemps', doseG_m2: 25, doseRange: '15–25 g/m²', note: 'Verdissement rapide, même par temps frais' },
    ],
    note: 'NPK 30-5-5 — Poly-S libération contrôlée 3 mois. Forte teneur azote pour réveil de printemps (avril → juin). Granulométrie fine, gazons tondus > 8 mm',
  },
  {
    id: 'sierrablen-stress',
    name: 'Sierrablen Plus Stress Control',
    brand: 'ICL',
    category: 'fertilizer',
    defaultUsageId: 'stress_ete',
    usages: [
      { id: 'stress_ete', label: 'Anti-stress estival', doseG_m2: 35, doseRange: '25–35 g/m²', note: 'Renforce résistance chaleur, sécheresse, piétinement' },
      { id: 'preparation_hiver', label: 'Préparation hivernale', doseG_m2: 35, doseRange: '25–35 g/m²', note: 'Renforce résistance au froid avant l\'hiver' },
    ],
    note: 'NPK 15-0-28 + 2 MgO — très forte teneur en potasse pour résistance aux stress (été + hiver). Poly-S 3 mois, gazons tondus > 6 mm',
  },
  {
    id: 'proturf-12-5-20',
    name: 'ProTurf 12-5-20',
    brand: 'ICL Everris',
    category: 'fertilizer',
    defaultUsageId: 'automne',
    usages: [
      { id: 'automne', label: 'Fertilisation automne', doseG_m2: 35, doseRange: '20–35 g/m²', note: 'Septembre à novembre — prépare l\'hiver' },
      { id: 'stress_ete', label: 'Stress estival', doseG_m2: 35, doseRange: '20–35 g/m²', note: 'Juillet à août — soutient en période chaude' },
    ],
    note: 'NPK 12-5-20 + 2.2 MgO + 2.2 CaO — riche en Polyhalite (K, Mg, Ca, S). Poly-S 2–3 mois. Polyvalent gazons / arbustes / massifs. Granulés fins, gazons tondus à 6 mm',
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
  {
    id: 'agrosil-algin',
    name: 'Agrosil Algin',
    brand: 'Compo Expert',
    category: 'biostim',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (incorporation)', doseG_m2: 150, doseRange: '100–150 g/m²', note: 'À incorporer dans les 10–15 premiers cm avant semis' },
      { id: 'renovation', label: 'Rénovation / scalpage', doseG_m2: 100, doseRange: '70–100 g/m²', note: 'Faire suivre d\'un griffage ou brossage' },
      { id: 'aeration', label: 'Aération / défeutrage', doseG_m2: 70, doseRange: '50–70 g/m²', note: 'Après louchets / lames — finir au brossage' },
    ],
    note: 'Bio-activateur de sol — 25% algue Ascophyllum nodosum + zéolithe + Bacillus R6CDX + acides humiques. Stimule germination, enracinement, vie microbienne. Idéal sols sableux, compactés, asphyxiés ou C/N > 12',
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
    id: 'vitalnova-smx',
    name: 'Vitalnova SMX',
    brand: 'ICL',
    defaultUsageId: 'standard',
    usages: [
      { id: 'standard', label: 'Pulvérisation foliaire', doseL_ha: 10, doseMl_L: 1, doseRange: '5–10 L/ha', note: 'Toute l\'année hors gel et forte chaleur — intervalle 15 jours mini' },
    ],
    note: 'Concentré d\'algues marines — 10% Ascophyllum nodosum (acides aminés + oligo-éléments). Booster racinaire, accélère levée des semis, améliore résistance aux stress. Miscible avec Vitalnova Stressbuster / Silk',
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

/**
 * products-catalog.ts — Catalogue des produits vendus et conseillés par Hanami
 *
 * Source : tarifs Cobalys + recommandations terrain (cf. business-simulator-HANAMI.jsx).
 * Chaque produit a une dose recommandée pré-définie : quand l'utilisateur sélectionne
 * un produit du catalogue dans la calculatrice, la dose se remplit automatiquement.
 *
 * Quand Hanami ajoute un produit à son offre, il suffit d'éditer ce fichier.
 *
 * Pour les liquides, la dose est exprimée en L/ha (mode expert) ET ml/L (mode
 * simplifié, 10 L bouillie / 100 m²) — les deux sont cohérentes mathématiquement
 * via : dose_ml_L = dose_L_ha / 1000 * 10 = dose_L_ha / 100.
 */

// ── Solid products (semences + engrais) ──────────────────────────────────────

export interface SolidCatalogProduct {
  /** Identifiant unique (slug) */
  id: string
  /** Nom commercial affiché */
  name: string
  /** Marque (Barenbrug, Compo Expert, ICL, etc.) */
  brand: string
  /** Catégorie produit pour filtrage */
  category: 'seeds' | 'fertilizer' | 'biostim'
  /** Dose recommandée par défaut, en g/m² */
  doseG_m2: number
  /** Plage acceptable (affichée dans l'autocomplete) */
  doseRange: string
  /** Note courte sur l'usage (affichée en sous-titre dans la suggestion) */
  note: string
}

export const SOLID_CATALOG: SolidCatalogProduct[] = [
  // Semences Barenbrug
  {
    id: 'pro12',
    name: 'Pro 12',
    brand: 'Barenbrug',
    category: 'seeds',
    doseG_m2: 30,
    doseRange: '25–35 g/m²',
    note: 'Création et rénovation — finesse et densité',
  },
  {
    id: 'res-rpr',
    name: 'RES+ RPR',
    brand: 'Barenbrug',
    category: 'seeds',
    doseG_m2: 30,
    doseRange: '25–35 g/m²',
    note: 'RPR traçant — auto-réparation, indice sport élevé',
  },
  {
    id: 'res-elite',
    name: 'RES+ Elite',
    brand: 'Barenbrug',
    category: 'seeds',
    doseG_m2: 30,
    doseRange: '25–35 g/m²',
    note: 'Tolérance pyriculariose — résistance piétinement',
  },
  {
    id: 'pro-sos',
    name: 'PRO SOS',
    brand: 'Barenbrug',
    category: 'seeds',
    doseG_m2: 22,
    doseRange: '15–30 g/m²',
    note: 'Regarnissage hivernal — germination basse température',
  },

  // Engrais granulaires Compo Expert
  {
    id: 'floranid-perm',
    name: 'Floranid Twin Permanent',
    brand: 'Compo Expert',
    category: 'fertilizer',
    doseG_m2: 25,
    doseRange: '20–30 g/m²',
    note: 'Universel printemps — N16 P7 K15 + Mg + S',
  },
  {
    id: 'floranid-club',
    name: 'Floranid Twin Club',
    brand: 'Compo Expert',
    category: 'fertilizer',
    doseG_m2: 25,
    doseRange: '20–30 g/m²',
    note: 'Été/automne — sans phosphore, résistance et densité',
  },
  {
    id: 'floranid-rac',
    name: 'Floranid Twin Racines',
    brand: 'Compo Expert',
    category: 'fertilizer',
    doseG_m2: 25,
    doseRange: '20–30 g/m²',
    note: 'Stimule l\'enracinement — plantation ou aération',
  },
  {
    id: 'super-floranid',
    name: 'Super Floranid Twin BS',
    brand: 'Compo Expert',
    category: 'fertilizer',
    doseG_m2: 27,
    doseRange: '20–35 g/m²',
    note: 'Sport intensif — régénération rapide + Bacillus',
  },
  {
    id: 'floranid-eagle',
    name: 'Floranid Twin Eagle NK BS',
    brand: 'Compo Expert',
    category: 'fertilizer',
    doseG_m2: 30,
    doseRange: '20–40 g/m²',
    note: 'Premium sans phosphore + Bacillus E4CDX2',
  },

  // Engrais ICL
  {
    id: 'sierraform-stress',
    name: 'Sierraform GT Stress Control',
    brand: 'ICL',
    category: 'fertilizer',
    doseG_m2: 25,
    doseRange: '20–30 g/m²',
    note: 'Poly-S libération contrôlée 3 mois — rénovation',
  },

  // Biostimulants / Activateurs sol
  {
    id: 'bacteriosol',
    name: 'Bacteriosol Universel',
    brand: 'SOBAC',
    category: 'biostim',
    doseG_m2: 25,
    doseRange: '20–30 g/m²',
    note: 'Activateur biologique sol — structure et humus',
  },
]

// ── Liquid products ─────────────────────────────────────────────────────────

export interface LiquidCatalogProduct {
  id: string
  name: string
  brand: string
  /** Dose recommandée en L/ha (mode expert) */
  doseL_ha: number
  /** Dose recommandée en ml/L de bouillie (mode simplifié, 10 L/100m²) */
  doseMl_L: number
  /** Plage indicative pour affichage (ex: "25–50 L/ha") */
  doseRange: string
  note: string
}

export const LIQUID_CATALOG: LiquidCatalogProduct[] = [
  {
    id: 'vitalnova-stress',
    name: 'Vitalnova StressBuster',
    brand: 'ICL',
    doseL_ha: 35,
    doseMl_L: 3.5,
    doseRange: '25–50 L/ha',
    note: 'Biostimulant foliaire — entretien 25, curatif 50',
  },
  {
    id: 'h2pro-trismart',
    name: 'H2Pro TriSmart',
    brand: 'ICL',
    doseL_ha: 15,
    doseMl_L: 1.5,
    doseRange: '10–25 L/ha',
    note: 'Agent mouillant triple action — +40% économie d\'eau',
  },
  {
    id: 'h2pro-flowsmart',
    name: 'H2Pro FlowSmart',
    brand: 'ICL',
    doseL_ha: 10,
    doseMl_L: 1,
    doseRange: '10 L/ha',
    note: 'Super pénétrant drainage — 1×/mois Dry Patch',
  },
  {
    id: 'kick-pro',
    name: 'Kick Pro',
    brand: 'Compo Expert',
    doseL_ha: 18,
    doseMl_L: 1.8,
    doseRange: '1–2.8 ml/L',
    note: 'Agent mouillant concentré — 58% sulfosuccinate',
  },
  {
    id: 'kamasol',
    name: 'Kamasol Brillant Grün',
    brand: 'Compo Expert',
    doseL_ha: 50,
    doseMl_L: 5,
    doseRange: '40–60 L/ha',
    note: 'Engrais foliaire — coloration verte intense',
  },
  {
    id: 'vitanica-si',
    name: 'Vitanica Si',
    brand: 'Compo Expert',
    doseL_ha: 15,
    doseMl_L: 1.5,
    doseRange: '10–20 L/ha',
    note: 'Silicium — résistance stress hydrique et piétinement',
  },
]

// ── Helper : recherche fuzzy dans le catalogue ───────────────────────────────

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

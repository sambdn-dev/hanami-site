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
 * Pour les liquides, la calculatrice a DEUX modes :
 *  - SIMPLIFIÉ (grand public) : bouillie fixe 1000 L/ha (10 L/100 m²). À ce
 *    volume, le ml/L vaut numériquement le L/ha → on stocke doseMl_L = doseL_ha
 *    (relation 1:1). Le calcul simplifié multiplie doseMl_L directement par la
 *    surface : toute autre valeur ferait SURDOSER. Ne JAMAIS mettre la
 *    conversion par bouillie réelle dans doseMl_L.
 *  - EXPERT : l'utilisateur choisit la bouillie réelle ; le ml/L est recalculé
 *    en direct = doseL_ha × 1000 / bouillie. Le champ `bouillieL_ha` pré-remplit
 *    cette bouillie depuis la fiche technique (ex : Stressbuster → 500 L/ha).
 * Doses prises en haut de fourchette pour sécuriser un apport rarement homogène.
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
  /** Bouillie de référence (L/ha) de la fiche technique, alignée sur les presets
   *  du sélecteur (400/500/600/800/1000) — sert à PRÉ-REMPLIR le mode expert.
   *  La plage réelle de la fiche est indiquée dans `note`. Défaut 1000 si absente. */
  bouillieL_ha?: number
  /** Dose en ml/L pour le MODE SIMPLIFIÉ uniquement = doseL_ha (relation 1:1 à
   *  1000 L/ha). Le mode expert ne s'en sert pas (il recalcule via la bouillie). */
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

  {
    id: 'pro-22p',
    name: 'PRO 22P',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '25–30 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Semences pelliculées (ActiSeed + Osyr) — fétuques fines + ray-grass, gazon agressif face aux adventices. Golfs / espaces verts',
  },
  {
    id: 'pro-24p',
    name: 'PRO 24P',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '30–40 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Riche en fétuque élevée, semences pelliculées — résistance piétinement + sécheresse. Sports / golfs / espaces verts',
  },
  {
    id: 'eco-nord',
    name: 'ECO NORD',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '35 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Mélange économique rustique — fétuque rouge + ray-grass. Bon rapport qualité/prix pour grandes surfaces',
  },
  {
    id: 'pro-01',
    name: 'PRO 01',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Ray-grass anglais RPR — autoréparation par stolons, gazon d\'agrément résistant',
  },
  {
    id: 'pro-10',
    name: 'PRO 10',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '25–35 g/m²' },
    ],
    note: 'Polyvalent jardins d\'agrément piétinés — pâturin des prés + fétuques + ray-grass traçant',
  },
  {
    id: 'pro-50p',
    name: 'PRO 50P',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '100% ray-grass anglais, indice sport 7,4, semences pelliculées — terrains de sport et regarnissage rapide',
  },
  {
    id: 'res-200',
    name: 'RES+ 200',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 25, doseRange: '15–25 g/m²' },
    ],
    note: 'Résistance sécheresse, faible pousse (moins de tontes) — fétuque ovine + koeléria. Ornement et zones piétonnières extensives',
  },
  {
    id: 'res-202',
    name: 'RES+ 202',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
    ],
    note: '65% fétuque élevée, très dense — résistance sécheresse. Golfs fairways / espaces verts',
  },
  {
    id: 'res-408',
    name: 'RES+ 408',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
    ],
    note: 'Fétuque élevée + fétuque à rhizomes RTF + pâturin + RGA RPR — maillage racinaire solide, résistance stress hydrique et piétinement, autoréparation. Sports / hippodromes / fairways. Adapté gazon de placage',
  },
  {
    id: 'res-444',
    name: 'RES+ 444',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '30 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'La référence terrains de sport — pâturin des prés + ray-grass RPR, excellente installation (7,8), résistance maladies, autoréparation. Terrains télévisés / hybrides / hippodromes',
  },
  {
    id: 'res-med',
    name: 'RES+ MED',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
    ],
    note: 'Spécial zones méditerranéennes — Cynodon dactylon Monaco + fétuque rouge traçante + pâturin. Meilleur mélange résistance chaleur et sécheresse, réduction d\'arrosage. Sports / agrément / zones piétonnières',
  },
  {
    id: 'res-rtf',
    name: 'RES+ RTF',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 20, doseRange: '15–20 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '90% fétuque élevée à rhizomes RTF + RGA traçant — capacité de régénération hors norme, forte économie d\'arrosage, excellente résistance piétinement. Sports / roughs / ornement / zones de circulation',
  },
  {
    id: 'res-410-lr',
    name: 'RES+ 410 LR',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
    ],
    note: 'Fétuque élevée + fétuque rouge ½ traçante + RGA traçant — fin et dense, résistance sécheresse et piétinement, bon comportement hivernal, excellente pérennité (8,1). Fairways / ornement / agrément',
  },

  // Semences ICL ProSelect
  {
    id: 'speed-germ-zt',
    name: 'Speed Germ ZT',
    brand: 'ICL ProSelect',
    category: 'seeds',
    defaultUsageId: 'regarnissage_hivernal',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '25–30 g/m²' },
      { id: 'regarnissage_hivernal', label: 'Regarnissage hivernal', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Germination dès 3°C — période de jeux la plus critique' },
    ],
    note: '100% ray-grass anglais traité ZipSeed (zinc, magnésium, acides humiques + aminés) — germination à basse température dès 3°C. Idéal regarnissages hivernaux ou très précoces. Départs de golf / terrains de sport / agrément',
  },
  {
    id: 'sport-plus',
    name: 'Sport Plus',
    brand: 'ICL ProSelect',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '20–30 g/m²' },
      { id: 'regarnissage', label: 'Rénovation / regarnissage', doseG_m2: 25, doseRange: '15–25 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: 'Ray-grass + pâturin des prés hybride SPF 30 Heartmaster (procédé SmartStart) — régénération dynamique, résistance arrachement, densité accrue. Levée du pâturin en 12 jours. Terrains de sport sollicités',
  },
  {
    id: 'renovator-trt',
    name: 'Renovator TRT',
    brand: 'ICL ProSelect',
    category: 'seeds',
    defaultUsageId: 'regarnissage',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '25–35 g/m²' },
      { id: 'regarnissage', label: 'Regarnissage', doseG_m2: 25, doseRange: '20–25 g/m²', note: 'Après scarif ou sursemis' },
      { id: 'micro_regarnissage', label: 'Micro-regarnissage', doseG_m2: 15, doseRange: '10–15 g/m²', note: 'Entretien léger, sursemis fin' },
    ],
    note: '100% ray-grass anglais dont Torsion TRT (tallage auto-réparant) — installation rapide et agressive, référence résistance Gray Leaf Spot, très bon comportement forte chaleur. Idéal regarnissage haut de gamme sport / agrément',
  },
  {
    id: 'strong',
    name: 'Strong',
    brand: 'ICL ProSelect',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '35–40 g/m²' },
    ],
    note: '80% fétuque élevée (Raptor III + Avenger II) + RGA + pâturin hybride Heatmaster — gazon tout terrain auto-réparant pour zones séchantes ou inondables. N°1 tolérance piétinement, excellent aspect esthétique, bon comportement hivernal. Hauteur de tonte > 20 mm',
  },

  // Semences Compo Expert
  {
    id: 'compo-seed-creation-sport',
    name: 'Compo-Seed Création Sport',
    brand: 'Compo Expert',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 25, doseRange: '25 g/m²', note: 'Usage sportif — version BS enrichie Bacillus E4CDX2 disponible' },
    ],
    note: '50% ray-grass anglais + 50% pâturin des prés (index sport 7,4, certifié RSM 3.1) — création de gazon à usage sportif, couleur vert-tendre anti-patchwork, forte tolérance au piétinement',
  },
  {
    id: 'compo-seed-regeneration',
    name: 'Compo-Seed Régénération',
    brand: 'Compo Expert',
    category: 'seeds',
    defaultUsageId: 'regarnissage',
    usages: [
      { id: 'regarnissage', label: 'Regarnissage', doseG_m2: 30, doseRange: '15–30 g/m²', note: 'Régénération rapide des terrains sportifs en place' },
    ],
    note: '100% ray-grass anglais (3 variétés complémentaires, index sport 8, certifié RSM 3.2) — regarnissage des gazons en place, régénération rapide, couleur vert-tendre anti-patchwork. Version BS (85% RGA + 15% pâturin + Bacillus E4CDX2) disponible',
  },
  {
    id: 'compo-seed-agrement',
    name: 'Compo-Seed Agrément',
    brand: 'Compo Expert',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 30, doseRange: '30 g/m²', note: 'Parcs et jardins, aménagement paysager' },
    ],
    note: '40% RGA + 15% pâturin des prés + 45% fétuques rouges (index agrément 7,4, certifié RSM 2.3) — parcs et jardins, tolérance ombre / manque d\'eau, finesse du feuillage, besoins en entretien faibles à modérés',
  },
  {
    id: 'seed-regeneration',
    name: 'Seed Régénération',
    brand: 'Compo Expert',
    category: 'seeds',
    defaultUsageId: 'regarnissage',
    usages: [
      { id: 'regarnissage', label: 'Regarnissage', doseG_m2: 30, doseRange: '15–30 g/m²', note: 'Régénération rapide des terrains sportifs' },
    ],
    note: '100% ray-grass anglais (index sport 8, certifié RSM 3.2) — regarnissage des gazons sportifs, régénération rapide des terrains standards, couleur vert-tendre anti-patchwork',
  },

  // Semences Barenbrug grand public (Mon Gazon Passion / Facile)
  {
    id: 'passion-ligue-pro-golf',
    name: 'Passion Ligue Pro et Golf',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '35–40 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '30% RGA traçant RPR + 30% RGA + 20% pâturin des prés + 20% fétuque rouge demi-traçante — gazon d\'élite alliant finesse esthétique des golfs et solidité des stades. Auto-régénérant, très fin et dense. Pour les très beaux jardins',
  },
  {
    id: 'passion-littoral-chaleurs',
    name: 'Passion Littoral et Fortes Chaleurs',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '35–40 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '20% RGA + 35% fétuque élevée + 30% fétuque élevée à rhizomes RTF + 15% fétuque rouge demi-traçante — résistant à la sécheresse, aux embruns et aux fortes chaleurs, reverdit après l\'été. Pour les jardins de bord de mer non arrosés',
  },
  {
    id: 'passion-ombre-soleil',
    name: 'Passion Ombre et Soleil',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 35, doseRange: '30–35 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '30% RGA + 20% RGA traçant RPR + 50% fétuques rouges (traçante, gazonnante, demi-traçante) — performant à l\'ombre comme au soleil, fin et dense. Astuce : rehausser la hauteur de tonte sous ombrage. Pour les terrains arborés',
  },
  {
    id: 'passion-terrain-sec',
    name: 'Passion Terrain Sec sans Arrosage',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '35–40 g/m²' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '30% RGA traçant RPR + 35% fétuque élevée à rhizomes + 35% fétuque élevée — très économe en eau, résiste à la chaleur et à la sécheresse, auto-réparation naturelle. Pour les jardins non arrosés',
  },
  {
    id: 'facile-rustique-universel',
    name: 'Facile Rustique et Universel',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création (sol nu)', doseG_m2: 40, doseRange: '35–40 g/m²', note: 'Mélange enrichi en engrais — germe dès 10°C' },
      { id: 'renovation', label: 'Rénovation / regarnissage', doseG_m2: 30, doseRange: '25–30 g/m²', note: 'Après scarif ou sursemis' },
    ],
    note: '70% semences (50% RGA + 30% fétuque rouge traçante + 20% fétuque rouge gazonnante) + 30% engrais organique UAB (3-2-5) — gazon rustique tout type de sol, installation facile, pousse à basse température (dès 10°C). Pour les grands espaces',
  },
  {
    id: 'rebouche-trou',
    name: 'Rebouche Trou (Soin Gazon)',
    brand: 'Barenbrug',
    category: 'seeds',
    defaultUsageId: 'reparation',
    usages: [
      { id: 'reparation', label: 'Réparation de zones / trous', doseG_m2: 80, doseRange: '50–80 g/m²', note: 'Produit prêt à l\'emploi en pansement sur zone dégradée — garder humide' },
    ],
    note: 'Produit 3-en-1 prêt à l\'emploi — 40% semences (100% RGA 2 variétés) + 15% engrais organo-minéral UAB 3-2-5 (avec stimulateur racinaire) + 45% support végétal rétenteur d\'eau. Répare rapidement zones dénudées, tranchées, trous ; limite l\'apparition des mauvaises herbes',
  },

  // Engrais granulaires Compo Expert
  {
    id: 'ferro-top',
    name: 'Ferro Top',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'reverdissement',
    usages: [
      { id: 'reverdissement', label: 'Reverdissement', doseG_m2: 30, doseRange: '20–30 g/m²', note: 'Février à décembre, hors chaleur — 5 à 7 j avant compétition' },
    ],
    note: 'NK 6-0-12 (+6 MgO +18 S +8 Fe) — engrais de reverdissement granulométrie fine (0,5–2 mm). Couleur vert-franc soutenue avec très peu de pousse, action rapide (3–7 j) et durable. Riche en fer, potasse et magnésie. Arroser aussitôt après épandage (5 mm). Idéal sortie d\'hiver / avant compétition',
  },
  {
    id: 'floranid-twin-nk',
    name: 'Floranid Twin NK',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'entretien', label: 'Entretien (sport / agrément)', doseG_m2: 40, doseRange: '20–40 g/m²', note: 'Mars à décembre' },
      { id: 'aeration', label: 'Aération / décompactage', doseG_m2: 40, doseRange: '30–40 g/m²', note: 'En association avec Agrosil LR2 pour régénération' },
    ],
    note: 'NK 14-0-19 (+3 MgO +33,75 S) + oligo-éléments — engrais sans phosphore double technologie Isodur + Crotodur (action lente 3–4 mois, indice 98,5%). Pour sols riches en phosphore ou régénération avec Agrosil LR2',
  },
  {
    id: 'floranid-twin-resistance-bs',
    name: 'Floranid Twin Résistance BS',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'sport',
    usages: [
      { id: 'sport', label: 'Terrain de sport', doseG_m2: 50, doseRange: '30–50 g/m²', note: 'Avril à octobre — sol > 12–14°C, arroser dans les 4 h (5 mm)' },
      { id: 'agrement', label: 'Gazon d\'ornement / agrément', doseG_m2: 30, doseRange: '20–30 g/m²', note: 'Avril à octobre' },
    ],
    note: 'NK 14-0-19 (+3 MgO +27,5 S) + oligo-éléments + Bacillus E4CDX2 — double technologie Isodur + Crotodur (action lente 3–4 mois) associée au biofertilisant. Renforce la résistance au jeu intense et aux conditions climatiques difficiles, stimule l\'enracinement',
  },
  {
    id: 'floranid-gazon-desherbant',
    name: 'Floranid Gazon Désherbant Pro',
    brand: 'Compo Expert',
    category: 'fertilizer',
    defaultUsageId: 'desherbage',
    usages: [
      { id: 'desherbage', label: 'Engrais + désherbage', doseG_m2: 30, doseRange: '30 g/m²', note: '1 seul apport / an, par temps poussant (12–25°C). Délai de rentrée 6 h. Usage professionnel réglementé' },
    ],
    note: 'NPK 15-5-8 (+3) + 2,4-D et dicamba — engrais mixte longue durée (Isodur 3–4 mois) avec désherbant sélectif incorporé. Détruit les dicotylédones en 4 à 6 semaines tout en densifiant le gazon. AMM n°2150968, réservé usage professionnel. Attendre 4–6 semaines avant un semis de regarnissage',
  },
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

  {
    id: 'sierraform-allseason',
    name: 'Sierraform GT All Season 18-6-18',
    brand: 'ICL',
    category: 'fertilizer',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'entretien', label: 'Entretien (printemps → automne)', doseG_m2: 30, doseRange: '20–30 g/m²', note: 'Libération lente 6–8 semaines' },
    ],
    note: 'NPK 18-6-18 + 2 MgO + oligo-éléments — engrais complet double libération lente (technologies MU2 + Silk au silicium). Granulés très fins (0,7–1,4 mm), gazons tondus dès 6 mm. Gazons plus denses, résistants aux maladies et au stress hydrique. Polyvalent green / fairway / sport / ornement',
  },

  // Biostimulants / Activateurs sol
  {
    id: 'bacteriosol',
    name: 'Bacteriosol Universel',
    brand: 'SOBAC',
    category: 'biostim',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'entretien', label: 'Entretien / semis', doseG_m2: 30, doseRange: '30 g/m² min', note: 'Application bi-mensuelle — active la vie du sol' },
      { id: 'choc', label: 'Choc démarrage', doseG_m2: 50, doseRange: '50 g/m²', note: 'Sol très destructuré ou compacté' },
    ],
    note: 'Activateur biologique sol — structure et humus',
  },
  {
    id: 'agrosil-lr2',
    name: 'Agrosil LR2',
    brand: 'Compo Expert',
    category: 'biostim',
    defaultUsageId: 'creation',
    usages: [
      { id: 'creation', label: 'Création / placage (incorporation)', doseG_m2: 120, doseRange: '50–120 g/m²', note: 'À incorporer à la préparation du sol — arroser 15–20 mm après' },
      { id: 'decompactage', label: 'Après décompactage', doseG_m2: 100, doseRange: '50–100 g/m²' },
      { id: 'aeration', label: 'Gazon en place / aération', doseG_m2: 50, doseRange: '30–50 g/m²', note: 'Printemps et/ou automne après une aération' },
    ],
    note: 'Engrais biostimulant + améliorateur de sol — 20% phosphore biodisponible + 44% silice (SiO2). Stimule l\'enracinement profond, renforce la résistance aux stress (sécheresse, froid, piétinement), double la rétention en eau et améliore la structure du sol. Éviter tout engrais chloré (nuit aux colloïdes). Bien arroser après application',
  },
  {
    id: 'vegethumus',
    name: 'Vegethumus',
    brand: 'Frayssinet',
    category: 'biostim',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'entretien', label: 'Entretien (amendement)', doseG_m2: 200, doseRange: '200 g/m² (2 t/ha)', note: 'Dose standard — module selon le sol' },
    ],
    note: 'Amendement organique granulé (NPK 2-1,5-1 +2 MgO, 65% MO, rendement humigène 450 kg/t) + stimulateur racinaire OSYR + humo-phosphate — utilisable en Agriculture Biologique. Entretien et redressement de la fertilité du sol, relance la vie microbienne, stimule l\'enracinement. Granulation à froid, fabrication française',
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
      { id: 'entretien', label: 'Entretien préventif', doseL_ha: 25, bouillieL_ha: 500, doseMl_L: 25, doseRange: '25 L/ha', note: 'Bouillie de référence 400–600 L/ha' },
      { id: 'curatif', label: 'Curatif (stress installé)', doseL_ha: 50, bouillieL_ha: 500, doseMl_L: 50, doseRange: '50 L/ha', note: 'Dès symptômes — bouillie 400–600 L/ha' },
    ],
    note: 'Biostimulant foliaire — acides aminés + oligo-éléments. Bouillie de référence 400–600 L/ha',
  },
  {
    id: 'vitalnova-smx',
    name: 'Vitalnova SMX',
    brand: 'ICL',
    defaultUsageId: 'standard',
    usages: [
      { id: 'standard', label: 'Pulvérisation foliaire', doseL_ha: 10, bouillieL_ha: 600, doseMl_L: 10, doseRange: '5–10 L/ha', note: 'Bouillie 400–1000 L/ha — toute l\'année hors gel et forte chaleur, intervalle 15 j mini' },
    ],
    note: 'Concentré d\'algues marines — 10% Ascophyllum nodosum (acides aminés + oligo-éléments). Booster racinaire, accélère levée des semis, améliore résistance aux stress. Miscible avec Vitalnova Stressbuster / Silk',
  },
  {
    id: 'h2pro-trismart',
    name: 'H2Pro TriSmart',
    brand: 'ICL',
    defaultUsageId: 'entretien',
    usages: [
      { id: 'premiere', label: '1ʳᵉ application', doseL_ha: 25, bouillieL_ha: 800, doseMl_L: 25, note: 'Choc d\'humectation (taches sèches) — bouillie 600–1000 L/ha' },
      { id: 'entretien', label: 'Entretien mensuel', doseL_ha: 10, bouillieL_ha: 800, doseMl_L: 10, doseRange: '10 L/ha', note: 'Bouillie 600–1000 L/ha' },
    ],
    note: 'Agent mouillant triple action — +40% économie d\'eau. Bouillie de référence 600–1000 L/ha',
  },
  {
    id: 'h2pro-flowsmart',
    name: 'H2Pro FlowSmart',
    brand: 'ICL',
    defaultUsageId: 'mensuel',
    usages: [
      { id: 'mensuel', label: 'Mensuel anti Dry Patch', doseL_ha: 10, bouillieL_ha: 400, doseMl_L: 10, doseRange: '10 L/ha', note: 'Bouillie 250–600 L/ha' },
    ],
    note: 'Super pénétrant drainage — 1×/mois Dry Patch. Bouillie de référence 250–600 L/ha',
  },
  {
    id: 'kick-pro',
    name: 'Kick Pro',
    brand: 'Compo Expert',
    defaultUsageId: 'standard',
    usages: [
      { id: 'standard', label: 'Pulvérisation standard', doseL_ha: 2.8, bouillieL_ha: 800, doseMl_L: 2.8, doseRange: '2,5–2,8 L/ha', note: 'Gazons d\'ornement / fairways — bouillie 700–1000 L/ha' },
    ],
    note: 'Agent mouillant concentré — 58% sulfosuccinate. Bouillie de référence 700–1000 L/ha',
  },
  {
    id: 'kamasol',
    name: 'Kamasol Brillant Grün',
    brand: 'Compo Expert',
    defaultUsageId: 'foliaire',
    usages: [
      { id: 'foliaire', label: 'Engrais foliaire', doseL_ha: 50, bouillieL_ha: 600, doseMl_L: 50, doseRange: '40–60 L/ha', note: 'Bouillie 600–800 L/ha — concentration max 10% (100 ml/L)' },
    ],
    note: 'Engrais foliaire NPK 10-4-7 — coloration verte intense. Bouillie de référence 600–800 L/ha',
  },
  {
    id: 'vitanica-si',
    name: 'Vitanica Si',
    brand: 'Compo Expert',
    defaultUsageId: 'preventif',
    usages: [
      { id: 'preventif', label: 'Préventif stress hydrique', doseL_ha: 15, bouillieL_ha: 1000, doseMl_L: 15, doseRange: '10–20 L/ha', note: 'Fiche sans bouillie précisée — défaut 1000 L/ha' },
      { id: 'choc', label: 'Choc piétinement', doseL_ha: 20, bouillieL_ha: 1000, doseMl_L: 20, note: 'Fiche sans bouillie précisée — défaut 1000 L/ha' },
    ],
    note: 'Biostimulant foliaire NPK 5-3-7 + 10% silice + algue Ecklonia maxima — résistance stress hydrique et piétinement. Fiche sans bouillie : défaut 1000 L/ha',
  },
  {
    id: 'vitalnova-silk',
    name: 'Vitalnova SiLK',
    brand: 'ICL',
    defaultUsageId: 'standard',
    usages: [
      { id: 'standard', label: 'Pulvérisation foliaire', doseL_ha: 20, bouillieL_ha: 400, doseMl_L: 20, doseRange: '20 L/ha', note: 'Dans 400 L d\'eau — mars à novembre, 3–6 j avant compétition' },
    ],
    note: 'NPK 0-10-19 riche en silicate de potassium (6% silice) — sans azote. Améliore résistance sécheresse et maladies, renforce la feuille, port dressé (roule de balle). Effets visibles 3–5 j, durée ~4 semaines. Spécial gazon exposé aux maladies',
  },
  {
    id: 'vitanica-p3-extra',
    name: 'Vitanica P3 Extra',
    brand: 'Compo Expert',
    defaultUsageId: 'stress',
    usages: [
      { id: 'stress', label: 'Stress / compétition', doseL_ha: 30, bouillieL_ha: 500, doseMl_L: 30, doseRange: '20–30 L/ha', note: 'Dans 500 L d\'eau — green / sport en période de stress' },
      { id: 'placage', label: 'Gazon de placage', doseL_ha: 30, bouillieL_ha: 500, doseMl_L: 30, doseRange: '20–30 L/ha', note: 'À la mise en place pour enracinement rapide — bouillie 500 L/ha' },
    ],
    note: 'Engrais NPK 5-9-10 + oligo-éléments + 40% extrait de 2 algues (Ecklonia maxima + Ascophyllum nodosum) — biostimulant racinaire (équivalent auxines). Meilleure reprise après tonte rase / dégradations, résistance chaleur, froid, manque d\'eau. Associer à Kick Pro',
  },
  {
    id: 'vitanica-rz-bio',
    name: 'Vitanica RZ Bio',
    brand: 'Compo Expert',
    defaultUsageId: 'gazon_etabli',
    usages: [
      { id: 'semis', label: 'Semis de gazon', doseL_ha: 10, bouillieL_ha: 1000, doseMl_L: 10, doseRange: '10 L/ha (1%)', note: 'Dès le semis effectué' },
      { id: 'jeune_gazon', label: 'Jeune gazon', doseL_ha: 10, bouillieL_ha: 1000, doseMl_L: 10, doseRange: '10 L/ha (1%)', note: '1 à 5 apports / an' },
      { id: 'gazon_etabli', label: 'Gazon établi', doseL_ha: 20, bouillieL_ha: 1000, doseMl_L: 20, doseRange: '20 L/ha (1–2%)', note: 'Dans 600–1000 L bouillie/ha — sol à 14–15°C mini' },
    ],
    note: 'Biostimulant liquide utilisable en Agriculture Biologique — extrait d\'algue Ecklonia maxima + Bacillus R6CDX (biofilm racinaire) + oligo-éléments chélatés EDTA. Germination et installation accélérées, chevelu racinaire dense, résistance aux stress abiotiques',
  },
  {
    id: 'basfoliar-ferro-top-sl',
    name: 'Basfoliar Ferro Top SL',
    brand: 'Compo Expert',
    defaultUsageId: 'sport',
    usages: [
      { id: 'sport', label: 'Terrains de sport', doseL_ha: 30, bouillieL_ha: 600, doseMl_L: 30, doseRange: '30 L/ha', note: 'Dans 400–800 L d\'eau — ne pas arroser derrière' },
      { id: 'greens', label: 'Greens et départs', doseL_ha: 20, bouillieL_ha: 600, doseMl_L: 20, doseRange: '20 L/ha', note: 'Bouillie 400–800 L/ha' },
    ],
    note: 'Engrais foliaire liquide N 15-0-0 + 8% Fe + oligo-éléments — reverdissement très rapide avec peu de pousse. Idéal avant compétition ou en hiver (compense le manque de lumière). Ne pas appliquer par temps sec/chaud. Associable à Kick (1 L/ha) pour accélérer la pénétration du fer',
  },
  {
    id: 'basfoliar-top-n-sl',
    name: 'Basfoliar Top N SL',
    brand: 'Compo Expert',
    defaultUsageId: 'repete',
    usages: [
      { id: 'repete', label: 'Applications répétées', doseL_ha: 40, bouillieL_ha: 600, doseMl_L: 40, doseRange: '20–40 L/ha', note: 'Toutes les 2 à 4 semaines (spoon feeding) — bouillie 600–800 L/ha' },
      { id: 'unique', label: 'Application unique', doseL_ha: 60, bouillieL_ha: 600, doseMl_L: 60, doseRange: '50–60 L/ha', note: 'Faire suivre d\'un arrosage (4–5 mm) — bouillie 600–800 L/ha' },
    ],
    note: 'Engrais azoté liquide N 28 à action lente (60% de l\'azote en libération lente) — nutrition immédiate + longue durée, faible indice de salinité. Reverdissement avec croissance régulée. Appliquer le matin ou le soir, pas en plein soleil. Volume de bouillie 600–800 L/ha',
  },
  {
    id: 'xeox-frayssinet',
    name: 'XEOX (Stimulateur Croissance Racinaire)',
    brand: 'Frayssinet',
    defaultUsageId: 'gazon',
    usages: [
      { id: 'gazon', label: 'Gazon (placage / entretien / stress)', doseL_ha: 20, bouillieL_ha: 400, doseMl_L: 20, doseRange: '1–2 L / 1000 m²', note: '2 à 3 applications à 8–10 j, dans 300 L d\'eau mini + arrosage. Alternative : arrosage / goutte-à-goutte à 0,2% (2 ml/L)' },
    ],
    note: 'Stimulateur de croissance racinaire homologué (AMM n°1080002), utilisable en Agriculture Biologique — 40% de matière active OSYR. Protège les auxines et active la lignification : +41% de poids racinaire sur ray-grass. Assure l\'enracinement du gazon de placage, limite la régression racinaire sous stress (hydrique, thermique, piétinement, salinité), sécurise les semis de regarnissage',
  },
  {
    id: 'reverdi',
    name: 'Reverdi',
    brand: 'Gazoneo',
    defaultUsageId: 'antimousse',
    usages: [
      { id: 'antimousse', label: 'Reverdissement / anti-mousse', doseL_ha: 40, bouillieL_ha: 1000, doseMl_L: 40, doseRange: '40 ml/L (0,4 L / 100 m²)', note: 'Diluer 40 ml dans ~960 ml d\'eau. Scarifier 5–7 j après. Printemps + automne, > 5°C' },
    ],
    note: 'Solution d\'engrais à base de fer chélaté (4,5% Fe) — correcteur de chlorose ferrique. Reverdit le gazon, le densifie et limite la propagation des mousses et adventices sans acidifier le sol (corrige le pH). Ne pas appliquer par forte chaleur, grand froid ou pluie',
  },
  {
    id: 'feraway',
    name: 'Feraway Mousse Gazon',
    brand: 'Anorel',
    defaultUsageId: 'antimousse',
    usages: [
      { id: 'antimousse', label: 'Anti-mousse / reverdissement', doseL_ha: 100, bouillieL_ha: 1000, doseMl_L: 100, doseRange: '0,5–1 L / 100 m²', note: '1 L dans 10 L d\'eau pour 100 m². Sur herbe sèche et tondue, > 5°C. Scarifier 30 min après' },
    ],
    note: 'Engrais NK 6-0-4 + 2% fer chélaté IDHA biodégradable — effet indirect contre la mousse, action rapide. Sans danger pour enfants et animaux, ne tache pas les surfaces lisses, n\'acidifie pas le sol',
  },
  {
    id: 'vitarel',
    name: 'Vitarel Conditionneur de Sol',
    brand: 'Gazoneo',
    defaultUsageId: 'sol',
    usages: [
      { id: 'sol', label: 'Conditionneur de sol', doseL_ha: 25, bouillieL_ha: 1000, doseMl_L: 25, doseRange: '25 ml/L (1 L / 400 m²)', note: 'Pulvériser au sol, automne ou printemps. Idéal après scarif / carottage. Ne pas dépasser 30°C' },
    ],
    note: 'Conditionneur de sol pour micro-organismes (Bore 1% + Manganèse 1% + éléments traces) utilisable en Agriculture Biologique — relance les cycles du carbone et de l\'azote, optimise les apports d\'azote (moins de pertes par volatilisation). Idéal sols fatigués, pauvres, terres rapportées',
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

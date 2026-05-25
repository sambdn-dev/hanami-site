/**
 * types.ts — Types partagés pour le wizard /mon-chantier
 *
 * Ces types décrivent l'état du formulaire au fil des étapes,
 * et la forme du résultat (service recommandé + estimation).
 */

export type ServiceId = 'express' | 'reconstruction' | 'coaching'

export type EtatNiveau = 'coaching' | 'express' | 'reconstruction'

export type ObjectifId =
  | 'densifier'
  | 'renover'
  | 'entretien'
  | 'creation'

export type ArrosageReponse = 'oui' | 'non' | 'je-ne-sais-pas'

/** Niveau de complexité du terrain — impact sur la durée de travail */
export type ComplexiteId = 'simple' | 'moyenne' | 'elevee' | 'tres_elevee'

/** Niveau d'accès au jardin — impact sur la logistique (livraison, allers-retours) */
export type AccesId = 'facile' | 'moyen' | 'difficile'

export interface ChantierFormState {
  /** m² de pelouse */
  surface: number | null
  /** IDs des photos sélectionnées (max 4) */
  etatPhotos: string[]
  /** Objectif principal */
  objectif: ObjectifId | null
  /** Système d'arrosage automatique — qualification commerciale */
  arrosageAuto: ArrosageReponse | null
  /** Complexité du terrain (formes, arbres, massifs) — coefficient prix */
  complexite: ComplexiteId | null
  /** Facilité d'accès au jardin (escaliers, passage) — coefficient prix */
  acces: AccesId | null
  /** Adresse complète (label autocomplete BAN) — utile pour Sami dans l'email */
  adresseComplete: string
  /** Ville extraite de l'autocomplete (séparée pour le récap email) */
  ville: string
  /** Code postal — extrait de l'autocomplete, déclenche la bascule géo */
  codePostal: string
  /** Photos réelles uploadées par l'utilisateur (max 5) */
  photosFiles: UploadedPhoto[]
  /** Coordonnées finales */
  prenom: string
  email: string
  telephone: string
}

export interface UploadedPhoto {
  id: string
  file: File
  preview: string
  name: string
}

export interface ChantierResult {
  /** Service recommandé en priorité */
  serviceId: ServiceId
  /** Service alternatif proposé en cross-sell (Coaching pour Express) */
  alternativeServiceId: ServiceId | null
  /** Estimation chiffrée pour le service principal */
  estimation: PriceEstimation
  /** Tier de zone : 'free' | 'paid' (avec déplacement) | 'out' (hors zone) */
  zoneType: 'free' | 'paid' | 'out'
}

export interface PriceEstimation {
  /** Prix minimum TTC en euros (incluant frais de déplacement éventuels) */
  min: number
  /** Prix maximum TTC en euros (= min si forfait fixe) */
  max: number
  /** Unité d'affichage : 'forfait' | 'm2' | 'mois' */
  unit: 'forfait' | 'mois'
  /** Phrase descriptive : "350 m² × 8€/m²" */
  formula: string
  /** Si true, le prix est "à partir de" — affiche "dès" */
  fromOnly: boolean
  /** Frais de déplacement TTC (zone étendue uniquement, sinon 0) */
  fraisDeplacement: number
  /** Estimation avec option Terreau professionnel (Express uniquement) */
  withTerreau?: {
    min: number
    max: number
    formula: string
    /** Surcoût TTC apporté par l'option (pour affichage clair) */
    surcout: number
  }
}

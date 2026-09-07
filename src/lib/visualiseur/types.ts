/**
 * types.ts — Types partagés du Visualiseur IA (client + serveur)
 *
 * Ces types décrivent le contrat entre le composant client
 * (VisualizerOrchestrator) et les routes API /api/visualiser et
 * /api/visualiser-lead. Aucun import Node ici : le fichier doit rester
 * importable côté navigateur.
 */

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver'

/** Corps POST envoyé à /api/visualiser */
export interface VisualiserRequest {
  /** Photo compressée par compressPhoto() : data:image/jpeg;base64,... */
  image: string
  /** Saison cible (défaut : saison courante calculée côté serveur) */
  season?: Season
  /** Identifiant de session (localStorage) — sert au rate-limiting */
  sessionId: string
  /** Honeypot anti-bot : doit rester vide */
  company?: string
}

/** Réponse 200 de /api/visualiser */
export interface VisualiserResponse {
  /** Visuel transformé : data URL (réel) ou chemin statique (démo) */
  image: string
  /** true si généré en mode démo (pas de clé OpenAI) */
  stub: boolean
}

export type VisualiserErrorCode =
  | 'RATE_LIMIT'
  | 'TOO_LARGE'
  | 'PROVIDER'
  | 'INVALID'

export interface VisualiserError {
  error: string
  code: VisualiserErrorCode
}

/** Corps POST envoyé à /api/visualiser-lead (capture email) */
export interface VisualiserLeadRequest {
  email: string
  beforeImage?: string
  afterImage?: string
  season?: Season
  company?: string
}

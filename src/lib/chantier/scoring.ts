/**
 * scoring.ts — Logique de matching photos + objectif → service recommandé
 *
 * Règles (cumulatives, du plus sévère au plus léger) :
 *  1. Si objectif = "creation" OU 1+ photo niveau "reconstruction" → Reconstruction
 *  2. Sinon si 1+ photo niveau "express" → Express (alternative Coaching en cross-sell)
 *  3. Sinon → Coaching
 *
 * Cas particulier : si l'utilisateur n'a pas sélectionné de photo (ne devrait
 * pas arriver car min 1 requise), on bascule par défaut sur Coaching.
 */

import { getPhotoById } from './etats-photos'
import type { ObjectifId, ServiceId } from './types'

interface ScoringInput {
  etatPhotoIds: string[]
  objectif: ObjectifId | null
}

interface ScoringResult {
  serviceId: ServiceId
  /** Service alternatif proposé en cross-sell (uniquement pour Express) */
  alternativeServiceId: ServiceId | null
}

export function recommendService({ etatPhotoIds, objectif }: ScoringInput): ScoringResult {
  // Récupère les niveaux des photos sélectionnées
  const niveaux = etatPhotoIds
    .map(id => getPhotoById(id)?.niveau)
    .filter((n): n is NonNullable<typeof n> => n !== undefined)

  // Règle 1 : objectif "création sol nu" → Reconstruction direct
  if (objectif === 'creation') {
    return { serviceId: 'reconstruction', alternativeServiceId: null }
  }

  // Règle 1bis : au moins une photo de niveau reconstruction → Reconstruction
  if (niveaux.includes('reconstruction')) {
    return { serviceId: 'reconstruction', alternativeServiceId: null }
  }

  // Règle 2 : au moins une photo de niveau express → Express + cross-sell Coaching
  if (niveaux.includes('express')) {
    return { serviceId: 'express', alternativeServiceId: 'coaching' }
  }

  // Règle 3 : tout est en niveau coaching → Coaching
  return { serviceId: 'coaching', alternativeServiceId: null }
}

/**
 * Variante quand le code postal est hors zone 30 km Vésinet.
 * Express et Reconstruction nécessitent un déplacement → fallback sur Coaching
 * (qui marche partout en France via suivi en ligne).
 */
export function adjustForOutOfZone(reco: ScoringResult): ScoringResult {
  if (reco.serviceId === 'coaching') return reco
  return { serviceId: 'coaching', alternativeServiceId: null }
}

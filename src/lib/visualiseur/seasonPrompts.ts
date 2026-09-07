/**
 * seasonPrompts.ts — Instructions d'édition d'image par saison
 *
 * Pour un modèle d'ÉDITION d'image guidée par instruction (OpenAI
 * « ChatGPT Images 2.0 » / gpt-image-1), une seule instruction positive
 * suffit — pas besoin de negative prompt façon Stable Diffusion.
 *
 * SÉCURITÉ : le client n'envoie qu'une clé de saison (`ete`, `printemps`…).
 * C'est le SERVEUR qui mappe la clé vers l'instruction réelle envoyée au
 * modèle. Le texte du prompt n'est jamais fourni par le client → pas
 * d'injection de prompt possible.
 *
 * Fichier sans import Node : importable côté client (libellés des saisons).
 */

import type { Season } from './types'

/** Clause commune à toutes les saisons — préserve la scène, ne change QUE le gazon. */
const KEEP_SCENE =
  'Keep the house, trees, fences, paths, garden furniture, sky and the exact ' +
  'same camera angle, framing and perspective strictly identical. Only replace ' +
  'the lawn / grass area. Photorealistic result, natural lighting, no text, no ' +
  'logo, no watermark.'

export const SEASON_PROMPTS: Record<Season, { label: string; instruction: string }> = {
  printemps: {
    label: 'Printemps',
    instruction:
      'Transform the lawn in this photo into a lush, freshly mown spring lawn: ' +
      'dense, perfectly even, vibrant green grass with clean healthy edges, no ' +
      `weeds, no moss and no bare patches. ${KEEP_SCENE}`,
  },
  ete: {
    label: 'Été',
    instruction:
      'Transform the lawn in this photo into a perfectly maintained deep-green ' +
      'summer lawn: thick, uniform, well-watered healthy turf under warm sunlight, ' +
      `with no dry, yellow or bare patches. ${KEEP_SCENE}`,
  },
  automne: {
    label: 'Automne',
    instruction:
      'Transform the lawn in this photo into a healthy autumn lawn: still dense ' +
      'and green, cleanly raked with no fallen leaves lying on the grass, tidy ' +
      `edges. ${KEEP_SCENE}`,
  },
  hiver: {
    label: 'Hiver',
    instruction:
      'Transform the lawn in this photo into a resilient, well-kept winter lawn: ' +
      'still green, even and tidy under soft cool daylight, with no snow and no ' +
      `bare soil. ${KEEP_SCENE}`,
  },
}

/** Saison courante d'après le mois (hémisphère nord). */
export function currentSeason(now: Date): Season {
  const month = now.getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return 'printemps'
  if (month >= 6 && month <= 8) return 'ete'
  if (month >= 9 && month <= 11) return 'automne'
  return 'hiver'
}

/** Garde de type : valide une valeur inconnue comme Season. */
export function isSeason(value: unknown): value is Season {
  return (
    value === 'printemps' ||
    value === 'ete' ||
    value === 'automne' ||
    value === 'hiver'
  )
}

/**
 * postal-codes.ts — Zonage géographique en 2 tiers + 1 fallback
 *
 *   - Zone GRATUITE : toute l'Île-de-France (75, 77, 78, 91, 92, 93, 94, 95)
 *     → Express et Reconstruction sans frais de déplacement
 *
 *   - Zone ÉTENDUE : limitrophes IdF dans un rayon ~1h de route du Vésinet
 *     (27 Eure, 28 Eure-et-Loir, 45 Loiret nord, 60 Oise sud)
 *     → Express et Reconstruction avec forfait déplacement 100 € TTC
 *
 *   - HORS ZONE : reste de la France
 *     → Bascule auto sur Coaching annuel (suivi 100 % en ligne)
 *
 * Note MVP : on filtre uniquement par préfixe département. Le 28 sud (Châteaudun)
 * et le 45 sud (Orléans) sont à 1h30+ et seraient théoriquement à exclure, mais
 * on accepte cette imprécision pour ne pas rater de leads — Sami peut décliner
 * au cas par cas si la distance est trop grande.
 */

export type ZoneType = 'free' | 'paid' | 'out'

const FREE_DEPTS = new Set(['75', '77', '78', '91', '92', '93', '94', '95'])
const PAID_DEPTS = new Set(['27', '28', '45', '60'])

/** Frais de déplacement TTC pour la zone étendue */
export const TRAVEL_FEE_PAID_ZONE = 100

/** Détermine le tier de zone à partir d'un code postal 5 chiffres */
export function getZoneType(codePostal: string): ZoneType {
  const cleaned = codePostal.trim()
  if (!/^\d{5}$/.test(cleaned)) return 'out'
  const dept = cleaned.slice(0, 2)
  if (FREE_DEPTS.has(dept)) return 'free'
  if (PAID_DEPTS.has(dept)) return 'paid'
  return 'out'
}

/** True si le CP est dans la zone d'intervention sur place (free OU paid) */
export function isInZone(codePostal: string): boolean {
  const zone = getZoneType(codePostal)
  return zone === 'free' || zone === 'paid'
}

/** Validation format code postal français (5 chiffres) */
export function isValidCodePostalFormat(codePostal: string): boolean {
  return /^\d{5}$/.test(codePostal.trim())
}

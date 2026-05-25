/**
 * complexite.ts — Coefficients de complexité du terrain et d'accès
 *
 * Ces coefficients multiplient le tarif Express et Reconstruction
 * (services sur place uniquement — le Coaching n'est pas affecté car
 * 100 % en ligne).
 *
 * Bases retenues d'après l'expérience Sami sur le temps réel à passer :
 *
 * COMPLEXITÉ (formes, obstacles, finitions de bordures)
 *  - simple       : zone régulière, peu d'obstacles                ×1.00
 *  - moyenne      : quelques arbres / massifs, contours légèrement courbes  ×1.10
 *  - elevee       : multiples arbres + massifs, formes courbes      ×1.20
 *  - tres_elevee  : pas japonais serrés, bordures découpées        ×1.35
 *
 * ACCÈS (logistique de livraison + allers-retours pendant le chantier)
 *  - facile     : entrée plain-pied, dépôt camion à proximité   ×1.00
 *  - moyen      : quelques marches, dépôt à <20 m              ×1.08
 *  - difficile  : escaliers, passage étroit, dépôt éloigné     ×1.20
 *
 * Effet cumulatif (multiplicatif). Exemples :
 *   - Simple + facile           → 1.00 × 1.00 = 1.00 (référence)
 *   - Moyenne + moyen           → 1.10 × 1.08 = 1.19 (+19 %)
 *   - Très élevée + difficile   → 1.35 × 1.20 = 1.62 (+62 %)
 *
 * Coefficients calibrés "doux" pour le démarrage. À augmenter quand le
 * volume de demandes le permettra (Google My Business, bouche-à-oreille...).
 */

import type { ComplexiteId, AccesId } from './types'

export interface ComplexiteOption {
  id: ComplexiteId
  label: string
  description: string
  coefficient: number
  /** Pictogramme représentatif */
  icon: string
}

export interface AccesOption {
  id: AccesId
  label: string
  description: string
  coefficient: number
  icon: string
}

export const COMPLEXITES: ComplexiteOption[] = [
  {
    id: 'simple',
    label: 'Simple',
    description: 'Zone régulière (carré, rectangle), peu d\'obstacles',
    coefficient: 1.00,
    icon: '⬛',
  },
  {
    id: 'moyenne',
    label: 'Moyenne',
    description: 'Quelques arbres ou massifs, contours légèrement courbes',
    coefficient: 1.10,
    icon: '🌳',
  },
  {
    id: 'elevee',
    label: 'Élevée',
    description: 'Multiples arbres et massifs, formes courbes',
    coefficient: 1.20,
    icon: '🌲',
  },
  {
    id: 'tres_elevee',
    label: 'Très élevée',
    description: 'Pas japonais serrés, bordures découpées, terrain morcelé',
    coefficient: 1.35,
    icon: '🪨',
  },
]

export const ACCES: AccesOption[] = [
  {
    id: 'facile',
    label: 'Facile',
    description: 'Entrée plain-pied, dépôt camion à proximité immédiate',
    coefficient: 1.00,
    icon: '🚪',
  },
  {
    id: 'moyen',
    label: 'Moyen',
    description: 'Quelques marches, dépôt à moins de 20 m',
    coefficient: 1.08,
    icon: '🪜',
  },
  {
    id: 'difficile',
    label: 'Difficile',
    description: 'Escaliers, passage étroit, dépôt éloigné ou en hauteur',
    coefficient: 1.20,
    icon: '⛰️',
  },
]

/** Coefficient total = complexité × accès. 1.0 si non renseigné. */
export function getCombinedCoefficient(
  complexite: ComplexiteId | null,
  acces: AccesId | null,
): { value: number; complexiteLabel: string; accesLabel: string; complexiteCoeff: number; accesCoeff: number } {
  const c = COMPLEXITES.find(x => x.id === complexite) ?? COMPLEXITES[0]
  const a = ACCES.find(x => x.id === acces) ?? ACCES[0]
  return {
    value: c.coefficient * a.coefficient,
    complexiteLabel: c.label,
    accesLabel: a.label,
    complexiteCoeff: c.coefficient,
    accesCoeff: a.coefficient,
  }
}

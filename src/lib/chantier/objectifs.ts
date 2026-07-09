/**
 * objectifs.ts — Les 4 objectifs proposés à l'étape 3 du wizard
 *
 * Croisé avec les états sélectionnés à l'étape 2, ils alimentent
 * la logique de scoring (cf. scoring.ts).
 */

import type { ObjectifId } from './types'

export interface Objectif {
  id: ObjectifId
  label: string
  description: string
}

export const OBJECTIFS: Objectif[] = [
  {
    id: 'densifier',
    label: 'Densifier et verdir',
    description: 'Ma pelouse existe mais elle est terne, clairsemée ou ennuyeuse',
  },
  {
    id: 'renover',
    label: 'Rénover complètement',
    description: 'Je veux une nouvelle pelouse digne de ce nom',
  },
  {
    id: 'entretien',
    label: 'Entretien régulier',
    description: 'Ma pelouse va bien, je veux la garder en forme toute l\'année',
  },
  {
    id: 'creation',
    label: 'Création (sol nu)',
    description: 'Je pars de zéro — terre nue, terrain à aménager',
  },
]

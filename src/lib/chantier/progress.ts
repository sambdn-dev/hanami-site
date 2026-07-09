/**
 * progress.ts — Source unique de vérité pour la progression du wizard.
 *
 * `isStepComplete` dérive l'état "complété" d'une étape UNIQUEMENT depuis les
 * données du formulaire — jamais depuis le fait de l'avoir simplement visitée.
 * C'est ce qui empêche une étape sautée d'apparaître cochée.
 *
 * `computeFrontier` renvoie la première étape de saisie non complétée : on
 * autorise la navigation libre vers tout ce qui est ≤ frontière (revenir
 * modifier une réponse, ou avancer d'un cran), mais on bloque les sauts
 * par-dessus une étape requise encore vide.
 *
 * Les index sont alignés sur STEP_DEFS dans ChantierWizard.tsx :
 *   0 Surface · 1 État · 2 Objectif · 3 Complexité & accès · 4 Arrosage
 *   5 Ville · 6 Photos (facultatif) · 7 Coordonnées · 8 Estimation
 */

import { isValidCodePostalFormat } from './postal-codes'
import type { ChantierFormState } from './types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Dernier index d'étape de SAISIE (Coordonnées). L'étape 8 = Estimation est
 *  un écran terminal, jamais "complété" tant que le formulaire n'est pas envoyé. */
export const LAST_INPUT_STEP = 7

/** Étape facultative (upload de photos) : elle ne bloque jamais la progression
 *  vers l'étape suivante, même vide. */
export const OPTIONAL_PHOTOS_STEP = 6

/** Le téléphone est stocké avec l'indicatif ("+33 6 12 34 56 78").
 *  On valide large : indicatif (1-3 chiffres) + numéro local (6-15). */
function isTelComplete(stored: string): boolean {
  const digits = stored.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 18
}

/** Une étape est "complète" (= cochée) si ses données sont réellement saisies.
 *  L'étape Photos (6) étant facultative, elle n'est cochée que si au moins une
 *  photo a été ajoutée — mais elle ne bloque pas la progression (voir frontière). */
export function isStepComplete(index: number, s: ChantierFormState): boolean {
  switch (index) {
    case 0: return s.surface !== null && s.surface > 0 && s.surface <= 50_000
    case 1: return s.etatPhotos.length >= 1
    case 2: return s.objectif !== null
    case 3: return s.complexite !== null && s.acces !== null
    case 4: return s.arrosageAuto !== null
    case 5: return isValidCodePostalFormat(s.codePostal)
    case 6: return s.photosFiles.length > 0
    case 7: return s.prenom.trim().length >= 2 && EMAIL_REGEX.test(s.email.trim()) && isTelComplete(s.telephone)
    default: return false // 8 = Estimation
  }
}

/** Tableau de booléens de complétude pour les 9 entrées de STEP_DEFS. */
export function computeCompleted(s: ChantierFormState, total: number): boolean[] {
  return Array.from({ length: total }, (_, i) => isStepComplete(i, s))
}

/** Première étape REQUISE non complétée (bornée à LAST_INPUT_STEP).
 *  Détermine jusqu'où la navigation est autorisée. L'étape facultative (Photos)
 *  n'arrête jamais la frontière, même vide — on peut donc l'ignorer et continuer. */
export function computeFrontier(s: ChantierFormState): number {
  for (let i = 0; i <= LAST_INPUT_STEP; i++) {
    if (i === OPTIONAL_PHOTOS_STEP) continue
    if (!isStepComplete(i, s)) return i
  }
  return LAST_INPUT_STEP
}

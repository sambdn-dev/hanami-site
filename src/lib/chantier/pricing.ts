/**
 * pricing.ts — Calcul du prix estimatif TTC pour un service donné
 *
 * Tarifs (TTC, validés par Sami) :
 *
 *  - Express, sans option         :  6 €/m²
 *  - Express + Terreau pro        : 10 €/m²  (+4 €/m² couvre matières + labor :
 *                                            commande, livraison, ouverture des
 *                                            sacs, remplissage spreader, épandage)
 *  - Reconstruction               : 15–25 €/m² TTC (fourchette complexité variable)
 *  - Coaching                     : 29 €/mois TTC (forfait fixe)
 *
 *  + Forfait déplacement 100 € TTC pour zone étendue (Express + Reconstruction).
 *
 * L'estimation Express renvoie systématiquement les 2 prix (sans / avec terreau)
 * dans `withTerreau`, pour les afficher côte à côte dans le résultat et laisser
 * le visiteur visualiser l'upsell.
 *
 * Format des montants : Intl.NumberFormat 'fr-FR' (espace comme séparateur
 * de milliers, pas de décimales sauf si nécessaire).
 */

import type { PriceEstimation, ServiceId } from './types'
import { TRAVEL_FEE_PAID_ZONE, type ZoneType } from './postal-codes'

const PRIX_EXPRESS_BASE_M2 = 6
const PRIX_EXPRESS_TERREAU_M2 = 10
const PRIX_RECO_MIN_M2 = 15
const PRIX_RECO_MAX_M2 = 25
const PRIX_COACHING_MOIS = 29

/**
 * Calcule l'estimation TTC pour un service.
 * Pour Express et Reconstruction en zone "paid", on ajoute un forfait
 * déplacement de 100 € au prix total. Le Coaching n'est pas concerné
 * (suivi 100 % en ligne).
 */
export function computeEstimation(
  serviceId: ServiceId,
  surface: number,
  zoneType: ZoneType = 'free',
): PriceEstimation {
  const needsTravel = serviceId !== 'coaching' && zoneType === 'paid'
  const fraisDeplacement = needsTravel ? TRAVEL_FEE_PAID_ZONE : 0
  const travelSuffix = needsTravel ? ` + ${TRAVEL_FEE_PAID_ZONE} € forfait déplacement` : ''

  switch (serviceId) {
    case 'express': {
      const base = surface * PRIX_EXPRESS_BASE_M2
      const withTerreauTotal = surface * PRIX_EXPRESS_TERREAU_M2
      return {
        min: base + fraisDeplacement,
        max: base + fraisDeplacement,
        unit: 'forfait',
        formula: `${formatNumber(surface)} m² × ${PRIX_EXPRESS_BASE_M2} €/m² TTC${travelSuffix}`,
        fromOnly: true,
        fraisDeplacement,
        withTerreau: {
          min: withTerreauTotal + fraisDeplacement,
          max: withTerreauTotal + fraisDeplacement,
          formula: `${formatNumber(surface)} m² × ${PRIX_EXPRESS_TERREAU_M2} €/m² TTC${travelSuffix}`,
          surcout: withTerreauTotal - base,
        },
      }
    }

    case 'reconstruction': {
      const min = surface * PRIX_RECO_MIN_M2
      const max = surface * PRIX_RECO_MAX_M2
      return {
        min: min + fraisDeplacement,
        max: max + fraisDeplacement,
        unit: 'forfait',
        formula: `${formatNumber(surface)} m² × ${PRIX_RECO_MIN_M2}–${PRIX_RECO_MAX_M2} €/m² TTC selon la complexité du terrain${travelSuffix}`,
        fromOnly: false,
        fraisDeplacement,
      }
    }

    case 'coaching': {
      return {
        min: PRIX_COACHING_MOIS,
        max: PRIX_COACHING_MOIS,
        unit: 'mois',
        formula: 'Forfait mensuel TTC, quel que soit la surface',
        fromOnly: true,
        fraisDeplacement: 0,
      }
    }
  }
}

/** Formate un nombre en euros : 2800 → "2 800 €" */
export function formatPrice(amount: number): string {
  return `${formatNumber(amount)} €`
}

/** Formate un nombre brut : 2800 → "2 800" */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

/** Affichage compact d'une estimation : "2 800 € TTC" ou "5 250 – 8 750 € TTC" */
export function formatEstimation(est: PriceEstimation): string {
  if (est.unit === 'mois') {
    return `${formatPrice(est.min)}/mois TTC`
  }
  if (est.min === est.max) {
    return `${formatPrice(est.min)} TTC`
  }
  return `${formatPrice(est.min)} – ${formatPrice(est.max)} TTC`
}

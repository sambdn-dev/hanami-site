/**
 * etats-photos.ts — Les 10 photos d'états de pelouse présentées à l'étape 2
 *
 * L'utilisateur choisit 1 à 4 photos parmi les 10 pour décrire son gazon.
 * Chaque photo est taggée avec un niveau de service (coaching/express/reconstruction)
 * et un label court affiché dans l'email récap.
 *
 * Photos self-hostées dans /public/images/etats-pelouse/ (sourcées sur Unsplash,
 * libres de droits commercial). Sami peut remplacer les fichiers individuellement
 * par ses propres photos clients sans toucher au code.
 */

import type { EtatNiveau } from './types'

export interface EtatPhoto {
  id: string
  /** Chemin public de l'image (depuis /public) */
  src: string
  /** Texte alternatif décrivant l'état */
  alt: string
  /** Label court affiché sur la carte */
  label: string
  /** Niveau de service correspondant */
  niveau: EtatNiveau
}

/**
 * Les 10 photos couvrent tout le spectre :
 * - 2 niveaux "coaching" (pelouse correcte à entretenir)
 * - 6 niveaux "express" (mousse, jaune, clairsemé, mauvaises herbes, sol tassé, cumul)
 * - 2 niveaux "reconstruction" (terre nue, bosses)
 */
export const ETAT_PHOTOS: EtatPhoto[] = [
  {
    id: 'pelouse-dense',
    src: '/images/etats-pelouse/01-pelouse-dense.jpg',
    alt: 'Pelouse dense et verte',
    label: 'Pelouse dense et verte',
    niveau: 'coaching',
  },
  {
    id: 'pelouse-terne',
    src: '/images/etats-pelouse/02-pelouse-terne.jpg',
    alt: 'Pelouse correcte mais terne',
    label: 'Correcte mais terne',
    niveau: 'coaching',
  },
  {
    id: 'mousse',
    src: '/images/etats-pelouse/03-mousse.jpg',
    alt: 'Mousse verte épaisse',
    label: 'Mousse épaisse',
    niveau: 'express',
  },
  {
    id: 'clairsemee',
    src: '/images/etats-pelouse/04-clairsemee.jpg',
    alt: 'Pelouse avec zones clairsemées et chauves',
    label: 'Zones clairsemées',
    niveau: 'express',
  },
  {
    id: 'jaune',
    src: '/images/etats-pelouse/05-jaune.jpg',
    alt: 'Pelouse jaunie par la sécheresse',
    label: 'Taches jaunes / sécheresse',
    niveau: 'express',
  },
  {
    id: 'mauvaises-herbes',
    src: '/images/etats-pelouse/06-mauvaises-herbes.jpg',
    alt: 'Pelouse envahie de mauvaises herbes et pissenlits',
    label: 'Mauvaises herbes',
    niveau: 'express',
  },
  {
    id: 'sol-tasse',
    src: '/images/etats-pelouse/07-sol-tasse.jpg',
    alt: 'Sol tassé et piétiné',
    label: 'Sol tassé / piétinement',
    niveau: 'express',
  },
  {
    id: 'cumul',
    src: '/images/etats-pelouse/08-cumul.jpg',
    alt: 'Pelouse cumulant mousse, jaune et zones clairsemées',
    label: 'Mousse + jaune + clairsemé',
    niveau: 'express',
  },
  {
    id: 'terre-nue',
    src: '/images/etats-pelouse/09-terre-nue.jpg',
    alt: 'Terre nue, sans gazon',
    label: 'Terre nue / sol à reprendre',
    niveau: 'reconstruction',
  },
  {
    id: 'bosses',
    src: '/images/etats-pelouse/10-bosses.jpg',
    alt: 'Terrain bosselé avec niveaux irréguliers',
    label: 'Bosses et creux',
    niveau: 'reconstruction',
  },
]

/** Récupère une photo par son id (utilisé pour l'affichage et l'email) */
export function getPhotoById(id: string): EtatPhoto | undefined {
  return ETAT_PHOTOS.find(p => p.id === id)
}

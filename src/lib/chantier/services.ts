/**
 * services.ts — Définition des 3 services Hanami proposés dans la simulation
 *
 * Source : flyer Hanami (cf. design system) — tous les prix sont TTC.
 *
 * Express        = scarification + semis généralisé, tarif dégressif (cf. pricing.ts), 1/2 journée
 * Reconstruction = décapage + apport terre + semis, 15-25€/m² TTC, dès 2 jours
 * Coaching       = plan 12 mois + protocole personnalisé, dès 29€/mois TTC
 */

import type { ServiceId } from './types'

export interface Service {
  id: ServiceId
  /** Tag affiché en uppercase au-dessus du nom (ex: "EXPRESS") */
  tag: string
  /** Nom du service affiché en titre */
  nom: string
  /** Sous-titre court (ex: "Scarification & semis généralisé") */
  sousTitre: string
  /** Phrase d'accroche courte */
  accroche: string
  /** Liste des prestations incluses (cochées) */
  inclus: string[]
  /** Options présentées sur le flyer (info uniquement, non chiffrées dans le wizard) */
  options?: string[]
  /** Délai sur place affiché */
  delai: string
  /** Pour qui ce service est conçu */
  pourQui: string
}

export const SERVICES: Record<ServiceId, Service> = {
  express: {
    id: 'express',
    tag: 'EXPRESS',
    nom: 'Scarification & semis généralisé',
    sousTitre: 'Rénovation rapide pour gazon dégradé',
    accroche: 'Sol structuré, mousse, zones clairsemées — on remet votre pelouse à niveau en quelques heures.',
    inclus: [
      'Mesure précise de la surface au cm² près par capteurs inertiels professionnels',
      'Tonte courte de préparation',
      'Scarification intensive professionnelle et nettoyage complet',
      'Semis professionnel adapté à votre configuration',
      'Activateur biologique de sol + biostimulants',
      'Visite J+21 · 1ʳᵉ tonte + engrais racinaire',
    ],
    options: [
      'Terreau professionnel au-dessus des graines pour sécuriser la levée',
      'Abonnement coaching annuel',
    ],
    delai: 'Dès 1/2 journée sur place',
    pourQui: 'Gazon existant à rénover sans gros travaux de terrassement',
  },
  reconstruction: {
    id: 'reconstruction',
    tag: 'RECONSTRUCTION',
    nom: 'Reconstruction de terrain',
    sousTitre: 'Pour les terrains très irréguliers',
    accroche: 'Sol dégradé, niveaux irréguliers, mousse épaisse — on repart sur des bases saines.',
    inclus: [
      'Mesure précise de la surface au cm² près par capteurs inertiels professionnels',
      'Décapage 2 cm à la mini-pelle + export camion',
      'Terre végétale amendée ciblée + nivellement',
      'Semis adapté + biostimulants + agent mouillant',
      'Visite J+21 · 1ʳᵉ tonte + engrais racinaire',
    ],
    options: ['Abonnement coaching annuel'],
    delai: 'Dès 2 jours sur place',
    pourQui: 'Terrain très dégradé ou avec niveaux à reprendre',
  },
  coaching: {
    id: 'coaching',
    tag: 'COACHING ANNUEL',
    nom: 'Coaching Hanami',
    sousTitre: 'Pour ceux qui veulent jardiner eux-mêmes',
    accroche: 'On vous dit quoi faire, quand le faire, comment le faire — et on vous donne accès aux produits pros que vous ne trouverez pas en jardinerie.',
    inclus: [
      'Plan 3D zone par zone',
      'Protocole Hanami 100 % personnalisé sur 12 mois',
      'Suivi 100 % en ligne',
      'Recommandations produits et dosages exacts',
    ],
    delai: 'Démarrage immédiat',
    pourQui: 'Particulier autonome qui veut un suivi expert toute l\'année',
  },
}

/**
 * presets.ts — Codes de pré-remplissage des zones de la calculatrice.
 *
 * MVP sans backend : un code à 4 chiffres charge un jeu de zones prédéfini.
 * Deux sources, résolues dans cet ordre par le composant :
 *   1. CALC_PRESETS ci-dessous — codes « officiels » gérés par Hanami
 *      (les tiens + ceux de tes clients). Présents dans le bundle → valables
 *      sur n'importe quel appareil.
 *   2. Codes enregistrés par le visiteur dans SON navigateur (localStorage,
 *      cf. HanamiCalculator). Ne quittent pas l'appareil.
 *
 * ⚠️ CONFIDENTIALITÉ — À LIRE avant d'ajouter un client.
 *    Ces presets partent dans le JavaScript PUBLIC du site : n'importe qui peut
 *    lire tous les libellés et surfaces (les codes sont triviaux à énumérer).
 *    Ne mets donc PAS ici l'identité réelle d'un client (nom, commune…) : c'est
 *    de la donnée personnelle publiée sans consentement. Deux options propres :
 *      1. Libellé NON identifiant (« Grand jardin — 600 m² ») + code non deviné.
 *      2. Mieux : gérer les clients derrière l'espace-client authentifié (V2).
 *    Les entrées ci-dessous sont des EXEMPLES anonymisés — remplace-les.
 *
 * Pour AJOUTER UN CLIENT : copie un bloc, choisis un code à 4 chiffres unique
 * (idéalement pas séquentiel), mets ses zones (nom libre + surface en m²). La
 * `sprayerCapacity` est optionnelle (défaut 15 L si absente).
 */

export interface PresetZone {
  /** Nom de la zone. NE JAMAIS laisser vide sur un preset à PLUSIEURS zones :
   *  un nom vide s'affiche comme « Zone N » où N est la POSITION dans le
   *  tableau, pas une identité stable — si le client supprime la 1ʳᵉ zone,
   *  toutes les suivantes remontent d'un cran et se renomment (« Zone 2 »
   *  devient « Zone 1 »), ce qui rend le suivi impossible à qui traite ses
   *  zones une par une. Toujours mettre un nom réel et fixe (ex. 'Zone 1',
   *  'Avant', 'Talus'…) qui reste vrai quel que soit ce que le client
   *  supprime ensuite. Un nom vide n'est acceptable que pour un preset à
   *  UNE seule zone (pas d'ambiguïté de position possible). */
  name: string
  /** Surface en m² (chaîne, comme dans le formulaire) */
  surface: string
}

export interface CalcPreset {
  /** Libellé affiché à la confirmation de chargement (ex. « Susan D. — Le Vésinet ») */
  label: string
  zones: PresetZone[]
  /** Capacité du pulvérisateur en L (optionnel) */
  sprayerCapacity?: string
}

export const CALC_PRESETS: Record<string, CalcPreset> = {
  // ── Hanami (Sami) ────────────────────────────────────────────────
  '2016': {
    label: 'Mes zones (Hanami)',
    zones: [
      { name: 'Zone 1', surface: '80' },
      { name: 'Zone 2', surface: '142' },
      { name: 'Zone 3', surface: '152' },
      { name: 'Zone 4', surface: '203' },
      { name: 'Zone 5', surface: '90' },
    ],
  },

  // ── Clients (EXEMPLES anonymisés — cf. avertissement en tête) ─────
  // Remplace par tes vrais clients avec des libellés NON identifiants et des
  // codes que tu leur communiques directement.
  '7204': {
    label: 'Grand jardin — 600 m²',
    zones: [{ name: 'Jardin', surface: '600' }],
  },
  '5183': {
    label: 'Petit jardin — 170 m²',
    zones: [{ name: 'Jardin', surface: '170' }],
  },
}

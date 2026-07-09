/**
 * tips.ts — Astuces « Le saviez-vous ? » affichées pendant la génération IA
 *
 * La transformation prend ~10-20 s : on occupe l'attente avec des faits
 * gazon utiles (valeur pédagogique + patience). Rotation côté client.
 */

export const LOADING_TIPS: readonly string[] = [
  'Un gazon dense est la meilleure barrière naturelle contre les mauvaises herbes.',
  'Tondre trop court affaiblit le gazon et laisse la place à la mousse.',
  "La règle d'or : ne jamais couper plus d'un tiers de la hauteur en une tonte.",
  'Un sol bien aéré absorbe mieux l\'eau et limite le ruissellement.',
  'Arroser peu souvent mais en profondeur pousse les racines vers le bas.',
  'Un gazon en bonne santé capte le carbone et rafraîchit votre jardin l\'été.',
  'Laisser les tontes fines sur place (mulching) nourrit naturellement le sol.',
  'La scarification de printemps retire le feutre et relance la pousse.',
] as const

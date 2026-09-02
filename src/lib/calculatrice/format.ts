/**
 * format.ts — Formatage des nombres pour l'affichage et les exports.
 *
 * Les calculs internes produisent des chaînes issues de toFixed(2) : "4.00",
 * "60.00", "1.50". Affichées telles quelles, elles donnent « 4.00
 * pulvérisateurs » — verbeux et anglophone. `fmt` supprime les zéros inutiles
 * et applique la virgule décimale française : 4 · 60 · 1,5.
 */

/** Formate un nombre (ou une chaîne numérique) à la française, sans zéros
 *  décimaux inutiles. `maxDec` borne le nombre de décimales affichées.
 *  Retourne la valeur d'origine telle quelle si elle n'est pas numérique. */
export function fmt(value: number | string, maxDec = 2): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(n)) return String(value)
  return n.toLocaleString('fr-FR', { maximumFractionDigits: maxDec })
}

/** Pluriel simple : `plural(2, 'plein')` → "pleins". */
export function plural(count: number, word: string, suffix = 's'): string {
  return count > 1 ? `${word}${suffix}` : word
}

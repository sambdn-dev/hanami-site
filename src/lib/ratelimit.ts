/**
 * ratelimit.ts — Limiteur de débit en mémoire (fenêtre glissante)
 *
 * Chaque génération IA a un coût : on plafonne les appels par IP et par
 * session pour éviter les abus et maîtriser la facture.
 *
 * ⚠️ LIMITE CONNUE : l'état vit en mémoire du process serverless. Il est
 * donc par-instance et remis à zéro à chaque cold start. C'est suffisant
 * pour un garde-fou de coût en V1, mais PAS une protection de sécurité.
 * V2 : passer sur un store durable et partagé (Vercel KV / Upstash Redis).
 */

type Timestamps = number[]

const store = new Map<string, Timestamps>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

/**
 * Autorise au plus `limit` évènements par `windowMs` pour une `key` donnée.
 *
 * @param key      identifiant du bucket (ex: `ip:1.2.3.4`)
 * @param limit    nombre max d'évènements dans la fenêtre
 * @param windowMs largeur de la fenêtre glissante en ms
 * @param now      horodatage courant (Date.now()) — injecté pour testabilité
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): RateLimitResult {
  const cutoff = now - windowMs
  const recent = (store.get(key) ?? []).filter((ts) => ts > cutoff)

  if (recent.length >= limit) {
    store.set(key, recent)
    return { allowed: false, remaining: 0 }
  }

  recent.push(now)
  store.set(key, recent)

  // Purge opportuniste pour éviter la croissance mémoire non bornée.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      const pruned = v.filter((ts) => ts > cutoff)
      if (pruned.length === 0) store.delete(k)
      else store.set(k, pruned)
    }
  }

  return { allowed: true, remaining: limit - recent.length }
}

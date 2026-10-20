/** Consent is denied until Axeptio has restored or received a visitor's choice.
 * Old hanami-cookies-prefs values intentionally do not grant Axeptio consent.
 */
export interface SiteConsent { analytics: boolean; performance: boolean }
const denied: SiteConsent = { analytics: false, performance: false }
let current = denied
const listeners = new Set<() => void>()

export function getConsent() { return current }
export function getServerConsent() { return denied }
export function subscribeConsent(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
export function setConsent(next: SiteConsent) {
  if (current.analytics === next.analytics && current.performance === next.performance) return
  current = next
  listeners.forEach(listener => listener())
}
export function hasAnalyticsConsent() { return typeof window !== 'undefined' && current.analytics }
export function hasPerformanceConsent() { return typeof window !== 'undefined' && current.performance }

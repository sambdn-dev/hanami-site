import { createHmac, randomBytes } from 'node:crypto'

export const SIMULATION_COOKIE = 'hanami_lawn_session'
export const SIMULATION_MAX_BODY = 3 * 1024 * 1024
export const SIMULATION_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
}
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
const PATH = new RegExp(`^(${UUID})(?:/(start|image|contact))?$`, 'i')

export function simulationPath(segments: string[], method: string) {
  const path = segments.join('/')
  if (!path) return method === 'GET' || method === 'POST' ? '' : null
  const match = PATH.exec(path)
  if (!match) return null
  const action = match[2]
  if ((!action && ['GET', 'DELETE'].includes(method)) ||
    (action === 'image' && method === 'GET') ||
    (action === 'start' && method === 'POST') ||
    (action === 'contact' && method === 'POST')) return path.toLowerCase()
  return null
}

export function simulationOriginAllowed(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin) return !['POST', 'DELETE'].includes(request.method)
  try {
    const source = new URL(origin)
    const target = new URL(request.url)
    // Next may normalize a local request URL to localhost while retaining the
    // browser-facing Host. Never trust a caller-supplied forwarded host here.
    return source.protocol === target.protocol && source.host === (request.headers.get('host') || target.host)
  } catch { return false }
}

export function simulationIdentity(cookie: string | undefined, ip: string, secret: string) {
  const session = cookie && /^[a-f0-9]{64}$/.test(cookie) ? cookie : randomBytes(32).toString('hex')
  const digest = (label: string, value: string) => createHmac('sha256', secret).update(`${label}:${value}`).digest('hex')
  return { session, sessionHash: digest('session', session), visitorHash: digest('visitor', ip) }
}

export function simulationBackend(value: string | undefined, development = false) {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return null
    if (url.protocol !== 'https:' && !(development && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) return null
    return url.origin
  } catch { return null }
}

export async function boundedSimulationBody(request: Request, limit = SIMULATION_MAX_BODY): Promise<Uint8Array> {
  if (Number(request.headers.get('content-length')) > limit) throw new Error('FILE_TOO_LARGE')
  if (!request.body) return new Uint8Array()
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > limit) { await reader.cancel(); throw new Error('FILE_TOO_LARGE') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
  return body
}

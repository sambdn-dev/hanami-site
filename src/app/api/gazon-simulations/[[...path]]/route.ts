import { cookies } from 'next/headers'
import { Resend } from 'resend'
import {
  boundedSimulationBody, simulationBackend, simulationIdentity, simulationOriginAllowed,
  simulationPath, SIMULATION_COOKIE, SIMULATION_HEADERS,
} from '@/lib/gazon-simulation-proxy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60
type Context = { params: Promise<{ path?: string[] }> }

function failure(message: string, status = 503, code?: string) {
  return Response.json({ error: { message, ...(code ? { code } : {}) } }, { status, headers: SIMULATION_HEADERS })
}

async function handle(request: Request, context: Context) {
  if (process.env.HANAMI_LAWN_SIMULATOR_ENABLED !== '1') return failure('Le simulateur n’est pas disponible.', 404)
  const path = simulationPath((await context.params).path || [], request.method)
  if (path === null) return failure('Cette opération est introuvable.', 404)
  if (!simulationOriginAllowed(request)) return failure('Cette demande doit être lancée depuis le site Hanami.', 403)
  const backend = simulationBackend(process.env.HANAMI_SIMULATION_API_ORIGIN, process.env.NODE_ENV === 'development')
  const key = process.env.HANAMI_SIMULATION_WORKER_KEY
  if (!backend || !key || key.length < 32) return failure('Le serveur de simulation n’est pas encore configuré. Votre photo peut être préparée, mais aucun traitement ne peut démarrer.', 503, 'SIMULATION_CONFIGURATION_REQUIRED')
  const jar = await cookies()
  const identity = simulationIdentity(jar.get(SIMULATION_COOKIE)?.value,
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown', key)
  const sessionBinding = identity.sessionHash.slice(0, 24)
  if (request.method === 'GET' && !path) jar.set(SIMULATION_COOKIE, identity.session, {
    httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 86400,
  })
  if (['POST', 'DELETE'].includes(request.method) &&
    (!jar.get(SIMULATION_COOKIE) || request.headers.get('x-hanami-simulation-session') !== sessionBinding))
    return failure('La session a changé. Actualisez le suivi avant de lancer une simulation.', 409)
  // Never accept an actor, prospect, object path or session chosen in public input.
  const headers: Record<string, string> = {
    'x-hanami-simulation-key': key, 'x-hanami-session-hash': identity.sessionHash,
    'x-hanami-visitor-hash': identity.visitorHash,
  }
  // Optional protected-preview credential, provisioned separately by an
  // authorized owner. The normal custom-domain API does not need this.
  if (process.env.HANAMI_SIMULATION_PROTECTION_BYPASS)
    headers['x-vercel-protection-bypass'] = process.env.HANAMI_SIMULATION_PROTECTION_BYPASS
  const call = async (route: string, init: RequestInit = {}) => {
    const response = await fetch(`${backend}/api/gazon-simulations${route}`, {
      ...init, headers: { ...headers, ...init.headers }, cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(25000),
    })
    if ((response.status >= 300 && response.status < 400) ||
      ([401, 403].includes(response.status) && !response.headers.get('content-type')?.startsWith('application/json')))
      throw new Error('SIMULATION_PREVIEW_ACCESS_REQUIRED')
    return response
  }
  try {
    if (path.endsWith('/contact')) {
      const raw = await boundedSimulationBody(request, 12000)
      let contact: { name?: unknown; email?: unknown; message?: unknown; attachSimulation?: unknown }
      try { contact = JSON.parse(new TextDecoder().decode(raw)) } catch { return failure('Vérifiez les informations de contact.', 400) }
      if (typeof contact.name !== 'string' || !contact.name.trim() || contact.name.length > 150 ||
        typeof contact.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) || contact.email.length > 254 ||
        typeof contact.message !== 'string' || contact.message.length > 3000 || contact.attachSimulation !== true)
        return failure('Renseignez votre nom, votre email et votre accord pour joindre la simulation.', 400)
      const apiKey = process.env.RESEND_API_KEY
      const recipient = process.env.CONTACT_EMAIL
      if (!apiKey || !recipient) return failure('L’envoi est momentanément indisponible. Votre simulation reste accessible.')
      const email = contact.email.trim().toLowerCase()
      const reserve = await call(`/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        phase: 'reserve', name: contact.name.trim(), email, message: contact.message.trim(), attachSimulation: true,
      }) })
      if (!reserve.ok) return failure('La demande n’a pas pu être associée à cette simulation. Réessayez.', reserve.status)
      const receipt = await reserve.json() as { contactId: string; sent?: boolean }
      if (receipt.sent) return Response.json({ success: true }, { headers: SIMULATION_HEADERS })
      if (!/^[a-f0-9-]{36}$/i.test(receipt.contactId)) return failure('L’association de votre demande a échoué.')
      const id = path.split('/')[0]
      const resend = new Resend(apiKey)
      const sent = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Hanami <onboarding@resend.dev>', to: recipient, replyTo: email,
        subject: 'Demande après simulation du gazon',
        text: `${contact.name.trim()}\n${email}\n\n${contact.message.trim()}\n\nSimulation : ${id}\nDemande : ${receipt.contactId}\nAccord explicite pour consulter la photo et la simulation. Aucune autorisation marketing.\nOuvrir dans Hanami Admin : ${backend}/admin/simulation?simulationId=${id}`,
      }, { idempotencyKey: `lawn-contact/${receipt.contactId}` })
      if (sent.error || !sent.data?.id) return failure('Votre demande n’a pas été envoyée. Vous pouvez réessayer.')
      const ack = await call(`/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 'sent', contactId: receipt.contactId, deliveryId: sent.data.id }) })
      if (!ack.ok) return failure('L’envoi est en cours de confirmation. Réessayez pour vérifier son état.')
      return Response.json({ success: true }, { headers: SIMULATION_HEADERS })
    }
    let body: Uint8Array | undefined
    if (request.method === 'POST') {
      body = await boundedSimulationBody(request)
      if (request.headers.get('content-type')) headers['Content-Type'] = request.headers.get('content-type')!
    }
    const query = new URL(request.url).searchParams
    const kind = query.get('kind')
    if (path.endsWith('/image') && !['original', 'result'].includes(kind || '')) return failure('Cette photo est introuvable.', 404)
    const response = await call(`${path ? `/${path}` : ''}${path.endsWith('/image') ? `?kind=${kind}` : ''}`, {
      method: request.method, body: body ? Buffer.from(body) : undefined,
    })
    const type = response.headers.get('content-type') || ''
    if (!type.startsWith('application/json') && !type.startsWith('image/png')) return failure('Le simulateur est momentanément indisponible.')
    return new Response(response.body, { status: response.status, headers: { ...SIMULATION_HEADERS,
      'x-hanami-simulation-session': sessionBinding,
      'Content-Type': type, ...(type.startsWith('image/') ? { 'Content-Disposition': 'inline; filename="hanami-simulation.png"' } : {}),
    } })
  } catch (error) {
    if (error instanceof Error && error.message === 'FILE_TOO_LARGE') return failure('La photo est trop volumineuse. Choisissez une image plus légère.', 413)
    if (error instanceof Error && error.message === 'SIMULATION_PREVIEW_ACCESS_REQUIRED')
      return failure('L’accès sécurisé au serveur de génération n’est pas encore configuré pour cette URL de test. Actualiser la page ne suffit pas. Aucune photo n’a été envoyée au générateur.', 503, 'SIMULATION_PREVIEW_ACCESS_REQUIRED')
    // A lost response never triggers another generation. The client reloads persisted state.
    return failure('Connexion interrompue. Rechargez l’état de votre simulation avant de réessayer.')
  }
}

export const GET = handle
export const POST = handle
export const DELETE = handle

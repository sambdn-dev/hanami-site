/**
 * route.ts — POST /api/visualiser
 *
 * Reçoit une photo (data URL) + une saison, renvoie le visuel transformé.
 * Toute la génération se fait ICI, côté serveur : la clé OpenAI n'atteint
 * jamais le navigateur.
 *
 * Garde-fous anti-abus (chaque génération coûte) :
 *  - honeypot `company` (doit être vide)
 *  - validation stricte du data URL + plafond de taille décodée
 *  - rate-limit par IP et par session (voir src/lib/ratelimit.ts)
 */

import { NextRequest, NextResponse } from 'next/server'
import { transformLawn } from '@/lib/ai/imageProvider'
import { rateLimit } from '@/lib/ratelimit'
import { SEASON_PROMPTS, currentSeason, isSeason } from '@/lib/visualiseur/seasonPrompts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// La photo arrive déjà compressée (~150 Ko) par compressPhoto(). Tout ce qui
// dépasse largement est suspect → on plafonne à 3 Mo décodés.
const MAX_DECODED_BYTES = 3 * 1024 * 1024
const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      image?: string
      season?: string
      sessionId?: string
      company?: string
    }

    // Honeypot — un bot remplit ce champ ; un humain non.
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return NextResponse.json({ error: 'Requête invalide', code: 'INVALID' }, { status: 400 })
    }

    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json({ error: 'Image manquante', code: 'INVALID' }, { status: 400 })
    }

    const match = body.image.match(DATA_URL_RE)
    if (!match) {
      return NextResponse.json(
        { error: "Format d'image non supporté", code: 'INVALID' },
        { status: 400 },
      )
    }

    const mimeType = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.byteLength > MAX_DECODED_BYTES) {
      return NextResponse.json({ error: 'Image trop lourde', code: 'TOO_LARGE' }, { status: 413 })
    }

    // Rate-limiting : 8/h par IP, 4/jour par session.
    const now = Date.now()
    const ip = clientIp(request)
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : 'anon'
    const ipLimit = rateLimit(`ip:${ip}`, 8, 60 * 60 * 1000, now)
    const sidLimit = rateLimit(`sid:${sessionId}`, 4, 24 * 60 * 60 * 1000, now)
    if (!ipLimit.allowed || !sidLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de générations pour le moment, réessayez plus tard.', code: 'RATE_LIMIT' },
        { status: 429 },
      )
    }

    const season = isSeason(body.season) ? body.season : currentSeason(new Date())
    const prompt = SEASON_PROMPTS[season].instruction

    const result = await transformLawn({ imageBuffer: buffer, mimeType, prompt })
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[API /visualiser]', err)
    return NextResponse.json(
      { error: 'La génération a échoué, veuillez réessayer.', code: 'PROVIDER' },
      { status: 502 },
    )
  }
}

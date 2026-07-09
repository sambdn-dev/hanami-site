/**
 * route.ts — POST /api/visualiser-lead
 *
 * Capture email du Visualiseur IA. Reprend le pattern de /api/contact :
 * notification Resend à CONTACT_EMAIL, avec les visuels avant/après en
 * pièces jointes (contexte de vente maximal pour rappeler le prospect).
 *
 * Pas de base de données en V1 (comme newsletter/contact). V2 : brancher
 * un store (Vercel KV) pour dédoublonner et suivre les leads.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SEASON_PROMPTS, isSeason } from '@/lib/visualiseur/seasonPrompts'
import type { VisualiserLeadRequest } from '@/lib/visualiseur/types'

export const runtime = 'nodejs'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'samibouden@gmail.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/
const MAX_ATTACH_BYTES = 5 * 1024 * 1024

/** Décode un data URL image en pièce jointe Resend (ou null si invalide/trop gros). */
function decodeImage(dataUrl: unknown): { ext: string; content: Buffer } | null {
  if (typeof dataUrl !== 'string') return null
  const m = dataUrl.match(DATA_URL_RE)
  if (!m) return null
  const content = Buffer.from(m[2], 'base64')
  if (content.byteLength > MAX_ATTACH_BYTES) return null
  const ext = m[1] === 'image/png' ? 'png' : m[1] === 'image/webp' ? 'webp' : 'jpg'
  return { ext, content }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VisualiserLeadRequest & { company?: string }

    // Honeypot
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    const email = (body.email ?? '').trim()
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const safeEmail = email
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const seasonLabel = isSeason(body.season) ? SEASON_PROMPTS[body.season].label : '—'

    const attachments: Array<{ filename: string; content: Buffer }> = []
    const before = decodeImage(body.beforeImage)
    const after = decodeImage(body.afterImage)
    if (before) attachments.push({ filename: `avant.${before.ext}`, content: before.content })
    if (after) attachments.push({ filename: `apres.${after.ext}`, content: after.content })

    // Construit le client Resend seulement après validation : une requête
    // invalide renvoie 400 sans dépendre de la présence de la clé API.
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Hanami Visualiseur <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: '[Hanami] Nouveau lead — Visualiseur IA',
      html: `
        <h2 style="color:#1a2e1a;margin:0 0 16px;">Nouveau lead — Visualiseur IA</h2>
        <table style="border-collapse:collapse;font-size:15px;">
          <tr>
            <td style="padding:4px 12px 4px 0;color:#78716c;">Email</td>
            <td style="padding:4px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:4px 12px 4px 0;color:#78716c;">Saison testée</td>
            <td style="padding:4px 0;">${seasonLabel}</td>
          </tr>
        </table>
        <p style="margin:16px 0 0;color:#78716c;font-size:13px;">
          Les visuels avant/après générés par le prospect sont en pièces jointes.
        </p>
      `,
      attachments: attachments.length ? attachments : undefined,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[API /visualiser-lead]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * route.ts — API Route inscription newsletter
 *
 * Reçoit une adresse email et envoie une notification à CONTACT_EMAIL
 * via Resend. Simple et immédiat — pas de gestion de liste pour l'instant.
 *
 * À terme : brancher sur Brevo ou Mailchimp pour la gestion des désabonnements.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'samibouden@gmail.com'

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { email } = await request.json() as { email?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const safeEmail = email.trim()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    await resend.emails.send({
      from: 'Hanami <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      subject: `[Hanami] Nouvelle inscription newsletter`,
      html: `
        <h2 style="color:#1a2e1a;margin:0 0 16px;">Nouvelle inscription newsletter</h2>
        <p style="margin:0;font-size:16px;">
          <strong>Email :</strong>
          <a href="mailto:${safeEmail}">${safeEmail}</a>
        </p>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[API /newsletter] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

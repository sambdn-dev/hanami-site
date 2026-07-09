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

/* Expéditeur : onboarding@resend.dev (sandbox Resend) ne délivre QUE vers
   l'adresse du propriétaire du compte — les visiteurs ne reçoivent rien.
   Vérifier le domaine hanami-gazon.fr dans le dashboard Resend, puis définir
   RESEND_FROM_EMAIL='Hanami <noreply@hanami-gazon.fr>' sur Vercel. */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Hanami <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    let body: { email?: unknown }
    try {
      body = await request.json() as { email?: unknown }
    } catch {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Coercition en chaîne — le payload vient du client, rien n'est garanti
    const email = String(body.email ?? '').trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const safeEmail = email
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Le SDK Resend ne throw pas : il retourne { data, error }. Si la
    // notification interne échoue, l'inscription est perdue → 502 pour que
    // le front affiche le fallback WhatsApp.
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
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
    if (sendError) {
      console.error('[API /newsletter] Échec envoi Resend:', sendError)
      return NextResponse.json(
        { error: "L'envoi a échoué, veuillez réessayer" },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[API /newsletter] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

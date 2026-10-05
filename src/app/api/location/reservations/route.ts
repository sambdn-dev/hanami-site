import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SHOP_ENABLED } from '@/lib/site-features'
import { submitRentalRequest } from '@/lib/rental-request'

export async function POST(request: NextRequest) {
  if (!SHOP_ENABLED) return NextResponse.json({ error: 'La boutique est temporairement fermée.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  let input: unknown
  try {
    const text = await request.text()
    if (text.length > 12_000) return NextResponse.json({ error: 'Demande trop volumineuse.' }, { status: 413 })
    input = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 })
  }
  const result = await submitRentalRequest(input, {
    async send(notification) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Hanami <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL || 'samibouden@gmail.com'],
        ...notification,
      })
    },
  })
  return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } })
}

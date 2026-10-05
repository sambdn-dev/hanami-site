import { NextRequest, NextResponse } from 'next/server'
import { SHOP_ENABLED } from '@/lib/site-features'
import { quoteRental } from '@/lib/rentals'

export async function GET(request: NextRequest) {
  if (!SHOP_ENABLED) return NextResponse.json({ error: 'La boutique est temporairement fermée.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  const query = request.nextUrl.searchParams
  const duration = query.get('duration')
  const fulfillment = query.get('fulfillment')
  if (!['24h', '48h', 'weekend'].includes(duration || '') || !['pickup', 'delivery', 'to-confirm'].includes(fulfillment || '')) {
    return NextResponse.json({ error: 'Formule ou remise invalide.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }
  const quote = quoteRental({
    itemIds: (query.get('items') || '').split(',').filter(Boolean),
    duration: duration as '24h' | '48h' | 'weekend',
    startLocal: query.get('startLocal') || '',
    fulfillment: fulfillment as 'pickup' | 'delivery' | 'to-confirm',
  })
  return NextResponse.json(quote, { status: quote.valid ? 200 : 400, headers: { 'Cache-Control': 'no-store' } })
}

import { randomUUID } from 'node:crypto'
import { quoteRental, type RentalQuote } from './rentals'

export type RentalNotification = { replyTo: string; subject: string; text: string }
export type RentalRequestDependencies = {
  now?: Date
  send: (notification: RentalNotification) => Promise<{ error?: unknown }>
}
export type RentalRequestResult = {
  status: number
  body: { error?: string; status?: 'request_received'; reference?: string; quote?: RentalQuote }
}

/** Une demande est transmise à Hanami, sans bloquer le stock ni confirmer une location. */
export async function submitRentalRequest(raw: unknown, dependencies: RentalRequestDependencies): Promise<RentalRequestResult> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { status: 400, body: { error: 'Demande de réservation invalide.' } }
  }
  const input = raw as Record<string, unknown>
  const read = (key: string) => typeof input[key] === 'string' ? input[key].trim() : ''
  const fullName = read('fullName')
  const email = read('email')
  const phone = read('phone')
  const notes = read('notes')
  if (!fullName || fullName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160 || phone.length > 40 || notes.length > 600 || input.consent !== true) {
    return { status: 400, body: { error: 'Vérifiez vos coordonnées et votre accord pour être recontacté.' } }
  }
  if (!Array.isArray(input.itemIds) || !input.itemIds.every(id => typeof id === 'string') || !['24h', '48h', 'weekend'].includes(read('duration')) || !['pickup', 'delivery', 'to-confirm'].includes(read('fulfillment'))) {
    return { status: 400, body: { error: 'Vérifiez le matériel, la formule et le mode de remise.' } }
  }
  const quote = quoteRental({
    itemIds: input.itemIds as string[],
    duration: read('duration') as '24h' | '48h' | 'weekend',
    startLocal: read('startLocal'),
    fulfillment: read('fulfillment') as 'pickup' | 'delivery' | 'to-confirm',
  }, { now: dependencies.now })
  if (!quote.valid) return { status: 400, body: { error: quote.errors[0] || 'Vérifiez les dates souhaitées.', quote } }
  if (quote.availability === 'unavailable') return { status: 409, body: { error: 'Le matériel n’est pas disponible sur cette période. Choisissez une autre date.', quote } }

  const reference = `LOC-${randomUUID().slice(0, 8).toUpperCase()}`
  const money = (cents: number | null) => cents === null ? 'À confirmer' : `${(cents / 100).toFixed(2).replace('.', ',')} € TTC`
  const format = read('duration') === 'weekend' ? 'Week-end' : read('duration') === '24h' ? '24 h' : '48 h'
  const fulfillment = read('fulfillment') === 'pickup' ? 'Retrait' : read('fulfillment') === 'delivery' ? 'Livraison' : 'À convenir'
  const text = [
    `Demande de location ${reference} — en attente de validation personnelle.`,
    `Nom : ${fullName}\nEmail : ${email}\nTéléphone : ${phone || 'Non renseigné'}`,
    `Formule : ${format}\nDépart : ${quote.startLabel}\nRetour : ${quote.endLabel || 'À confirmer'}\nFuseau : Europe/Paris`,
    `Matériel :\n${quote.items.map(item => `• ${item.name} — ${money(item.priceTtcCents)}`).join('\n')}`,
    `Disponibilité : ${quote.availability === 'available' ? 'Disponible selon le planning configuré' : 'À confirmer avec le planning réel'}`,
    `Remise : ${fulfillment}\nLocation : ${money(quote.rentalTotalTtcCents)}\nTransport / retrait : ${money(quote.fulfillmentFeeTtcCents)}\nTotal : ${money(quote.totalTtcCents)}`,
    notes ? `Précisions : ${notes}` : '',
    'Cette demande ne bloque aucun matériel, ne confirme aucune réservation et ne déclenche aucun paiement.',
  ].filter(Boolean).join('\n\n')

  try {
    const sent = await dependencies.send({ replyTo: email, subject: `[Hanami Location] Demande ${reference}`, text })
    if (sent.error) return { status: 502, body: { error: 'Votre demande n’a pas pu être transmise. Réessayez ou contactez Hanami.' } }
  } catch {
    return { status: 502, body: { error: 'Votre demande n’a pas pu être transmise. Réessayez ou contactez Hanami.' } }
  }
  return { status: 201, body: { status: 'request_received', reference, quote } }
}

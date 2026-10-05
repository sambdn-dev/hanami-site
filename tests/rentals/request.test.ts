import assert from 'node:assert/strict'
import test from 'node:test'
import { submitRentalRequest } from '../../src/lib/rental-request'

const now = new Date('2026-10-06T08:00:00Z')
const request = {
  fullName: 'Client de test',
  email: 'client@example.com',
  phone: '',
  notes: '',
  consent: true,
  itemIds: ['landzie-overseeding-tool'],
  duration: '24h',
  startLocal: '2026-10-10T10:00',
  fulfillment: 'pickup',
}

test('une demande valide est reçue après notification, sans réservation ferme ni prix inventé', async () => {
  let notificationText = ''
  const result = await submitRentalRequest({ ...request, totalTtcCents: 1, endISO: '2030-01-01T00:00:00Z' }, {
    now,
    async send(notification) {
      notificationText = notification.text
      assert.equal(notification.replyTo, request.email)
      return {}
    },
  })
  assert.equal(result.status, 201)
  assert.equal(result.body.status, 'request_received')
  assert.match(result.body.reference || '', /^LOC-[A-F0-9]{8}$/)
  assert.equal(result.body.quote?.totalTtcCents, null)
  assert.equal(result.body.quote?.availability, 'unknown')
  assert.equal(result.body.quote?.endISO, '2026-10-11T08:00:00.000Z')
  assert.match(notificationText, /ne bloque aucun matériel/)
  assert.match(notificationText, /À confirmer/)
  assert.doesNotMatch(notificationText, /2030-01-01/)
})

test('date passée, matériel inconnu et consentement absent ne déclenchent aucune notification', async () => {
  let sent = 0
  for (const invalid of [
    { ...request, startLocal: '2026-10-01T10:00' },
    { ...request, itemIds: ['produit-inconnu'] },
    { ...request, consent: false },
    { ...request, itemIds: [...request.itemIds, ...request.itemIds] },
  ]) {
    const result = await submitRentalRequest(invalid, { now, async send() { sent++; return {} } })
    assert.equal(result.status, 400)
  }
  assert.equal(sent, 0)
})

test('un échec de notification ne produit ni référence confirmée ni succès client', async () => {
  for (const send of [async () => ({ error: new Error('Transport indisponible') }), async () => { throw new Error('Transport indisponible') }]) {
    const result = await submitRentalRequest(request, { now, send })
    assert.equal(result.status, 502)
    assert.equal(result.body.status, undefined)
    assert.equal(result.body.reference, undefined)
  }
})

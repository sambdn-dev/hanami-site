import test from 'node:test'
import assert from 'node:assert/strict'
import { boundedSimulationBody, simulationBackend, simulationIdentity, simulationOriginAllowed, simulationPath } from '../src/lib/gazon-simulation-proxy.ts'

const id = '550e8400-e29b-41d4-a716-446655440000'
test('proxy forwards only the fixed job operations', () => {
  assert.equal(simulationPath([], 'POST'), '')
  assert.equal(simulationPath([id, 'start'], 'POST'), `${id}/start`)
  assert.equal(simulationPath([id, 'image'], 'GET'), `${id}/image`)
  for (const path of [['..', 'api', 'erp'], [id, 'image', '..'], ['https://other.test'], [id, 'complete'], [id, 'claim']])
    assert.equal(simulationPath(path, 'POST'), null)
  assert.equal(simulationPath([id, 'image'], 'DELETE'), null)
})
test('public mutations require the same origin; photos reject cross-site fetches', () => {
  const req = (method, headers = {}) => new Request('https://www.hanami-gazon.fr/api/gazon-simulations', { method, headers })
  assert.equal(simulationOriginAllowed(req('POST')), false)
  assert.equal(simulationOriginAllowed(req('POST', { origin: 'https://other.test' })), false)
  assert.equal(simulationOriginAllowed(req('GET', { 'sec-fetch-site': 'cross-site' })), false)
  assert.equal(simulationOriginAllowed(req('POST', { origin: 'https://www.hanami-gazon.fr' })), true)
  assert.equal(simulationOriginAllowed(req('GET')), true)
  assert.equal(simulationOriginAllowed(new Request('http://localhost:3226/api/gazon-simulations', {
    method: 'POST', headers: { host: '127.0.0.1:3226', origin: 'http://127.0.0.1:3226' },
  })), true)
})
test('session capability and visitor limit use separate, stable keyed digests', () => {
  const cookie = '1'.repeat(64), key = 'test-worker-key'.repeat(4)
  const a = simulationIdentity(cookie, '192.0.2.1', key)
  assert.equal(a.session, cookie)
  assert.equal(a.sessionHash, simulationIdentity(cookie, '192.0.2.2', key).sessionHash)
  assert.notEqual(a.sessionHash, a.visitorHash)
  assert.notEqual(a.visitorHash, simulationIdentity(cookie, '192.0.2.2', key).visitorHash)
  assert.notEqual(a.sessionHash, simulationIdentity(cookie, '192.0.2.1', 'other-key').sessionHash)
  assert.match(simulationIdentity('attacker-chosen', '192.0.2.1', key).session, /^[a-f0-9]{64}$/)
})
test('backend configuration never permits user-info, a path, or unencrypted remote HTTP', () => {
  assert.equal(simulationBackend('https://admin.example.test'), 'https://admin.example.test')
  for (const url of ['https://key@admin.example.test', 'https://admin.example.test/api', 'http://admin.example.test', 'file:///etc/passwd', 'https://admin.example.test?x=1'])
    assert.equal(simulationBackend(url), null)
  assert.equal(simulationBackend('http://localhost:3230', true), 'http://localhost:3230')
})
test('upload limit also checks a streamed body without Content-Length', async () => {
  const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(4)); c.enqueue(new Uint8Array(4)); c.close() } })
  const req = new Request('https://example.test', { method: 'POST', body, duplex: 'half' })
  await assert.rejects(boundedSimulationBody(req, 7), /FILE_TOO_LARGE/)
  const accepted = await boundedSimulationBody(new Request('https://example.test', { method: 'POST', body: 'photo' }), 6)
  assert.equal(new TextDecoder().decode(accepted), 'photo')
})

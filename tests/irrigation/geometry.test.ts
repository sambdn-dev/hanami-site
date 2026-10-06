import assert from 'node:assert/strict'
import { test } from 'node:test'
import { IRRIGATION_SOURCE, IRRIGATION_ZONES, getZoneSweepLimits, sampleZoneSweep, type IrrigationPoint } from '../../src/lib/irrigation-demo'

// Independent, high-resolution evaluation of the published SVG paths. The test
// reads their commands rather than sharing the helper's hard-coded polygons.
function flattenSvg(path: string): IrrigationPoint[] {
  const polygon: IrrigationPoint[] = []
  let current: IrrigationPoint = { x: 0, y: 0 }
  for (const match of path.matchAll(/([MLCQZ])([^MLCQZ]*)/g)) {
    const command = match[1]
    const numbers = (match[2].match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
    const points: IrrigationPoint[] = []
    for (let i = 0; i < numbers.length; i += 2) points.push({ x: numbers[i], y: numbers[i + 1] })
    if (command === 'M' || command === 'L') {
      current = points[0]
      polygon.push(current)
    } else if (command === 'C' || command === 'Q') {
      const controls = [current, ...points]
      for (let sample = 1; sample <= 256; sample++) {
        const t = sample / 256
        let row = controls
        while (row.length > 1) {
          row = row.slice(0, -1).map((point, index) => ({
            x: point.x + (row[index + 1].x - point.x) * t,
            y: point.y + (row[index + 1].y - point.y) * t,
          }))
        }
        polygon.push(row[0])
      }
      current = points[points.length - 1]
    }
  }
  return polygon
}

function inside(point: IrrigationPoint, polygon: IrrigationPoint[]): boolean {
  let crossings = 0
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i]
    const b = polygon[(i + 1) % polygon.length]
    if ((a.y > point.y) !== (b.y > point.y)) {
      const crossingX = a.x + (point.y - a.y) * (b.x - a.x) / (b.y - a.y)
      if (crossingX > point.x) crossings++
    }
  }
  return crossings % 2 === 1
}

function borderDistance(point: IrrigationPoint, polygon: IrrigationPoint[]): number {
  return Math.min(...polygon.map((a, index) => {
    const b = polygon[(index + 1) % polygon.length]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = dx * dx + dy * dy
    const position = length ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length)) : 0
    return Math.hypot(point.x - a.x - position * dx, point.y - a.y - position * dy)
  }))
}

const polygons = IRRIGATION_ZONES.map(zone => flattenSvg(zone.path))

test('the demo keeps its real plan source and four independently selectable zones', () => {
  assert.deepEqual(IRRIGATION_SOURCE, { x: 451, y: 250 })
  assert.equal(IRRIGATION_ZONES.length, 4)
  assert.deepEqual(IRRIGATION_ZONES.map(zone => zone.kind), ['lawn', 'lawn', 'lawn', 'bed'])
  IRRIGATION_ZONES.forEach((zone, index) => assert.equal(inside(zone.marker, polygons[index]), true, zone.id))
})

test('every impact stays inside its chosen SVG zone with an inset, including departure and stop', () => {
  IRRIGATION_ZONES.forEach((zone, zoneIndex) => {
    for (let sample = 0; sample <= 100; sample++) {
      const frame = sampleZoneSweep(zoneIndex, sample / 100)
      assert.equal(frame.visible, true, `${zone.id} phase ${sample / 100}`)
      assert.equal(inside(frame.target, polygons[zoneIndex]), true, `${zone.id} target`)
      assert.ok(borderDistance(frame.target, polygons[zoneIndex]) >= 2.65, `${zone.id} inset`)
      for (let other = 0; other < polygons.length; other++) {
        if (other !== zoneIndex) assert.equal(inside(frame.target, polygons[other]), false, `${zone.id} overlaps ${other}`)
      }
    }
  })
})

test('no impact lands on the house, terrace or paved side path', () => {
  for (let zone = 0; zone < IRRIGATION_ZONES.length; zone++) {
    for (let sample = 0; sample <= 100; sample++) {
      const { target } = sampleZoneSweep(zone, sample / 100)
      const house = target.x >= 70 && target.x <= 274 && target.y >= 74 && target.y <= 183
      const terrace = target.x >= 71 && target.x <= 273 && target.y >= 185 && target.y <= 266
      const sidePath = target.x >= 628 && target.y >= 179
      assert.equal(house || terrace || sidePath, false)
    }
  }
})

test('a sweep has two genuine limits, never a full rotation, with continuous increasing angles', () => {
  for (let zone = 0; zone < IRRIGATION_ZONES.length; zone++) {
    const limits = getZoneSweepLimits(zone)
    assert.ok(limits.endAngle > limits.startAngle)
    assert.ok(limits.endAngle - limits.startAngle < 180)
    assert.deepEqual(sampleZoneSweep(zone, 0).target, limits.startTarget)
    assert.deepEqual(sampleZoneSweep(zone, 1).target, limits.endTarget)
    let previous = limits.startAngle
    for (let sample = 0; sample <= 100; sample++) {
      const frame = sampleZoneSweep(zone, sample / 100)
      assert.ok(frame.angle >= previous)
      assert.ok(frame.angle >= limits.startAngle && frame.angle <= limits.endAngle)
      previous = frame.angle
    }
  }
})

test('range follows the curved zone boundary and remains consistent with source and angle', () => {
  for (let zone = 0; zone < IRRIGATION_ZONES.length; zone++) {
    const distances: number[] = []
    for (let sample = 0; sample <= 40; sample++) {
      const frame = sampleZoneSweep(zone, sample / 40)
      const dx = frame.target.x - IRRIGATION_SOURCE.x
      const dy = frame.target.y - IRRIGATION_SOURCE.y
      assert.ok(Math.abs(Math.hypot(dx, dy) - frame.distance) < 1e-8)
      assert.ok(Math.abs(dx / frame.distance - Math.cos(frame.angle * Math.PI / 180)) < 1e-8)
      assert.ok(Math.abs(dy / frame.distance - Math.sin(frame.angle * Math.PI / 180)) < 1e-8)
      distances.push(frame.distance)
    }
    assert.ok(Math.max(...distances) - Math.min(...distances) > 15, `zone ${zone} has a fixed range`)
  }
})

test('invalid zones stay invisible and progress is safely bounded', () => {
  assert.equal(sampleZoneSweep(-1, .5).visible, false)
  assert.equal(sampleZoneSweep(4, .5).visible, false)
  assert.deepEqual(sampleZoneSweep(0, -1), sampleZoneSweep(0, 0))
  assert.deepEqual(sampleZoneSweep(0, 2), sampleZoneSweep(0, 1))
  assert.deepEqual(sampleZoneSweep(0, NaN), sampleZoneSweep(0, 0))
})

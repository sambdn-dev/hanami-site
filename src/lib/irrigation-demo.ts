export type IrrigationPoint = { x: number; y: number };

export const IRRIGATION_SOURCE: IrrigationPoint = { x: 430, y: 270 };
// Visual reference only: the plan is illustrative, not a surveyed garden.
export const IRRIGATION_MAX_RADIUS = 286;
export const IRRIGATION_MAX_METRES = 13;

export const IRRIGATION_ZONES = [
  { id: 'pelouse', label: 'Pelouse', kind: 'lawn', path: 'M290 123 C354 110 404 102 468 126 C514 110 560 145 612 189 L606 294 L599 389 C549 421 438 414 368 399 C303 386 248 400 192 388 L194 326 C248 329 277 296 286 255 L286 202 Q279 169 290 123Z', marker: { x: 515, y: 345 } },
  { id: 'massifs', label: 'Massifs', kind: 'bed', path: 'M292 73 C388 62 438 77 485 70 C550 59 608 88 651 130 L643 173 C575 146 564 109 502 111 C412 95 360 109 292 108Z', marker: { x: 510, y: 91 } },
] as const;

const p = (x: number, y: number): IrrigationPoint => ({ x, y });
const CURVE_STEPS = 72;

function cubic(a: IrrigationPoint, b: IrrigationPoint, c: IrrigationPoint, d: IrrigationPoint): IrrigationPoint[] {
  return Array.from({ length: CURVE_STEPS }, (_, index) => {
    const t = (index + 1) / CURVE_STEPS;
    const s = 1 - t;
    return p(s ** 3 * a.x + 3 * s ** 2 * t * b.x + 3 * s * t ** 2 * c.x + t ** 3 * d.x,
      s ** 3 * a.y + 3 * s ** 2 * t * b.y + 3 * s * t ** 2 * c.y + t ** 3 * d.y);
  });
}

function quadratic(a: IrrigationPoint, b: IrrigationPoint, c: IrrigationPoint): IrrigationPoint[] {
  return Array.from({ length: CURVE_STEPS }, (_, index) => {
    const t = (index + 1) / CURVE_STEPS;
    const s = 1 - t;
    return p(s ** 2 * a.x + 2 * s * t * b.x + t ** 2 * c.x, s ** 2 * a.y + 2 * s * t * b.y + t ** 2 * c.y);
  });
}

// Dense samples of the lawn perimeter and the separate flower bed.
// This educational plan has no scale and is not a device-performance simulator.
const polygons: readonly IrrigationPoint[][] = [
  [p(290, 123), ...cubic(p(290, 123), p(354, 110), p(404, 102), p(468, 126)),
    ...cubic(p(468, 126), p(514, 110), p(560, 145), p(612, 189)), p(606, 294), p(599, 389),
    ...cubic(p(599, 389), p(549, 421), p(438, 414), p(368, 399)),
    ...cubic(p(368, 399), p(303, 386), p(248, 400), p(192, 388)), p(194, 326),
    ...cubic(p(194, 326), p(248, 329), p(277, 296), p(286, 255)), p(286, 202),
    ...quadratic(p(286, 202), p(279, 169), p(290, 123))],
  [p(292, 73), ...cubic(p(292, 73), p(388, 62), p(438, 77), p(485, 70)),
    ...cubic(p(485, 70), p(550, 59), p(608, 88), p(651, 130)), p(643, 173),
    ...cubic(p(643, 173), p(575, 146), p(564, 109), p(502, 111)),
    ...cubic(p(502, 111), p(412, 95), p(360, 109), p(292, 108))],
];

const cross = (a: IrrigationPoint, b: IrrigationPoint) => a.x * b.y - a.y * b.x;
const subtract = (a: IrrigationPoint, b: IrrigationPoint) => p(a.x - b.x, a.y - b.y);
const pointOnRay = (direction: IrrigationPoint, distance: number) => p(IRRIGATION_SOURCE.x + direction.x * distance, IRRIGATION_SOURCE.y + direction.y * distance);

function isInside(point: IrrigationPoint, polygon: readonly IrrigationPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y)
      && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function borderDistance(point: IrrigationPoint, polygon: readonly IrrigationPoint[]): number {
  let minimumSquared = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const segment = subtract(b, a);
    const lengthSquared = segment.x ** 2 + segment.y ** 2;
    const projection = lengthSquared ? Math.max(0, Math.min(1, ((point.x - a.x) * segment.x + (point.y - a.y) * segment.y) / lengthSquared)) : 0;
    minimumSquared = Math.min(minimumSquared, (point.x - a.x - projection * segment.x) ** 2 + (point.y - a.y - projection * segment.y) ** 2);
  }
  return Math.sqrt(minimumSquared);
}

function hitAtAngle(polygon: readonly IrrigationPoint[], angle: number) {
  const radians = angle * Math.PI / 180;
  const direction = p(Math.cos(radians), Math.sin(radians));
  const intersections: number[] = [0];
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const segment = subtract(polygon[(i + 1) % polygon.length], a);
    const denominator = cross(direction, segment);
    if (Math.abs(denominator) < 1e-9) continue;
    const delta = subtract(a, IRRIGATION_SOURCE);
    const distance = cross(delta, segment) / denominator;
    const alongSegment = cross(delta, direction) / denominator;
    if (distance > 1e-5 && alongSegment >= -1e-8 && alongSegment <= 1 + 1e-8) intersections.push(distance);
  }
  intersections.sort((a, b) => a - b);
  const distances = intersections.filter((distance, index) => index === 0 || Math.abs(distance - intersections[index - 1]) > 1e-5);
  for (let i = distances.length - 1; i > 0; i--) {
    const entry = distances[i - 1];
    const exit = distances[i];
    if (!isInside(pointOnRay(direction, (entry + exit) / 2), polygon)) continue;
    // Stay roughly three plan units inside the actual border, not only three
    // units short of it along a grazing ray. Narrow tangents are not watered.
    const maximumInset = exit - entry - 3;
    for (let inset = 3; inset <= maximumInset; inset += .75) {
      const distance = Math.min(exit - inset, IRRIGATION_MAX_RADIUS);
      const target = pointOnRay(direction, distance);
      if (borderDistance(target, polygon) >= 2.8) return { angle, distance, target, visible: true };
    }
  }
  return { angle, distance: 0, target: { ...IRRIGATION_SOURCE }, visible: false };
}

export type IrrigationSweepLimits = { startAngle: number; endAngle: number; startTarget: IrrigationPoint; endTarget: IrrigationPoint };

function createLimits(polygon: readonly IrrigationPoint[]): IrrigationSweepLimits {
  if (isInside(IRRIGATION_SOURCE, polygon)) {
    return { startAngle: 0, endAngle: 360, startTarget: hitAtAngle(polygon, 0).target, endTarget: hitAtAngle(polygon, 360).target };
  }
  const angles = polygon.filter(point => Math.hypot(point.x - IRRIGATION_SOURCE.x, point.y - IRRIGATION_SOURCE.y) > .01)
    .map(point => (Math.atan2(point.y - IRRIGATION_SOURCE.y, point.x - IRRIGATION_SOURCE.x) * 180 / Math.PI + 360) % 360)
    .sort((a, b) => a - b);
  let biggestGap = -1;
  let afterGap = 0;
  for (let i = 0; i < angles.length; i++) {
    const gap = (i === angles.length - 1 ? angles[0] + 360 : angles[i + 1]) - angles[i];
    if (gap > biggestGap) { biggestGap = gap; afterGap = (i + 1) % angles.length; }
  }
  const minimum = angles[afterGap];
  const maximum = minimum + 360 - biggestGap;
  // Move each tangent inward until there is a genuine target with a safe inset.
  let startAngle = minimum;
  let endAngle = maximum;
  while (startAngle < maximum && !hitAtAngle(polygon, startAngle).visible) startAngle += .25;
  while (endAngle > startAngle && !hitAtAngle(polygon, endAngle).visible) endAngle -= .25;
  return { startAngle, endAngle, startTarget: hitAtAngle(polygon, startAngle).target, endTarget: hitAtAngle(polygon, endAngle).target };
}

const limits = polygons.map(createLimits);

export function getZoneSweepLimits(zoneIndex: number): IrrigationSweepLimits {
  return limits[zoneIndex] ?? { startAngle: 0, endAngle: 0, startTarget: { ...IRRIGATION_SOURCE }, endTarget: { ...IRRIGATION_SOURCE } };
}

export function sampleZoneSweep(zoneIndex: number, progress: number): { angle: number; distance: number; target: IrrigationPoint; visible: boolean } {
  const polygon = polygons[zoneIndex];
  if (!polygon) return { angle: 0, distance: 0, target: { ...IRRIGATION_SOURCE }, visible: false };
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const { startAngle, endAngle } = limits[zoneIndex];
  return hitAtAngle(polygon, startAngle + (endAngle - startAngle) * fraction);
}

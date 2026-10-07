'use client'

import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { IRRIGATION_SOURCE, IRRIGATION_ZONES, IRRIGATION_MAX_RADIUS, IRRIGATION_MAX_METRES, getZoneSweepLimits, sampleZoneSweep } from '@/lib/irrigation-demo'
import styles from './IrrigationZoneMotion.module.css'

const TURN_SECONDS = 36
const FLIGHT_SECONDS = .85
const DROP_COUNT = 52
const LOOKUP_STEPS = 720

type Readout = { value: RefObject<HTMLOutputElement | null>; bar: RefObject<HTMLSpanElement | null> }

export default function IrrigationJet({ id, zone, running, readout }: { id: string; zone: number; running: boolean; readout: Readout }) {
  const jet = useRef<SVGGElement>(null)
  const ribbon = useRef<SVGPathElement>(null)
  const core = useRef<SVGPathElement>(null)
  const halo = useRef<SVGPathElement>(null)
  const dimension = useRef<SVGPathElement>(null)
  const gradient = useRef<SVGLinearGradientElement>(null)
  const nozzle = useRef<SVGGElement>(null)
  const drops = useRef<(SVGPathElement | null)[]>([])
  const ripples = useRef<(SVGEllipseElement | null)[]>([])
  const impact = useRef<SVGGElement>(null)
  const clock = useRef(4)
  const lawn = IRRIGATION_ZONES[zone].kind === 'lawn'
  const limits = getZoneSweepLimits(zone)
  // Geometry is sampled once per selection, rather than once per droplet per frame.
  const lookup = useMemo(() => Array.from({ length: LOOKUP_STEPS + 1 }, (_, i) => sampleZoneSweep(zone, i / LOOKUP_STEPS)), [zone])

  useEffect(() => {
    let animation = 0
    let lastTime: number | null = null
    let lastReadout = -Infinity
    const progressAt = (time: number) => lawn ? ((time / TURN_SECONDS) % 1 + 1) % 1 : (1 - Math.cos(time / TURN_SECONDS * Math.PI * 2)) / 2
    const aimAt = (time: number) => lookup[Math.round(progressAt(time) * LOOKUP_STEPS)]
    const draw = () => {
      const next = sampleZoneSweep(zone, progressAt(clock.current))
      const dx = next.target.x - IRRIGATION_SOURCE.x
      const dy = next.target.y - IRRIGATION_SOURCE.y
      const length = Math.max(1, next.distance)
      const nx = -dy / length
      const ny = dx / length
      const lift = Math.min(34, next.distance * .15)
      const control = { x: IRRIGATION_SOURCE.x + dx * .5, y: IRRIGATION_SOURCE.y + dy * .5 - lift * 2 }
      const path = `M${IRRIGATION_SOURCE.x} ${IRRIGATION_SOURCE.y} Q${control.x} ${control.y} ${next.target.x} ${next.target.y}`
      core.current?.setAttribute('d', path)
      halo.current?.setAttribute('d', path)
      ribbon.current?.setAttribute('d', `M${IRRIGATION_SOURCE.x + nx} ${IRRIGATION_SOURCE.y + ny} Q${control.x + nx * 3} ${control.y + ny * 3} ${next.target.x + nx * 5} ${next.target.y + ny * 5} L${next.target.x - nx * 5} ${next.target.y - ny * 5} Q${control.x - nx * 3} ${control.y - ny * 3} ${IRRIGATION_SOURCE.x - nx} ${IRRIGATION_SOURCE.y - ny}Z`)
      gradient.current?.setAttribute('x2', String(next.target.x))
      gradient.current?.setAttribute('y2', String(next.target.y))
      dimension.current?.setAttribute('d', `M${IRRIGATION_SOURCE.x} ${IRRIGATION_SOURCE.y} L${next.target.x} ${next.target.y}`)
      impact.current?.setAttribute('transform', `translate(${next.target.x} ${next.target.y})`)
      nozzle.current?.setAttribute('transform', `translate(${IRRIGATION_SOURCE.x} ${IRRIGATION_SOURCE.y}) rotate(${next.angle})`)
      jet.current?.setAttribute('opacity', next.visible ? '1' : '0')
      jet.current?.setAttribute('data-angle', next.angle.toFixed(2))
      jet.current?.setAttribute('data-distance', next.distance.toFixed(2))
      jet.current?.setAttribute('data-target-x', next.target.x.toFixed(2))
      jet.current?.setAttribute('data-target-y', next.target.y.toFixed(2))
      if (clock.current - lastReadout >= .1 || lastReadout === -Infinity) {
        const metres = next.distance / IRRIGATION_MAX_RADIUS * IRRIGATION_MAX_METRES
        readout.value.current?.replaceChildren(document.createTextNode(metres.toFixed(1).replace('.', ',')))
        readout.bar.current?.style.setProperty('transform', `scaleX(${next.distance / IRRIGATION_MAX_RADIUS})`)
        lastReadout = clock.current
      }
      drops.current.forEach((drop, i) => {
        if (!drop) return
        const flight = ((clock.current / FLIGHT_SECONDS + i * .61803398875) % 1 + 1) % 1
        const aim = aimAt(clock.current - flight * FLIGHT_SECONDS)
        const adx = aim.target.x - IRRIGATION_SOURCE.x
        const ady = aim.target.y - IRRIGATION_SOURCE.y
        const alength = Math.max(1, aim.distance)
        const side = Math.sin(i * 2.399963) * flight ** 2 * 3
        const project = (t: number) => ({
          x: IRRIGATION_SOURCE.x + adx * t - ady / alength * side,
          y: IRRIGATION_SOURCE.y + ady * t - Math.sin(t * Math.PI) * Math.min(34, aim.distance * .15) + adx / alength * side,
        })
        const head = project(flight)
        const tail = project(Math.max(0, flight - .008 - (i % 4) * .002))
        drop.setAttribute('d', `M${tail.x} ${tail.y} L${head.x} ${head.y}`)
        drop.setAttribute('opacity', aim.visible ? String(Math.min(.9, flight * 5, (1 - flight) * 12)) : '0')
      })
      ripples.current.forEach((ripple, i) => {
        if (!ripple) return
        const age = (clock.current / .75 + i / 8) % 1
        const aim = aimAt(clock.current - FLIGHT_SECONDS - age * .75)
        ripple.setAttribute('cx', String(aim.target.x))
        ripple.setAttribute('cy', String(aim.target.y))
        ripple.setAttribute('rx', String(1.5 + age * 9))
        ripple.setAttribute('ry', String(.7 + age * 4))
        ripple.setAttribute('opacity', aim.visible ? String((1 - age) * .55) : '0')
      })
    }
    draw()
    if (!running) return
    const tick = (time: number) => {
      if (lastTime !== null) clock.current += Math.min(time - lastTime, 64) / 1000
      lastTime = time
      draw()
      animation = requestAnimationFrame(tick)
    }
    animation = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animation)
  }, [zone, running, lawn, lookup, readout])

  return <g pointerEvents="none" aria-hidden="true">
    <defs>
      <linearGradient ref={gradient} id={`${id}-water`} gradientUnits="userSpaceOnUse" x1={IRRIGATION_SOURCE.x} y1={IRRIGATION_SOURCE.y} x2="600" y2="350">
        <stop stopColor="#f1fffc" stopOpacity=".85" /><stop offset=".45" stopColor="#83cdd7" stopOpacity=".45" /><stop offset="1" stopColor="#d6f5f1" stopOpacity=".05" />
      </linearGradient>
    </defs>
    {!lawn && <g className={styles.sweepLimits}>
      {[{ point: limits.startTarget, label: 'DÉPART' }, { point: limits.endTarget, label: 'BUTÉE' }].map(({ point, label }, i) => <g key={label}>
        <path d={`M${IRRIGATION_SOURCE.x} ${IRRIGATION_SOURCE.y} L${point.x} ${point.y}`} /><circle cx={point.x} cy={point.y} r="3" />
        <text x={point.x + (i === 0 ? 8 : -8)} y={point.y - 9} textAnchor={i === 0 ? 'start' : 'end'}>{label}</text>
      </g>)}
    </g>}
    <g ref={jet} data-irrigation-jet="true" data-zone={IRRIGATION_ZONES[zone].id} data-turn-seconds={TURN_SECONDS}>
      <path ref={dimension} className={styles.rangeLine} />
      <path ref={halo} className={styles.jetHalo} />
      <path ref={ribbon} fill={`url(#${id}-water)`} />
      <path ref={core} className={styles.jetCore} />
      <g data-irrigation-drops="true">{Array.from({ length: DROP_COUNT }, (_, i) => <path key={i} ref={node => { drops.current[i] = node }} className={styles.fineDrop} strokeWidth={i % 5 === 0 ? 1.6 : .9} />)}</g>
      <g clipPath={`url(#${id}-zone-${zone})`}>
        <g ref={impact}><ellipse rx="9" ry="4" className={styles.impactMist} /><ellipse rx="3" ry="1.4" className={styles.impactCentre} /></g>
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} ref={node => { ripples.current[i] = node }} className={styles.groundRipple} />)}
      </g>
    </g>
    <g ref={nozzle}><path d="M9 -2H18L22 0L18 2H9Z" fill="#d1e5df" stroke="#315d64" strokeWidth=".6" /><path d="M18 -1.5V1.5" stroke="#effffb" strokeWidth="1" /></g>
  </g>
}

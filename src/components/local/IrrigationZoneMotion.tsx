'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Check, Droplets, Map, Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react'
import styles from './IrrigationZoneMotion.module.css'

const steps = [
  { label: 'Délimiter', title: 'Votre gazon a ses contours.', description: 'On repère les surfaces à arroser et les espaces à préserver : terrasse, allée, massifs. Le jardin dicte le tracé.', icon: Map },
  { label: 'Programmer', title: 'Chaque zone a ses besoins.', description: 'Le rythme d’arrosage se réfléchit selon l’exposition, le sol et le gazon. Les réglages se définissent lors de l’installation.', icon: SlidersHorizontal },
  { label: 'Arroser', title: 'L’eau vise les bonnes surfaces.', description: 'Le balayage illustre un arrosage dirigé vers les zones de gazon dessinées. Le placement et les limites se vérifient sur le terrain.', icon: Droplets },
]

const zonePaths = [
  'M290 123 C354 110 404 102 468 126 L451 250 C405 261 350 255 286 255 L286 202 Q279 169 290 123Z',
  'M468 126 C514 110 560 145 612 189 L606 294 C555 278 491 270 451 250Z',
  'M286 255 C346 255 405 261 451 250 C491 270 555 278 606 294 L599 389 C549 421 438 414 368 399 C303 386 248 400 192 388 L194 326 C248 329 277 296 286 255Z',
]

const lawnPath = 'M290 123 C354 110 404 102 468 126 C514 110 560 145 612 189 L606 294 L599 389 C549 421 438 414 368 399 C303 386 248 400 192 388 L194 326 C248 329 277 296 286 255 L286 202 Q279 169 290 123Z'

function subscribeToMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function motionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Shrub({ x, y, size = 1, pale = false }: { x: number; y: number; size?: number; pale?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    <ellipse cy="6" rx="20" ry="16" fill="#173e4933" />
    <circle cx="-9" cy="1" r="12" fill={pale ? '#aabb9a' : '#577d63'} />
    <circle cx="7" cy="-4" r="15" fill={pale ? '#b8c7aa' : '#6d9074'} />
    <circle cx="3" cy="7" r="10" fill={pale ? '#93aa88' : '#467059'} />
    <path d="M-10 0 Q3 -8 12 -5 M0 6L8 0" stroke="#e8efdc" strokeOpacity=".3" strokeWidth="1" fill="none" />
  </g>
}

function GardenPlan({ id, step, zone }: { id: string; step: number; zone: number }) {
  return (
    <svg className={styles.plan} viewBox="0 0 720 510" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{`Plan fictif de jardin : ${steps[step].label.toLowerCase()} les zones d’arrosage`}</title>
      <desc id={`${id}-description`}>Vue de dessus d’un jardin avec une maison, une terrasse, des massifs et une allée. Trois zones de pelouse courbes sont dessinées. Seules les zones de gazon apparaissent dans le balayage d’eau illustré.</desc>
      <defs>
        <pattern id={`${id}-grid`} width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#477980" strokeOpacity=".07" strokeWidth=".6" /></pattern>
        <pattern id={`${id}-grass`} width="32" height="29" patternUnits="userSpaceOnUse"><path d="M5 10l2 -4 3 4 M24 24l2 -4 3 3" fill="none" stroke="#34684b" strokeWidth=".8" strokeOpacity=".19" /></pattern>
        <pattern id={`${id}-deck`} width="15" height="15" patternUnits="userSpaceOnUse"><path d="M0 0V15 M2 0V15" stroke="#92775d" strokeOpacity=".24" strokeWidth=".6" /></pattern>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#446772" /><stop offset="1" stopColor="#234954" /></linearGradient>
        <radialGradient id={`${id}-spray`} cx="341" cy="283" r="325" gradientUnits="userSpaceOnUse"><stop stopColor="#d5f3f3" stopOpacity=".12" /><stop offset=".65" stopColor="#a4dedd" stopOpacity=".45" /><stop offset="1" stopColor="#9ed9df" stopOpacity=".05" /></radialGradient>
        <filter id={`${id}-shadow`} x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#34565e" floodOpacity=".15" /></filter>
        <clipPath id={`${id}-lawn`}><path d={lawnPath} /></clipPath>
        {zonePaths.map((path, index) => <clipPath key={index} id={`${id}-zone-${index}`}><path d={path} /></clipPath>)}
      </defs>

      <rect width="720" height="510" fill={`url(#${id}-grid)`} />
      <g className={styles.planFrame}>
        <rect x="43" y="43" width="634" height="406" rx="21" fill="#f0eee4" filter={`url(#${id}-shadow)`} />
        <rect x="43" y="43" width="634" height="406" rx="21" fill="none" stroke="#c7d3ce" strokeWidth="1" />
        <path d="M64 69H290 M660 139V422 H622 M64 300V429H148" stroke="#82948b" strokeWidth="4" strokeLinecap="round" opacity=".4" fill="none" />

        <path d="M292 73 C388 62 438 77 485 70 C550 59 608 88 651 130 L643 173 C575 146 564 109 502 111 C412 95 360 109 292 108Z" fill="#d9d6c3" />
        <path d="M73 288 Q116 283 164 307 L163 406 H80 Q63 346 73 288Z" fill="#d9d6c3" />
        <path d="M628 179 L650 178 L639 422 Q618 443 575 429 L570 414 Q606 414 614 391Z" fill="#dce1db" />
        <path d="M637 181L627 392Q624 422 579 421" stroke="#b6c3be" strokeWidth="1" strokeDasharray="1 14" fill="none" />

        <path d={lawnPath} fill="#bfd0ac" />
        <path d={lawnPath} fill={`url(#${id}-grass)`} />
        {zonePaths.map((path, index) => <path key={`fill-${index}`} d={path} className={`${styles.zoneFill} ${zone === index ? styles.activeZone : ''}`} fill={index === 0 ? '#b9cdad' : index === 1 ? '#aec6aa' : '#c0d0ae'} />)}
        <path d={lawnPath} fill={`url(#${id}-grass)`} />

        <g filter={`url(#${id}-shadow)`}>
          <rect x="76" y="76" width="193" height="107" rx="3" fill="#173e49" />
          <path d="M70 74H274V178H70Z" fill={`url(#${id}-roof)`} />
          <path d="M172 74V178" stroke="#a4bcc1" strokeWidth="2" opacity=".55" />
          <path d="M76 79L165 126L76 172 M267 79L179 126L267 172" stroke="#bed0ce" strokeWidth=".8" opacity=".3" fill="none" />
          <rect x="196" y="100" width="35" height="22" rx="1" fill="#173e49" stroke="#adc3c6" strokeWidth="1" />
          <path d="M198 102L229 120" stroke="#abc3c4" strokeWidth=".8" opacity=".5" />
          <rect x="126" y="145" width="37" height="33" rx="1" fill="#d8e1da" stroke="#abc0bc" strokeWidth="1" />
          <path d="M128 158H161 M145 147V177" stroke="#809a9e" strokeWidth="1" />
        </g>
        <rect x="76" y="189" width="193" height="73" rx="3" fill="#d9c9ad" />
        <rect x="76" y="189" width="193" height="73" rx="3" fill={`url(#${id}-deck)`} />
        <g transform="translate(181 225)">
          <rect x="-23" y="-16" width="46" height="33" rx="4" fill="#eae7dc" stroke="#aaad98" strokeWidth="1" />
          <path d="M-15 -22H15 M-15 23H15 M-30 -8V9 M30 -8V9" stroke="#f5f3eb" strokeWidth="6" strokeLinecap="round" />
          <circle r="7" fill="#6c886b" /><circle cx="3" cy="-3" r="4" fill="#aabb91" />
        </g>

        {[{ x: 322, y: 87, size: .9 }, { x: 367, y: 80, size: .76 }, { x: 410, y: 83, size: .95 }, { x: 457, y: 87, size: .72 }, { x: 500, y: 84, size: .85 }, { x: 546, y: 93, size: .8 }, { x: 587, y: 112, size: .87 }, { x: 623, y: 139, size: .7 }, { x: 94, y: 313, size: .8 }, { x: 129, y: 338, size: .8 }, { x: 101, y: 374, size: .94 }, { x: 143, y: 389, size: .65 }].map((shrub, index) => <Shrub key={index} {...shrub} pale={index % 3 === 0} />)}

        <g className={styles.exclusions} fill="none" stroke="#be8775" strokeWidth="1.6" strokeDasharray="4 5">
          <rect x="71" y="185" width="202" height="81" rx="7" />
          <path d="M292 73 C388 62 438 77 485 70 C550 59 608 88 651 130 L643 173 C575 146 564 109 502 111 C412 95 360 109 292 108Z" />
          <path d="M628 179 L650 178 L639 422 Q618 443 575 429 L570 414 Q606 414 614 391Z" />
        </g>

        <g className={styles.zoneOutlines} fill="none" stroke="#3f8189" strokeWidth="2.2" strokeLinejoin="round">
          {zonePaths.map((path, index) => <path key={index} d={path} pathLength="100" className={`${styles.zoneOutline} ${zone === index ? styles.selectedOutline : ''}`} style={{ animationDelay: `${index * .6}s` }} />)}
        </g>

        {step === 2 && <g clipPath={`url(#${id}-zone-${zone})`} className={styles.irrigation}>
          <path d={zonePaths[zone]} fill="#acd8db" fillOpacity=".2" className={styles.waterWash} />
          <g className={styles.spraySweep}>
            <path d="M341 283 L409 -51 A342 342 0 0 1 628 97Z" fill={`url(#${id}-spray)`} />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => {
              const angle = (-77 + index * 6.5) * Math.PI / 180
              return <path key={index} d={`M${341 + Math.cos(angle) * 34} ${283 + Math.sin(angle) * 34} L${341 + Math.cos(angle) * 310} ${283 + Math.sin(angle) * 310}`} stroke="#effeff" strokeOpacity=".35" strokeWidth=".85" strokeDasharray="1 11" strokeLinecap="round" />
            })}
          </g>
          <g fill="#ebffff">{Array.from({ length: 70 }, (_, index) => <circle key={index} cx={199 + (index * 57) % 419} cy={124 + (index * 43) % 285} r={index % 4 === 0 ? 2 : 1.1} className={styles.waterDroplet} style={{ animationDelay: `${index * -.17}s` }} />)}</g>
        </g>}

        <g className={styles.zoneMarkers}>
          {[{ x: 367, y: 185 }, { x: 540, y: 212 }, { x: 455, y: 337 }].map((point, index) => <g key={index} transform={`translate(${point.x} ${point.y})`} opacity={zone === index ? 1 : .65}>
            <circle r="16" fill={zone === index ? '#285f69' : '#f5f8ed'} stroke={zone === index ? '#e7f0e4' : '#597e70'} strokeWidth="1" />
            <text textAnchor="middle" dominantBaseline="central" fill={zone === index ? '#f0f9f3' : '#456559'} fontSize="11" fontFamily="monospace">{`0${index + 1}`}</text>
          </g>)}
        </g>

        <path d="M274 237 C287 259 313 233 327 252 Q338 263 341 282" stroke="#628583" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="273" cy="236" r="4" fill="#cedfd6" stroke="#648985" strokeWidth="1.5" />
        <g transform="translate(341 283)">
          <ellipse cy="6" rx="15" ry="9" fill="#173e4944" />
          <circle r="13" fill="#234954" stroke="#e4ece5" strokeWidth="1.5" />
          <circle r="7" fill="#467380" />
          <path d="M-3 -4H3V4H-3Z" fill="#dbe5dc" />
          {step === 2 && <circle r="20" fill="none" stroke="#609fa4" strokeWidth="1" className={styles.devicePulse} />}
        </g>

        <g className={styles.planLabels} fill="#5d7372" fontFamily="sans-serif" fontSize="9" letterSpacing="1.5">
          <text x="172" y="57" textAnchor="middle">MAISON</text>
          <text x="170" y="281" textAnchor="middle">TERRASSE</text>
          <text x="359" y="465" textAnchor="middle">PLAN ILLUSTRATIF · SANS ÉCHELLE</text>
        </g>
      </g>

      <g transform="translate(648 27)" fill="#6a8588">
        <path d="M0 -9L-4 4L0 1L4 4Z" /><text y="18" textAnchor="middle" fontSize="7" fontFamily="monospace">N</text>
      </g>
      <path d="M22 40H31 M26 35V45 M689 444H699 M694 439V449" stroke="#a9bec0" strokeWidth=".9" />
    </svg>
  )
}

export default function IrrigationZoneMotion() {
  const [step, setStep] = useState(0)
  const [zone, setZone] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [replay, setReplay] = useState(0)
  const container = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId().replace(/:/g, '')
  const reducedMotion = useSyncExternalStore(subscribeToMotion, motionSnapshot, () => false)
  const running = visible && !paused && !reducedMotion
  const Icon = steps[step].icon

  useEffect(() => {
    const target = container.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  function chooseStep(index: number, focus = false) {
    const next = (index + steps.length) % steps.length
    setStep(next)
    setReplay(previous => previous + 1)
    if (focus) buttons.current[next]?.focus()
  }

  return (
    <div ref={container} className={`${styles.card} ${running ? styles.running : styles.still} ${styles[`step${step}`]}`}>
      <div className={styles.topline}>
        <span className={styles.eyebrow}><span /> LE JARDIN, ZONE PAR ZONE</span>
        <div className={styles.controls}>
          <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Reprendre la démonstration des zones' : 'Mettre la démonstration des zones en pause'} disabled={reducedMotion}>
            {paused || reducedMotion ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => { setStep(0); setZone(0); setPaused(false); setReplay(previous => previous + 1) }} aria-label="Rejouer la démonstration depuis la délimitation"><RotateCcw size={13} aria-hidden="true" /></button>
        </div>
      </div>

      <figure className={styles.figure}>
        <div key={`${step}-${replay}`} className={styles.planEntry}><GardenPlan id={`${id}-${step}`} step={step} zone={zone} /></div>
        <div className={styles.legend}>
          <span><i className={styles.lawnSwatch} />Pelouse à arroser</span>
          <span><i className={styles.excludedSwatch} />Espaces exclus</span>
        </div>
        <figcaption>Illustration pédagogique · zones fictives</figcaption>
      </figure>

      <div className={styles.zonePicker} role="group" aria-label="Choisir une zone de démonstration">
        <span>Explorer le plan</span>
        {[0, 1, 2].map(index => <button key={index} type="button" aria-pressed={zone === index} className={zone === index ? styles.selectedZone : ''} onClick={() => setZone(index)}>{zone === index && <Check size={11} aria-hidden="true" />}Zone 0{index + 1}</button>)}
      </div>

      <div className={styles.steps} role="tablist" aria-label="Les étapes d’un arrosage ciblé">
        {steps.map((item, index) => <button key={item.label} ref={node => { buttons.current[index] = node }} type="button" role="tab" tabIndex={index === step ? 0 : -1} id={`${id}-step-${index}`} aria-controls={`${id}-explanation`} aria-selected={index === step} className={index === step ? styles.activeStep : ''} onClick={() => chooseStep(index)} onKeyDown={event => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); chooseStep(index + (event.key === 'ArrowRight' ? 1 : -1), true) }
          if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); chooseStep(event.key === 'Home' ? 0 : steps.length - 1, true) }
        }}><span className={styles.stepNumber}>0{index + 1}</span><span>{item.label}</span><span key={`${step}-${replay}`} className={styles.progress} onAnimationEnd={() => { if (index === step && running) setStep(previous => (previous + 1) % steps.length) }} /></button>)}
      </div>

      <div id={`${id}-explanation`} role="tabpanel" aria-labelledby={`${id}-step-${step}`} className={styles.explanation} tabIndex={0}>
        <span className={styles.explanationIcon}><Icon size={21} strokeWidth={1.4} aria-hidden="true" /></span>
        <div><p className={styles.explanationTitle}>{steps[step].title}</p><p className={styles.explanationCopy}>{steps[step].description}</p></div>
      </div>
    </div>
  )
}

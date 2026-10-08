'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './GardenPreventionVisual.module.css'

const topics = [
  { label: 'Végétation', title: 'Limiter les lieux de repos.', text: 'Herbes hautes, haies et débris : on entretient les refuges frais et ombragés, avec une hauteur de tonte adaptée au gazon.' },
  { label: 'Arrosage', title: 'L’eau utile, à la juste dose.', text: 'On adapte les apports au sol et à la plante, puis on vérifie les évacuations pour éviter les accumulations d’eau.' },
  { label: 'Eau stagnante', title: 'Couper le cycle à la source.', text: 'Les larves se développent dans l’eau. Chaque semaine, on vide les coupelles et petits récipients qui peuvent la retenir.' },
] as const

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const motionSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function TigerMosquito({ id }: { id: string }) {
  const legs = [
    'M290 211Q269 226 249 225L178 260L139 313',
    'M304 221Q283 247 274 268L233 315L213 355',
    'M319 229Q321 260 354 279L392 326L433 352',
    'M294 208Q298 192 340 180L390 151L458 150',
    'M308 215Q328 209 363 224L419 220L477 248',
    'M321 229Q352 240 386 267L432 294L480 323',
  ]
  return <svg viewBox="0 0 600 400" className={styles.mosquito} role="img" aria-labelledby={`${id}-insect-title ${id}-insect-desc`}>
    <title id={`${id}-insect-title`}>Illustration du moustique tigre, Aedes albopictus</title>
    <desc id={`${id}-insect-desc`}>Insecte noir, six pattes fines annelées de blanc, longue trompe, deux ailes et ligne blanche sur le thorax. Illustration agrandie, sans échelle.</desc>
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#39453b" /><stop offset=".5" stopColor="#1d2923" /><stop offset="1" stopColor="#101c17" /></linearGradient>
      <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e7efe1" stopOpacity=".75" /><stop offset="1" stopColor="#a8c0ad" stopOpacity=".18" /></linearGradient>
    </defs>
    <circle cx="304" cy="224" r="154" fill="#e6ebde" />
    <circle cx="304" cy="224" r="136" fill="none" stroke="#bccdb5" strokeWidth=".7" />
    <path d="M35 337Q69 247 102 183M63 265Q38 252 37 227Q67 229 75 245M87 216Q101 198 120 201Q117 225 91 234M43 314Q24 302 20 278Q49 280 56 291" fill="none" stroke="#b3c5a8" strokeWidth="1" opacity=".55" />
    <g className={styles.insectBody}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {legs.map((path, i) => <g key={path}><path d={path} stroke="#243c2c" strokeWidth={i < 3 ? 3.8 : 2.8} /><path d={path} stroke="#edf1e6" strokeWidth={i < 3 ? 3 : 2.2} strokeDasharray="5 23" strokeDashoffset={i * 5 + 11} /></g>)}
      </g>
      <g className={styles.farWing}>
        <path d="M305 205C338 169 403 125 431 128C433 148 364 197 314 215Z" fill={`url(#${id}-wing)`} stroke="#6f8d75" strokeWidth="1" />
        <path d="M310 207L423 133M329 193L352 187L358 172M355 176L384 173L393 151" fill="none" stroke="#839d86" strokeWidth=".65" />
      </g>
      <path d="M318 222C348 223 386 245 416 272Q421 279 412 278C374 269 342 252 319 239Z" fill={`url(#${id}-body)`} />
      <g fill="none" stroke="#d4ded2" strokeWidth="1.6"><path d="M337 237l-4 7M354 245l-4 7M371 253l-4 6M388 260l-3 7M403 267l-3 5" /></g>
      <path d="M279 198C286 186 307 190 320 205C330 215 333 229 324 235C309 238 289 222 279 207Z" fill={`url(#${id}-body)`} stroke="#4c6050" strokeWidth=".8" />
      <path d="M286 195Q304 198 323 226" stroke="#f4f5e9" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M280 204L267 196" stroke="#233d2c" strokeWidth="5" />
      <ellipse cx="264" cy="193" rx="13" ry="10" transform="rotate(32 264 193)" fill="#203b2a" />
      <ellipse cx="260" cy="190" rx="4" ry="5" fill="#0c231a" />
      <path d="M254 188L182 132L174 120M258 187Q253 168 229 154M262 187Q274 171 262 153M252 191L227 171" stroke="#253d2b" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M229 154l-3 -8M236 158l-2 -8M244 164l1 -7M260 161l5 -5" stroke="#47604a" strokeWidth=".8" />
      <g className={styles.nearWing}>
        <path d="M307 212C345 200 421 179 451 193C443 211 365 230 314 226Z" fill={`url(#${id}-wing)`} stroke="#6f8d75" strokeWidth="1" />
        <path d="M314 216L442 195M331 213L356 215L374 206M364 207L390 206L409 196M390 202L410 205L433 197" fill="none" stroke="#839d86" strokeWidth=".65" />
      </g>
    </g>
    <g fill="none" stroke="#789272" strokeWidth=".8">
      <path d="M305 203L355 80H460" /><circle cx="305" cy="203" r="4" />
      <path d="M397 319L445 361H510" /><circle cx="397" cy="319" r="4" />
    </g>
    <g fill="#476543" fontSize="11" fontFamily="monospace"><text x="470" y="84">01</text><text x="520" y="365">02</text></g>
  </svg>
}

function GardenScene({ mode, id }: { mode: number; id: string }) {
  return <svg viewBox="0 0 420 260" className={styles.scene} role="img" aria-labelledby={`${id}-scene-title`}>
    <title id={`${id}-scene-title`}>{topics[mode].title}</title>
    <defs><pattern id={`${id}-soil`} width="23" height="18" patternUnits="userSpaceOnUse"><circle cx="7" cy="8" r="1" fill="#8a9770" opacity=".25" /></pattern></defs>
    <path d="M28 211Q151 204 210 210T392 211V244H28Z" fill="#dbe1cd" />
    <path d="M28 211Q151 204 210 210T392 211V244H28Z" fill={`url(#${id}-soil)`} />
    {mode === 0 && <>
      <g className={styles.grassSway} fill="none" stroke="#608156" strokeLinecap="round">
        {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${50 + i * 19} 211Q${42 + i * 19} ${169 - i % 3 * 12} ${48 + i * 19} ${147 - i % 3 * 12}`} strokeWidth="2" />)}
      </g>
      <path d="M58 165Q210 158 362 165" fill="none" stroke="#a5b794" strokeDasharray="3 6" />
      <g className={styles.cutLine}><path d="M59 166H362" stroke="#426d4a" strokeWidth="1.2" /><circle cx="210" cy="166" r="5" fill="#f5f6ed" stroke="#426d4a" /></g>
      <path d="M38 117L63 117M50 105V129" stroke="#83a178" strokeWidth="1" />
      <text x="210" y="91" textAnchor="middle" fill="#55704f" fontSize="11" fontFamily="sans-serif">La bonne hauteur, selon la saison.</text>
    </>}
    {mode === 1 && <>
      <g fill="none" stroke="#6c8c5f" strokeWidth="2" strokeLinecap="round">{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${73 + i * 26} 211q-3 -23 3 -36`} />)}</g>
      <path d="M165 74H258L252 114H173Z" fill="#d7e2d2" stroke="#698773" /><path d="M181 83H242" stroke="#f2f7ed" strokeWidth="2" />
      <g className={styles.rootFlow} fill="none" stroke="#80b8b7" strokeWidth="1.4" strokeLinecap="round"><path d="M186 113L173 177M210 115V184M235 113L249 177" strokeDasharray="2 12" /></g>
      <g fill="none" stroke="#94a780" strokeWidth="1"><path d="M100 213l-7 18m7 -14l10 14M178 213v22m0 -14l-10 9M246 213l7 21M310 214l-5 20m4 -13l10 10" /></g>
      <text x="210" y="48" textAnchor="middle" fill="#55704f" fontSize="11" fontFamily="sans-serif">L’eau rejoint la zone racinaire.</text>
    </>}
    {mode === 2 && <>
      <path d="M251 100H342L330 190H263Z" fill="#e2e5d5" stroke="#769075" strokeWidth="1.2" /><path d="M258 111H336" stroke="#c0cbb0" />
      <path d="M244 102H349L343 92H250Z" fill="#b5c6a8" stroke="#69876a" />
      <path d="M292 80h11" stroke="#69876a" strokeWidth="3" strokeLinecap="round" />
      <g className={styles.emptySaucer}>
        <path d="M67 178Q111 165 164 180L157 193Q108 204 72 190Z" fill="#d2ddc7" stroke="#688665" strokeWidth="1.2" />
        <path d="M81 181Q117 175 153 182" fill="none" stroke="#f4f7ef" strokeWidth="2" />
      </g>
      <path d="M175 161Q198 130 232 152M223 142l10 10 -14 3" fill="none" stroke="#729769" strokeWidth="1.5" strokeLinecap="round" />
      <text x="210" y="48" textAnchor="middle" fill="#55704f" fontSize="11" fontFamily="sans-serif">Vider les coupelles. Couvrir les réserves.</text>
    </>}
  </svg>
}

export default function GardenPreventionVisual() {
  const [mode, setMode] = useState(2)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId().replace(/:/g, '')
  const reduced = useSyncExternalStore(subscribeToMotion, motionSnapshot, () => false)
  const running = visible && !paused && !reduced

  useEffect(() => {
    if (!container.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  function selectTopic(index: number, focus = false) {
    const next = (index + topics.length) % topics.length
    setMode(next)
    if (focus) buttons.current[next]?.focus()
  }

  return <div ref={container} className={`${styles.visuals} ${!running ? styles.still : ''}`} data-garden-prevention-visual>
    <figure className={styles.identity}>
      <div className={styles.identityHeader}><div><p className={styles.eyebrow}>AEDES ALBOPICTUS</p><h3>Reconnaître le moustique tigre.</h3></div><button className={styles.pause} type="button" aria-label={paused ? 'Reprendre les illustrations du jardin' : 'Mettre les illustrations du jardin en pause'} aria-pressed={paused} disabled={reduced} onClick={() => setPaused(!paused)}>{paused || reduced ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button></div>
      <TigerMosquito id={id} />
      <div className={styles.identifiers}><span><b>01</b> Une ligne blanche sur le thorax</span><span><b>02</b> Des pattes annelées de blanc</span></div>
      <figcaption>Illustration agrandie, sans échelle · Deux repères pour mieux l’identifier.</figcaption>
    </figure>
    <div className={styles.prevention}>
      <p className={styles.eyebrow}>LES GESTES QUI COMPTENT</p>
      <div className={styles.tabs} role="tablist" aria-label="Explorer les gestes de prévention">
        {topics.map((topic, i) => <button key={topic.label} ref={node => { buttons.current[i] = node }} type="button" role="tab" id={`${id}-topic-${i}`} aria-selected={mode === i} aria-controls={`${id}-topic-panel`} tabIndex={mode === i ? 0 : -1} onClick={() => selectTopic(i)} onKeyDown={event => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectTopic(i + (event.key === 'ArrowRight' ? 1 : -1), true) }
          if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectTopic(event.key === 'Home' ? 0 : topics.length - 1, true) }
        }}>{topic.label}</button>)}
      </div>
      <div id={`${id}-topic-panel`} role="tabpanel" aria-labelledby={`${id}-topic-${mode}`} className={styles.panel} tabIndex={0}>
        <div key={mode} className={styles.sceneEntry}><GardenScene mode={mode} id={id} /></div>
        <h3>{topics[mode].title}</h3><p>{topics[mode].text}</p>
      </div>
      <span className={styles.note}>Prévenir, avec des gestes complémentaires.</span>
    </div>
  </div>
}

'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import styles from './OverseedingSection.module.css'

const steps = [
  { label: 'Préparer', title: 'Ouvrir la surface, au bon endroit.', text: 'Les pointes passent sur la zone faible et créent de petites poches, sans retourner le sol.' },
  { label: 'Semer', title: 'Déposer le mélange Hanami.', text: 'Les graines sont apportées dans un second geste : elles trouvent un meilleur contact avec la terre.' },
  { label: 'Accompagner', title: 'Donner à la graine ses conditions de départ.', text: 'Humidité régulière, températures favorables et suivi adapté permettent au jeune gazon de s’installer.' },
] as const
const holes = [250, 279, 308, 337, 366, 395]
const star = Array.from({ length: 20 }, (_, i) => {
  const a = i * Math.PI / 10
  const r = i % 2 ? 10 : 23
  return `${Math.cos(a) * r},${Math.sin(a) * r}`
}).join(' ')
function subscribe(callback: () => void) {
  const q = matchMedia('(prefers-reduced-motion: reduce)')
  q.addEventListener('change', callback)
  return () => q.removeEventListener('change', callback)
}
const motionSnapshot = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function OverseedingSoilMotion() {
  const id = useId().replace(/:/g, '')
  const container = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [auto, setAuto] = useState(true)
  const [replay, setReplay] = useState(0)
  const reduced = useSyncExternalStore(subscribe, motionSnapshot, () => false)
  const running = visible && !paused && !reduced

  useEffect(() => {
    const node = container.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!running || !auto) return
    const timer = setTimeout(() => setStep(value => (value + 1) % steps.length), 4600)
    return () => clearTimeout(timer)
  }, [step, running, auto, replay])

  return <figure ref={container} className={`${styles.soilMotion} ${running ? '' : styles.still}`} data-overseeding-motion>
    <div className={styles.motionHead}><span>Le geste, simplement</span><div><button type="button" aria-label={paused ? 'Reprendre l’animation du regarnissage' : 'Mettre l’animation du regarnissage en pause'} aria-pressed={paused} onClick={() => setPaused(!paused)} disabled={reduced}>{paused || reduced ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button><button type="button" aria-label="Rejouer les étapes du regarnissage" onClick={() => { setStep(0); setAuto(true); setPaused(false); setReplay(value => value + 1) }}><RotateCcw size={14} aria-hidden="true" /></button></div></div>
    <svg key={`${step}-${replay}`} viewBox="0 0 640 290" role="img" aria-labelledby={`${id}-title ${id}-description`} className={styles.soilSvg}>
      <title id={`${id}-title`}>{steps[step].title}</title><desc id={`${id}-description`}>Coupe pédagogique du sol : une zone clairsemée est préparée entre deux zones de gazon sain. Les petites poches reçoivent ensuite des semences, puis un arrosage adapté accompagne la levée. Étapes accélérées, sans échelle.</desc>
      <defs><linearGradient id={`${id}-earth`} x2="0" y2="1"><stop stopColor="#93876a" /><stop offset="1" stopColor="#c7b998" /></linearGradient><linearGradient id={`${id}-steel`}><stop stopColor="#eef0e7" /><stop offset=".5" stopColor="#74887e" /><stop offset="1" stopColor="#dae0d4" /></linearGradient></defs>
      <path d="M30 159H610V270H30Z" fill={`url(#${id}-earth)`} />
      <path d="M30 157H224L234 163H413L423 157H610" stroke="#75694f" strokeWidth="7" fill="none" />
      <path d="M30 204H610M30 237H610" stroke="#e8ddc5" strokeWidth="1" strokeDasharray="2 12" opacity=".55" />
      {[60, 88, 116, 144, 172, 200, 446, 474, 502, 530, 558, 586].map((x, i) => <g key={x}>
        <path d={`M${x} 158Q${x - 14} 137 ${x - 8} ${127 - i % 3 * 9} M${x} 158Q${x + 6} 131 ${x + 12} ${119 + i % 3 * 5}`} stroke={i % 2 ? '#6b8951' : '#365f3e'} strokeWidth="3.7" fill="none" strokeLinecap="round" />
        <path d={`M${x} 163Q${x - 8} 185 ${x + 3} 210 M${x} 178L${x - 10} 191 M${x} 189L${x + 11} 198`} stroke="#e3d9b5" strokeWidth="1.1" fill="none" />
      </g>)}
      {holes.map((x, i) => <g key={`${step}-${x}`} className={step === 0 ? styles.pocket : ''} style={{ animationDelay: `${i * .5 + .5}s` }}>
        <path d={`M${x - 9} 161Q${x} 189 ${x + 9} 161`} stroke="#75694f" strokeWidth="2" fill="#ddd3b7" />
        {step > 0 && <ellipse cx={x} cy="174" rx="4" ry="2" fill="#d8af60" className={step === 1 ? styles.seed : ''} style={{ animationDelay: `${i * .16}s` }} />}
        {step === 2 && <g className={styles.newGrowth} style={{ animationDelay: `${i * .1}s` }}><path d={`M${x} 174Q${x - 3} 146 ${x - 9} 133 M${x} 165Q${x + 3} 144 ${x + 7} 126`} stroke="#567f40" strokeWidth="3" fill="none" strokeLinecap="round" /><path d={`M${x} 178Q${x - 7} 205 ${x} 225 M${x - 2} 196L${x - 12} 212 M${x - 1} 207L${x + 8} 216`} stroke="#e6ddba" strokeWidth="1.4" fill="none" /></g>}
      </g>)}
      {step === 0 && <g className={styles.toolTraverse}>
        <path d="M-28 1V-37Q-28 -42 -22 -42H26Q31 -42 31 -37V1M3 -42L12 -92" stroke="#245b37" strokeWidth="7" fill="none" />
        <g className={styles.starRotation}><polygon points={star} fill={`url(#${id}-steel)`} stroke="#728279" strokeWidth=".8" /><circle r="5" fill="#346b3f" /></g>
      </g>}
      {step === 2 && <g className={styles.waterDrops} stroke="#5c9399" strokeWidth="2" strokeLinecap="round">{holes.map((x, i) => <path key={x} d={`M${x + 3} 82L${x} 91`} style={{ animationDelay: `${i * .12}s` }} />)}</g>}
      <text x="122" y="47" textAnchor="middle" fill="#557249" fontSize="11" fontFamily="sans-serif">Gazon sain conservé</text><text x="320" y="47" textAnchor="middle" fill="#557249" fontSize="11" fontFamily="sans-serif">Zone faible ciblée</text><text x="516" y="47" textAnchor="middle" fill="#557249" fontSize="11" fontFamily="sans-serif">Gazon sain conservé</text>
      <path d="M230 58H410" stroke="#8a9d75" strokeWidth="1" strokeDasharray="3 5" />
    </svg>
    <div className={styles.motionSteps} role="group" aria-label="Explorer les étapes du regarnissage">{steps.map((item, index) => <button key={item.label} type="button" aria-pressed={step === index} onClick={() => { setStep(index); setAuto(false); setReplay(value => value + 1) }}><span>0{index + 1}</span>{item.label}</button>)}</div>
    <div className={styles.motionExplanation}><h4>{steps[step].title}</h4><p>{steps[step].text}</p></div>
    <figcaption>Schéma de principe · étapes accélérées · la levée prend plusieurs jours.</figcaption>
  </figure>
}

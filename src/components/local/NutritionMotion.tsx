'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowDown, Droplets, Leaf, Pause, Play, Snowflake, Sprout, Sun } from 'lucide-react'
import styles from './NutritionMotion.module.css'

type Mode = 'granular' | 'foliar' | 'roots' | 'water' | 'winter' | 'potassium'

const chapters: { id: Mode; label: string; kicker: string; title: string; description: string; steps: string[]; note: string; icon: typeof Leaf }[] = [
  {
    id: 'granular', label: 'Engrais solides', kicker: '01 / NOURRIR DANS LA DURÉE',
    title: 'Une base régulière. Un dosage précis.',
    description: 'Les granulés apportent une nutrition de fond, avec une durée d’action pouvant aller jusqu’à plusieurs mois selon la formule et les conditions. La dose est calculée pour chaque zone mesurée.',
    steps: ['Mesurer la surface', 'Choisir la formule et la dose', 'Préparer la prochaine application'],
    note: 'Je sélectionne parmi environ 50 à 60 références. Les formules se succèdent selon la saison, le gazon et les apports déjà réalisés.', icon: Sprout,
  },
  {
    id: 'foliar', label: 'Nutrition foliaire', kicker: '02 / COMPLÉTER AU BON MOMENT',
    title: 'Un complément directement sur la feuille.',
    description: 'La pulvérisation foliaire complète la fertilisation de fond. Des apports ciblés accompagnent la couleur, la vigueur et la tenue du brin, en fonction de son état et de la période.',
    steps: ['Observer le gazon', 'Choisir un apport ciblé', 'Pulvériser de façon homogène'],
    note: 'Un brin qui se redresse et se reverdit illustre l’objectif du suivi. La réponse réelle dépend du gazon, du produit et des conditions.', icon: Leaf,
  },
  {
    id: 'roots', label: 'Biostimulants', kicker: '03 / ACCOMPAGNER LE VIVANT',
    title: 'Le beau gazon commence sous vos pieds.',
    description: 'Selon leur composition, les biostimulants peuvent soutenir le fonctionnement racinaire et la réponse de la plante aux stress. Ils s’intègrent à un programme adapté au sol et aux besoins du gazon.',
    steps: ['Comprendre le sol', 'Soutenir le système racinaire', 'Observer la réponse du gazon'],
    note: 'L’action recherchée se prépare dans le temps. Ces apports complètent une tonte, un arrosage et une nutrition bien conduits.', icon: Sprout,
  },
  {
    id: 'water', label: 'Gestion de l’eau', kicker: '04 / MIEUX RÉPARTIR L’EAU',
    title: 'Faire parvenir l’eau là où elle compte.',
    description: 'Un sol hydrophobe peut laisser l’eau en surface ou la concentrer dans quelques passages. Un agent mouillant adapté aide à réhumidifier le sol et à répartir l’eau plus régulièrement dans la zone racinaire.',
    steps: ['Repérer les zones sèches', 'Améliorer la réhumidification', 'Ajuster l’arrosage au sol'],
    note: 'Sur un sol sableux ou très drainant, le choix de la formulation et la gestion de l’arrosage restent essentiels : un agent mouillant ne supprime pas le drainage.', icon: Droplets,
  },
  {
    id: 'winter', label: 'Préparer l’hiver', kicker: '05 / ANTICIPER LE FROID ET LA LUMIÈRE RÉDUITE',
    title: 'Le printemps se prépare dès l’automne.',
    description: 'Les interventions d’automne visent à densifier et à bien nourrir le gazon. Une nutrition adaptée accompagne la reconstitution de ses réserves en sucres lorsque la photosynthèse le permet, puis leur préservation pendant la saison froide, pour favoriser une reprise naturelle plus vigoureuse au printemps.',
    steps: ['Densifier à l’automne', 'Adapter la nutrition', 'Préparer la reprise au printemps'],
    note: 'Le gazon fabrique ses sucres grâce à la photosynthèse. En hiver, le froid et la faible lumière ralentissent son activité : le suivi s’ajuste au jardin et à la météo, sans forcer la croissance.', icon: Snowflake,
  },
  {
    id: 'potassium', label: 'Préparer la chaleur', kicker: '06 / ANTICIPER LES PÉRIODES SENSIBLES',
    title: 'Préparer le gazon avant qu’il ne souffre.',
    description: 'Le potassium participe à l’équilibre hydrique et à la régulation des échanges d’eau de la plante. Une nutrition adaptée, préparée avant les fortes chaleurs, accompagne sa résistance aux stress.',
    steps: ['Anticiper la météo', 'Adapter les apports', 'Préserver un arrosage raisonné'],
    note: 'Aucun apport ne rend un gazon invulnérable à la sécheresse. Le choix des semences, les racines, le sol et les pratiques d’entretien travaillent ensemble.', icon: Sun,
  },
]

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function reducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const crowns = [117, 249, 384, 519, 654, 786]
const story: Record<Mode, string[]> = {
  granular: ['Apport en surface', 'Libération progressive', 'Disponibilité racinaire'],
  foliar: ['Pulvérisation fine', 'Contact avec la feuille', 'Nutrition complémentaire'],
  roots: ['Un sol à comprendre', 'Un réseau à accompagner', 'Une réponse à observer'],
  water: ['Une surface qui résiste', 'Une infiltration répartie', 'La zone racinaire atteinte'],
  winter: ['La lumière diminue', 'Le métabolisme ralentit', 'Les réserves se préservent'],
  potassium: ['Anticiper la chaleur', 'Accompagner les échanges', 'Raisonner les apports d’eau'],
}

function Grass({ id, winter = false }: { id: string; winter?: boolean }) {
  return <g>
    {[0, 1, 2].map(layer => <g key={layer} opacity={.48 + layer * .25}>
      {Array.from({ length: 32 }, (_, i) => {
        // Quantize trigonometry so server and browser serialize identical SVG paths.
        const x = Number((78 + i * 23.4 + Math.sin(i * 2.7) * 7).toFixed(2))
        const y = 248 + layer * 10
        const height = 45 + ((i * 37 + layer * 19) % 73)
        const lean = Number((Math.sin(i * 2.1 + layer) * 29).toFixed(2))
        return <g key={i} transform={`translate(${x} ${y})`}>
          <g className={styles.turfTuft} style={{ animationDelay: `${-i * .37 - layer}s` }}>
            <path d={`M-2 0 C${lean * .25 - 5} ${-height * .35} ${lean - 8} ${-height * .8} ${lean} ${-height} C${lean + 2} ${-height * .64} 4 ${-height * .2} 3 0Z`} fill={`url(#${id}-${winter ? 'winter-blade' : layer === 2 ? 'leaf' : 'back-leaf'})`} />
            {layer === 2 && <path d={`M0 -2 Q${lean * .45} ${-height * .5} ${lean} ${-height + 7}`} fill="none" stroke="#d3e8a5" strokeWidth=".55" opacity=".5" />}
          </g>
        </g>
      })}
    </g>)}
    {crowns.map((x, index) => <g key={x} transform={`translate(${x} 270)`}>
      <g className={styles.turfTuft} style={{ animationDelay: `${-index * 1.3}s` }}>
        {[-1, 0, 1].map((direction, i) => {
          const h = 87 + ((index * 23 + i * 17) % 65)
          const tip = direction * (22 + index % 3 * 9) + (index % 2 ? 9 : -8)
          return <g key={i}>
            <path d={`M${i * 2 - 4} 0 C${tip * .3} ${-h * .3} ${tip * .7 - 7} ${-h * .75} ${tip} ${-h} C${tip + 3} ${-h * .6} 7 ${-h * .23} ${i * 2 + 1} 0Z`} fill={`url(#${id}-${winter ? 'winter-blade' : 'leaf'})`} />
            <path d={`M0 0 Q${tip * .3} ${-h * .55} ${tip} ${-h + 9}`} stroke="#e0edb7" strokeWidth=".6" opacity=".52" fill="none" />
          </g>
        })}
      </g>
      <ellipse cy="1" rx="8" ry="2.5" fill="#547344" />
    </g>)}
  </g>
}

function RootNetwork({ id, mode }: { id: string; mode: Mode }) {
  return <g fill="none" strokeLinecap="round">
    {crowns.map((x, index) => <g key={x} transform={`translate(${x} 270)`}>
      {[-1, 0, 1].map((direction, branch) => {
        const length = 131 + (index * 29 + branch * 17) % 63
        const drift = direction * (23 + index % 3 * 12)
        const path = `M0 0 C${drift * .3} 34 ${drift - 5} 64 ${drift} 92 S${drift + direction * 17} ${length - 20} ${drift + direction * 9} ${length}`
        const uptakePath = `M${drift + direction * 9} ${length} C${drift + direction * 17} ${length - 20} ${drift + 5} 120 ${drift} 92 C${drift - 5} 64 ${drift * .3} 34 0 0`
        return <g key={direction}>
          <path d={path} stroke={`url(#${id}-root)`} strokeWidth={branch === 1 ? 1.8 : 1.1} />
          {[0, 1, 2, 3].map(n => {
            const y = 42 + n * 28, rootX = drift * Math.min(1, y / 92), side = n % 2 ? -1 : 1
            return <g key={n} stroke="#c8bd96" opacity={.45 - n * .055}>
              <path d={`M${rootX} ${y} Q${rootX + side * 13} ${y + 7} ${rootX + side * 23} ${y + 28} M${rootX + side * 10} ${y + 12} l${side * 9} 4 M${rootX + side * 17} ${y + 20} l${side * 8} 2`} strokeWidth=".65" />
            </g>
          })}
          {branch === 1 && (mode === 'granular' || mode === 'roots' || mode === 'water') && <path d={uptakePath} className={styles.rootFlow} pathLength="100" stroke={mode === 'water' ? '#a7dcd0' : '#dbd4a7'} strokeWidth="2" style={{ animationDelay: `${index * -.48}s` }} />}
        </g>
      })}
    </g>)}
  </g>
}

function SoilScene({ mode, id }: { mode: Mode; id: string }) {
  const water = mode === 'water'
  const soilOutline = 'M64 270 Q183 266 313 271 T565 270 T812 270 V493 Q650 489 521 494 T270 492 T64 493Z'
  return <svg className={`${styles.scene} ${styles[mode]}`} viewBox="0 0 900 570" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{`${chapters.find(c => c.id === mode)?.label} : coupe illustrée du gazon`}</title>
    <desc id={`${id}-description`}>{`Touffes de gazon reliées à leur réseau de racines, sur une coupe du sol en profondeur. ${water ? 'À gauche, quelques passages préférentiels ; à droite, une réhumidification plus homogène.' : story[mode].join(', ') + '.'} Illustration pédagogique, sans échelle ni résultat garanti.`}</desc>
    <defs>
      <linearGradient id={`${id}-earth`} x2=".2" y2="1"><stop stopColor="#514b35" /><stop offset=".26" stopColor="#3c3b2c" /><stop offset="1" stopColor="#202d24" /></linearGradient>
      <linearGradient id={`${id}-side`} x2="1" y2=".2"><stop stopColor="#28372b" /><stop offset="1" stopColor="#111f19" /></linearGradient>
      <linearGradient id={`${id}-leaf`} x1="0" y1="1" x2=".8" y2="0"><stop stopColor="#234e34" /><stop offset=".42" stopColor="#608848" /><stop offset=".8" stopColor="#a9c875" /><stop offset="1" stopColor="#dae7a5" /></linearGradient>
      <linearGradient id={`${id}-back-leaf`} x1="0" y1="1" x2="0" y2="0"><stop stopColor="#284735" /><stop offset="1" stopColor="#769257" /></linearGradient>
      <linearGradient id={`${id}-winter-blade`} x1="0" y1="1" x2=".7" y2="0"><stop stopColor="#315443" /><stop offset=".6" stopColor="#78937a" /><stop offset="1" stopColor="#b9c8a0" /></linearGradient>
      <linearGradient id={`${id}-root`} x2=".15" y2="1"><stop stopColor="#e0d4ac" /><stop offset=".45" stopColor="#bfb58f" stopOpacity=".78" /><stop offset="1" stopColor="#8b9477" stopOpacity=".2" /></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor={mode === 'winter' ? '#a7cbd0' : '#c6d99b'} stopOpacity=".13" /><stop offset="1" stopColor="#8faf81" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-wet`}><stop stopColor="#8accc2" stopOpacity=".32" /><stop offset="1" stopColor="#77c8be" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-mineral`} cx=".35" cy=".3"><stop stopColor="#f2e2af" /><stop offset=".5" stopColor="#c8b374" /><stop offset="1" stopColor="#827550" /></radialGradient>
      <linearGradient id={`${id}-heat`} x1="1" x2="0" y2="1"><stop stopColor="#dfd5a2" stopOpacity=".13" /><stop offset="1" stopColor="#dfd5a2" stopOpacity="0" /></linearGradient>
      <clipPath id={`${id}-soil`}><path d={soilOutline} /></clipPath>
      <clipPath id={`${id}-canopy`}><rect x="64" y="86" width="748" height="181" /></clipPath>
    </defs>

    <ellipse cx="453" cy="510" rx="360" ry="13" fill="#07160f" opacity=".42" />
    <ellipse cx="442" cy="228" rx="399" ry="244" fill={`url(#${id}-light)`} />
    <g stroke="#c8d5af" opacity=".14" strokeWidth=".65" fill="none">
      <path d="M46 267V495 M41 267H51 M41 380H51 M41 495H51 M65 526H812 M65 522V530 M812 522V530" />
      {[301, 327, 353, 406, 432, 458].map(y => <path key={y} d={`M43 ${y}h5`} />)}
    </g>
    <path d="M64 270L98 237H846L812 270Z" fill="#324f36" />
    <path d="M812 270L846 237V460L812 493Z" fill={`url(#${id}-side)`} />
    <path d={soilOutline} fill={`url(#${id}-earth)`} />
    <g clipPath={`url(#${id}-soil)`}>
      <path d="M64 270H812V296Q664 286 527 299T263 293T64 298Z" fill="#696047" opacity=".3" />
      <path d="M64 357Q210 343 370 361T644 355T812 365" stroke="#a39369" strokeWidth=".7" strokeOpacity=".12" fill="none" />
      <path d="M64 432Q252 415 434 438T812 428" stroke="#9a9776" strokeWidth=".7" strokeOpacity=".1" fill="none" />
      {Array.from({ length: 125 }, (_, i) => {
        const x = 70 + (i * 137.37) % 735, y = 277 + (i * 71.53) % 210
        return <ellipse key={i} cx={x} cy={y} rx={.9 + i % 4 * .55} ry={.65 + i % 3 * .35} fill={i % 3 ? '#c5b797' : '#111e17'} opacity={i % 3 ? .12 : .4} transform={`rotate(${i * 31} ${x} ${y})`} />
      })}
      {water && <>
        <g className={styles.wetFront}>
          <ellipse cx="637" cy="346" rx="183" ry="101" fill={`url(#${id}-wet)`} />
          <ellipse cx="650" cy="398" rx="157" ry="84" fill={`url(#${id}-wet)`} />
        </g>
        {[151, 284, 389].map(x => <path key={x} d={`M${x} 267Q${x - 18} 319 ${x} 366T${x - 8} 476`} stroke="#8dbcb8" strokeWidth="3" fill="none" className={styles.waterChannel} />)}
        {[490, 548, 606, 664, 722, 780].map(x => <path key={x} d={`M${x} 270Q${x - 9} 306 ${x} 344T${x + 4} 436 M${x} 311q-20 11 -29 27 M${x} 355q23 10 31 32`} stroke="#a4d7ca" strokeWidth="1.5" fill="none" className={styles.waterSpread} />)}
      </>}
      <RootNetwork id={id} mode={mode} />
      {mode === 'granular' && crowns.map((x, i) => <g key={x}>
        <ellipse cx={x + 24} cy="301" rx="49" ry="32" fill={`url(#${id}-wet)`} className={styles.nutrientCloud} style={{ animationDelay: `${i * -.3}s` }} />
        {[0, 1, 2].map(n => <circle key={n} cx={x + 24 + (n - 1) * 8} cy={276 + n * 7} r={1.7} fill="#e2d59d" className={styles.nutrientTravel} style={{ animationDelay: `${-i * .35 - n * .45}s` }} />)}
      </g>)}
      {mode === 'roots' && crowns.map((x, i) => <ellipse key={x} cx={x} cy={345 + i % 2 * 26} rx="47" ry="86" fill={`url(#${id}-wet)`} className={styles.nutrientCloud} style={{ animationDelay: `${i * -.4}s` }} />)}
      {mode === 'winter' && crowns.map((x, i) => <g key={x} className={styles.winterReserve} style={{ animationDelay: `${i * -.6}s` }}>
        {[0, 1, 2].map(n => <circle key={n} cx={x + n * 8 - 8} cy={292 + n % 2 * 12} r="2" fill="#d8c693" />)}
      </g>)}
      {mode === 'potassium' && crowns.map((x, i) => <path key={x} d={`M${x + 8} 426Q${x - 10} 368 ${x} 307V270`} pathLength="100" className={styles.waterRise} fill="none" stroke="#abd9cb" strokeWidth="2.1" style={{ animationDelay: `${-i * .5}s` }} />)}
    </g>
    <path d="M64 270Q183 266 313 271T565 270T812 270" fill="none" stroke="#9ba777" strokeWidth="2" />
    <Grass id={id} winter={mode === 'winter'} />
    {mode === 'granular' && crowns.map((x, i) => <g key={x} className={styles.granule} style={{ animationDelay: `${i * -.35}s` }}>
      <ellipse cx={x + 24} cy="269" rx="7.5" ry="2.3" fill="#102318" opacity=".7" />
      <circle cx={x + 24} cy="265" r="4.4" fill={`url(#${id}-mineral)`} />
    </g>)}
    {mode === 'foliar' && <g clipPath={`url(#${id}-canopy)`}>
      <path d="M206 94Q458 85 709 108" stroke="#c1d9b0" strokeWidth="1" strokeDasharray="2 8" opacity=".32" fill="none" />
      {Array.from({ length: 21 }, (_, i) => <g key={i} transform={`translate(${196 + i * 26} ${112 + i % 3 * 8})`}><path d="M0 -4C-2 -1 -3 1 -2 3Q0 5 2 3C3 1 2 -1 0 -4Z" fill="#c9e5da" className={styles.foliarMist} style={{ animationDelay: `${-i * .12}s` }} /></g>)}
      <path d="M380 267Q380 202 363 135 M518 267Q534 200 541 122 M652 266Q635 209 622 151" fill="none" stroke="#d7e9b4" strokeWidth="2" className={styles.leafResponse} />
    </g>}
    {water && <g fill="none" stroke="#b0d8d0">
      <path d="M83 270Q110 262 137 270T203 270 M230 269Q255 264 280 270T347 270" strokeWidth="3" opacity=".65" />
      <path d="M442 98V491" strokeWidth=".65" strokeDasharray="3 6" opacity=".25" />
    </g>}
    {mode === 'winter' && <g className={styles.winterHaze}>
      <path d="M87 119L688 173L826 252H292Z" fill={`url(#${id}-heat)`} />
      <path d="M84 269Q260 263 431 270T812 269" fill="none" stroke="#cfdfdb" strokeWidth="2" opacity=".52" />
      {[141, 270, 394, 530, 678, 790].map((x, i) => <circle key={x} cx={x} cy={166 + i % 3 * 28} r="1.6" fill="#d4e3df" opacity=".5" />)}
    </g>}
    {mode === 'potassium' && <>
      <path d="M617 74L842 80V262L325 250Z" fill={`url(#${id}-heat)`} className={styles.heatShimmer} />
      <path d="M520 268Q525 226 539 166" pathLength="100" stroke="#b4e1d0" strokeWidth="1.5" fill="none" className={styles.waterRise} />
    </>}
    <g className={styles.sceneCallouts} fill="#bfcfb3" fontFamily="var(--font-dm-sans), sans-serif" fontSize="12" letterSpacing=".3">
      <path d="M589 114H683L705 94" fill="none" stroke="#bfcfb3" strokeWidth=".7" opacity=".55" />
      <circle cx="589" cy="114" r="2" fill="#cfdda9" />
      <text x="714" y="94">{mode === 'potassium' ? 'Échanges hydriques' : mode === 'winter' ? 'Lumière réduite' : mode === 'foliar' ? 'Surface foliaire' : 'Un gazon vivant'}</text>
      <path d={mode === 'winter' ? 'M654 298L729 417L754 441' : 'M629 417H729L754 441'} fill="none" stroke="#bfcfb3" strokeWidth=".7" opacity=".5" />
      <circle cx={mode === 'winter' ? 654 : 629} cy={mode === 'winter' ? 298 : 417} r="2" fill="#c8bc96" />
      <text x="600" y="461">{water ? 'Réhumidification répartie' : mode === 'winter' ? 'Réserves au collet' : 'Un réseau racinaire à préserver'}</text>
    </g>
  </svg>
}

export default function NutritionMotion() {
  const [mode, setMode] = useState<Mode>('granular')
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageActive, setPageActive] = useState(true)
  const section = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId().replace(/:/g, '')
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, reducedMotionSnapshot, () => false)
  const chapter = chapters.find(item => item.id === mode)!
  const Icon = chapter.icon
  const running = visible && pageActive && !paused && !reducedMotion

  useEffect(() => {
    const target = section.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    observer.observe(target)
    const updateVisibility = () => setPageActive(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])

  function selectTab(index: number) {
    const normalized = (index + chapters.length) % chapters.length
    setMode(chapters[normalized].id)
    tabs.current[normalized]?.focus({ preventScroll: true })
    tabs.current[normalized]?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'nearest' })
  }

  return (
    <section ref={section} id="nutrition-gazon" className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.container}>
        <div className={styles.introduction}>
          <div>
            <p className={styles.eyebrow}>COMPRENDRE LE SUIVI AGRONOMIQUE</p>
            <h2 id={`${id}-heading`}>Sous la pelouse,<br /><em>tout se prépare.</em></h2>
          </div>
          <p className={styles.intro}>Pas de produit appliqué au hasard. Chaque intervention s’inscrit dans un plan : nourrir, accompagner les racines, mieux gérer l’eau et préparer le gazon aux périodes sensibles, de l’hiver aux fortes chaleurs.</p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Comprendre les apports au gazon">
          {chapters.map((item, index) => (
            <button key={item.id} ref={node => { tabs.current[index] = node }} type="button" role="tab" id={`${id}-tab-${item.id}`} aria-controls={`${id}-panel`} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} className={`${styles.tab} ${mode === item.id ? styles.selectedTab : ''}`} onClick={() => setMode(item.id)} onKeyDown={event => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectTab(index + (event.key === 'ArrowRight' ? 1 : -1)) }
              if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectTab(event.key === 'Home' ? 0 : chapters.length - 1) }
            }}><span className={styles.tabNumber}>0{index + 1}</span>{item.label}</button>
          ))}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`} tabIndex={0} className={`${styles.panel} ${running ? '' : styles.still}`}>
          <div className={styles.visual}>
            <div className={styles.visualTop}>
              <span className={styles.liveLabel}><span />{reducedMotion ? 'ILLUSTRATION FIXE' : 'LE GAZON, DE PLUS PRÈS'}</span>
              <button type="button" className={styles.playback} onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-label={paused ? 'Reprendre l’animation' : 'Mettre l’animation en pause'} aria-pressed={paused}>
                {paused || reducedMotion ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
                <span>{reducedMotion ? 'Mouvement réduit' : paused ? 'Reprendre' : 'Pause'}</span>
              </button>
            </div>
            {mode === 'water' && <div className={styles.comparisonLabels}><span>Sol hydrophobe</span><span>Réhumidification accompagnée</span></div>}
            {mode === 'winter' && <div className={styles.seasonLabels}><span>Moins de lumière</span><span>Froid &amp; croissance ralentie</span></div>}
            <div key={mode} className={styles.sceneEntry}><SoilScene mode={mode} id={`${id}-${mode}`} /></div>
            <div className={styles.sceneStory} aria-label="Les trois temps de l’illustration">
              {story[mode].map((label, index) => <span key={`${mode}-${label}`} className={styles.storyBeat} style={{ animationDelay: `${index * 4}s` }}><i aria-hidden="true" />{label}</span>)}
            </div>
            <div key={`progress-${mode}`} className={styles.storyProgress} aria-hidden="true"><i /></div>
            <div className={styles.visualLegend}>
              <span><i className={styles.rootDot} />Zone racinaire</span>
              <span><i className={mode === 'water' || mode === 'potassium' || mode === 'winter' ? styles.waterDot : styles.nutrientDot} />{mode === 'water' || mode === 'potassium' ? 'Circulation de l’eau' : mode === 'winter' ? 'Rythme hivernal' : mode === 'roots' ? 'Activité illustrée' : 'Apports ciblés'}</span>
              <span className={styles.diagramLabel}>COUPE DU SOL · VUE SCHÉMATIQUE</span>
            </div>
          </div>

          <div className={styles.explanation} key={`copy-${mode}`}>
            <p className={styles.kicker}>{chapter.kicker}</p>
            <span className={styles.chapterIcon}><Icon size={27} strokeWidth={1.2} aria-hidden="true" /></span>
            <h3>{chapter.title}</h3>
            <p className={styles.description}>{chapter.description}</p>
            <ol className={styles.steps}>{chapter.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}{index < chapter.steps.length - 1 && <ArrowDown size={12} aria-hidden="true" />}</li>)}</ol>
            <p className={styles.detail}>{chapter.note}</p>
          </div>
        </div>
        <p className={styles.disclaimer}>Illustrations pédagogiques : mouvements, couleurs et proportions sont simulés. Les effets et les délais dépendent du sol, du gazon, des conditions et du programme retenu.</p>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowDown, Droplets, Leaf, Pause, Play, Sprout, Sun } from 'lucide-react'
import styles from './NutritionMotion.module.css'

type Mode = 'granular' | 'foliar' | 'roots' | 'water' | 'potassium'

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
    id: 'potassium', label: 'Préparer la chaleur', kicker: '05 / ANTICIPER LES PÉRIODES SENSIBLES',
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

const grassPositions = [78, 123, 174, 231, 277, 324, 383, 441, 498, 554, 612, 660, 716, 767, 821]

function Grass({ id, sparse = false }: { id: string; sparse?: boolean }) {
  const positions = sparse ? [277, 383, 441, 498, 612] : grassPositions
  return (
    <g>
      {positions.map((x, index) => (
        <g key={x} transform={`translate(${x} 254)`}>
          <g className={styles.blade} style={{ animationDelay: `${index * -.29}s` }}>
            <path d={`M0 0 C-17 -32 -${22 + (index % 3) * 9} -78 -${24 + (index % 3) * 8} -${107 + (index % 4) * 12} C-2 -80 6 -37 4 0Z`} fill={`url(#${id}-blade)`} />
            <path d={`M4 0 C7 -46 ${18 + (index % 3) * 5} -100 ${25 + (index % 3) * 7} -${144 + (index % 4) * 10} C19 -90 17 -40 8 0Z`} fill={`url(#${id}-blade)`} />
            <path d="M3 0 C-1 -36 -7 -67 -14 -88" stroke="#c2dd9d" strokeWidth=".9" opacity=".4" fill="none" />
            <path d="M7 -1 C11 -45 14 -71 20 -101" stroke="#d9e8a5" strokeWidth=".8" opacity=".45" fill="none" />
          </g>
        </g>
      ))}
    </g>
  )
}

function RootNetwork({ active = false, color = '#dcc79b' }: { active?: boolean; color?: string }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {[145, 285, 445, 605, 760].map((x, index) => (
        <g key={x} transform={`translate(${x} 254)`} className={active ? styles.growingRoot : undefined} style={{ animationDelay: `${index * -.7}s` }}>
          <path d="M0 0 C-7 28 10 39 4 69 S-9 118 -4 169 M2 30 C-16 45 -36 49 -39 79 S-34 111 -57 138 M4 57 C29 75 37 92 34 122 S55 156 58 183 M-3 101 C-25 120 -30 133 -30 160 M34 114 C54 119 68 130 76 154" strokeWidth="2" opacity=".74" />
          <path d="M-38 69 L-57 85 M-36 104 L-20 118 M-47 129 L-73 148 M-1 140 L12 162 M-29 144 L-44 172 M48 151 L32 176 M65 140 L88 156 M34 106 L50 102 M2 73 L-10 84" strokeWidth="1" opacity=".44" />
          {active && <path d="M0 0 C-7 28 10 39 4 69 S-9 118 -4 169 M2 30 C-16 45 -36 49 -39 79 S-34 111 -57 138 M4 57 C29 75 37 92 34 122 S55 156 58 183" className={styles.rootPulse} stroke="#d5e897" strokeWidth="3" pathLength="100" />}
        </g>
      ))}
    </g>
  )
}

function FallingDrops({ count = 11, foliar = false }: { count?: number; foliar?: boolean }) {
  return (
    <g fill="#b7e5e7">
      {Array.from({ length: count }, (_, index) => (
        <g key={index} transform={`translate(${foliar ? 250 + index * 37 : 86 + index * 71} ${foliar ? 90 : 163})`}>
          <path className={foliar ? styles.foliarDrop : styles.rainDrop} style={{ animationDelay: `${index * -.37}s` }} d="M0 -8 C-1 -4 -4 -1 -4 2 A4 4 0 0 0 4 2 C4 -1 1 -4 0 -8Z" />
        </g>
      ))}
    </g>
  )
}

function SoilScene({ mode, id }: { mode: Mode; id: string }) {
  const water = mode === 'water'
  return (
    <svg className={`${styles.scene} ${styles[mode]}`} viewBox="0 0 900 540" role="img" aria-labelledby={`${id}-scene-title ${id}-scene-description`}>
      <title id={`${id}-scene-title`}>{`${chapters.find(chapter => chapter.id === mode)?.label} : vue illustrative du gazon et de son sol`}</title>
      <desc id={`${id}-scene-description`}>{water ? 'À gauche, l’eau circule dans quelques canaux. À droite, une réhumidification plus homogène atteint la zone racinaire.' : 'Coupe du sol avec les brins de gazon, les racines et les apports représentés par des points lumineux. Animation pédagogique, sans échelle ni résultat garanti.'}</desc>
      <defs>
        <linearGradient id={`${id}-earth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#756447" /><stop offset=".35" stopColor="#493d2c" /><stop offset="1" stopColor="#233528" />
        </linearGradient>
        <linearGradient id={`${id}-blade`} x1="0" y1="1" x2=".65" y2="0">
          <stop stopColor="#2e6741" /><stop offset=".45" stopColor="#8eaa67" /><stop offset="1" stopColor="#c7da95" />
        </linearGradient>
        <linearGradient id={`${id}-wet`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#b4e4dc" stopOpacity=".48" /><stop offset=".7" stopColor="#84cdc7" stopOpacity=".27" /><stop offset="1" stopColor="#84cdc7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#bdce88" stopOpacity=".18" /><stop offset="1" stopColor="#bdce88" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-nutrient`}>
          <stop stopColor="#ffe9b3" /><stop offset=".6" stopColor="#e3c987" /><stop offset="1" stopColor="#c4a55d" />
        </radialGradient>
        <pattern id={`${id}-soil-texture`} width="94" height="67" patternUnits="userSpaceOnUse">
          <ellipse cx="13" cy="12" rx="2.2" ry="1.3" fill="#cbb28b" opacity=".25" />
          <ellipse cx="52" cy="45" rx="3.2" ry="2" fill="#b39b76" opacity=".25" />
          <circle cx="80" cy="20" r="1.2" fill="#e4d0a3" opacity=".3" />
          <path d="M20 46l5 2M62 9l3 -2M80 60l5 1" stroke="#b9a383" strokeWidth="1.1" opacity=".25" />
        </pattern>
        <clipPath id={`${id}-soil-clip`}><path d="M38 254 Q150 244 260 254 T480 254 T690 254 T862 254 V508 H38Z" /></clipPath>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      <ellipse cx="455" cy="235" rx="420" ry="240" fill={`url(#${id}-halo)`} />
      <g className={styles.fieldLines} stroke="#d1ddb0" strokeWidth=".7" fill="none" opacity=".09">
        <ellipse cx="450" cy="258" rx="406" ry="93" /><ellipse cx="450" cy="258" rx="330" ry="65" /><ellipse cx="450" cy="258" rx="245" ry="41" />
      </g>
      <path d="M38 254 Q150 244 260 254 T480 254 T690 254 T862 254 V508 H38Z" fill={`url(#${id}-earth)`} />
      <g clipPath={`url(#${id}-soil-clip)`}>
        <rect x="38" y="244" width="824" height="264" fill={`url(#${id}-soil-texture)`} />
        <path d="M38 283 Q160 276 290 288 T570 286 T862 281" stroke="#d3c39c" opacity=".16" fill="none" />
        {water && <>
          <rect x="459" y="254" width="403" height="207" fill={`url(#${id}-wet)`} className={styles.wetZone} />
          <g className={styles.waterPaths} fill="none" stroke="#a1dbdc" strokeWidth="4" strokeLinecap="round">
            <path d="M131 251 C115 290 136 344 113 427" /><path d="M257 251 C274 304 247 344 269 474" /><path d="M386 251 C370 297 396 326 375 389" />
          </g>
          <g className={styles.distributedWater} fill="none" stroke="#a1dbdc" strokeWidth="2" strokeLinecap="round">
            {[492, 547, 602, 657, 712, 767, 822].map(x => <path key={x} d={`M${x} 255 Q${x - 11} 288 ${x} 335 T${x + 3} 425 M${x} 307 Q${x - 20} 302 ${x - 28} 319 M${x} 355 Q${x + 20} 349 ${x + 29} 365`} />)}
          </g>
        </>}
        <RootNetwork active={mode === 'roots'} color={water ? '#dfd1ac' : '#dcc79b'} />
        {mode === 'granular' && <g>
          {[97, 181, 264, 350, 433, 516, 601, 685, 771, 819].map((x, index) => <g key={x} transform={`translate(${x} 261)`}>
            <circle r="7.5" fill={`url(#${id}-nutrient)`} />
            <circle r="13" fill="none" stroke="#e8d69c" strokeWidth="1" className={styles.granuleHalo} style={{ animationDelay: `${index * -.53}s` }} />
            {[0, 1, 2].map(particle => <circle key={particle} r="2.6" cx={(particle - 1) * 9} cy="7" fill="#e3d899" className={styles.nutrientParticle} style={{ animationDelay: `${index * -.53 - particle * 1.5}s` }} />)}
          </g>)}
        </g>}
        {mode === 'roots' && <g fill="#c8dd92">
          {Array.from({ length: 23 }, (_, index) => <circle key={index} cx={89 + (index * 83) % 723} cy={283 + (index * 37) % 165} r={index % 3 === 0 ? 3 : 1.8} className={styles.microbe} style={{ animationDelay: `${index * -.32}s` }} />)}
        </g>}
        {mode === 'potassium' && <g fill="none" strokeLinecap="round">
          {[145, 285, 445, 605, 760].map((x, index) => <path key={x} d={`M${x - 3} 403 Q${x + 15} 355 ${x + 3} 314 T${x} 255`} stroke="#a0d7dd" strokeWidth="3" className={styles.upwardWater} style={{ animationDelay: `${index * -.6}s` }} pathLength="100" />)}
        </g>}
      </g>
      <path d="M38 254 Q150 244 260 254 T480 254 T690 254 T862 254" stroke="#9dab77" strokeWidth="3" fill="none" />
      <Grass id={id} sparse={mode === 'foliar'} />
      {mode === 'foliar' && <>
        <g transform="translate(441 254)">
          <path d="M0 0 C-11 -43 -22 -95 -36 -139 C-5 -107 13 -46 8 0Z" fill="#a6a16c" opacity=".8" />
          <g className={styles.leafStrength}>
            <path d="M0 0 C-12 -45 -10 -123 -7 -186 C12 -121 17 -55 8 0Z" fill={`url(#${id}-blade)`} />
            <path d="M4 -3 C3 -58 0 -105 -4 -150" stroke="#e7ebbc" strokeWidth="1" opacity=".45" fill="none" />
          </g>
        </g>
        <FallingDrops count={11} foliar />
        <g fill="#e1e9b0">{[320, 384, 447, 512, 578].map((x, index) => <circle key={x} cx={x} cy={170 + index % 2 * 20} r="3" className={styles.leafSpark} style={{ animationDelay: `${index * -.7}s` }} />)}</g>
      </>}
      {water && <>
        <path d="M57 251 Q76 243 98 251 T157 251 M183 251 Q215 242 238 251 T307 251 M328 251 Q355 243 379 251 T432 251" fill="none" stroke="#b1e0df" strokeWidth="4" className={styles.pooledWater} />
        <FallingDrops />
        <path d="M450 105 V484" stroke="#d6e0b7" strokeWidth="1" strokeDasharray="3 7" opacity=".45" />
      </>}
      {mode === 'potassium' && <>
        <g transform="translate(735 103)" className={styles.sun}>
          <circle r="24" stroke="#ecd49a" strokeWidth="1" fill="#ecd49a" fillOpacity=".1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <path key={angle} d="M0 -34 V-43" transform={`rotate(${angle})`} stroke="#ecd49a" strokeWidth="1.5" />)}
        </g>
        <g transform="translate(443 177)">
          <circle r="21" fill="#dacc93" fillOpacity=".12" stroke="#dacc93" strokeOpacity=".6" />
          <text textAnchor="middle" dominantBaseline="central" fill="#e7ddb2" fontSize="19" fontFamily="serif">K</text>
        </g>
        <path d="M448 241 Q427 197 441 153" className={styles.upwardWater} stroke="#b7e3df" strokeWidth="2.5" fill="none" pathLength="100" />
      </>}
      <g stroke="#ebead5" strokeWidth=".75" opacity=".3">
        <path d="M18 254 H28 M23 249 V259 M872 254 H882 M877 249 V259" />
        <path d="M38 524 H862" /><path d="M38 521 V527 M862 521 V527" />
      </g>
    </svg>
  )
}

export default function NutritionMotion() {
  const [mode, setMode] = useState<Mode>('granular')
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const section = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId().replace(/:/g, '')
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, reducedMotionSnapshot, () => false)
  const chapter = chapters.find(item => item.id === mode)!
  const Icon = chapter.icon
  const running = visible && !paused && !reducedMotion

  useEffect(() => {
    const target = section.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    observer.observe(target)
    return () => observer.disconnect()
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
          <p className={styles.intro}>Pas de produit appliqué au hasard. Chaque intervention s’inscrit dans un plan : nourrir, accompagner les racines, mieux gérer l’eau et anticiper les périodes sensibles.</p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Comprendre les apports au gazon">
          {chapters.map((item, index) => (
            <button key={item.id} ref={node => { tabs.current[index] = node }} type="button" role="tab" id={`${id}-tab-${item.id}`} aria-controls={`${id}-panel`} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} className={`${styles.tab} ${mode === item.id ? styles.selectedTab : ''}`} onClick={() => setMode(item.id)} onKeyDown={event => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectTab(index + (event.key === 'ArrowRight' ? 1 : -1)) }
              if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectTab(event.key === 'Home' ? 0 : chapters.length - 1) }
            }}><span className={styles.tabNumber}>0{index + 1}</span>{item.label}</button>
          ))}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`} tabIndex={0} className={`${styles.panel} ${running ? styles.running : styles.still}`}>
          <div className={styles.visual}>
            <div className={styles.visualTop}>
              <span className={styles.liveLabel}><span />{reducedMotion ? 'ILLUSTRATION FIXE' : 'LE GAZON, DE PLUS PRÈS'}</span>
              <button type="button" className={styles.playback} onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-label={paused ? 'Reprendre l’animation' : 'Mettre l’animation en pause'} aria-pressed={paused}>
                {paused || reducedMotion ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
                <span>{reducedMotion ? 'Mouvement réduit' : paused ? 'Reprendre' : 'Pause'}</span>
              </button>
            </div>
            {mode === 'water' && <div className={styles.comparisonLabels}><span>Sol hydrophobe</span><span>Réhumidification accompagnée</span></div>}
            <div key={mode} className={styles.sceneEntry}><SoilScene mode={mode} id={`${id}-${mode}`} /></div>
            <div className={styles.visualLegend}>
              <span><i className={styles.rootDot} />Zone racinaire</span>
              <span><i className={mode === 'water' || mode === 'potassium' ? styles.waterDot : styles.nutrientDot} />{mode === 'water' || mode === 'potassium' ? 'Circulation de l’eau' : mode === 'roots' ? 'Activité illustrée' : 'Apports ciblés'}</span>
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

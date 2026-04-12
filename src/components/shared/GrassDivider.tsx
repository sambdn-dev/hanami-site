/**
 * GrassDivider.tsx — Délimitation Hero ↔ section suivante
 *
 * Gazon dense 4 couches (brins bezier arrondis, profondeur par paliers
 * de groundY) + une tondeuse animée qui traverse de gauche à droite
 * et coupe le gazon derrière son passage.
 *
 * Architecture :
 *   1. Sol (rect gradient sombre)
 *   2. Gazon coupé (ras, toujours visible) — ce qu'on voit derrière la tondeuse
 *   3. Gazon long (brins taille pleine) — masqué par `cut-mask` au fil du mouvement
 *   4. Tondeuse + personnage — en CSS `translateX` synchronisé avec le masque
 *
 * Masque : un `<rect>` noir qui se translate de -100% à 0% au sein du
 * `<mask>`, révélant progressivement le "coupé" à gauche. L'animation et la
 * tondeuse partagent la même durée et le même timing, donc le brin tombe
 * pile à l'endroit où passe la lame.
 *
 * Tout est en SVG + CSS — aucun JS, aucune dépendance, SSR complet.
 * Sur mobile / `prefers-reduced-motion`, l'animation est désactivée et seul
 * le gazon long statique reste affiché.
 */

const W     = 1440
const SVG_H = 95

/* Paramètres par couche (arrière → premier plan).
 * - step plus petit  = plus dense
 * - bladeH plus grand = brins plus hauts
 * - groundY plus grand = couche plus basse (avant) dans l'image  */
const LAYERS = [
  { groundY: 78, bladeH: 26, bladeW: 2.8, step: 5,  phase: 0.00, bladeCol: '#2d5a27', fillCol: '#162916' },
  { groundY: 82, bladeH: 36, bladeW: 3.6, step: 7,  phase: 1.97, bladeCol: '#3d7332', fillCol: '#1f3a1e' },
  { groundY: 86, bladeH: 46, bladeW: 4.8, step: 10, phase: 3.61, bladeCol: '#4d9441', fillCol: '#2d5a27' },
  { groundY: 90, bladeH: 56, bladeW: 6.5, step: 14, phase: 5.14, bladeCol: '#62b254', fillCol: '#3d7332' },
] as const

/* Ratio de hauteur du gazon "coupé" (après passage tondeuse).
 * 0.66 = on coupe ~1/3 de la hauteur max (règle des 1/3 en jardinage).
 * Les brins restent visiblement hauts : le jardinier marche dans l'herbe. */
const CUT_RATIO = 0.66

/* ── Forme d'un brin : bezier fermé arrondi, légèrement incliné ─────────── */
function blade(cx: number, groundY: number, h: number, w: number, lean: number): string {
  const hw   = w / 2
  const tipX = cx + lean
  const tipY = groundY - h

  const lc1x = cx  - hw  + lean * 0.45
  const lc1y = groundY - h * 0.48
  const lc2x = tipX - hw * 0.4
  const lc2y = tipY + h  * 0.18

  const rc1x = tipX + hw * 0.4
  const rc1y = tipY + h  * 0.18
  const rc2x = cx   + hw + lean * 0.45
  const rc2y = groundY - h * 0.48

  return (
    `M ${cx - hw} ${groundY} ` +
    `C ${lc1x} ${lc1y}, ${lc2x} ${lc2y}, ${tipX} ${tipY} ` +
    `C ${rc1x} ${rc1y}, ${rc2x} ${rc2y}, ${cx + hw} ${groundY} Z`
  )
}

/* ── Chemin SVG d'une couche complète (scale = facteur de hauteur) ──────── */
function layerPath(
  groundY: number,
  bladeH: number,
  bladeW: number,
  step: number,
  phase: number,
  scale = 1,
): string {
  const out: string[] = []

  for (let i = 0; i * step < W + step; i++) {
    const baseX = i * step

    /* 3 sinusoïdes à fréquences premières → variation non répétitive */
    const r =
      (Math.sin(baseX * 0.031 + phase) * 0.45 +
       Math.sin(baseX * 0.017 + phase * 1.37) * 0.35 +
       Math.sin(baseX * 0.059 + phase * 0.71) * 0.20 +
       1) / 2

    const cx   = baseX + (r - 0.5) * step * 0.28
    const h    = bladeH * (0.62 + r * 0.38) * scale
    /* Le gazon coupé n'est presque pas incliné (herbe tassée) */
    const lean = (r - 0.5) * bladeH * 0.26 * (scale > 0.5 ? 1 : 0.25)
    /* Brins coupés très légèrement plus larges pour qu'on les voie */
    const bw   = bladeW * (scale > 0.5 ? 1 : 1.15)

    out.push(blade(cx, groundY, h, bw, lean))
  }

  return out.join(' ')
}

/* Précalculs module-level (au build) */
const TALL_PATHS  = LAYERS.map((l) => layerPath(l.groundY, l.bladeH, l.bladeW, l.step, l.phase, 1))
const SHORT_PATHS = LAYERS.map((l) => layerPath(l.groundY, l.bladeH, l.bladeW, l.step, l.phase, CUT_RATIO))

/* ── Tondeuse + personnage ──────────────────────────────────────────────── */
/* Toute la scène est enveloppée dans un wrapper scale 1.8× pivoté sur y=90
 * (la ligne de sol). Le personnage est ainsi visible au-dessus du gazon
 * coupé (qui reste haut avec CUT_RATIO=0.66). Le transform SVG compose
 * avec le translateX CSS de .grass-mower (animations imbriquées).         */
function Mower() {
  return (
    <g className="grass-mower">
      <g transform="translate(0 90) scale(1.8) translate(0 -90)">
        {/* Ombre portée au sol */}
        <ellipse cx="18" cy="90.5" rx="19" ry="1" fill="rgba(0,0,0,0.28)" />

        {/* Guidon (derrière le corps) */}
        <path d="M -3 69 L 12 84" stroke="#5d4037" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M -7 67 L 1 70" stroke="#5d4037" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Corps de la tondeuse */}
        <rect x="6" y="82" width="28" height="7" rx="1.5" fill="#c62828" />
        <rect x="6" y="82" width="28" height="1.8" rx="0.9" fill="#8e0000" />

        {/* Moteur / capot */}
        <rect x="14" y="78" width="12" height="4" rx="0.5" fill="#3e3e3e" />
        <circle cx="20" cy="80" r="0.6" fill="#ffd54f" />

        {/* Carter de lame à l'avant */}
        <path d="M 33 87 L 38 87 L 38 90 L 33 90 Z" fill="#3e3e3e" />

        {/* Roues */}
        <circle cx="11" cy="89" r="3.5" fill="#1a1a1a" />
        <circle cx="11" cy="89" r="1.2" fill="#9e9e9e" />
        <circle cx="29" cy="89" r="3.5" fill="#1a1a1a" />
        <circle cx="29" cy="89" r="1.2" fill="#9e9e9e" />

        {/* Personnage — décalé à gauche, pousse la tondeuse */}
        <g transform="translate(-5 0)">
          {/* Container "bob" : tout le corps monte/descend très légèrement
             pour donner le rythme de la marche */}
          <g className="grass-gardener-bob">

            {/* Jambes alternées — chacune dans son <g> pour l'animation CSS */}
            <g className="grass-leg-front">
              <rect x="-5" y="82" width="2.3" height="8" rx="0.5" fill="#1565c0" />
            </g>
            <g className="grass-leg-back">
              <rect x="-1.6" y="82" width="2.3" height="8" rx="0.5" fill="#0d47a1" />
            </g>

            {/* Torse */}
            <path d="M -6 74 L 1 74 L 1 83 L -6 83 Z" fill="#fb8c00" />

            {/* Cou */}
            <rect x="-3.4" y="73" width="1.4" height="1" fill="#ffccbc" />

            {/* Tête */}
            <circle cx="-2.5" cy="70" r="2.7" fill="#ffccbc" />

            {/* Casquette verte hanami (clin d'œil branding) */}
            <path d="M -5 69 Q -5 66.8 -2.5 66.8 Q 0 66.8 0 69 Z" fill="#2d5a27" />
            <rect x="-5" y="69" width="5.5" height="0.7" fill="#2d5a27" />

            {/* Bras tendu vers le guidon */}
            <path d="M 0 76 L 5 82" stroke="#fb8c00" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  )
}

/* ── Composant principal ────────────────────────────────────────────────── */
export default function GrassDivider() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ marginTop: '-1px', marginBottom: '-1px' }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${SVG_H}`}
        preserveAspectRatio="none"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: 'clamp(42px, 6.3vw, 90px)', display: 'block' }}
      >
        <defs>
          <linearGradient id="gd-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1f3a1e" />
            <stop offset="100%" stopColor="#0a120a" />
          </linearGradient>

          {/* Masque : tout blanc par défaut (visible), un rect noir glisse
              depuis la gauche et masque progressivement le gazon long */}
          <mask id="gd-cut" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={SVG_H}>
            <rect x="0" y="0" width={W} height={SVG_H} fill="white" />
            <rect
              className="grass-cut-mask"
              x="0"
              y="0"
              width={W}
              height={SVG_H}
              fill="black"
            />
          </mask>
        </defs>

        {/* Sol de base (sombre sous toutes les couches) */}
        <rect
          x="0"
          y={LAYERS[0].groundY - 2}
          width={W}
          height={SVG_H - LAYERS[0].groundY + 2}
          fill="url(#gd-soil)"
        />

        {/* Couches de sol + gazon coupé (visible TOUJOURS — c'est ce qu'on
            voit derrière la tondeuse) */}
        {LAYERS.map((l, i) => (
          <g key={`cut-${i}`}>
            <rect x="0" y={l.groundY} width={W} height={SVG_H - l.groundY} fill={l.fillCol} />
            <path d={SHORT_PATHS[i]} fill={l.bladeCol} />
          </g>
        ))}

        {/* Gazon long — 3 couches arrière (masquées : disparaissent au passage) */}
        <g mask="url(#gd-cut)">
          {LAYERS.slice(0, 3).map((l, i) => (
            <path key={`tall-back-${i}`} d={TALL_PATHS[i]} fill={l.bladeCol} />
          ))}
        </g>

        {/* Tondeuse — entre les couches arrière et la couche avant pour le
            sens de la profondeur (des brins devant passent devant elle) */}
        <Mower />

        {/* Couche avant (la plus haute, la plus claire) — masquée aussi */}
        <g mask="url(#gd-cut)">
          <path d={TALL_PATHS[3]} fill={LAYERS[3].bladeCol} />
        </g>
      </svg>
    </div>
  )
}

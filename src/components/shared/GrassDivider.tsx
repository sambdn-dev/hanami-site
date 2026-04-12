/**
 * GrassDivider.tsx — Délimitation "pelouse" pleine largeur entre le Hero et la section suivante.
 *
 * SVG 6 couches de profondeur (arrière → avant). Chaque couche est une silhouette
 * de brins d'herbe générée par 3 sinusoïdes superposées (pas de répétition visible).
 * Effets 3D obtenus par :
 *   - brins plus courts + espacement plus serré en arrière-plan
 *   - brins plus hauts + espacés + clairs au premier plan
 *   - sol foncé à la base (occlusion ambiante)
 *   - gradients verticaux par couche (lumière zénithale)
 *
 * Rendu serveur pur — aucun JS côté client, aucune animation.
 * Responsive : `preserveAspectRatio="none"` + height CSS clamp.
 */

const W = 1440
const H = 220

// Couches : de l'arrière (index 0) au premier plan (index 5).
// groundY = ligne de sol (depuis le haut du SVG)
// maxH    = hauteur max des brins
// step    = espacement entre brins
// phase   = déphasage sinusoïdal (évite la symétrie)
// topHex  = couleur haute (pointe des brins, lumière zénithale)
// botHex  = couleur basse (base des brins, zone d'ombre)
const LAYERS = [
  { groundY: 175, maxH: 30, step: 10, phase: 0.00, topHex: '#152415', botHex: '#0a100a' },
  { groundY: 168, maxH: 40, step: 13, phase: 1.73, topHex: '#1c3219', botHex: '#0f1a0e' },
  { groundY: 160, maxH: 50, step: 17, phase: 3.14, topHex: '#244020', botHex: '#141f13' },
  { groundY: 150, maxH: 62, step: 22, phase: 4.71, topHex: '#2d5a27', botHex: '#1a2e1a' },
  { groundY: 138, maxH: 74, step: 28, phase: 5.89, topHex: '#3d7332', botHex: '#24431e' },
  { groundY: 124, maxH: 88, step: 36, phase: 1.12, topHex: '#4a8c3f', botHex: '#2d5a27' },
] as const

/**
 * Génère le chemin SVG d'une couche.
 * Algorithme : on avance de gauche à droite, créant des paires de
 * beziers cubiques (montée + descente) pour chaque brin.
 * 3 sinusoïdes à fréquences irrégulières → silhouette non répétitive.
 */
function makePath(
  groundY: number,
  maxH: number,
  step: number,
  phase: number,
): string {
  const d: string[] = [`M 0 ${H}`, `L 0 ${groundY}`]

  let x = 0
  while (x < W) {
    const nextX = Math.min(x + step, W)
    const s = nextX - x // espacement effectif (peut être < step au dernier brin)

    // Combinaison de 3 sinusoïdes à fréquences premières → aspect organique
    const r =
      (Math.sin(x * 0.027 + phase) * 0.45 +
        Math.sin(x * 0.011 + phase * 1.37) * 0.35 +
        Math.sin(x * 0.053 + phase * 0.71) * 0.2 +
        1) /
      2 // normalisé [0, 1]

    const h = maxH * (0.55 + r * 0.45) // hauteur du brin [55%…100% de maxH]
    const tipY = groundY - h
    const lean = (r - 0.5) * s * 0.4 // légère inclinaison latérale
    const tipX = x + s * 0.5 + lean

    // Bezier montée : départ (x, groundY) → pointe
    const ux1 = x + s * 0.2
    const uy1 = groundY - h * 0.38
    const ux2 = tipX - s * 0.12
    const uy2 = tipY + h * 0.22

    // Bezier descente : pointe → (nextX, groundY)
    const dx1 = tipX + s * 0.12
    const dy1 = tipY + h * 0.22
    const dx2 = nextX - s * 0.2
    const dy2 = groundY - h * 0.38

    d.push(
      `C ${ux1} ${uy1}, ${ux2} ${uy2}, ${tipX} ${tipY}`,
      `C ${dx1} ${dy1}, ${dx2} ${dy2}, ${nextX} ${groundY}`,
    )

    x = nextX
  }

  d.push(`L ${W} ${H}`, 'Z')
  return d.join(' ')
}

// Précalcul à la compilation (module-level, server component)
const PATHS = LAYERS.map((l) => makePath(l.groundY, l.maxH, l.step, l.phase))

export default function GrassDivider() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ marginTop: '-1px', marginBottom: '-1px' }} // évite le pixel gap avec Hero/section suivante
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        // clamp responsive : 60 px mobile → 16 vw tablette → 220 px max desktop
        style={{ height: 'clamp(60px, 15.3vw, 220px)', display: 'block' }}
      >
        <defs>
          {/* Gradient du sol à la base (occlusion ambiante) */}
          <linearGradient id="gd-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111811" />
            <stop offset="100%" stopColor="#070c07" />
          </linearGradient>

          {/* Gradient de lumière zénithale pour chaque couche */}
          {LAYERS.map((l, i) => (
            <linearGradient
              key={i}
              id={`gd-l${i}`}
              x1="0"
              y1={`${l.groundY - l.maxH}`}
              x2="0"
              y2={`${H}`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={l.topHex} />
              <stop offset="100%" stopColor={l.botHex} />
            </linearGradient>
          ))}
        </defs>

        {/* Sol de base (en dessous de toutes les couches) */}
        <rect x="0" y={LAYERS[0].groundY - 4} width={W} height={H} fill="url(#gd-soil)" />

        {/* Couches d'herbe, arrière → premier plan */}
        {PATHS.map((d, i) => (
          <path key={i} d={d} fill={`url(#gd-l${i})`} />
        ))}
      </svg>
    </div>
  )
}

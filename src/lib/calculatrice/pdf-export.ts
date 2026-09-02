/**
 * pdf-export.ts — Génération du PDF « Plan de dosage » en VECTORIEL.
 *
 * Historique : l'export capturait le DOM en PNG (html-to-image) puis collait
 * l'image dans un PDF. Résultat : ~18 Mo, texte non sélectionnable, flou dès
 * qu'on zoomait — illisible sur mobile. Ici, tout est dessiné avec l'API texte
 * de jsPDF : le fichier pèse quelques dizaines de Ko, le texte est net à
 * n'importe quel zoom, sélectionnable et copiable.
 *
 * Le module ne connaît RIEN des types internes de la calculatrice : il rend un
 * `DosagePdfDoc`, modèle de document neutre construit côté composant. Toutes
 * les valeurs arrivent déjà formatées (cf. format.ts).
 *
 * Les polices de la charte (Fraunces pour les titres, Space Mono pour les
 * chiffres, DM Sans pour le corps) sont embarquées en TTF statiques depuis
 * `./fonts/` (~60–110 Ko de base64 par graisse). Elles sont chargées en
 * dynamic import au moment de la génération, comme jsPDF lui-même : le bundle
 * principal ne porte aucun de ces octets. Si un chargement échoue, on retombe
 * silencieusement sur Helvetica — le document reste toujours généré.
 */

import type { jsPDF } from 'jspdf'

// ── Modèle de document ───────────────────────────────────────────────────────

/** Un chiffre clé mis en avant dans le bandeau sombre (ex. « 1,5 L »). */
export interface PdfKeyFigure {
  /** Valeur formatée, unité comprise */
  value: string
  /** Nom du produit / libellé associé */
  label: string
  /** Précision secondaire (ex. « 25 g/m² ») */
  sub?: string
}

/** Une ligne libellé → valeur dans une carte de zone. */
export interface PdfRow {
  label: string
  value: string
  /** Met la ligne en évidence (fond vert pâle) — utilisé pour l'eau */
  highlight?: boolean
}

export interface PdfZone {
  name: string
  surface: string
  /** dataUrl de la photo de zone, si l'utilisateur en a ajouté une */
  photo?: { dataUrl: string; width: number; height: number }
  rows: PdfRow[]
}

export interface PdfKeyValue {
  label: string
  value: string
}

export interface DosagePdfDoc {
  /** Date longue en français, ex. « 10 juillet 2026 » */
  dateLabel: string
  /** Ligne de configuration ; le premier élément est mis en avant (surface) */
  chips: string[]
  /** Conseil d'application affiché en encadré ambre */
  tip?: string
  /** Titre du bandeau sombre, ex. « Produit nécessaire » */
  summaryTitle: string
  keyFigures: PdfKeyFigure[]
  /** Colonne de droite du bandeau : surface, volume, nombre de pleins… */
  summaryMeta: string[]
  zonesTitle?: string
  zones: PdfZone[]
  recipeTitle?: string
  recipe?: PdfKeyValue[]
  recipeNote?: string
  disclaimer: string
}

// ── Charte ───────────────────────────────────────────────────────────────────

type RGB = readonly [number, number, number]

const C = {
  hanami900: [26, 46, 26],
  hanami700: [45, 90, 39],
  hanami500: [74, 140, 63],
  hanami100: [232, 240, 230],
  amber: [212, 168, 83],
  amberBg: [253, 247, 233],
  amberBorder: [240, 227, 193],
  amberText: [133, 104, 45],
  stone50: [250, 250, 249],
  stone100: [245, 245, 244],
  stone200: [231, 229, 228],
  stone400: [168, 162, 158],
  stone500: [120, 113, 108],
  stone700: [68, 64, 60],
  white: [255, 255, 255],
} satisfies Record<string, RGB>

// ── Polices de la charte ─────────────────────────────────────────────────────

/** Rôles typographiques du document — découplés des noms de familles réelles. */
type PdfFontFamily = 'heading' | 'body' | 'mono'

/** Identifiant jsPDF de chaque rôle (nom passé à addFont / setFont). */
const FONT_ID: Record<PdfFontFamily, string> = {
  heading: 'Fraunces',
  body: 'DMSans',
  mono: 'SpaceMono',
}

/**
 * Enregistre les TTF de la charte dans le VFS de jsPDF et renvoie l'ensemble
 * des combinaisons `famille:style` réellement disponibles. Chaque graisse est
 * chargée en dynamic import (les modules base64 ne pèsent donc rien dans le
 * bundle principal) et protégée par try/catch : une police qui manque ou un
 * TTF corrompu ne bloque jamais la génération, `Canvas.font()` retombera sur
 * Helvetica pour cette combinaison.
 */
async function registerFonts(pdf: jsPDF): Promise<Set<string>> {
  const sources: Array<{
    family: PdfFontFamily
    style: 'normal' | 'bold'
    vfsName: string
    load: () => Promise<{ default: string }>
  }> = [
    // Fraunces n'existe qu'en 600 : la même graisse sert de normal ET de bold.
    { family: 'heading', style: 'normal', vfsName: 'Fraunces-SemiBold.ttf', load: () => import('./fonts/fraunces-600') },
    { family: 'heading', style: 'bold', vfsName: 'Fraunces-SemiBold.ttf', load: () => import('./fonts/fraunces-600') },
    { family: 'body', style: 'normal', vfsName: 'DMSans-Regular.ttf', load: () => import('./fonts/dm-sans-400') },
    { family: 'body', style: 'bold', vfsName: 'DMSans-Bold.ttf', load: () => import('./fonts/dm-sans-700') },
    { family: 'mono', style: 'normal', vfsName: 'SpaceMono-Regular.ttf', load: () => import('./fonts/space-mono-400') },
    { family: 'mono', style: 'bold', vfsName: 'SpaceMono-Bold.ttf', load: () => import('./fonts/space-mono-700') },
  ]

  const loaded = new Set<string>()
  await Promise.all(sources.map(async (s) => {
    try {
      const { default: base64 } = await s.load()
      pdf.addFileToVFS(s.vfsName, base64)
      pdf.addFont(s.vfsName, FONT_ID[s.family], s.style)
      loaded.add(`${s.family}:${s.style}`)
    } catch {
      // Police indisponible : la combinaison restera en Helvetica.
    }
  }))
  return loaded
}

// ── Géométrie de page (mm) ───────────────────────────────────────────────────

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2
/** Hauteur réservée en bas de page pour ne jamais coller au bord */
const BOTTOM_GUTTER = 12

/**
 * Contexte de dessin : encapsule le curseur vertical, la pagination et les
 * petits helpers de style, pour que les fonctions de section restent lisibles.
 */
class Canvas {
  y = MARGIN
  constructor(readonly pdf: jsPDF, private readonly fonts: Set<string>) {}

  fill(c: RGB) { this.pdf.setFillColor(c[0], c[1], c[2]) }
  stroke(c: RGB) { this.pdf.setDrawColor(c[0], c[1], c[2]) }
  color(c: RGB) { this.pdf.setTextColor(c[0], c[1], c[2]) }

  /**
   * Sélectionne une police par rôle : `heading` (Fraunces), `body` (DM Sans),
   * `mono` (Space Mono). L'italique n'est pas embarqué : pour une famille de
   * la charte, `italic` est rendu en romain (même taille) ; si la famille n'a
   * pas pu être enregistrée, on retombe sur Helvetica, qui garde l'italique.
   */
  font(family: PdfFontFamily, style: 'normal' | 'bold' | 'italic', size: number) {
    const wanted = style === 'italic' ? 'normal' : style
    if (this.fonts.has(`${family}:${wanted}`)) {
      this.pdf.setFont(FONT_ID[family], wanted)
    } else {
      this.pdf.setFont('helvetica', style)
    }
    this.pdf.setFontSize(size)
  }

  /** Passe à une nouvelle page si `needed` mm ne tiennent pas sous le curseur. */
  ensure(needed: number) {
    if (this.y + needed > PAGE_H - BOTTOM_GUTTER) {
      this.pdf.addPage()
      this.y = MARGIN
    }
  }

  /** Hauteur qu'occuperont `text` une fois coupées à `width` mm. */
  wrappedHeight(text: string, width: number, lineH: number): number {
    return this.pdf.splitTextToSize(text, width).length * lineH
  }

  /** Dessine un texte coupé à `width`, renvoie la hauteur consommée. */
  wrapped(text: string, x: number, y: number, width: number, lineH: number): number {
    const lines = this.pdf.splitTextToSize(text, width) as string[]
    lines.forEach((line, i) => this.pdf.text(line, x, y + i * lineH))
    return lines.length * lineH
  }

  /** Rectangle arrondi rempli, avec bordure optionnelle. */
  box(x: number, y: number, w: number, h: number, bg: RGB, border?: RGB, r = 2.5) {
    this.fill(bg)
    if (border) {
      this.stroke(border)
      this.pdf.roundedRect(x, y, w, h, r, r, 'FD')
    } else {
      this.pdf.roundedRect(x, y, w, h, r, r, 'F')
    }
  }

  /** Texte aligné à droite sur `xRight`. */
  right(text: string, xRight: number, y: number) {
    this.pdf.text(text, xRight - this.pdf.getTextWidth(text), y)
  }

  /** Tronque `text` pour qu'il tienne dans `maxW` mm, avec une ellipse. */
  truncate(text: string, maxW: number): string {
    if (this.pdf.getTextWidth(text) <= maxW) return text
    let out = text
    while (out.length > 1 && this.pdf.getTextWidth(`${out}...`) > maxW) {
      out = out.slice(0, -1)
    }
    return `${out}...`
  }
}

// ── Sections ─────────────────────────────────────────────────────────────────

/** Bandeau d'en-tête vert foncé : eyebrow, date, titre, ligne de configuration. */
function drawHeader(c: Canvas, doc: DosagePdfDoc) {
  const H = 30
  c.box(MARGIN, c.y, CONTENT_W, H, C.hanami900, undefined, 3)

  const inner = MARGIN + 7
  let y = c.y + 9

  c.font('body', 'bold', 7)
  c.color(C.amber)
  c.pdf.setCharSpace(0.5)
  c.pdf.text('PLAN DE DOSAGE', inner, y)
  c.pdf.setCharSpace(0)

  c.font('body', 'normal', 7.5)
  c.color(C.stone400)
  c.right(doc.dateLabel, PAGE_W - MARGIN - 7, y)

  y += 8
  c.font('heading', 'bold', 16)
  c.color(C.white)
  c.pdf.text('Hanami · Dosage Intelligent', inner, y)

  // Filet de séparation
  y += 4
  c.stroke([70, 90, 70])
  c.pdf.setLineWidth(0.2)
  c.pdf.line(inner, y, PAGE_W - MARGIN - 7, y)

  // Ligne de configuration — première puce en ambre (la surface)
  y += 5
  let x = inner
  doc.chips.forEach((chip, i) => {
    if (i === 0) {
      // La surface est une valeur chiffrée : Space Mono, comme les chiffres clés.
      c.font('mono', 'bold', 8)
      c.color(C.amber)
    } else {
      c.font('body', 'normal', 8)
      c.color(C.hanami100)
    }
    c.pdf.text(chip, x, y)
    x += c.pdf.getTextWidth(chip) + 6
  })

  c.y += H + 5
}

/** Encadré ambre : conseil d'application. */
function drawTip(c: Canvas, tip: string) {
  c.font('body', 'normal', 8.5)
  const textW = CONTENT_W - 12
  const h = Math.max(11, c.wrappedHeight(tip, textW, 4) + 6)
  c.ensure(h + 5)
  c.box(MARGIN, c.y, CONTENT_W, h, C.amberBg, C.amberBorder, 2)
  c.color(C.amberText)
  c.wrapped(tip, MARGIN + 6, c.y + 6.5, textW, 4)
  c.y += h + 5
}

/** Bandeau sombre des chiffres clés + colonne méta à droite. */
function drawSummary(c: Canvas, doc: DosagePdfDoc) {
  const metaW = 42
  const figuresW = CONTENT_W - metaW - 14
  const rowH = 11
  const FIRST_FIGURE_Y = 17 // ligne de base de la première valeur
  const FIRST_META_Y = 9

  // Hauteur = le plus bas des deux blocs (chiffres / méta), + respiration.
  // Un calcul naïf (n × rowH) laissait un grand vide sous un chiffre unique.
  const lastFigure = doc.keyFigures.length
    ? FIRST_FIGURE_Y + (doc.keyFigures.length - 1) * rowH + (doc.keyFigures.some(k => k.sub) ? 3.5 : 0)
    : FIRST_FIGURE_Y
  const lastMeta = doc.summaryMeta.length
    ? FIRST_META_Y + (doc.summaryMeta.length - 1) * 5
    : FIRST_META_Y
  const h = Math.max(lastFigure, lastMeta) + 8

  c.ensure(h + 5)
  c.box(MARGIN, c.y, CONTENT_W, h, C.hanami900, undefined, 3)

  const inner = MARGIN + 7
  let y = c.y + 9

  c.font('body', 'normal', 7)
  c.color(C.stone400)
  c.pdf.setCharSpace(0.4)
  c.pdf.text(doc.summaryTitle.toUpperCase(), inner, y)
  c.pdf.setCharSpace(0)

  y += 8
  for (const kf of doc.keyFigures) {
    c.font('mono', 'bold', 15)
    c.color(C.white)
    c.pdf.text(kf.value, inner, y)
    const valueW = c.pdf.getTextWidth(kf.value)

    c.font('body', 'normal', 8)
    c.color(C.hanami100)
    c.pdf.text(c.truncate(kf.label, figuresW - valueW - 4), inner + valueW + 3, y)

    if (kf.sub) {
      c.font('mono', 'normal', 6.5)
      c.color(C.stone500)
      c.pdf.text(kf.sub, inner, y + 3.5)
    }
    y += rowH
  }

  // Colonne méta, alignée à droite
  let my = c.y + 9
  c.font('body', 'normal', 7.5)
  c.color(C.stone400)
  for (const meta of doc.summaryMeta) {
    c.right(meta, PAGE_W - MARGIN - 7, my)
    my += 5
  }

  c.y += h + 5
}

/** Une carte de zone : nom, surface, photo optionnelle, lignes de valeurs. */
function drawZone(c: Canvas, zone: PdfZone) {
  const PHOTO = 16
  const hasPhoto = !!zone.photo
  // Assez d'air sous le nom de zone pour que le surlignage de la 1re ligne
  // (l'eau) ne vienne pas mordre sur ses jambages.
  const headerH = hasPhoto ? PHOTO + 4 : 13
  const rowH = 7
  const h = headerH + zone.rows.length * rowH + 5

  c.ensure(h + 3.5)
  c.box(MARGIN, c.y, CONTENT_W, h, C.white, C.stone200, 2.5)

  const inner = MARGIN + 6
  let textX = inner
  const top = c.y + 6

  if (zone.photo) {
    drawPhoto(c, zone.photo, inner, top, PHOTO)
    textX = inner + PHOTO + 5
  }

  c.font('heading', 'bold', 10.5)
  c.color(C.hanami900)
  c.pdf.text(c.truncate(zone.name, CONTENT_W - 40), textX, top + 4)

  c.font('mono', 'normal', 8)
  c.color(C.stone400)
  c.right(zone.surface, PAGE_W - MARGIN - 6, top + 4)

  let y = c.y + headerH + 4
  const rowRight = PAGE_W - MARGIN - 6

  for (const row of zone.rows) {
    if (row.highlight) {
      c.box(MARGIN + 4, y - 4.2, CONTENT_W - 8, rowH - 1.2, C.hanami100, undefined, 1.5)
    }
    c.font('body', 'normal', 8.5)
    c.color(row.highlight ? C.hanami900 : C.stone500)
    c.pdf.text(c.truncate(row.label, CONTENT_W - 60), inner, y)

    c.font('mono', 'bold', 9)
    c.color(row.highlight ? C.hanami900 : C.hanami700)
    c.right(row.value, rowRight, y)
    y += rowH
  }

  c.y += h + 3.5
}

/** Insère une photo en « contain » dans un carré de `size` mm. */
function drawPhoto(c: Canvas, photo: NonNullable<PdfZone['photo']>, x: number, y: number, size: number) {
  c.box(x, y, size, size, C.stone100, C.stone200, 1.5)
  const ratio = photo.width / photo.height
  let w = size - 1
  let h = w / ratio
  if (h > size - 1) {
    h = size - 1
    w = h * ratio
  }
  const format = photo.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
  try {
    c.pdf.addImage(
      photo.dataUrl, format,
      x + (size - w) / 2, y + (size - h) / 2,
      w, h, undefined, 'MEDIUM',
    )
  } catch {
    // Photo illisible (format exotique) : le cadre gris reste, le PDF est valide.
  }
}

/** Grille « recette par plein » : petites cartes libellé → valeur. */
function drawRecipe(c: Canvas, doc: DosagePdfDoc) {
  if (!doc.recipe?.length) return

  const cols = 2
  const gap = 4
  const cardW = (CONTENT_W - 12 - gap * (cols - 1)) / cols
  const cardH = 13
  const rows = Math.ceil(doc.recipe.length / cols)
  const noteH = doc.recipeNote ? 5 : 0
  const h = 12 + rows * (cardH + gap) - gap + 6 + noteH

  c.ensure(h + 5)
  c.box(MARGIN, c.y, CONTENT_W, h, C.stone50, C.stone200, 2.5)

  c.font('body', 'bold', 8)
  c.color(C.stone700)
  c.pdf.text(doc.recipeTitle ?? 'Recette par plein', MARGIN + 6, c.y + 8)

  const startY = c.y + 12
  doc.recipe.forEach((kv, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = MARGIN + 6 + col * (cardW + gap)
    const y = startY + row * (cardH + gap)

    c.box(x, y, cardW, cardH, C.white, C.stone200, 1.5)
    c.font('body', 'normal', 6.5)
    c.color(C.stone400)
    c.pdf.text(c.truncate(kv.label, cardW - 6), x + 3, y + 5)
    c.font('mono', 'bold', 9.5)
    c.color(C.hanami700)
    c.pdf.text(kv.value, x + 3, y + 10.5)
  })

  if (doc.recipeNote) {
    c.font('body', 'italic', 6.5)
    c.color(C.stone400)
    c.pdf.text(doc.recipeNote, MARGIN + 6, startY + rows * (cardH + gap) + 2)
  }

  c.y += h + 5
}

/** Avertissement légal + bloc identité Hanami. */
function drawFooter(c: Canvas, doc: DosagePdfDoc) {
  c.font('body', 'italic', 6.8)
  const discH = c.wrappedHeight(doc.disclaimer, CONTENT_W, 3.2)
  c.ensure(discH + 30)

  c.color(C.stone400)
  c.wrapped(doc.disclaimer, MARGIN, c.y + 3, CONTENT_W, 3.2)
  c.y += discH + 6

  const H = 22
  c.box(MARGIN, c.y, CONTENT_W, H, C.stone50, C.stone200, 2.5)
  const inner = MARGIN + 6

  // Wordmark : même traitement serif que le titre du document.
  c.font('heading', 'bold', 11)
  c.color(C.hanami900)
  c.pdf.text('Hanami.', inner, c.y + 8)

  c.font('body', 'bold', 6)
  c.color(C.hanami500)
  c.pdf.setCharSpace(0.5)
  c.right('EXPERT GAZON', PAGE_W - MARGIN - 6, c.y + 8)
  c.pdf.setCharSpace(0)

  c.font('body', 'normal', 8)
  c.color(C.stone700)
  c.pdf.text('06 67 27 76 14', inner, c.y + 14)
  c.pdf.text('hanami-gazon.fr', MARGIN + 60, c.y + 14)

  c.font('body', 'normal', 6.2)
  c.color(C.stone400)
  c.pdf.text(
    'Hanami · TROTT SASU · SIREN 891 868 143 · Le Vésinet, Île-de-France · Coaching agronomique partout en France',
    inner, c.y + 19,
  )

  c.y += H
}

/** Numérotation, uniquement si le document dépasse une page. */
function drawPageNumbers(c: Canvas) {
  const { pdf } = c
  const total = pdf.getNumberOfPages()
  if (total < 2) return
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i)
    c.font('body', 'normal', 7)
    c.color(C.stone400)
    const label = `${i} / ${total}`
    pdf.text(label, PAGE_W - MARGIN - pdf.getTextWidth(label), PAGE_H - 6)
  }
}

// ── Point d'entrée ───────────────────────────────────────────────────────────

/** Construit le PDF vectoriel en mémoire. Séparé du téléchargement pour être
 *  vérifiable hors navigateur (cf. scripts de contrôle). */
export async function buildDosagePdf(doc: DosagePdfDoc): Promise<jsPDF> {
  const { jsPDF: JsPDF } = await import('jspdf')
  const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })

  pdf.setProperties({
    title: 'Plan de dosage Hanami',
    subject: 'Dosage Intelligent — Hanami',
    author: 'Hanami',
    creator: 'hanami-gazon.fr',
  })

  const fonts = await registerFonts(pdf)

  const c = new Canvas(pdf, fonts)
  drawHeader(c, doc)
  if (doc.tip) drawTip(c, doc.tip)
  drawSummary(c, doc)

  if (doc.zones.length > 0) {
    if (doc.zonesTitle) {
      c.ensure(10)
      c.font('body', 'bold', 8)
      c.color(C.stone500)
      pdf.text(doc.zonesTitle, MARGIN, c.y + 3)
      c.y += 7
    }
    for (const zone of doc.zones) drawZone(c, zone)
  }

  drawRecipe(c, doc)
  drawFooter(c, doc)
  drawPageNumbers(c)

  return pdf
}

/** Construit le PDF vectoriel et déclenche son téléchargement. */
export async function downloadDosagePdf(doc: DosagePdfDoc, filename: string): Promise<void> {
  const pdf = await buildDosagePdf(doc)
  pdf.save(filename)
}

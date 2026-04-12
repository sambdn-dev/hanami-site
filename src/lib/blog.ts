/**
 * blog.ts — Lecture des articles MDX du blog
 *
 * Les articles vivent dans `content/blog/*.mdx` à la racine du projet.
 * Chaque fichier a un frontmatter YAML (title, slug, date, category,
 * excerpt, cover?, author) parsé par gray-matter.
 *
 * Ces fonctions ne tournent qu'au build ou côté serveur — `fs` n'est pas
 * disponible côté client.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface ArticleFrontmatter {
  title: string
  slug: string
  date: string           // ISO yyyy-mm-dd
  category: string       // Technique | Saisonnier | Cas client | Mythes
  excerpt: string
  cover?: string         // URL d'image optionnelle
  author: string
}

export interface Article extends ArticleFrontmatter {
  source: string           // corps MDX brut
  readingMinutes: number   // arrondi au nombre entier
  headings: Heading[]      // h2 + h3 extraits pour la Table des matières
}

export interface Heading {
  level: 2 | 3
  text: string
  slug: string             // id injecté par rehype-slug au render
}

/** Liste les slugs disponibles (utilisé par generateStaticParams). */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const source = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
      const { data } = matter(source)
      return (data.slug as string) ?? f.replace(/\.mdx$/, '')
    })
}

/**
 * Charge tous les articles, triés par date décroissante.
 * N'inclut pas le `source` MDX (inutile pour les listings) sauf si demandé.
 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  const articles = files.map(f => parseArticle(f))
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Charge un article par son slug. `null` si introuvable. */
export function getArticleBySlug(slug: string): Article | null {
  if (!fs.existsSync(BLOG_DIR)) return null
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  for (const file of files) {
    const article = parseArticle(file)
    if (article.slug === slug) return article
  }
  return null
}

// ── Helpers internes ────────────────────────────────────────────────────────

/** Lit un .mdx, parse son frontmatter, calcule le temps de lecture et les h2/h3. */
function parseArticle(filename: string): Article {
  const fullPath = path.join(BLOG_DIR, filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const fm = data as Partial<ArticleFrontmatter>

  // Normalisation date : matter parse en objet Date quand le YAML est non-quoté.
  // On force en chaîne ISO `yyyy-mm-dd` pour la comparaison/tri.
  const rawDate: unknown = fm.date
  const dateStr =
    rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : String(rawDate ?? '')

  const stats = readingTime(content)

  return {
    title: fm.title ?? '(sans titre)',
    slug: fm.slug ?? filename.replace(/\.mdx$/, ''),
    date: dateStr,
    category: fm.category ?? 'Technique',
    excerpt: fm.excerpt ?? '',
    cover: fm.cover,
    author: fm.author ?? 'Hanami',
    source: content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    headings: extractHeadings(content),
  }
}

/**
 * Extrait les titres h2 et h3 du Markdown avec le même algorithme de slug
 * que rehype-slug (via github-slugger). Les IDs générés ici correspondent
 * exactement aux `id="…"` injectés dans le HTML final — les ancres
 * cliquables de la TOC fonctionnent sans mapping intermédiaire.
 */
function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger()
  const lines = markdown.split('\n')
  const headings: Heading[] = []
  let inCodeBlock = false

  for (const line of lines) {
    // Ignore les titres qui apparaissent dans un bloc de code
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{2,3})\s+(.+?)\s*$/)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2].replace(/[#*`]/g, '').trim()
    headings.push({ level, text, slug: slugger.slug(text) })
  }
  return headings
}

/** Formate une date ISO en français long : "10 avril 2026". */
export function formatArticleDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

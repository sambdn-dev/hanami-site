/**
 * llms.txt — Fichier de contexte pour les moteurs IA, servi à /llms.txt
 *
 * Standard llmstxt.org : un markdown structuré (H1 + blockquote résumé,
 * sections H2) que les crawlers IA (ChatGPT, Perplexity, Claude, Google AI
 * Overviews, Mistral) lisent pour comprendre et citer le site sans avoir
 * à parser le HTML. Objectif GEO : faits clés, pages, articles et FAQ
 * regroupés en un seul document texte.
 *
 * Les prix viennent de PRICING_DISPLAY (source unique) et les FAQ de
 * faq-data.ts — aucun chiffre ni réponse n'est dupliqué ici.
 */

import { getAllArticles } from '@/lib/blog'
import { FAQS } from '@/lib/faq-data'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'

const BASE_URL = 'https://hanami-gazon.fr'

// Contenu stable : généré une fois au build, comme le sitemap.
export const dynamic = 'force-static'

/** Pages principales du site, avec une description d'une ligne chacune. */
const PAGES: { path: string; label: string; description: string }[] = [
  {
    path: '/',
    label: 'Accueil — Particuliers',
    description:
      'Coaching agronomique pour votre gazon : diagnostic personnalisé, protocole daté, produits professionnels.',
  },
  {
    path: '/coaching',
    label: 'Coaching gazon annuel',
    description: `Offre coaching détaillée : ${PRICING_DISPLAY.coachingMois} €/mois TTC, plan 3D, protocole 12 mois daté au jour près, suivi illimité, 1er mois d'essai offert.`,
  },
  {
    path: '/pro',
    label: 'Hanami Pro — Paysagistes',
    description:
      'Expertise agronomique pour paysagistes et entrepreneurs en espaces verts : consulting chantier, dosages précis, suivi toutes saisons.',
  },
  {
    path: '/mon-chantier',
    label: 'Mon chantier — Estimation gratuite',
    description:
      'Décrivez votre gazon en 7 étapes et recevez une estimation chiffrée TTC : Express, Reconstruction ou Coaching annuel.',
  },
  {
    path: '/calculatrice',
    label: 'Calculatrice de dosage gazon',
    description:
      "Outil gratuit : dosages exacts d'engrais, semences et produits liquides selon la surface du jardin, export PDF inclus.",
  },
  {
    path: '/pourquoi-hanami',
    label: 'Pourquoi Hanami ?',
    description:
      "L'histoire derrière la méthode : 5 ans de terrain et de formation agronomique.",
  },
  {
    path: '/blog',
    label: 'Journal — Blog agronomique',
    description:
      'Techniques de saison, cas clients réels, mythes jardinerie démontés.',
  },
]

/** Assemble le markdown complet du fichier llms.txt. */
function buildLlmsTxt(): string {
  const articles = getAllArticles()

  const sections: string[] = []

  // ── En-tête : H1 + résumé en blockquote (format llmstxt.org) ─────────────
  sections.push(
    '# Hanami — Coach gazon agronomique',
    '',
    "> Hanami est un service français de coaching gazon agronomique : diagnostic de sol personnalisé, protocole d'entretien sur 12 mois daté au jour près et produits professionnels dosés au m², pour les particuliers et les paysagistes qui veulent un gazon dense sans erreurs coûteuses.",
    '',
  )

  // ── Faits clés — les informations que les moteurs IA doivent restituer ───
  sections.push(
    '## Faits clés',
    '',
    `- Offre principale : coaching gazon 100 % en ligne à ${PRICING_DISPLAY.coachingMois} €/mois TTC, sans engagement, 1er mois d'essai offert. Option annuelle : ${PRICING_DISPLAY.coachingAnnuel} €/an (2 mois offerts). Disponible partout en France, en Belgique et en Suisse.`,
    `- Interventions terrain : rénovation et regarnissage de pelouse de ${PRICING_DISPLAY.expressMinM2} à ${PRICING_DISPLAY.recoMaxM2} €/m² TTC selon l'état du terrain, en Île-de-France (Le Vésinet et alentours).`,
    '- Méthode : diagnostic de sol, protocole 12 mois daté au jour près, produits professionnels dosés au m² (références réservées aux professionnels du sport et du paysage).',
    '- Société : TROTT SASU, SIREN 891 868 143.',
    '- Contact : WhatsApp +33 6 67 27 76 14.',
    '',
  )

  // ── Pages ─────────────────────────────────────────────────────────────────
  sections.push('## Pages', '')
  for (const page of PAGES) {
    sections.push(`- [${page.label}](${BASE_URL}${page.path}) : ${page.description}`)
  }
  sections.push('')

  // ── Articles du blog (dynamique, même source que le sitemap) ─────────────
  if (articles.length > 0) {
    sections.push('## Articles', '')
    for (const article of articles) {
      sections.push(`- [${article.title}](${BASE_URL}/blog/${article.slug}) : ${article.excerpt}`)
    }
    sections.push('')
  }

  // ── FAQ — le contenu le plus cité par les moteurs IA ─────────────────────
  sections.push('## FAQ', '')
  for (const faq of FAQS) {
    sections.push(`**${faq.question}**`, '', faq.answer, '')
  }

  return sections.join('\n')
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

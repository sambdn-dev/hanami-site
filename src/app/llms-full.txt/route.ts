/**
 * llms-full.txt — Version intégrale de /llms.txt, servie à /llms-full.txt
 *
 * Standard llmstxt.org : llms.txt liste les liens et résumés, llms-full.txt
 * embarque le CONTENU complet pour les moteurs IA qui préfèrent un seul
 * document (ChatGPT, Perplexity, Claude, Google AI Overviews, Mistral) :
 * en-tête + faits clés, puis le texte intégral de chaque article du blog
 * (markdown brut, frontmatter retiré par gray-matter), puis la FAQ complète.
 *
 * SYNCHRONISATION : l'en-tête (H1 + blockquote) et la section "Faits clés"
 * sont dupliqués depuis src/app/llms.txt/route.ts — ses helpers ne sont pas
 * exportés et un fichier route ne doit exposer que des exports de route.
 * Toute modification de l'en-tête ou des faits clés là-bas doit être
 * reportée ici (les prix restent dérivés de PRICING_DISPLAY, source unique).
 */

import { getAllArticles, formatArticleDate } from '@/lib/blog'
import { FAQS } from '@/lib/faq-data'
import { COACHING_FAQS } from '@/lib/coaching-faq-data'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'

const BASE_URL = 'https://hanami-gazon.fr'

// Contenu stable : généré une fois au build, comme /llms.txt et le sitemap.
export const dynamic = 'force-static'

/** Assemble le markdown complet du fichier llms-full.txt. */
function buildLlmsFullTxt(): string {
  const articles = getAllArticles()

  const sections: string[] = []

  // ── En-tête : H1 + résumé en blockquote (dupliqué de /llms.txt) ──────────
  sections.push(
    '# Hanami — Coach gazon agronomique',
    '',
    "> Hanami est un service français de coaching gazon agronomique : diagnostic de sol personnalisé, protocole d'entretien sur 12 mois daté au jour près et produits professionnels dosés au m², pour les particuliers et les paysagistes qui veulent un gazon dense sans erreurs coûteuses.",
    '',
  )

  // ── Faits clés (dupliqués de /llms.txt) ──────────────────────────────────
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

  // ── Articles du blog — texte intégral (markdown brut, sans frontmatter) ──
  for (const article of articles) {
    sections.push(
      '---',
      '',
      `## ${article.title}`,
      '',
      `Publié le ${formatArticleDate(article.date)} · ${article.category} · ${BASE_URL}/blog/${article.slug}`,
      '',
      article.source.trim(),
      '',
    )
  }

  // ── FAQ complète — le contenu le plus cité par les moteurs IA ────────────
  // Générales (home) + spécifiques coaching : les deux jeux sont disjoints.
  sections.push('---', '', '## FAQ', '')
  for (const faq of [...FAQS, ...COACHING_FAQS]) {
    sections.push(`**${faq.question}**`, '', faq.answer, '')
  }

  return sections.join('\n')
}

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

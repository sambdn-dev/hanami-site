import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const BASE_URL = SITE_URL

/**
 * Existing crawler policy, preserved deliberately. Allowing a bot does not
 * guarantee indexing or AI citations. Training crawlers (e.g. GPTBot) and
 * search/retrieval crawlers have different purposes; robots.txt is access policy.
 */
const AI_CRAWLERS = [
  // OpenAI — entraînement, recherche ChatGPT, navigation utilisateur
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Perplexity — index de recherche et requêtes utilisateur
  'PerplexityBot',
  'Perplexity-User',
  // Anthropic — entraînement, recherche Claude, navigation utilisateur
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Google AI (Gemini / AI Overviews) et Apple Intelligence
  'Google-Extended',
  'Applebot-Extended',
  // Common Crawl (corpus utilisé par de nombreux LLM), Meta, Amazon, Mistral
  'CCBot',
  'meta-externalagent',
  'Amazonbot',
  'MistralAI-User',
]

/**
 * robots.ts — Fichier robots.txt généré à /robots.txt
 *
 * Indique aux moteurs de recherche quelles routes crawler.
 * On autorise tout sauf les endpoints API (/api/*) qui ne servent
 * que les formulaires internes et n'ont rien d'indexable.
 *
 * Le sitemap est référencé ici pour que les bots le trouvent sans
 * avoir à deviner son URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Moteurs de recherche classiques (Google, Bing, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Crawlers IA : autorisation explicite (voir AI_CRAWLERS ci-dessus)
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

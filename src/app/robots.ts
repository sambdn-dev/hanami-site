import type { MetadataRoute } from 'next'

const BASE_URL = 'https://hanami-gazon.fr'

/**
 * Crawlers des moteurs IA (GEO — Generative Engine Optimization).
 *
 * On les autorise EXPLICITEMENT plutôt que de compter sur la règle `*` :
 * certains de ces bots (crawl d'entraînement comme GPTBot, Google-Extended
 * ou CCBot) sont massivement bloqués sur le web, et une autorisation nommée
 * est un signal clair que Hanami veut être lu ET cité par ChatGPT,
 * Perplexity, Claude, Google AI Overviews, Meta et Mistral. Être présent
 * dans leurs index/corpus, c'est apparaître dans leurs réponses quand un
 * utilisateur demande un coach gazon.
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

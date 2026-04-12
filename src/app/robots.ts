import type { MetadataRoute } from 'next'

const BASE_URL = 'https://hanami-gazon.fr'

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
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

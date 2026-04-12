import type { MetadataRoute } from 'next'

const BASE_URL = 'https://hanami-gazon.fr'

/**
 * sitemap.ts — Sitemap XML généré à /sitemap.xml
 *
 * Next.js lit ce fichier et sert automatiquement un sitemap conforme
 * à l'URL https://hanami-gazon.fr/sitemap.xml. Utilisé par Google, Bing
 * et les autres moteurs de recherche pour indexer les pages du site.
 *
 * Les articles de blog seront ajoutés dynamiquement à cette liste
 * quand la route /blog sera mise en place (Étape 5).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pro`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculatrice`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pourquoi-hanami`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ]
}

import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog'

const BASE_URL = 'https://hanami-gazon.fr'

/**
 * sitemap.ts — Sitemap XML généré à /sitemap.xml
 *
 * Next.js lit ce fichier et sert automatiquement un sitemap conforme
 * à l'URL https://hanami-gazon.fr/sitemap.xml. Utilisé par Google, Bing
 * et les autres moteurs de recherche pour indexer les pages du site.
 *
 * Les articles du blog sont ajoutés dynamiquement depuis `content/blog/`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  // Pas de lastModified sur les routes statiques : une date générée au build
  // (new Date()) est un faux signal de fraîcheur pour Google. Seuls les
  // articles portent leur vraie date. /mentions-legales est volontairement
  // absente : la page est en noindex, la lister serait contradictoire.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pro`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/mon-chantier`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/coaching`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculatrice`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pourquoi-hanami`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes]
}

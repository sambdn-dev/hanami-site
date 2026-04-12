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
  const now = new Date()
  const articles = getAllArticles()

  const staticRoutes: MetadataRoute.Sitemap = [
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
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
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

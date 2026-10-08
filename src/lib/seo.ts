import type { Metadata } from 'next'

// Vercel redirects the apex domain to www: index the final public URL.
export const SITE_URL = 'https://www.hanami-gazon.fr'

export function pageMetadata({ title, description, path, canonicalPath = path }: {
  title: string
  description: string
  path: string
  canonicalPath?: string
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalPath,
      siteName: 'Hanami',
      locale: 'fr_FR',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Hanami — Expertise gazon' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  }
}

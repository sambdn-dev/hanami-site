/**
 * /blog/[slug] — Rendu d'un article MDX
 *
 * Server Component. Compile le MDX au build avec `next-mdx-remote/rsc`
 * pour chaque slug retourné par `generateStaticParams`. Le pipeline :
 *  - `remark-gfm`            → tables, tâches, strike-through
 *  - `rehype-slug`           → injecte un `id="..."` sur chaque titre
 *  - `rehype-autolink-headings` → lien ancre cliquable sur les titres
 *
 * La Table of Contents est construite au build depuis `article.headings`
 * (voir `extractHeadings()` dans `src/lib/blog.ts`) — ses slugs matchent
 * ceux générés par `rehype-slug`.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { ArrowLeft, Clock } from 'lucide-react'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import ContactForm from '@/components/shared/ContactForm'

import { getAllSlugs, getArticleBySlug, formatArticleDate } from '@/lib/blog'
import { mdxComponents } from '@/components/blog/MdxComponents'
import TableOfContents from '@/components/blog/TableOfContents'
import ShareButton from '@/components/blog/ShareButton'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article introuvable — Hanami' }

  return {
    title: `${article.title} — Journal Hanami`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: article.cover ? [{ url: article.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.cover ? [article.cover] : undefined,
    },
  }
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  // JSON-LD BlogPosting pour le SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Hanami',
      url: 'https://hanami-gazon.fr',
    },
    image: article.cover ? [article.cover] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hanami-gazon.fr/blog/${article.slug}`,
    },
  }

  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pt-24 pb-20 bg-white">

        {/* Barre retour */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-hanami-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les articles
          </Link>
        </div>

        {/* Cover + en-tête */}
        <article className="max-w-7xl mx-auto px-6 lg:px-8">

          <header className="max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-hanami-100 text-[11px] font-semibold tracking-wide uppercase text-hanami-700">
              {article.category}
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl lg:text-5xl font-semibold text-hanami-900 tracking-tight leading-[1.1]">
              {article.title}
            </h1>

            <p className="mt-5 text-lg text-stone-600 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500">
              <span>Par <span className="font-semibold text-stone-700">{article.author}</span></span>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {article.readingMinutes} min de lecture
              </span>
            </div>

            <div className="mt-6">
              <ShareButton title={article.title} excerpt={article.excerpt} />
            </div>
          </header>

          {article.cover && (
            <div className="max-w-4xl mx-auto mb-14 rounded-2xl overflow-hidden border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover}
                alt=""
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Grille : corps + TOC sticky */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 lg:gap-16 max-w-6xl mx-auto">

            {/* Corps MDX */}
            <div className="min-w-0">
              <MDXRemote
                source={article.source}
                components={mdxComponents}
                options={{
                  parseFrontmatter: false,
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: 'wrap',
                          properties: {
                            className: ['anchor-heading'],
                            ariaLabel: 'Lien vers cette section',
                          },
                        },
                      ],
                    ],
                  },
                }}
              />

              {/* Pied d'article : rappel partage */}
              <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-stone-500">
                  Publié par <span className="font-semibold text-stone-700">{article.author}</span>
                  <span className="mx-2">·</span>
                  <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                </p>
                <ShareButton title={article.title} excerpt={article.excerpt} />
              </div>
            </div>

            {/* TOC sticky (desktop uniquement) */}
            <aside>
              <TableOfContents headings={article.headings} />
            </aside>
          </div>
        </article>
      </main>

      {/* CTA diagnostic en bas d'article */}
      <ContactForm variant="particulier" />

      <Footer />
      <WhatsAppButton />
    </>
  )
}

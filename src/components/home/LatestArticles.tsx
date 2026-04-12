/**
 * LatestArticles.tsx — Section "Articles récents" sur la homepage
 *
 * Affiche les 3 derniers articles du blog. Server Component — les données
 * sont lues au build depuis `content/blog/*.mdx` via `getAllArticles()`.
 *
 * Si aucun article n'existe encore, on ne rend rien (pas de section vide).
 */
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ArticleCard from '@/components/blog/ArticleCard'
import { getAllArticles } from '@/lib/blog'

export default function LatestArticles() {
  const articles = getAllArticles().slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-hanami-700 mb-3">
              Journal
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-hanami-900 tracking-tight">
              Nos derniers articles agronomiques
            </h2>
            <p className="mt-4 text-base md:text-lg text-stone-600 leading-relaxed">
              Techniques de saison, cas clients, mythes démontés.
              Du contenu utile, pas du remplissage.
            </p>
          </div>

          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-hanami-700 hover:text-hanami-900 transition-colors"
          >
            Tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* CTA mobile (sous la grille) */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-stone-200 bg-white text-sm font-semibold text-hanami-700 hover:border-hanami-500 transition-colors"
          >
            Tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

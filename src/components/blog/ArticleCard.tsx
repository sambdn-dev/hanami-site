/**
 * ArticleCard.tsx — Carte article réutilisée par la liste /blog
 * et la section "Articles récents" sur la homepage.
 */
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { Article } from '@/lib/blog'
import { formatArticleDate } from '@/lib/blog'

interface ArticleCardProps {
  article: Article
  /** Variante compacte pour les listes denses (sans excerpt). */
  compact?: boolean
}

export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all hover:border-hanami-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Visuel : cover si fournie, sinon dégradé par catégorie */}
      <div
        className={`relative aspect-[16/10] overflow-hidden ${
          !article.cover ? 'bg-gradient-to-br from-hanami-100 via-hanami-200/60 to-amber-100' : ''
        }`}
      >
        {article.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-fraunces)] text-4xl text-hanami-700/30 font-semibold">
              {article.category}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold tracking-wide uppercase text-hanami-700 shadow-sm">
          {article.category}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {article.readingMinutes} min
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-hanami-900 tracking-tight mb-3 group-hover:text-hanami-700 transition-colors">
          {article.title}
        </h3>

        {!compact && article.excerpt && (
          <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center gap-1.5 text-sm font-semibold text-hanami-700">
          Lire l'article
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}

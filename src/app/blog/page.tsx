/**
 * /blog — Liste de tous les articles du blog Hanami
 *
 * Server Component. Lit les articles au build depuis `content/blog/*.mdx`
 * via `getAllArticles()` (déjà triés par date décroissante).
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import SeasonalBanner from '@/components/shared/SeasonalBanner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import ArticleCard from '@/components/blog/ArticleCard'
import { getAllArticles } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Journal — Techniques et conseils agronomiques | Hanami',
  description:
    'Techniques de saison, cas clients réels, mythes jardinerie démontés. Le journal agronomique de Hanami : du contenu utile, pas du remplissage.',
  openGraph: {
    title: 'Journal Hanami — Techniques agronomiques',
    description:
      'Techniques de saison, cas clients, mythes démontés. Le savoir-faire d\'un agronome pour votre gazon.',
  },
}

export default function BlogIndexPage() {
  const articles = getAllArticles()

  return (
    <>
      <SeasonalBanner />
      <Navbar variant="light" />

      <main className="flex-1 pt-24 pb-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* En-tête */}
          <header className="max-w-3xl mb-16">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-hanami-700 mb-4">
              Journal Hanami
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl lg:text-6xl font-semibold text-hanami-900 tracking-tight leading-[1.05]">
              Le savoir-faire agronomique, <span className="text-hanami-700">mis à nu.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              Techniques de saison, cas clients réels, mythes jardinerie démontés.
              Un article nouveau par semaine.
            </p>
          </header>

          {/* Grille d'articles */}
          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-stone-500 italic">
                Les premiers articles arrivent bientôt.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 text-sm font-semibold text-hanami-700 hover:text-hanami-900 underline decoration-hanami-500/50 underline-offset-4"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}

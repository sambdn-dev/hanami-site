import Link from 'next/link'
import NewsletterCapture from '@/components/shared/NewsletterCapture'

export default function NewsletterSection() {
  return (
    <section className="bg-[#e8f0e6] py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Col 1 — Newsletter */}
          <div>
            <p className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-[#2d5a27] mb-3">
              Restez informé
            </p>
            <h2
              className="text-2xl lg:text-3xl font-semibold text-[#1a2e1a] mb-3 leading-snug"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Recevez nos conseils saisonniers
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-5">
              Calendrier d&apos;entretien, dosages optimaux, alertes météo agronomiques — directement dans votre boîte mail. Pas de spam, seulement de l&apos;utile.
            </p>
            <NewsletterCapture variant="section" />
          </div>

          {/* Col 2 — CTA diagnostic personnalisé */}
          <div className="md:border-l md:border-[#c5d9c0] md:pl-10 lg:pl-16">
            <p className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-[#2d5a27] mb-3">
              Vous préférez l&apos;accompagnement direct ?
            </p>
            <h3
              className="text-xl lg:text-2xl font-semibold text-[#1a2e1a] mb-3 leading-snug"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Un diagnostic personnalisé,<br />sans engagement
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed mb-5">
              Partagez vos photos et vos objectifs. Hanami analyse votre situation et vous propose un protocole sur-mesure avec les bons produits, les bons dosages, au bon moment.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2e1a] hover:bg-[#2d5a27] text-white text-sm font-medium transition-colors"
            >
              Demandez votre diagnostic gratuit
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

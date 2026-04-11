import Link from 'next/link'
import NewsletterCapture from '@/components/shared/NewsletterCapture'

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand */}
          <div>
            <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-white mb-3">
              hanami.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed">
              Coaching agronomique &amp; produits professionnels pour votre gazon.
            </p>
          </div>

          {/* Col 2 — Contact */}
          <div>
            <p className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-stone-500 mb-4">
              Contact
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/33667277614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  WhatsApp : +33 6 67 27 76 14
                </a>
              </li>
              <li className="text-stone-400 text-xs mt-3">
                Île-de-France (interventions)
                <br />
                France, Belgique, Suisse et pays francophones (coaching)
              </li>
            </ul>
          </div>

          {/* Col 3 — Légal */}
          <div>
            <p className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-stone-500 mb-4">
              Légal
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li className="text-stone-500 text-xs mt-3">
                TROTT SASU — SIREN 891 868 143
              </li>
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <p className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-stone-500 mb-4">
              Restez informé
            </p>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Conseils saisonniers et protocoles agronomiques dans votre boîte mail.
            </p>
            <NewsletterCapture variant="footer" />
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} hanami. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-stone-600">
            <Link href="/" className="hover:text-stone-400 transition-colors">
              Particuliers
            </Link>
            <Link href="/pro" className="hover:text-stone-400 transition-colors">
              Professionnels
            </Link>
            <Link href="/calculatrice" className="hover:text-stone-400 transition-colors">
              Dosage Intelligent
            </Link>
            <Link href="/pourquoi-hanami" className="hover:text-stone-400 transition-colors">
              Pourquoi Hanami ?
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

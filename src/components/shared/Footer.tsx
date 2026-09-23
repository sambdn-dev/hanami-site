import Link from 'next/link'
import Image from 'next/image'
import NewsletterCapture from '@/components/shared/NewsletterCapture'

export default function Footer() {
  return (
    <footer className="bg-brand-forest text-brand-cream/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand */}
          <div>
            <Image src="/brand/2026/logo-principal-blanc.png" alt="Hanami Expert Gazon" width={170} height={61} className="mb-3 h-auto w-[170px]" />
            <p className="text-sm text-brand-cream/80 leading-relaxed">
              Coaching agronomique &amp; produits professionnels pour votre gazon.
            </p>
          </div>

          {/* Col 2 — Contact */}
          <div>
            <p className="text-xs font-[family-name:var(--font-dm-sans)] uppercase tracking-[0.2em] text-brand-sage mb-4">
              Contact
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/33667277614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-cream hover:text-brand-sage transition-colors"
                >
                  WhatsApp : +33 6 67 27 76 14
                </a>
              </li>
              <li className="text-brand-cream/75 text-xs mt-3">
                Île-de-France (interventions)
                <br />
                France, Belgique, Suisse et pays francophones (coaching)
              </li>
            </ul>
          </div>

          {/* Col 3 — Légal */}
          <div>
            <p className="text-xs font-[family-name:var(--font-dm-sans)] uppercase tracking-[0.2em] text-brand-sage mb-4">
              Légal
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-brand-cream hover:text-brand-sage transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li className="text-brand-cream/70 text-xs mt-3">
                TROTT SASU — SIREN 891 868 143
              </li>
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <p className="text-xs font-[family-name:var(--font-dm-sans)] uppercase tracking-[0.2em] text-brand-sage mb-4">
              Restez informé
            </p>
            <p className="text-sm text-brand-cream/80 leading-relaxed mb-4">
              Conseils saisonniers et protocoles agronomiques dans votre boîte mail.
            </p>
            <NewsletterCapture variant="footer" />
          </div>

        </div>

        <div className="mt-12 pt-8 pb-12 lg:pb-16 border-t border-brand-cream/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-cream/75">
            © {new Date().getFullYear()} hanami. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-brand-cream/80 sm:justify-end">
            <Link href="/" className="hover:text-brand-sage transition-colors">
              Particuliers
            </Link>
              <Link href="/pro" className="hover:text-brand-cream transition-colors">
                Professionnels
              </Link>
              <Link href="/pro/logiciel" className="hover:text-brand-cream transition-colors">
                Logiciel Hanami Pro
              </Link>
            <Link href="/coaching" className="hover:text-brand-sage transition-colors">
              Coaching
            </Link>
            <Link href="/calculatrice" className="hover:text-brand-sage transition-colors">
              Dosage Intelligent
            </Link>
            <Link href="/blog" className="hover:text-brand-sage transition-colors">
              Journal
            </Link>
            <Link href="/pourquoi-hanami" className="hover:text-brand-sage transition-colors">
              Pourquoi Hanami ?
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * ProHero.tsx — Section principale de la page Professionnels
 *
 * Fond vert très foncé (#1a2e1a), texte blanc.
 * Tag en Space Mono, headline en Fraunces grande taille, deux CTA.
 * Pas de photo sur cette page — layout centré avec déco radiale.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

export default function ProHero() {
  const fadeRef = useFadeIn()

  function scrollToContact(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-hanami-900 pt-36 pb-16 lg:pt-44 lg:pb-24">

      {/* Cercles décoratifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4a8c3f 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d4a853 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2d5a27 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div ref={fadeRef} className="fade-in max-w-3xl">

          {/* Tag */}
          <span
            className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-widest mb-6 block"
            style={{ color: '#4a8c3f' }}
          >
            Paysagistes · Espaces verts · Entrepreneurs
          </span>

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-white mb-6"
            style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            Le gazon, c&apos;est 70% d&apos;un jardin. C&apos;est ce que vos clients et leurs invités voient en premier.
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-stone-300 leading-relaxed mb-10 max-w-2xl">
            Expertise agronomique terrain, dosages précis, conseils calés sur la météo agricole jour par jour.
            Transformez le gazon en levier de satisfaction, de renouvellement et de marge.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-500 transition-colors cursor-pointer text-sm"
            >
              Discutons de votre activité
            </button>
            <a
              href="https://wa.me/33667277614"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-white/20 text-white font-medium hover:border-white/50 hover:bg-white/5 transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * ProHero.tsx — Section principale de la page Professionnels
 *
 * Fond vert très foncé (#1a2e1a), texte blanc.
 * Tag en Space Mono, headline en Fraunces grande taille, deux CTA.
 * Pas de photo sur cette page — layout centré avec déco radiale.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import CalendlyButton from '@/components/shared/CalendlyButton'

export default function ProHero() {
  const fadeRef = useFadeIn()

  // Scroll vers le formulaire (CTA secondaire "Écrire d'abord")
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

          {/* CTA — primaire : Calendly popup / secondaire : écrire d'abord */}
          <div className="flex flex-col sm:flex-row gap-4">
            <CalendlyButton
              utmSource="pro-hero"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-500 transition-colors cursor-pointer text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Réserver un appel (30 min)
            </CalendlyButton>

            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-white/20 text-white font-medium hover:border-white/50 hover:bg-white/5 transition-colors cursor-pointer text-sm"
            >
              Écrire d&apos;abord
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

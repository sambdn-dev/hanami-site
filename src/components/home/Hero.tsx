/**
 * Hero.tsx — Section principale d'accueil (première chose visible sur la page)
 *
 * Ce composant affiche :
 * - Un tag "Coaching agronomique · Île-de-France & toute la France"
 * - Le titre principal en grand (police Fraunces, aligné à gauche)
 * - Un sous-titre descriptif
 * - Deux boutons CTA : "Diagnostic gratuit" (scroll vers le formulaire) + WhatsApp
 * - Sur desktop : une photo avant/après décalée à droite qui sort de la grille
 * - Sur mobile : la photo est masquée, le texte prend toute la largeur
 * - Des cercles décoratifs en arrière-plan (verts et ambrés, floutés)
 */

'use client'

import Link from 'next/link'
import { useFadeIn } from '@/hooks/useFadeIn'
import { track } from '@/lib/analytics'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'

export default function Hero() {
  // Référence pour l'animation fade-in au chargement
  const fadeRef = useFadeIn()

  return (
    // pt-36 = 144px : bandeau (32px) + navbar (64px) + 48px de respiration
    <section className="relative min-h-screen flex items-center overflow-hidden bg-stone-50 pt-36 pb-16 lg:pt-44 lg:pb-24">

      {/* ── Cercles décoratifs en arrière-plan ───────────────────────────────
          Ces cercles floutés créent une ambiance douce sans être agressifs.
          Ils sont en position absolue et pointer-events:none (non cliquables). */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Grand cercle vert en haut à gauche */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4a8c3f 0%, transparent 70%)' }}
        />
        {/* Cercle ambré en bas à droite */}
        <div
          className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d4a853 0%, transparent 70%)' }}
        />
        {/* Petit cercle vert foncé en haut à droite */}
        <div
          className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2d5a27 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Contenu principal ────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

          {/* ── Colonne gauche : texte ──────────────────────────────────── */}
          <div ref={fadeRef} className="fade-in max-w-xl">

            {/* Tag de catégorie en Space Mono */}
            <span className="section-label mb-6 block">
              Coaching agronomique · Partout en France
            </span>

            {/* Titre principal — police Fraunces, grande taille, aligné à gauche */}
            <h1
              className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-hanami-900 mb-6"
              style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
            >
              Votre gazon mérite un expert, pas une étiquette en jardinerie.
            </h1>

            {/* Sous-titre descriptif */}
            <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
              Diagnostic personnalisé, protocole daté, produits professionnels.
              Des résultats visibles, pas des promesses sur un emballage.
            </p>

            {/* ── Boutons CTA ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4">

              {/* CTA principal : coaching — l'offre scalable nationale */}
              <Link
                href="/coaching"
                onClick={() => track('cta_click', { location: 'hero_primary', page: window.location.pathname })}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-900 transition-colors cursor-pointer text-sm"
              >
                Découvrir le coaching — 1ᵉʳ mois offert
              </Link>

              {/* CTA secondaire : wizard de simulation chantier (IDF) */}
              <Link
                href="/mon-chantier"
                onClick={() => track('cta_click', { location: 'hero_secondary', page: window.location.pathname })}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-stone-200 text-stone-800 font-medium hover:border-hanami-500 hover:text-hanami-700 transition-colors text-sm bg-white"
              >
                Estimer mon chantier
              </Link>

            </div>

            {/* Réassurance sous les CTA — lève les 3 freins au clic.
                (WhatsApp reste accessible via le bouton flottant) */}
            <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-stone-400 uppercase tracking-wider mt-4">
              1ᵉʳ mois offert · Puis {PRICING_DISPLAY.coachingMois} €/mois · Sans engagement
            </p>
          </div>

          {/* ── Colonne droite : slider avant/après ── */}
          <div className="block relative">
            {/* Décalage asymétrique vers la droite (desktop uniquement) */}
            <div className="relative lg:ml-8 lg:translate-x-8">

              {/* Slider avant/après — mêmes photos et paramètres que Cas clients */}
              <BeforeAfterSlider
                beforeSrc="/images/avant-susan.jpg"
                afterSrc="/images/apres-susan.jpg"
                beforeAlt="Gazon avant rénovation Hanami"
                afterAlt="Gazon après rénovation Hanami"
                beforeObjectPosition="center 43%"
                afterObjectPosition="center 88%"
                afterTransform="scale(1.08)"
                afterTransformOrigin="center 15%"
                initialPosition={50}
                priority
              />

              {/* Badge flottant "Résultat" en bas à gauche */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg px-4 py-3 border border-stone-100">
                <p className="font-[family-name:var(--font-space-mono)] text-xs text-stone-500 uppercase tracking-wider">
                  Résultat
                </p>
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-hanami-900">
                  6 semaines
                </p>
              </div>

              {/* Badge flottant surface en haut à droite */}
              <div className="absolute -top-4 -right-4 bg-hanami-700 rounded-xl shadow-lg px-4 py-3">
                <p className="font-[family-name:var(--font-space-mono)] text-xs text-hanami-100 uppercase tracking-wider">
                  Surface
                </p>
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white">
                  600 m²
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

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

import { useFadeIn } from '@/hooks/useFadeIn'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'

export default function Hero() {
  // Référence pour l'animation fade-in au chargement
  const fadeRef = useFadeIn()

  // Scroll fluide vers le formulaire de contact (ancre #contact)
  function scrollToContact(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

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
              Coaching agronomique · Île-de-France &amp; pays francophones
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

              {/* CTA principal : scroll vers le formulaire */}
              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-900 transition-colors cursor-pointer text-sm"
              >
                Demander un diagnostic gratuit
              </button>

              {/* CTA secondaire : WhatsApp */}
              <a
                href="https://wa.me/33667277614"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-stone-200 text-stone-800 font-medium hover:border-hanami-500 hover:text-hanami-700 transition-colors text-sm bg-white"
              >
                {/* Icône WhatsApp SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* ── Colonne droite : slider avant/après (masqué sur mobile) ── */}
          {/*
            Sur desktop (lg:), le slider sort légèrement de la grille vers la droite.
            Sur mobile, ce bloc est caché (hidden) pour garder le texte lisible.
            Les paramètres sont identiques à ceux de la section Cas clients
            pour garantir le même rendu visuel.
          */}
          <div className="hidden lg:block relative">
            {/* Décalage asymétrique vers la droite */}
            <div className="relative ml-8 translate-x-8">

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
                  800 m²
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

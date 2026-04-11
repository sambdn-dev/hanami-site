/**
 * SeasonalMoments.tsx — Section "5 moments clés pour un gazon parfait"
 *
 * Carousel épuré de 5 cartes, une par moment clé de l'année.
 * Design sobre : dégradés colorés par saison, pas de motifs SVG,
 * mise en avant du numéro et du texte. Navigation flèches + dots.
 *
 * PALETTE PAR SAISON :
 * 1. Sortie d'hiver  — bleu ardoise → vert profond
 * 2. Printemps       — vert pâle → vert Hanami
 * 3. Été             — ocre chaud → ambre doré
 * 4. Automne         — brun terreux → roux profond
 * 5. Hiver           — vert nuit → ardoise froide
 */

'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFadeIn } from '@/hooks/useFadeIn'

const moments = [
  {
    number: '01',
    period: 'Février – Mars',
    title: 'Sortie d\'hiver',
    body: 'Deux mois avant le printemps, on réveille votre gazon et on stimule sa croissance. C\'est la période clé pour préparer une pelouse dense et saine dès le début de la saison, afin de limiter le développement des mauvaises herbes.',
    // Bleu ardoise froid → vert profond
    from: '#2c3a4a',
    to: '#1a3d2b',
    accent: '#7eb8a0',
    periodBg: 'rgba(126,184,160,0.2)',
  },
  {
    number: '02',
    period: 'Mars – Mai',
    title: 'Préparation de printemps',
    body: 'Le réveil de la nature est le moment idéal pour scarifier, aérer le sol et semer là où c\'est nécessaire. On vous guide pour préparer votre gazon à une croissance optimale.',
    // Vert pâle → vert Hanami
    from: '#2d5a27',
    to: '#1a2e1a',
    accent: '#a8d4a0',
    periodBg: 'rgba(168,212,160,0.2)',
  },
  {
    number: '03',
    period: 'Juin – Août',
    title: 'Renforcement d\'été',
    body: 'L\'été peut être rude pour votre pelouse. Grâce à nos conseils calés sur la météo agricole en temps réel, vous maintenez l\'humidité, limitez l\'arrosage et prévenez les zones sèches ou brûlées.',
    // Ocre chaud → ambre doré
    from: '#7c4a1a',
    to: '#5c3510',
    accent: '#e8c07a',
    periodBg: 'rgba(232,192,122,0.2)',
  },
  {
    number: '04',
    period: 'Septembre – Novembre',
    title: 'Transition d\'automne',
    body: 'L\'automne est le moment de renforcer votre gazon pour résister aux mois froids. La croissance reprend. On vous aide à fertiliser, regarnir les zones dégarnies et éliminer la mousse, afin qu\'elle ne revienne plus jamais.',
    // Brun terreux → roux profond
    from: '#6b3a1f',
    to: '#4a2510',
    accent: '#d4956a',
    periodBg: 'rgba(212,149,106,0.2)',
  },
  {
    number: '05',
    period: 'Décembre – Janvier',
    title: 'Protection hivernale',
    body: 'Même en hiver, votre gazon a besoin d\'attention. Nos recommandations protègent votre pelouse même dans les conditions les plus extrêmes, et préparent un démarrage rapide au printemps.',
    // Vert nuit → ardoise froide
    from: '#1a2e1a',
    to: '#1e2d3a',
    accent: '#8ab0c0',
    periodBg: 'rgba(138,176,192,0.2)',
  },
]

export default function SeasonalMoments() {
  const [current, setCurrent] = useState(0)
  const headerRef = useFadeIn()

  const prev = () => setCurrent((c) => (c === 0 ? moments.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === moments.length - 1 ? 0 : c + 1))

  const m = moments[current]

  return (
    <section className="py-20 lg:py-28 bg-hanami-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-12 max-w-2xl">
          <span className="section-label mb-3 block" style={{ color: '#4a8c3f' }}>
            Suivi annuel
          </span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
            5 moments clés pour un gazon parfait, toute l'année
          </h2>
          <p className="text-stone-400 text-base leading-relaxed">
            Chaque saison apporte son lot de défis. Nous vous accompagnons à 5 moments
            clés avec un plan d'action précis pour que votre gazon reste dense et sain.
          </p>
        </div>

        {/* ── Carte principale ──────────────────────────────────────────── */}
        <div className="relative">
          <div
            className="rounded-2xl overflow-hidden transition-all duration-500"
            style={{ background: `linear-gradient(135deg, ${m.from} 0%, ${m.to} 100%)` }}
          >
            {/* Layout : numéro géant à gauche + contenu à droite sur desktop */}
            <div className="flex flex-col lg:flex-row">

              {/* ── Numéro géant (décoratif) ────────────────────────────── */}
              <div className="flex items-center justify-center lg:justify-start lg:w-64 px-10 pt-10 pb-4 lg:py-14 shrink-0">
                <span
                  className="font-[family-name:var(--font-space-mono)] font-bold leading-none select-none"
                  style={{
                    fontSize: 'clamp(6rem, 12vw, 9rem)',
                    color: m.accent,
                    opacity: 0.35,
                  }}
                  aria-hidden="true"
                >
                  {m.number}
                </span>
              </div>

              {/* ── Contenu textuel ─────────────────────────────────────── */}
              <div className="flex flex-col justify-center px-8 lg:px-0 pb-10 lg:py-14 lg:pr-14 gap-4">

                {/* Tag période */}
                <span
                  className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-widest px-3 py-1 rounded-full self-start"
                  style={{ backgroundColor: m.periodBg, color: m.accent }}
                >
                  {m.period}
                </span>

                {/* Titre */}
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {m.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-base leading-relaxed max-w-xl">
                  {m.body}
                </p>
              </div>
            </div>
          </div>

          {/* ── Boutons flèches ──────────────────────────────────────────── */}
          <button
            onClick={prev}
            aria-label="Moment précédent"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Moment suivant"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Barre de navigation (dots + titres miniatures) ──────────── */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {moments.map((mo, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Aller à : ${mo.title}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                index === current
                  ? 'bg-hanami-500/30 text-hanami-300 border border-hanami-500/40'
                  : 'text-stone-500 hover:text-stone-300 border border-transparent'
              }`}
            >
              {/* Dot coloré */}
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: index === current ? mo.accent : '#4b5563',
                  opacity: index === current ? 1 : 0.5,
                }}
              />
              <span className="font-[family-name:var(--font-space-mono)]">
                {mo.number}
              </span>
              {/* Titre court visible uniquement sur le dot actif */}
              {index === current && (
                <span>{mo.title}</span>
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

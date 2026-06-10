/**
 * CoachingContent.tsx — Sections principales de la landing /coaching
 *
 * Pattern "Pricing-Focused Landing" adapté à une offre unique :
 * 1. Hero — proposition de valeur + carte protocole (asymétrie)
 * 2. Bloc prix — 29 €/mois en grand, ancrage "sac d'engrais", 3 preuves
 * 3. Ce qui est inclus — les 4 piliers du coaching
 * 4. Comment ça marche — 3 étapes
 *
 * Le CTA unique de la page scrolle vers le formulaire #contact en bas.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import { track } from '@/lib/analytics'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import { SERVICES } from '@/lib/chantier/services'
import { Check, Camera, CalendarDays, MessageCircle } from 'lucide-react'

function scrollToContact(location: string) {
  track('cta_click', { location, page: window.location.pathname })
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

/* Extrait de protocole affiché dans la carte du hero — incarne la promesse
   "protocole daté au jour près" sans avoir besoin de photos. */
const SAMPLE_PROTOCOL = [
  { date: '12 mars', action: 'Scarification croisée + regarnissage Pro 12' },
  { date: '26 mars', action: 'Engrais racinaire 25 g/m² + arrosage 5 mm' },
  { date: '14 avril', action: 'Première tonte à 6 cm, ramassage' },
  { date: '2 mai', action: 'Biostimulant algues 10 L/ha' },
]

export default function CoachingContent() {
  const heroRef = useFadeIn()
  const priceRef = useFadeIn()
  const includedRef = useFadeIn()
  const stepsRef = useFadeIn()

  const coaching = SERVICES.coaching

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-stone-50 pt-36 pb-16 lg:pt-44 lg:pb-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #4a8c3f 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #d4a853 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Colonne texte */}
            <div ref={heroRef} className="fade-in max-w-xl">
              <span className="section-label mb-6 block">
                Coaching annuel · 100 % en ligne · Partout en France
              </span>
              <h1
                className="font-[family-name:var(--font-fraunces)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-hanami-900 mb-6"
                style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
              >
                Un expert gazon dans votre poche, toute l&apos;année.
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
                {coaching.accroche}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => scrollToContact('coaching_hero')}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-hanami-700 text-white font-medium hover:bg-hanami-900 transition-colors cursor-pointer text-sm"
                >
                  Demander mon diagnostic offert
                </button>
                <a
                  href="https://wa.me/33667277614"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { source: 'coaching_hero', page: window.location.pathname })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-stone-200 text-stone-800 font-medium hover:border-hanami-500 hover:text-hanami-700 transition-colors text-sm bg-white"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  WhatsApp
                </a>
              </div>

              <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-stone-400 uppercase tracking-wider mt-4">
                Diagnostic offert · Sans engagement · Réponse sous 24 h
              </p>
            </div>

            {/* Colonne carte protocole — décalée (asymétrie) */}
            <div className="relative lg:ml-8 lg:translate-x-8">
              {/* pb-12 : réserve l'espace du badge prix flottant pour qu'il ne
                  recouvre pas la note italique en bas de carte */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-6 pb-12">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-[family-name:var(--font-space-mono)] text-[10px] font-semibold tracking-widest uppercase text-hanami-500">
                    Extrait de protocole
                  </span>
                  <span className="font-[family-name:var(--font-space-mono)] text-[10px] px-2 py-0.5 rounded-full text-amber-500 bg-amber-100/60 uppercase tracking-wider">
                    Daté au jour près
                  </span>
                </div>
                <ul className="space-y-4">
                  {SAMPLE_PROTOCOL.map((step) => (
                    <li key={step.date} className="flex items-start gap-4">
                      <span className="font-[family-name:var(--font-space-mono)] text-xs font-bold text-hanami-700 bg-hanami-100 rounded-md px-2 py-1 shrink-0 w-20 text-center">
                        {step.date}
                      </span>
                      <span className="text-sm text-stone-600 leading-relaxed">{step.action}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-stone-400 italic border-t border-stone-100 pt-4 mt-5">
                  Chaque protocole est écrit pour votre gazon : surface, sol, exposition, usage.
                </p>
              </div>

              {/* Badge flottant prix */}
              <div className="absolute -bottom-6 -left-6 bg-hanami-700 rounded-xl shadow-lg px-4 py-3">
                <p className="font-[family-name:var(--font-space-mono)] text-xs text-hanami-100 uppercase tracking-wider">
                  Coaching
                </p>
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white">
                  {PRICING_DISPLAY.coachingMois} €/mois
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Bloc prix — fond vert foncé ──────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-hanami-900">
        <div ref={priceRef} className="fade-in max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-3 block" style={{ color: '#4a8c3f' }}>
                Le prix
              </span>
              <p className="font-[family-name:var(--font-space-mono)] text-6xl lg:text-7xl font-bold text-white">
                {PRICING_DISPLAY.coachingMois}&nbsp;€
                <span className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-stone-300 italic"> /mois TTC</span>
              </p>
              <p className="font-[family-name:var(--font-fraunces)] text-xl text-amber-500 mt-4">
                Moins cher qu&apos;un sac d&apos;engrais en jardinerie.
              </p>
              <p className="text-stone-300 text-sm leading-relaxed mt-3 max-w-md">
                Et cette fois, c&apos;est le bon produit, à la bonne dose, à la bonne date.
                Rentabilisé dès le premier achat inutile évité.
              </p>
            </div>

            {/* 3 preuves en Space Mono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { value: '100 %', label: 'de renouvellement coaching' },
                { value: '12 mois', label: 'de protocole daté au jour près' },
                { value: 'Illimité', label: 'suivi et ajustements inclus' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="font-[family-name:var(--font-space-mono)] text-2xl font-bold text-amber-500">
                    {stat.value}
                  </p>
                  <p className="text-stone-300 text-xs leading-relaxed mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Ce qui est inclus ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-stone-50">
        <div ref={includedRef} className="fade-in max-w-7xl mx-auto px-6 lg:px-8">
          <span className="section-label mb-3 block">Ce qui est inclus</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight mb-12">
            Tout ce qu&apos;il faut pour réussir, rien de superflu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {coaching.inclus.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl border border-stone-200 p-5">
                <span className="w-6 h-6 rounded-full bg-hanami-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-hanami-700" strokeWidth={3} />
                </span>
                <p className="text-stone-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Comment ça marche — 3 étapes ─────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-hanami-100/40">
        <div ref={stepsRef} className="fade-in max-w-7xl mx-auto px-6 lg:px-8">
          <span className="section-label mb-3 block">Comment ça marche</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight mb-12">
            Trois étapes, zéro jargon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                num: '01',
                title: 'Vous envoyez vos photos',
                text: 'Quelques photos de votre gazon et 5 questions. Je diagnostique l\'état réel : sol, feutrage, densité, exposition.',
              },
              {
                icon: CalendarDays,
                num: '02',
                title: 'Vous recevez votre protocole',
                text: 'Un plan 3D zone par zone et un calendrier 12 mois daté : quoi appliquer, quand, à quelle dose, avec quels produits.',
              },
              {
                icon: MessageCircle,
                num: '03',
                title: 'Vous appliquez, on ajuste',
                text: 'Suivi illimité toute l\'année. Météo capricieuse, doute sur une dose, zone qui jaunit : on adapte le protocole ensemble.',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-xl border border-stone-200 p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-hanami-100 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-hanami-700" strokeWidth={1.5} />
                  </div>
                  <span className="font-[family-name:var(--font-space-mono)] text-2xl font-bold text-stone-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-hanami-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          {/* CTA de relance après les étapes */}
          <div className="mt-12">
            <button
              type="button"
              onClick={() => scrollToContact('coaching_steps')}
              className="inline-flex items-center px-6 py-3 rounded-md bg-hanami-700 text-white text-sm font-medium hover:bg-hanami-900 transition-colors cursor-pointer"
            >
              Commencer par le diagnostic offert →
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

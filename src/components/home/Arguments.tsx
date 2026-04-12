'use client'

/**
 * Arguments.tsx — Carousel "Ce que la jardinerie ne vous dira jamais"
 *
 * 9 cartes, une à la fois.
 * - Desktop : grande carte pleine largeur, titre + corps en 2 colonnes
 * - Mobile  : swipe gauche/droite
 * - Auto-avance toutes les 5s, pause au survol ou au toucher
 * - Navigation : flèches + dots + compteur
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useFadeIn } from '@/hooks/useFadeIn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-hanami-700">{children}</strong>
}
function StrongInv({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-hanami-100">{children}</strong>
}

// ── 9 cartes ─────────────────────────────────────────────────────────────────
//
// Ordre optimisé pour la conversion : les plus gros pain points d'abord
// (hebdomadaires + universels), puis différenciation, puis objections.
//   1. Mauvaises herbes         — pain n°1 viscéral, temps perdu chaque week-end
//   2. Tout essayé, rien ne dure — valide la dépense déjà engagée → prêt à payer
//   3. Jaunit en été            — urgence saisonnière + économie d'eau
//   4. Pareil que le voisin     — amorce le besoin de diagnostic personnalisé
//   5. IA                       — objection 2026, différencie d'un chat gratuit
//   6. Rénovation ratée         — réduction de risque financier
//   7. Retourner le sol         — contre-mythe technique
//   8. Jardinier existant       — objection niche, frame complémentarité
//   9. Payer quelqu'un          — closing pour fence-sitters DIY
const CARDS = [
  {
    quote: '« Je passe mes week-ends à arracher les mauvaises herbes à la main »',
    title: 'Les mauvaises herbes adorent les trous',
    body: (inv: boolean) => inv
      ? <>Les mauvaises herbes ne sont pas le problème : elles sont le symptôme. Elles colonisent les <StrongInv>espaces vides laissés par un gazon trop peu dense</StrongInv>. Sans fertilisation adaptée, le vide persiste. Avec un protocole Hanami, <StrongInv>votre gazon explose en densité</StrongInv>.</>
      : <>Les mauvaises herbes ne sont pas le problème : elles sont le symptôme. Elles colonisent les <Strong>espaces vides laissés par un gazon trop peu dense</Strong>. Sans fertilisation adaptée, le vide persiste. Avec un protocole Hanami, <Strong>votre gazon explose en densité</Strong>.</>,
  },
  {
    quote: '« J\'ai tout essayé, rien ne dure »',
    title: 'Les produits jardinerie sont conçus pour être vendus, pas pour fonctionner',
    body: (inv: boolean) => inv
      ? <>Un engrais jardinerie libère tout en <StrongInv>2 semaines</StrongInv>. Pic de croissance, puis plus rien. Les produits professionnels libèrent leurs nutriments sur <StrongInv>2 à 4 mois</StrongInv>. C'est ce qu'utilisent les <StrongInv>terrains de sport et les golfs</StrongInv>, rendu accessible avec Hanami en format jardin.</>
      : <>Un engrais jardinerie libère tout en <Strong>2 semaines</Strong>. Pic de croissance, puis plus rien. Les produits professionnels libèrent leurs nutriments sur <Strong>2 à 4 mois</Strong>. C'est ce qu'utilisent les <Strong>terrains de sport et les golfs</Strong>, rendu accessible avec Hanami en format jardin.</>,
  },
  {
    quote: '« Mon gazon jaunit en été malgré l\'arrosage »',
    title: 'Un gazon dense, c\'est jusqu\'à 40 % d\'eau en moins',
    body: (inv: boolean) => inv
      ? <>Un gazon clairsemé laisse le sol exposé. L'eau s'évapore avant d'atteindre les racines. Un gazon dense <StrongInv>couvre le sol et retient l'humidité</StrongInv> : il tient l'été. Vous arrosez <StrongInv>jusqu'à 40 % moins</StrongInv>.</>
      : <>Un gazon clairsemé laisse le sol exposé. L'eau s'évapore avant d'atteindre les racines. Un gazon dense <Strong>couvre le sol et retient l'humidité</Strong> : il tient l'été. Vous arrosez <Strong>jusqu'à 40 % moins</Strong>.</>,
  },
  {
    quote: '« J\'ai fait pareil que mon voisin, ça ne marche pas chez moi »',
    title: 'Votre sol ne fonctionne pas comme celui du voisin',
    body: (inv: boolean) => inv
      ? <>Sol <StrongInv>argileux, sableux, calcaire</StrongInv>, ombre, pente : chaque jardin est unique. Hanami analyse votre terrain de manière spécifique, <StrongInv>type de sol, exposition, historique, contraintes</StrongInv>. Votre protocole est adapté à votre réalité, pas celle du voisin.</>
      : <>Sol <Strong>argileux, sableux, calcaire</Strong>, ombre, pente : chaque jardin est unique. Hanami analyse votre terrain de manière spécifique, <Strong>type de sol, exposition, historique, contraintes</Strong>. Votre protocole est adapté à votre réalité, pas celle du voisin.</>,
  },
  {
    quote: '« J\'ai demandé à une IA comment améliorer mon gazon, j\'ai suivi les conseils… et rien n\'a changé »',
    title: 'Une IA ne connaît pas votre sol. Hanami, si.',
    body: (inv: boolean) => inv
      ? <>Une IA vous donne des conseils calibrés sur des millions de jardins imaginaires. Elle ne sait pas qu'en France <StrongInv>les produits contre les mauvaises herbes sont interdits</StrongInv>. Elle voit vos photos mais ne connaît pas le contexte, l'historique de ce que vous avez fait sur votre gazon, votre composition de sol, votre exposition nord, ni vos erreurs passées. Hanami est un agronome qui connaît <StrongInv>votre terrain</StrongInv>, saison après saison.</>
      : <>Une IA vous donne des conseils calibrés sur des millions de jardins imaginaires. Elle ne sait pas qu'en France <Strong>les produits contre les mauvaises herbes sont interdits</Strong>. Elle voit vos photos mais ne connaît pas le contexte, l'historique de ce que vous avez fait sur votre gazon, votre composition de sol, votre exposition nord, ni vos erreurs passées. Hanami est un agronome qui connaît <Strong>votre terrain</Strong>, saison après saison.</>,
  },
  {
    quote: '« Je pensais refaire ma pelouse moi-même »',
    title: 'Une rénovation ratée, c\'est deux fois le prix',
    body: (inv: boolean) => inv
      ? <>Mauvais moment, mauvaise semence, sol non préparé : vous perdez <StrongInv>3 à 6 semaines</StrongInv>, <StrongInv>200 à 500 €</StrongInv> et vous recommencez à zéro. Une rénovation ratée coûte <StrongInv>le double</StrongInv> d'une rénovation bien faite.</>
      : <>Mauvais moment, mauvaise semence, sol non préparé : vous perdez <Strong>3 à 6 semaines</Strong>, <Strong>200 à 500 €</Strong> et vous recommencez à zéro. Une rénovation ratée coûte <Strong>le double</Strong> d'une rénovation bien faite.</>,
  },
  {
    quote: '« On m\'a dit qu\'il fallait tout retourner le sol, mettre du sable, refaire les fondations. »',
    title: 'Non. Scarifier, oui. Démolir votre jardin, non.',
    body: (inv: boolean) => inv
      ? <>Retourner tout le sol est une idée reçue héritée du potager. Hanami travaille sur l'existant : <StrongInv>scarification</StrongInv> profonde, puis <StrongInv>sur-semis avec des semences professionnelles</StrongInv> auto-régénérantes. Résultat <StrongInv>identique à une reconstruction</StrongInv>, sans boue, sans terrassement.</>
      : <>Retourner tout le sol est une idée reçue héritée du potager. Hanami travaille sur l'existant : <Strong>scarification</Strong> profonde, puis <Strong>sur-semis avec des semences professionnelles</Strong> auto-régénérantes. Résultat <Strong>identique à une reconstruction</Strong>, sans boue, sans terrassement.</>,
  },
  {
    quote: '« J\'ai déjà quelqu\'un qui s\'occupe de mon jardin, mais le gazon reste décevant »',
    title: 'Votre jardinier entretient. Hanami prescrit. C\'est complémentaire.',
    body: (inv: boolean) => inv
      ? <>Il tond, taille et arrose. Hanami diagnostique votre sol et lui remet le <StrongInv>protocole à appliquer</StrongInv>. Deux métiers, pas deux factures inutiles. Le résultat, lui, <StrongInv>s'améliore enfin</StrongInv>.</>
      : <>Il tond, taille et arrose. Hanami diagnostique votre sol et lui remet le <Strong>protocole à appliquer</Strong>. Deux métiers, pas deux factures inutiles. Le résultat, lui, <Strong>s'améliore enfin</Strong>.</>,
  },
  {
    quote: '« Je n\'ai pas envie de payer quelqu\'un pour tondre ma pelouse »',
    title: 'Vous pouvez le faire vous-même. Il faut juste les bonnes instructions.',
    body: (inv: boolean) => inv
      ? <>On ne tond pas votre gazon. Si vous avez un <StrongInv>épandeur et un tuyau d'arrosage</StrongInv>, vous pouvez obtenir un résultat de luxe. Ce qui vous manque, c'est <StrongInv>le savoir</StrongInv>. C'est ce que le protocole Hanami vous donne.</>
      : <>On ne tond pas votre gazon. Si vous avez un <Strong>épandeur et un tuyau d'arrosage</Strong>, vous pouvez obtenir un résultat de luxe. Ce qui vous manque, c'est <Strong>le savoir</Strong>. C'est ce que le protocole Hanami vous donne.</>,
  },
]

// ── Composant principal ───────────────────────────────────────────────────────

export default function Arguments() {
  const headerRef = useFadeIn()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [cardKey, setCardKey] = useState(0) // force re-mount pour l'animation
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrent(index)
    setCardKey(k => k + 1)
  }, [])

  const prev = useCallback(() => {
    goTo((current - 1 + CARDS.length) % CARDS.length)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % CARDS.length)
  }, [current, goTo])

  // Auto-avance toutes les 5s
  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, 5000)
    return () => clearTimeout(t)
  }, [current, paused, next])

  // Swipe mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = null
    setPaused(false)
  }

  const card = CARDS[current]
  const inv = current % 2 === 0

  return (
    <section
      className="py-20 lg:py-28 bg-stone-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── En-tête + navigation ─────────────────────────────────── */}
        <div
          ref={headerRef}
          className="fade-in mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <span className="section-label mb-3 block">Le problème</span>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
              Ce que la jardinerie ne vous dira jamais
            </h2>
          </div>

          {/* Compteur + flèches */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-[family-name:var(--font-space-mono)] text-sm text-stone-400 tabular-nums">
              {String(current + 1).padStart(2, '0')} — {String(CARDS.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Carte précédente"
                className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-hanami-500 hover:text-hanami-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Carte suivante"
                className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-hanami-500 hover:text-hanami-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Carte active ─────────────────────────────────────────── */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative pb-5"
        >
          {/* Carte empilée 3 — la plus en arrière */}
          <div className={`absolute inset-x-10 top-3 bottom-[-14px] rounded-2xl ${
            inv ? 'bg-hanami-700/25' : 'bg-stone-200/70'
          }`} />
          {/* Carte empilée 2 — juste derrière */}
          <div className={`absolute inset-x-5 top-1.5 bottom-[-7px] rounded-2xl ${
            inv ? 'bg-hanami-700/45' : 'bg-stone-300/50'
          }`} />

          <div
            key={cardKey}
            className={`carousel-enter relative rounded-2xl p-8 lg:p-12 ${
              inv
                ? 'bg-hanami-900 border border-hanami-900'
                : 'bg-white border border-stone-200 shadow-sm'
            }`}
          >
            {/* Numéro */}
            <span className={`font-[family-name:var(--font-space-mono)] text-[10px] tracking-widest uppercase ${
              inv ? 'text-hanami-100/30' : 'text-stone-300'
            }`}>
              {String(current + 1).padStart(2, '0')}
            </span>

            {/* Citation — grande, en Fraunces */}
            <p className={`mt-4 font-[family-name:var(--font-fraunces)] text-xl sm:text-2xl lg:text-3xl font-semibold italic leading-snug max-w-3xl ${
              inv ? 'text-hanami-100/85' : 'text-hanami-700'
            }`}>
              {card.quote}
            </p>

            {/* Séparateur */}
            <div className={`mt-8 mb-8 h-px w-16 ${inv ? 'bg-hanami-100/20' : 'bg-stone-200'}`} />

            {/* Titre + corps en 2 colonnes sur desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              <h3 className={`font-semibold text-base lg:text-lg leading-snug ${
                inv ? 'text-white' : 'text-stone-800'
              }`}>
                {card.title}
              </h3>
              <p className={`text-sm lg:text-base leading-relaxed ${
                inv ? 'text-hanami-100/70' : 'text-stone-500'
              }`}>
                {card.body(inv)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Dots de navigation ───────────────────────────────────── */}
        <div className="flex items-center justify-center gap-1.5 mt-6" role="tablist">
          {CARDS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Argument ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-1.5 bg-hanami-700'
                  : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

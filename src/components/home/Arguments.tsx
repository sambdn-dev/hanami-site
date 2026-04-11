/**
 * Arguments.tsx — Section "Ce que la jardinerie ne vous dira jamais"
 *
 * 9 cartes en 3 rangées de 3 (3+3+3).
 * Indices pairs (0,2,4,6,8) = fond vert hanami-900.
 * Indices impairs (1,3,5,7) = fond blanc.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-hanami-700">{children}</strong>
}

function StrongInv({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-hanami-100">{children}</strong>
}

// ── 9 cartes — rangées 3+3+3 ─────────────────────────────────────────────────
const CARDS = [
  // ── Rangée 1 ──────────────────────────────────────────────────────────────
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

  // ── Rangée 2 ──────────────────────────────────────────────────────────────
  {
    quote: '« Je pensais refaire ma pelouse moi-même »',
    title: 'Une rénovation ratée, c\'est deux fois le prix',
    body: (inv: boolean) => inv
      ? <>Mauvais moment, mauvaise semence, sol non préparé : vous perdez <StrongInv>3 à 6 semaines</StrongInv>, <StrongInv>200 à 500 €</StrongInv> et vous recommencez à zéro. Une rénovation ratée coûte <StrongInv>le double</StrongInv> d'une rénovation bien faite.</>
      : <>Mauvais moment, mauvaise semence, sol non préparé : vous perdez <Strong>3 à 6 semaines</Strong>, <Strong>200 à 500 €</Strong> et vous recommencez à zéro. Une rénovation ratée coûte <Strong>le double</Strong> d'une rénovation bien faite.</>,
  },
  {
    quote: '« Je n\'ai pas envie de payer quelqu\'un pour tondre ma pelouse »',
    title: 'Vous pouvez le faire vous-même. Il faut juste les bonnes instructions.',
    body: (inv: boolean) => inv
      ? <>On ne tond pas votre gazon. Si vous avez un <StrongInv>épandeur et un tuyau d'arrosage</StrongInv>, vous pouvez obtenir un résultat de luxe. Ce qui vous manque, c'est <StrongInv>le savoir</StrongInv>. C'est ce que le protocole Hanami vous donne.</>
      : <>On ne tond pas votre gazon. Si vous avez un <Strong>épandeur et un tuyau d'arrosage</Strong>, vous pouvez obtenir un résultat de luxe. Ce qui vous manque, c'est <Strong>le savoir</Strong>. C'est ce que le protocole Hanami vous donne.</>,
  },
  {
    quote: '« J\'ai fait pareil que mon voisin, ça ne marche pas chez moi »',
    title: 'Votre sol ne fonctionne pas comme celui du voisin',
    body: (inv: boolean) => inv
      ? <>Sol <StrongInv>argileux, sableux, calcaire</StrongInv>, ombre, pente : chaque jardin est unique. Hanami analyse votre terrain de manière spécifique, <StrongInv>type de sol, exposition, historique, contraintes</StrongInv>. Votre protocole est adapté à votre réalité, pas celle du voisin.</>
      : <>Sol <Strong>argileux, sableux, calcaire</Strong>, ombre, pente : chaque jardin est unique. Hanami analyse votre terrain de manière spécifique, <Strong>type de sol, exposition, historique, contraintes</Strong>. Votre protocole est adapté à votre réalité, pas celle du voisin.</>,
  },

  // ── Rangée 3 ──────────────────────────────────────────────────────────────
  {
    quote: '« J\'ai déjà quelqu\'un qui s\'occupe de mon jardin, mais le gazon reste décevant »',
    title: 'Votre jardinier entretient. Hanami prescrit. C\'est complémentaire.',
    body: (inv: boolean) => inv
      ? <>Il tond, taille et arrose. Hanami diagnostique votre sol et lui remet le <StrongInv>protocole à appliquer</StrongInv>. Deux métiers, pas deux factures inutiles. Le résultat, lui, <StrongInv>s'améliore enfin</StrongInv>.</>
      : <>Il tond, taille et arrose. Hanami diagnostique votre sol et lui remet le <Strong>protocole à appliquer</Strong>. Deux métiers, pas deux factures inutiles. Le résultat, lui, <Strong>s'améliore enfin</Strong>.</>,
  },
  {
    quote: '« On m\'a dit qu\'il fallait tout retourner le sol, mettre du sable, refaire les fondations. C\'est décourageant et très cher. »',
    title: 'Non. Scarifier, oui. Démolir votre jardin, non.',
    body: (inv: boolean) => inv
      ? <>Retourner tout le sol est une idée reçue héritée du potager. Hanami travaille sur l'existant : <StrongInv>scarification</StrongInv> profonde, puis <StrongInv>sur-semis avec des semences professionnelles</StrongInv> auto-régénérantes. Résultat <StrongInv>identique à une reconstruction</StrongInv>, sans boue, sans terrassement et sans repartir de zéro.</>
      : <>Retourner tout le sol est une idée reçue héritée du potager. Hanami travaille sur l'existant : <Strong>scarification</Strong> profonde, puis <Strong>sur-semis avec des semences professionnelles</Strong> auto-régénérantes. Résultat <Strong>identique à une reconstruction</Strong>, sans boue, sans terrassement et sans repartir de zéro.</>,
  },
  {
    quote: '« J\'ai demandé à une IA comment améliorer mon gazon, j\'ai suivi les conseils… et rien n\'a changé »',
    title: 'Une IA ne connaît pas votre sol. Hanami, si.',
    body: (inv: boolean) => inv
      ? <>Une IA vous donne des conseils calibrés sur des millions de jardins imaginaires. Elle ne voit pas vos photos, ne connaît pas votre argile, votre exposition nord, ni vos erreurs passées. Elle ne peut pas commander les <StrongInv>bons produits professionnels</StrongInv>, ni ajuster le protocole en septembre. Hanami est un agronome qui connaît <StrongInv>votre terrain par son nom</StrongInv>, saison après saison.</>
      : <>Une IA vous donne des conseils calibrés sur des millions de jardins imaginaires. Elle ne voit pas vos photos, ne connaît pas votre argile, votre exposition nord, ni vos erreurs passées. Elle ne peut pas commander les <Strong>bons produits professionnels</Strong>, ni ajuster le protocole en septembre. Hanami est un agronome qui connaît <Strong>votre terrain par son nom</Strong>, saison après saison.</>,
  },
]

// ── Composant principal ───────────────────────────────────────────────────────

export default function Arguments() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-14">
          <span className="section-label mb-3 block">Le problème</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            Ce que la jardinerie ne vous dira jamais
          </h2>
        </div>

        {/* ── Rangée 1 : 3 colonnes ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {CARDS.slice(0, 3).map((card, i) => (
            <ArgumentCard key={i} {...card} index={i} />
          ))}
        </div>

        {/* ── Rangée 2 : 3 colonnes ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {CARDS.slice(3, 6).map((card, i) => (
            <ArgumentCard key={i + 3} {...card} index={i + 3} />
          ))}
        </div>

        {/* ── Rangée 3 : 3 colonnes ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.slice(6, 9).map((card, i) => (
            <ArgumentCard key={i + 6} {...card} index={i + 6} />
          ))}
        </div>

      </div>
    </section>
  )
}

// ── ArgumentCard ──────────────────────────────────────────────────────────────

function ArgumentCard({
  quote,
  title,
  body,
  index,
}: {
  quote: string
  title: string
  body: (inv: boolean) => React.ReactNode
  index: number
}) {
  const ref = useFadeIn()
  const inv = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`fade-in rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-md ${
        inv ? 'bg-hanami-900 border border-hanami-900' : 'bg-white border border-stone-200'
      }`}
      style={{ transitionDelay: `${(index % 3) * 60}ms` }}
    >
      <span className={`text-[10px] font-[family-name:var(--font-space-mono)] tracking-widest uppercase ${
        inv ? 'text-hanami-100/30' : 'text-stone-300'
      }`}>
        {String(index + 1).padStart(2, '0')}
      </span>

      <p className={`font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug italic ${
        inv ? 'text-hanami-100/80' : 'text-hanami-700'
      }`}>
        {quote}
      </p>

      <h3 className={`font-semibold text-sm leading-snug ${inv ? 'text-white' : 'text-stone-800'}`}>
        {title}
      </h3>

      <p className={`text-sm leading-relaxed ${inv ? 'text-hanami-100/70' : 'text-stone-500'}`}>
        {body(inv)}
      </p>
    </div>
  )
}

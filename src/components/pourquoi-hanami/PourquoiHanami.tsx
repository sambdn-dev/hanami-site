/**
 * PourquoiHanami.tsx — Page "Pourquoi Hanami ?"
 *
 * Histoire du fondateur : passion, apprentissage, chemin vers l'agronomie du gazon.
 * Mise en page éditoriale : chapitres numérotés, citations, timeline.
 */

import Link from 'next/link'

// ── Chapitres ────────────────────────────────────────────────────────────────

const chapters = [
  {
    number: '01',
    title: 'Un gazon décevant, malgré tout ce que j\'essayais',
    body: [
      'Comme beaucoup, j\'ai commencé par acheter ce que la jardinerie proposait. Un engrais universel ici, un désherbant là, quelques semences en sachet. J\'arrosais, j\'attendais. Résultat : un gazon clairsemé, jaune en été, envahi de mousse en automne.',
      'J\'ai cru que c\'était ma faute. Que je n\'avais pas la main verte. En réalité, j\'utilisais les mauvais outils, avec les mauvaises doses, au mauvais moment.',
    ],
  },
  {
    number: '02',
    title: 'La révélation : les terrains de sport',
    body: [
      'Tout a changé le jour où j\'ai discuté avec le responsable d\'entretien d\'un stade de football semi-professionnel. Son gazon était impeccable — dense, vert, souple. Je lui ai demandé son secret.',
      'Sa réponse m\'a tout de suite fasciné : « On n\'achète rien en jardinerie. Les produits professionnels ne sont pas vendus au grand public. Et on travaille avec un protocole daté, pas au feeling. »',
      'Ce jour-là, j\'ai compris que je n\'avais pas accès aux bons outils. Pas parce que je manquais de motivation — mais parce que le marché grand public n\'est pas conçu pour produire de vrais résultats.',
    ],
    quote: '« Les produits professionnels ne sont pas vendus au grand public. »',
  },
  {
    number: '03',
    title: '5 ans de formation auprès des plus grands',
    body: [
      'J\'ai décidé d\'apprendre sérieusement. Formation en agronomie du gazon, échanges avec des agronomes et des greenkeepers de golf, visites de chantiers professionnels. J\'ai lu tout ce qui existait en anglais sur la science du sol et la physiologie des graminées.',
      'J\'ai appris à lire un gazon comme un bilan de santé : la texture, la couleur, la densité, la présence de mousse ou de mauvaises herbes — chaque symptôme raconte quelque chose sur le sol, l\'exposition, les pratiques passées.',
      'J\'ai testé des dizaines de programmes, de produits, de calendriers. Sur mon propre jardin, sur celui de proches, puis de clients. Ce qui fonctionnait, ce qui ne fonctionnait pas, et surtout — pourquoi.',
    ],
  },
  {
    number: '04',
    title: 'La naissance de Hanami',
    body: [
      'Hanami, en japonais, c\'est l\'art de contempler les fleurs de cerisier — une pratique de présence et d\'attention à la beauté fugace du vivant. Ce nom résume ma vision : un gazon ne se force pas. Il s\'accompagne, avec les bons gestes, au bon moment.',
      'J\'ai créé Hanami pour donner accès à des particuliers ambitieux à ce que les professionnels utilisent : des produits vrais, des protocoles datés, un œil agronomique sur leur terrain spécifique.',
      'Pas une jardinerie en ligne. Pas un abonnement générique. Un vrai coaching, personnalisé, qui s\'adapte à votre sol, votre climat, vos objectifs.',
    ],
  },
  {
    number: '05',
    title: 'Ce que je crois profondément',
    body: [
      'Un gazon de qualité n\'est pas réservé aux golfs et aux stades. Avec les bons produits et le bon protocole, tout jardin peut se transformer — en une saison.',
      'La différence entre un gazon décevant et un gazon dont on est fier, c\'est rarement le travail fourni. C\'est l\'information. Savoir quoi faire, quand le faire, et avec quoi.',
      'C\'est exactement ce que Hanami apporte. Pas de la magie — de l\'agronomie, accessible.',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function PourquoiHanami() {
  return (
    <div>

      {/* ── Hero éditorial ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-stone-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <span
            className="text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-widest text-[#4a8c3f] mb-4 block"
          >
            L'histoire
          </span>
          <h1
            className="text-4xl lg:text-5xl font-semibold text-[#1a2e1a] leading-tight mb-6"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Pourquoi Hanami ?
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed max-w-2xl">
            Cinq ans à apprendre, à tester, à me tromper et à comprendre. Ce n'est pas une startup. C'est une obsession devenue métier.
          </p>
        </div>
      </section>

      {/* ── Séparateur ─────────────────────────────────────────────────────── */}
      <div className="h-px bg-stone-200 max-w-3xl mx-auto px-6 lg:px-8" />

      {/* ── Chapitres ──────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-20">
          {chapters.map((ch) => (
            <article key={ch.number} className="relative">

              {/* Numéro chapître */}
              <div className="flex items-start gap-6 mb-6">
                <span
                  className="text-5xl font-bold text-stone-100 font-[family-name:var(--font-fraunces)] leading-none select-none shrink-0"
                  aria-hidden="true"
                >
                  {ch.number}
                </span>
                <h2
                  className="text-xl lg:text-2xl font-semibold text-[#1a2e1a] leading-snug pt-2"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {ch.title}
                </h2>
              </div>

              {/* Corps */}
              <div className="pl-0 lg:pl-20 space-y-5">
                {ch.body.map((para, i) => (
                  <p key={i} className="text-stone-600 leading-relaxed">
                    {para}
                  </p>
                ))}

                {/* Citation mise en avant */}
                {ch.quote && (
                  <blockquote className="border-l-4 border-[#4a8c3f] pl-5 my-6">
                    <p
                      className="text-lg font-semibold text-[#1a2e1a] italic leading-snug"
                      style={{ fontFamily: 'var(--font-fraunces)' }}
                    >
                      {ch.quote}
                    </p>
                  </blockquote>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────────────── */}
      <section className="bg-[#1a2e1a] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-2xl lg:text-3xl font-semibold text-white mb-4 leading-snug"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Prêt à voir la différence ?
          </p>
          <p className="text-stone-300 leading-relaxed mb-8 max-w-lg mx-auto">
            Un diagnostic gratuit, sans engagement. On regarde votre terrain, on vous explique ce qui bloque — et on vous donne le protocole pour y remédier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="px-6 py-3 rounded-lg bg-[#4a8c3f] hover:bg-[#3a7030] text-white font-medium transition-colors"
            >
              Demander un diagnostic gratuit
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg border border-white/20 text-stone-300 hover:text-white hover:border-white/40 font-medium transition-colors"
            >
              Découvrir Hanami
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

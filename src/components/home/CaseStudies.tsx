/**
 * CaseStudies.tsx — Section "Des résultats, pas des promesses"
 *
 * 3 études de cas réelles de clients Hanami, en layout alterné :
 * - Étude 1 (Susan D.) : visuel interactif avant/après à droite — vraies photos
 * - Étude 2 (Véronique P.) : placeholder à gauche — photo à intégrer plus tard
 * - Étude 3 (Noël P.) : placeholder à droite — photo à intégrer plus tard
 *
 * Sur mobile, les deux colonnes s'empilent (texte au-dessus, visuel en-dessous).
 * Les stats clés sont affichées en grand format Space Mono.
 */

'use client'

import { useFadeIn } from '@/hooks/useFadeIn'
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider'

export default function CaseStudies() {
  const headerRef = useFadeIn()

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* En-tête de section */}
        <div ref={headerRef} className="fade-in mb-16">
          <span className="section-label mb-3 block">Cas clients</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 max-w-xl leading-tight">
            Des résultats, pas des promesses
          </h2>
        </div>

        {/* Liste des études de cas */}
        <div className="flex flex-col gap-20 lg:gap-28">

          {/* ── Étude 1 — Susan D. — avec vraies photos ────────────────── */}
          <CaseStudyRowWithSlider
            index={0}
            name="Susan D."
            tag="Rénovation · 800 m²"
            title="« Un gazon méconnaissable en une saison »"
            body="800 m² au Vésinet envahis de mousse et clairsemés. Diagnostic terrain complet, rénovation avec semences professionnelles auto-régénérantes adaptées aux sous-bois, et fertilisation à libération lente adaptée à chaque saison. Résultat en 6 semaines."
            stats={[
              { value: '800 m²', label: 'rénovés' },
              { value: '6 semaines', label: 'résultat visible' },
              { value: '12 mois', label: 'de suivi' },
            ]}
            // Vraies photos — glisser vers la gauche pour révéler l'après
            beforeSrc="/images/avant-susan.jpg"
            afterSrc="/images/apres-susan.jpg"
            // Alignement vertical : les deux photos ont été prises à des angles
            // légèrement différents. Ces valeurs recadrent chaque photo pour que
            // la ligne des arbres apparaisse au même endroit des deux côtés.
            // avant : ligne des arbres à ~30% du haut → on descend le cadrage (43%)
            // après : ligne des arbres à ~38% du haut → on monte le cadrage (61%)
            beforeObjectPosition="center 43%"
            // 78% : cadrage qui montre bien la marche de l'escalier
            afterObjectPosition="center 88%"
            // Zoom très léger (1.08) ancré très haut (15%) :
            // pousse juste la statue hors du bas du cadre
            // sans toucher à la marche qui reste visible
            afterTransform="scale(1.08)"
            afterTransformOrigin="center 15%"
            reverse={false}
          />

          {/* ── Étude 2 — Véronique P. ──────────────────────────────────── */}
          <CaseStudyRowWithSlider
            index={1}
            name="Véronique P."
            tag="Coaching · 170 m²"
            title="« Je sais enfin quoi faire et quand »"
            body="Gazon jauni en automne faute de lumière, envahi par la mousse et les mauvaises herbes. Hanami nous a guidés pas à pas avec un protocole sur mesure : élimination de la mousse, densification et relance de la croissance. Résultat visible fin décembre — sans tout arracher."
            stats={[
              { value: '170 m²', label: 'redensifiés' },
              { value: 'Déc.', label: 'résultat visible' },
              { value: '2e année', label: 'de coaching' },
            ]}
            beforeSrc="/images/avant-verop.jpg"
            afterSrc="/images/apres-verop.jpg"
            beforeAlt="Gazon avant coaching Hanami — Véronique P."
            afterAlt="Gazon après coaching Hanami — Véronique P."
            // Légère variation de cadrage pour casser l'effet "clone IA" :
            // avant légèrement plus haut (42%), après légèrement plus bas (56%)
            // + avant un poil zoomé à droite pour simuler une prise de vue décalée
            beforeObjectPosition="55% 42%"
            afterObjectPosition="48% 56%"
            reverse={true}
          />

          {/* ── Étude 3 — Noël P. ───────────────────────────────────────── */}
          <CaseStudyRowWithSlider
            index={2}
            name="Noël P."
            tag="Remise en état · 700 m²"
            title="« Les mêmes produits que les stades de foot »"
            body="Notre gazon en rouleaux s'est dégradé très vite faute d'arrosage suffisant. Hanami nous a pris en charge en août pour le remettre en état. Programme annuel avec gestion hydrique optimisée et engrais à libération contrôlée. Même gamme que les terrains de sport professionnels. Je ne pensais pas que c'était rattrapable."
            stats={[
              { value: '700 m²', label: 'remis en état' },
              { value: 'Août', label: 'prise en charge' },
              { value: '100%', label: 'autonome' },
            ]}
            beforeSrc="/images/avant-noel.jpg"
            afterSrc="/images/apres-noel.jpg"
            beforeAlt="Gazon avant remise en état Hanami — Noël P."
            afterAlt="Gazon après remise en état Hanami — Noël P."
            reverse={false}
          />

        </div>
      </div>
    </section>
  )
}

// ── Composant avec le slider avant/après (vraies photos) ──────────────────

function CaseStudyRowWithSlider({
  name, tag, title, body, stats,
  beforeSrc, afterSrc,
  beforeAlt, afterAlt,
  beforeObjectPosition, afterObjectPosition,
  afterTransform, afterTransformOrigin,
  reverse, index,
}: {
  name: string
  tag: string
  title: string
  body: string
  stats: { value: string; label: string }[]
  beforeSrc: string
  afterSrc: string
  // Textes alternatifs pour l'accessibilité (décrire chaque photo)
  beforeAlt?: string
  afterAlt?: string
  // Contrôle quelle partie de chaque photo est affichée (cadrage vertical)
  beforeObjectPosition?: string
  afterObjectPosition?: string
  // Zoom CSS appliqué à la photo après (ex: "scale(1.08)") pour recadrer
  afterTransform?: string
  afterTransformOrigin?: string
  reverse: boolean
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className={`fade-in grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Colonne texte */}
      <CaseStudyText name={name} tag={tag} title={title} body={body} stats={stats} />

      {/* Colonne visuel — slider interactif */}
      <div>
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeAlt={beforeAlt ?? `Gazon avant — ${name}`}
          afterAlt={afterAlt ?? `Gazon après — ${name}`}
          beforeObjectPosition={beforeObjectPosition}
          afterObjectPosition={afterObjectPosition}
          afterTransform={afterTransform}
          afterTransformOrigin={afterTransformOrigin}
        />
        {/* Indication discrète sous le slider */}
        <p className="mt-3 text-center text-xs text-stone-400 font-[family-name:var(--font-space-mono)]">
          Glisser pour comparer
        </p>
      </div>
    </div>
  )
}

// ── Contenu texte partagé entre les études de cas ───────────────────────────

function CaseStudyText({
  name, tag, title, body, stats,
}: {
  name: string
  tag: string
  title: string
  body: string
  stats: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="section-label">{tag}</span>
        <p className="font-semibold text-stone-800 mt-1">{name}</p>
      </div>
      <h3 className="font-[family-name:var(--font-fraunces)] text-2xl lg:text-3xl font-semibold text-hanami-900 leading-snug">
        {title}
      </h3>
      <p className="text-stone-500 leading-relaxed">{body}</p>
      <div className="flex flex-wrap gap-6 pt-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="font-[family-name:var(--font-space-mono)] font-bold text-xl text-hanami-700">
              {stat.value}
            </span>
            <span className="text-stone-500 text-xs uppercase tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

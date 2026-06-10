/**
 * FAQ.tsx — Section "Questions fréquentes"
 *
 * Un accordéon de 8 questions/réponses pour la page Particuliers.
 * Cliquer sur une question l'ouvre et ferme celle qui était ouverte.
 * Une seule question peut être ouverte à la fois.
 *
 * Design : fond stone-50, bordures fines, icône +/- pour indiquer l'état.
 */

'use client'

import { useState } from 'react'
import { useFadeIn } from '@/hooks/useFadeIn'
import { Plus, Minus } from 'lucide-react'
// Questions/réponses partagées avec le JSON-LD FAQPage (généré côté serveur
// dans page.tsx) — source unique : src/lib/faq-data.ts
import { FAQS, type FaqEntry } from '@/lib/faq-data'

export default function FAQ({ items }: { items?: FaqEntry[] }) {
  const faqs = items ?? FAQS
  // Index de la question actuellement ouverte (null = aucune ouverte)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headerRef = useFadeIn()

  // Ouvre la question cliquée, ferme si elle était déjà ouverte
  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* En-tête */}
        <div ref={headerRef} className="fade-in mb-12">
          <span className="section-label mb-3 block">Questions fréquentes</span>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl lg:text-4xl font-semibold text-hanami-900 leading-tight">
            Tout ce que vous vous demandez
          </h2>
        </div>

        {/* Liste accordéon */}
        <div className="divide-y divide-stone-200 border-t border-stone-200">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * FAQItem — Un élément accordéon individuel
 *
 * Props :
 * - isOpen : true si cette question est actuellement ouverte
 * - onToggle : fonction appelée quand on clique sur la question
 */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const ref = useFadeIn()

  return (
    <div
      ref={ref}
      className="fade-in py-5"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Bouton pour ouvrir/fermer */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-stone-800 group-hover:text-hanami-700 transition-colors text-base">
          {question}
        </span>
        {/* Icône + ou − selon l'état */}
        <span className="shrink-0 text-hanami-500">
          {isOpen
            ? <Minus className="w-4 h-4" />
            : <Plus className="w-4 h-4" />
          }
        </span>
      </button>

      {/* Réponse : visible uniquement quand isOpen = true */}
      {isOpen && (
        <p className="mt-4 text-stone-500 leading-relaxed text-sm pr-8">
          {answer}
        </p>
      )}
    </div>
  )
}

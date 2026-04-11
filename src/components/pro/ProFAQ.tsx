/**
 * ProFAQ.tsx — FAQ pour la page Professionnels
 *
 * 4 questions spécifiques aux paysagistes.
 * Même design accordéon que FAQ particuliers : +/- Lucide, une seule
 * question ouverte à la fois, fond stone-50.
 */

'use client'

import { useState } from 'react'
import { useFadeIn } from '@/hooks/useFadeIn'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'Vous êtes concurrents des paysagistes ?',
    answer: 'Non. On ne tond pas, on ne taille pas, on ne fait pas d\'aménagement. On diagnostique et on prescrit. Vous exécutez et vous gardez la relation client. Ce sont deux métiers complémentaires — et plusieurs paysagistes font déjà appel à nous sur leurs chantiers gazon.',
  },
  {
    question: 'Comment ça se passe concrètement ?',
    answer: 'Vous nous envoyez les photos et infos du chantier (surface, type de sol si connu, historique, problème observé). On vous renvoie un protocole précis : produit, dose au m², méthode, timing. Vous appliquez. On reste disponible pour ajuster si besoin.',
  },
  {
    question: 'Ça coûte combien ?',
    answer: 'Le consulting ponctuel se facture au chantier — contact pour un devis en fonction du volume et de la complexité. Le suivi annuel est un abonnement adapté à votre volume de chantiers gazon. Premier échange offert pour évaluer vos besoins et voir si on peut travailler ensemble.',
  },
  {
    question: 'Vous fournissez les produits ?',
    answer: 'On peut, mais ce n\'est pas obligatoire. L\'essentiel, c\'est la méthode et les dosages. Vous utilisez vos fournisseurs habituels avec nos prescriptions. Si vous souhaitez accéder aux gammes pro qu\'on utilise, on peut aussi vous les sourcer.',
  },
]

export default function ProFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headerRef = useFadeIn()

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

        {/* Accordéon */}
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
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-stone-800 group-hover:text-hanami-700 transition-colors text-base">
          {question}
        </span>
        <span className="shrink-0 text-hanami-500">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <p className="mt-4 text-stone-500 leading-relaxed text-sm pr-8">
          {answer}
        </p>
      )}
    </div>
  )
}

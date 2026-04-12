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

// Les 8 questions fréquentes pour la page Particuliers
const faqs = [
  {
    question: 'Combien ça coûte ?',
    answer: 'Le coaching annuel commence à 400€/an — c\'est moins cher qu\'un seul passage de paysagiste. Les rénovations sont sur devis après diagnostic. Le diagnostic initial est offert.',
  },
  {
    question: '400€/an, c\'est rentable ?',
    answer: 'Une rénovation ratée coûte 500 à 1 500€ en semences, engrais et temps perdu. Le coaching vous évite ces erreurs et vous fait économiser sur les produits en vous donnant les bons dosages. Le suivi illimité toute l\'année est inclus.',
  },
  {
    question: 'Les produits professionnels, c\'est trop cher ?',
    answer: 'Les engrais et semences qu\'on vous recommande coûtent moins cher au m² que ce que vous trouvez en jardinerie, pour une efficacité 4 à 5 fois supérieure. Et vous ne les trouverez pas en magasin : ce sont des références réservées aux professionnels du sport et du paysage. Ce qui coûte vraiment cher, c\'est d\'acheter le mauvais produit, de rater son semis, et de recommencer la saison suivante.',
  },
  {
    question: 'Vous intervenez où ?',
    answer: 'En personne en Île-de-France (Le Vésinet et alentours). Le coaching à distance fonctionne partout en France, en Belgique, en Suisse et dans tous les pays francophones — photos, échanges WhatsApp, protocole détaillé.',
  },
  {
    question: 'Je n\'y connais rien en gazon, c\'est un problème ?',
    answer: 'Non. Le protocole Hanami est conçu pour être suivi par n\'importe qui. On vous dit exactement quoi faire, quand, et comment. Pas de jargon, des instructions claires.',
  },
  {
    question: 'J\'ai besoin de quel matériel ?',
    answer: 'Un épandeur basique (30-50€) et un tuyau d\'arrosage. Pour les tondeuses, ce que vous avez suffit — on vous donne juste la bonne hauteur de coupe.',
  },
  {
    question: 'Et si ça ne marche pas ?',
    answer: 'On ajuste votre protocole sans surcoût. Le suivi est continu toute l\'année, on ne vous laisse pas avec un PDF et bonne chance.',
  },
  {
    question: 'Pourquoi pas un paysagiste classique ?',
    answer: 'Un paysagiste entretient votre jardin. Hanami diagnostique et prescrit pour votre gazon spécifiquement. Ce sont deux métiers complémentaires — d\'ailleurs, des paysagistes font appel à nous.',
  },
  {
    question: 'J\'ai déjà un jardinier qui s\'occupe de mon jardin, est-ce compatible ?',
    answer: 'Parfaitement. Hanami ne tond pas, ne taille pas, ne fait pas l\'entretien courant. On diagnostique votre gazon et on écrit le protocole à suivre — quoi appliquer, quand, quelle dose. Votre jardinier l\'applique directement. On peut même lui expliquer si besoin. Deux expertises, pas de doublon, un résultat supérieur.',
  },
  {
    // Question ajoutée pour contrer l'idée reçue sur la rénovation lourde
    question: 'Faut-il obligatoirement retourner le sol avant de rénover son gazon ?',
    answer: 'Non, et c\'est l\'une des idées reçues les plus répandues. Retourner tout le sol est une pratique de maraîchage — pas de gazon. Pour une rénovation de pelouse, Hanami utilise la scarification : on décompacte le sol, on élimine le feutre accumulé, et on prépare la surface pour le sur-semis. Le résultat est identique à une reconstruction complète, en une fraction du temps et du coût. Aucune pelleteuse, aucune semaine de chantier. Votre jardin reste utilisable dans les 48h suivant l\'intervention.',
  },
]

export default function FAQ() {
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

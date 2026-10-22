/**
 * coaching-faq-data.ts — Questions fréquentes spécifiques au coaching (/coaching)
 *
 * Questions DISTINCTES de src/lib/faq-data.ts (home) : chaque page porte ainsi
 * son propre JSON-LD FAQPage légitime, sans balisage dupliqué entre pages.
 * Formulées comme les visiteurs les posent aux moteurs IA (GEO), avec des
 * réponses ancrées dans le contenu de la landing /coaching (CoachingContent,
 * EspaceClientPreview, GuaranteeBlock, services.ts).
 *
 * Même règle que faq-data.ts : tout prix vient de PRICING_DISPLAY — jamais
 * de montant en dur.
 */

import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import type { FaqEntry } from '@/lib/faq-data'
import { SHOP_ENABLED } from '@/lib/site-features'

export const COACHING_FAQS: FaqEntry[] = [
  {
    question: 'Comment fonctionne un coaching gazon à distance ?',
    answer: 'En trois étapes, 100 % en ligne. Vous envoyez quelques photos de votre gazon et répondez à 5 questions ; Hanami diagnostique l\'état réel : sol, feutrage, densité, exposition. Vous recevez ensuite votre protocole — un plan 3D zone par zone et un calendrier 12 mois daté : quoi appliquer, quand, à quelle dose, avec quels produits. Puis vous appliquez et on ajuste ensemble : le suivi est illimité toute l\'année, sans déplacement.',
  },
  {
    question: 'Que contient exactement le protocole Hanami ?',
    answer: 'Un plan 3D de votre jardin zone par zone et un calendrier de 12 mois daté au jour près : chaque intervention à sa date, avec le produit recommandé et la dose exacte calculée sur votre surface réelle. Le protocole est écrit pour votre gazon — surface, sol, exposition, usage — pas une recette générique. Il vit dans votre espace client : vous cochez les étapes au fur et à mesure, et Hanami l\'ajuste si la météo ou votre gazon l\'exigent.',
  },
  {
    question: 'Le coaching Hanami est-il sans engagement ?',
    answer: `La formule mensuelle est sans engagement. Vos deux premiers mois de coaching sont offerts pour découvrir votre protocole et le suivi Hanami. Ensuite, vous choisissez une formule à partir de ${PRICING_DISPLAY.coachingMois} €/mois TTC sans engagement ou à partir de ${PRICING_DISPLAY.coachingAnnuel} €/an TTC en formule annuelle. Les deux mois de démarrage sont offerts dans les deux cas. Le tarif est confirmé avant souscription selon l’accompagnement retenu.`,
  },
  {
    question: 'Comment profiter des deux mois offerts ?',
    answer: 'Pour votre première rénovation, Hanami offre deux mois de coaching à distance : un protocole personnalisé et des conseils pour passer à l’action et observer les premiers résultats. Vous réalisez vous-même les gestes ; les produits sont proposés séparément. L’offre est réservée aux nouveaux abonnés, en formule mensuelle comme annuelle. Envoyez votre demande : Hanami vous répond sous 24 h et confirme avec vous la date de démarrage selon les disponibilités.',
  },
  {
    question: 'Quand commencent les deux mois offerts ?',
    answer: 'Les deux mois offerts commencent à l’envoi du premier protocole personnalisé. Ils s’écoulent en continu à partir de cette date, même si vous tardez à réaliser les actions ou les reportez. Ils ne sont pas décomptés en fonction des interventions effectuées.',
  },
  {
    question: 'Peut-on rénover son gazon à n’importe quelle saison ?',
    answer: 'Non. Le semis et le regarnissage demandent des conditions adaptées, notamment une température du sol et une humidité favorables. Le protocole tient compte de la saison, de la météo et de votre terrain. Si une rénovation n’est pas adaptée au moment du démarrage, il prépare la prochaine fenêtre favorable. La période de deux mois offerts continue de s’écouler dès l’envoi du premier protocole.',
  },
  {
    question: 'Le coaching gazon fonctionne-t-il partout ?',
    answer: 'Oui. Le coaching est 100 % en ligne : il fonctionne partout en France, ainsi qu\'en Belgique, en Suisse et dans les pays francophones. Aucune visite sur place n\'est nécessaire — tout passe par vos photos, votre espace client et les échanges directs avec Hanami.',
  },
  {
    question: 'Où acheter les produits recommandés dans le protocole ?',
    answer: SHOP_ENABLED
      ? 'Les engrais et semences recommandés sont des références réservées aux professionnels du sport et du paysage : vous ne les trouverez pas en jardinerie. Hanami les sélectionne pour vous, avec la dose pré-calculée sur vos m², et vous pouvez les commander directement depuis la boutique de votre espace client, livrés chez vous.'
      : 'Les engrais et semences recommandés sont des références professionnelles du sport et du paysage, indisponibles en jardinerie. Hanami vous conseille sur les références adaptées à votre gazon et la dose calculée sur vos m². Vous pouvez échanger directement avec Hanami pour connaître les possibilités d’approvisionnement et la disponibilité.',
  },
  {
    question: 'Faut-il des connaissances en jardinage pour suivre le coaching ?',
    answer: 'Aucune. Le coaching est pensé zéro jargon : à chaque connexion à votre espace client, vous voyez la prochaine action à faire, le produit recommandé et la dose calculée sur votre surface réelle. Vous cochez chaque étape une fois faite. Et au moindre doute — une dose, une zone qui jaunit — vous posez la question et Hanami adapte le protocole avec vous.',
  },
  {
    question: 'Que se passe-t-il si la météo perturbe le calendrier ?',
    answer: 'Le protocole n\'est pas un PDF figé : si la météo est capricieuse ou que votre gazon réagit autrement que prévu, Hanami ajuste les dates et les interventions avec vous, sans surcoût. Le suivi et les ajustements sont illimités, inclus dans l\'abonnement toute l\'année.',
  },
]

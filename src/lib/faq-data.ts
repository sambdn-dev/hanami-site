/**
 * faq-data.ts — Données des questions fréquentes (page Particuliers)
 *
 * Extraites du composant client FAQ.tsx pour que la page serveur puisse
 * générer le JSON-LD FAQPage (rich snippets Google) à partir de la même
 * source. Modifier ici = le composant ET le schéma restent synchrones.
 */

import { PRICING_DISPLAY } from '@/lib/chantier/pricing'

export interface FaqEntry {
  question: string
  answer: string
}

export const FAQS: FaqEntry[] = [
  {
    question: 'Combien ça coûte ?',
    answer: `Pour commencer à améliorer votre gazon, deux mois de coaching à distance sont offerts, en formule mensuelle comme annuelle. Ils commencent à l’envoi du premier protocole et s’écoulent en continu, même si vous reportez les actions. Vous réalisez les gestes et les produits sont proposés séparément. Ensuite, à partir de ${PRICING_DISPLAY.coachingMois} €/mois TTC sans engagement ou à partir de ${PRICING_DISPLAY.coachingAnnuel} €/an TTC. Votre date de démarrage est confirmée ensemble selon les disponibilités. Les rénovations vont de 6 à 25 €/m² TTC selon l'état du terrain, estimation précise en 2 minutes avec la simulation gratuite.`,
  },
  {
    question: `À partir de ${PRICING_DISPLAY.coachingMois} €/mois, c'est rentable ?`,
    answer: 'Une rénovation ratée coûte 500 à 1 500€ en semences, engrais et temps perdu. Le coaching vous évite ces erreurs et vous fait économiser sur les produits en vous donnant les bons dosages. Le suivi illimité toute l\'année est inclus — c\'est rentabilisé dès le premier achat évité.',
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
    answer: 'On ajuste votre protocole sans surcoût : le suivi est continu toute l’année. Vos deux premiers mois de coaching sont offerts pour découvrir l’accompagnement. Vous pouvez ensuite choisir la formule mensuelle sans engagement ou la formule annuelle.',
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

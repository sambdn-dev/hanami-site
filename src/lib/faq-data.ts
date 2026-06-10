/**
 * faq-data.ts — Données des questions fréquentes (page Particuliers)
 *
 * Extraites du composant client FAQ.tsx pour que la page serveur puisse
 * générer le JSON-LD FAQPage (rich snippets Google) à partir de la même
 * source. Modifier ici = le composant ET le schéma restent synchrones.
 */

export interface FaqEntry {
  question: string
  answer: string
}

export const FAQS: FaqEntry[] = [
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

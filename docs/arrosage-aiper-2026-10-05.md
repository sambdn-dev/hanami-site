# Arrosage Aiper IrriSense 2 — 5 octobre 2026

Branche : `dev/hanami-irrigation-aiper-2026`, issue de la version publique `eaf779c`.
Publication explicitement autorisée par le propriétaire. Aucun changement des offres Hanami Pro ou Studio ; aucun push sur main.

## Contenu livré

- Section dédiée sur l’accueil, les interventions locales et la rénovation express, accessible par `#arrosage-automatique` et les liens de navigation locaux.
- Palette bleu pétrole et bouton terracotta, présentation de la solution, tranquillité, cartographie et programmation des zones, prise en compte de la pluie et accompagnement Hanami.
- Boutons de devis préselectionnant `Aiper IrriSense 2` dans le formulaire local existant ; cette valeur est incluse dans la demande.
- Motion design SVG original : délimitation, programmation, arrosage ciblé, choix de trois zones, pause, reprise, navigation au clavier et respect des mouvements réduits. L’animation ne tourne que lorsqu’elle est visible.

## Réel, illustratif, à confirmer

- Photo officielle Aiper et caractéristiques constructeur vérifiées dans les sources FR/EU : jusqu’à 10 zones, 445 m² et 12 m sous conditions. Voir [les sources](./aiper-irrisense2-sources-2026-10-05.md).
- Le plan animé est fictif et sans échelle. Ce n’est ni l’application Aiper ni une simulation hydraulique ou une installation Hanami photographiée.
- La pression, le débit, les obstacles, les raccordements et le programme doivent être vérifiés sur chaque terrain. La notice européenne prévoit notamment 2 bar et 25 L/min minimum.
- Aucune économie d’eau chiffrée garantie, aucun capteur d’humidité du sol revendiqué, aucun dosage automatique des produits revendiqué.
- La soumission du devis a été simulée sans envoyer d’email. La réception réelle d’un email demeure à confirmer. Les vues mobiles utilisent Chromium, pas un téléphone physique.

## Validation avant publication

- Build Next.js final et TypeScript : succès.
- ESLint des nouveaux composants et des autres éléments locaux modifiés : succès ; `git diff --check` : succès.
- Le lint du formulaire partagé signale un défaut préexistant dans `PhoneField` (`setLocalNumber` synchrone dans un effet), présent dans le commit de base. Aucune erreur nouvelle relevée.
- Rendu ordinateur 1440 px et mobile 390 px contrôlé visuellement ; absence de débordement également à 320 et 1024 px.
- Animation automatique, pause, choix d’étape et de zone, navigation au clavier et préférence de mouvement réduit vérifiés. Pas d’erreur JavaScript relevée.
- Devis : sélection et défilement vers le contact corrects, charge utile et succès vérifiés avec réponse API simulée. La rénovation express permet aussi la sélection Aiper.

La preuve du déploiement, les domaines, le SHA exact et les captures publiques sont consignés hors dépôt dans `/workspace/hanami-review/irrigation/DEPLOYMENT.md`.

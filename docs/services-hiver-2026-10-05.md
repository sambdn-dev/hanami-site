# Services visibles et préparation à l’hiver — 5 octobre 2026

Branche de développement : `dev/hanami-services-hiver-2026`, depuis la version publique `ce715835`.

- Annuaire de sept services tout en haut de l’accueil, des interventions locales et de la rénovation express. L’installation d’arrosage automatique arrive en premier et ouvre directement la section Aiper présente sur la page. Nutrition, diagnostic, interventions, rénovation, coaching et suivi à distance ont chacun une destination réelle.
- Accroche : « Un problème sur votre gazon ? J’ai la solution. »
- Interventions : préparation à l’hiver et à l’été ; mise en avant automnale du froid et du manque de lumière. Motion design nutrition : six chapitres, hiver puis chaleur ; pause, clavier et mouvement réduit conservés.
- Gammes professionnelles non disponibles en jardinerie, coût sensiblement équivalent et comparaison « trois à quatre fois plus qualitatifs » présentée comme appréciation personnelle Hanami, conformément au propos du propriétaire. Ambition : « La qualité des plus beaux terrains de sport et des plus beaux golfs, chez vous. » Aucune mesure scientifique nouvelle de qualité n’est inventée.
- Suppression du module 3D de tondeuse et de son code. Les photographies constructeur EGO et leur galerie restent disponibles.
- L’offre coaching reçoit uniquement une ancre vers son aperçu de suivi à distance. Hanami Pro et Studio restent inchangés ; aucun push sur main.

## Validation

Build Next.js et TypeScript : succès. ESLint ciblé sur tous les composants modifiés : succès. `git diff --check` : succès.

Rendu Chromium ordinateur 1440 px et mobile 390 px contrôlé visuellement. Sept services visibles au premier écran mobile ; pas de débordement à 320, 390, 1024 et 1440 px. Accès direct Aiper sous le bandeau fixe, lien coaching/suivi et ancre de rénovation contrôlés. Chapitre hiver sélectionnable, animations désactivées en mouvement réduit, absence du module 3D et absence d’erreur JavaScript constatées.

La recherche Cobalys et la boutique sont préparées séparément. Le devis et les coûts d’achat privés ne sont pas inclus dans le dépôt ou le site. La première boutique est un brouillon de développement tant que prix de vente et formats ne sont pas définis.

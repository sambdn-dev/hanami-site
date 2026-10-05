# Services visibles et préparation à l’hiver — 5 octobre 2026

Branche de développement : `dev/hanami-services-hiver-2026`, depuis la version publique `ce715835`.

- Menu local recentré sur quatre offres : interventions agronomiques, arrosage intelligent, coaching et boutique. Les autres destinations restent accessibles dans le menu secondaire. Le premier bandeau de sept services a été retiré après retour du propriétaire : il occupait trop de place sur mobile et répétait la navigation sur ordinateur.
- Accroche : « Un problème sur votre gazon ? J’ai la solution. »
- Interventions : préparation à l’hiver et à l’été ; accroche « Le printemps se prépare dès l’automne. » Densification, nutrition, réserves en sucres et reprise printanière sont expliquées. Motion design nutrition : six chapitres, hiver puis chaleur ; pause, clavier et mouvement réduit conservés.
- Gammes professionnelles non disponibles en jardinerie, coût sensiblement équivalent et comparaison « trois à quatre fois plus qualitatifs » présentée comme appréciation personnelle Hanami, conformément au propos du propriétaire. Ambition : « La qualité des plus beaux terrains de sport et des plus beaux golfs, chez vous. » Aucune mesure scientifique nouvelle de qualité n’est inventée.
- Suppression du module 3D de tondeuse et de son code. Les photographies constructeur EGO et leur galerie restent disponibles.
- L’offre coaching reçoit uniquement une ancre vers son aperçu de suivi à distance. Hanami Pro et Studio restent inchangés ; aucun push sur main.

## Validation

Build Next.js et TypeScript : succès. ESLint ciblé sur tous les composants modifiés : succès. `git diff --check` : succès.

Version intégrée : 37 pages générées, dont catalogue, deux fiches, sélection boutique et nouvel article MDX. Journal et titre d’article visibles, tableau GFM rendu, JSON-LD BlogPosting/BreadcrumbList valide ; formulaire de l’article orienté arrosage. Les essais de demande boutique (succès/erreur) sont simulés sans envoyer d’email réel ; l’erreur conserve la sélection.

Rendu Chromium ordinateur et mobile contrôlé visuellement. Le menu local tient sur une ligne à 1100 px ; les quatre offres sont prioritaires dans le panneau mobile. Clavier, fermeture par Escape, retour du focus, liens secondaires et absence de débordement contrôlés. Chapitre automne/hiver sélectionnable, animations désactivées en mouvement réduit, absence du module 3D et absence d’erreur JavaScript constatées.

Une petite annonce boutique dans le hero ouvre le catalogue. Les routes boutique sont intégrées en aperçu : deux références, fiches et sélection avec demande de tarif, sans paiement ni commande ferme. Le devis Cobalys et les coûts d’achat privés restent hors dépôt et hors site. Les prix de vente, formats et modalités logistiques restent à définir.

La tentative de publication de la première variante a été rejetée par le contrôle automatique des autorisations, estimant que l’accord précédent couvrait uniquement la livraison Aiper. Aucun alias public n’a changé. La version corrigée doit être examinée en prévisualisation avant un accord explicite de publication.

Un article compare les solutions Rain Bird enterrées et Aiper de surface, avec sources primaires et liens vers les prestations locales. Le chiffre « 98 % des jardins » demandé initialement n’est pas présenté comme un fait : la source retrouvée porte sur la population sous vigilance canicule, pas les dégâts des jardins. Le bilan climatique officiel 2026 est cité. Le journal est désormais présenté après les offres à domicile, avec deux articles, sans ajouter un autre menu.

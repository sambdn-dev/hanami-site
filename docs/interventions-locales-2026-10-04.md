# Livraison des offres locales — 4 octobre 2026

## Base et autorisation

Base vérifiée : `preview/hanami-da-2026` à `b1aab5b`, qui contient `main` et les derniers travaux avant/après et écologie. Les modifications sont isolées sur `dev/hanami-local-offers-2026`, après la correction mobile `df014d0`.

Le propriétaire a explicitement autorisé la publication en production pendant cette session. Le QR imprimé ouvre `hanami-gazon.fr` : l’accueil présente donc directement les prestations locales. Aucun push sur `main` n’est nécessaire.

## Parcours livré

- Accueil local et route `/interventions-locales` : rénovation express et interventions agronomiques distinctes, trois niveaux de suivi, forfait ou abonnement, passages entre deux semaines et trois mois selon le programme.
- `/renovation-express` : sans retournement du sol, trois raisons expliquées, durée indicative pour 200 m², premier résultat visuel vers trois semaines en conditions favorables, arrosage et option rouleaux.
- Méthode déclarée par le propriétaire : relevé au dixième de mètre carré, doses calculées au gramme, séquences saisonnières parmi 50–60 références, anticipation et correction.
- Cinq scènes animées accessibles : engrais solides, nutrition foliaire, biostimulants, réhumidification, potassium et chaleur. Pause, navigation clavier et réduction du mouvement.
- Climat, semences adaptées, amendements organiques, approche biologique/circulaire sur demande et conseils aux clients autonomes.
- Logos de quatre marques utilisées, photographies constructeur EGO et galerie LM2135E-SP. Étude 3D illustrative chargée seulement sur demande.
- Formulaire avec prestation choisie et source locale, WhatsApp et téléphone directs. Coaching à distance reste disponible sur sa route propre ; Hanami Pro et Studio gardent leurs pages et paramètres par défaut.

## Vérification

- Compilation de production, TypeScript et génération des 32 pages réussis avec `NODE_USE_ENV_PROXY=1 npm run build`.
- ESLint ciblé des composants locaux, nouvelles routes, sitemap, API contact et Footer réussi. Le lint global n’est pas attesté ; un problème préexistant `set-state-in-effect` reste dans PhoneField.
- Chromium sur serveur de développement puis `next start` : absence d’erreur d’hydratation après correction du titre SVG, pas d’image cassée, pas de débordement horizontal à 320, 390, 768 et 1440 px sur les vues contrôlées.
- Choix des chapitres animés, pause, menu mobile/Échap et formulaire express prérempli vérifiés. La barre de contact mobile se masque devant le formulaire.
- Soumission du formulaire simulée dans le navigateur, par interception de `fetch` avant l’envoi : prestation et source correctement transmises, état de succès affiché. Aucun email réel envoyé.
- Routes `/`, `/interventions-locales`, `/renovation-express`, `/coaching`, `/pro` et `/pro/studio` répondent 200 en local.
- Vue 3D WebGL contrôlée sur ordinateur et écran mobile simulé ; fermeture, rotation, zoom et réinitialisation disponibles. Les contrôles ne constituent pas un test sur iPhone physique.

## Réel, illustratif, à confirmer

**Réel :** code, compilation, navigation, photos de Susan identifiées comme chantier réel par le site existant, photos constructeur EGO et logos authentiques. Les pratiques et fréquences sont les déclarations du propriétaire, pas des mesures nouvellement réalisées pendant cette livraison.

**Illustratif ou simulé :** scènes agronomiques sans échelle, diagramme de mesure, couverture d’arrosage théorique `π × 13² ≈ 531 m²`, modèle 3D géométrique aux proportions approximatives, tailles mobiles Chromium et soumission de formulaire interceptée.

**À confirmer :** références PHX/accessoires/pulvérisateur, choix précis des lames et fréquence d’affûtage, tarifs et secteur détaillé, certifications des produits retenus, consommation d’eau réellement observée. La livraison réelle des emails Resend n’a pas été testée ; l’expéditeur existant utilise `onboarding@resend.dev` tant qu’un expéditeur de domaine vérifié n’est pas configuré.

Les formulations ne promettent ni une absence totale d’adventices, ni un résultat universel en trois semaines, ni une réduction chiffrée garantie de l’arrosage. Les sources des assets sont dans `equipment-sources-2026-10-04.md`.

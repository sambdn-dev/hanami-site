# Recette navigateur du simulateur Hanami — 23 octobre 2026

Ces vérifications utilisent un navigateur Chromium local isolé, sans profil ni session du navigateur de Sami. Le connecteur Browser et son outil `js` n'étaient pas disponibles. Aucun appel au fournisseur IA et aucun email réel n'ont été effectués.

## Parcours public réellement rendu

`public-qa.mjs` : page Next locale réelle, 1440×1050, 390×844 mobile tactile et 1024×1366 tactile. `actual-results.json` : pas de débordement horizontal ni d'erreur JavaScript. Configuration absente : message 503 honnête.

`public-interactions.mjs`, trois premiers scénarios : import d'une photo déjà présente dans les assets publics, préparation dans le navigateur, sélection par quatre points, autorisation, clavier/annulation sur ordinateur, tactile sur mobile/iPad. Lorsque le service n’est pas configuré, la photo et la sélection restent locales et le lancement reste désactivé. La photo n'a été transmise à aucun fournisseur.

Captures : `actual-unconfigured-*.png`, `actual-mask-*.png`.

## API simulée — distincte de la génération et de la persistance réelles

Deux derniers scénarios de `public-interactions.mjs` : seule l'API du simulateur est interceptée par le navigateur. États en attente/en cours/terminé et images de recette. Le même asset existant est retourné pour les deux côtés : il ne s'agit pas d'une simulation IA.

Vérifications : double clic → un envoi et un lancement ; rechargement → aucun nouveau lancement ; comparaison au clavier ; contact refusé → aucune réussite affichée ; contact confirmé ; suppression confirmée. Résultats dans `interactions-results.json`. Captures `technical-fixture-result-*.png` marquées explicitement comme recette technique.

## Composant Admin réel dans un banc de test isolé

`admin-harness-entry.tsx` importe le composant TSX et le CSS réels de Hanami Admin, compilés uniquement pour ce banc de test avec esbuild installé hors des dépendances produit. Le serveur `admin-harness-server.mjs` sert ce banc de test sur 127.0.0.1:3238. Aucune route contournant l'authentification n'a été ajoutée au produit.

`admin-component-qa.mjs` : iPad 1024×1366 et mobile 390×844, sélection tactile, confirmations, un seul lancement malgré double clic et rechargement, comparaison clavier, état d'envoi incomplet honnête et lancement indisponible. Pas de débordement ni d'erreur JavaScript. `admin-component-results.json`, captures `technical-admin-*.png` explicitement marquées.

Ce banc de test ne vérifie pas l'authentification, les droits, le stockage Supabase ni l'appel IA réels. Ceux-ci doivent être vérifiés séparément sur une prévisualisation configurée.

## Points remontés

- Origine locale 127.0.0.1 : rejet initial identifié, correction vérifiée le 24 octobre (POST local reçoit le 503 de configuration attendu).
- État public `queued`/`upload` : texte et bouton de lancement corrigés puis vérifiés en navigateur.
- DELETE Admin : confirmation `success:true` ajoutée puis vérifiée avec une réponse HTTP 200 incomplète.

## Recette ciblée après corrections — 24 octobre 2026

`focused-negative-qa.mjs` et `focused-negative-results.json` : cinq scénarios techniques passent.

- Image privée 404 : avertissement compréhensible, actualisation possible, aucun nouvel envoi ni lancement.
- Envoi public incomplet : texte honnête, aucune tentative d'afficher la photo absente et aucun bouton de lancement.
- DELETE retourne HTTP 200 mais `{}` : le résultat public est conservé jusqu'à réception de `{success:true}`.
- Deux onglets initialisent ensemble : Web Locks sérialise les deux requêtes de session ; maximum une requête d'initialisation en vol.
- Même réponse DELETE incomplète dans le composant Admin : le résultat est conservé jusqu'à confirmation explicite.

Les fixtures du parcours public renvoient désormais l'en-tête de liaison de session `x-hanami-simulation-session` (24 caractères hexadécimaux). Les requêtes POST et DELETE sont vérifiées avec cet en-tête. L'interface ne permet pas de lancer une génération tant que la session initiale n'est pas confirmée.

Le contrôle d'origine locale a été corrigé et vérifié par HTTP : une requête POST depuis `http://127.0.0.1:3226` reçoit désormais l'erreur de configuration attendue (503), et non le rejet d'origine (403).

Limite de cette recette : les états du fournisseur, l'authentification et la persistance des scénarios techniques restent simulés dans le navigateur. Les preuves Supabase réelles produites séparément par l'agent principal ne sont pas remplacées par ces tests.

Dernier contrôle après correction de la session : `session-notice-qa.mjs`, `session-notice-results.json`. Sur mobile 390 px, l’avertissement de session non confirmée reste visible après import, tracé et autorisation ; le lancement est désactivé et l’action d’actualisation est disponible. Aucun POST ni appel fournisseur. Capture `actual-mask-phone.png` actualisée.

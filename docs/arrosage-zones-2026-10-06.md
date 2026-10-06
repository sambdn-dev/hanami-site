# Plan d’arrosage interactif

Le plan de la section Aiper présente trois zones de pelouse et une zone de massifs. L’arroseur est placé à la jonction des trois zones de pelouse, au centre de la surface de gazon. Un clic sur le plan ou sur le sélecteur choisit la zone et affiche son arrosage. Les zones du plan sont également accessibles au clavier avec Entrée ou Espace.

Le jet pivote entre deux limites visibles, marque une courte pause à chaque butée et revient en sens inverse. Sa portée suit le contour de la zone choisie. La sélection manuelle suspend le changement automatique d’étape. La pause, le redémarrage et la préférence système pour des animations réduites restent disponibles.

Les boutons de devis utilisent du bleu pétrole sur fond clair et de la sauge sur le panneau sombre. Leur contraste de texte dépasse 7:1, y compris au survol.

## Ce qui est réel et ce qui est illustratif

- Réel : interactions du plan, commandes accessibles, choix des quatre zones et parcours vers le formulaire de devis d’arrosage.
- Illustratif : jardin fictif, courbes du jet, limites et distances en coordonnées SVG. Le plan n’est pas à l’échelle et ne reproduit pas une installation mesurée ou le logiciel Aiper.
- À définir sur place : emplacement de l’appareil, zones utiles, plantes concernées, portée disponible, pression, débit et programmes d’arrosage.

La boutique reste fermée au public. Hanami Pro et Hanami Studio ne sont pas modifiés.

## Validation

- Build de production réussi : compilation, TypeScript et génération des 47 pages.
- Six tests de géométrie passent. Les tests lisent indépendamment les courbes SVG à une résolution supérieure au moteur pour vérifier les impacts, la marge au bord, les exclusions, les butées et la variation de portée.
- Parcours vérifié sous Chromium : clic sur les quatre zones du plan et leurs boutons, Entrée/Espace avec conservation du focus, cycle aller/retour de chaque zone, pause/reprise, redémarrage, arrêt hors écran et préférence pour des animations réduites.
- Affichage vérifié à 1 440 et 1 782 pixels sur ordinateur, ainsi qu’à 390 et 320 pixels en émulation mobile. Les boutons de sélection et les commandes mesurent au moins 44 pixels. À 320 pixels, le sélecteur utilise deux colonnes.
- Le bouton de devis conserve le lien vers le formulaire et présélectionne Aiper IrriSense 2. Aucun formulaire, paiement ou email de test n’a été envoyé.

```sh
npx tsc --outDir /tmp/hanami-irrigation-geometry-tests --rootDir . --strict --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck tests/irrigation/geometry.test.ts
node /tmp/hanami-irrigation-geometry-tests/tests/irrigation/geometry.test.js
```

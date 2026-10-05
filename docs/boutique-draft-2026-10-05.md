# Première boutique Hanami — brouillon du 5 octobre 2026

## Ce qui existe

- `/boutique` : sélection éditoriale Barenbrug PRO OMBRE et PRO 24P.
- `/boutique/barenbrug-pro-ombre` et `/boutique/barenbrug-pro-24p` : fiches avec conseils Hanami.
- `/boutique/selection` : quantités, retrait, conservation locale de la sélection et demande de tarif.
- Formulaire multipart transmis à l’API de contact existante, source `boutique`, type `Produits — demande de tarif`. Aucun paiement et aucune validation de commande.
- Logo Barenbrug existant. Illustrations botaniques originales en SVG, explicitement distinctes des photos de produits ou des conditionnements.

## Données commerciales à compléter

Le catalogue commercial `src/lib/shop-catalog.ts` reste séparé de la calculatrice. Prix de vente TTC, poids et emballage proposés, disponibilité, délai, mode et coût de livraison sont tous à confirmer. Aucun coût d’achat fournisseur n’est présenté au client. Aucun format reconditionné n’est proposé tant qu’il n’est pas défini.

Le catalogue est limité aux deux références demandées. Les descriptifs généraux reposent sur le catalogue technique existant ; les compositions précises, photos de sacs et fiches fabricants sont à compléter avant lancement.

Les pages sont `noindex, nofollow` et portent un bandeau d’aperçu. Elles ne sont pas ajoutées au sitemap. L’API de contact, les pages Hanami Pro et Studio et la navigation partagée sont inchangées.

## Vérifications

ESLint ciblé et TypeScript passent. Build Next.js 16.2.3 complet : 36 pages générées, dont les quatre routes boutique. Le worktree utilise les dépendances du dépôt principal via un lien symbolique ; le build local utilise `npm run build -- --webpack`, car Turbopack refuse les dépendances situées hors de son dossier racine.

Rendu Chromium contrôlé sur ordinateur et mobile. Captures dans `/workspace/hanami-review/boutique/`. La réception réelle des emails n’a pas été testée. Les captures et les essais du formulaire restent des vérifications de développement.

## Lancement ultérieur

Confirmer les données commerciales, l’identité du produit et le conditionnement demandés par le premier client, puis définir le processus d’acceptation manuelle et de paiement. Ne pas présenter une demande de tarif comme une commande ferme. Aucun déploiement en production n’est effectué par ce brouillon.

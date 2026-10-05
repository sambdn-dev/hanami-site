# Boutique Hanami — préparation et fermeture publique

La boutique est temporairement fermée à la demande de Sami. `SHOP_ENABLED` dans `src/lib/site-features.ts` contrôle son ouverture. Les liens du menu, du footer et du hero sont masqués ; les routes `/boutique` et leurs sous-pages redirigent temporairement vers l’accueil. Le layout confirme la fermeture et l’API refuse les anciennes demandes de boutique sans envoyer d’email. Les aperçus boutique du coaching et la promesse de commande de sa FAQ sont également retirés tant que la boutique est fermée.

Le code et les frais locaux sont conservés pour connecter le véritable catalogue Hanami, les formats reconditionnés et le paiement avant une réouverture explicitement décidée.

## Ce qui existe

- `/boutique` : sélection éditoriale Barenbrug PRO OMBRE et PRO 24P.
- `/boutique/barenbrug-pro-ombre` et `/boutique/barenbrug-pro-24p` : fiches avec conseils Hanami.
- `/boutique/selection` : quantités, retrait de produits de la sélection, conservation locale de la sélection et demande de tarif.
- Frais Hanami confirmés par le client : livraison locale **15 € TTC** ; retrait **4 € TTC**. Valeurs centralisées en centimes dans `SHOP_FULFILLMENT_OPTIONS`, visibles au catalogue, sur les fiches et dans la sélection.
- Le formulaire permet de choisir une préférence de livraison locale ou de retrait et transmet son tarif TTC dans le message. La zone desservie, le délai et le créneau restent à confirmer. L’envoi direct fournisseur est un devis distinct.
- Formulaire multipart transmis à l’API de contact existante, source `boutique`, type `Produits — demande de tarif`. Aucun paiement et aucune validation de commande.
- Logo Barenbrug existant. Illustrations botaniques originales en SVG, explicitement distinctes des photos de produits ou des conditionnements.

## Données commerciales à compléter

Le catalogue commercial `src/lib/shop-catalog.ts` reste séparé de la calculatrice. Prix de vente TTC des produits, poids et emballage proposés, disponibilité, délai et conditions d’envoi fournisseur sont à confirmer. Les frais locaux Hanami sont connus ; ils ne définissent ni une zone de livraison nationale ni un tarif de transport fournisseur. Aucun coût d’achat fournisseur n’est présenté au client. Aucun format reconditionné n’est proposé tant qu’il n’est pas défini. Aucun total ne peut être calculé avant de connaître les prix des produits.

Le catalogue est limité aux deux références demandées. Les descriptifs généraux reposent sur le catalogue technique existant ; les compositions précises, photos de sacs et fiches fabricants sont à compléter avant lancement.

Les pages restent `noindex, nofollow` et ne figurent pas au sitemap. Les demandes provenant d’anciennes pages boutique sont refusées avec le statut 503 ; les autres formulaires conservent leur fonctionnement. Hanami Pro et Hanami Studio sont préservés.

## Vérifications

Le brouillon précédent a été vérifié sur ordinateur/mobile, avec des envois simulés. Les nouveaux contrôles de fermeture vérifient les redirections de toutes les routes boutique, l’absence de liens publics et le refus des anciennes demandes sans email.

## Lancement ultérieur

La prochaine boutique utilisera les données commerciales et fiches techniques du back office Hanami. Le catalogue présentera une photo réelle, le nom, l’usage, le format, le prix TTC et le bouton d’ajout au panier. Les fiches réuniront une description courte, quatre avantages vérifiés, les formats disponibles et leur stock.

Un encart de dosage calculera la quantité par application à partir de la surface et des instructions du produit, puis proposera des formats couvrant ce besoin. Les formats reconditionnés permettent d’acheter une quantité adaptée et de varier les références au fil des saisons. Aucun calcul ne doit convertir un volume en poids sans densité connue, ni proposer un format insuffisant pour la dose calculée.

Les formats, tarifs, stocks et lots proviendront du back office. Le paiement en ligne sera ajouté après la connexion du catalogue. La fermeture publique peut être publiée maintenant ; la réouverture du catalogue reste une étape ultérieure.

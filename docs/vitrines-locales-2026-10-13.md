# Vitrines visibles depuis la rue

Ajout d’un accès depuis le hero et de cartes d’adresses avec liens d’itinéraire
Google Maps dans la section des réalisations. Cette section est partagée par
l’accueil, `/interventions-locales` et `/renovation-express`.

Les données publiques sont centralisées dans `src/lib/showcase-gardens.ts`.
Le nombre affiché et la grille suivent les adresses réellement renseignées.

## Adresses réelles

- Vitrine Hanami : **6 route de la Villa Hériot, 78110 Le Vésinet**.
  Adresse donnée par le propriétaire ; orthographe et code postal confirmés par
  la Base Adresse Nationale (résultat exact au numéro 6).
- Chez Susan : **17 avenue de la Prise d’Eau, 78110 Le Vésinet**.
  Source de secours : facture Qonto reçue dans les mails Hanami, avec la même
  adresse pour facturation et livraison. Le nom documentaire est Susan De Graaf.
  Le rapprochement avec la pelouse rénovée repose sur l’identification du client
  par le propriétaire Hanami et sur la réalisation existante « Susan » du site.
- Chez les Auffret : **92 avenue Georges Clemenceau, 78110 Le Vésinet**.
  Nom et adresse communiqués directement par le propriétaire Hanami le
  16 octobre 2026. La troisième vitrine est désormais renseignée sans nouvel
  appel Qonto.

Le site indique que les jardins s’observent depuis la rue, en restant sur l’espace
public. Aucun téléphone, email, montant ou document client n’est publié.

## Vérification

Build Next.js de production et lint ciblé validés. Vérification navigateur effectuée sur
l’accueil et les interventions locales, en 1440 px et 390 px : accès depuis le
hero, adresses, destinations Maps, cibles tactiles, débordement et erreurs JS.
Les quatre parcours passent : destinations Maps exactes, cibles d’au moins 44 px,
aucun débordement horizontal ni erreur JavaScript. Les captures ordinateur/mobile
sont inspectées. Les visites de test n’alimentent pas les analytics réels.

Branche de développement dédiée, créée à partir de la production `112184e`.
La correction analytics en attente sur une autre branche n’est pas incluse.

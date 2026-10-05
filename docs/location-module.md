# Module Location Hanami

Le module est développé sur `dev/hanami-location-2026`. Il comprend le catalogue de six équipements, leurs fiches, les formules 24 h / 48 h / week-end, un pack regarnissage modulable et un parcours de demande de réservation. La boutique reste fermée par défaut : l’intégration du catalogue commercial et l’ouverture au public sont des étapes distinctes.

## État actuel

- Les équipements et les accessoires annoncés viennent de la liste fournie par Hanami.
- Les tarifs, les quantités physiques, le calendrier réel, les horaires du week-end et les frais propres à la location sont **à renseigner**.
- Une information non renseignée reste « À confirmer ». Elle ne devient ni un prix nul ni une disponibilité annoncée.
- Les visuels sont désormais des photos officielles de produits, provenant de Ryobi, Gardena et du représentant Landzie UK/Europe. Voir [location-assets.md](./location-assets.md) pour les sources et les références à confirmer.
- La transmission de la demande utilise Resend. Les tests automatisés simulent ce transport : ils n’envoient aucun e-mail et ne prouvent pas la réception dans la boîte Hanami.
- Aucune demande ne bloque du stock, ne confirme une location ou ne déclenche un paiement.

## Vérifier la version locale sans ouvrir la boutique publique

`src/lib/site-features.ts` active la boutique uniquement lorsque `NEXT_PUBLIC_SHOP_ENABLED` vaut exactement `true`. Sans cette valeur, les routes `/boutique/*` redirigent vers l’accueil et les API de location répondent que la boutique est fermée.

Pour une prévisualisation locale explicite et séparée des autres builds :

```sh
NEXT_PUBLIC_SHOP_ENABLED=true HANAMI_DEV_DIST_DIR=.next-location-preview npm run dev -- --port 3012
```

Ouvrir ensuite `http://localhost:3012/boutique/location`. `HANAMI_DEV_DIST_DIR` isole les fichiers Next.js de cet aperçu. L’indicateur de développement est également masqué dans cette instance. Le flag public doit être défini avant de démarrer ou de construire l’application ; le changer demande un redémarrage ou un nouveau build.

Le lancement d’un aperçu local n’active pas la boutique sur `hanami-gazon.fr`. Ne pas ajouter le flag à la configuration de production dans le cadre d’une simple vérification.

## Catalogue, tarifs et parc matériel

Le catalogue se trouve dans `src/lib/rentals/catalog.ts`. Les exports et les types utilisés par les fiches, le configurateur et les API sont regroupés dans `src/lib/rentals/index.ts`.

Chaque `RentalProduct` possède :

| Champ | Configuration |
| --- | --- |
| `ratesTtcCents` | Un montant TTC en **centimes** pour chacune des clés `24h`, `48h`, `weekend`. `null` signifie « tarif à confirmer ». Par exemple, `2500` représente 25,00 € TTC ; cet exemple n’est pas un tarif Hanami. |
| `units` | Nombre entier d’exemplaires réellement louables. `null` signifie que le parc est à confirmer. `0` indique qu’aucun exemplaire n’est disponible. |
| `calendarConfigured` | Passer à `true` uniquement lorsque le calendrier est complet et maintenu. Renseigner un nombre d’exemplaires sans calendrier complet ne permet pas d’annoncer une disponibilité. |
| `blockedPeriods` | Périodes où les exemplaires sont déjà occupés ou indisponibles, avec `startISO`, `endISO` et éventuellement `units`. |

Renseigner la configuration **pour chaque produit**, sans modifier ses identifiants utilisés par les liens et le pack. Les valeurs actuelles restent nulles et les calendriers désactivés.

Les périodes utilisent des instants ISO avec un décalage explicite : `Z`, `+01:00` ou `+02:00`, par exemple. Une date sans fuseau n’est pas un instant fiable pour le planning.

Exemple de période fictive, à remplacer par une indisponibilité réelle :

```ts
blockedPeriods: [
  {
    startISO: "2027-04-09T16:00:00Z",
    endISO: "2027-04-11T16:00:00Z",
    units: 1,
  },
]
```

`units` vaut 1 lorsqu’il est omis dans une période. La fin est exclusive : un exemplaire rendu à 10 h peut être disponible pour une autre location commençant à 10 h. Si un temps de contrôle, de nettoyage ou de recharge est nécessaire, l’inclure dans la période d’indisponibilité. Le calcul vérifie l’occupation maximale simultanée ; plusieurs périodes successives ne sont pas additionnées comme si elles se chevauchaient.

Une période invalide, un stock inconnu ou un calendrier incomplet produit une disponibilité inconnue. Un pack est annoncé disponible seulement si **tous** ses équipements le sont sur le même intervalle.

## Formules et horaires

Les réglages communs se trouvent dans `src/lib/rentals/config.ts`.

- `24h` et `48h` correspondent à 24 ou 48 heures écoulées exactes depuis le départ. Le retour peut donc changer d’heure locale lors d’un changement d’heure saisonnier.
- La saisie et les libellés utilisent `Europe/Paris`, indépendamment du fuseau de l’appareil du client.
- Une heure qui n’existe pas au passage à l’heure d’été ou qui se répète au passage à l’heure d’hiver est refusée, avec une explication.
- `weekendRule: null` laisse le retour et la disponibilité à confirmer avec Hanami. Le client peut transmettre une demande, mais aucun total final n’est annoncé.

Une règle de week-end se configure seulement après accord sur les horaires. Exemple de structure **illustratif, non activé** :

```ts
weekendRule: {
  startWeekday: 5, // dimanche = 0, vendredi = 5
  startTime: "18:00",
  endWeekday: 1,
  endTime: "09:00",
}
```

Lorsqu’une règle est configurée, la date de départ doit respecter son jour et son heure. La date de retour est calculée selon l’heure locale, y compris lors des changements d’heure.

## Frais et pack regarnissage

`fulfillmentFeesTtcCents` contient les clés `pickup`, `delivery` et `to-confirm`. Les trois valeurs restent nulles jusqu’à la définition des modalités de location.

Les prix de **vente** évoqués auparavant — livraison à 15 € TTC et retrait à 4 € TTC — ne définissent pas les frais d’une location, notamment son retour, sa reprise ou un éventuel second trajet. Ils ne sont pas appliqués automatiquement au module.

Le total comprend les tarifs de tous les équipements et les frais de remise configurés. Un seul montant inconnu laisse le total à confirmer. Un montant explicitement configuré à `0` est reconnu comme gratuit ; il ne doit pas remplacer une valeur inconnue.

Le pack combine le Landzie Overseeding Tool, un épandeur Ryobi à main, Gardena L **ou** Gardena XL, et les options Compost Spreader / scarificateur. Les tarifs des équipements sélectionnés sont additionnés ; aucune remise n’est inventée. Semences, engrais et terreau restent des consommables distincts de la location.

## Demande de réservation et notification

- `GET /api/location/disponibilites` recalcule la période, les tarifs et la disponibilité sur le serveur. La réponse n’est pas mise en cache.
- `POST /api/location/reservations` valide les coordonnées, l’accord de contact, la sélection et les dates, puis refait le calcul serveur. Un montant ou une date de retour transmis par le navigateur ne fait pas autorité.
- Une indisponibilité connue refuse la demande. Une disponibilité inconnue autorise une **demande à confirmer**, sans transformer cette demande en réservation ferme.
- La réponse `201` avec `status: request_received` et une référence `LOC-…` signifie que le service de notification a accepté l’envoi. Elle ne garantit pas la réception finale de l’e-mail, ne bloque aucun équipement et ne constitue pas une confirmation de location.
- Un échec d’envoi produit une erreur, sans référence de succès client. Les informations restent disponibles pour que le client réessaie ou contacte Hanami.

`src/lib/rental-request.ts` porte la validation et accepte un transport injectable pour les tests. La route utilise le SDK Resend et les variables serveur `RESEND_API_KEY`, `CONTACT_EMAIL` et, si défini, `RESEND_FROM_EMAIL`. Aucune clé ne doit être exposée dans une variable `NEXT_PUBLIC_*`.

Le module ne possède actuellement ni base de réservations, ni verrou de stock, ni règlement, ni confirmation automatique. Hanami doit confirmer manuellement les dates, le matériel, le prix et les conditions après réception de la demande.

## Vérifications automatisées

Les **22 tests** couvrent 19 scénarios de calcul et 3 scénarios de demande :

- dates, changements d’heure, week-end, sélections invalides ;
- chevauchements, quantités simultanées, limites exclusives et disponibilité du pack ;
- prix, frais inconnus et totaux ;
- validation serveur, absence de confiance dans les montants du client, transport simulé et échecs d’envoi.

Exécution sans framework supplémentaire :

```sh
npx tsc --outDir /tmp/hanami-rental-tests --rootDir . --strict --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck tests/rentals/engine.test.ts tests/rentals/request.test.ts
node /tmp/hanami-rental-tests/tests/rentals/engine.test.js
node /tmp/hanami-rental-tests/tests/rentals/request.test.js
```

Les tarifs et disponibilités des fixtures de test sont fictifs et ne sont pas importés par l’interface. Ces tests ne transmettent aucune demande réelle et n’évaluent pas la délivrabilité de Resend. Les vérifications du build et du parcours ordinateur/mobile complètent ces tests ; elles doivent être consignées lors de la livraison.

## À confirmer avant l’ouverture commerciale

- Références physiques exactes, état et nombre d’exemplaires de chaque équipement ; dimensions du Landzie Compost Spreader ; références des appareils Ryobi et Gardena, batteries et chargeur inclus.
- Tarifs, horaires de départ et de retour, périmètre de livraison, reprise et temps de remise en état.
- Caution, conditions de location, responsabilité, annulation, retard, nettoyage et procédure de contrôle du matériel.
- Photos du matériel réellement détenu, ou droits d’utilisation de photos fabricant.
- Réception réelle des notifications et méthode de suivi manuel des demandes.

L’intégration future au back-office Hanami doit devenir la source de référence pour les tarifs, les exemplaires, les indisponibilités et les demandes. Une réservation ferme demandera en plus un stockage durable et une opération atomique de réservation des exemplaires pour empêcher les doubles réservations. Le paiement et la gestion de la caution sont à intégrer après définition des règles commerciales. L’ouverture publique reste une décision séparée de cette prévisualisation.

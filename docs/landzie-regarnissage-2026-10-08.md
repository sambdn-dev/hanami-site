# Regarnissage ciblé — Landzie Overseeding Tool

Section ajoutée à `/renovation-express`, après la présentation du protocole. Travail réalisé sur `dev/hanami-landzie-regarnissage-2026`, à partir de la version publiée `6aad7812306bc857d21561d017a83049c2e4e759`.

## Ce qui est réel

- Deux photographies fabricant déjà validées dans `docs/location-assets.md` : `landzie-overseeder-detail.webp` et `landzie-overseeder.webp`. Il s’agit des vues du catalogue, pas de photographies générées ni du parc matériel Hanami.
- Les disques étoilés, le cadre en acier, l’axe et le manche correspondent au produit photographié.
- La préparation superficielle et le regarnissage des zones faibles sont décrits par le fabricant. L’application du mélange de semences est présentée dans une étape distincte : aucun réservoir ou distributeur n’a été ajouté à l’outil.
- Landzie est une marque américaine avec un réseau de distribution britannique et européen. Le site ne revendique pas une fabrication britannique.

Sources consultées le 8 octobre 2026 :

- [Garden Imports UK — fiche et photos](https://www.gardenimports.co.uk/product/landzie-overseeder-tool/)
- [Landzie — fiche officielle Overseeder Tool Scratch & Dent](https://landzie.com/product/landzie-overseeder-tool-scratch-dent/), dont le fonctionnement est décrit comme identique à celui des unités neuves.
- [Garden Imports UK — représentation britannique et européenne](https://www.gardenimports.co.uk/)

La pièce jointe transmise dans la discussion montre un autre angle de la tête. Son fichier exact n’a pas été récupéré ; les deux photographies officielles déjà disponibles sont utilisées. Les URL candidates américaines ont répondu 403 et n’ont pas été contournées.

## Ce qui est illustratif

La vue WebGL est une reconstruction visuelle réalisée à partir des photos, avec des proportions indicatives. Ce n’est pas un modèle CAD fabricant. Après la dernière correction du propriétaire, la géométrie complète de la première version est rétablie : rouleau à disques étoilés minces, cadre arrondi, visserie, manche et poignée. Le vert reste foncé (`#003f20`). Le cadrage initial vise les disques avec un rapprochement modéré (distance de référence 8,5 au lieu de 9). Les sélecteurs de châssis et de manche restent supprimés ; la 3D est affichée par défaut et conserve rotation et zoom.

Le schéma animé montre la préparation de micro-poches, l’ajout des graines puis leur installation entre les zones de gazon sain. Les étapes sont accélérées et sans échelle ; la légende précise que la levée prend plusieurs jours et dépend des conditions.

## Mesures communiquées par Hanami

Le propriétaire a confirmé que les valeurs d’environ 98 % avec le protocole et 25 % sans suivi du protocole viennent de « Mesures Hanami ». La section les attribue explicitement à des mesures internes. Elles concernent le protocole complet et ne sont présentées ni comme une moyenne générale, ni comme une garantie, ni comme un résultat imputable au seul outil.

Pour documenter les essais, il reste à consigner le nombre de zones, le lot et le mélange de graines, la méthode de comptage, les dates, la durée d’observation, les conditions de sol et d’arrosage ainsi que la définition du groupe comparé. Aucun de ces détails n’a été inventé. Les conditions de réussite sont indiquées dans la section : sol, semences, météo et arrosage.

## Vérifications

- Build Next.js de production : compilation, TypeScript et génération des 47 pages réussis.
- ESLint ciblé sur les composants et le modèle.
- Rendu navigateur à 1440, 768, 390 et 320 px : pas de débordement horizontal, images chargées, titres sans italique et commandes tactiles d’au moins 44 px.
- Choix des deux photos, suppression des sélecteurs de pièces, trois étapes du semis, lecture automatique, pause, reprise et respect du mouvement réduit vérifiés.
- Vue 3D affichée par défaut dès que la section approche de l’écran, rotation manuelle et clavier, zoom et réinitialisation vérifiés. Le rendu s’arrête hors écran et la scène libère ses ressources à la fermeture.
- Repli vers les photographies prévu lorsque WebGL est indisponible ; les photographies restent accessibles sous la vue 3D et deviennent le repli automatique si WebGL est indisponible.
- Le bouton de contact rejoint le formulaire existant, sans soumission d’essai ni message externe.

Les captures et les relevés détaillés se trouvent dans `/workspace/hanami-review/landzie-animation/` et `/workspace/hanami-review/overseeding/model/`.

Cette livraison prépare un aperçu de développement. Elle ne modifie pas `main`, Hanami Pro, Hanami Studio, l’état désactivé de la boutique ou les connexions de l’espace client.

## Logo et simplification demandée

Le vrai logo Landzie est affiché à partir de la photographie officielle locale, avec un cadrage CSS redressé sur la marque imprimée sur le produit. Aucun logo typographique inventé ni image générée n’est utilisé. La version autonome trouvée dans une notice (`https://manuals.plus/wp-content/uploads/2022/03/LANDZIE-logo.png`) n’a pas pu être téléchargée ; le fichier local reste la source fiable. Les disques restent métalliques, comme sur la photo ; le châssis, le manche et l’axe reprennent le vert foncé. Le rouleau complet de la géométrie initiale est rétabli. Le même logo photographié est également appliqué en texture transparente sur le cadre, avec son symbole et ses rayons : aucun remplacement par une police générique. Son chargement provoque un rafraîchissement unique même si la rotation est en pause ou le mouvement réduit activé.

La validation de cette simplification est consignée dans `/workspace/hanami-review/landzie-discs/` : affichage 3D sans clic, logo et images chargés, contrôles clavier/tactiles, repli WebGL et absence de débordement à 1440, 390 et 320 px.

## Rétablissement du modèle initial

Le propriétaire préfère la fidélité de la première géométrie au tronçon isolé. La géométrie du commit `651ccde` est reprise, avec un zoom initial modéré sur la tête, la couleur foncée et le logo réel. La vue reste une reconstruction illustrative, pas un fichier CAD certifié. Validation et captures de cette correction : `/workspace/hanami-review/landzie-restored/`.

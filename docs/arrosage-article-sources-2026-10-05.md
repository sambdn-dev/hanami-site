# Article sur l'arrosage automatique — vérifications du 5 octobre 2026

Article : `content/blog/2026-10-arrosage-automatique-intelligent.mdx`
URL prévue : `/blog/arrosage-automatique-intelligent-rain-bird-aiper`
Auteur : Sami Bouden (orthographe confirmée dans les mentions légales du site).

## Sources primaires consultées

- **Météo-France**, bilan climatique de l'été 2026, publié le 3 septembre 2026 : https://meteofrance.com/presse/bilan-climatique-de-lete-2026-juin-juillet-aout . Page ouverte intégralement via l'outil de recherche web. Le bilan confirme l'été le plus chaud depuis 1900, 53 jours en vagues de chaleur, un déficit de pluie proche de 40 % et une sécheresse des sols historique. Il ne mesure pas un pourcentage de jardins endommagés.
- **Iowa State University**, Summer Dormancy in Cool-Season Lawns, dernière révision juillet 2026 : https://yardandgarden.extension.iastate.edu/how-to/summer-dormancy-cool-season-lawns . Page ouverte intégralement. Dormance différente de mortalité ; risque accru en sécheresse prolongée, particulièrement sur les jeunes gazons. Aucun dosage d'arrosage propre au climat de l'Iowa n'est transposé au jardin français.
- **Rain Bird**, programmateurs ESP-TM2 : https://www.rainbird.com/fr/products/programmateurs-de-la-serie-esp-tm2 . Page ouverte et passages sur les accessoires consultés. Module Wi-Fi LNK2 vendu séparément ; ajustements météo possibles avec le module ; sonde pluviomètre compatible, accessoires WR2 / RSD listés. L'article ne prétend pas que tous les produits Rain Bird embarquent ces accessoires.
- **Rain Bird**, contrôle LNK2 : https://www.rainbird.com/fr/products/controle-ameliore-lnk2 . Contrôle à distance, partage d'accès et conditions réseau ; routeur 2,4 GHz. Pas de pourcentage d'économie repris.
- **Rain Bird**, série 3500 : https://www.rainbird.com/fr/products/serie-3500 . Résultat primaire retrouvé pour les arroseurs à turbine résidentiels. Les pages françaises génériques guessed `arroseurs-a-turbine-de-la-serie-3500` et `tuyeres-de-la-serie-1800` ont échoué à l'ouverture : elles ne sont pas citées dans l'article.
- **Aiper France**, IrriSense 2 : https://aiper.com/fr/aiper-irrisense2 . Page ouverte intégralement, passages zones / couverture / météo consultés. Jusqu'à 10 zones avec programmes individuels, 445 m², portée maximale 12 m. Conditions et limites conservées.
- **Notice EU Aiper** : https://d2nlktou7mpud6.cloudfront.net/20260409/41a515f56cf84cf3bd8ea2d712654af8.pdf . Source déjà vérifiée dans `docs/aiper-irrisense2-sources-2026-10-05.md` : 2 bar, 25 L/min, tuyau >= 19 mm et < 15 m ; secteur ; Wi-Fi 2,4 GHz pour fonctions via Internet ; capteur de pluie, pas de sonde d'humidité du sol annoncée.
- **VigiEau**, service public : https://vigieau.gouv.fr/ . Page ouverte. Renvoi à la consultation des restrictions par adresse ; aucune règle d'un département précis n'est inventée.
- **University of Minnesota**, calendrier d'entretien : https://extension.umn.edu/garden-and-home/yard-and-garden/lawns-and-landscapes-in-minnesota/lawn-care-calendar . Résultat primaire consulté : reprise de croissance des graminées de saison fraîche à l'automne et stockage de réserves avant l'hiver. L'article ne reprend pas de dates locales ou de recommandation chiffrée américaine.

## Chiffre « 98 % des jardins » non confirmé

Recherche ciblée `"2026" "98%" jardins canicule` et recherche primaire Météo-France effectuées. **Aucune source retrouvée pour des dommages sur 98 % des jardins français.** Le chiffre voisin identifié concerne **98 % de la population soumise à une vigilance orange ou rouge** dans le bulletin national de Santé publique France du 16 juillet 2026 : https://invs.santepubliquefrance.fr/index.php/climat/fortes-chaleurs-canicule/bulletin-national/canicule-et-sante-en-france-bulletin-du-16-juillet-2026 . Il ne peut être converti en taux de jardins abîmés.

Le chiffre n'apparaît donc ni dans l'article, ni dans l'extrait, ni dans son titre. Le contexte de canicule 2026 repose sur le bilan officiel publié, sans inventer un inventaire national des dégâts de pelouses.

## Réel, illustration, à confirmer

- **Réel et sourcé** : contexte climatique 2026, fonctions des équipements précis, limites et conditions de connexion / hydraulique.
- **Déclaré par Hanami** : proposition d'installation Rain Bird ou Aiper, étude / installation / réglages définis au devis, accompagnement agronomique. Aucune réalisation spécifique, certification partenaire, installation déjà livrée ou mesure d'économie Hanami n'est inventée.
- **Illustration** : couverture constructeur officielle Aiper déjà disponible localement ; la légende publique la distingue d'un chantier Hanami.
- **À confirmer pour chaque projet** : modèle et accessoires retenus, prix et contenu du devis, pression / débit mesurés, couverture réelle, accès électrique et réseau, préparation au gel et calendrier agronomique.
- **Aucun coût fournisseur, prix privé ou inventaire Cobalys** repris dans le contenu public.

## Vérification technique

Format MDX conforme aux articles existants et au parseur `src/lib/blog.ts` : frontmatter YAML, titres h2/h3, tableau GFM, liens Markdown. AGENTS.md et guide MDX installé de Next.js lus avant rédaction. Le build et le rendu final sont vérifiés par l'agent intégrateur.

# Visuels du matériel proposé à la location

Vérification du 5 octobre 2026, sur la branche de développement `dev/hanami-photos-moustiques-2026`.

## Photos réelles récupérées

Les trois fichiers suivants sont des photographies produit provenant du catalogue Landzie diffusé par Garden Imports UK. Ce distributeur se présente sur son site comme le représentant exclusif Landzie au Royaume-Uni et en Europe : https://www.gardenimports.co.uk/.

| Fichier local | Source de l’image | Fiche de provenance | Dimensions et poids |
| --- | --- | --- | --- |
| `public/images/location/landzie-overseeder.webp` | https://www.gardenimports.co.uk/wp-content/uploads/2026/03/landzie-soil-aerator-hero.jpg | https://www.gardenimports.co.uk/product/landzie-overseeder-tool/ | Source 2000 × 2000 ; WebP 1400 × 1400, 28 698 octets. |
| `public/images/location/landzie-overseeder-detail.webp` | https://www.gardenimports.co.uk/wp-content/uploads/2026/03/landzie-soil-aerator-details-front-side.jpg | https://www.gardenimports.co.uk/product/landzie-overseeder-tool/ | Source 2000 × 2000 ; WebP 1400 × 1400, 104 228 octets. |
| `public/images/location/landzie-compost-spreader.webp` | https://www.gardenimports.co.uk/wp-content/uploads/2026/01/24-inch-spreader-studio-14-2000x2000-1.webp | https://www.gardenimports.co.uk/product/landzie-compost-peat-moss-spreader-24/ | Source 2000 × 2000 ; WebP 1400 × 1400, 125 756 octets. |

Téléchargement du 5 octobre 2026 : les trois URLs image ont répondu HTTP 200. Les images ont été ouvertes et inspectées visuellement : deux vues studio complètes sur fond blanc et une vue détaillée des roues à pointes de l’Overseeder. La transformation consiste uniquement en un redimensionnement proportionnel et une compression WebP ; aucune forme, marque, pièce ou accessoire n’a été inventé ou modifié.

La photo du Compost Spreader représente le modèle fabricant 24 pouces. La taille du modèle effectivement détenu par Hanami reste à confirmer : la fiche Hanami ne doit pas attribuer cette dimension au matériel disponible sur la seule base du visuel.

## Recherche initiale sur le site américain

| Matériel | Source officielle | Résultat de la consultation |
| --- | --- | --- |
| Landzie Overseeding Tool | https://landzie.com/product/landzie-overseeder-tool/ | HTTP 403, en-tête `cf-mitigated: challenge`, page intitulée « Landzie security check ». Aucune photo téléchargée. |
| Landzie Compost Spreader | https://landzie.com/product/landzie-compost-spreader/ | HTTP 403 lors de la consultation. Aucune photo téléchargée. La taille du modèle détenu par Hanami reste à confirmer. |

La consultation utilise le proxy et la vérification TLS de l’environnement. Le contrôle d’accès du site américain n’a pas été contourné. Les photographies ont été trouvées sur les pages et URLs publiques normales du représentant européen, consultables sans authentification.

## Matériel dont la référence exacte est attendue

- Épandeur Ryobi sur batterie : référence du matériel, références des batteries et du chargeur à confirmer. Le contenu annoncé par le propriétaire est l’épandeur, deux batteries supplémentaires et un chargeur ; aucune autonomie, capacité de batterie ou compatibilité supplémentaire n’est déduite.
- Gardena L et XL : le propriétaire confirme posséder les deux. Le L épand en ligne, le XL par rotation.
- Scarificateur Ryobi : référence exacte et alimentation à confirmer.

Les modèles photographiés sont indiqués dans les descriptions. Les références Ryobi correspondent aux types précisés par le propriétaire, mais leur étiquette physique et leurs accessoires exacts restent à confirmer.

## Présentation et provenance

Les photos Landzie sont des vues fabricant du produit, pas des photographies du parc physique Hanami. Elles ne doivent pas servir à attester l’état, les dimensions, les stocks ou les accessoires du matériel loué. Le choix de photographies fabricant a été demandé par le propriétaire de Hanami.

La provenance est consignée ici. Les photos produit sont intégrées à la demande du propriétaire de Hanami et identifiées comme visuels fabricants.

Des photos originales du parc Hanami pourront ensuite remplacer ces vues et montrer l’état réel des appareils. Toute nouvelle photographie doit être inspectée et son rendu vérifié dans les cartes et fiches sur ordinateur et mobile.

## État réel / à confirmer

- Réel : la liste des six matériels a été fournie par le propriétaire de Hanami ; l’accessoire Ryobi est annoncé avec deux batteries supplémentaires et un chargeur.
- Réel : les trois photographies Landzie ci-dessus proviennent des fiches du représentant européen et ont été inspectées visuellement.
- À confirmer : références exactes Ryobi/Gardena, taille du Compost Spreader, quantités physiques disponibles et caractéristiques techniques du parc Hanami.

Aucune publication en production n’est réalisée dans le cadre de la collecte d’assets.

## Photos officielles Ryobi et Gardena

Les images suivantes viennent des CDN liés par les fiches officielles françaises, ont été téléchargées le 5 octobre 2026 puis inspectées. Compression WebP uniquement, proportions et transparence conservées.

## Assets utilisables

| Fichier public | Modèle photographié | Dimensions | Taille | Fond / remarques |
|---|---|---|---|---|
| `/images/location/ryobi-oss1800.webp` | Ryobi OSS1800 | 1200 × 1200 | 80 336 octets | Blanc opaque ; logo ONE+ déjà présent dans le packshot constructeur |
| `/images/location/ryobi-scarificateur.webp` | Ryobi RY18SFX35A-0 | 1200 × 1200 | 72 962 octets | Transparent ; logo ONE+ constructeur |
| `/images/location/gardena-l.webp` | Gardena L, fiche 432-88 / 432-20 | 674 × 1200 | 47 236 octets | Transparent ; épandeur en ligne |
| `/images/location/gardena-xl.webp` | Gardena XL 436-20 | 667 × 1200 | 66 934 octets | Transparent ; épandeur rotatif |

Pour les cartes et fiches, utiliser `object-fit: contain` afin de conserver le matériel complet. Les images Gardena sont portrait et ne doivent pas être remplies par un `cover` qui tronquerait le guidon.

## Provenance précise

### Ryobi OSS1800

- [Fiche officielle française](https://fr.ryobitools.eu/outils-de-jardin/entretien-des-sols-et-des-plantes/epandeurs-a-main/oss1800/oss1800/)
- Photo : `https://static.ryobitools.eu/remote.axd/ryobi-media-images.s3.amazonaws.com/hi/OSS1800--Hero_1.jpg?v=B2B68D0CDD1F857D91B1063DBD027C9A&width=1200`
- Alt conseillé : « Photo fabricant de l’épandeur à main Ryobi OSS1800 ».
- La fiche fabricant présente l’appareil nu sans batterie et chargeur ; Hanami a déclaré une location avec deux batteries supplémentaires et un chargeur. Ce contenu Hanami ne découle pas de la photo et doit rester textuel. Le client a confirmé un épandeur à main Ryobi ; la référence OSS1800 reste le candidat photographié, sans affirmation que l’étiquette de son appareil a été vérifiée.

### Scarificateur Ryobi RY18SFX35A-0

- [Fiche officielle française](https://fr.ryobitools.eu/outils-de-jardin/entretien-de-la-pelouse/scarificateur/ry18sfx35a/ry18sfx35a-0/)
- Photo : `https://static.ryobitools.eu/remote.axd/ryobi-media-images.s3.amazonaws.com/hi/RY18SFX35A-0--Hero_1.png?v=1069D4F5ADAC658DEC7B78340DF8B1A7&width=1200`
- Alt conseillé : « Photo fabricant du scarificateur Ryobi RY18SFX35A-0 ».
- Le modèle photographié est alimenté simultanément par deux batteries 18 V, soit 36 V ensemble. Cela concorde avec le souvenir « Ryobi 36 V, je crois », mais la référence physique et les accessoires réels Hanami restent à confirmer. Ne pas en déduire une autonomie ou un nombre de batteries inclus dans cette location.

### Gardena L

- [Fiche officielle française](https://www.gardena.com/fr/outils-jardin/entretien-pelouses/epandeurs/epandeur-a-engrais-l-sur-roues/970630901.html)
- Photo : `https://media.husqvarnagroup.com/image/GA310-0604.png?optimize=low&format=webply&height=1200&width=1200&fit=bounds`
- Alt conseillé : « Photo fabricant de l’épandeur Gardena L sur roues ».
- La fiche précise 432-88 / 432-20. Le client a confirmé posséder un modèle L et un XL. Le L est un épandeur **en ligne**, largeur fabricant 0,45 m, et ne doit pas être intitulé rotatif. La variante exacte et l’état de son appareil restent non inspectés.

### Gardena XL

- [Fiche officielle française](https://www.gardena.com/fr/outils-jardin/entretien-pelouses/epandeurs/epandeur-a-engrais-xl-sur-roues/967676201.html)
- Photo : `https://media.husqvarnagroup.com/image/GA310-0578.png?optimize=low&format=webply&height=1200&width=1200&fit=bounds`
- Alt conseillé : « Photo fabricant de l’épandeur rotatif Gardena XL sur roues ».
- La fiche précise 436-20. Le disque rotatif est visible dans le packshot, contrairement au cylindre du modèle L. Le client a confirmé posséder un modèle XL ; l’état de son exemplaire reste non inspecté.


La confirmation « scarificateur Ryobi 36 V, je crois » est cohérente avec la photo RY18SFX35A-0 (deux batteries 18 V). Elle ne confirme pas encore l’étiquette de l’appareil, son autonomie ou les accessoires inclus.

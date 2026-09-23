# Hanami Pro / Studio — intégration du 23 septembre 2026

## Pages et parcours

- `/pro` : logiciel en premier, aperçu partiel Studio dans le hero, trois écrans de démonstration, six besoins métier, puis les prestations d’expertise gazon et leur réservation Calendly.
- `/pro/logiciel` : planning, dossier chantier avec photos, Studio intégré, démonstration accompagnée et formulaire.
- `/studio` redirige définitivement vers `/pro/logiciel` : Studio reste un module de Hanami Pro.
- Le formulaire logiciel utilise `variant="pro"`, `source="hanami-pro-saas"`, présélectionne `requestType="hanami-pro"` et masque l’upload de photos. L’option `studio` reste disponible.
- L’API reconnaît les sources Pro personnalisées pour conserver l’entreprise et le type de demande dans l’e-mail. La source est explicitement fixée au moment de l’envoi côté formulaire.

## Aperçus publics

Les écrans sont des extraits de présentation en lecture seule, pas une application utilisable. Les légendes indiquent « prototype en développement » et « données fictives ».

- Planning : trois visites fictives du jardin témoin.
- Dossier chantier : jardin d’ambiance généré, explicitement identifié comme tel.
- Studio : plan et perspective d’un jardin fictif issus du prototype local. Les fichiers repris sont les rendus `plan-2d-blender.png` et `vue-3d-blender.png`, sans données client.

Aucune URL du prototype local, aucun port Unreal, aucun nom ni coordonnées de client ne sont intégrés aux aperçus. Aucune promesse de synchronisation entre appareils, de génération 3D automatique, de bibliothèque complète ou d’essai autonome.

Composants : `ProHero2026`, `SoftwareHeroPreview`, `SoftwareDemoScreens`, `ProStudioModules`. Ils réutilisent les couleurs officielles et les polices existantes. Les nouveaux aperçus sont rendus côté serveur ; aucun moteur 3D n’est chargé par le site marketing.

## Identité et assets

Les fichiers web se trouvent dans `public/brand/2026/`. Les logos et icônes proviennent du raster maître isolé du 22 septembre, par extraction de fond et recoloration, sans redessin du lettrage. Le script reproductible est `scripts/derive-brand-assets.py`.

Le maître n’étant pas vectoriel, aucun SVG de substitution n’est livré. La définition utile reste limitée par celle du raster. Les variantes nommées `blanc` utilisent le crème officiel `#F8F6EF` pour l’inversion sur fond forêt. Le motif trois brins vient de la planche fournie du 20 septembre ; il n’a pas la définition du logo isolé.

Les deux photos d’ambiance sont fictives et ne doivent pas être présentées comme des résultats clients. Les photos de chantier existantes n’ont pas été régénérées.

L’OG `1200×630` utilise le vrai raster et la phrase exacte « Des pelouses plus belles, durablement. ». Un export est livré dans `public/brand/2026/og-hanami-1200x630.png` ; la route `/opengraph-image` est la source utilisée par Next.js.

## Vérifications

- Compilation Next.js de production réussie, avec TypeScript.
- Contrôle visuel ordinateur et mobile 390 px des pages Pro / logiciel.
- Débordement mobile du footer corrigé ; largeur de page égale à la largeur d’écran sur les deux pages.
- CTA de démonstration vérifié jusqu’au formulaire ; type `hanami-pro` présélectionné.
- API contact exécutée avec Resend simulé : sources `pro`, `hanami-pro-saas`, `hanami-pro-outils-metier` et `particulier` correctement conservées ; sujets et champs professionnels vérifiés. Aucun vrai e-mail envoyé.
- Les alertes ESLint `set-state-in-effect` des composants existants Navbar et PhoneField sont antérieures à cette intégration ; elles restent à traiter séparément.

## Publication

Le dépôt local pointe sur `github.com/sambdn-dev/hanami-site.git`. Aucun projet `.vercel/project.json` n’est lié localement et le connecteur Vercel a renvoyé une liste d’équipes vide. L’accès au projet/domaine reste à confirmer pour produire une URL Vercel de prévisualisation. Aucune publication en production ni aucun push effectué dans cette intégration.

## Suite de la refonte

La migration complète des pages Particuliers, coaching, journal et outils reste à poursuivre ; les anciens tokens CSS sont conservés pour ces écrans. Les nouveaux tokens `brand-forest`, `brand-cream`, `brand-sage` sont la référence pour les pages migrées. Le logo maître raster reste obligatoire.

Pour le futur SaaS : application séparée, entreprises isolées, connexion et stockage des photos avant ouverture publique. Studio doit partager le même dossier chantier. L’infrastructure Unreal et le sous-domaine sont un chantier distinct du site marketing.

## Import unique, hiérarchie et panne de prévisualisation — 24 octobre 2026

Un seul bouton ouvre le sélecteur système (photothèque/appareil photo selon appareil et navigateur), sans capture forcée. La validation des formats et la limite de 50 Mio restent actives. Après import, l’illustration d’exemple et les étapes introductives disparaissent ; l’aperçu est limité à 360 px de haut sur ordinateur et 220 px sur mobile. Les réglages sont immédiatement visibles : finition puis hauteur, suivis du consentement et du lancement. Aucun nouveau paramètre n’est ajouté au moteur.

Panne reproduite sur le déploiement d85a251 : GET /api/gazon-simulations renvoie réellement HTTP 503 (accès serveur protégé). Métadonnées Vercel revérifiées : OPENAI_API_KEY absente du projet isolé hanami-gazon-ia-preview. Ce sont deux blocages de configuration ; aucun simple rechargement ne les répare. Les réponses BFF possèdent maintenant un code d’erreur explicite, affiché avec le vrai message ; aucune boucle d’actualisation n’est proposée pour une configuration manquante. Pour une panne transitoire, la reconnexion réinitialise la session sans recharger la page ni perdre la photo préparée.

Vérifications : 7 tests de service/UI (vraie route BFF, amont HTTP simulé ; rendu React serveur des réglages et de l’import unique), 5 préparation photo (décodeur/canvas simulés), 5 attente, 5 proxy, 3 recadrage Next, 9 moteur avec fournisseur simulé. TypeScript, ESLint ciblé et compilation passent. Ni ces tests ni les anciens essais Supabase ne valident une génération fournisseur. Aucun appel réel au fournisseur, aucune nouvelle capture navigateur ni recette iPhone effectuée : outils navigateur indisponibles dans cette session. Aucun déploiement sur les domaines Hanami de production.

Prochaine action de configuration : autoriser le lien sécurisé entre cette prévisualisation et son serveur isolé, puis y rendre la clé OpenAI existante disponible via Vercel. La clé Production sensible n’est pas exportable par le connecteur ; ne jamais coller de secret dans la conversation. Ne présenter le parcours comme opérationnel qu’après un vrai essai photo → stockage → génération → comparaison.

## Photos iPhone volumineuses — 24 octobre 2026

Import public jusqu’à 50 Mio, avec plafond de 64 mégapixels (couvre la résolution usuelle 48 MP iPhone). JPEG, PNG, WebP, AVIF, HEIC et HEIF proposés. Lecture native prioritaire, conversion HEIC via heic-to uniquement en cas d’échec ; plus d’import WASM pour un JPEG normal. Préparation locale en JPEG, côté long 1200 px, avant envoi. La limite de transport reste 2 Mio et la validation serveur ne change pas. RAW/DNG non pris en charge : aucune promesse d’accepter tous les codecs.

Tests techniques avec décodeur/canvas simulés : fichier source de 24 Mio accepté, résolution 8064×6048 réduite à 1200×900, poids excessif refusé avant décodage, lecture HEIC native préférée, conversion en secours une fois, URL libérées même après échec. Ces tests ne prouvent pas le décodage d’un HEIC réel ni la mémoire disponible sur chaque iPhone. Recette matérielle toujours à faire. Aucune photo envoyée au fournisseur dans cette itération.

## Suite de l’audit Claude et chargement — 24 octobre 2026

24 octobre 2026 — Suite audit Claude : recadrage fill/width corrigé sur le site (test SSR avec le vrai Next Image et accueil HTTP 200 en développement), anciens jobs sans faux réglages, légende illustration clarifiée, agrandissement retiré des mini-comparateurs. Attente enrichie dans les deux parcours : original étiqueté, indicateur indéterminé, étapes serveur génération/enregistrement, temps écoulé réel, conseils canoniques côté moteur avec pause et défilement hors annonces vocales. Preview isolée : refus serveur des mutations ERP hors simulation/auth, liste explicite de fiches de test (vide par défaut), aucune création de jardin depuis l’ancien module. Base partagée réellement confirmée par métadonnées Vercel ; aucun dossier client touché. Source live CLI SHA51ad9b7 toujours absente du GitHub accessible. Aucune génération fournisseur réelle ; clé preview absente. Recette navigateur actuelle bloquée, pas de production.

Les fichiers tests/before-after-crops.test.cjs utilisent le véritable composant Next Image en mode développement : ils reproduisent l’erreur originale, puis valident les conteneurs de recadrage. Les photos ne portent plus les dimensions CSS cqw/cqh. Les mini-comparateurs HomeEditorial n’affichent plus le bouton plein écran ; les grandes comparaisons le conservent. L’attente s’affiche uniquement pour un job running confirmé, les conseils ne constituent jamais des étapes. processingPhase=saving exige un reçu fournisseur avec métrique de post-traitement. Aucun pourcentage ni délai restant n’est fabriqué. Bouton pause, nettoyage des timers et réduction des animations prévus ; gestes/timers réels à vérifier dans le navigateur.

## Dernière passe — 24 octobre 2026

Accroche accueil : « Votre gazon, notre expertise. ». Comparateur partagé : bouton d’agrandissement dans un dialogue couvrant le viewport, fermeture par bouton/Échap et restitution du focus ; curseur actif au clavier et au toucher, position conservée entre affichages. Vérifications TypeScript/lint/build ; recette visuelle et interaction dans un navigateur non effectuées. Les réglages de hauteur ne comportent plus de centimètres. Sources OpenAI revérifiées, compte fournisseur toujours non testé.

## Atelier photographique et paramètres — 24 octobre 2026

Maquette 1 sélectionnée par Sami. Nouvel import immédiat et illustration explicitement synthétique, sans remplacement des photos client. Deux paramètres facultatifs transmis au moteur commun : finition (`natural` / `manicured`), hauteur (`source` / `short` / `comfortable`). Défaut : naturel / selon la photo. La saison et la lumière ne changent pas. Les options de chaque job sont conservées séparément dans lawn_finish et lawn_height et restituées après rechargement. Migration additive appliquée : 20261024101331_gazon_simulation_appearance. prompt_version reste la version du gabarit. Tests HTTP fournisseur simulé uniquement ; qualité IA réelle toujours non vérifiée.

# Prévisualisation du gazon — état au 24 octobre 2026

## Correction du parcours — 24 octobre 2026

La photo seule suffit : import → lancement → comparaison. Aucun contour, masque ou confirmation de zone demandé au client ou à l’Admin. Le moteur envoie directement la photographie à l’édition IA avec des instructions de rénovation automatique de la pelouse et de conservation du jardin. Les anciens jobs déjà munis d’un masque restent lisibles et traitables avec leurs instructions historiques. La conservation visuelle du reste du jardin doit être vérifiée avec de vrais rendus ; aucune garantie pixel par pixel n’est annoncée pour ce nouveau mode. Cinq tests moteur techniques passent, dont un appel HTTP simulé sans champ masque. Génération fournisseur réelle toujours non vérifiée. Les captures de l’ancien tracé restent des archives et ne représentent plus le parcours courant.

Statut : parcours et moteur implémentés, contrôles techniques et stockage réels vérifiés, **génération OpenAI non vérifiée**. Ce document ne constitue pas une validation du rendu ni de sa durée. Aucune publication sur les domaines Hanami de production.

## Architecture

- Site : `/simulateur-gazon`, comparaison existante, photo optimisée à 1 200 px, autorisation photo distincte du contact.
- `/api/gazon-simulations/[[...path]]` est un BFF. Il conserve une session opaque HttpOnly et transmet une empreinte de session ; aucun secret serveur n’est envoyé au navigateur. Une liaison de session et Web Locks évitent les courses d’initialisation entre onglets.
- Moteur unique dans `sambdn-dev/hanami-platform`, `apps/admin/src/lib/gazon-simulation/`. L’Admin et ce BFF utilisent ses mêmes routes, états, instructions, règles de stockage et mécanismes de déduplication. Aucun appel OpenAI direct depuis le site.
- Job durable PostgreSQL, fichiers privés Supabase, acquisition atomique avant l’unique appel Images API. Une réponse perdue ou une expiration ne déclenche aucune nouvelle facturation automatique.
- Les nouvelles photos sont envoyées sans masque. Le modèle identifie la pelouse et reçoit des instructions de conservation du cadrage et des autres éléments du jardin.

## Configuration serveur du site

| Variable | Utilisation |
| --- | --- |
| `HANAMI_LAWN_SIMULATOR_ENABLED` | `1` pour ouvrir la page, son lien dans le pied de page et les routes. Désactivé par défaut. |
| `HANAMI_SIMULATION_API_ORIGIN` | Origine HTTPS du moteur Admin, sans chemin ni paramètres. HTTP local accepté en développement uniquement. |
| `HANAMI_SIMULATION_WORKER_KEY` | Secret serveur partagé avec le moteur ; valeur aléatoire, jamais préfixée `NEXT_PUBLIC_`. |
| `HANAMI_SIMULATION_PROTECTION_BYPASS` | Facultatif : accès serveur autorisé à une prévisualisation Vercel protégée. **Non provisionné : création refusée par l’approbation automatique.** |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL` | Mécanisme de contact existant. Aucun message de recette envoyé. |

Le site n’utilise aucune clé OpenAI. La clé doit être configurée uniquement dans l’environnement serveur du moteur. Vercel ne permet pas de relire le Secret actuellement présent dans l’Admin de production. L’ajout de la clé existante dans le projet de test a été demandé via l’interface sécurisée Vercel ; il reste à confirmer.

## Contrat HTTP

Réponses de données : `{jobs: [...]}` pour la collection, `{job: ...}` pour une simulation. États : `queued`, `running`, `completed`, `failed`. Étapes UI : `upload`, `ready`, `generation`, `complete`.

| Méthode et chemin | Comportement |
| --- | --- |
| `GET /api/gazon-simulations` | Initialise/retrouve la session et ses 20 dernières simulations ; renvoie l’en-tête de liaison de session. |
| `POST /api/gazon-simulations` | Multipart `original`, `idempotencyKey`, `photoAuthorization=true`. JPEG/PNG/WebP préparé ≤2 Mio ; le client accepte aussi HEIC/HEIF avant conversion. |
| `POST /:id/start` | Lance uniquement un job sauvegardé `queued/ready`. Une seule acquisition atomique gagne. |
| `GET /:id` | Relit l’état durable, sans déclencher de génération. |
| `GET /:id/image?kind=original\|result` | Image privée, contrôlée à chaque requête. Le résultat est indisponible avant `completed`. |
| `DELETE /:id` | Confirme `{success:true}` seulement après suppression Storage et purge du job ; l’empreinte anti-doublon subsiste. |
| `POST /:id/contact` | Accord explicite, réservation durable liée au job puis email idempotent et acquittement. Aucun prospect créé automatiquement, aucun rapprochement par adresse. |

Les mutations publiques exigent la même origine, le cookie et l’en-tête de liaison retourné par l’initialisation. Le BFF n’accepte aucun identifiant d’auteur, de prospect ou de jardin depuis le formulaire public.

## Données et coûts

Accès anonyme : 7 jours. Admin : 90 jours. Suppression explicite disponible. Nettoyage opportuniste plus route de nettoyage protégée ; le Cron Vercel quotidien ne s’exécute que sur un déploiement Production et doit être contrôlé avant la mise en service live. En prévisualisation, l’expiration d’accès est effective ; ne pas annoncer un effacement physique à heure fixe.

Les empreintes techniques anti-abus/anti-doublon restent 90 jours sans les photos. Limites de recette : 3 jobs/session/24 h, 6/IP/24 h, 10/Admin/heure, 50 au total/24 h. Ces limites sont propres au pilote et ne constituent pas une capacité commerciale annoncée.

Le fournisseur, le modèle, la version d’instructions, les dates, empreintes et états restent associés au job. La consommation, le coût estimé et la référence fournisseur sont sauvegardés avant l’enregistrement du résultat, y compris si le stockage échoue ensuite. Aucun prix moyen ni délai de génération n’est annoncé sans mesures réelles.

## Vérifications et limites

- Build Next et TypeScript du site : passent. Tests du proxy : 5 cas.
- Moteur : 4 tests techniques avec vrai traitement Sharp et réponse HTTP fournisseur simulée. Préservation pixel par pixel hors masque, EXIF, limites, masque et absence de nouvelle tentative vérifiés.
- Données : 13 tests PGlite avec fixtures, dont accès, identifiants stables, quotas, déduplication, expiration, contact et conservation des références facturables.
- **Service Supabase réel** : 12 contrôles passent, incluant transport de l’en-tête privé dans Storage, refus d’accès anonyme, relecture des octets, concurrence et suppression. Fixtures techniques uniquement dans le module isolé ; aucun prospect ERP créé.
- **Chaîne HTTP réelle locale** : 9 contrôles passent, du BFF au build Admin et au vrai Supabase : envoi multipart concurrent, persistance, photo privée, sessions, origine, configuration absente sans appel fournisseur, suppression.
- Navigateur isolé : ordinateur 1 440 px, mobile 390 px et iPad 1 024 px. Import/photo réelle existante, contours, clavier/tactile, affichage et erreurs vérifiés. Les parcours avec résultat sont des **fixtures API clairement étiquetées**. L’Admin a été rendu depuis son vrai composant dans un banc isolé ; sa connexion authentifiée n’a pas été testée.
- **Appels OpenAI réels : 0.** Aucun rendu évalué, aucune comparaison réelle instructions seules/masque, aucun temps ni coût fournisseur observé. Aucun email réel envoyé. HEIC réel et Safari matériel non testés.

Le projet Admin de test est séparé du live : `hanami-gazon-ia-preview`. Le code Admin accessible part du checkpoint `2aef59d…`, alors que le déploiement live cite `f0ee3518…`, absent du dépôt distant. Il faudra intégrer explicitement ce patch au checkout Admin actuel avant toute production.

Captures et preuves détaillées : `docs/evidence/gazon-ia/`. Les captures montrant un résultat sont marquées comme recette technique et ne représentent pas une génération IA validée.

## Déploiements de revue

- Site : https://hanami-site-cnwq8i1jt-sams-projects-67e025cc.vercel.app/simulateur-gazon (`staging`, source fonctionnelle `8448e13`).
- Admin isolé : https://hanami-gazon-ia-preview-dy84k6gcf-sams-projects-67e025cc.vercel.app/admin/workspace (`staging`, source `ebe8f10`).
- Les deux liens sont protégés par Vercel. Leur communication serveur n’est pas encore autorisée à travers cette protection ; aucune clé de contournement n’a été créée.
- Vercel a automatiquement classé le premier amorçage du **nouveau projet isolé** comme Production, malgré la demande Preview. Un second déploiement explicitement `staging` est utilisé pour la revue. Aucun domaine live Hanami n’a été assigné au projet isolé.
- La production du site existant reste `dpl_3QFFD2fZdK4soSSUz61S8sL49f6M`, commit `ede248b…`, vérifié après ces déploiements.

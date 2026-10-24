# Prévisualisation du gazon — état au 24 octobre 2026

Statut : parcours et moteur implémentés, contrôles techniques et stockage réels vérifiés, **génération OpenAI non vérifiée**. Ce document ne constitue pas une validation du rendu ni de sa durée. Aucune publication sur les domaines Hanami de production.

## Architecture

- Site : `/simulateur-gazon`, comparaison existante, sélection de 1 à 4 contours au toucher/clavier, photo optimisée à 1 200 px, autorisation photo distincte du contact.
- `/api/gazon-simulations/[[...path]]` est un BFF. Il conserve une session opaque HttpOnly et transmet une empreinte de session ; aucun secret serveur n’est envoyé au navigateur. Une liaison de session et Web Locks évitent les courses d’initialisation entre onglets.
- Moteur unique dans `sambdn-dev/hanami-platform`, `apps/admin/src/lib/gazon-simulation/`. L’Admin et ce BFF utilisent ses mêmes routes, états, instructions, règles de stockage et mécanismes de déduplication. Aucun appel OpenAI direct depuis le site.
- Job durable PostgreSQL, fichiers privés Supabase, acquisition atomique avant l’unique appel Images API. Une réponse perdue ou une expiration ne déclenche aucune nouvelle facturation automatique.
- Le masque PNG est généré côté serveur à partir de coordonnées validées. Après édition, la recomposition PNG garde exactement les pixels de l’original optimisé hors masque. Les éléments inclus par erreur dans le contour ne sont pas protégés : la sélection doit exclure arbres, massifs et objets.

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
| `POST /api/gazon-simulations` | Multipart `original`, `polygons`, `idempotencyKey`, `photoAuthorization=true`. JPEG/PNG/WebP préparé ≤2 Mio ; le client accepte aussi HEIC/HEIF avant conversion. |
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

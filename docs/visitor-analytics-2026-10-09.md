# Mesure des visiteurs — 9 octobre 2026

## Solution

Vercel Web Analytics était déjà installé (`@vercel/analytics`), mais désactivé
dans le projet `hanami-site`. Aucun historique de fréquentation n'est disponible
avant activation. Le tableau de bord est privé :
https://vercel.com/sams-projects-67e025cc/hanami-site/analytics

Le comptage respecte les préférences du bandeau existant. Sans choix ou après
refus, aucun script de mesure n'est chargé. L'acceptation charge Analytics et
compte la page déjà ouverte, sans attendre une navigation. Un choix enregistré
est repris lors de la visite suivante. Les changements dans un autre onglet sont
pris en compte et `beforeSend` bloque les événements après retrait du consentement.

## Activation du compte

Au moment de cette passe, l'API renvoie `web_analytics_not_enabled`.
Le connecteur disponible expose la lecture des statistiques, mais pas l'activation.
La CLI ne dispose pas d'identifiants dans cet environnement. Le propriétaire doit
cliquer sur **Enable Web Analytics** dans le tableau de bord, puis un déploiement
doit être effectué pour vérifier la réception réelle des visites. Aucun service
payant supplémentaire n'est souscrit.

## Vérification

- Build de production et TypeScript. `NODE_USE_ENV_PROXY=1` est nécessaire dans
  cet environnement pour le téléchargement de la police de l'image Open Graph.
- ESLint ciblé sur les trois fichiers modifiés.
- Parcours sur le build de production local : acceptation sur la page courante,
  navigation côté client, rechargement, refus persistant, consentement enregistré,
  retrait dans un autre onglet ; ordinateur 1440 px et mobile 390 px.
- Le collecteur Analytics est simulé pendant ces tests de navigateur : ils
  vérifient l'intégration du SDK et le consentement, sans créer de fausses visites
  dans les statistiques réelles. La réception Vercel reste à confirmer après
  activation du compte.

La boutique reste désactivée. Aucune modification de Hanami Pro ou Hanami Studio.

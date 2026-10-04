# Reprise Hanami — 4 octobre 2026

## Base vérifiée

`AGENTS.md` lu, puis guides Next.js 16.2.3 installés consultés avant modification.

La branche distante `preview/hanami-da-2026`, au commit `b1aab5b`, est la base la plus récente. Elle contient tous les commits de `main` (`3680cb8`) et deux commits supplémentaires du 29 septembre : retouches avant/après (`fb18efb`), puis section « Interventions & chantiers » et engagement écologique (`b1aab5b`). Les autres branches distantes sont antérieures.

Travail isolé sur `dev/hanami-mobile-cta-2026`. Aucun changement de `main`, aucun push et aucune publication.

## Priorité réalisée : l'action mobile des particuliers

La barre fixe utilisait encore l'ancien vert et un décalage WhatsApp constant. La retouche est finalement isolée dans `HomeMobileCTA`, utilisée seulement sur la page particuliers, conformément au recentrage demandé pendant cette session. `MobileStickyCTA` et les pages Pro / Studio conservent leur code initial.

- Couleurs forêt/crème officielles, bouton de 48 px minimum, flèche et réassurance lisible.
- Hauteur mesurée avec `ResizeObserver` sur la boîte complète, y compris le padding et les marges de zone sûre. WhatsApp conserve 16 px d'écart avec la barre.
- Espace réservé en fin de page pour laisser les derniers liens accessibles.
- Barre masquée avant 400 px de défilement, devant le formulaire et pendant la saisie. Les actions flottantes se masquent aussi pendant un menu, une fenêtre modale ou le choix des cookies.
- Écoute du redimensionnement et de l'entrée du formulaire dans le viewport ; nettoyage des observateurs au démontage. Respect du réglage de réduction des animations et du parcours clavier.

La destination particuliers et les événements analytiques existants sont conservés. Les trois offres restent distinctes :

| Offre | Action mobile | Destination | Statut affiché |
| --- | --- | --- | --- |
| Particuliers | Découvrir le coaching | `/coaching` | Offre de service existante |
| Hanami Pro | Demander une démo | `/pro#contact` | Prototype, démo accompagnée |
| Hanami Studio | Parler de Studio Pro | `/pro/studio#contact` | Vision produit, aperçus conceptuels |

## Vérifications

- Build complet et TypeScript réussis : `NODE_USE_ENV_PROXY=1 npm run build`.
- `eslint src/components/home/HomeMobileCTA.tsx src/app/page.tsx` et `git diff --check` réussis. Le lint global n'est pas attesté par cette itération.
- Contrôle navigateur Chromium via agent-browser sur le serveur de développement, puis sur la compilation servie avec `next start`.
- Accueil, Pro et Studio contrôlés visuellement à 390 px et 1440 px ; aucune erreur JavaScript observée sur ces parcours.
- Absence de débordement horizontal à 320 px sur les trois pages, à 390 px sur les trois pages, et à 375, 430, 768, 1280 et 1440 px sur Studio. Barre absente à partir de 768 px.
- CTA particuliers cliqué jusqu'à `/coaching`. Les contrôles initiaux des liens Pro et Studio ont confirmé leurs formulaires et sources respectives `hanami-pro` et `hanami-studio-pro` ; leur code a ensuite été conservé à l'identique de la base.
- Menu mobile, fermeture par Échap, focus de la newsletter et accès au bas de page vérifiés.
- Marge basse de 34 px simulée et écart WhatsApp de 16 px vérifié. Cette simulation a révélé puis permis de corriger l'observation initiale limitée à la boîte de contenu.

Le premier build avait échoué sur la récupération de la police Google de `/opengraph-image` : le `fetch` Node devait utiliser le proxy de l'environnement. La variable `NODE_USE_ENV_PROXY=1` résout ce point sans modifier le site ni simuler les ressources.

Captures locales conservées dans `/workspace/hanami-review/mobile-cta/`, hors du code livré.

## Réel, démonstration et points à confirmer

- **Réel dans cette itération :** code modifié, build, rendu navigateur et navigation. Le lien WhatsApp existant utilise une vraie destination ; aucun message ni e-mail n'a été envoyé.
- **Présentation Pro existante :** captures du prototype avec données de démonstration. Elles ne constituent pas une application SaaS ouverte au public.
- **Présentation Studio existante :** jardins fictifs et visuels conceptuels ; aucune génération en direct ni intégration 3D de production attestée.
- **À confirmer :** fonctionnement des envois Resend en environnement réel, effet sur les conversions, et comportement Safari/iPhone physique avec clavier et zone sûre. Les contrôles de tailles et la marge de 34 px sont des simulations Chromium.
- Le site identifie les photos de Susan comme réelles. Les visuels Véronique/Noël ont été retouchés dans les commits précédents ; leur provenance et leur fidélité au chantier doivent être confirmées avant de les qualifier de preuves photographiques non retouchées.

Le document `hanami-pro-studio-handoff.md` décrit un état du 23 septembre : ses anciennes routes et la présentation intégrée de Studio ne reflètent plus toutes les pages actuelles. Les routes vérifiées sont `/pro` et `/pro/studio`, avec redirections respectives depuis `/pro/logiciel` et `/studio`.

## Nouvelle direction demandée

Le propriétaire distribue actuellement ses cartes à des prospects pour l'entretien. Il demande désormais un plan de refonte de l'offre particuliers autour des interventions agronomiques régulières, par abonnement ou forfait, sans modifier Hanami Pro ni Studio.

Pratiques déclarées à mettre en valeur : mesure de la surface au dixième de mètre carré, dosage au gramme et par zone, application homogène, plans adaptés aux saisons et événements climatiques, anticipation et correction. Fertilisation de fond en granulés à action de plusieurs mois, compléments liquides foliaires selon les besoins. Fréquence globale annoncée : entre deux semaines et trois mois, selon le niveau de suivi ; tarifs et périmètre précis à définir.

Positionnement personnel : autodidacte, travail de préparation des protocoles et conseil aux clients souhaitant réaliser eux-mêmes certains gestes. Marques citées : Barenbrug, « Frésinet » (orthographe à confirmer), ICL et COMPO EXPERT. Présenter les références professionnelles réellement utilisées et leurs logos officiels sous « Les marques que j'utilise », sans inventer un partenariat.

Matériel cité : écosystème EGO Power à batterie, tondeuse (référence à confirmer), réciprocateur, dresse-bordure, souffleur et pulvérisateur. Références des deux lames et pratique d'affûtage à préciser avant rédaction.

Le bénéfice recherché est une pelouse dense, régulière et mieux préparée aux stress, limitant la place disponible pour les adventices. Les formulations absolues sur l'absence de dégradation et le multiplicateur « trois à quatre fois plus qualitatif » demandent une base vérifiable ; ne pas les transformer en garanties publiques.

Ordre proposé pour la refonte : 1. premier écran et offre d'interventions récurrentes ; 2. méthode de mesure et programme agronomique, logos ; 3. matériel, présentation personnelle et preuves photographiques ; 4. contact adapté à l'entretien et validation mobile. Les nouveaux contenus ne sont pas encore intégrés : le dernier message demande d'abord un plan.

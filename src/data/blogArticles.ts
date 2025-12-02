export interface BlogArticle {
  id: number;
  title: string;
  category: string;
  season: string;
  excerpt: string;
  image: string;
  content: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Les 5 erreurs courantes des regarnissages",
    category: "Rénovation & Regarnissage",
    season: "Printemps",
    excerpt: "Découvrez les erreurs que 80% des particuliers commettent lors du regarnissage de leur pelouse, et comment les éviter pour un résultat professionnel...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    content: `Le regarnissage d'une pelouse semble simple en apparence : on sème des graines, on arrose, et voilà. Pourtant, la réalité est bien différente. Voici les 5 erreurs les plus fréquentes qui compromettent vos efforts.

**1. Négliger la préparation du sol**
C'est l'erreur numéro un. Semer directement sur un gazon existant sans préparation, c'est comme planter sur du béton. Le sol doit être scarifié, décompacté, et les zones à regarnir doivent être légèrement griffées. Les graines ont besoin d'un contact direct avec la terre meuble pour germer efficacement.

**2. Choisir les mauvaises semences**
Les mélanges "premier prix" du commerce contiennent souvent des graminées inadaptées qui germent vite mais disparaissent en quelques mois. Investir dans des semences professionnelles adaptées à votre usage (piétinement, ombre, plein soleil) fait toute la différence sur le long terme.

**3. Un dosage approximatif**
"À vue d'œil" ne fonctionne pas. Trop peu de graines = zones clairsemées. Trop de graines = concurrence entre plantules = faiblesse générale. Le dosage professionnel est de 30-40g/m² pour un regarnissage, pesez vos semences et divisez votre surface en zones.

**4. Un arrosage inadapté**
L'erreur classique : arroser fort une fois par jour. Or, les graines en germination ont besoin d'une humidité constante. Arrosez légèrement 2-3 fois par jour pendant 10-15 jours, puis espacez progressivement. Un sol qui sèche = germination stoppée = graines perdues.

**5. Tondre trop tôt ou trop court**
L'impatience tue les jeunes pousses. Attendez que le nouveau gazon atteigne 8-10cm avant la première tonte, et ne coupez que le tiers supérieur. Une tonte trop précoce ou trop rase arrache les jeunes plants mal enracinés.

**Le conseil Hanami**
Un regarnissage réussi nécessite rigueur et patience. Si vous suivez une méthode professionnelle avec les bons produits et les bonnes pratiques, vos résultats seront visibles dès 3 semaines et durables sur plusieurs années.`
  },
  {
    id: 2,
    title: "Mon gazon jaunit, que faire ?",
    category: "Entretien & Tonte",
    season: "Été",
    excerpt: "Votre pelouse perd sa belle couleur verte et tire vers le jaune ? Pas de panique, identifions ensemble les causes et les solutions adaptées...",
    image: "https://images.unsplash.com/photo-1584463699334-f85fd65d2556?w=800&h=600&fit=crop",
    content: `Un gazon qui jaunit est un signal d'alarme qu'il faut prendre au sérieux. Plusieurs causes peuvent expliquer ce phénomène, et le diagnostic est essentiel pour appliquer la bonne solution.

**Cause n°1 : Le manque d'eau (la plus fréquente)**
En période estivale, c'est la cause principale. Un gazon en stress hydrique jaunit par zones, souvent les parties les plus exposées au soleil ou les zones surélevées où l'eau s'écoule rapidement. Solution : arrosage profond (15-20mm d'eau) 2-3 fois par semaine plutôt que superficiel quotidien.

**Cause n°2 : La carence en azote**
Un gazon qui jaunit uniformément sur toute la surface manque probablement d'azote. C'est le nutriment responsable de la couleur verte et de la croissance. Solution : apport d'engrais azoté professionnel à libération contrôlée, idéalement au printemps et début d'automne.

**Cause n°3 : Le compactage du sol**
Un sol tassé empêche l'eau et l'oxygène d'atteindre les racines. Le gazon s'affaiblit et jaunit par plaques, souvent dans les zones de passage. Solution : aération (carottage) suivie d'un apport de sable et de compost pour restructurer le sol.

**Cause n°4 : Les maladies fongiques**
Des ronds jaunes avec un pourtour plus foncé peuvent indiquer une maladie (fusariose, dollar spot). Ces maladies se développent surtout avec une humidité excessive et des températures douces. Solution : réduire l'arrosage, améliorer la circulation d'air, et dans les cas sévères, traitement fongicide professionnel.

**Cause n°5 : Urine d'animaux**
Les taches jaunes circulaires avec un contour vert foncé sont typiques des brûlures d'urine. Solution : arroser abondamment les zones touchées immédiatement après le passage de l'animal pour diluer l'azote concentré.

**Le diagnostic Hanami**
Observez votre pelouse : le jaunissement est-il uniforme, par plaques, par ronds ? Quand est-il apparu ? Quel temps faisait-il ? Ces indices vous guideront vers la bonne solution. En cas de doute, notre équipe peut vous accompagner avec un diagnostic personnalisé.`
  },
  {
    id: 3,
    title: "Engrais du commerce vs engrais professionnels : la vérité sur ce que vous payez",
    category: "Engrais & Produits",
    season: "Toute l'année",
    excerpt: "Prix bas en rayon, mais qu'y a-t-il vraiment dans ces sacs d'engrais à 15€ ? Découvrez pourquoi les professionnels n'utilisent jamais ces produits...",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
    content: `Dans les rayons de jardinerie, un sac d'engrais "gazon" coûte entre 15 et 25€. En boutique pro, comptez plutôt 60 à 120€. Mais cette différence de prix cache une réalité que peu de particuliers connaissent.

**La composition : pas du tout la même chose**
Les engrais grand public contiennent principalement de l'azote à libération rapide (urée). Résultat : un coup de boost vert pendant 2-3 semaines, puis plus rien. Il faut recommencer tous les mois. Les engrais pros utilisent de l'azote à libération lente et contrôlée (enrobé) qui nourrit progressivement pendant 2-3 mois. Une application au printemps suffit jusqu'à l'été.

**Le NPK : les chiffres ne disent pas tout**
Un engrais "10-5-5" du commerce et un "10-5-5" pro n'ont pas le même effet. La différence ? La forme des nutriments. Les pros utilisent des formes facilement assimilables par le gazon, avec des oligo-éléments (fer, magnésium, soufre) absents des produits grand public. Ces micro-nutriments font la différence entre un vert "correct" et un vert "professionnel".

**La granulométrie : une question d'efficacité**
Les granulés des engrais grand public sont irréguliers, ce qui donne une répartition inégale : zones sur-fertilisées (brûlures) et zones sous-fertilisées (carences). Les engrais pros ont des granulés calibrés au millimètre pour une répartition parfaitement homogène, même à l'épandeur manuel.

**Le vrai coût à l'année**
Engrais commerce : 20€ × 5 applications = 100€/an + risque de brûlure + résultats moyens
Engrais pro : 80€ × 2 applications = 160€/an + résultats durables + gazon en meilleure santé

**La différence : 60€ pour un gazon qui reste vert 6 mois au lieu de 3 semaines**

**L'anti-marketing des marques**
Les fabricants de produits grand public misent sur des prix attractifs et des promesses rapides ("vert en 3 jours !"). Les fabricants pros (Compo Expert, ICL, Barenbrug) communiquent peu auprès du grand public mais équipent les golfs, stades, et parcs professionnels. Leurs produits doivent tenir leurs promesses sur des surfaces scrutées quotidiennement.

**Ce que Hanami change**
Nous donnons accès aux particuliers aux mêmes produits que les paysagistes professionnels, avec un accompagnement pour bien les utiliser. Pas besoin de gaspiller en sur-fertilisant ou de multiplier les applications. La bonne formule, au bon moment, et vous divisez par deux vos interventions annuelles.`
  }
];

export const blogCategories = [
  'Tous',
  'Rénovation & Regarnissage',
  'Entretien & Tonte',
  'Engrais & Produits',
  'Maladies & Ravageurs',
  'Arrosage & Irrigation'
];

export const seasons = ['Toutes', 'Printemps', 'Été', 'Automne', 'Hiver', 'Toute l\'année'];

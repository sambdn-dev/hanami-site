import type { RentalProduct } from "./types";

function unconfigured(): Pick<RentalProduct, "ratesTtcCents" | "units" | "calendarConfigured" | "blockedPeriods"> {
  return {
    ratesTtcCents: { "24h": null, "48h": null, weekend: null },
    units: null,
    calendarConfigured: false,
    blockedPeriods: [],
  };
}

export const RENTAL_PRODUCTS: readonly RentalProduct[] = [
  {
    id: "landzie-overseeding-tool",
    slug: "landzie-overseeding-tool",
    name: "Landzie Overseeding Tool",
    brand: "Landzie",
    summary: "Préparer la surface avant un regarnissage, avec un outil manuel dédié.",
    description: "Un outil manuel pour travailler superficiellement la surface et préparer le contact entre les graines et le sol lors d’un regarnissage. Hanami vous aide à choisir la bonne étape de préparation selon l’état du gazon : cet outil ne remplace pas une scarification lorsque celle-ci est nécessaire.",
    benefits: [
      "Préparation superficielle pour le regarnissage",
      "Travail manuel, sans moteur",
      "Intervention ciblée sur les zones à densifier",
      "Conseils de prise en main lors de la remise",
    ],
    included: ["Landzie Overseeding Tool", "Conseils de prise en main"],
    illustration: "overseeding-tool",
    ...unconfigured(),
  },
  {
    id: "landzie-compost-spreader",
    slug: "landzie-compost-spreader",
    name: "Landzie Compost Spreader",
    brand: "Landzie",
    summary: "Répartir une fine couche de terreau ou de compost sur le gazon.",
    description: "Un rouleau épandeur manuel pour répartir un matériau fin et adapté, comme du terreau pour gazon ou du compost tamisé. Il peut compléter un regarnissage lorsque le sol et les conditions le justifient. Le matériau et sa préparation sont à choisir avec Hanami ; les consommables sont distincts de la location.",
    benefits: [
      "Application d’une fine couche sur la surface",
      "Répartition du matériau avec un rouleau manuel",
      "Complément possible après un regarnissage",
      "Conseils sur le matériau adapté à votre terrain",
    ],
    included: ["Landzie Compost Spreader", "Conseils de prise en main"],
    illustration: "compost-spreader",
    ...unconfigured(),
  },
  {
    id: "epandeur-ryobi-batterie",
    slug: "epandeur-ryobi-batterie",
    name: "Épandeur Ryobi sur batterie",
    brand: "Ryobi",
    summary: "Épandre graines ou granulés compatibles, avec une alimentation sur batterie.",
    description: "Un épandeur sur batterie pour l’application de graines ou de produits granulés compatibles avec le matériel. La dose et le réglage doivent être adaptés au produit, à la surface et à votre vitesse de passage. La référence exacte et l’équipement de batterie seront confirmés lors de la remise.",
    benefits: [
      "Épandage assisté par batterie",
      "Deux batteries supplémentaires et un chargeur inclus",
      "Utilisation avec les produits compatibles",
      "Conseils pour régler le débit et les passages",
    ],
    included: ["Épandeur Ryobi sur batterie", "Deux batteries supplémentaires", "Chargeur", "Conseils de réglage"],
    illustration: "battery-spreader",
    ...unconfigured(),
  },
  {
    id: "epandeur-rotatif-gardena",
    slug: "epandeur-rotatif-gardena",
    name: "Épandeur rotatif Gardena",
    brand: "Gardena",
    summary: "Répartir graines et granulés compatibles avec un épandeur manuel.",
    description: "Un épandeur rotatif manuel pour l’application de graines ou de granulés compatibles. Hanami vous accompagne sur le réglage, la dose et l’organisation des passages pour votre produit et votre surface. La référence exacte sera confirmée avant la location.",
    benefits: [
      "Épandage rotatif manuel",
      "Utilisation sans batterie ni prise électrique",
      "Choix possible à la place de l’épandeur sur batterie",
      "Conseils de dosage et de réglage",
    ],
    included: ["Épandeur rotatif Gardena", "Conseils de réglage"],
    illustration: "rotary-spreader",
    ...unconfigured(),
  },
  {
    id: "scarificateur-ryobi",
    slug: "scarificateur-ryobi",
    name: "Scarificateur Ryobi",
    brand: "Ryobi",
    summary: "Préparer un gazon encombré de feutre lorsque la scarification est adaptée.",
    description: "Un scarificateur pour intervenir sur un gazon lorsque son état, la saison et les conditions permettent une scarification. Hanami vous conseille sur la pertinence de cette étape, son intensité et les soins à prévoir ensuite. La référence exacte, l’alimentation et les accessoires inclus seront confirmés avant la location.",
    benefits: [
      "Intervention sur le feutre à la surface du gazon",
      "Préparation possible avant un regarnissage",
      "Choix guidé selon la saison et l’état du terrain",
      "Conseils pour les soins après le passage",
    ],
    included: ["Scarificateur Ryobi", "Conseils de prise en main"],
    illustration: "scarifier",
    ...unconfigured(),
  },
];

export const RENTAL_PACK = {
  id: "pack-regarnissage",
  slug: "pack-regarnissage",
  name: "Pack regarnissage",
  summary: "Le bon matériel pour votre terrain, sans louer ce dont vous n’avez pas besoin.",
  description: "Une base pour préparer la surface et épandre les graines, à compléter avec un rouleau à terreau ou un scarificateur si votre gazon le demande. Vous choisissez les outils ; Hanami confirme que la sélection convient à votre intervention. Semences, engrais et terreau sont des consommables distincts.",
  benefits: [
    "Un pack composé selon les besoins du terrain",
    "Un épandeur au choix : Ryobi ou Gardena",
    "Rouleau à terreau et scarificateur en option",
    "Conseils pour organiser les étapes du regarnissage",
  ] as const,
  requiredIds: ["landzie-overseeding-tool"] as const,
  spreaderIds: ["epandeur-ryobi-batterie", "epandeur-rotatif-gardena"] as const,
  optionalIds: ["landzie-compost-spreader", "scarificateur-ryobi"] as const,
};

export function getRentalProduct(slugOrId: string): RentalProduct | undefined {
  return RENTAL_PRODUCTS.find((product) => product.id === slugOrId || product.slug === slugOrId);
}

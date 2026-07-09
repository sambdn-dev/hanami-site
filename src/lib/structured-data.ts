/**
 * structured-data.ts — Builders JSON-LD (schema.org) pour le SEO
 *
 * Organization  → identité de marque (layout, site entier)
 * LocalBusiness → SEO local Le Vésinet / Yvelines / Île-de-France (home)
 * Service       → les 3 offres, nourries par services.ts + pricing.ts (home)
 * FAQPage       → rich snippets FAQ Google (home)
 *
 * Volontairement SANS aggregateRating : pas d'avis first-party on-site,
 * et re-marquer les avis Google Business est pénalisé (self-serving reviews).
 */

import { SERVICES } from '@/lib/chantier/services'
import { PRICING_DISPLAY } from '@/lib/chantier/pricing'
import type { FaqEntry } from '@/lib/faq-data'

const BASE_URL = 'https://hanami-gazon.fr'
const PHONE = '+33 6 67 27 76 14'

// Logo carré brins d'herbe (src/app/icon.svg, servi à /icon.svg).
// Google exige un logo carré pour Organization.logo — l'ancienne bannière
// /opengraph-image (1200×630) n'était pas conforme.
const LOGO_URL = `${BASE_URL}/icon.svg`

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Hanami',
    legalName: 'TROTT SASU',
    url: BASE_URL,
    logo: LOGO_URL,
    description:
      'Expert gazon agronomique : diagnostic personnalisé, protocole daté, produits professionnels. Interventions en Île-de-France, coaching partout en France.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'customer service',
      availableLanguage: 'French',
    },
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'Hanami — Coach gazon agronomique',
    url: BASE_URL,
    image: LOGO_URL,
    telephone: PHONE,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Le Vésinet',
      postalCode: '78110',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    areaServed: [
      { '@type': 'City', name: 'Le Vésinet' },
      { '@type': 'AdministrativeArea', name: 'Yvelines' },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      // Le coaching à distance couvre toute la France
      { '@type': 'Country', name: 'France' },
    ],
    parentOrganization: { '@id': `${BASE_URL}/#organization` },
  }
}

export function serviceSchemas() {
  const offers: Record<string, object> = {
    express: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: PRICING_DISPLAY.expressMinM2,
        priceCurrency: 'EUR',
        unitText: 'm²',
      },
    },
    reconstruction: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        minPrice: PRICING_DISPLAY.recoMinM2,
        maxPrice: PRICING_DISPLAY.recoMaxM2,
        priceCurrency: 'EUR',
        unitText: 'm²',
      },
    },
    coaching: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: PRICING_DISPLAY.coachingMois,
        priceCurrency: 'EUR',
        unitText: 'mois',
      },
    },
  }

  return Object.values(SERVICES).map(service => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/#service-${service.id}`,
    name: service.nom,
    description: service.accroche,
    serviceType: service.sousTitre,
    provider: { '@id': `${BASE_URL}/#localbusiness` },
    areaServed:
      service.id === 'coaching'
        ? { '@type': 'Country', name: 'France' }
        : { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    offers: offers[service.id],
  }))
}

export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

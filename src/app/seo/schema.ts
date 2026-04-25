import { SITE_NAME, SITE_URL } from "./config";

/**
 * Schema.org JSON-LD generators for MAGICKS Studio.
 *
 * Two emission paths:
 *
 *   1) **Site-wide (static)** — `Organization` + `LocalBusiness` +
 *      `WebSite` graph. Lives in `index.html` <head> as a literal
 *      `<script type="application/ld+json">`. Every initial HTML
 *      response carries it, so non-JS crawlers (Bing, Slack, X,
 *      LinkedIn, GPTBot, Perplexity, ClaudeBot) get the studio's
 *      identity even before hydration.
 *
 *   2) **Per-route (JS-injected)** — `Service` + `BreadcrumbList`
 *      blocks, written by `<SEO />` in `useEffect` against the same
 *      `data-magicks-seo` cleanup pattern as the meta tags. Until
 *      a static prerender lands (audit C-01), Google will read these
 *      after JS executes; they are still the right shape so they
 *      slot in unchanged once prerendered.
 *
 * All output is plain JSON-serialisable so the same generator can
 * (a) emit a stringified `<script>` body during SSR/prerender and
 * (b) be `JSON.stringify`-ed at runtime without surprises.
 */

export type BreadcrumbItem = { name: string; path: string };

export type ServiceMeta = {
  /** Human-friendly service name (e.g. "Webdesign Kassel"). */
  name: string;
  /** schema.org `serviceType` — the technical category label. */
  serviceType: string;
  /** Customer-facing one-line description. */
  description: string;
  /** Whether the service is locally bound. */
  local: boolean;
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/#fatih-serin`;

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Schwabstr. 7a",
  postalCode: "34125",
  addressLocality: "Kassel",
  addressRegion: "Hessen",
  addressCountry: "DE",
} as const;

const GEO = {
  "@type": "GeoCoordinates",
  latitude: 51.319,
  longitude: 9.498,
} as const;

const AREA_SERVED_LOCAL = [
  { "@type": "City", name: "Kassel" },
  { "@type": "City", name: "Baunatal" },
  { "@type": "City", name: "Vellmar" },
  { "@type": "City", name: "Fuldabrück" },
  { "@type": "City", name: "Lohfelden" },
  { "@type": "City", name: "Niestetal" },
  { "@type": "City", name: "Kaufungen" },
  { "@type": "City", name: "Calden" },
  { "@type": "AdministrativeArea", name: "Nordhessen" },
  { "@type": "Country", name: "Deutschland" },
] as const;

const AREA_SERVED_NATIONAL = [{ "@type": "Country", name: "Deutschland" }] as const;

const KNOWS_ABOUT = [
  "Webdesign",
  "Webentwicklung",
  "Landing Pages",
  "Shopify",
  "Shopware",
  "E-Commerce",
  "2D-Produktkonfiguratoren",
  "3D-Produktkonfiguratoren",
  "Web-Software",
  "Dashboards",
  "API-Integrationen",
  "KI-Automation",
  "n8n",
  "Zapier",
  "Make.com",
  "DSGVO-konforme Webentwicklung",
  "SEO",
  "Hostinger Hosting",
] as const;

const OFFER_CATALOG = {
  "@type": "OfferCatalog",
  name: "Leistungen MAGICKS Studio",
  itemListElement: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Websites & Landing Pages",
        serviceType: "Webdesign und Webentwicklung",
        url: `${SITE_URL}/websites-landingpages`,
        areaServed: "DE",
        provider: { "@id": ORGANIZATION_ID },
        description:
          "Markenwebsites, Relaunches und Conversion-orientierte Landing Pages — designgetrieben, performant, mit sauberem SEO-Fundament.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Online-Shops & 2D/3D-Produktkonfiguratoren",
        serviceType: "E-Commerce und Produktkonfiguration",
        url: `${SITE_URL}/shops-produktkonfiguratoren`,
        areaServed: "DE",
        provider: { "@id": ORGANIZATION_ID },
        description:
          "Shopify-, Shopware- oder individuell entwickelte Shops und 2D/3D-Konfiguratoren für erklärungsbedürftige Produkte — vom Klick bis zur Übergabe an CRM, ERP oder Vertrieb.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Web-Software & Dashboards",
        serviceType: "Individuelle Web-Software-Entwicklung",
        url: `${SITE_URL}/web-software`,
        areaServed: "DE",
        provider: { "@id": ORGANIZATION_ID },
        description:
          "Individuelle Web-Software, Portale, Dashboards und interne Tools — API-first, übergabefähig, gebaut für Prozesse und Wachstum.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "KI-Automationen & Integrationen",
        serviceType: "KI-gestützte Prozessautomation und Systemintegration",
        url: `${SITE_URL}/ki-automationen-integrationen`,
        areaServed: "DE",
        provider: { "@id": ORGANIZATION_ID },
        description:
          "KI-Workflows, Prozessautomationen und Integrationen zwischen Tools und Systemen — n8n, Zapier, Make oder eigener Stack, DSGVO-konform und übergabefähig.",
      },
    },
  ],
} as const;

/**
 * Site-wide @graph. Combines Organization + ProfessionalService +
 * LocalBusiness + Person (founder) + WebSite into one graph so the
 * studio's identity surfaces as a single linked-data node across
 * classical crawlers and AI search engines (GPTBot, PerplexityBot,
 * ClaudeBot, Google-Extended, Bingbot).
 */
export function buildSiteSchema(): unknown {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: ["MAGICKS", "Magicks Studio Kassel"],
        legalName: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/magicks-logo.webp`,
          caption: "MAGICKS Studio Logo",
        },
        image: `${SITE_URL}/og-default.png`,
        description:
          "MAGICKS Studio ist ein kreatives Tech-Studio aus Kassel. Wir entwickeln Websites, Online-Shops, 2D/3D-Produktkonfiguratoren, individuelle Web-Software und KI-Automationen für Unternehmen — designgetrieben, KI-gestützt, in Wochen statt Monaten.",
        slogan: "Creative Tech. Smart Automation. Fast Delivery.",
        email: "hello@magicks.de",
        founder: { "@id": FOUNDER_ID },
        foundingDate: "2024",
        foundingLocation: { "@type": "City", name: "Kassel, Deutschland" },
        address: ADDRESS,
        geo: GEO,
        areaServed: AREA_SERVED_LOCAL,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "hello@magicks.de",
            areaServed: "DE",
            availableLanguage: ["de", "en"],
          },
        ],
        knowsLanguage: ["de", "en"],
        knowsAbout: KNOWS_ABOUT,
        hasOfferCatalog: OFFER_CATALOG,
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: "Fatih Serin",
        jobTitle: "Founder & Studio Lead",
        worksFor: { "@id": ORGANIZATION_ID },
        url: `${SITE_URL}/ueber-uns`,
        knowsLanguage: ["de", "en"],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: "MAGICKS",
        description:
          "Kreatives Tech-Studio aus Kassel — Websites, Shops, 2D/3D-Konfiguratoren, Web-Software und KI-Automationen.",
        inLanguage: "de-DE",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

/**
 * Per-route Service schema. Returns `null` for routes that don't
 * advertise a discrete service (homepage, /projekte, legal pages).
 */
export function buildServiceSchema(
  path: string,
  meta: ServiceMeta | undefined,
): unknown | null {
  if (!meta) return null;
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: meta.name,
    serviceType: meta.serviceType,
    description: meta.description,
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: meta.local ? AREA_SERVED_LOCAL : AREA_SERVED_NATIONAL,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      availableLanguage: ["de", "en"],
    },
    inLanguage: "de-DE",
  };
}

/**
 * BreadcrumbList for a non-home route. Always prepends Home.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): unknown | null {
  if (!items.length) return null;
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    ...items.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: b.name,
      item: `${SITE_URL}${b.path}`,
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

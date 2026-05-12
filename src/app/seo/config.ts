import type { BreadcrumbItem, ServiceMeta } from "./schema";

/**
 * Central SEO configuration — one source of truth per route.
 *
 * Canonical host:
 *   Change `SITE_URL` below if the production domain changes. All
 *   canonical URLs, `og:url` tags, and sitemap entries derive from it.
 *
 * Default OG image:
 *   `/og-default.png` ships with the build as a 1200×630 brand
 *   placeholder. Pages may override via their own `ogImage` field.
 *   The earlier `/og-default.svg` remains in the public/ folder as
 *   an internal infrastructure asset, but is **not** used for OG —
 *   social platforms reject SVG previews.
 */

export const SITE_URL = "https://magicks.de";
export const SITE_NAME = "MAGICKS Studio";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export type OpenGraphType = "website" | "article" | "profile";

export type SeoConfig = {
  /** Path beginning with `/`, used to build the canonical URL. */
  path: string;
  title: string;
  description: string;
  /** Optional overrides — default to title/description when absent. */
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  /** Optional absolute or path-relative OG image override. */
  ogImage?: string;
  /** Optional cleaner OG image alt; falls back to the title minus brand suffix. */
  ogImageAlt?: string;
  /** Optional og:type override. Defaults to "website". */
  ogType?: OpenGraphType;
  /** Optional robots directive override. Defaults to "index, follow". */
  robots?: string;
  /**
   * Optional Service-schema metadata. When set, `<SEO />` injects a
   * `Service` JSON-LD block tied to the studio Organization.
   */
  service?: ServiceMeta;
  /**
   * Optional breadcrumb trail (excluding Home, which is always
   * prepended). When set, `<SEO />` injects a `BreadcrumbList` block.
   */
  breadcrumbs?: BreadcrumbItem[];
};

/**
 * Static page SEO map. Dynamic routes (e.g. /projekte/:slug) compose
 * their SEO config in the page component itself.
 *
 * Editorial principles:
 *   · Titles: 50–60 chars, primary keyword forward, brand suffix.
 *   · Descriptions: 140–160 chars, conversion-oriented, plain German.
 *   · No keyword stuffing — vocabulary varies (Website / Webseite /
 *     Homepage / Internetauftritt) where natural.
 *   · Local terms (Kassel / Nordhessen) only on local-intent routes.
 */
export const SEO_BY_PATH: Record<string, SeoConfig> = {
  "/": {
    path: "/",
    title: "MAGICKS Studio – Webagentur aus Kassel · Websites, Shops, Software, KI",
    description:
      "Webagentur aus Kassel: MAGICKS Studio entwickelt Websites, Shops, Produktkonfiguratoren, Web-Software und KI-Automationen für Unternehmen — designgetrieben, planbar, schnell umgesetzt.",
    ogType: "website",
    ogImageAlt: "MAGICKS Studio — Webagentur aus Kassel",
  },

  "/leistungen": {
    path: "/leistungen",
    title: "Leistungen — Websites, Shops, Software, KI | MAGICKS Studio",
    description:
      "Von Websites und Landing Pages über Shops und Produktkonfiguratoren bis zu Web-Software und KI-Automationen: Die digitalen Leistungen von MAGICKS Studio im Überblick.",
    ogType: "website",
    breadcrumbs: [{ name: "Leistungen", path: "/leistungen" }],
  },

  "/projekte": {
    path: "/projekte",
    title: "Projekte — Ausgewählte digitale Arbeiten | MAGICKS Studio",
    description:
      "Ausgewählte Projekte, Konzepte und digitale Umsetzungen von MAGICKS Studio — mit Fokus auf Design, Funktion und messbare Wirkung.",
    ogType: "website",
    breadcrumbs: [{ name: "Projekte", path: "/projekte" }],
  },

  "/ueber-uns": {
    path: "/ueber-uns",
    title: "Über uns — Kreatives Tech-Studio aus Kassel | MAGICKS Studio",
    description:
      "MAGICKS Studio ist ein kleines, kreativ-technisches Web-Studio aus Kassel — direkt, anspruchsvoll, ohne Agentur-Standard. Studio statt Bürokratie.",
    ogType: "profile",
    ogImageAlt: "MAGICKS Studio — Kreatives Tech-Studio aus Kassel",
    breadcrumbs: [{ name: "Über uns", path: "/ueber-uns" }],
  },

  "/kontakt": {
    path: "/kontakt",
    title: "Projekt anfragen — Kontakt zu MAGICKS Studio aus Kassel",
    description:
      "Projekt anfragen, Idee besprechen oder unverbindlich austauschen — so erreichst du MAGICKS Studio aus Kassel. Direkter Kontakt, klare Antworten.",
    ogType: "website",
    breadcrumbs: [{ name: "Kontakt", path: "/kontakt" }],
  },

  "/impressum": {
    path: "/impressum",
    title: "Impressum – MAGICKS Studio",
    description: "Impressum von MAGICKS Studio.",
    robots: "noindex, follow",
  },

  "/datenschutz": {
    path: "/datenschutz",
    title: "Datenschutz – MAGICKS Studio",
    description: "Datenschutzhinweise von MAGICKS Studio.",
    robots: "noindex, follow",
  },

  "/websites-landingpages": {
    path: "/websites-landingpages",
    title: "Websites & Landingpages erstellen lassen | MAGICKS Studio",
    description:
      "MAGICKS entwickelt hochwertige Websites und Landingpages, die Vertrauen schaffen, Leistungen klar erklären und mehr Anfragen ermöglichen.",
    ogType: "article",
    ogImageAlt: "Websites & Landing Pages — MAGICKS Studio",
    service: {
      name: "Websites & Landing Pages",
      serviceType: "Web Design and Development",
      description:
        "Hochwertige Websites und Landingpages für Unternehmen — mit klarer Struktur, starker Nutzerführung, Performance, SEO-Basis und Anfrageflow.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Websites & Landing Pages", path: "/websites-landingpages" },
    ],
  },

  "/shops-produktkonfiguratoren": {
    path: "/shops-produktkonfiguratoren",
    title: "Shops & Produktkonfiguratoren erstellen lassen | MAGICKS Studio",
    description:
      "MAGICKS entwickelt Shopify-Shops, WordPress/WooCommerce-Shops und individuelle Produktkonfiguratoren, die Produkte klar präsentieren, Nutzer führen und Verkäufe oder Anfragen erleichtern.",
    ogType: "article",
    ogImageAlt: "Shops & Produktkonfiguratoren — MAGICKS Studio",
    service: {
      name: "Shops & Produktkonfiguratoren",
      serviceType: "E-commerce Development",
      description:
        "Shopify-Shops, WordPress/WooCommerce-Shops und individuelle Produktkonfiguratoren — mit klarer Produktlogik, Nutzerführung, Performance und Anfrage- oder Abschlussflow.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Shops & Produktkonfiguratoren", path: "/shops-produktkonfiguratoren" },
    ],
  },

  "/web-software": {
    path: "/web-software",
    title: "Web-Software entwickeln lassen | MAGICKS Studio",
    description:
      "MAGICKS entwickelt individuelle Web-Software, Portale, Dashboards und interne Tools, die Prozesse strukturieren, Teams entlasten und Systeme sinnvoll verbinden.",
    ogType: "article",
    ogImageAlt: "Web-Software, Portale und Dashboards — MAGICKS Studio",
    service: {
      name: "Web-Software, Portale und Dashboards",
      serviceType: "Custom Software Development",
      description:
        "Individuelle Web-Software, Portale, Dashboards und interne Tools — für Prozesse, Rollen, Daten, Workflows, Integrationen und wartbare digitale Abläufe.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Web-Software", path: "/web-software" },
    ],
  },

  "/ki-automationen-integrationen": {
    path: "/ki-automationen-integrationen",
    title: "KI-Automationen & Integrationen | MAGICKS Studio",
    description:
      "MAGICKS entwickelt KI-gestützte Workflows, Automationen und Integrationen, die manuelle Arbeit reduzieren, Systeme verbinden und Prozesse im Alltag entlasten.",
    ogType: "article",
    ogImageAlt: "KI-Automationen & Integrationen — MAGICKS Studio",
    service: {
      name: "KI-Automationen & Integrationen",
      serviceType: "Workflow Automation",
      description:
        "KI-gestützte Workflows, Automationen und Integrationen für Unternehmen — mit CRM-Prozessen, Formularflows, APIs, Webhooks, Datenübergaben und nachvollziehbarer Prüfung.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "KI-Automationen & Integrationen", path: "/ki-automationen-integrationen" },
    ],
  },

  "/website-im-abo": {
    path: "/website-im-abo",
    title: "Website im Abo | Professionelle Website monatlich | MAGICKS Studio",
    description:
      "MAGICKS bietet professionelle Websites im monatlichen Modell: individuell gestaltet, technisch sauber umgesetzt und auf Wunsch mit Hosting, Wartung und Betreuung.",
    ogType: "article",
    ogImageAlt: "Website im Abo — professionelle Website monatlich von MAGICKS Studio",
    service: {
      name: "Website im Abo",
      serviceType: "Subscription Web Design",
      description:
        "Professionelle Website im monatlichen Modell — mit individuellem Design, technischer Umsetzung und optionaler Betreuung.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Website im Abo", path: "/website-im-abo" },
    ],
  },

  "/website-starter": {
    path: "/website-starter",
    title: "Website Starter für kleine Betriebe | Professionelle Website bezahlbar",
    description:
      "MAGICKS erstellt professionelle Starter-Websites für lokale Betriebe: mobil optimiert, klar kalkulierbar, mit Domain, Hosting, Betreuung und lokaler SEO-Grundstruktur.",
    ogType: "article",
    ogImageAlt: "Website Starter für kleine Betriebe — MAGICKS Studio",
    service: {
      name: "Website Starter für lokale Betriebe",
      serviceType: "Starter Website Package",
      description:
        "Professionelle Starter-Website für kleine lokale Betriebe, Handwerker, Dienstleister, Praxen und Shops — mobil optimiert, betreut und mit lokaler SEO-Grundstruktur.",
      local: true,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Website Starter", path: "/website-starter" },
    ],
  },

  "/webdesign-kassel": {
    path: "/webdesign-kassel",
    title: "Webdesign Kassel — Webagentur für Unternehmen | MAGICKS",
    description:
      "Webdesign Kassel: MAGICKS Studio entwickelt hochwertige Websites, Landing Pages und digitale Lösungen für Unternehmen in Kassel und Nordhessen — designstark und planbar.",
    ogType: "article",
    ogImageAlt: "Webdesign Kassel — MAGICKS Studio",
    service: {
      name: "Webdesign Kassel",
      serviceType: "Web Design",
      description:
        "Webdesign und Webentwicklung für Unternehmen in Kassel und Nordhessen — hochwertige Websites, klare Führung, messbare Wirkung.",
      local: true,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Webdesign Kassel", path: "/webdesign-kassel" },
    ],
  },

  "/landingpages-kassel": {
    path: "/landingpages-kassel",
    title: "Landing Pages Kassel — Conversion-Design statt Template | MAGICKS",
    description:
      "Conversion-starke Landing Pages für Unternehmen aus Kassel — designgetrieben, schnell und technisch sauber umgesetzt von MAGICKS Studio.",
    ogType: "article",
    ogImageAlt: "Landing Pages Kassel — MAGICKS Studio",
    service: {
      name: "Landing Pages Kassel",
      serviceType: "Landing Page Design",
      description:
        "Landing Pages für Kampagnen, Services und Anfragen — entwickelt für Unternehmen aus Kassel und Nordhessen.",
      local: true,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Landing Pages Kassel", path: "/landingpages-kassel" },
    ],
  },

  "/produktkonfigurator-erstellen": {
    path: "/produktkonfigurator-erstellen",
    title: "3D-Produktkonfigurator erstellen lassen | MAGICKS Studio",
    description:
      "3D-Produktkonfiguratoren für Unternehmen, Hersteller und die Bau-Branche — technisch sauber, visuell hochwertig, klar auf Anfrage und Vertrieb ausgerichtet.",
    ogType: "article",
    ogImageAlt: "3D-Produktkonfigurator erstellen lassen — MAGICKS Studio",
    service: {
      name: "3D-Produktkonfigurator entwickeln lassen",
      serviceType: "3D Product Configurator Development",
      description:
        "Web-basierte 2D/3D-Produktkonfiguratoren für Hersteller, Bau-Branche und B2B — von Anfrage bis Angebot durchdacht.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "3D-Produktkonfigurator erstellen lassen", path: "/produktkonfigurator-erstellen" },
    ],
  },

  "/ki-automation-unternehmen": {
    path: "/ki-automation-unternehmen",
    title: "KI-Automation für Unternehmen — Workflows & Integrationen | MAGICKS",
    description:
      "KI-Automationen und Workflows für Unternehmen, die Abläufe beschleunigen und manuelle Arbeit reduzieren wollen — sinnvoll eingesetzte KI von MAGICKS Studio.",
    ogType: "article",
    ogImageAlt: "KI-Automation für Unternehmen — MAGICKS Studio",
    service: {
      name: "KI-Automation für Unternehmen",
      serviceType: "AI Workflow Automation",
      description:
        "KI-Automationen, Workflow-Integrationen und LLM-Anbindungen für KMU und Mittelstand — DSGVO-konform, übergabefähig, planbar.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "KI-Automation für Unternehmen", path: "/ki-automation-unternehmen" },
    ],
  },

  "/seo-sichtbarkeit": {
    path: "/seo-sichtbarkeit",
    title: "SEO & Sichtbarkeit für Unternehmen | MAGICKS Studio Kassel",
    description:
      "MAGICKS optimiert Seitenstruktur, Inhalte, Technik, Ladezeit und lokale Sichtbarkeit, damit Unternehmen besser gefunden, verstanden und angefragt werden.",
    ogType: "article",
    ogImageAlt: "SEO & Sichtbarkeit für Unternehmen — MAGICKS Studio Kassel",
    service: {
      name: "SEO & Sichtbarkeit",
      serviceType: "Search Engine Optimization",
      description:
        "SEO für Seitenstruktur, Inhalte, Technik, Ladezeit, interne Verlinkung und lokale Sichtbarkeit, damit Unternehmen gefunden, verstanden und angefragt werden.",
      local: true,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "SEO & Sichtbarkeit", path: "/seo-sichtbarkeit" },
    ],
  },

  "/content-bildwelt-medien": {
    path: "/content-bildwelt-medien",
    title: "Content, Bildwelt & Medien für Websites | MAGICKS Studio",
    description:
      "MAGICKS entwickelt Website-Texte, Bildkonzepte, Foto-, Video-, Motion- und 3D-Visuals, die digitale Auftritte verständlicher, hochwertiger und eigenständiger machen.",
    ogType: "article",
    ogImageAlt: "Content, Bildwelt & Medien für Websites — MAGICKS Studio",
    service: {
      name: "Content, Bildwelt & Medien",
      serviceType: "Content & Visual Production",
      description:
        "Website-Texte, Bildkonzepte, Foto, Video, Motion Design und 3D-Visuals als unterstützende Bausteine für hochwertige digitale Auftritte.",
      local: false,
    },
    breadcrumbs: [
      { name: "Leistungen", path: "/leistungen" },
      { name: "Content, Bildwelt & Medien", path: "/content-bildwelt-medien" },
    ],
  },
};

/**
 * Static routes that belong in sitemap.xml.
 *
 * `noindex` pages (Impressum, Datenschutz) are intentionally excluded.
 * The dynamic `/projekte/:slug` routes are *not* listed here — the
 * build-time sitemap plugin (`vite.config.ts`) reads featured projects
 * directly from `src/app/data/projects.ts` and appends them
 * automatically, so adding a new project requires no edit here.
 *
 * The committed `public/sitemap.xml` is regenerated on every
 * `npm run build` by the same plugin so the deploy artifact stays in
 * sync without manual maintenance.
 */
export const SITEMAP_PATHS: string[] = [
  "/",
  "/leistungen",
  "/projekte",
  "/ueber-uns",
  "/kontakt",
  "/websites-landingpages",
  "/shops-produktkonfiguratoren",
  "/web-software",
  "/ki-automationen-integrationen",
  "/website-im-abo",
  "/website-starter",
  "/webdesign-kassel",
  "/landingpages-kassel",
  "/produktkonfigurator-erstellen",
  "/ki-automation-unternehmen",
  "/seo-sichtbarkeit",
  "/content-bildwelt-medien",
];

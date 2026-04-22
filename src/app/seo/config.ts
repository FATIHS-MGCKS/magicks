/**
 * Central SEO configuration — one source of truth per route.
 *
 * Canonical host:
 *   Change `SITE_URL` below if the production domain changes. All
 *   canonical URLs, `og:url` tags, and sitemap entries derive from it.
 *
 * Default OG image:
 *   `/og-default.svg` ships with the build as an infrastructure-only
 *   brand placeholder (1200×630 wordmark on #0A0A0A). Pages may
 *   override via their own `ogImage` field. When a higher-fidelity
 *   PNG becomes available, drop it in as `/og-default.png` and flip
 *   `DEFAULT_OG_IMAGE` below — no other code needs to change.
 */

export const SITE_URL = "https://magicks.studio";
export const SITE_NAME = "MAGICKS Studio";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;
/** Historical fallback — kept so older references still resolve. */
export const FALLBACK_OG_IMAGE = `${SITE_URL}/favicon.svg`;

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
  /** Optional robots directive override. Defaults to "index, follow". */
  robots?: string;
};

/**
 * Static page SEO map. Dynamic routes (e.g. /projekte/:slug) compose
 * their SEO config in the page component itself.
 */
export const SEO_BY_PATH: Record<string, SeoConfig> = {
  "/": {
    path: "/",
    title: "MAGICKS Studio – Websites, Shops, Web-Software & KI-Automationen",
    description:
      "MAGICKS Studio entwickelt Websites, Shops, Produktkonfiguratoren, Web-Software und KI-Automationen – designstark, technisch sauber und schnell umgesetzt.",
  },

  "/leistungen": {
    path: "/leistungen",
    title: "Leistungen von MAGICKS Studio – Websites, Shops, Software & Automationen",
    description:
      "Von Websites und Landing Pages bis zu Shops, Produktkonfiguratoren, Web-Software und KI-Automationen: Hier findest du die Leistungen von MAGICKS Studio.",
  },

  "/projekte": {
    path: "/projekte",
    title: "Projekte von MAGICKS Studio – Ausgewählte digitale Arbeiten",
    description:
      "Ausgewählte Projekte, Konzepte und digitale Umsetzungen von MAGICKS Studio – mit Fokus auf Design, Funktion und Wirkung.",
  },

  "/ueber-uns": {
    path: "/ueber-uns",
    title: "Über uns – MAGICKS Studio",
    description:
      "MAGICKS Studio ist ein kreatives Tech-Studio für Websites, digitale Lösungen und smarte Automationen – direkt, anspruchsvoll und ohne Agentur-Standard.",
  },

  "/kontakt": {
    path: "/kontakt",
    title: "Kontakt – MAGICKS Studio",
    description:
      "Projekt anfragen, Idee besprechen oder unverbindlich austauschen – hier erreichst du MAGICKS Studio.",
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
    title: "Websites & Landing Pages – MAGICKS Studio",
    description:
      "Wir entwickeln Websites und Landing Pages, die nicht nur gut aussehen, sondern klar führen, schnell laden und Ergebnisse liefern.",
  },

  "/shops-produktkonfiguratoren": {
    path: "/shops-produktkonfiguratoren",
    title: "Shops & Produktkonfiguratoren – MAGICKS Studio",
    description:
      "MAGICKS Studio entwickelt moderne Shops und Produktkonfiguratoren mit starkem Design, sauberer UX und technischer Präzision.",
  },

  "/web-software": {
    path: "/web-software",
    title: "Web-Software – MAGICKS Studio",
    description:
      "Individuelle Web-Software, Dashboards und digitale Plattformen – gebaut für Prozesse, Teams und Wachstum.",
  },

  "/ki-automationen-integrationen": {
    path: "/ki-automationen-integrationen",
    title: "KI-Automationen & Integrationen – MAGICKS Studio",
    description:
      "Smarte Automationen, KI-Workflows und Integrationen, die manuelle Arbeit reduzieren und Prozesse sauber verbinden.",
  },

  "/website-im-abo": {
    path: "/website-im-abo",
    title: "Website im Abo – MAGICKS Studio",
    description:
      "Professionelle Website statt hoher Einmalzahlung: planbar monatlich, sauber umgesetzt und technisch betreut von MAGICKS Studio.",
  },

  "/webdesign-kassel": {
    path: "/webdesign-kassel",
    title: "Webdesign Kassel – MAGICKS Studio",
    description:
      "MAGICKS Studio entwickelt hochwertige Websites, Landing Pages und digitale Lösungen für Unternehmen in Kassel und darüber hinaus.",
  },

  "/landingpages-kassel": {
    path: "/landingpages-kassel",
    title: "Landing Pages Kassel – MAGICKS Studio",
    description:
      "Conversion-starke Landing Pages für Unternehmen aus Kassel – designstark, schnell und technisch sauber umgesetzt.",
  },

  "/produktkonfigurator-erstellen": {
    path: "/produktkonfigurator-erstellen",
    title: "3D Produktkonfigurator erstellen lassen – MAGICKS Studio",
    description:
      "MAGICKS Studio entwickelt 3D-Produktkonfiguratoren für Unternehmen und die Bau-Branche – technisch sauber, visuell hochwertig und klar auf Anfrage, Vertrieb und Nutzerführung ausgerichtet.",
  },

  "/ki-automation-unternehmen": {
    path: "/ki-automation-unternehmen",
    title: "KI-Automation für Unternehmen – MAGICKS Studio",
    description:
      "KI-Automationen und smarte Workflows für Unternehmen, die Abläufe beschleunigen und manuelle Arbeit reduzieren wollen.",
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
 * The emitted sitemap lives at `dist/sitemap.xml` and is regenerated
 * on every `npm run build`. There is no committed copy.
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
  "/webdesign-kassel",
  "/landingpages-kassel",
  "/produktkonfigurator-erstellen",
  "/ki-automation-unternehmen",
];

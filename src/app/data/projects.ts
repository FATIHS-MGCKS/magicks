/* ------------------------------------------------------------------
 * Project data architecture — MAGICKS Studio case studies.
 *
 * Design principles:
 *   1. Qualitative by default. Metrics, KPIs, rankings etc. are
 *      strictly opt-in and are never rendered unless manually set.
 *      No project ships with fabricated outcome data.
 *   2. Image-optional. Both `cover` and `gallery` are optional; when
 *      absent, the pages render premium empty-state plates so a case
 *      study never looks "broken" — just staged for manual enrichment.
 *   3. Editorial free-form `case[]`. Each section carries a light
 *      folio / eyebrow / title, and then either prose (`body`) or a
 *      bullet list (`items`), optionally with a layout variant. This
 *      is flexible enough to carry almost any real case study without
 *      ever hardcoding a fixed schema of "Problem / Solution / KPIs".
 *   4. Extensible. Add a project by appending an entry to `PROJECTS`.
 *      The overview and detail pages adapt without layout work.
 *
 * Seeding policy:
 *   The seed list contains only real client projects. Demo projects
 *   with invented metrics from the previous iteration have been
 *   removed — they violated the MAGICKS brief of not fabricating
 *   outcome data.
 * ------------------------------------------------------------------ */

/** Primary project category. Used as the hero badge + filter surface. */
export type ProjectCategory =
  | "Website"
  | "Landing Page"
  | "Konfigurator"
  | "Shop"
  | "Web Software"
  | "Dashboard"
  | "KI · Automation";

/** Aspect ratio hint for layout plates. Strings map to Tailwind utility
 * classes in the consumer component (kept as strings so additions
 * require no code changes — the component falls back to "4/3"). */
export type ProjectImageAspect =
  | "16/9"
  | "21/9"
  | "4/3"
  | "3/2"
  | "1/1"
  | "9/16"
  | "3/4";

export type ProjectImage = {
  /** Public path or remote URL. */
  src: string;
  /** Descriptive alt text. Required so galleries stay accessible. */
  alt: string;
  /** Optional editorial caption shown beneath the plate. */
  caption?: string;
  /** Layout-ratio hint. Defaults to "4/3" when absent. */
  aspect?: ProjectImageAspect;
  /** Grid-column span hint for the detail gallery. 1–12; default 6 (half). */
  span?: 4 | 6 | 8 | 12;
};

/** A single editorial body section on the detail page. */
export type ProjectCaseSection = {
  /** Folio number, e.g. "01". If omitted, auto-numbered by the page. */
  folio?: string;
  /** Monospace micro-label above the heading. */
  eyebrow?: string;
  /** Section heading (H2 on the detail page). */
  title: string;
  /** Optional italic pivot phrase appended to the heading, rendered
   * after an em-dash. Useful for the MAGICKS typographic cadence. */
  titleItalic?: string;
  /** One or more body paragraphs. String renders as a single paragraph;
   * array renders each entry as its own paragraph. */
  body?: string | string[];
  /** Optional bullet list rendered in editorial register style, not
   * as a plain `ul`. */
  items?: string[];
  /** Layout variant:
   *    "default"  → two-column register (left folio, right content)
   *    "centered" → ceremonial centered block (for statement sections)
   *    "plate"    → full-width hairline-bordered plate (for lists)
   */
  variant?: "default" | "centered" | "plate";
};

/** Internal cross-link (e.g. "Passende Leistungen" block). */
export type ProjectRelatedLink = {
  /** Route path — must start with "/". */
  to: string;
  /** Anchor label (e.g. "Websites & Landing Pages"). */
  label: string;
  /** Optional editorial micro-eyebrow. */
  eyebrow?: string;
};

/** Optional verified project metric.
 *
 * STRICT RULE: Only set these when the value is actually verified by
 * MAGICKS — e.g. measured LCP, client-reported lift, audited ranking.
 * Never invent. If a metric cannot be truthfully sourced, leave the
 * `metrics` field off entirely; the detail page will simply skip the
 * metrics strip.
 */
export type ProjectMetric = {
  value: string;
  label: string;
  /** Optional qualifier, e.g. "LCP P75 · verifiziert". */
  note?: string;
};

export type Project = {
  /** URL slug used at /projekte/:slug. */
  slug: string;
  /** Canonical project name. Used in H1 + SEO title pattern. */
  title: string;
  /** Short one-line descriptor for overview teasers. */
  teaser: string;
  /** Primary intro paragraph — shown on detail hero + overview card. */
  intro: string;
  /** Optional supporting intro (e.g. positioning / industry facts). */
  supportingIntro?: string;

  /** Primary category, rendered as the hero category badge. */
  category: ProjectCategory;
  /** Industry / sector label (editorial, free-form). */
  industry?: string;
  /** Project year or timeframe, e.g. "2025" or "MMXXVI". Free-form. */
  year?: string;
  /** Verified public URL, rendered as a link if present. */
  publicUrl?: string;

  /** If false or absent, project is hidden from the overview listing.
   * Allows MAGICKS to stage draft entries in the data file before
   * they're ready to be public. */
  featured?: boolean;

  /** Cover image for hero + overview card. Optional; empty state
   * renders a premium staged plate. */
  cover?: ProjectImage;

  /** Detail-page gallery. If empty or omitted, the detail page renders
   * a pre-structured grid of empty plates ready for manual image
   * enrichment — no layout change required later. */
  gallery?: ProjectImage[];

  /** Free-form case-study body sections, rendered in order. */
  case: ProjectCaseSection[];

  /** Services delivered in this engagement. Rendered as editorial
   * "Leistung im Überblick" block, not a plain tag chip. */
  services?: string[];

  /** Optional tech stack (shown only if present). */
  stack?: string[];

  /** Optional high-level goals — qualitative, never fake KPIs. */
  goals?: string[];

  /** Optional qualitative outcomes. For hard verified numbers use
   * `metrics[]` instead. */
  outcomes?: string[];

  /** Optional verified metrics — never invented. Opt-in. */
  metrics?: ProjectMetric[];

  /** Related service routes shown on the detail page as an editorial
   * anchor block — the cross-link surface into the rest of the site. */
  relatedServices?: ProjectRelatedLink[];

  /** Optional SEO overrides. Defaults follow the brief's pattern:
   *   title:       "{title} – Projekt von MAGICKS Studio"
   *   description: "Einblick in {title}: Konzept, Design, Entwicklung
   *                 und Umsetzung durch MAGICKS Studio."
   */
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
};

/* ------------------------------------------------------------------
 * Seed — real projects only. Do not add demo/fake entries here.
 * ------------------------------------------------------------------ */

export const PROJECTS: Project[] = [
  {
    slug: "renova-strassensanierung",
    title: "Renova Straßensanierung",
    teaser:
      "Klarer, hochwertiger Webauftritt für Straßensanierung und Betoninstandsetzung.",
    intro:
      "Ein klarer, sichtbarer und hochwertiger Webauftritt für einen Anbieter im Bereich Straßensanierung und Betoninstandsetzung.",
    supportingIntro:
      "Die Website positioniert Renova rund um Epoxidharz-Reparaturmörtel, Betoninstandsetzung und hochwertige Materialien für professionell belastete Betonflächen.",

    category: "Website",
    industry: "Straßensanierung · Betoninstandsetzung",
    publicUrl: "https://renova-strassensanierung.de",

    featured: true,

    /* Cover image — actual hero composition of the live Renova site:
     * a Bauarbeiter in safety gear repairing a concrete deck with a
     * trowel, framed under the headline "Wenn Beton aufgibt, übernimmt
     * Epox 130 Pro". The shot makes the project read as a real launch
     * rather than a stock material plate. */
    cover: {
      src: "/media/projects/renova-strassensanierung/cover.webp",
      alt: "Renova-Website Hero: Bauarbeiter mit Helm und Warnkleidung repariert mit einer Spachtel eine Betonfahrbahn auf einer Brücke; Headline „Wenn Beton aufgibt, übernimmt Epox 130 Pro“ links im Bild, primäre und sekundäre CTA darunter.",
      caption: "Hero · Renova Website",
      aspect: "16/9",
    },

    /* Gallery — editorial material plates plus a process plate from
     * the live site. Together with the cover these read as a photo
     * essay about the craft (macro · context · process · …). The
     * detail page auto-pads remaining slots with premium empty plates
     * so future MAGICKS screenshots drop in without layout work. */
    gallery: [
      {
        src: "/media/projects/renova-strassensanierung/detail-01.webp",
        alt: "Weiter Kontextblick auf eine frisch mit Epoxidharz versiegelte Dehnungsfuge auf einem industriellen Betonbelag bei warmem, flach einfallendem Abendlicht; im Hintergrund unscharfe Industriekulisse in Dämmerung.",
        caption: "Kontext · Versiegelte Fuge · Abendlicht",
        aspect: "16/9",
        span: 8,
      },
      {
        src: "/media/projects/renova-strassensanierung/detail-02.webp",
        alt: "Renova-Website Sektion „Vom Schaden zum Ergebnis“: drei Schritt-Karten (01 Vorher · Beschädigter Beton, 02 Bearbeitung · Epox 130 Pro auftragen, 03 Ergebnis · Dauerhafte Reparatur) mit nummerierten Bildern und kurzen Beschreibungstexten, darunter ein Panel mit den technischen Eigenschaften des Reparaturmörtels.",
        caption: "Anwendungsbeispiel · Vom Schaden zum Ergebnis",
        aspect: "4/3",
        span: 6,
      },
      {
        src: "/media/projects/renova-strassensanierung/detail-03.webp",
        alt: "Renova-Website Sektion „Typische Einsatzbereiche“: Übersichtsraster aus sechs Anwendungs-Karten — Industrieböden, Werkstatt/Produktion, Parkhaus/Parkdeck, Rampen/Verladerampen, Kommunale Betonflächen und Bunkersanierung — jeweils mit Beton-Fotografie und gelb akzentuiertem Label, eingerahmt von der Headline „Typische Einsatzbereiche“ und der Erklärung, dass Epoxidharz-Systeme überall dort zum Einsatz kommen, wo Beton dauerhaft repariert werden muss.",
        caption: "Einsatzbereiche · Sechs Anwendungsfelder",
        aspect: "4/3",
        span: 6,
      },
    ],

    case: [
      {
        folio: "01",
        eyebrow: "Projektziel",
        title: "Projektziel",
        body: [
          "Für Renova sollte ein digitaler Auftritt entstehen, der ruhig, hochwertig und vertrauenswürdig wirkt — mit klarer Struktur, starker Bildwirkung und einer sauberen SEO-Basis.",
          "Der Fokus lag darauf, das Angebot sichtbar zu machen, die Qualität des Unternehmens digital besser zu transportieren und die Website so aufzubauen, dass sie nicht nur ordentlich aussieht, sondern auch langfristig sauber auffindbar ist.",
        ],
      },
      {
        folio: "02",
        eyebrow: "Fokus",
        title: "Worauf der Fokus lag",
        variant: "plate",
        items: [
          "dezenter, hochwertiger Auftritt",
          "starke Bildwirkung",
          "klare Seitenstruktur",
          "gute Lesbarkeit",
          "vertrauenswürdige Präsentation",
          "saubere SEO-Basis",
          "Sichtbarkeit für relevante Suchanfragen",
          "ruhige, professionelle Nutzerführung",
        ],
      },
      {
        folio: "03",
        eyebrow: "Anspruch",
        title: "Was die Seite leisten sollte",
        // Ceremonial centered treatment — § 03 sits as the pivotal
        // statement-of-intent between the practical Fokus register
        // and the tactile Design section. Variety in variant makes
        // the page breathe differently here.
        variant: "centered",
        body: [
          "Die Website sollte nicht laut oder überladen wirken.",
          "Sie sollte Vertrauen aufbauen, Leistungen und Anwendungsbereiche verständlich darstellen und durch Bildmaterial, Struktur und Inhalt einen professionellen Eindruck hinterlassen.",
          "Gleichzeitig sollte die Seite technisch und inhaltlich so aufgesetzt sein, dass sie eine starke Grundlage für SEO und organische Sichtbarkeit schafft.",
        ],
      },
      {
        folio: "04",
        eyebrow: "Gestaltung",
        title: "Design & Wirkung",
        body: [
          "Visuell sollte der Auftritt sauber, dezent und hochwertig bleiben.",
          "Keine unnötige Reizüberflutung, sondern ein klarer Aufbau mit starker Bildsprache, ruhiger Typografie und einer professionellen Gesamtwirkung.",
          "Gerade bei einem Unternehmen aus dem Bereich Straßensanierung und Betoninstandsetzung war wichtig, dass die Website glaubwürdig wirkt und nicht nach einer austauschbaren Standardlösung aussieht.",
        ],
      },
      {
        folio: "05",
        eyebrow: "Sichtbarkeit",
        title: "SEO-Grundlage",
        body: [
          "Neben Gestaltung und Nutzerführung spielte auch die Sichtbarkeit eine wichtige Rolle.",
          "Die Seite sollte so aufgebaut sein, dass Leistungen, Themen und Anwendungsbereiche klar verständlich und suchmaschinenfreundlich strukturiert dargestellt werden.",
          "Nicht als SEO-Spielerei, sondern als solide Grundlage für langfristige Auffindbarkeit.",
        ],
      },
    ],

    services: [
      "Webdesign",
      "strukturierte Inhaltsaufbereitung",
      "visuelle Präsentation",
      "SEO-freundliche Grundstruktur",
      "hochwertige, dezente Gesamtwirkung",
    ],

    relatedServices: [
      {
        to: "/websites-landingpages",
        eyebrow: "Verwandt · Kern",
        label: "Websites & Landing Pages",
      },
      {
        to: "/webdesign-kassel",
        eyebrow: "Verwandt · Region",
        label: "Webdesign Kassel",
      },
      {
        to: "/leistungen",
        eyebrow: "Studio · Übersicht",
        label: "Leistungen",
      },
      {
        to: "/kontakt",
        eyebrow: "Studio · Direkt",
        label: "Kontakt",
      },
    ],

    // metrics: intentionally omitted. No fabricated outcome data.
    // Add verified numbers here later when available.
  },
];

/* ------------------------------------------------------------------
 * Selectors
 * ------------------------------------------------------------------ */

/** Find a project by slug. Returns `undefined` when not found. */
export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Projects surfaced on the public /projekte overview.
 * A project is listed when `featured === true`. */
export function featuredProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

/** SEO title pattern from the brief. */
export function projectSeoTitle(project: Project): string {
  return project.seo?.title ?? `${project.title} – Projekt von MAGICKS Studio`;
}

/** SEO description pattern from the brief. */
export function projectSeoDescription(project: Project): string {
  return (
    project.seo?.description ??
    `Einblick in ${project.title}: Konzept, Design, Entwicklung und Umsetzung durch MAGICKS Studio.`
  );
}

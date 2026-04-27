import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChapterMarker } from "../../components/home/ChapterMarker";
import { SectionTransition } from "../../components/service/SectionTransition";
import { EditorialAnchor } from "../../components/service/EditorialAnchor";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { registerGsap } from "../../lib/gsap";
import { presenceEnvelope, rackFocusTrack } from "../../lib/scrollMotion";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /landingpages-kassel — bespoke editorial landing page.
 *
 * Design intent: a premium campaign-brief, not a local-SEO page.
 * Where /webdesign-kassel uses a "Studio · Bureau · Dateline" idiom
 * with cartographic coordinates, this page adopts a distinct
 * "Campaign · Sheet · Focal Axis" idiom built around a conversion
 * trajectory (Intent → Fokus → Anfrage). Same design family, a
 * sharper, more instrumented register.
 *
 * Signature motifs used only here:
 *   - Focal axis gutter in the hero (Intent / Fokus / Anfrage — middle
 *     stop filled), replacing the coordinate gutter.
 *   - Campaign Sheet dateline strip ("SHEET · LP — STUDIO · KASSEL ·
 *     MMXXVI") replacing the Bureau dateline.
 *   - Noun-register strip at the top of § 02 Vokabular to frame the
 *     semantic-SEO section as an editor's terminology note.
 *   - Trajectory rule (" · —— ◆ —— · ") echoed between § 05's two
 *     paragraphs and above the final CTA.
 *   - Statement triptych ("Landing Pages mit Ziel.", etc.) as a
 *     three-column manifesto in § 06.
 *   - 2×2 typographic link grid in § 07 (/websites-landingpages,
 *     /webdesign-kassel, /leistungen, /kontakt) — no cross-link
 *     gatefolds, kept dense and confident.
 *
 * Copy discipline: every H1, intro paragraph, section headline,
 * body paragraph, list item, statement line and CTA is preserved
 * verbatim from the brief. All scaffolding (folio numerals, chapter
 * markers, focal-axis labels, micro-eyebrows, triptych numerals,
 * cartouche fields) is editorial and matches the convention used
 * across every bespoke MAGICKS page.
 * ------------------------------------------------------------------ */

/* =======  VERBATIM COPY  =======
 * Kept as module-level constants so the "do not change copy"
 * discipline is auditable at a glance — diff this block against the
 * brief and every string should match exactly.
 */

const CHAPTER = { num: "SEO", label: "Landing Pages Kassel" } as const;

const HERO_EYEBROW = "Campaign · Kassel & Umgebung";

/**
 * H1 split across three lines for typographic rhythm. The pivot at
 * "sondern" hands the conversion promise its own visual register.
 *   Line A (regular):  Landing Pages in Kassel,
 *   Line B (italic · muted):  die nicht nur gut aussehen,
 *   Line C (italic · brighter): sondern Anfragen erzeugen.
 */
const H1_LINE_A_WORDS = ["Landing", "Pages", "in", "Kassel,"];
const H1_LINE_B_WORDS = ["die", "nicht", "nur", "gut", "aussehen,"];
const H1_LINE_C_WORDS = ["sondern", "Anfragen", "erzeugen."];

const HERO_LEAD_SENTENCE_1 =
  "Wenn du in Kassel oder Umgebung eine Landing Page brauchst, geht es nicht einfach nur um einen schönen Screen.";
const HERO_LEAD_SENTENCE_2 =
  "Es geht darum, ein Angebot klar zu positionieren, Nutzer sauber zu führen und aus Aufmerksamkeit eine Anfrage, einen Lead oder einen nächsten Schritt zu machen.";
const HERO_LEAD_SENTENCE_3 =
  "Genau dafür entwickeln wir bei MAGICKS Studio Landing Pages, die designstark wirken, technisch sauber umgesetzt sind und im Alltag auf Conversion einzahlen.";

/* -- § 01 Prinzip --
 * Headline rendered inline in JSX with an italic pivot on the
 * second half: "Eine Landing Page ist {italic}keine normale
 * Unterseite.{/italic}" — preserves the verbatim sentence exactly.
 */
const PRINZIP_P1_A = "Eine gute Landing Page hat ein klares Ziel.";
const PRINZIP_P1_B =
  "Sie soll nicht alles gleichzeitig erklären, sondern gezielt führen, Vertrauen aufbauen und Nutzer zu einer konkreten Handlung bewegen.";
const PRINZIP_P2_A =
  "Deshalb entwickeln wir Landing Pages nicht wie eine normale Webseite oder Homepage.";
const PRINZIP_P2_B =
  "Wir strukturieren sie auf Conversion, Klarheit, Tempo und Wirkung — damit aus Besuchern deutlich eher echte Anfragen oder qualifizierte Leads werden.";
/* New, restrained framing line — added without changing the
 * existing two-paragraph rhythm. Reads as a closing note that
 * frames a Landing Page as a focused enquiry/sales system rather
 * than a single subpage. */
const PRINZIP_P3_A =
  "Eine Landing Page funktioniert nur dann gut, wenn Angebot, Text, Bildwelt, CTA und Technik zusammenarbeiten.";
const PRINZIP_P3_B =
  "Deshalb betrachten wir sie nicht als einzelne Unterseite, sondern als fokussiertes Verkaufs- oder Anfrage-System.";

/* Campaign-vs-local-search clarifier — used as a quiet note above
 * the § 04 Leistung deliverables ledger. Keeps the brief's
 * wording verbatim. */
const LEISTUNG_INTRO =
  "Je nach Ziel wird die Landing Page für Kampagnen, lokale Suche oder beides aufgebaut.";

/* -- § 02 Vokabular (semantic-SEO reprise) -- */
const VOKABULAR_TOKENS = ["Landing Page", "Landingpage", "Webseite", "Homepage"] as const;
const VOKABULAR_HEADLINE_A =
  "Landing Page, Landingpage, Webseite oder Homepage —";
const VOKABULAR_HEADLINE_B = "am Ende muss sie funktionieren.";
const VOKABULAR_P1_A = "Manche suchen nach einer Landing Page.";
const VOKABULAR_P1_B =
  "Andere nach einer Landingpage, einer Webseite oder einer Homepage für ein konkretes Angebot.";
const VOKABULAR_P2_A =
  "Am Ende ist entscheidend, dass der Auftritt klar führt, hochwertig wirkt und Nutzer nicht verliert.";
const VOKABULAR_P2_B = "Genau das bauen wir bei MAGICKS Studio:";
const VOKABULAR_P2_C =
  "digitale Seiten für Unternehmen in Kassel, die nicht nur gut aussehen, sondern im richtigen Moment die richtige Handlung auslösen.";

/* -- § 03 Bezug (audience) -- */
const BEZUG_HEADLINE =
  "Landing Pages für Unternehmen in Kassel mit klarem Ziel";
const BEZUG_INTRO =
  "Diese Leistung ist für Unternehmen, die ein konkretes Angebot, eine Kampagne, eine Dienstleistung oder ein Produkt digital sauber platzieren wollen.";
const BEZUG_LEADIN = "Zum Beispiel, wenn du:";
const BEZUG_ITEMS: string[] = [
  "gezielt Anfragen oder Leads erzeugen willst",
  "eine Seite für ein bestimmtes Angebot brauchst",
  "Kampagnen, Ads oder Performance-Marketing besser unterstützen willst",
  "ein Produkt oder eine Leistung verständlicher und fokussierter präsentieren möchtest",
  "eine bestehende Website hast, aber für Conversion eine eigenständige Seite brauchst",
];

/* -- § 04 Leistung (deliverables ledger) -- */
const LEISTUNG_HEADLINE = "Was wir für dich umsetzen";
const LEISTUNG_ITEMS: { title: string; body: string }[] = [
  {
    title: "Landing Pages mit Conversion-Fokus",
    body:
      "Klare Seiten mit starker Struktur, sauberer Nutzerführung und einem eindeutigen Ziel.",
  },
  {
    title: "Design mit Wirkung",
    body:
      "Hochwertige Gestaltung, die Vertrauen aufbaut und dein Angebot professionell transportiert.",
  },
  {
    title: "Content, Bildwelt & Medien",
    body:
      "Texte, Bildbearbeitung, Hero-Visuals oder kurze Medienbausteine, wenn die Landing Page nicht nur technisch funktionieren, sondern sofort wirken soll.",
  },
  {
    title: "SEO- oder Kampagnenlogik",
    body:
      "Je nach Einsatz wird die Seite auf lokale Suchanfragen, Anzeigenkampagnen, klare Kontaktanfragen oder eine konkrete Angebotslogik ausgerichtet.",
  },
  {
    title: "Technische Umsetzung",
    body:
      "Schnell, responsive und sauber entwickelt — damit die Seite nicht nur gut aussieht, sondern auch performant funktioniert.",
  },
  {
    title: "Kampagnen- und Angebotsseiten",
    body: "Für konkrete Leistungen, Produkte, Aktionen oder Lead-Generierung.",
  },
  {
    title: "Klare CTA-Logik",
    body:
      "Nutzer werden nicht durch unnötige Optionen abgelenkt, sondern sinnvoll zum nächsten Schritt geführt.",
  },
  {
    title: "Integrationen",
    body:
      "Formulare, Tracking, CRM, Terminbuchung oder andere Systeme, wenn sie Teil der Landing Page Logik sind.",
  },
];

/* -- § 05 Fokus (why LP > Homepage, ceremonial) -- */
const FOKUS_HEADLINE_A = "Warum Landing Pages oft besser funktionieren";
const FOKUS_HEADLINE_B = "als eine klassische Homepage";
const FOKUS_P1_A =
  "Eine klassische Website oder Homepage muss oft vieles gleichzeitig leisten.";
const FOKUS_P1_B = "Eine Landing Page dagegen kann viel fokussierter arbeiten.";
const FOKUS_P2_A = "Sie hat ein klares Angebot, eine klare Zielgruppe und einen klaren nächsten Schritt.";
const FOKUS_P2_B =
  "Genau deshalb sind Landing Pages oft die bessere Lösung, wenn es um Kampagnen, Performance, konkrete Leistungen oder Lead-Generierung geht.";

/* -- § 06 Haltung (why Kassel companies work with MAGICKS + triptych) -- */
const HALTUNG_HEADLINE = "Warum Unternehmen in Kassel mit MAGICKS arbeiten";
const HALTUNG_P1_A = "Weil wir nicht einfach nur hübsche Seiten bauen.";
const HALTUNG_P1_B =
  "Wir entwickeln Landing Pages, die Angebot, Design, Technik und Nutzerführung sauber zusammenbringen.";
const HALTUNG_P2_A = "Direkt, klar und ohne Agentur-Standard.";
const HALTUNG_P2_B =
  "So entstehen Seiten, die hochwertig wirken, schnell laden und deutlich zielgerichteter arbeiten als eine beliebige Standardlösung.";

/** Triptych statement — three crystallised promises, one per column. */
const HALTUNG_TRIPTYCH: { roman: string; line: string }[] = [
  { roman: "i", line: "Landing Pages mit Ziel." },
  { roman: "ii", line: "Design mit Wirkung." },
  { roman: "iii", line: "Umsetzung mit Klarheit." },
];

/* -- § 07 Einbettung (not every LP stands alone, 4 internal links) -- */
const EINBETTUNG_HEADLINE = "Nicht jede Landing Page steht für sich allein.";
const EINBETTUNG_P1_A = "Manche Landing Pages sind Teil einer größeren Website.";
const EINBETTUNG_P1_B = "Manche hängen an Kampagnen.";
const EINBETTUNG_P1_C =
  "Manche sind Einstieg in einen Shop, einen Konfigurator oder ein größeres digitales System.";
const EINBETTUNG_P2 =
  "Genau deshalb schauen wir nicht nur auf die Seite selbst, sondern auch darauf, wie sie in den gesamten digitalen Auftritt eingebettet ist.";

/**
 * Einbettung link grid — 2×2. The editorial eyebrow is not prose
 * copy (it's a structural micro-label in the same spirit as the
 * folio numerals and ChapterMarker labels used across every bespoke
 * page). The anchor label is the target page's canonical name.
 */
const EINBETTUNG_LINKS: {
  to: string;
  eyebrow: string;
  label: string;
  position: string;
}[] = [
  {
    to: "/websites-landingpages",
    eyebrow: "Verwandt · Kern",
    label: "Websites & Landing Pages",
    position: "LP-A",
  },
  {
    to: "/webdesign-kassel",
    eyebrow: "Verwandt · Region",
    label: "Webdesign Kassel",
    position: "LP-B",
  },
  {
    to: "/seo-sichtbarkeit",
    eyebrow: "Verwandt · Sichtbarkeit",
    label: "SEO & Sichtbarkeit",
    position: "LP-C",
  },
  {
    to: "/content-bildwelt-medien",
    eyebrow: "Verwandt · Inhalt",
    label: "Content, Bildwelt & Medien",
    position: "LP-D",
  },
  {
    to: "/leistungen",
    eyebrow: "Studio · Übersicht",
    label: "Leistungen",
    position: "LP-E",
  },
  {
    to: "/kontakt",
    eyebrow: "Studio · Direkt",
    label: "Kontakt",
    position: "LP-F",
  },
];

/* -- § 08 Studio (direct from Kassel + CTA) --
 * Headline rendered inline in JSX with an italic pivot on the
 * second phrase: "Direkt aus Kassel. {italic}Nicht von der
 * Stange.{/italic}" — preserves the verbatim sentence exactly.
 */
const STUDIO_P1 =
  "MAGICKS Studio sitzt in Kassel und entwickelt Landing Pages, Websites und digitale Lösungen für Unternehmen mit Anspruch — lokal verankert, aber nicht lokal begrenzt.";
const STUDIO_P2 =
  "Wenn du eine Landing Page brauchst, die nicht nach Standard aussieht und im Alltag wirklich auf Anfragen einzahlt, dann lass uns sprechen.";

/* -- § END Projekt (final CTA) -- */
const FINAL_CTA_HEADLINE_A = "Bereit für eine Landing Page in Kassel,";
const FINAL_CTA_HEADLINE_B = "die mehr kann als nur gut aussehen?";
const FINAL_CTA_BODY =
  "Wir entwickeln Landing Pages, die klar führen, hochwertig wirken und aus Besuchern deutlich eher echte Anfragen machen.";

/* =======  FOCAL-AXIS STOPS  ======= */

/**
 * Conversion trajectory — three stops along the vertical gutter.
 * Middle stop is the "active" focal point (filled), flanking stops
 * are outlined. Labels use the page's natural business vocabulary
 * (Aufmerksamkeit → Fokus → Anfrage) rather than invented marketing
 * jargon. Hidden on mobile; sits just left of the hero copy on md+.
 */
const FOCAL_AXIS_STOPS: { label: string; tone: "outline" | "filled" }[] = [
  { label: "Intent", tone: "outline" },
  { label: "Fokus", tone: "filled" },
  { label: "Anfrage", tone: "outline" },
];

/* =======  PAGE-LOCAL HELPERS  ======= */

/**
 * AnatomyLabel — a single caption cell under the Focal-Axis specimen
 * plate. Three of these sit side-by-side, naming the three conversion
 * elements visible on the mockup (Überschrift · CTA · Argumente).
 * Each cell carries a small lowercase Latin tag (a/b/c), a head
 * serif label, and a tail register line in monospace.
 *
 * Kept local to this page — the anatomy caption is idiom-specific
 * to the Focal Axis plate and does not repeat anywhere else in the
 * site. Lives here to stay co-located with the section that uses it.
 */
function AnatomyLabel({
  tag,
  head,
  tail,
  align = "start",
}: {
  tag: string;
  head: string;
  tail: string;
  align?: "start" | "center" | "end";
}) {
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "end"
        ? "items-end text-right"
        : "items-start text-left";
  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      <div className="flex items-baseline gap-2">
        <span className="font-instrument text-[0.9rem] italic leading-none tracking-[-0.01em] text-white/46 sm:text-[0.95rem]">
          {tag}
        </span>
        <span aria-hidden className="h-px w-4 bg-white/22" />
        <span className="font-instrument text-[0.98rem] leading-none tracking-[-0.012em] text-white/82 sm:text-[1.05rem]">
          {head}
        </span>
      </div>
      <span className="font-mono text-[9.5px] font-medium uppercase leading-[1.5] tracking-[0.32em] text-white/42 sm:text-[10px]">
        {tail}
      </span>
    </div>
  );
}

/* =======  PAGE  ======= */

export default function LandingPagesKasselPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // -------- HERO targets --------
      const heroChapter = root.querySelector<HTMLElement>("[data-lp-chapter]");
      const heroDateline = root.querySelector<HTMLElement>("[data-lp-dateline]");
      const heroDatelineRule = root.querySelector<HTMLElement>("[data-lp-dateline-rule]");
      const heroEyebrow = root.querySelector<HTMLElement>("[data-lp-eyebrow]");
      const heroH1 = root.querySelector<HTMLElement>("[data-lp-h1]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-lp-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-lp-h1b]");
      const heroLineC = gsap.utils.toArray<HTMLElement>("[data-lp-h1c]");
      const heroLead1 = root.querySelector<HTMLElement>("[data-lp-lead1]");
      const heroLead2 = root.querySelector<HTMLElement>("[data-lp-lead2]");
      const heroLead3 = root.querySelector<HTMLElement>("[data-lp-lead3]");
      const heroCta = root.querySelector<HTMLElement>("[data-lp-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-lp-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-lp-meta]");
      const heroAxisRule = root.querySelector<HTMLElement>("[data-lp-axis-rule]");
      const heroAxisStops = gsap.utils.toArray<HTMLElement>("[data-lp-axis-stop]");
      const heroCredit = root.querySelector<HTMLElement>("[data-lp-credit]");

      // -------- Scroll reveals --------
      const reveals = gsap.utils.toArray<HTMLElement>("[data-lp-reveal]");
      const vokabularTokens = gsap.utils.toArray<HTMLElement>("[data-lp-vtoken]");
      const fokusLineA = gsap.utils.toArray<HTMLElement>("[data-lp-fokusA]");
      const fokusLineB = gsap.utils.toArray<HTMLElement>("[data-lp-fokusB]");
      const triptych = gsap.utils.toArray<HTMLElement>("[data-lp-triptych]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-lp-finalA]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-lp-finalB]");
      const finalRule = root.querySelector<HTMLElement>("[data-lp-finalrule]");
      const finalCta = root.querySelector<HTMLElement>("[data-lp-finalcta]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-lp-finalledger]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            heroDateline,
            heroDatelineRule,
            heroEyebrow,
            ...heroLineA,
            ...heroLineB,
            ...heroLineC,
            heroLead1,
            heroLead2,
            heroLead3,
            heroCta,
            heroCtaRule,
            ...heroMeta,
            heroAxisRule,
            ...heroAxisStops,
            heroCredit,
            ...reveals,
            ...vokabularTokens,
            ...fokusLineA,
            ...fokusLineB,
            ...triptych,
            ...finalLineA,
            ...finalLineB,
            finalRule,
            finalCta,
            ...finalLedger,
          ],
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scaleX: 1,
            scaleY: 1,
            letterSpacing: "normal",
          },
        );
        return;
      }

      // -------- Hero choreography --------
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set(heroDatelineRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroDateline, { opacity: 0, y: 8 });
      gsap.set(heroEyebrow, { opacity: 0, y: 10 });
      gsap.set([...heroLineA, ...heroLineB, ...heroLineC], {
        yPercent: 118,
        opacity: 0,
      });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead1, { opacity: 0, y: 14 });
      gsap.set(heroLead2, { opacity: 0, y: 14 });
      gsap.set(heroLead3, { opacity: 0, y: 14 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroAxisRule, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(heroAxisStops, { opacity: 0, scale: 0.82 });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.1, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.75 }, 0)
        .to(heroDatelineRule, { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.16)
        .to(heroDateline, { opacity: 1, y: 0, duration: 0.7 }, 0.32)
        .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0.36)
        .to(
          heroLineA,
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.068, ease: "power4.out" },
          0.48,
        )
        .to(
          heroLineB,
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.062, ease: "power4.out" },
          0.74,
        )
        .to(
          heroLineC,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.062, ease: "power4.out" },
          0.98,
        )
        .to(heroH1, { letterSpacing: "-0.035em", duration: 1.45, ease: "power2.out" }, 0.55)
        .to(heroLead1, { opacity: 1, y: 0, duration: 0.85 }, 1.3)
        .to(heroLead2, { opacity: 1, y: 0, duration: 0.85 }, 1.42)
        .to(heroLead3, { opacity: 1, y: 0, duration: 0.85 }, 1.54)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.8 }, 1.68)
        .to(heroCtaRule, { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 1.76)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 }, 1.85)
        .to(heroAxisRule, { scaleY: 1, duration: 1.05, ease: "power2.inOut" }, 1.95)
        .to(
          heroAxisStops,
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: "power3.out",
          },
          2.2,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 0.8 }, 2.4);

      /* -------- Generic scroll reveals — bidirectional envelope --------
       * /landingpages-kassel is conversion-focused, so the reveals are
       * a touch tighter than /webdesign-kassel: entry starts a bit
       * later and releases a bit sooner, giving each block a crisper
       * focus window without becoming aggressive. */
      presenceEnvelope(reveals, {
        start: "top 88%",
        end: "bottom 14%",
        yFrom: 22,
        yTo: -14,
        blur: 4,
        holdRatio: 0.52,
        scrub: 0.95,
      });

      /* -------- § 02 Vokabular — scroll-coupled noun register -------- */
      if (vokabularTokens.length) {
        const vSection =
          (vokabularTokens[0] as HTMLElement).closest("section") ?? vokabularTokens[0];
        gsap.set(vokabularTokens, { opacity: 0, y: 14, filter: "blur(4px)" });
        gsap.to(vokabularTokens, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: vSection,
            start: "top 82%",
            end: "top 30%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* -------- § 05 Fokus — two-line H2 rising into focus --------
       * Masked line lifts, scroll-driven, fully bidirectional. The
       * reader pulls the focus into place rather than receiving a
       * flash reveal. Gentle release on exit keeps the statement
       * legible but no longer demanding once the next section
       * arrives. */
      if (fokusLineA.length || fokusLineB.length) {
        const fokusSection =
          (fokusLineA[0] as HTMLElement | undefined)?.closest("section") ??
          (fokusLineB[0] as HTMLElement | undefined)?.closest("section") ??
          fokusLineA[0] ??
          fokusLineB[0];

        const fokusAll = [...fokusLineA, ...fokusLineB];
        gsap.set(fokusAll, { yPercent: 118, opacity: 0 });
        gsap.to(fokusAll, {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.09,
          scrollTrigger: {
            trigger: fokusSection,
            start: "top 82%",
            end: "top 30%",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(fokusAll, {
          opacity: 0.3,
          ease: "none",
          stagger: 0.03,
          scrollTrigger: {
            trigger: fokusSection,
            start: "bottom 52%",
            end: "bottom 0%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* -------- § 06 Triptych — three-column focus track --------
       * Each of the three statements now receives its own envelope,
       * staggered through the entry zone so they read as a paced
       * triad rather than a single stagger. */
      if (triptych.length) {
        presenceEnvelope(triptych, {
          start: "top 88%",
          end: "bottom 14%",
          yFrom: 22,
          yTo: -14,
          blur: 4,
          holdRatio: 0.54,
          stagger: 0.14,
          scrub: 1.0,
        });
      }

      /* -------- § END Final CTA — scroll-coupled sign-off --------
       * Lines lift, centre rule draws, CTA gathers presence, ledger
       * details hold in a focus track. All scrub-driven; no spring
       * easing; reversible throughout. */
      if (finalLineA.length || finalLineB.length) {
        const finalSection =
          (finalLineA[0] as HTMLElement | undefined)?.closest("section") ??
          (finalLineB[0] as HTMLElement | undefined)?.closest("section") ??
          finalLineA[0] ??
          finalLineB[0];

        gsap.set([...finalLineA, ...finalLineB], {
          yPercent: 36,
          opacity: 0,
          filter: "blur(6px)",
        });
        gsap.to([...finalLineA, ...finalLineB], {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.09,
          scrollTrigger: {
            trigger: finalSection,
            start: "top 84%",
            end: "top 38%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });

        if (finalRule) {
          gsap.set(finalRule, { scaleX: 0, transformOrigin: "center" });
          gsap.to(finalRule, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: finalSection,
              start: "top 66%",
              end: "top 34%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });
        }

        if (finalCta) {
          gsap.set(finalCta, { opacity: 0, y: 16 });
          gsap.to(finalCta, {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: finalSection,
              start: "top 60%",
              end: "top 30%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });
        }

        if (finalLedger.length) {
          rackFocusTrack(finalLedger, {
            trigger: finalSection,
            start: "top 58%",
            end: "top 22%",
            blur: 3,
            opacityFloor: 0.24,
            scrub: 1.0,
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/landingpages-kassel" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           § 00 — HERO (Campaign Sheet · Focal Axis)
        ========================================================= */}
        <section
          data-lp-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-40 lg:px-16 lg:pb-52"
        >
          {/* Sheet-grain plate — vertical newsprint rules (narrower pitch
              than /webdesign-kassel's horizontal plate). Reads as the
              printed spine of a campaign briefing. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.013) 0 1px, transparent 1px 118px)",
              maskImage:
                "radial-gradient(ellipse 64% 70% at 36% 48%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 64% 70% at 36% 48%, black, transparent)",
            }}
          />

          {/* Vertical credit — left edge of the hero */}
          <div
            data-lp-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden select-none md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; STUDIO &nbsp;·&nbsp; SHEET · LP &nbsp;·&nbsp; MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            {/* ----- Top masthead: chapter marker + campaign dateline ----- */}
            <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:mb-16">
              <div className="flex items-start justify-between gap-6">
                <div data-lp-chapter>
                  <ChapterMarker num={CHAPTER.num} label={CHAPTER.label} />
                </div>

                {/* Right-side sheet folio — balances the chapter mark on
                    the left and gives the top strip a campaign-document
                    feel (not a magazine dateline). */}
                <div
                  data-lp-meta
                  aria-hidden
                  className="font-mono hidden items-center gap-3 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/42 sm:flex sm:text-[10px]"
                >
                  <span className="tabular-nums text-white/32">F · 01</span>
                  <span aria-hidden className="h-px w-5 bg-white/24" />
                  <span>Sheet · LP · MMXXVI</span>
                </div>
              </div>

              {/* Campaign dateline — `— SHEET · LP — STUDIO · KASSEL · MMXXVI —` */}
              <div className="flex items-center gap-4 sm:gap-5">
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span
                  data-lp-dateline
                  className="font-mono flex items-center gap-4 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:gap-5 sm:text-[10px] md:text-[10.5px]"
                >
                  <span>Sheet · LP</span>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="text-white/40">Studio · Kassel · MMXXVI</span>
                </span>
                <span
                  aria-hidden
                  data-lp-dateline-rule
                  className="block h-px flex-1 origin-left bg-white/12"
                />
              </div>
            </div>

            <div className="relative">
              {/* ----- Focal axis gutter (desktop only) -----
                  Vertical rule with three conversion stops. The middle
                  stop ("Fokus") is filled — an active focal marker, not
                  a coordinate. Visually anchors the whole campaign
                  trajectory in one glance. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-[0.4rem] hidden h-[min(30rem,84%)] md:-left-8 md:block lg:-left-12"
              >
                <span
                  data-lp-axis-rule
                  className="absolute left-[5.5px] top-0 block h-full w-px bg-white/16"
                />
                <div className="absolute inset-0 flex flex-col justify-between">
                  {FOCAL_AXIS_STOPS.map((stop) => (
                    <span
                      key={stop.label}
                      data-lp-axis-stop
                      className="font-mono relative flex items-center gap-3 text-[9px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 sm:text-[9.5px]"
                    >
                      {stop.tone === "filled" ? (
                        <span
                          aria-hidden
                          className="relative block h-[11px] w-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(10,10,10,1)]"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="relative block h-[11px] w-[11px] rounded-full border border-white/62 bg-[#0A0A0A] shadow-[0_0_0_3px_rgba(10,10,10,1)]"
                        />
                      )}
                      <span className="tabular-nums">{stop.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ----- Eyebrow ----- */}
              <p
                data-lp-eyebrow
                className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/52 sm:mb-10 sm:text-[10.5px]"
              >
                {HERO_EYEBROW}
              </p>

              {/* ----- H1 (3-line composition, word-by-word reveal) ----- */}
              <h1
                data-lp-h1
                className="font-instrument max-w-[64rem] text-[2.2rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-[2.9rem] md:text-[3.7rem] lg:text-[4.35rem] xl:text-[4.85rem]"
              >
                <span className="block">
                  {H1_LINE_A_WORDS.map((w, i) => (
                    <span
                      key={`la-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-lp-h1a
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/58 sm:mt-2">
                  {H1_LINE_B_WORDS.map((w, i) => (
                    <span
                      key={`lb-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-lp-h1b
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white sm:mt-2">
                  {H1_LINE_C_WORDS.map((w, i) => (
                    <span
                      key={`lc-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-lp-h1c
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* ----- Lead — three tiers (tier-1 serif italic for the
                  conditional clause, tier-2 body for the expanded intent,
                  tier-3 bright for the MAGICKS promise). ----- */}
              <div className="mt-10 max-w-[48rem] sm:mt-12 md:mt-14">
                <p
                  data-lp-lead1
                  className="font-instrument text-[1.28rem] italic leading-[1.35] tracking-[-0.01em] text-white/86 sm:text-[1.48rem] md:text-[1.62rem]"
                >
                  {HERO_LEAD_SENTENCE_1}
                </p>
                <p
                  data-lp-lead2
                  className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px]"
                >
                  {HERO_LEAD_SENTENCE_2}
                </p>
                <p
                  data-lp-lead3
                  className="font-ui mt-6 border-t border-white/[0.08] pt-5 text-[14.5px] leading-[1.72] text-white/76 md:text-[15.5px]"
                >
                  {HERO_LEAD_SENTENCE_3}
                </p>
              </div>

              {/* ----- Primary CTA ----- */}
              <div
                data-lp-cta
                className="mt-12 inline-flex items-baseline gap-3 sm:mt-14 md:mt-16"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                  aria-label="Projekt anfragen"
                >
                  <span className="relative pb-3">
                    <span className="font-ui">Projekt anfragen</span>
                    <span
                      data-lp-cta-rule
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/32"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.05em] italic text-white/85 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                  >
                    ↗
                  </span>
                </Link>
              </div>

              {/* ----- Campaign meta triad -----
                  Mobile: column-stacked ledger (3 lines, left-rail num,
                  relaxed tracking) so the stamps never wrap mid-row
                  and never spread into dead horizontal gaps.
                  Desktop: inline row of three flat editorial stamps,
                  the first (Ziel · Conversion) rendered a notch brighter
                  for subtle hierarchy. */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {[
                  { num: "01", label: "Ziel · Conversion", primary: true },
                  { num: "02", label: "Studio · Kassel", primary: false },
                  { num: "03", label: "Launch · planbar", primary: false },
                ].map((m) => (
                  <span
                    key={m.num}
                    data-lp-meta
                    className={`font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.2em] sm:tracking-[0.3em] sm:text-[10.5px] ${
                      m.primary ? "text-white/78" : "text-white/48"
                    }`}
                  >
                    <span
                      className={`tabular-nums ${
                        m.primary ? "text-white/56" : "text-white/32"
                      }`}
                    >
                      {m.num}
                    </span>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sheet readout — bottom-right editorial signature (distinct
              from /webdesign-kassel's Bureau · Live readout — this one
              reads as a live campaign status indicator). */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Campaign · Live
            </span>
            <span aria-hidden className="h-px w-8 bg-white/18" />
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Sheet · LP
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              Intent → Fokus → Anfrage
            </span>
          </div>
        </section>

        <SectionTransition from="§ 00  Hero — Sheet" to="§ 01  Prinzip" />

        {/* =========================================================
           § 01 — PRINZIP (headline statement + two body paragraphs)
           Two-column register. The headline pivots on "keine normale
           Unterseite." — italicised for typographic rhythm.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              background:
                "radial-gradient(ellipse 58% 44% at 50% 48%, rgba(255,255,255,0.028), transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-lp-reveal className="md:pt-2">
                {/* Mobile: compact 2-line header (folio + editorial triplet).
                    Desktop: full 3-label register with ChapterMarker rail. */}
                <div className="flex flex-col gap-2 sm:gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-white/52 sm:tracking-[0.34em] sm:text-[10.5px] sm:text-white/48">
                    § 01 — Prinzip
                  </p>
                  <div className="hidden sm:block">
                    <ChapterMarker num="01" label="Fokus" />
                  </div>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-white/40 sm:tracking-[0.3em] sm:text-[10.5px] sm:text-white/34"
                  >
                    Ziel · Führung · Handlung
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-lp-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.75rem] xl:text-[4.1rem]"
                >
                  Eine Landing Page ist <em className="italic text-white/62">keine normale Unterseite.</em>
                </h2>

                <div
                  data-lp-reveal
                  className="mt-10 flex items-center gap-4 md:mt-14"
                >
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-16" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    Was eine gute Landing Page ausmacht
                  </span>
                </div>

                <div className="mt-10 max-w-[44rem] space-y-5 md:mt-14 md:space-y-6">
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.24rem] italic leading-[1.38] tracking-[-0.01em] text-white/88 sm:text-[1.36rem] md:text-[1.48rem]"
                  >
                    {PRINZIP_P1_A}
                  </p>
                  <p
                    data-lp-reveal
                    className="font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                  >
                    {PRINZIP_P1_B}
                  </p>
                </div>

                <div className="mt-12 max-w-[44rem] space-y-5 border-t border-white/[0.08] pt-10 md:mt-16 md:space-y-6 md:pt-12">
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.16rem] italic leading-[1.4] tracking-[-0.008em] text-white/82 sm:text-[1.26rem] md:text-[1.36rem]"
                  >
                    {PRINZIP_P2_A}
                  </p>
                  <p
                    data-lp-reveal
                    className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                  >
                    {PRINZIP_P2_B}
                  </p>
                </div>

                {/* New framing note — Landing Page als fokussiertes
                    Verkaufs- oder Anfrage-System. Kept restrained,
                    sits as a quiet closing register beneath the
                    existing two-paragraph rhythm. */}
                <div className="mt-12 max-w-[44rem] space-y-5 border-t border-white/[0.08] pt-10 md:mt-16 md:space-y-6 md:pt-12">
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.16rem] italic leading-[1.4] tracking-[-0.008em] text-white/82 sm:text-[1.26rem] md:text-[1.36rem]"
                  >
                    {PRINZIP_P3_A}
                  </p>
                  <p
                    data-lp-reveal
                    className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                  >
                    {PRINZIP_P3_B}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 01  Prinzip" to="§ 02  Vokabular" tone="darker" />

        {/* =========================================================
           § INTERLUDIUM — FOCAL AXIS PLATE
           Page-specific idiom. This page's rhetorical register is the
           "Focal Axis": one principle, one vertical line of attention,
           one conversion moment. The anchor makes that idiom visible:
           a centered specimen plate with a thin vertical axis rule
           that enters the frame from above and exits below, plus a
           split anatomy caption beneath that names exactly the three
           elements visible on the mockup — Überschrift · CTA · Argumente.
           The reader sees the *shape* of a landing page AND the
           vocabulary the rest of the page uses to discuss it.
           Deliberately unlike the /webdesign-kassel Bureau rail idiom.
        ========================================================= */}
        <section
          aria-label="Focal Axis · Konversionsblatt · Beispiel"
          className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:px-16 lg:py-36"
        >
          <div className="layout-max">
            <div className="relative mx-auto max-w-[60rem]">
              {/* Vertical axis rule — enters above the plate, crosses
                  the caption band, exits below. It is the page's
                  Focal Axis made literal. Extremely restrained — a
                  single 1-px line at 10% opacity with a feathered
                  mask so it reads as architecture, not decoration. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/18"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                }}
              />

              {/* Opening folio — centered on the axis */}
              <div
                data-lp-reveal
                className="mb-10 flex items-center justify-center gap-4 sm:mb-12 md:mb-14"
              >
                <span aria-hidden className="h-px w-10 bg-white/20 sm:w-14" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.44em] text-white/58 sm:text-[10.5px]">
                  § Ax. &nbsp;·&nbsp; Focal Axis
                </span>
                <span aria-hidden className="h-px w-10 bg-white/20 sm:w-14" />
              </div>

              {/* Specimen plate — chromeless; the axis and anatomy
                  caption below carry all the metadata. */}
              <EditorialAnchor
                src="/media/pages/landingpages-kassel/anchor.webp"
                alt="Fokussierte deutschsprachige Landing Page in Dark-Mode auf einem mattschwarzen Laptop: Serif-Headline „Schneller sichtbar werden.“, einziger dominanter Call-to-Action-Button „Jetzt anfragen“ und darunter eine dreispaltige Argument-Leiste (Tempo · Klarheit · Wirkung)."
                aspect="16/9"
                align="center"
                maxWidth="60rem"
                revealAttr="data-lp-reveal"
              />

              {/* Anatomy caption — three labels at fixed horizontal
                  positions corresponding to the LP elements visible
                  on the mockup. Makes the conversion logic legible
                  via typography rather than over-explanation. */}
              <div
                data-lp-reveal
                className="mt-8 grid grid-cols-3 items-start gap-3 border-t border-white/[0.07] pt-5 sm:mt-10 sm:pt-6 md:mt-12"
              >
                <AnatomyLabel tag="a" head="Überschrift" tail="H1 · Seriftitel" />
                <AnatomyLabel tag="b" head="Call-to-Action" tail="Ein einziger" align="center" />
                <AnatomyLabel tag="c" head="Argumente" tail="Tempo · Klarheit · Wirkung" align="end" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           § 02 — VOKABULAR (semantic-SEO reprise, elegant)
           Starts with a noun-register strip ("Landing Page · Landingpage
           · Webseite · Homepage"). The H2 carries the credo, split at
           the em-dash. Body sits in a tight reading column below. Reads
           as an editor's terminology note, not an SEO block.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 112px)",
              maskImage:
                "radial-gradient(ellipse 62% 54% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 54% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            {/* Top vokabular rail */}
            <div
              data-lp-reveal
              className="mb-12 flex items-center gap-5 sm:mb-16"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/48 sm:text-[10.5px]">
                § 02 — Vokabular · Credo
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono hidden whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:inline-block sm:text-[10px]">
                Studio · Kassel · MMXXVI
              </span>
            </div>

            {/* Noun-register index — four editorial tokens. On mobile,
                stacked rows with a numeric folio and a hairline rule
                below. On desktop, a single horizontal index with
                tabular folios and italic serif tokens separated by
                full-height hairline dividers. Reads as a terminology
                register printed at the head of the page. */}
            <div
              data-lp-reveal
              className="mb-14 border-y border-white/[0.08] md:mb-20"
            >
              {/* Small rail above the tokens */}
              <div className="flex items-center justify-between gap-4 py-3 md:py-4">
                <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[9.5px]">
                  Register · Begriffe
                </span>
                <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[9.5px]">
                  04 Einträge
                </span>
              </div>

              <ul className="grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-4">
                {VOKABULAR_TOKENS.map((token, i) => (
                  <li
                    key={token}
                    data-lp-vtoken
                    className={`flex items-baseline gap-5 px-0 py-5 sm:py-6 md:flex-col md:items-start md:gap-3 md:px-6 md:py-9 lg:px-8 lg:py-11 ${
                      i < VOKABULAR_TOKENS.length - 1
                        ? "border-b border-white/[0.06] md:border-b-0"
                        : ""
                    } ${
                      i > 0 ? "md:border-l md:border-white/[0.08]" : ""
                    }`}
                  >
                    <span className="font-mono tabular-nums shrink-0 text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/40 md:text-[10px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-instrument text-[1.45rem] italic leading-[1.08] tracking-[-0.018em] text-white sm:text-[1.7rem] md:text-[1.75rem] lg:text-[2rem]">
                      {token}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Credo heading — exact theme from brief, with italic pivot.
                Scaled above the register H2s but below the ceremonial
                § 05 Fokus — it carries the semantic-SEO credo without
                ever reading as an SEO block. */}
            <h2
              data-lp-reveal
              className="font-instrument max-w-[64rem] text-[2.2rem] leading-[1.03] tracking-[-0.032em] text-white sm:text-[2.85rem] md:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.55rem]"
            >
              {VOKABULAR_HEADLINE_A}{" "}
              <em className="italic text-white/66">{VOKABULAR_HEADLINE_B}</em>
            </h2>

            {/* Credo body — two paragraph blocks. First block cadences
                the two ways people search; the second lands the resolution
                under a MAGICKS signature. Kept in a tight reading column
                so it never reads as SEO copy. */}
            <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
              <div className="max-w-[32rem] space-y-5">
                <p
                  data-lp-reveal
                  className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/88 sm:text-[1.32rem] md:text-[1.44rem]"
                >
                  {VOKABULAR_P1_A}
                </p>
                <p
                  data-lp-reveal
                  className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                >
                  {VOKABULAR_P1_B}
                </p>
              </div>

              <div className="max-w-[34rem] space-y-5 border-t border-white/[0.08] pt-10 md:border-l md:border-t-0 md:pl-10 md:pt-0 lg:pl-14">
                <p
                  data-lp-reveal
                  className="font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                >
                  {VOKABULAR_P2_A}
                </p>
                <p
                  data-lp-reveal
                  className="font-instrument text-[1.16rem] italic leading-[1.4] tracking-[-0.008em] text-white/88 sm:text-[1.24rem] md:text-[1.34rem]"
                >
                  {VOKABULAR_P2_B}
                </p>
                <p
                  data-lp-reveal
                  className="font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                >
                  {VOKABULAR_P2_C}
                </p>
              </div>
            </div>

            {/* Closing credo rail */}
            <div
              data-lp-reveal
              className="mt-16 flex items-center gap-5 sm:mt-20"
            >
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                Credo · Vokabular · MMXXVI
              </span>
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02  Vokabular" to="§ 03  Bezug" />

        {/* =========================================================
           § 03 — BEZUG (Kassel use-cases · who this is for)
           Two-column register. The 5-bullet list is rendered as a
           numbered directory of intents, each prefixed by a "↘"
           trajectory arrow to echo the hero's focal-axis motif.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-lp-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 03 — Bezug
                  </p>
                  <ChapterMarker num="03" label="Für wen" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    05 Intents · Kassel
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-lp-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.06] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  {BEZUG_HEADLINE}
                </h2>

                <p
                  data-lp-reveal
                  className="font-ui mt-7 max-w-[44rem] text-[15.5px] leading-[1.72] text-white/64 md:mt-9 md:text-[16.5px]"
                >
                  {BEZUG_INTRO}
                </p>

                <p
                  data-lp-reveal
                  className="font-instrument mt-6 max-w-[42rem] text-[1.08rem] italic leading-[1.45] tracking-[-0.008em] text-white/82 md:mt-8 md:text-[1.18rem]"
                >
                  {BEZUG_LEADIN}
                </p>

                <ul className="mt-10 grid gap-x-12 gap-y-0 border-t border-white/[0.08] md:mt-14 md:grid-cols-1">
                  {BEZUG_ITEMS.map((body, i) => (
                    <li
                      key={body}
                      data-lp-reveal
                      className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-5 border-b border-white/[0.08] py-6 sm:gap-x-7 md:py-8"
                    >
                      <span className="font-mono tabular-nums pt-[0.24rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className="font-instrument pt-[0.15rem] text-[1.05rem] italic leading-[1.2] text-white/46 sm:text-[1.1rem] md:text-[1.15rem]"
                      >
                        ↘
                      </span>
                      <p className="font-instrument max-w-[44rem] text-[1.18rem] leading-[1.35] tracking-[-0.012em] text-white/94 sm:text-[1.32rem] md:text-[1.48rem]">
                        {body}
                      </p>
                    </li>
                  ))}
                </ul>

                <div
                  data-lp-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Bezug</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Intents · 05 / 05</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Silent transition between § 03 → § 04. No SectionTransition
            sliver here — the background tone shift (#0A0A0A → #09090A)
            carries the seam, and the § 04 eyebrow handles orientation.
            Breaks the "transition-on-every-seam" pattern for rhythm. */}

        {/* =========================================================
           § 04 — LEISTUNG (deliverables ledger · 6 items)
           Full-width single-column ledger. Each row is a horizontal
           register entry (position · title · body), tabular and
           confident — the inverse of /webdesign-kassel's 2×3 grid.

           Opens with a hairline `section-top-rule` to carry the
           silent transition from § 03 without a chapter sliver.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-end md:gap-20 lg:gap-28">
              <div>
                <p
                  data-lp-reveal
                  className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:mb-8 sm:text-[10.5px]"
                >
                  § 04 — Leistung
                </p>
                <h2
                  data-lp-reveal
                  className="font-instrument max-w-[40rem] text-[2rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.6rem]"
                >
                  {LEISTUNG_HEADLINE}
                </h2>
                {/* Quiet clarifier — campaign vs. local search, depending
                    on goal. Sits beneath the headline so the deliverables
                    list reads as the answer to a clearly framed question. */}
                <p
                  data-lp-reveal
                  className="font-instrument mt-7 max-w-[36rem] text-[1.05rem] italic leading-[1.5] tracking-[-0.008em] text-white/72 sm:mt-9 sm:text-[1.12rem] md:text-[1.2rem]"
                >
                  {LEISTUNG_INTRO}
                </p>
              </div>

              <div
                data-lp-reveal
                className="flex items-center gap-4 md:justify-end"
              >
                <span
                  aria-hidden
                  className="h-px w-10 bg-white/22 md:w-16"
                />
                <span className="font-mono whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  {String(LEISTUNG_ITEMS.length).padStart(2, "0")} Positionen · Sheet
                </span>
              </div>
            </div>

            <ol className="mt-16 border-t border-white/[0.08] md:mt-20">
              {LEISTUNG_ITEMS.map((item, i) => (
                <li
                  key={item.title}
                  data-lp-reveal
                  className="group/row grid grid-cols-1 gap-y-4 border-b border-white/[0.08] py-9 md:grid-cols-[auto_minmax(0,1.05fr)_minmax(0,1.3fr)] md:items-baseline md:gap-x-14 md:py-12 lg:gap-x-20 lg:py-14"
                >
                  <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 md:text-[11px]">
                    LP · {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-instrument text-[1.4rem] leading-[1.16] tracking-[-0.018em] text-white md:text-[1.75rem] lg:text-[1.95rem]">
                    {item.title}
                  </h3>

                  <p className="font-ui max-w-[34rem] text-[14.5px] leading-[1.7] text-white/62 md:text-[15.5px] md:leading-[1.75] md:text-white/64">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            <div
              data-lp-reveal
              className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
            >
              <span>Ledger · Leistung</span>
              <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
              <span className="tabular-nums">
                Positionen · {String(LEISTUNG_ITEMS.length).padStart(2, "0")} / {String(LEISTUNG_ITEMS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 04  Leistung" to="§ 05  Fokus" tone="darker" />

        {/* =========================================================
           § 05 — FOKUS (ceremonial: LP > Homepage for this use case)
           Centered, full-width statement. H2 split on two lines with
           word-reveal. A trajectory rule divides the two body
           paragraphs so the "Homepage → Landing Page" pivot reads
           typographically. Visually the strongest page moment.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-64">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.6]"
            style={{
              background:
                "radial-gradient(ellipse 58% 44% at 50% 50%, rgba(255,255,255,0.03), transparent 66%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
              maskImage:
                "radial-gradient(ellipse 62% 50% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 50% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[74rem]">
              <div className="mb-16 flex items-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § 05 — Fokus
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              <h2 className="font-instrument max-w-[76rem] text-[2.2rem] leading-[1.02] tracking-[-0.036em] text-white sm:text-[2.95rem] md:text-[3.8rem] lg:text-[4.45rem] xl:text-[5.05rem]">
                <span className="block overflow-hidden">
                  <span data-lp-fokusA className="inline-block">
                    {FOKUS_HEADLINE_A}
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-lp-fokusB className="inline-block italic text-white/66">
                    {FOKUS_HEADLINE_B}
                  </span>
                </span>
              </h2>

              <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-14 lg:gap-20">
                {/* Left paragraph — the "vieles gleichzeitig" reality */}
                <div className="max-w-[32rem] space-y-5">
                  <div
                    data-lp-reveal
                    className="flex items-center gap-3"
                  >
                    <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:text-[10px]">
                      01
                    </span>
                    <span aria-hidden className="h-px w-7 bg-white/22" />
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/48 sm:text-[10.5px]">
                      Ausgangspunkt
                    </span>
                  </div>
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.32rem] italic leading-[1.32] tracking-[-0.014em] text-white/80 sm:text-[1.5rem] md:text-[1.66rem]"
                  >
                    {FOKUS_P1_A}
                  </p>
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.32rem] italic leading-[1.32] tracking-[-0.014em] text-white sm:text-[1.5rem] md:text-[1.66rem]"
                  >
                    {FOKUS_P1_B}
                  </p>
                </div>

                {/* Trajectory pivot — thin vertical rule on desktop, with
                    a diamond focal marker. Horizontal on mobile. Echoes
                    the hero's focal-axis motif at section scale. */}
                <div
                  aria-hidden
                  className="flex items-center justify-center md:h-full md:flex-col md:self-stretch md:pt-4"
                >
                  <span
                    data-lp-reveal
                    className="flex items-center gap-4 md:flex-col md:gap-5"
                  >
                    <span
                      className="h-px w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent md:h-28 md:w-px md:bg-gradient-to-b md:from-white/0 md:via-white/30 md:to-white/0 lg:h-40"
                    />
                    <span
                      className="relative flex h-[14px] w-[14px] items-center justify-center"
                    >
                      <span
                        className="absolute inset-0 block rotate-45 border border-white/68 bg-[#080809]"
                      />
                      <span
                        className="absolute h-[5px] w-[5px] rotate-45 bg-white"
                      />
                    </span>
                    <span
                      className="h-px w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent md:h-28 md:w-px md:bg-gradient-to-b md:from-white/0 md:via-white/30 md:to-white/0 lg:h-40"
                    />
                  </span>
                </div>

                {/* Right paragraph — the resolved Landing Page answer */}
                <div className="max-w-[34rem] space-y-5">
                  <div
                    data-lp-reveal
                    className="flex items-center gap-3"
                  >
                    <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:text-[10px]">
                      02
                    </span>
                    <span aria-hidden className="h-px w-7 bg-white/22" />
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/56 sm:text-[10.5px]">
                      Antwort
                    </span>
                  </div>
                  <p
                    data-lp-reveal
                    className="font-instrument text-[1.32rem] italic leading-[1.32] tracking-[-0.014em] text-white sm:text-[1.5rem] md:text-[1.66rem]"
                  >
                    {FOKUS_P2_A}
                  </p>
                  <p
                    data-lp-reveal
                    className="font-ui text-[15.5px] leading-[1.74] text-white/74 md:text-[16.5px]"
                  >
                    {FOKUS_P2_B}
                  </p>
                </div>
              </div>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Fokus · Dispatch · MMXXVI
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 05  Fokus" to="§ 06  Haltung" />

        {/* =========================================================
           § 06 — HALTUNG (why Kassel chooses MAGICKS + triptych)
           Two-column register above the triptych. The triptych lands
           the Statement as three numbered declarations, i / ii / iii,
           across three equal columns on desktop (stacked on mobile).
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-lp-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 06 — Haltung
                  </p>
                  <ChapterMarker num="06" label="Grund" />
                </div>
              </div>

              <div>
                <h2
                  data-lp-reveal
                  className="font-instrument max-w-[54rem] text-[2.1rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.85rem] xl:text-[4.15rem]"
                >
                  {HALTUNG_HEADLINE}
                </h2>

                <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
                  <div className="max-w-[32rem] space-y-5">
                    <p
                      data-lp-reveal
                      className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 sm:text-[1.32rem] md:text-[1.44rem]"
                    >
                      {HALTUNG_P1_A}
                    </p>
                    <p
                      data-lp-reveal
                      className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                    >
                      {HALTUNG_P1_B}
                    </p>
                  </div>
                  <div className="max-w-[34rem] space-y-5">
                    <p
                      data-lp-reveal
                      className="font-instrument text-[1.16rem] italic leading-[1.4] tracking-[-0.008em] text-white/84 sm:text-[1.26rem] md:text-[1.38rem]"
                    >
                      {HALTUNG_P2_A}
                    </p>
                    <p
                      data-lp-reveal
                      className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                    >
                      {HALTUNG_P2_B}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Triptych statement — three equal columns on desktop.
                Three italic declarations, each numbered i / ii / iii.
                Visual centerpiece of the section. Extra breathing above
                so it lands as the climactic beat of § 06. */}
            <div
              data-lp-reveal
              className="mt-24 flex items-center gap-5 sm:mt-28 md:mt-36"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                Statement · Triptychon
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-y-14 border-y border-white/[0.08] py-16 md:mt-16 md:grid-cols-3 md:gap-y-0 md:py-20 lg:py-28">
              {HALTUNG_TRIPTYCH.map((item, i) => (
                <div
                  key={item.roman}
                  data-lp-triptych
                  className={`flex flex-col gap-6 ${
                    i > 0
                      ? "md:border-l md:border-white/[0.08] md:pl-10 lg:pl-14"
                      : ""
                  }`}
                >
                  {/* Diamond accent + roman numeral folio */}
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="relative flex h-[10px] w-[10px] items-center justify-center"
                    >
                      <span className="absolute inset-0 block rotate-45 border border-white/60" />
                      <span className="absolute h-[3px] w-[3px] rotate-45 bg-white/80" />
                    </span>
                    <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:text-[10.5px]">
                      {item.roman}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  </div>

                  <p className="font-instrument max-w-[20rem] text-[1.85rem] italic leading-[1.1] tracking-[-0.022em] text-white sm:text-[2.1rem] md:text-[2.3rem] lg:text-[2.6rem]">
                    {item.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition from="§ 06  Haltung" to="§ 07  Einbettung" />

        {/* =========================================================
           § 07 — EINBETTUNG (not every LP stands alone · 4 links)
           Two-column lead-in register, then a 2×2 typographic link grid
           that surfaces the 4 required internal routes as confident
           editorial anchors — no gatefolds, no cards, just letters.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-lp-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 07 — Einbettung
                  </p>
                  <ChapterMarker num="07" label="Orientierung" />
                </div>
              </div>

              <div>
                <h2
                  data-lp-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  {EINBETTUNG_HEADLINE}
                </h2>

                <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-14">
                  <div className="max-w-[32rem] space-y-3">
                    <p
                      data-lp-reveal
                      className="font-instrument text-[1.18rem] italic leading-[1.4] tracking-[-0.008em] text-white/86 sm:text-[1.26rem] md:text-[1.36rem]"
                    >
                      {EINBETTUNG_P1_A}
                    </p>
                    <p
                      data-lp-reveal
                      className="font-instrument text-[1.18rem] italic leading-[1.4] tracking-[-0.008em] text-white/86 sm:text-[1.26rem] md:text-[1.36rem]"
                    >
                      {EINBETTUNG_P1_B}
                    </p>
                    <p
                      data-lp-reveal
                      className="font-instrument text-[1.18rem] italic leading-[1.4] tracking-[-0.008em] text-white/86 sm:text-[1.26rem] md:text-[1.36rem]"
                    >
                      {EINBETTUNG_P1_C}
                    </p>
                  </div>
                  <div className="max-w-[34rem]">
                    <p
                      data-lp-reveal
                      className="font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                    >
                      {EINBETTUNG_P2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Link grid — each cell a typographic anchor with eyebrow
                micro-label, large serif page name, position folio and
                arrow. Confident, dense, editorial. Two-column desktop
                layout with row borders that expand naturally as new
                routes (SEO, Content) are appended. */}
            <div
              data-lp-reveal
              className="mt-20 flex items-center gap-5 sm:mt-24 md:mt-28"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                Anschluss · {String(EINBETTUNG_LINKS.length).padStart(2, "0")} Routen
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            <ul className="mt-8 grid grid-cols-1 border-y border-white/[0.08] md:mt-12 md:grid-cols-2">
              {EINBETTUNG_LINKS.map((link, i) => {
                const isLastMobile = i === EINBETTUNG_LINKS.length - 1;
                const isInBottomRow = i >= EINBETTUNG_LINKS.length - 2;
                const isLeftColumn = i % 2 === 0;

                const classes = [
                  isLastMobile ? "" : "border-b border-white/[0.08]",
                  isInBottomRow ? "md:border-b-0" : "",
                  isLeftColumn ? "md:border-r md:border-white/[0.08]" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li
                    key={link.to}
                    data-lp-reveal
                    className={classes}
                  >
                    <Link
                      to={link.to}
                      className="group/link relative block px-0 py-9 md:px-5 md:py-12 lg:px-7 lg:py-14"
                    >
                      {/* Subtle hover tint — restrained, no glow */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
                        style={{
                          background:
                            "radial-gradient(ellipse 65% 90% at 28% 60%, rgba(255,255,255,0.035), transparent 70%)",
                        }}
                      />
                      {/* Hover underline rail — animates bottom rule */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white/62 transition-transform duration-[760ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
                      />

                      <div className="relative flex items-baseline justify-between gap-5">
                        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 md:text-[10.5px]">
                          {link.eyebrow}
                        </span>
                        <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 md:text-[10px]">
                          {link.position}
                        </span>
                      </div>

                      <div className="relative mt-6 flex items-baseline justify-between gap-6 md:mt-8">
                        <h3 className="font-instrument text-[1.85rem] leading-[1.04] tracking-[-0.026em] text-white transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-[2px] sm:text-[2.25rem] md:text-[2.65rem] lg:text-[2.95rem]">
                          {link.label}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument flex-shrink-0 text-[1.35rem] italic text-white/72 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/link:-translate-y-[3px] group-hover/link:translate-x-[3px] md:text-[1.55rem]"
                        >
                          ↗
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <SectionTransition from="§ 07  Einbettung" to="§ 08  Studio" tone="darker" />

        {/* =========================================================
           § 08 — STUDIO (direct from Kassel · secondary CTA)
           Centered ceremonial composition. Breaks the 2-column
           register pattern that § 01/§ 03/§ 06/§ 07 already use and
           gives the local anchor section its own rhythm before § END.
           CTA escalates from the hero's underline link into an outline
           pill — a deliberate commitment curve that lands in § END's
           filled pill.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 50% 46%, rgba(255,255,255,0.022), transparent 66%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              {/* Top rail — mirrors § 05's centered rail to signal that
                  this is a statement section, not a register section. */}
              <div
                data-lp-reveal
                className="mb-12 flex items-center gap-5 sm:mb-16"
              >
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § 08 — Studio
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>

              <h2
                data-lp-reveal
                className="font-instrument mx-auto max-w-[44rem] text-[2.15rem] leading-[1.04] tracking-[-0.032em] text-white sm:text-[2.75rem] md:text-[3.4rem] lg:text-[3.95rem] xl:text-[4.25rem]"
              >
                Direkt aus Kassel. <em className="italic text-white/62">Nicht von der Stange.</em>
              </h2>

              {/* Local-anchor rail — diamond marker echoes the § 05 pivot,
                  threading the local-anchor section to the ceremonial
                  core of the page. */}
              <div
                data-lp-reveal
                className="mx-auto mt-12 flex max-w-[36rem] items-center justify-center gap-4 sm:mt-14"
              >
                <span aria-hidden className="h-px w-14 bg-white/22 sm:w-20" />
                <span
                  aria-hidden
                  className="relative flex h-[10px] w-[10px] items-center justify-center"
                >
                  <span className="absolute inset-0 block rotate-45 border border-white/60" />
                  <span className="absolute h-[3px] w-[3px] rotate-45 bg-white/80" />
                </span>
                <span className="font-mono whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/52 sm:text-[10.5px]">
                  Lokal verankert · nicht lokal begrenzt
                </span>
                <span
                  aria-hidden
                  className="relative flex h-[10px] w-[10px] items-center justify-center"
                >
                  <span className="absolute inset-0 block rotate-45 border border-white/60" />
                  <span className="absolute h-[3px] w-[3px] rotate-45 bg-white/80" />
                </span>
                <span aria-hidden className="h-px w-14 bg-white/22 sm:w-20" />
              </div>

              {/* Body — two paragraphs in a centered tight reading column.
                  The first sets the studio signature; the second is an
                  open invitation that naturally lands the CTA below. */}
              <div className="mx-auto mt-14 max-w-[44rem] space-y-6 sm:mt-16 md:space-y-7">
                <p
                  data-lp-reveal
                  className="font-instrument text-[1.26rem] italic leading-[1.42] tracking-[-0.012em] text-white/88 sm:text-[1.38rem] md:text-[1.52rem]"
                >
                  {STUDIO_P1}
                </p>
                <p
                  data-lp-reveal
                  className="font-ui text-[15.5px] leading-[1.72] text-white/72 md:text-[16.5px]"
                >
                  {STUDIO_P2}
                </p>
              </div>

              {/* Secondary CTA — outline pill. Mid-commitment treatment
                  between the hero's underline link and § END's filled
                  pill. Subtle hover fill pulls it forward without
                  competing with the final CTA. */}
              <div
                data-lp-reveal
                className="mt-14 flex justify-center sm:mt-16 md:mt-20"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-white/24 bg-white/[0.015] py-[0.95rem] pl-7 pr-5 text-[15px] font-medium tracking-[-0.005em] text-white no-underline magicks-duration-hover magicks-ease-out transition-[border-color,background-color,transform] hover:-translate-y-[1.5px] hover:border-white/40 hover:bg-white/[0.05] active:translate-y-0 active:scale-[0.985] sm:text-[16px] md:text-[16.5px]"
                  aria-label="Kontakt aufnehmen"
                >
                  <span className="font-ui">Kontakt aufnehmen</span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.1em] italic text-white/76 magicks-duration-hover magicks-ease-out transition-transform group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                  >
                    ↗
                  </span>
                </Link>
              </div>

              {/* Closing studio signature rail */}
              <div
                data-lp-reveal
                className="mt-16 flex items-center gap-5 sm:mt-20"
              >
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Studio · Kassel · Nordhessen
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           § END — FINAL CTA (Sheet · Projekt)
           Distinct from /webdesign-kassel's crop-mark cartouche.
           Uses a horizontal trajectory bar above the heading, a
           centered pill CTA, and a 4-field ledger with LP-specific
           labels (Sheet · Studio · Fokus · Edition).
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Focal plate — a centered radial halo, restrained, no bright
              glow (per brief). Sits behind the headline to lift it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[116vw] max-w-[1160px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.044) 0%, rgba(255,255,255,0.014) 32%, transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 118px)",
              maskImage:
                "radial-gradient(ellipse 72% 60% at 50% 46%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 60% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[72rem] text-center">
              <div className="mb-12 inline-flex sm:mb-16">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              {/* Trajectory bar — echoes the hero focal axis, rendered
                  horizontal here. A thin rule with a centered diamond
                  focal marker and Intent/Fokus/Anfrage label ticks. */}
              <div
                className="mx-auto mb-12 flex max-w-[56rem] items-center gap-4 sm:mb-16 sm:gap-5"
                aria-hidden
              >
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 sm:text-[10px]">
                  Intent
                </span>
                <div className="relative h-px flex-1">
                  <span
                    data-lp-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                  {/* Tick marks at 30% and 70% to suggest progression */}
                  <span
                    aria-hidden
                    className="absolute left-[30%] top-1/2 block h-[5px] w-px -translate-y-1/2 bg-white/34"
                  />
                  <span
                    aria-hidden
                    className="absolute left-[70%] top-1/2 block h-[5px] w-px -translate-y-1/2 bg-white/34"
                  />
                  {/* Central focal diamond marker */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 flex h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  >
                    <span className="absolute inset-0 block rotate-45 border border-white/70 bg-[#070708] shadow-[0_0_0_3px_rgba(7,7,8,1)]" />
                    <span className="absolute h-[4px] w-[4px] rotate-45 bg-white" />
                  </span>
                </div>
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 sm:text-[10px]">
                  Anfrage
                </span>
              </div>

              <h2 className="font-instrument text-[2.3rem] leading-[1.0] tracking-[-0.038em] text-white sm:text-[3.15rem] md:text-[4.2rem] lg:text-[5rem] xl:text-[5.55rem]">
                <span className="block overflow-hidden">
                  <span data-lp-finalA className="inline-block">
                    {FINAL_CTA_HEADLINE_A}
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-lp-finalB className="inline-block italic text-white/72">
                    {FINAL_CTA_HEADLINE_B}
                  </span>
                </span>
              </h2>

              <p className="font-ui mx-auto mt-12 max-w-[46rem] text-[15.5px] leading-[1.72] text-white/66 md:mt-14 md:text-[17px]">
                {FINAL_CTA_BODY}
              </p>

              <div className="mt-14 flex flex-col items-center gap-10 text-center sm:mt-18 sm:flex-row sm:items-start sm:justify-center sm:gap-14 md:gap-20">
                <div data-lp-finalcta>
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>Lass uns über dein Projekt sprechen</span>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] text-white magicks-duration-hover magicks-ease-out transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                    >
                      <svg
                        viewBox="0 0 14 14"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      >
                        <path
                          d="M3 11 L11 3 M5 3 H11 V9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Closing cartouche — 4-field ledger, LP-specific labels
                so it never reads as a copy of /webdesign-kassel's
                Bureau cartouche. */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Landing Page · Kassel" },
                  { k: "Studio", v: "Kassel · Nordhessen" },
                  { k: "Fokus", v: "Conversion · Klarheit" },
                  { k: "Edition", v: "Magicks · MMXXVI" },
                ].map((item, i) => (
                  <div
                    key={item.k}
                    data-lp-finalledger
                    className={`flex flex-col gap-2 ${
                      i > 0 ? "sm:border-l sm:border-white/[0.08] sm:pl-5 md:pl-7" : ""
                    }`}
                  >
                    <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[9.5px]">
                      {item.k}
                    </span>
                    <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.28em] text-white/68 sm:text-[10.5px]">
                      {item.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

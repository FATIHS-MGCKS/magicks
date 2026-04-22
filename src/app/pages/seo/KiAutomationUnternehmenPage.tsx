import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChapterMarker } from "../../components/home/ChapterMarker";
import { SectionTransition } from "../../components/service/SectionTransition";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { registerGsap } from "../../lib/gsap";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /ki-automation-unternehmen — bespoke SEO landing.
 *
 * Voice: premium, practical, operationally sharp. Slightly more SEO-
 * present than its sibling /ki-automationen-integrationen, but still
 * clearly MAGICKS — no hype aesthetics, no glow, no AI-agency
 * vocabulary. The page treats automation as an editorial discipline:
 * less manual work, more structure, calmer operations.
 *
 * Signature motif: the "Prozess-Register" — a quiet two-column ledger
 * showing *Manuell → Automatisch* transformations. Reads as a real
 * operations log rather than a feature chart. This is the page's
 * single recurring visual; the rest is pure typographic rhythm.
 *
 * Section map:
 *   § 00 Hero            — masthead + H1 word-reveal + Prozess-Register
 *   § 01 Credo           — "Nicht mehr KI. Sondern sinnvoll eingesetzte KI."
 *   § 02 Zielbild        — audience register with phase chips
 *   § 03 Anwendung       — Einsatzkarten (2×4 plate grid)
 *   § 04 Umfang          — 6-item deliverables register
 *   § 05 Methode         — two-column approach with diagnostic rail
 *   § 06 Absage + Pull   — negation ladder + ceremonial Statement
 *   § 07 Kontext         — context intro + 2×2 related routes plate
 *   § END Final CTA      — operations ledger + filled pill
 *
 * All user-supplied copy is preserved verbatim in module-level
 * constants so a diff against the brief is trivial.
 * ------------------------------------------------------------------ */

/* =======  VERBATIM COPY  ======= */

const CHAPTER = { num: "SEO", label: "KI-Automation · Unternehmen" } as const;

const HERO_EYEBROW = "Operations · Für Unternehmen mit Prozessanspruch";

/* Hero H1 — single sentence, rendered across two visual lines with
 * an italic pivot: "KI-Automation für Unternehmen," / "die weniger
 * manuell arbeiten wollen." */
const H1_PRIMARY_WORDS = ["KI-Automation", "für", "Unternehmen,"];
const H1_ITALIC_WORDS = ["die", "weniger", "manuell", "arbeiten", "wollen."];

const HERO_LEAD_1 =
  "Viele Unternehmen verlieren Zeit nicht wegen fehlender Tools, sondern wegen unnötiger Zwischenschritte, doppelter Arbeit und Prozessen, die nicht sauber zusammenspielen.";
const HERO_LEAD_2 = "Genau hier setzen wir an.";
const HERO_LEAD_3 =
  "Wir entwickeln KI-Automationen und smarte Workflows, die Abläufe beschleunigen, manuelle Arbeit reduzieren und digitale Prozesse sinnvoll miteinander verbinden.";

/* Prozess-Register — four rows of Manuell → Automatisch. Phrasing
 * stays deliberately generic (Formular / Daten / Antwort / Pflege)
 * and uses the brief's own vocabulary (manuell, händisch, strukturiert,
 * verbunden, erzeugt). It illustrates the page's promise without
 * inventing metrics or specific project outcomes. */
const LEDGER_ROWS: { op: string; manuell: string; automatisch: string }[] = [
  {
    op: "OP-01",
    manuell: "Formular händisch erfasst",
    automatisch: "strukturiert übernommen",
  },
  {
    op: "OP-02",
    manuell: "Daten kopiert und übergeben",
    automatisch: "Systeme verbunden",
  },
  {
    op: "OP-03",
    manuell: "Antwort einzeln vorbereitet",
    automatisch: "strukturiert erzeugt",
  },
  {
    op: "OP-04",
    manuell: "Pflege doppelt gehalten",
    automatisch: "einmal gepflegte Quelle",
  },
];

/* § 01 Credo — "Nicht mehr KI. Sondern sinnvoll eingesetzte KI." */
const CREDO_HEADLINE_PLAIN = "Nicht mehr KI.";
const CREDO_HEADLINE_ITALIC = "Sondern sinnvoll eingesetzte KI.";
const CREDO_P1 =
  "KI bringt nur dann echten Mehrwert, wenn sie an den richtigen Stellen eingesetzt wird.";
const CREDO_P2 =
  "Nicht als Showeffekt. Nicht als Buzzword. Sondern dort, wo sie Arbeit abnimmt, Informationen schneller nutzbar macht oder Prozesse sinnvoll ergänzt.";
const CREDO_P3 = "Genau so denken wir bei MAGICKS.";
const CREDO_P4 =
  "Nicht in Hype, sondern in sauberer Anwendung, klarer Logik und echter Entlastung im Alltag.";

/* § 02 Zielbild — audience register.
 * Each item's `phase` tag is editorial scaffolding (same vocabulary as
 * the included brief items) so the list reads as a taxonomy of
 * typical requests rather than a bullet dump. Phase labels never
 * invent content — they mirror the key noun in each request. */
const AUDIENCE: { phase: string; text: string }[] = [
  { phase: "Prozess", text: "interne Abläufe automatisieren willst" },
  { phase: "Brücke", text: "Informationen zwischen mehreren Tools verbinden musst" },
  { phase: "Reduktion", text: "manuelle Zwischenschritte reduzieren möchtest" },
  { phase: "Integration", text: "KI in bestehende Prozesse sinnvoll integrieren willst" },
  { phase: "Struktur", text: "wiederkehrende Aufgaben strukturierter abbilden willst" },
  { phase: "Entlastung", text: "deinem Team operative Arbeit abnehmen möchtest" },
];

/* § 03 Anwendung — Einsatzkarten (7 items).
 * Category tags are editorial phase labels, not invented content —
 * each mirrors the domain the brief names. The 8th cell is a studio
 * signature plate ("Einsatz nach Projekt"), not a fake item. */
const EINSATZ: { kind: string; text: string }[] = [
  { kind: "Eingang", text: "Formular- und Anfrageprozessen" },
  { kind: "Brücke", text: "Datenübergaben zwischen Tools" },
  { kind: "Vertrieb", text: "Lead-Vorqualifizierung" },
  { kind: "Freigabe", text: "internen Freigaben oder Statuslogiken" },
  { kind: "Dialog", text: "strukturierten E-Mail- und Antwortprozessen" },
  { kind: "Information", text: "Informationsaufbereitung und Weiterleitung" },
  { kind: "Operativ", text: "wiederkehrenden operativen Aufgaben" },
];

/* § 04 Umfang — 6 deliverables. Title + body preserved verbatim. */
const UMFANG: { kind: string; title: string; body: string }[] = [
  {
    kind: "Workflow",
    title: "KI-gestützte Workflows",
    body:
      "Smarte Abläufe, in denen KI dort eingesetzt wird, wo sie echte Entlastung bringt.",
  },
  {
    kind: "Brücke",
    title: "Automationen zwischen Systemen",
    body:
      "Verbindungen zwischen Formularen, CRM, internen Tools, APIs und anderen Plattformen.",
  },
  {
    kind: "Reduktion",
    title: "Reduktion manueller Schritte",
    body:
      "Weniger doppelte Arbeit, weniger händische Übergaben, weniger operative Reibung.",
  },
  {
    kind: "Struktur",
    title: "Prozesslogik mit Struktur",
    body:
      "Nicht nur einzelne Tools, sondern durchdachte Abläufe, Zustände und Übergaben.",
  },
  {
    kind: "Integration",
    title: "Integration in bestehende Systeme",
    body:
      "KI und Automationen werden sinnvoll eingebettet, statt isoliert daneben zu laufen.",
  },
  {
    kind: "Skala",
    title: "Skalierbare digitale Strukturen",
    body:
      "Lösungen, die nicht nur kurzfristig helfen, sondern mit dem Unternehmen mitwachsen können.",
  },
];

/* § 05 Methode */
const METHODE_P1 = "Wir automatisieren nicht blind.";
const METHODE_P2 =
  "Wir schauen zuerst darauf, wo Zeit verloren geht, wo Fehler entstehen und welche Schritte sich unnötig wiederholen.";
const METHODE_P3 = "Erst dann bauen wir eine Lösung, die Prozesse wirklich vereinfacht.";
const METHODE_P4 = "Klar, verständlich und sauber integriert.";
const METHODE_P5 =
  "Nicht als Tech-Spielerei, sondern als funktionierender Teil eines digitalen Systems.";

/* § 06 Absage — three negation lines + closing + ceremonial Statement. */
const ABSAGE_LINES = [
  "Keinen KI-Hype ohne echten Nutzen.",
  "Keine Automation, die nur technisch existiert, aber operativ nichts verbessert.",
  "Keine unverständliche Tool-Konstruktion, die später niemand sauber pflegen kann.",
];
const ABSAGE_CLOSING =
  "Was du bekommst, sind durchdachte digitale Abläufe mit Klarheit, Struktur und echter Entlastung.";

/* Statement — rendered as three-line ceremonial pull. */
const STATEMENT_LINES = [
  "Weniger manuell.",
  "Mehr Struktur.",
  "KI, die im Alltag wirklich hilft.",
];

/* § 07 Kontext — context paragraph + four related routes. */
const KONTEXT_P1 = "Oft ist KI-Automation Teil eines größeren digitalen Setups.";
const KONTEXT_P2 = "Manchmal hängt sie an einem Formularprozess.";
const KONTEXT_P3 = "Manchmal an einer Web-Anwendung.";
const KONTEXT_P4 = "Manchmal an einem Vertriebs- oder Anfrage-Workflow.";
const KONTEXT_P5 =
  "Genau deshalb denken wir nicht isoliert in Tools, sondern in Systemen, Übergaben und sinnvoll verbundenen Prozessen.";

type RelatedRoute = {
  to: string;
  eyebrow: string;
  folio: string;
  title: string;
  lead: string;
  linkLabel: string;
};

const RELATED: RelatedRoute[] = [
  {
    to: "/ki-automationen-integrationen",
    eyebrow: "Verwandt · Kern",
    folio: "Plate 05 · Leistungen",
    title: "KI-Automationen & Integrationen",
    lead:
      "Der umfassendere Leistungsrahmen rund um Workflows, Systemverbindungen und Datenflüsse.",
    linkLabel: "Zur Leistung",
  },
  {
    to: "/web-software",
    eyebrow: "Verwandt · Plattform",
    folio: "Plate 04 · Leistungen",
    title: "Web-Software",
    lead:
      "Wenn Automation an interne Oberflächen grenzt — Dashboards, Portale, operative Tools.",
    linkLabel: "Zur Leistung",
  },
  {
    to: "/leistungen",
    eyebrow: "Studio · Übersicht",
    folio: "Bureau · MMXXVI",
    title: "Alle Leistungen",
    lead:
      "Das vollständige Arbeitsfeld von MAGICKS — von Websites und Shops bis zu Software und Automation.",
    linkLabel: "Übersicht ansehen",
  },
  {
    to: "/kontakt",
    eyebrow: "Studio · Direkt",
    folio: "Bureau · Direktkontakt",
    title: "Kontakt",
    lead:
      "Kurz beschreiben, wo Zeit verloren geht. Wir antworten mit einer ehrlichen Einschätzung.",
    linkLabel: "Projekt besprechen",
  },
];

/* § END Final CTA */
const FINAL_CTA_LINE_A = ["Bereit", "für", "Prozesse,"];
const FINAL_CTA_LINE_B = ["die", "weniger", "Zeit", "kosten", "und", "mehr", "leisten?"];
const FINAL_CTA_LEAD =
  "Wir entwickeln KI-Automationen für Unternehmen, die manuelle Arbeit reduzieren, Abläufe beschleunigen und digitale Prozesse sauber verbinden.";
const FINAL_CTA_BUTTON = "Lass uns über dein Projekt sprechen";

/* ------------------------------------------------------------------
 * Prozess-Register — the page's signature motif.
 *
 * Four rows showing a manual operation on the left fading into its
 * automated counterpart on the right. Reads as a quiet operations
 * log. Stays clearly typographic — no glow, no pseudo-UI chrome.
 * ------------------------------------------------------------------ */
function ProzessRegister() {
  return (
    <div data-ku-ledger className="w-full max-w-[52rem]">
      {/* Top caption rail */}
      <div className="font-mono flex items-center gap-4 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/40 sm:text-[10.5px]">
        <span>Fig. 01 · Prozess-Register</span>
        <span aria-hidden className="h-px flex-1 bg-white/14" />
        <span className="tabular-nums text-white/32">OP-01 — OP-04</span>
      </div>

      {/* Column headers */}
      <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-white/[0.08] pb-4 sm:mt-6 sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-7 md:gap-x-10">
        <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/24 sm:text-[10px]">
          §
        </span>
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/42 sm:text-[10px]">
          Manuell
        </span>
        <span aria-hidden className="hidden sm:block" />
        <span className="font-mono hidden text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/84 sm:block sm:text-[10px]">
          Automatisch
        </span>
      </div>

      {/* Rows — desktop lays out as a 4-col ledger; mobile stacks
          the Manuell/Automatisch pair inside the second column so
          the OP folio keeps its left rail and the reading order is
          OP → Manuell → (↓) → Automatisch top-to-bottom. */}
      <ul className="divide-y divide-white/[0.07]">
        {LEDGER_ROWS.map((row) => (
          <li
            key={row.op}
            data-ku-ledger-row
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-7 sm:py-6 md:gap-x-10"
          >
            <span className="font-mono tabular-nums self-start pt-[0.2rem] text-[10px] font-medium uppercase leading-none tracking-[0.28em] text-white/58 sm:self-auto sm:pt-0 sm:text-[10.5px]">
              {row.op}
            </span>

            {/* Mobile-stacked inner pair — Manuell · ↓ · Automatisch.
                On sm+ this collapses to a plain Manuell cell and the
                sibling grid columns render the arrow + Automatisch. */}
            <div className="flex flex-col gap-2 sm:contents">
              <span className="font-instrument text-[0.98rem] italic leading-[1.32] tracking-[-0.008em] text-white/46 sm:text-[1.06rem] md:text-[1.14rem]">
                {row.manuell}
              </span>

              {/* Mobile-only vertical connector */}
              <span
                aria-hidden
                className="flex items-center gap-2 sm:hidden"
              >
                <span className="block h-px w-5 bg-white/22" />
                <span className="font-mono text-[10px] leading-none text-white/46">
                  ↓
                </span>
              </span>

              {/* Desktop-only connector — lives in grid col 3 */}
              <span
                aria-hidden
                className="hidden items-center gap-2 sm:flex"
              >
                <span aria-hidden className="block h-px w-6 bg-white/22 md:w-9" />
                <span className="font-mono text-[10px] leading-none text-white/46">
                  ↦
                </span>
              </span>

              <span className="font-instrument text-[1.02rem] leading-[1.32] tracking-[-0.008em] text-white/92 sm:text-[1.1rem] md:text-[1.2rem]">
                {row.automatisch}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer caption */}
      <div className="font-mono mt-5 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10px]">
        <span>Vorher / Nachher · 4 Zeilen</span>
        <span aria-hidden className="h-px flex-1 bg-white/[0.08]" />
        <span className="tabular-nums">Dossier · MMXXVI</span>
      </div>
    </div>
  );
}

/* ============================================================== */

export default function KiAutomationUnternehmenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      /* ——— Hero targets ——— */
      const heroSection = root.querySelector<HTMLElement>("[data-ku-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-ku-herocopy]");
      const heroChapter = root.querySelector<HTMLElement>("[data-ku-chapter]");
      const heroDateline = root.querySelector<HTMLElement>("[data-ku-dateline]");
      const heroDatelineRule = root.querySelector<HTMLElement>("[data-ku-dateline-rule]");
      const heroEyebrow = root.querySelector<HTMLElement>("[data-ku-eyebrow]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-ku-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-ku-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-ku-h1]");
      const heroLead1 = root.querySelector<HTMLElement>("[data-ku-lead1]");
      const heroLead2 = root.querySelector<HTMLElement>("[data-ku-lead2]");
      const heroLead3 = root.querySelector<HTMLElement>("[data-ku-lead3]");
      const heroCta = root.querySelector<HTMLElement>("[data-ku-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-ku-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-ku-meta]");
      const heroLedger = root.querySelector<HTMLElement>("[data-ku-ledger]");
      const heroLedgerRows = gsap.utils.toArray<HTMLElement>("[data-ku-ledger-row]");
      const heroCredit = root.querySelector<HTMLElement>("[data-ku-credit]");

      /* ——— Scroll reveals ——— */
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ku-reveal]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-ku-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-ku-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-ku-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-ku-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-ku-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-ku-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-ku-finalcta]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            heroDateline,
            heroDatelineRule,
            heroEyebrow,
            ...heroLineA,
            ...heroLineB,
            heroLead1,
            heroLead2,
            heroLead3,
            heroCta,
            heroCtaRule,
            ...heroMeta,
            heroLedger,
            ...heroLedgerRows,
            heroCredit,
            ...reveals,
            ...pullLines,
            pullHeading,
            ...finalLineA,
            ...finalLineB,
            finalRule,
            ...finalLedger,
            finalCta,
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

      /* ——— Hero choreography ——— */
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set(heroDatelineRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroDateline, { opacity: 0, y: 8 });
      gsap.set(heroEyebrow, { opacity: 0, y: 10 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead1, { opacity: 0, y: 14 });
      gsap.set(heroLead2, { opacity: 0, y: 12 });
      gsap.set(heroLead3, { opacity: 0, y: 12 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroLedger, { opacity: 0, y: 14 });
      gsap.set(heroLedgerRows, { opacity: 0, y: 10 });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.12, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(heroDatelineRule, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.22)
        .to(heroDateline, { opacity: 1, y: 0, duration: 0.85 }, 0.42)
        .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.85 }, 0.5)
        .to(
          heroLineA,
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power4.out" },
          0.64,
        )
        .to(
          heroLineB,
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.08, ease: "power4.out" },
          0.96,
        )
        .to(
          heroH1,
          { letterSpacing: "-0.036em", duration: 1.7, ease: "power2.out" },
          0.74,
        )
        .to(heroLead1, { opacity: 1, y: 0, duration: 1.0 }, 1.38)
        .to(heroLead2, { opacity: 1, y: 0, duration: 0.95 }, 1.58)
        .to(heroLead3, { opacity: 1, y: 0, duration: 1.0 }, 1.78)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 2.02)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 2.12)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, 2.28)
        .to(heroLedger, { opacity: 1, y: 0, duration: 1.0 }, 2.4)
        .to(
          heroLedgerRows,
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
          2.55,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 0.95 }, 3.1);

      /* Camera-push on scroll — restrained lift. Softened from
          the initial -6/0.45 pair so the hero feels like it fades
          with the reader rather than pulling away. */
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -4,
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
      if (heroCredit && heroSection) {
        gsap.to(heroCredit, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "center top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      /* ——— Generic scroll reveals ———
         Shorter travel (18px), earlier trigger (top 86%) and a
         slightly longer duration (1.1s) reads as more restrained
         and less "pop-in" than the first draft. */
      reveals.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      /* ——— Ceremonial pull statement (Weniger manuell…) ——— */
      if (pullLines.length) {
        gsap.set(pullLines, { yPercent: 110, opacity: 0 });
        if (pullHeading) gsap.set(pullHeading, { letterSpacing: "0.008em" });
        const tl = gsap
          .timeline({
            scrollTrigger: { trigger: pullLines[0], start: "top 78%", once: true },
          })
          .to(pullLines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.45,
            ease: "power4.out",
            stagger: 0.14,
          });
        if (pullHeading) {
          tl.to(
            pullHeading,
            { letterSpacing: "-0.036em", duration: 1.8, ease: "power2.out" },
            0.2,
          );
        }
      }

      /* ——— Final CTA choreography ——— */
      if (finalLineA.length || finalLineB.length) {
        gsap.set([...finalLineA, ...finalLineB], { yPercent: 118, opacity: 0 });
        gsap.set(finalRule, { scaleX: 0, transformOrigin: "center" });
        gsap.set(finalLedger, { opacity: 0, y: 14 });
        gsap.set(finalCta, { opacity: 0, y: 18, scale: 0.96 });
        const trigger =
          (finalLineA[0] as HTMLElement | undefined)?.closest("section") ?? finalLineA[0];
        gsap
          .timeline({
            scrollTrigger: { trigger, start: "top 72%", once: true },
            defaults: { ease: "power4.out" },
          })
          .to(finalLineA, { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.07 }, 0)
          .to(finalLineB, { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.07 }, 0.25)
          .to(finalRule, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.7)
          .to(
            finalCta,
            { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "back.out(1.2)" },
            0.95,
          )
          .to(finalLedger, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1 }, 1.1);
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/ki-automation-unternehmen" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* ============================================================
           § 00 — HERO
        ============================================================ */}
        <section
          data-ku-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-40 lg:px-16 lg:pb-52"
        >
          {/* Soft plate texture — vertical hairline rules only.
              Distinct from /ki-automationen-integrationen (dot mesh)
              and /webdesign-kassel (horizontal plate). Reads as a
              quiet operations sheet. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 128px)",
              maskImage:
                "radial-gradient(ellipse 66% 68% at 32% 54%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 66% 68% at 32% 54%, black, transparent)",
            }}
          />

          {/* Vertical left-edge credit */}
          <div
            data-ku-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden select-none md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; OPERATIONS &nbsp;·&nbsp; DOSSIER &nbsp;·&nbsp; MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            {/* ----- Top masthead ----- */}
            <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:mb-16">
              <div data-ku-chapter>
                <ChapterMarker num={CHAPTER.num} label={CHAPTER.label} />
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span
                  data-ku-dateline
                  className="font-mono flex items-center gap-4 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:gap-5 sm:text-[10px] md:text-[10.5px]"
                >
                  <span>Studio · Dossier</span>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="text-white/40">Unternehmen · MMXXVI</span>
                </span>
                <span
                  aria-hidden
                  data-ku-dateline-rule
                  className="block h-px flex-1 origin-left bg-white/12"
                />
              </div>
            </div>

            <div data-ku-herocopy className="relative">
              {/* Eyebrow */}
              <p
                data-ku-eyebrow
                className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/52 sm:mb-10 sm:text-[10.5px]"
              >
                {HERO_EYEBROW}
              </p>

              {/* H1 — split into two visual lines, word-by-word reveal */}
              <h1
                data-ku-h1
                className="font-instrument max-w-[60rem] text-[2.2rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[2.9rem] md:text-[3.75rem] lg:text-[4.45rem] xl:text-[4.95rem]"
              >
                <span className="block">
                  {H1_PRIMARY_WORDS.map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-ku-h1a
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/62 sm:mt-2">
                  {H1_ITALIC_WORDS.map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-ku-h1b
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Lead — three paragraphs, two typographic tiers.
                  P1 serif italic (the thesis), P2 a confident beat,
                  P3 body font with italic inline emphasis. */}
              <div className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p
                  data-ku-lead1
                  className="font-instrument text-[1.28rem] italic leading-[1.38] tracking-[-0.01em] text-white/88 sm:text-[1.48rem] md:text-[1.62rem]"
                >
                  {HERO_LEAD_1}
                </p>
                <p
                  data-ku-lead2
                  className="font-instrument mt-6 text-[1.12rem] italic leading-[1.4] tracking-[-0.008em] text-white/70 sm:text-[1.22rem] md:text-[1.3rem]"
                >
                  {HERO_LEAD_2}
                </p>
                <p
                  data-ku-lead3
                  className="font-ui mt-6 border-t border-white/[0.08] pt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px]"
                >
                  {HERO_LEAD_3}
                </p>
              </div>

                      {/* CTA row — primary underline Link, divider, and a
                          quiet Direktkontakt rail. The Direktkontakt lane is
                          intentionally understated (hairline + mono chip +
                          italic email) so the page keeps its editorial voice
                          while still offering a conversion alternative. */}
                      <div
                        data-ku-cta
                        className="mt-12 flex flex-col items-start gap-6 sm:mt-14 sm:flex-row sm:items-center sm:gap-10 md:mt-16 md:gap-12"
                      >
                        <Link
                          to="/kontakt"
                          className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                          aria-label="Projekt anfragen"
                        >
                          <span className="relative pb-3">
                            <span className="font-ui">Projekt anfragen</span>
                            <span
                              data-ku-cta-rule
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

                        {/* Editorial divider — hairline + mono chip */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span aria-hidden className="block h-px w-6 bg-white/20 sm:w-8" />
                          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10px]">
                            oder · direkt
                          </span>
                        </div>

                        {/* Direktkontakt — italic serif email link */}
                        <a
                          href="mailto:hello@magicks.studio"
                          className="group/mail relative inline-flex items-baseline gap-2 text-[15px] font-medium text-white/82 no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white sm:text-[15.5px] md:text-[16px]"
                          aria-label="Direktkontakt per E-Mail"
                        >
                          <span className="relative pb-2">
                            <span className="font-instrument italic tracking-[-0.006em]">
                              hello@magicks.studio
                            </span>
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/16"
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white/60 transition-transform duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/mail:scale-x-100 group-focus-visible/mail:scale-x-100"
                            />
                          </span>
                        </a>
                      </div>

              {/* Operations meta triad — Manuell · Struktur · Entlastung.
                  Mirrors the page's thesis as a three-beat kicker:
                  reducing manual → adding structure → delivering relief. */}
              <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-16 md:mt-20">
                {[
                  { num: "01", label: "Manuell reduzieren" },
                  { num: "02", label: "Struktur schaffen" },
                  { num: "03", label: "Entlastung spürbar" },
                ].map((m, i) => (
                  <span key={m.num} className="inline-flex items-center gap-3">
                    <span
                      data-ku-meta
                      className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                    >
                      <span className="tabular-nums text-white/34">{m.num}</span>
                      {m.label}
                    </span>
                    {i < 2 && (
                      <span
                        aria-hidden
                        data-ku-meta
                        className="inline-flex items-center gap-1.5 text-white/30"
                      >
                        <span className="block h-px w-5 bg-white/26 sm:w-8" />
                        <span className="font-mono text-[10px] leading-none">→</span>
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* Prozess-Register — signature motif */}
              <div className="mt-16 sm:mt-20 md:mt-24">
                <ProzessRegister />
              </div>
            </div>
          </div>

          {/* Bottom-right readout — pared back to a single live tick +
              edition mark. The MANUELL → STRUKTUR → ENTLASTUNG beat
              already lives as the meta triad inside the hero, so we
              resist repeating it here. Reads as a quiet issue
              signature, not an AI status bar. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Dossier · Live
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Operations · MMXXVI
            </span>
          </div>
        </section>

        <SectionTransition from="§ 00  Hero — Dossier" to="§ 01  Credo" />

        {/* ============================================================
           § 01 — CREDO · "Nicht mehr KI. Sondern sinnvoll eingesetzte KI."
           Two-column split. Ceremonial H2 left, supporting paragraphs
           right. Reads as a confident positioning statement, not a
           marketing tagline.
        ============================================================ */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-48 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              background:
                "radial-gradient(ellipse 56% 44% at 50% 52%, rgba(255,255,255,0.03), transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Credo
                </p>
                <h2 className="font-instrument text-[2.1rem] leading-[1.02] tracking-[-0.034em] text-white sm:text-[2.75rem] md:text-[3.35rem] lg:text-[3.8rem]">
                  <span className="block">{CREDO_HEADLINE_PLAIN}</span>
                  <em className="mt-2 block italic text-white/62 sm:mt-3">
                    {CREDO_HEADLINE_ITALIC}
                  </em>
                </h2>

                {/* Forward cross-ref — mirrors sibling page convention */}
                <div
                  data-ku-reveal
                  className="mt-10 flex items-center gap-4 md:mt-14"
                >
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 05 Methode
                  </span>
                </div>
              </div>

              <div data-ku-reveal className="md:pt-3">
                {/* Beat A — KI thesis */}
                <p className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/88 sm:text-[1.34rem] md:text-[1.48rem]">
                  {CREDO_P1}
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px]">
                  {CREDO_P2}
                </p>

                {/* Studio coda — hairline divider + mono chip, so the
                    right column reads as two decisive beats (thesis →
                    positioning) rather than a four-paragraph wall. */}
                <div className="mt-10 flex items-center gap-4 md:mt-12">
                  <span aria-hidden className="h-px w-10 bg-white/18 md:w-14" />
                  <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 md:text-[10.5px]">
                    Studio · Haltung
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                </div>

                {/* Beat B — MAGICKS positioning */}
                <p className="font-instrument mt-8 text-[1.15rem] italic leading-[1.38] tracking-[-0.01em] text-white/84 md:text-[1.28rem]">
                  {CREDO_P3}
                </p>
                <p className="font-ui mt-4 text-[15px] leading-[1.72] text-white/62 md:text-[16px]">
                  {CREDO_P4}
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 01  Credo" to="§ 02  Zielbild" />

        {/* ============================================================
           § 02 — ZIELBILD · Audience register
           6 rows, each routed to a "Prozess-Phase" — reads as a
           qualifying register, not a generic bullet list.
        ============================================================ */}
        <section className="relative px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 02 — Zielbild
                  </p>
                  <ChapterMarker num="02" label="Register · Auftrag" />
                </div>
              </div>

              <div>
                <h2
                  data-ku-reveal
                  className="font-instrument max-w-[50rem] text-[2rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.55rem]"
                >
                  Für Unternehmen, die Prozesse{" "}
                  <em className="italic text-white/62">
                    sauberer und intelligenter
                  </em>{" "}
                  organisieren wollen
                </h2>

                <p
                  data-ku-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.72] text-white/60 md:mt-10 md:text-[15.5px]"
                >
                  Diese Seite ist für Unternehmen, die wiederkehrende Aufgaben reduzieren,
                  Abläufe beschleunigen und digitale Prozesse besser miteinander verbinden
                  wollen.
                </p>

                <p
                  data-ku-reveal
                  className="font-instrument mt-10 text-[1.15rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.28rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/* Audience register — each row carries a Prozess-Phase
                    chip (Prozess / Brücke / Reduktion / Integration /
                    Struktur / Entlastung) so the list reads as a
                    taxonomy of requests, not a feature dump. */}
                <ul className="mt-10 space-y-0 border-t border-white/[0.07] md:mt-14">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item.text}
                      data-ku-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-2 border-b border-white/[0.07] py-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-9 md:py-8"
                    >
                      <span className="font-mono tabular-nums text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/48 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-instrument text-[1.18rem] leading-[1.32] tracking-[-0.012em] text-white/90 md:text-[1.42rem] lg:text-[1.58rem]">
                        {item.text}
                      </p>
                      <span
                        aria-hidden
                        className="col-span-2 inline-flex items-center gap-3 md:col-span-1"
                      >
                        <span aria-hidden className="h-px w-6 bg-white/22 md:w-9" />
                        <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/58 md:text-[10px]">
                          OP-{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-instrument text-[0.95rem] italic leading-none tracking-[-0.005em] text-white/68 md:text-[1.02rem]">
                          {item.phase}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  data-ku-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Auftrag</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">06 Positionen · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02  Zielbild" to="§ 03  Anwendung" tone="darker" />

        {/* ============================================================
           § 03 — ANWENDUNG · Einsatzkarten (2×4 plate grid)
           Premium, visually strong — deliberately NOT a generic AI
           feature list. Each card is an editorial plate: folio, kind
           tag, italic serif phrase, hairline inset. The 8th cell is a
           studio signature plate that frames the rest as "selected"
           rather than exhaustive.
        ============================================================ */}
        <section className="relative overflow-hidden bg-[#070708] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 58% 46% at 50% 52%, rgba(255,255,255,0.035), transparent 64%)",
            }}
          />
          {/* Sheet grid — wide vertical hairlines, very faint.
              Reads as a typesetter's plate, not a UI. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 120px)",
              maskImage:
                "radial-gradient(ellipse 66% 60% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 66% 60% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 03 — Anwendung
                  </p>
                  <ChapterMarker num="03" label="Einsatzkarten" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    07 Felder · projektspezifisch
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-ku-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.55rem]"
                >
                  Wo KI-Automation im Unternehmen{" "}
                  <em className="italic text-white/62">sinnvoll sein kann</em>
                </h2>

                <p
                  data-ku-reveal
                  className="font-instrument mt-9 max-w-[38rem] text-[1.1rem] italic leading-[1.5] tracking-[-0.008em] text-white/68 md:mt-11 md:text-[1.2rem]"
                >
                  Zum Beispiel bei:
                </p>

                        {/* Einsatzkarten — 2×4 plate grid. Editorial cards,
                            hairline frame, folio top, italic serif body,
                            kind chip bottom. Hover lifts the plate, deepens
                            the border and washes a low-contrast fill in —
                            makes the grid feel engaged without glowing. The
                            8th cell is a studio signature — "Einsatz nach
                            Projekt" — which frames the seven above as
                            representative, not exhaustive. */}
                        <div className="mt-14 grid grid-cols-1 gap-0 border-t border-white/[0.08] sm:grid-cols-2 md:mt-20 md:grid-cols-2 lg:grid-cols-2">
                          {EINSATZ.map((item, i) => {
                            const isLastCol = i % 2 === 1;
                            return (
                              <article
                                key={item.text}
                                data-ku-reveal
                                className={`group/plate relative flex min-h-[13rem] flex-col justify-between border-b border-white/[0.08] px-5 py-7 transition-[border-color,background-color,transform] duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.016] hover:border-white/[0.16] sm:min-h-[15rem] sm:px-6 sm:py-9 md:min-h-[17rem] md:px-9 md:py-12 lg:px-11 ${
                                  isLastCol
                                    ? ""
                                    : "sm:border-r sm:border-white/[0.08]"
                                }`}
                              >
                                {/* Corner hints — top-left + bottom-right
                                    brighten on hover to give the plate a
                                    subtle "coming alive" tick. */}
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-white/26 transition-[border-color] duration-[620ms] group-hover/plate:border-white/50"
                                />
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-white/0 transition-[border-color] duration-[620ms] group-hover/plate:border-white/32"
                                />
                                {/* Folio + kind chip */}
                                <div className="flex items-baseline justify-between gap-4">
                                  <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/58 transition-colors duration-[620ms] group-hover/plate:text-white/82 md:text-[10.5px]">
                                    EK-{String(i + 1).padStart(2, "0")}
                                  </span>
                                  <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/44 transition-colors duration-[620ms] group-hover/plate:text-white/68 md:text-[10px]">
                                    {item.kind}
                                  </span>
                                </div>

                                <h3 className="font-instrument mt-8 text-[1.32rem] italic leading-[1.24] tracking-[-0.014em] text-white transition-transform duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/plate:translate-y-[-1px] md:mt-10 md:text-[1.55rem] lg:text-[1.72rem]">
                                  {item.text}
                                </h3>

                                <div className="mt-7 flex items-center gap-3 md:mt-10">
                                  <span
                                    aria-hidden
                                    className="h-px w-7 origin-left bg-white/22 transition-[transform,background-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/plate:scale-x-[1.55] group-hover/plate:bg-white/52 md:w-10 md:group-hover/plate:scale-x-[1.4]"
                                  />
                                  <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.3em] text-white/36 transition-colors duration-[620ms] group-hover/plate:text-white/72 md:text-[9.5px]">
                                    Feld · {String(i + 1).padStart(2, "0")} / {String(EINSATZ.length).padStart(2, "0")}
                                  </span>
                                </div>
                              </article>
                            );
                          })}

                          {/* Studio signature plate — 8th cell.
                              Frames the seven above as representative; the
                              reader doesn't read them as "all of automation".
                              Kept static — it is the editorial colophon of
                              the grid, not an interactive card. */}
                          <article
                            data-ku-reveal
                            className="relative flex min-h-[13rem] flex-col justify-between border-b border-white/[0.08] bg-[#08080A] px-5 py-7 sm:min-h-[15rem] sm:px-6 sm:py-9 md:min-h-[17rem] md:px-9 md:py-12 lg:px-11"
                          >
                            {/* Bracket frame — all four corners so the cell
                                reads as a signature plate, not a missing
                                interactive card. */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-white/28"
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-white/28"
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/28"
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/28"
                            />
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/44 md:text-[10.5px]">
                                EK-08
                              </span>
                              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:text-[10px]">
                                Studio · Signatur
                              </span>
                            </div>

                            <p className="font-instrument mt-8 text-[1.22rem] italic leading-[1.35] tracking-[-0.014em] text-white/70 md:mt-10 md:text-[1.42rem] lg:text-[1.58rem]">
                              Einsatz nach Projekt —{" "}
                              <em className="not-italic text-white/48">
                                weitere Felder projektspezifisch.
                              </em>
                            </p>

                            <div className="mt-7 flex items-center gap-3 md:mt-10">
                              <span aria-hidden className="h-px w-7 bg-white/22 md:w-10" />
                              <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.3em] text-white/36 md:text-[9.5px]">
                                Auswahl · kuratiert
                              </span>
                            </div>
                          </article>
                        </div>

                <div
                  data-ku-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Einsatz</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">07 kuratierte Felder</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 03  Anwendung" to="§ 04  Umfang" />

        {/* ============================================================
           § 04 — UMFANG · 6 deliverables
           Numbered 2-col register with kind chip, title, body. Mirrors
           the sibling's "Flussregister" rhythm, but uses "POS-NN"
           (positions in a scope-of-work) instead of "FLOW-NN".
        ============================================================ */}
        <section className="relative px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 04 — Umfang
                  </p>
                  <ChapterMarker num="04" label="Posten" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    06 Posten · Leistung
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-ku-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.55rem]"
                >
                  Was wir für dich <em className="italic text-white/62">umsetzen</em>
                </h2>

                <ol className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.07] md:mt-20 md:grid-cols-2">
                  {UMFANG.map((item, i) => (
                    <li
                      key={item.title}
                      data-ku-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.07] py-8 sm:gap-x-8 md:py-10"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        POS-{String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 md:text-[10.5px]">
                            {item.kind}
                          </span>
                          <span aria-hidden className="h-px w-3 bg-white/18 md:w-5" />
                          <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:text-[9.5px]">
                            Posten · {String(i + 1).padStart(2, "0")} / {String(UMFANG.length).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="font-instrument text-[1.3rem] leading-[1.18] tracking-[-0.016em] text-white md:text-[1.5rem] lg:text-[1.65rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.65] text-white/58 md:text-[14.5px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div
                  data-ku-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Umfang</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Leistung · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 04  Umfang" to="§ 05  Methode" tone="darker" />

        {/* ============================================================
           § 05 — METHODE · "Wie wir KI-Automation denken"
           Two-column split. Left: heading + forward ref. Right:
           paragraphs + a three-row "Diagnose" rail that mirrors the
           brief's thinking verbs (Zeit / Fehler / Wiederholung).
        ============================================================ */}
        <section className="relative bg-[#09090A] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-48 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Methode
                </p>
                <h2 className="font-instrument text-[2.1rem] leading-[1.02] tracking-[-0.032em] text-white sm:text-[2.75rem] md:text-[3.35rem] lg:text-[3.8rem]">
                  Wie wir KI-Automation{" "}
                  <em className="italic text-white/62">denken</em>
                </h2>

                {/* Backward ref — a gentle cross-rail */}
                <div data-ku-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    ← Siehe § 01 Credo
                  </span>
                </div>
              </div>

              <div data-ku-reveal className="md:pt-3">
                <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/86 sm:text-[1.32rem] md:text-[1.44rem]">
                  {METHODE_P1}
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px]">
                  {METHODE_P2}
                </p>

                {/* Diagnose rail — three-row register echoing the
                    thinking verbs (Zeit / Fehler / Wiederholung).
                    Deliberately distinct from the sibling's
                    italic hairline-list: here each row carries a
                    DIAG-NN folio so the rail reads as a tool, not
                    three floating sentences. */}
                <div
                  data-ku-reveal
                  className="mt-10 border-y border-white/[0.08] md:mt-12"
                >
                  <div className="flex items-center justify-between gap-4 py-3 md:py-4">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/44 sm:text-[10px]">
                      Diagnose · Rail
                    </span>
                    <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10px]">
                      03 Prüfpunkte
                    </span>
                  </div>

                  <ul className="border-t border-white/[0.08]">
                    {[
                      { num: "DIAG-01", label: "Wo geht Zeit verloren?" },
                      { num: "DIAG-02", label: "Wo entstehen Fehler?" },
                      { num: "DIAG-03", label: "Wo wiederholt sich Arbeit unnötig?" },
                    ].map((row, idx, arr) => (
                      <li
                        key={row.num}
                        className={`grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 py-5 md:gap-x-9 md:py-6 ${
                          idx < arr.length - 1 ? "border-b border-white/[0.07]" : ""
                        }`}
                      >
                        <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/54 md:text-[10px]">
                          {row.num}
                        </span>
                        <p className="font-instrument text-[1.18rem] italic leading-[1.35] tracking-[-0.012em] text-white/90 md:text-[1.36rem] lg:text-[1.48rem]">
                          {row.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/62 md:mt-12 md:text-[16px]">
                  {METHODE_P3}
                </p>
                <p className="font-instrument mt-5 text-[1.08rem] italic leading-[1.4] tracking-[-0.008em] text-white/80 md:text-[1.2rem]">
                  {METHODE_P4}
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/60 md:text-[16px]">
                  {METHODE_P5}
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 05  Methode" to="§ 06  Absage" />

        {/* ============================================================
           § 06 — ABSAGE · negation ladder + ceremonial Statement
           Three em-dash lines declare what MAGICKS will not ship; the
           closing paragraph turns the refusal into a promise; the
           ceremonial Statement — "Weniger manuell. Mehr Struktur. KI,
           die im Alltag wirklich hilft." — lands as a three-line pull.
        ============================================================ */}
        <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-56">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 55% 42% at 50% 50%, rgba(255,255,255,0.03), transparent 62%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-16 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 06 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-ku-reveal
                  className="font-instrument max-w-[48rem] text-[2.1rem] leading-[1.02] tracking-[-0.032em] text-white sm:text-[2.75rem] md:text-[3.35rem] lg:text-[3.8rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/62">nicht bekommst</em>
                </h2>

                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {ABSAGE_LINES.map((line) => (
                    <li
                      key={line}
                      data-ku-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.55rem] italic leading-none text-white/38 md:text-[1.95rem] lg:text-[2.15rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.35rem] leading-[1.3] tracking-[-0.014em] text-white/80 md:text-[1.8rem] lg:text-[2.1rem] xl:text-[2.25rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>

                        {/* Closing promise — lifted to italic serif so it
                            doesn't get lost between the em-dash list and the
                            ceremonial Statement below. Reads as the pivot
                            from "nicht" → "sondern". */}
                        <div
                          data-ku-reveal
                          className="mt-16 flex max-w-[46rem] flex-col gap-5 border-l border-white/[0.1] pl-6 md:mt-20 md:pl-8"
                        >
                          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/46 md:text-[10.5px]">
                            → Sondern
                          </span>
                          <p className="font-instrument text-[1.28rem] italic leading-[1.42] tracking-[-0.012em] text-white/86 md:text-[1.48rem] lg:text-[1.6rem]">
                            {ABSAGE_CLOSING}
                          </p>
                        </div>
              </div>
            </div>

            {/* Ceremonial Statement — three-line pull, full-width.
                Sits under the Absage grid so the refusal lands first,
                then the positive declaration takes over with editorial
                weight. Word-stagger handled by [data-ku-pull]. */}
            <div className="mt-24 sm:mt-32 md:mt-40">
              <div className="mb-14 flex items-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § Haltung — Statement
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              <h3
                data-ku-pullheading
                className="font-instrument max-w-[78rem] text-[2.25rem] leading-[1.04] tracking-[-0.036em] text-white sm:text-[3rem] md:text-[3.85rem] lg:text-[4.5rem] xl:text-[5rem]"
              >
                <span className="block overflow-hidden">
                  <span data-ku-pull className="inline-block">
                    {STATEMENT_LINES[0]}
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-ku-pull className="inline-block italic text-white/64">
                    {STATEMENT_LINES[1]}
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-ku-pull className="inline-block">
                    {STATEMENT_LINES[2]}
                  </span>
                </span>
              </h3>

              <div className="mt-14 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Dossier · Haltung · MMXXVI
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 06  Absage" to="§ 07  Kontext" tone="darker" />

        {/* ============================================================
           § 07 — KONTEXT · "KI-Automation ist selten eine Einzellösung"
           Context intro + 2×2 related-routes plate grid.
        ============================================================ */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              background:
                "radial-gradient(ellipse 56% 46% at 50% 50%, rgba(255,255,255,0.028), transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mb-16 flex items-center gap-5 sm:mb-20">
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § 07 — Kontext
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-ku-reveal>
                <h2 className="font-instrument max-w-[42rem] text-[2.1rem] leading-[1.04] tracking-[-0.032em] text-white sm:text-[2.75rem] md:text-[3.35rem] lg:text-[3.8rem]">
                  KI-Automation ist{" "}
                  <em className="italic text-white/62">
                    selten eine Einzellösung
                  </em>
                </h2>
              </div>

              <div data-ku-reveal className="md:pt-3">
                <p className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/88 sm:text-[1.34rem] md:text-[1.46rem]">
                  {KONTEXT_P1}
                </p>

                {/* Manchmal-Register — the three "Manchmal…"-beats
                    from the brief, typeset as a register with inline
                    route hand-offs. Turns body copy into an editorial
                    link surface: each context sits beside the page it
                    actually connects to. Copy is preserved verbatim. */}
                <ul className="mt-10 border-t border-white/[0.08] md:mt-12">
                  {[
                    {
                      text: KONTEXT_P2,
                      to: "/ki-automationen-integrationen",
                      route: "Integrationen",
                    },
                    {
                      text: KONTEXT_P3,
                      to: "/web-software",
                      route: "Web-Software",
                    },
                    {
                      text: KONTEXT_P4,
                      to: "/ki-automationen-integrationen",
                      route: "Integrationen",
                    },
                  ].map((row, idx) => (
                    <li
                      key={`${row.to}-${idx}`}
                      data-ku-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-3 border-b border-white/[0.07] py-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-8 md:py-6"
                    >
                      <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/48 md:text-[10.5px]">
                        §{" "}
                        <span className="text-white/68">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </span>

                      <p className="font-instrument text-[1.02rem] italic leading-[1.4] tracking-[-0.008em] text-white/82 md:text-[1.12rem] lg:text-[1.18rem]">
                        {row.text}
                      </p>

                      <Link
                        to={row.to}
                        className="group/route col-span-2 inline-flex items-baseline gap-2 text-[13px] font-medium text-white/78 no-underline transition-colors duration-[620ms] hover:text-white md:col-span-1 md:self-end md:justify-self-end md:text-[13.5px]"
                      >
                        <span aria-hidden className="font-mono text-[11px] leading-none text-white/46 transition-colors duration-[620ms] group-hover/route:text-white/80">
                          →
                        </span>
                        <span className="relative pb-1">
                          <span className="font-instrument italic tracking-[-0.004em]">
                            {row.route}
                          </span>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/18"
                          />
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white/70 transition-transform duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/route:scale-x-100 group-focus-visible/route:scale-x-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/66 md:mt-12 md:text-[16px]">
                  {KONTEXT_P5}
                </p>
              </div>
            </div>

                    {/* 2×2 related-routes plate grid. Each cell is an editorial
                        link — eyebrow, folio, italic serif title, short lead,
                        underline link with arrow. The entire plate is clickable
                        via a stretched-link ::after on the Link (so there is
                        still exactly one focusable target per plate). The
                        plate hover deepens the border, brightens the title,
                        and advances the underline on the CTA. Reads as four
                        handoffs, not a generic "see also" footer. */}
                    <div className="mt-20 grid grid-cols-1 gap-0 border-t border-white/[0.08] md:mt-28 md:grid-cols-2">
                      {RELATED.map((r, i) => {
                        const isLastCol = i % 2 === 1;
                        return (
                          <article
                            key={r.to}
                            data-ku-reveal
                            className={`group/plate relative flex min-h-[14rem] flex-col justify-between border-b border-white/[0.08] px-5 py-8 transition-[border-color,background-color] duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.014] hover:border-white/[0.16] sm:min-h-[16rem] sm:px-6 sm:py-10 md:min-h-[18rem] md:px-10 md:py-12 lg:px-12 ${
                              isLastCol ? "" : "md:border-r md:border-white/[0.08]"
                            }`}
                          >
                            {/* Corner brackets — top-left always visible,
                                bottom-right materialises on hover. */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-white/28 transition-[border-color] duration-[620ms] group-hover/plate:border-white/56"
                            />
                            <span
                              aria-hidden
                              className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/0 transition-[border-color] duration-[620ms] group-hover/plate:border-white/34"
                            />

                            <div className="flex items-baseline justify-between gap-4">
                              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/58 md:text-[10.5px]">
                                {r.eyebrow}
                              </span>
                              <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/34 md:text-[10px]">
                                {r.folio}
                              </span>
                            </div>

                            <div className="mt-8 md:mt-10">
                              <h3 className="font-instrument text-[1.45rem] leading-[1.18] tracking-[-0.016em] text-white transition-colors duration-[620ms] group-hover/plate:text-white md:text-[1.72rem] lg:text-[1.92rem]">
                                {r.title}
                              </h3>
                              <p className="font-ui mt-4 max-w-[32rem] text-[14px] leading-[1.65] text-white/58 transition-colors duration-[620ms] group-hover/plate:text-white/72 md:text-[14.5px]">
                                {r.lead}
                              </p>
                            </div>

                            <div className="mt-8 md:mt-10">
                              <Link
                                to={r.to}
                                className="group/link relative inline-flex items-baseline gap-3 text-[14px] font-medium tracking-[-0.005em] text-white no-underline before:pointer-events-auto before:absolute before:inset-0 before:z-10 before:content-[''] sm:text-[14.5px] md:text-[15.5px]"
                                aria-label={`${r.linkLabel}: ${r.title}`}
                              >
                                <span className="relative pb-2">
                                  <span className="font-ui">{r.linkLabel}</span>
                                  <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/32"
                                  />
                                  <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/plate:scale-x-100 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
                                  />
                                </span>
                                <span
                                  aria-hidden
                                  className="font-instrument text-[1.1em] italic text-white/82 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/plate:-translate-y-[3px] group-hover/plate:translate-x-[3px] group-hover/link:-translate-y-[3px] group-hover/link:translate-x-[3px]"
                                >
                                  ↗
                                </span>
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                    </div>

            <div
              data-ku-reveal
              className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
            >
              <span>Register · Kontext</span>
              <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
              <span className="tabular-nums">04 Anschlüsse</span>
            </div>
          </div>
        </section>

        {/* ============================================================
           § END — FINAL CTA
        ============================================================ */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Plate corner crop marks — silent brackets only, no
              labels. Restraint reads more premium than labelling each
              corner. The edition mark lives once in the top rail. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/26" />
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/26" />
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/26" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/26" />
          </div>

          {/* Single editorial mark — centred across the top of the
              plate. Acts as the issue signature, replaces the four
              label-pairs we used to print at each corner. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-8 hidden -translate-x-1/2 items-center gap-4 md:top-10 md:flex lg:top-12"
          >
            <span aria-hidden className="h-px w-10 bg-white/20 sm:w-14" />
            <span className="font-mono whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.46em] text-white/44 sm:text-[10px]">
              Operations · Dossier · Nº 01
            </span>
            <span aria-hidden className="h-px w-10 bg-white/20 sm:w-14" />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[118vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 32%, transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 96px)",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.4rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[3.3rem] md:text-[4.4rem] lg:text-[5.2rem] xl:text-[5.85rem]">
                <span className="block">
                  {FINAL_CTA_LINE_A.map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ku-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {FINAL_CTA_LINE_B.map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ku-finalb className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>

              {/* Editorial rule */}
              <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
                <span
                  aria-hidden
                  className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40"
                >
                  ·
                </span>
                <div aria-hidden className="relative h-px flex-1">
                  <span
                    data-ku-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40"
                >
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/62 md:mt-12 md:text-[16.5px]">
                {FINAL_CTA_LEAD}
              </p>

              {/* CTA + operations ledger */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div
                  data-ku-finalcta
                  className="flex justify-center sm:justify-start"
                >
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>{FINAL_CTA_BUTTON}</span>
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

                <div className="flex flex-col gap-5 border-l border-white/[0.08] pl-6 sm:pl-10 md:pl-12">
                  <div data-ku-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      KI-Automation · Workflow · Integration
                    </span>
                  </div>

                  <div data-ku-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Dossier
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Kurze Einschätzung — ohne Druck, ohne Standard-Pitch.
                    </span>
                  </div>

                  <div data-ku-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Direkt
                    </span>
                    <a
                      href="mailto:hello@magicks.studio"
                      className="font-instrument text-[1.1rem] italic text-white no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white/82 sm:text-[1.25rem] md:text-[1.35rem]"
                    >
                      hello@magicks.studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom colophon — 4-field signature */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "KI-Automation · Unternehmen" },
                  { k: "Dossier", v: "Operations · MMXXVI" },
                  { k: "Rhythm", v: "Manuell → Struktur → Entlastung" },
                  { k: "Edition", v: "Magicks · MMXXVI" },
                ].map((item, i) => (
                  <div
                    key={item.k}
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

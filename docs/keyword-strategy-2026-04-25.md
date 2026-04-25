# Keyword Strategy — MAGICKS Studio

*Date: 2026-04-25 · Author: senior SEO strategist · Skill stack: `find-keywords` (jezweb) + `keyword-research` (aaron-he-zhu / opc).*
*Source-of-truth context: `.agents/product-marketing-context.md` (V1) · prior audit: `docs/seo-audit-2026-04-25.md`.*

> **Scope**: practical keyword universe + page-level mapping for the existing 14 indexable routes + future-content opportunity space.
> **Out of scope this pass**: copy rewrites, code changes, schema implementation, programmatic SEO at scale.

---

## 0 · Methodology & Caveats

### Data sources

- **No live tool access** for this pass (no Ahrefs, Semrush, GSC). Volume / Difficulty figures below are **calibrated estimates** for the **DE market** based on industry knowledge of agency-services SERPs in 2025/2026.
- Volume = average monthly searches in **Germany**, AdWords-style.
- KD = competitive difficulty 0–100 (Ahrefs-equivalent: ~organic top-10 backlink + DR difficulty).
- **All numbers are ranges, not point estimates.** Treat them as **directional**. Re-run with live tooling once GSC + Ahrefs/Semrush access lands.
- Local Kassel volumes are inherently small (~50–320 / mo for top terms). Treat **intent quality** as the dominant signal, not volume.

### Opportunity Score formula (used to sort)

```
Opportunity = Volume × (1 − KD/100) × Intent Multiplier

Intent multipliers:
  Transactional / Hire-Engage  → 1.5
  Commercial Investigation     → 1.3
  Local-Transactional          → 1.5  (within service area)
  Informational                → 1.0
  Navigational                 → 0.2
```

For a small premium studio with low DR, **prefer Tier 2 / Tier 3 (body + long-tail) over Tier 1 head terms**. Brand authority for *"Webagentur"* (head, KD ≈ 65) takes 12–24 months; *"Webagentur Kassel für Mittelstand"* (long-tail, KD ≈ 18) ranks in 4–12 weeks.

### Priority bands

- **High**: realistic to rank within 3–6 months at current DR; commercial / local-transactional intent; aligns with existing pages.
- **Medium**: realistic in 6–12 months; supporting cluster terms; informational anchors that feed the local pack.
- **Low**: deferred until proof points / domain authority justify the chase, or until a programmatic / content engine is in place.

### Cannibalization screening rule

**One primary keyword → one canonical page.** If two pages would target the same primary, the homepage *always loses* to the dedicated service / SEO page (it can't outrank a topical specialist). The homepage's role is brand + identity + cluster-pillar — never a service-specific keyword.

Internal-link bias: every Tier-1 / Tier-2 keyword's canonical page should be **one click from the homepage** (footer at minimum, ideally surfaced via Hero CTAs or section anchors).

---

## 1 · Keyword Cluster Map (13 clusters)

> Each cluster = **1 pillar page** (canonical target) + **3–6 supporting terms** (variants, modifiers, long-tail).
> Volume is monthly DE, ranges are 1.5× IQR-style estimates.

### Cluster 1 · **Webdesign Kassel**

| Field | Value |
| --- | --- |
| **Pillar page** | `/webdesign-kassel` (existing) |
| **Search intent** | Local-Transactional (primary) + Local-Commercial-Investigation (secondary) |
| **Priority** | **High** — already a dedicated SEO landing; copy is editorial; needs schema + title polish to rank |
| **Title angle** | "Webdesign Kassel — Webagentur für Unternehmen mit Anspruch \| MAGICKS Studio" |
| **H1 usage** | "Webdesign für Unternehmen in Kassel mit Anspruch." (existing — keyword-first, **good**) |
| **Suggested H2 / H3** | H2: "Webagentur aus Kassel — was Unternehmen bei uns konkret beauftragen" · H3 per service-leistung |
| **Internal links from** | Footer `locationNav` (✅ exists), Hero CTA on `/`, `/leistungen` register cell, `/landingpages-kassel` cross-link, `/website-im-abo` cross-link |
| **Internal links to** | `/websites-landingpages` (Kern-Service), `/landingpages-kassel` (Schwester-SEO-Page), `/kontakt`, `/projekte` |
| **Content gap** | No proof points (Kassel-Mandate, Logos, Testimonials), no FAQ, no LocalBusiness schema, no Maps reference |
| **Over-optimization risk** | **Low-Medium** — copy already varies vocabulary (Internetauftritt, Homepage, Webseite). Avoid stacking "Webdesign Kassel" exact-match more than 4–6× on page. |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority | Opp. Score |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.1 | webdesign kassel | 210–320 | 28–35 | Local-Transactional | 2 | **High** | 220 |
| 1.2 | webagentur kassel | 140–210 | 30–38 | Local-Transactional | 2 | **High** | 165 |
| 1.3 | webdesigner kassel | 70–110 | 22–28 | Local-Transactional | 3 | **High** | 110 |
| 1.4 | internetagentur kassel | 50–90 | 25–30 | Local-Transactional | 3 | Medium | 75 |
| 1.5 | webentwicklung kassel | 30–70 | 20–28 | Local-Transactional | 3 | Medium | 60 |
| 1.6 | webentwickler kassel | 30–50 | 18–26 | Local-Transactional | 3 | Medium | 50 |
| 1.7 | webdesign agentur kassel | 30–50 | 22–28 | Local-Transactional | 3 | Medium | 45 |
| 1.8 | webdesign nordhessen | 20–50 | 15–22 | Local-Transactional | 3 | Medium | 50 |
| 1.9 | webdesigner nordhessen | 10–30 | 12–18 | Local-Transactional | 3 | Low | 25 |
| 1.10 | webdesign baunatal | 10–30 | 10–18 | Local-Transactional | 3 | Low (programmatic candidate) | 30 |

---

### Cluster 2 · **Website erstellen lassen Kassel**

| Field | Value |
| --- | --- |
| **Pillar page** | `/webdesign-kassel` (cluster-merge: same canonical as Cluster 1, different intent register) |
| **Search intent** | Local-Transactional ("hire / commission") |
| **Priority** | **High** — buyer-vocabulary terms, complement Cluster 1's design-vocabulary |
| **Title angle** | (overlaps Cluster 1; covered there) |
| **H1 usage** | (existing H1 OK — extend H2 for these terms: e.g. "Eine professionelle Website in Kassel erstellen lassen — Schritt für Schritt") |
| **Suggested H2** | "Website / Homepage erstellen lassen — Ablauf, Inhalt, Investitionsrahmen" |
| **Internal links from** | `/leistungen` (services-list), `/`, footer |
| **Internal links to** | `/websites-landingpages`, `/website-im-abo`, `/kontakt` |
| **Content gap** | Investitionsrahmen / Preis-Indikation fehlt. Buyer mit "kosten" / "preise" Intent landen aktuell ohne Antwort — größter Conversion-Drain |
| **Over-optimization risk** | **Low** — buyer terms naturally vary (Website / Homepage / Webseite / Internetauftritt) |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 2.1 | website erstellen lassen kassel | 50–90 | 24–32 | Local-Transactional | 3 | **High** |
| 2.2 | homepage erstellen lassen kassel | 30–60 | 22–30 | Local-Transactional | 3 | **High** |
| 2.3 | webseite erstellen lassen kassel | 20–50 | 18–26 | Local-Transactional | 3 | Medium |
| 2.4 | internetseite erstellen lassen kassel | 10–30 | 14–20 | Local-Transactional | 3 | Low |
| 2.5 | webdesign kosten kassel | 10–30 | 18–24 | Local-Commercial-Investigation | 3 | Medium |
| 2.6 | website agentur kassel | 30–60 | 24–30 | Local-Transactional | 3 | Medium |

---

### Cluster 3 · **Webagentur Kassel** (commercial-investigation overlap)

> Treated as a commercial-investigation cluster, **not** a separate page. Demand for "Webagentur Kassel Vergleich / Empfehlung / Test" lands on `/webdesign-kassel` (pillar) when paired with case studies + proof points.

| Field | Value |
| --- | --- |
| **Pillar page** | `/webdesign-kassel` + future content piece on `/projekte` (see Future Content §5) |
| **Search intent** | Commercial-Investigation + Local-Transactional |
| **Priority** | **High** (long-term — needs proof points to convert) |
| **Title angle** | "Webagentur Kassel — Studio statt Bürokratie \| MAGICKS Studio" (alternative homepage variant — see Cannibalization map §6) |
| **H1 usage** | Reuse pillar H1; add proof-section H2 (e.g. "Was Unternehmen aus Kassel an MAGICKS schätzen") |
| **Suggested H2** | "Was eine Webagentur aus Kassel anders macht — und was bei uns konkret anders ist" |
| **Internal links from** | `/`, `/projekte`, footer |
| **Internal links to** | `/projekte`, `/ueber-uns`, `/kontakt` |
| **Content gap** | **Critical** — no testimonials, no logo wall, no metrics. Cannot win commercial-investigation queries without Beweispunkte. |
| **Over-optimization risk** | **Medium** — "Webagentur Kassel" exact-match should appear ≤ 3× on the pillar (already covered: Cluster 1 owns ranking). |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 3.1 | webagentur kassel vergleich | 10–30 | 22–28 | Commercial-Investigation | 3 | Medium |
| 3.2 | webagentur kassel empfehlung | 10–30 | 18–26 | Commercial-Investigation | 3 | Medium |
| 3.3 | beste webagentur kassel | 10–30 | 22–28 | Commercial-Investigation | 3 | Medium |
| 3.4 | digitalagentur kassel | 30–50 | 22–28 | Local-Transactional | 3 | Medium |
| 3.5 | werbeagentur webdesign kassel | 10–30 | 18–24 | Local-Transactional | 3 | Low (mixed intent — werbeagentur ≠ unsere Positionierung) |

---

### Cluster 4 · **Landingpage erstellen lassen**

| Field | Value |
| --- | --- |
| **Pillar page** | `/landingpages-kassel` (local) + `/websites-landingpages` (national) — **two-page split, not cannibalization** because intent register differs (local-Kassel vs. bundesweit) |
| **Search intent** | Transactional + Local-Transactional |
| **Priority** | **High** for local Kassel cluster, **Medium** for national (KD too high without proof) |
| **Title angle local** | "Landing Pages Kassel — für Kampagnen, Services & Anfragen \| MAGICKS Studio" |
| **Title angle national** | "Landing Page erstellen lassen — Conversion-Design statt Template \| MAGICKS Studio" |
| **H1 usage** | (existing H1 on `/landingpages-kassel`: "Landing Pages in Kassel, die nicht nur gut aussehen, sondern Anfragen erzeugen." — strong, keyword-first) |
| **Suggested H2** | "Wann sich eine Landing Page lohnt — und wann eine Website der bessere Hebel ist" |
| **Internal links from** | `/`, `/websites-landingpages` cross-link, `/leistungen`, footer |
| **Internal links to** | `/websites-landingpages`, `/website-im-abo`, `/kontakt` |
| **Content gap** | Kampagnen-Beispiele fehlen (welche Branche → welcher CTA → welche Conversion-Rate); Conversion-Tracking-/Analytics-Setup unbeschrieben; A/B-Test-Versprechen fehlt |
| **Over-optimization risk** | **Low** — Begriff naturalisiert sich gut |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 4.1 | landingpage erstellen lassen | 210–320 | 30–38 | Transactional | 2 | **High** (national fallback if proof grows) |
| 4.2 | landing page erstellen lassen | 140–210 | 30–38 | Transactional | 3 | High |
| 4.3 | landingpage kassel | 10–30 | 12–18 | Local-Transactional | 3 | **High** (low competition) |
| 4.4 | landing page kassel | 10–30 | 12–18 | Local-Transactional | 3 | **High** |
| 4.5 | landing page agentur | 70–140 | 32–42 | Transactional | 3 | Medium |
| 4.6 | landingpage agentur kassel | 10–20 | 14–20 | Local-Transactional | 3 | Medium |
| 4.7 | conversion landing page | 70–140 | 28–38 | Commercial-Investigation | 3 | Medium |
| 4.8 | landing page für kampagne | 30–60 | 22–28 | Commercial-Investigation | 3 | Low |

---

### Cluster 5 · **Onlineshop erstellen lassen**

| Field | Value |
| --- | --- |
| **Pillar page** | `/shops-produktkonfiguratoren` |
| **Search intent** | Transactional (national) + Commercial-Investigation |
| **Priority** | **Medium** — competitive market (Shopify / Shopware shops + agencies); win via Konfigurator-Spezialisierung |
| **Title angle** | "Shops & Produktkonfiguratoren — Shopware · Shopify · Custom \| MAGICKS Studio" |
| **H1 usage** | (existing — verify, likely keyword-first, see audit) |
| **Suggested H2** | "Onlineshop erstellen lassen — Shopify, Shopware oder individuell entwickelt" + "Wann ein Konfigurator den Shop ersetzt" |
| **Internal links from** | `/`, `/leistungen`, `/produktkonfigurator-erstellen`, footer |
| **Internal links to** | `/produktkonfigurator-erstellen`, `/web-software`, `/kontakt` |
| **Content gap** | Plattform-Auswahlhilfe (Shopify vs. Shopware vs. Custom), Onlineshop-Migration / Relaunch fehlt, B2B-Shop-Spezialisierung |
| **Over-optimization risk** | **Low-Medium** — Shopify / Shopware Markennamen können Markenrechte berühren (immer "Shopify-Agentur" nicht "Shopify Premier Partner") |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 5.1 | onlineshop erstellen lassen | 720–1300 | 45–55 | Transactional | 2 | Medium |
| 5.2 | online shop erstellen lassen | 480–720 | 42–52 | Transactional | 2 | Medium |
| 5.3 | shopify agentur | 590–880 | 45–55 | Transactional | 2 | Medium |
| 5.4 | shopware agentur | 480–720 | 40–50 | Transactional | 2 | Medium |
| 5.5 | onlineshop programmieren lassen | 90–140 | 30–38 | Transactional | 3 | Medium |
| 5.6 | b2b shop erstellen | 70–140 | 28–35 | Transactional | 3 | Medium |
| 5.7 | onlineshop kassel | 30–50 | 18–25 | Local-Transactional | 3 | **High** (low competition) |
| 5.8 | shop entwicklung kassel | 10–30 | 14–22 | Local-Transactional | 3 | Medium |

---

### Cluster 6 · **Web-Software / Websoftware Entwicklung**

| Field | Value |
| --- | --- |
| **Pillar page** | `/web-software` |
| **Search intent** | Transactional + Commercial-Investigation |
| **Priority** | **Medium-High** — niedrige Suchvolumina aber **sehr hohe Auftragswerte** (€20k–€150k+); jede einzelne Conversion ist wertvoll |
| **Title angle** | "Web-Software & Dashboards individuell entwickeln lassen \| MAGICKS Studio" |
| **H1 usage** | Existing serif-H1 OK; add H2 with explicit keyword: "Individuelle Web-Software für Unternehmen — Portale, Dashboards, interne Tools" |
| **Suggested H2** | "Wann individuelle Software günstiger ist als ein weiteres SaaS-Abo" + "Multi-Tenant, API-first, übergabefähig" |
| **Internal links from** | `/`, `/leistungen`, footer, `/ki-automation-unternehmen`, `/projekte` (case studies) |
| **Internal links to** | `/ki-automationen-integrationen`, `/produktkonfigurator-erstellen`, `/kontakt` |
| **Content gap** | Branchen-Anwendungsfälle (Logistik, Bau, Hersteller, Service); Tech-Stack-Transparenz; Migrations- / Übernahme-Konzept |
| **Over-optimization risk** | **Low** — Begriff "Web-Software" / "Webapp" / "Webportal" / "Individualsoftware" lässt natürliche Variation zu |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 6.1 | web software entwickeln lassen | 30–60 | 20–28 | Transactional | 3 | **High** (low KD, very high value) |
| 6.2 | webapp entwickeln lassen | 70–110 | 25–32 | Transactional | 3 | **High** |
| 6.3 | individualsoftware web | 30–60 | 18–25 | Transactional | 3 | **High** |
| 6.4 | webportal entwickeln | 30–60 | 18–26 | Transactional | 3 | Medium |
| 6.5 | web software entwicklung | 70–140 | 28–35 | Commercial-Investigation | 3 | Medium |
| 6.6 | individualsoftware entwickeln lassen | 90–140 | 30–38 | Transactional | 3 | Medium |
| 6.7 | webportal kassel | 10–20 | 12–18 | Local-Transactional | 3 | Low |
| 6.8 | webapp kassel | 10–30 | 12–18 | Local-Transactional | 3 | Low |

---

### Cluster 7 · **Dashboard Entwicklung**

| Field | Value |
| --- | --- |
| **Pillar page** | `/web-software` (sub-section / anchor) — **not** a separate page yet (volume too low to justify) |
| **Search intent** | Transactional + Commercial-Investigation |
| **Priority** | **Medium** — niche aber qualifizierter Traffic |
| **Title angle** | (covered by Cluster 6 pillar; H2-anchor recommended) |
| **H1 usage** | n/a — H2: "Dashboards entwickeln lassen — KPIs, Workflows, interne Übersichten" + H3: "Admin-Dashboard, Reporting-Dashboard, Operations-Dashboard" |
| **Internal links from** | `/web-software` cluster pillar, `/ki-automationen-integrationen` |
| **Internal links to** | `/web-software` (parent), `/kontakt` |
| **Content gap** | UI-Pattern-Library / Dashboard-Beispiele aus Mandaten fehlt |
| **Over-optimization risk** | **Low** |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 7.1 | dashboard entwickeln lassen | 30–50 | 18–25 | Transactional | 3 | Medium |
| 7.2 | admin dashboard entwickeln | 10–30 | 14–22 | Transactional | 3 | Low |
| 7.3 | dashboard agentur | 10–30 | 18–25 | Commercial-Investigation | 3 | Low |
| 7.4 | reporting dashboard entwickeln | 10–30 | 12–20 | Transactional | 3 | Low |
| 7.5 | internes dashboard entwickeln | 10–30 | 10–18 | Transactional | 3 | Low |

---

### Cluster 8 · **Automatisierung für Unternehmen** (Workflow / Prozess)

| Field | Value |
| --- | --- |
| **Pillar page** | `/ki-automation-unternehmen` (existing) + `/ki-automationen-integrationen` (Service-Detail) |
| **Search intent** | Transactional + Commercial-Investigation + Informational (mixed SERP) |
| **Priority** | **High** — wachsendes Suchvolumen, hoher Auftragswert, technologisch differenziert |
| **Title angle** | "Geschäftsprozesse automatisieren — KI-Workflows für Unternehmen \| MAGICKS Studio" |
| **H1 usage** | Existing H1: "KI-Automation für Unternehmen, die weniger manuell arbeiten wollen." — keyword-first, **good** |
| **Suggested H2** | "Workflow-Automatisierung mit n8n, Zapier oder eigenem Stack" + "Wo Automation entlastet — und wo ein Mensch besser bleibt" |
| **Internal links from** | `/`, `/leistungen`, `/web-software`, footer, `/ki-automationen-integrationen` |
| **Internal links to** | `/ki-automationen-integrationen`, `/web-software`, `/kontakt` |
| **Content gap** | Branchen-Use-Cases (Lead-Routing, Angebot-Generation, Invoice-Capture, CRM-Sync); ROI-Rechnungen; n8n vs. Zapier vs. Make Vergleich |
| **Over-optimization risk** | **Low-Medium** — "KI" / "AI" / "Automation" sind drift-anfällig zur AI-Bro-Tonalität (Words-to-Avoid) |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 8.1 | geschäftsprozesse automatisieren | 210–320 | 30–38 | Commercial-Investigation | 3 | **High** |
| 8.2 | workflow automatisierung | 390–590 | 38–48 | Commercial-Investigation | 2 | Medium |
| 8.3 | prozessautomatisierung | 590–880 | 42–50 | Commercial-Investigation | 2 | Medium |
| 8.4 | automatisierung für kmu | 30–70 | 20–28 | Transactional | 3 | **High** |
| 8.5 | automatisierung agentur | 30–70 | 22–30 | Transactional | 3 | Medium |
| 8.6 | n8n agentur | 30–60 | 20–28 | Transactional | 3 | **High** (newer term, low KD) |
| 8.7 | zapier agentur | 30–60 | 22–30 | Transactional | 3 | Medium |
| 8.8 | unternehmensautomatisierung | 70–140 | 30–38 | Commercial-Investigation | 3 | Medium |

---

### Cluster 9 · **KI-Automatisierung / KI für Unternehmen**

| Field | Value |
| --- | --- |
| **Pillar page** | `/ki-automation-unternehmen` (canonical) + `/ki-automationen-integrationen` (service detail) |
| **Search intent** | Mixed — Informational + Commercial-Investigation + Transactional |
| **Priority** | **High** (rising demand) but **competitive** — KD steigt schnell, jede Woche neue Konkurrenz |
| **Title angle** | "KI-Automation für Unternehmen — sinnvoll eingesetzte KI \| MAGICKS Studio" |
| **H1 usage** | (existing — strong) |
| **Suggested H2** | "ChatGPT für Unternehmen integrieren — wo es Sinn ergibt" + "LLM-Workflows: Daten-Pipelines, Agents, sichere Integrationen" |
| **Internal links from** | Cluster 8 pillar, `/web-software`, `/`, footer |
| **Internal links to** | Cluster 8 pillar (cross-link bidirectional), `/kontakt`, `/projekte` (sobald KI-Case-Study existiert) |
| **Content gap** | DSGVO + KI (Datenschutz-Sorgen sind Top-Conversion-Bremse), EU-AI-Act-Compliance, On-Prem vs. API-LLM-Setup |
| **Over-optimization risk** | **Medium** — "KI" / "Künstliche Intelligenz" / "AI" / "ChatGPT" Synonyme nutzen, nicht stapeln |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 9.1 | ki für unternehmen | 720–1300 | 50–58 | Mixed | 2 | Medium |
| 9.2 | ki automation | 210–390 | 30–40 | Commercial-Investigation | 3 | **High** |
| 9.3 | ki workflow | 70–140 | 25–32 | Commercial-Investigation | 3 | **High** |
| 9.4 | ki agentur | 480–880 | 40–50 | Transactional | 3 | Medium |
| 9.5 | ki integration | 140–260 | 30–38 | Transactional | 3 | Medium |
| 9.6 | künstliche intelligenz für mittelstand | 70–140 | 28–35 | Commercial-Investigation | 3 | Medium |
| 9.7 | chatgpt für unternehmen | 880–1300 | 45–55 | Informational + Commercial | 2 | Medium |
| 9.8 | llm integration | 70–140 | 28–35 | Transactional | 3 | Low (technical buyer) |
| 9.9 | ai workflow | 140–260 | 28–38 | Mixed | 3 | Medium |
| 9.10 | ki beratung kmu | 30–60 | 22–28 | Transactional | 3 | Medium |

---

### Cluster 10 · **Creative-Tech Agentur** (brand differentiator)

| Field | Value |
| --- | --- |
| **Pillar page** | `/` (Homepage) + `/ueber-uns` (Manifest-Page) |
| **Search intent** | Navigational + Brand-Adjacent + Mixed |
| **Priority** | **Medium** — niche term, geringe Volumina, aber **sehr hochwertige Buyer**: wer "Creative Tech Studio" sucht, weiß was er will |
| **Title angle** | (Homepage — see §2 Homepage Strategy) |
| **H1 usage** | Homepage H1 bleibt brand-poetisch — Creative-Tech als H2-Eyebrow / Manifest-Page-Heading |
| **Suggested H2** | "Was Creative Tech eigentlich heißt — und warum Standard kein Anspruch ist" |
| **Internal links from** | jeder Footer (✅ Brand column), Hero-Eyebrow |
| **Internal links to** | `/leistungen`, `/projekte`, `/kontakt` |
| **Content gap** | Manifest- / Werte-Seite ist da (`/ueber-uns`), aber keine eigene Erklärseite "Was ist ein Creative-Tech Studio?" — gute AI-Overview-Antwort-Frage |
| **Over-optimization risk** | **Very Low** — Begriff zu nischig für Manipulation |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 10.1 | creative tech studio | 70–140 | 22–30 | Navigational + Mixed | 3 | Medium |
| 10.2 | creative tech agentur | 30–70 | 18–26 | Navigational + Mixed | 3 | Medium |
| 10.3 | tech studio kassel | 10–30 | 10–18 | Local-Navigational | 3 | Low |
| 10.4 | digitalstudio kassel | 10–30 | 12–18 | Local-Navigational | 3 | Low |
| 10.5 | premium webagentur | 70–140 | 28–35 | Commercial-Investigation | 3 | Medium |
| 10.6 | hochwertige webagentur | 30–60 | 22–30 | Commercial-Investigation | 3 | Medium |
| 10.7 | designgetriebene agentur | 10–30 | 12–18 | Commercial-Investigation | 3 | Low |

---

### Cluster 11 · **3D-Konfigurator / Produktkonfigurator**

| Field | Value |
| --- | --- |
| **Pillar page** | `/produktkonfigurator-erstellen` |
| **Search intent** | Transactional + Commercial-Investigation |
| **Priority** | **High** — Spezialisierung, mittleres Volumen, **außergewöhnlich hohe Auftragswerte** (€30k–€200k+) und niedrige Wettbewerbsdichte für Mittelstand-DE |
| **Title angle** | "3D-Produktkonfigurator erstellen lassen — Bau, Hersteller, B2B \| MAGICKS Studio" |
| **H1 usage** | Existing H1 stark; H2-Erweiterung empfohlen: "Wann sich ein Produktkonfigurator rechnet — und wann ein Quote-Formular reicht" |
| **Suggested H2** | "3D-Konfigurator vs. 2D-Konfigurator vs. PDF-Quote" + "Konfigurator-Workflow: Anfrage → Angebot → CRM" |
| **Internal links from** | `/`, `/leistungen`, `/shops-produktkonfiguratoren`, footer |
| **Internal links to** | `/shops-produktkonfiguratoren`, `/web-software`, `/kontakt` |
| **Content gap** | Branchen-Beispiele (Bau, Maschinenbau, Möbel, Spezialprodukte); Tech-Stack (Three.js, Babylon, Unity-WebGL); ROI-Rechnung; Konfigurator-Architektur (Quote vs. Cart) |
| **Over-optimization risk** | **Low** — Variation 3D / 2D / Konfigurator / Produktkonfigurator natürlich |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 11.1 | produktkonfigurator erstellen | 30–90 | 25–35 | Transactional | 3 | **High** |
| 11.2 | produktkonfigurator entwickeln lassen | 30–60 | 20–28 | Transactional | 3 | **High** |
| 11.3 | 3d konfigurator | 590–880 | 45–55 | Mixed | 2 | Medium |
| 11.4 | 3d produktkonfigurator | 210–320 | 32–42 | Transactional | 3 | **High** |
| 11.5 | 3d konfigurator erstellen | 70–140 | 25–35 | Transactional | 3 | **High** |
| 11.6 | konfigurator software | 90–140 | 30–38 | Commercial-Investigation | 3 | Medium |
| 11.7 | webgl konfigurator | 30–60 | 22–28 | Transactional | 3 | Medium |
| 11.8 | b2b konfigurator | 30–60 | 22–28 | Transactional | 3 | Medium |
| 11.9 | online konfigurator erstellen | 30–60 | 22–30 | Transactional | 3 | Medium |
| 11.10 | konfigurator agentur | 30–50 | 25–32 | Transactional | 3 | Medium |

---

### Cluster 12 · **Moderne Website für Unternehmen**

| Field | Value |
| --- | --- |
| **Pillar page** | `/websites-landingpages` (Service-Detail) + `/leistungen` (Hub) |
| **Search intent** | Commercial-Investigation + Transactional |
| **Priority** | **Medium** — Modifier-Layer für `Cluster 1` und `Cluster 2`, nicht eigenständige Pillar |
| **Title angle** | "Moderne Websites für Unternehmen — designgetrieben, performant, hochwertig \| MAGICKS Studio" |
| **H1 usage** | (existing H1 OK) — H2-Erweiterung: "Was eine moderne Website 2026 ausmacht — Design, Performance, KI-Anbindung" |
| **Suggested H2** | "Moderne Website ≠ Trend-Website" + "Was eine 2026-Website von einer 2018-Website unterscheidet" |
| **Internal links from** | `/`, `/leistungen`, `/webdesign-kassel`, `/landingpages-kassel` |
| **Internal links to** | `/webdesign-kassel` (lokale Variante), `/website-im-abo`, `/kontakt` |
| **Content gap** | Performance-Benchmarks (Lighthouse, CWV) als Beweispunkt; "moderne Website" Definition für SEO-Hub-Page |
| **Over-optimization risk** | **Medium** — "modern" ist ein soft-Adjektiv und schnell drift-anfällig zu Buzzword-Tonalität |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 12.1 | moderne website für unternehmen | 30–90 | 25–32 | Commercial-Investigation | 3 | Medium |
| 12.2 | moderne webseite erstellen | 70–140 | 28–35 | Transactional | 3 | Medium |
| 12.3 | individuelle website erstellen | 140–260 | 30–38 | Transactional | 3 | Medium |
| 12.4 | website für mittelstand | 70–140 | 25–32 | Commercial-Investigation | 3 | Medium |
| 12.5 | website für kmu | 90–140 | 28–35 | Commercial-Investigation | 3 | Medium |
| 12.6 | hochwertige website | 70–140 | 28–35 | Commercial-Investigation | 3 | Medium |
| 12.7 | premium website | 30–70 | 25–32 | Commercial-Investigation | 3 | Low |

---

### Cluster 13 · **Digitale Lösungen für Unternehmen**

| Field | Value |
| --- | --- |
| **Pillar page** | `/leistungen` (Service-Hub) |
| **Search intent** | Mixed (Commercial-Investigation dominiert) — Buyer am Anfang der Discovery |
| **Priority** | **Medium** — Bridge-Cluster zwischen alle Service-Detail-Pages; größtes Volumen |
| **Title angle** | "Leistungen — Websites, Shops, Software, KI \| MAGICKS Studio" (siehe Audit H-03) |
| **H1 usage** | "Digitale Leistungen, die nicht nach Standard aussehen." — bestehend, aber **vage**. Empfehlung H2: "Vier Cluster digitaler Lösungen — Marke, Commerce, System, Automation" |
| **Suggested H2** | "Digitale Lösungen für Unternehmen — Marke, Commerce, System, Automation" + per-Cluster H3 |
| **Internal links from** | `/`, jede Service-Detail-Page (Bottom-Cross-Ref), Footer |
| **Internal links to** | alle 4 Service-Detail-Pages + alle 5 SEO-Pages |
| **Content gap** | Page könnte mehr Beweispunkte aus Projekten ziehen; aktuell sehr abstrakt |
| **Over-optimization risk** | **Low-Medium** — "digitale Lösungen" ist Buzzword-anfällig (siehe Words-to-Avoid in Marketing-Context) |

#### Keywords

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 13.1 | digitale lösungen für unternehmen | 210–320 | 35–45 | Mixed | 2 | Medium |
| 13.2 | digitalisierung für kmu | 320–480 | 38–48 | Mixed | 2 | Low (zu breit, falsche Buyer-Stage) |
| 13.3 | digitale transformation agentur | 140–260 | 38–45 | Commercial-Investigation | 3 | Low (Beratungs-Intent ≠ Studio-Intent) |
| 13.4 | digitalagentur | 1300–2400 | 55–65 | Mixed | 1 | Low (Tier-1, zu wettbewerbsstark ohne DR) |
| 13.5 | digital agentur kassel | 30–50 | 22–28 | Local-Transactional | 3 | Medium |
| 13.6 | digitale produkte entwickeln | 70–140 | 28–35 | Transactional | 3 | Medium |

---

## 2 · Homepage Keyword Strategy

### Role of `/`

The homepage is **brand + cluster-pillar + entity-anchor**, not a service-keyword target.

| Element | Recommended target keyword(s) | Notes |
| --- | --- | --- |
| **`<title>`** | "MAGICKS Studio — Webagentur aus Kassel · Websites, Shops, Software, KI" (60 chars) | Primary brand + primary local + Tier-1 service vocab. Replaces existing 66-char title. |
| **Meta description** | Targets *Webdesign Kassel*, *Webagentur*, *KI-Automation*, *Web-Software* — already does well; refine length only | 158 chars target |
| **H1** | "Wir bauen das Web, das dein Business verdient." (existing — keep) | Brand-poetic; deliberate. Audit H-02 recommends pairing with H2. |
| **H2 (new — after H1)** | **"Webagentur aus Kassel — Websites, Shops, Web-Software & KI-Automationen"** (recommended primary local + service H2) | Anchors local intent; complements brand H1. Visually treat as small editorial sub-line, not loud. |
| **H2 (`§ 02 LEISTUNGEN`)** | "Was wir bauen." → consider expanding visual H3s with keyword variants (already there: Marke, Commerce, System, Automation & KI) | OK as-is |
| **H2 (`§ 04 STUDIO`)** | "Wir sind keine klassische Agentur." (existing) | Brand. Keep. |

### Primary keyword cluster on `/`

Homepage *clusters across* (does not own ranking for) these:

- Cluster 10 — Creative-Tech Agentur (**owns this**)
- Cluster 1 — Webdesign Kassel (**supports** — pillar lives at `/webdesign-kassel`)
- Cluster 13 — Digitale Lösungen (**supports** — pillar lives at `/leistungen`)
- Cluster 8 / 9 — Automation / KI (**supports** — pillars live at `/ki-automation-*`)

### Entity-anchor signals to add

(Only signals — implementation in audit's Phase 2 / Phase 3.)

- `<script type="application/ld+json">` Organization + ProfessionalService + LocalBusiness + WebSite (per audit C-02)
- `<link rel="alternate" hreflang="de">` + `<html lang="de">` ✅
- Footer NAP block visible above the fold? Currently only city tagline — recommend adding a small editorial NAP line (Kassel · Schwabstr. 7a · hello@magicks.de) on `/ueber-uns`, not homepage (premium discipline preserved).

### Anti-cannibalization rules for homepage

- Homepage **must not** out-rank `/webdesign-kassel` for *"Webdesign Kassel"* — if it does, internal-link weight needs rebalancing toward the SEO page.
- Homepage **must not** target *"Landing Page erstellen lassen"* — that's `/landingpages-kassel` / `/websites-landingpages` territory.
- Homepage **must not** be the canonical for "Webagentur Kassel" if `/webdesign-kassel` is the dedicated page; let pillar page own it.

---

## 3 · Service-Section Keyword Strategy (per existing page)

### `/leistungen` — Service Hub

- **Owns**: Cluster 13 (Digitale Lösungen)
- **Supports**: all 4 Service-Detail clusters (5, 6, 8/9, 11)
- **Title fix**: drop from 74 chars → ~60. Suggested: **"Leistungen — Websites, Shops, Software, KI \| MAGICKS Studio"** (60).
- **H1 fix**: extend the brand-line H1 with a small H2: *"Vier Cluster digitaler Lösungen für Unternehmen aus Kassel und bundesweit"*.
- **Internal-link discipline**: every Service-Detail page must list `/leistungen` in its breadcrumb when breadcrumbs ship (Audit M-04).

### `/websites-landingpages` — Service Detail (national)

- **Owns**: Cluster 4.1–4.2 (Landingpage erstellen lassen — national), Cluster 12.2–12.4 (moderne Website für Unternehmen)
- **Supports**: Cluster 1 (link to `/webdesign-kassel`), Cluster 4.3–4.6 (link to `/landingpages-kassel`)
- **Title fix**: extend to 55 chars; e.g. *"Websites & Landing Pages individuell entwickelt \| MAGICKS Studio"* (60)
- **H1 audit**: keep "Websites & Landing Pages, die nicht nach Standard aussehen." — solid keyword-first
- **H2 to add**: "Was eine professionelle Website von einem Template unterscheidet" + "Wann eine Landing Page der bessere Hebel ist als eine Website"

### `/shops-produktkonfiguratoren` — Service Detail

- **Owns**: Cluster 5 (Onlineshop erstellen lassen — national), Cluster 5.7–5.8 (lokal)
- **Supports**: Cluster 11 (link to `/produktkonfigurator-erstellen`)
- **Title fix**: extend to ~58 chars; e.g. *"Onlineshop & 3D-Konfiguratoren entwickeln lassen \| MAGICKS Studio"*
- **H2 to add**: "Onlineshop erstellen lassen — Shopify, Shopware oder individuell entwickelt" + "Konfigurator statt Shop — wann sich der Wechsel lohnt"

### `/web-software` — Service Detail

- **Owns**: Cluster 6 (Web-Software / Websoftware Entwicklung), Cluster 7 (Dashboards)
- **Title fix**: extend to ~58 chars; e.g. *"Web-Software & Dashboards individuell entwickeln \| MAGICKS Studio"*
- **H2 to add**: "Individuelle Web-Software für Unternehmen — Portale, Dashboards, interne Tools" + "Wann individuelle Software günstiger ist als ein weiteres SaaS-Abo"

### `/ki-automationen-integrationen` — Service Detail

- **Owns**: Cluster 8 (Workflow-Automation), Cluster 9 (KI-Automation)
- **Cross-link**: `/ki-automation-unternehmen` (SEO-Page mit Buyer-Vokabular) — sind **kein Cannibalization-Konflikt**, weil:
  - `/ki-automationen-integrationen` = Service-/Produkt-Page mit Studio-Vokabular ("automation als Verantwortung")
  - `/ki-automation-unternehmen` = SEO-Buyer-Page mit Direktanfrage-Vokabular
  - **Beide self-canonical**. Reziproke Cross-Links per `<a>` Tag, nicht `<link rel="canonical">`.

### `/website-im-abo` — Modell-Page

- **Owns**: niche cluster — *"Website im Abo"*, *"Homepage Abo"*, *"Website monatlich"*
- **Volume tiny but intent very specific**. Keep page; expand H2: "Website-Abo statt Einmalzahlung — für wen sich das Modell rechnet"
- **Title fix**: ~52 chars; e.g. *"Website im Abo — monatlich statt Einmalzahlung \| MAGICKS Studio"*

| # | Keyword | Vol DE (est) | KD (est) | Intent | Tier | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| WIA.1 | website im abo | 30–90 | 18–28 | Transactional | 3 | **High** (low KD) |
| WIA.2 | homepage abo | 10–30 | 12–20 | Transactional | 3 | **High** (low KD) |
| WIA.3 | website monatlich | 10–30 | 14–22 | Transactional | 3 | Medium |
| WIA.4 | website finanzieren | 30–60 | 22–30 | Commercial-Investigation | 3 | Low |
| WIA.5 | website mietmodell | 10–20 | 12–20 | Transactional | 3 | Low |

---

## 4 · Local SEO Keyword Strategy (Kassel / Nordhessen)

### Geo-Anchor

- **Primary city**: Kassel (51.319 N, 9.498 E)
- **Service ring (≤30 min)**: Baunatal, Vellmar, Fuldabrück, Kaufungen, Niestetal, Lohfelden, Calden
- **Region**: Nordhessen
- **Sekundär (Pendel-Reichweite)**: Göttingen, Marburg, Paderborn, Fulda, Bad Hersfeld

### Strategy: hub-and-spoke

```
┌──────────────────────────────────────┐
│ HUB:    /webdesign-kassel             │   ← owns "Webdesign Kassel"
│         /landingpages-kassel           │   ← owns "Landing Page Kassel"
└──────────────────────────────────────┘
                 │
   ┌─────────────┼─────────────┐
   │             │             │
SPOKE 1     SPOKE 2     SPOKE 3
(future)   (future)    (future)
Webdesign   Webdesign   Webdesign
Baunatal    Vellmar     Göttingen
```

**DO NOT build the spokes yet.** Programmatic city-pages without unique value trigger Google's "thin content" / "doorway pages" penalties. Build spokes only when:

1. Each spoke has **unique local proof** (a real Kassel mandate per spoke city, real local references).
2. Each spoke has at least **400 words of unique content** (not just a city-name find/replace).
3. The hub pages first achieve top-3 ranking for *"Webdesign Kassel"* / *"Landing Page Kassel"*.

### Local-only quick-win keywords

| # | Keyword | Vol DE (est) | KD (est) | Action | Priority |
| --- | --- | --- | --- | --- | --- |
| L.1 | webdesign kassel | 210–320 | 28–35 | Pillar `/webdesign-kassel` — title polish + schema (Audit C-01, C-02, H-03) | **High** |
| L.2 | webagentur kassel | 140–210 | 30–38 | Same pillar — H2 expansion | **High** |
| L.3 | webdesigner kassel | 70–110 | 22–28 | Same pillar — body-copy variant | High |
| L.4 | landing page kassel | 10–30 | 12–18 | Pillar `/landingpages-kassel` — already strong H1 | **High** (very low KD) |
| L.5 | onlineshop kassel | 30–50 | 18–25 | Add anchor section on `/shops-produktkonfiguratoren` | **High** |
| L.6 | webentwickler kassel | 30–50 | 18–26 | Body-copy variant on `/webdesign-kassel` | Medium |
| L.7 | internetagentur kassel | 50–90 | 25–30 | Body-copy variant on `/webdesign-kassel` | Medium |
| L.8 | webagentur nordhessen | 30–50 | 18–26 | Sub-section on `/webdesign-kassel` | Medium |
| L.9 | digitalagentur kassel | 30–50 | 22–28 | Body-copy variant on `/webdesign-kassel` | Medium |

### Off-page local actions (no code change required, but critical to ranking)

1. **Google Business Profile** — claim, verify with Schwabstr. 7a, 34125 Kassel, add 6+ photos, services list, posts.
2. **NAP-consistency** across: site footer / Impressum / GBP / Bing Places / Apple Business / industry directories.
3. **Local citations**: GoLocal (DasÖrtliche), Branchenbuch, Cylex, 11880, branche.de.
4. **Reviews**: 1 Review per Mandant (mit Erlaubnis) auf GBP — der größte Local-Rank-Hebel.
5. **Local backlinks**: Kassel-IHK, Kassel-Marketing-GmbH, Lokal-Presse, Branchen-Netzwerke.
6. **`LocalBusiness` JSON-LD** (Audit C-02) — site-wide.

### NAP Single-Source-of-Truth

```
MAGICKS Studio
Inhaber: Fatih Serin
Schwabstr. 7a
34125 Kassel
Deutschland

E-Mail:    hello@magicks.de
Web:       https://magicks.studio
Sprachen:  DE primär, EN sekundär
Service:   Kassel · Baunatal · Vellmar · Fuldabrück · Kaufungen · Niestetal · Lohfelden · Calden · Nordhessen · bundesweit remote
```

---

## 5 · Future Content Ideas

> Informational + Commercial-Investigation queries that **no current page targets**. Each is a future article / sub-page / FAQ-section.
> Content engine should be **slow + premium** — 1 deep piece every 2–4 weeks beats 8 shallow pieces.

### A · Commercial-Investigation gold (highest revenue impact)

| # | Topic / Title Angle | Primary Keyword | Vol DE (est) | KD | Format | Why now |
| --- | --- | --- | --- | --- | --- | --- |
| F.1 | "Was kostet eine Website in Kassel? Investitions­rahmen 2026" | was kostet eine website kassel | 30–90 | 22–30 | Article + transparent price band | Audit H-03 noted: cost-intent buyers land without answer |
| F.2 | "Webagentur vs. Freelancer vs. Studio — wann was sinnvoll ist" | webagentur oder freelancer | 30–60 | 22–28 | Decision framework | Differenzierung Cluster 10 |
| F.3 | "Was kostet ein Onlineshop entwickeln lassen?" | was kostet ein onlineshop | 210–320 | 32–40 | Cost framework | Cluster 5 conversion bridge |
| F.4 | "Was kostet ein 3D-Konfigurator? ROI-Beispiele" | 3d konfigurator kosten | 70–140 | 25–35 | Cost + ROI framework | Cluster 11 conversion bridge |
| F.5 | "Shopify, Shopware oder individueller Shop — Plattform-Vergleich" | shopify vs shopware | 320–480 | 35–45 | Plattform-Vergleich | Cluster 5 platform-fork |
| F.6 | "Webagentur Kassel — wie wir Mandate auswählen (und warum)" | webagentur kassel auswahl | 10–30 | 14–22 | Editorial process page | Trust-builder |

### B · Informational anchors (AI-Overview / FeaturedSnippet eligible)

| # | Topic / Title Angle | Primary Keyword | Vol DE (est) | KD | Format | Why now |
| --- | --- | --- | --- | --- | --- | --- |
| F.7 | "Was ist ein Creative-Tech Studio?" | was ist ein creative tech studio | 10–30 | 8–14 | Definition + manifest excerpt | AI-Overview eligibility, Cluster 10 anchor |
| F.8 | "Was ist KI-Automation für Unternehmen?" | was ist ki automation | 70–140 | 22–30 | Definition + use-cases | Cluster 9 informational layer |
| F.9 | "Was ist ein Produktkonfigurator?" | was ist ein produktkonfigurator | 30–60 | 18–25 | Definition + 5 use-cases | Cluster 11 informational layer |
| F.10 | "Was ist Web-Software? Abgrenzung zu SaaS" | was ist web software | 30–60 | 18–25 | Definition + Beispiele | Cluster 6 informational layer |
| F.11 | "Was ist DSGVO-konformes Webdesign?" | dsgvo konformes webdesign | 70–140 | 28–35 | Compliance walkthrough | Trust signal, ranks for buyer concern |
| F.12 | "Wie funktioniert ein 3D-Konfigurator technisch?" | 3d konfigurator funktionsweise | 30–60 | 18–25 | Tech-Explainer | Cluster 11 + FAQ schema candidate |

### C · Sub-cluster expansions (after main pillars rank)

| # | Topic | Primary Keyword | Vol DE (est) | KD | Format |
| --- | --- | --- | --- | --- | --- |
| F.13 | "Headless CMS — wann sinnvoll, wann zu viel" | headless cms agentur | 90–140 | 30–38 | Comparison |
| F.14 | "Webagentur für Bau-Branche" | webagentur bau | 30–60 | 22–28 | Industry-vertical landing |
| F.15 | "Webagentur für Hersteller / Industrie" | webagentur industrie | 30–60 | 22–28 | Industry-vertical landing |
| F.16 | "Webagentur für Dienstleister Kassel" | webagentur dienstleister | 10–30 | 14–22 | Industry-vertical landing |
| F.17 | "Lighthouse 100 — wie wir performante Websites bauen" | lighthouse 100 webagentur | 10–30 | 12–20 | Tech credentials article |
| F.18 | "n8n vs. Zapier vs. Make — was wir wann nutzen" | n8n vs zapier | 320–480 | 35–42 | Tool-Vergleich (high informational) |
| F.19 | "ChatGPT für Unternehmen — sichere Integration" | chatgpt sichere integration | 30–70 | 22–28 | Compliance-Artikel |
| F.20 | "Website Relaunch — wann, wie, mit welchem SEO-Schutz" | website relaunch agentur | 70–140 | 28–35 | Process article |

### D · GEO / AI-search content (LLMO / AEO)

The `find-keywords` skill flags AI-Overview-friendly queries. For MAGICKS, prioritize:

- **Definitional**: F.7, F.8, F.9, F.10 — direct LLM answer-format
- **Comparison**: F.5, F.18 — direct LLM table-extraction
- **Numerical**: F.1, F.3, F.4 — direct LLM cost-extraction (LLMs love specific numbers — even ranges like "€8.000–€25.000 für eine Marken-Website" beat empty agency-talk)
- **Process / how-to**: F.20, F.12 — direct LLM step-extraction

**Rule**: every informational article should answer **one** primary question crisply within the first 80 words, then expand. AI Overviews extract from the first answerable paragraph.

---

## 6 · Keywords to Avoid + Cannibalization Map

### Keywords to NOT target

| # | Keyword | Why we skip |
| --- | --- | --- |
| AVOID.1 | "günstige website" / "billige website" / "website günstig" | Falsche Buyer-Stage; verletzt Premium-Positionierung (Marketing-Context Words-to-Avoid) |
| AVOID.2 | "kostenlose website" / "website kostenlos" | DIY-/Baukasten-Intent; konvertiert nicht |
| AVOID.3 | "website selbst erstellen" / "website bauen kostenlos" | Same — DIY-Intent |
| AVOID.4 | "wordpress agentur" als Pillar | Markenkern ist Anti-Template — auch wenn wir WP nutzen, ist es nicht USP. Nur als Modifier auf `/websites-landingpages`. |
| AVOID.5 | "günstige seo agentur kassel" | Falsche Positionierung; SEO ist nicht Kern-Service — nur Foundation-Layer |
| AVOID.6 | "marketingagentur kassel" | Mischintent (Werbung, Print, Social) — verwässert Studio-Positionierung |
| AVOID.7 | "social media agentur kassel" | Wir machen kein SMM; falsche Buyer |
| AVOID.8 | "seo agentur kassel" | Wir machen kein dediziertes SEO-Mandat (Foundation-Level only) |
| AVOID.9 | "google ads agentur" | Falscher Service |
| AVOID.10 | "ki software entwickeln" | Wir bauen nicht KI-Modelle, wir integrieren sie. Buyer-Erwartung ≠ Lieferung. |
| AVOID.11 | "ki entwickler" / "machine learning agentur" | Falsche Erwartung — wir sind keine ML-Agentur |
| AVOID.12 | "günstige webagentur" | Premium-Bruch |
| AVOID.13 | "website schnell erstellen" / "website 24h" | Falsche Erwartung; Studio-Tempo ≠ Express |
| AVOID.14 | "online business starten" | Beratungs-Intent ≠ Studio |
| AVOID.15 | "marketing automation" als Pillar | Nur Modifier — wir machen Marketing-Automation als Sub-Set, nicht als Kern |
| AVOID.16 | "ChatGPT API agentur" | Zu technisch eng — Begriff verändert sich monatlich |
| AVOID.17 | "freelancer webdesign kassel" | Falsche Anbieter-Form (Studio ≠ Freelancer) |

### Cannibalization Map

> **Risk = two pages competing for the same primary intent.** Action listed.

| Term cluster | Page A | Page B | Risk | Resolution |
| --- | --- | --- | --- | --- |
| Webdesign Kassel | `/webdesign-kassel` | `/` (homepage) | **Medium** if homepage title contains "Webdesign Kassel" | Homepage title uses *"Webagentur aus Kassel"* (broader); SEO-page owns "Webdesign Kassel" |
| Landing Page erstellen | `/landingpages-kassel` | `/websites-landingpages` | Low (different intent: local vs. national) | Both self-canonical; bidirectional cross-link; different H1s already |
| KI-Automation | `/ki-automation-unternehmen` | `/ki-automationen-integrationen` | **Medium** | Both self-canonical; **/-unternehmen** = SEO/buyer-vocabulary, **/-integrationen** = service-detail/studio-vocabulary; bi-directional cross-link |
| Onlineshop erstellen | `/shops-produktkonfiguratoren` | `/produktkonfigurator-erstellen` | Low | Different primary intent: shop vs. konfigurator; cross-link |
| Webagentur Kassel | `/webdesign-kassel` | `/ueber-uns` | **Low-Medium** | About-page is brand/identity, not service-keyword target. Avoid putting "Webagentur Kassel" as H1/H2 on `/ueber-uns`. |
| Webdesign Kassel | `/webdesign-kassel` | `/leistungen` | **Low** | Hub-page (Leistungen) lists service categories without owning local keyword. |
| Web-Software | `/web-software` | `/leistungen` | **Low** | Hub vs. detail; clear hierarchy. |
| Website im Abo | `/website-im-abo` | `/webdesign-kassel` | **Low** | Different commerical model; cross-link. |
| Webdesign Kassel (future spoke risk) | `/webdesign-kassel` | `/webdesign-baunatal` (hypothetical) | **High** | Don't build spokes until hub ranks. Each spoke must offer unique local content — see §4 spoke gating rule. |

### Sitewide guardrails

1. **One primary keyword → one page.** If a Tier-1 keyword appears as H1 on two pages, one is wrong.
2. **H1 owns the primary; H2/H3 own the modifiers.** Don't repeat the H1 keyword exact-match more than ~2× in H2.
3. **Internal anchor-text discipline**: every Tier-1 keyword should have ≤ 3 unique anchor variations site-wide; exact-match ≤ 50% of total internal-link anchors.
4. **No keyword-stacked URLs**: existing slugs are correct (`/webdesign-kassel`, not `/webdesign-kassel-webagentur-erstellen-lassen`). Keep this discipline.

---

## 7 · Recommended Implementation Sequence

### Phase 0 — Validate (this week)

1. **Run live tooling** for the Top-25 keywords above (Ahrefs / Semrush / Google Keyword Planner DE). Replace estimates with real Volume / KD / CPC.
2. **Set up Google Search Console** + **Bing Webmaster Tools**. Submit (corrected) sitemap.
3. **Set up Google Business Profile** with Schwabstr. 7a, 34125 Kassel.
4. **Document current rankings** — baseline for measuring movement.

### Phase 1 — On-page foundation (week 1–2, paired with Audit Phase 1–2)

5. **Title rewrite pass** for short/long titles (Audit H-03):
   - `/` → "MAGICKS Studio — Webagentur aus Kassel · Websites, Shops, Software, KI"
   - `/leistungen` → "Leistungen — Websites, Shops, Software, KI \| MAGICKS Studio"
   - `/ueber-uns` → "Über uns — Kreatives Tech-Studio aus Kassel \| MAGICKS Studio"
   - `/kontakt` → "Projekt anfragen — Kontakt zu MAGICKS Studio aus Kassel"
   - `/web-software` → "Web-Software & Dashboards individuell entwickeln \| MAGICKS Studio"
   - `/website-im-abo` → "Website im Abo — monatlich statt Einmalzahlung \| MAGICKS Studio"
   - `/webdesign-kassel` → "Webdesign Kassel — Webagentur für Unternehmen \| MAGICKS"
   - `/landingpages-kassel` → "Landing Pages Kassel — Conversion-Design statt Template \| MAGICKS"
6. **Add H2 sub-line on homepage** (after H1) with primary local + service vocabulary (see §2). Editorial discipline mandatory — small, restrained.
7. **Add H2 anchors** on each service page per cluster recommendations in §3.
8. **Add `Organization` + `LocalBusiness` + `WebSite` JSON-LD** to `index.html` (Audit C-02). Schema is a keyword-discoverability multiplier.

### Phase 2 — Local SEO foundation (week 2–4)

9. **Google Business Profile** complete + verified.
10. **NAP audit**: ensure every footer / Impressum / GBP / Bing Places carries identical address.
11. **Citations**: 5–8 high-authority German directories (DasÖrtliche, GoLocal, Branchenbuch).
12. **Local schema** (`LocalBusiness` with geo + areaServed) ships with C-02.

### Phase 3 — Content engine spin-up (week 3–8)

13. **Two cost-content pieces first** (highest commercial impact):
    - F.1 "Was kostet eine Website in Kassel?"
    - F.4 "Was kostet ein 3D-Konfigurator? ROI-Beispiele"
14. **One AI-Overview-friendly definitional piece**:
    - F.7 "Was ist ein Creative-Tech Studio?" — anchors Cluster 10
15. **Add FAQ section** on highest-traffic SEO landing (`/webdesign-kassel`) with 5–7 real questions + answers — eligible for `FAQPage` schema once content exists.

### Phase 4 — Proof point engine (week 4–12, parallel)

16. Each shipped client mandate → **case study** on `/projekte` with specific metrics (load time before/after, Lighthouse score, # leads, conversion rate, time-to-launch).
17. **One testimonial per quarter** (with permission) → on `/ueber-uns` or `/kontakt`.
18. **Logo wall** when ≥ 3 logos are clearable.
19. **Update product-marketing-context.md → Proof Points → Currently Available** as proof lands.

### Phase 5 — Cluster expansion (Q3+)

20. Once `/webdesign-kassel` ranks **top 3** for *"Webdesign Kassel"*: build Spoke 1 (`/webdesign-baunatal`) with **unique local content** (real Baunatal mandate or unique local insight).
21. Industry-vertical landing pages (F.14, F.15, F.16) once 2+ verticals each have a real reference mandate.

### Phase 6 — Quarterly refresh

22. Re-run keyword research with live tooling every 90 days. Markets shift fast in *KI-Automation* (KD rising rapidly, volume tripling per year).
23. Audit `Search Console → Performance` for **Position 11–20** (page-2 wins): every term in this band needs an internal-link / on-page boost, not a new page.
24. Watch for **emerging KI vocabulary**: "Agent", "Operator", "Copilot für KMU", etc. Vocabulary will shift; the cluster categories should not.

---

## 8 · Tracking & Refresh

### KPI per cluster (track quarterly)

| Cluster | Primary KPI | Secondary KPI |
| --- | --- | --- |
| Cluster 1/2/3 (Kassel) | Top-3 ranking for `webdesign kassel` | GBP impressions/actions |
| Cluster 4 (Landing Page) | Top-5 for `landingpage erstellen lassen kassel` | Local-pack inclusion |
| Cluster 5 (Shops) | Page-1 for `onlineshop erstellen lassen` | Onlineshop-mandate-Anfragen / Quartal |
| Cluster 6/7 (Software/Dashboard) | Page-1 for `web software entwickeln lassen` + `webapp entwickeln lassen` | Hochwert-Mandate (€20k+) / Quartal |
| Cluster 8/9 (Automation/KI) | Page-1 for `ki automation` + `geschäftsprozesse automatisieren` | KI-Mandate / Quartal |
| Cluster 10 (Creative Tech) | Brand-Searches `magicks studio` Volumen | Direct-traffic share |
| Cluster 11 (Konfigurator) | Page-1 for `produktkonfigurator erstellen` + `3d produktkonfigurator` | Konfigurator-Mandate (€30k+) / Quartal |
| Cluster 12/13 (Modern/Digital Solutions) | Page-1 for `moderne website für unternehmen` | Mid-funnel Anfragen-Qualität |

### Refresh cadence

| Cadence | Activity |
| --- | --- |
| Weekly | GSC coverage + new query mining |
| Monthly | Position tracking diff for Top-50 keywords |
| Quarterly | Full keyword-strategy revisit (this doc → V2, V3, ...) |
| Yearly | Cluster restructure if market vocabulary has shifted |

### Triggers for emergency revisit

- Google or Bing rolls out a major core update
- A new competitor enters Top-3 for `Webdesign Kassel`
- Search volume on KI-cluster keywords doubles or halves
- A new programmatic-SEO competitor publishes 50+ city-pages
- Site experiences a coverage / indexation regression in GSC

---

## Output Index

- **§0** Methodology, Data caveats, Opportunity score formula
- **§1** 13 Keyword clusters (Webdesign Kassel · Website erstellen lassen Kassel · Webagentur Kassel · Landingpage erstellen lassen · Onlineshop erstellen lassen · Web-Software · Dashboard · Automatisierung · KI-Automation · Creative-Tech Agentur · 3D Konfigurator · moderne Website · digitale Lösungen)
- **§2** Homepage strategy (incl. anti-cannibalization rules)
- **§3** Per-page service-section strategy (`/leistungen`, `/websites-landingpages`, `/shops-produktkonfiguratoren`, `/web-software`, `/ki-automationen-integrationen`, `/website-im-abo`)
- **§4** Local SEO (Kassel/Nordhessen) hub-and-spoke + off-page actions
- **§5** Future content (commercial, informational, sub-cluster, AI-search)
- **§6** Keywords-to-avoid + sitewide cannibalization map
- **§7** Implementation sequence (Phase 0–6)
- **§8** KPIs + refresh cadence

> **Next skill in chain**: once this doc is approved, `copywriting` skill rewrites titles/H2s per §3 + content briefs from §5; `seo-geo` and `ai-seo` skills layer on AEO/GEO/LLMO optimization for the informational anchors.

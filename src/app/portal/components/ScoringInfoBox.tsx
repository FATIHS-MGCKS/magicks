/**
 * Collapsible info panel that explains how a lead's score, grade,
 * priority and next-best-step are derived. Mirrors the logic in
 * `src/app/portal/data/scoring.ts` 1:1 so anyone on the team can
 * self-serve "why is this lead priority Hot?" without digging into
 * the code.
 */

type Row = { label: string; points: string; note?: string };

const GRADE_ROWS: Row[] = [
  { label: "Lead-Status beginnt mit A", points: "+40" },
  { label: "Lead-Status beginnt mit B", points: "+25" },
  { label: "Lead-Status beginnt mit C", points: "+10" },
];

const WEBSITE_ROWS: Row[] = [
  { label: "Hinweis „Website hinzufügen“", points: "+25" },
  { label: "Keine (eigene) Website gefunden", points: "+25" },
  {
    label: "Nur Social / Linktree / Profilseite / Baukasten / SITE123",
    points: "+20",
  },
  {
    label: "Nicht SSL, mobil nicht optimiert oder lädt langsam",
    points: "+15",
  },
];

const SIGNAL_ROWS: Row[] = [
  {
    label: "Sichtbare Google-Bewertung vorhanden",
    points: "+20",
    note: "Rating-Ziffer wie „4,7“ oder Wort „Bewertung“",
  },
  { label: "Telefonnummer vorhanden", points: "+10" },
  {
    label: "Google-Check noch offen / nicht geprüft",
    points: "+5",
    note: "Fällt weg, sobald manueller Check gesetzt ist",
  },
  {
    label: "Reputationsrisiko im Assessment",
    points: "−5",
    note: "Z. B. schlechte Bewertungen oder Warnhinweise",
  },
];

const PRIORITY_ROWS = [
  { label: "Hot", range: "≥ 80" },
  { label: "High", range: "≥ 60" },
  { label: "Medium", range: "≥ 40" },
  { label: "Low", range: "≥ 20" },
  { label: "Archive", range: "< 20" },
];

const NEXT_STEP_ROWS = [
  {
    step: "Google/Website prüfen",
    condition: "Google-Check offen oder nicht gesetzt",
  },
  {
    step: "Anrufen",
    condition: "Keine Website auffindbar („keine eigene“, „hinzufügen“)",
  },
  {
    step: "Website-Audit anbieten",
    condition: "Website schwach, nicht SSL, langsam, Social-only, Baukasten",
  },
  {
    step: "Angebot vorbereiten",
    condition: "Status = Interessiert",
  },
  {
    step: "Follow-up durchführen",
    condition: "Next-Follow-up-Datum erreicht oder überfällig",
  },
  {
    step: "Lead prüfen",
    condition: "Alles andere",
  },
];

export function ScoringInfoBox() {
  return (
    <details className="group mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] transition open:border-white/[0.12] open:bg-white/[0.035]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[12.5px] text-white/85 hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white/25 text-[10px] font-medium text-white/75 group-open:border-amber-200/40 group-open:text-amber-200/90"
          >
            i
          </span>
          <span>
            Wie wird der Lead-Score berechnet?
            <span className="ml-2 text-white/45">
              Grade · Score · Priorität · Next Best Step
            </span>
          </span>
        </span>
        <span
          aria-hidden
          className="text-[10.5px] uppercase tracking-[0.18em] text-white/45 group-open:text-white/75"
        >
          <span className="group-open:hidden">Anzeigen</span>
          <span className="hidden group-open:inline">Schließen</span>
        </span>
      </summary>

      <div className="border-t border-white/[0.06] px-4 pb-5 pt-4">
        <p className="text-[12.5px] leading-relaxed text-white/65">
          Der Score ist deterministisch: Jede CSV- oder Auto-Check-Änderung
          rechnet die Punkte neu durch, daraus folgen Priorität und die
          angezeigte Next-Best-Step.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ScoreBlock
            title="Lead-Grade"
            subtitle="Basis aus Lead_Status"
            rows={GRADE_ROWS}
          />
          <ScoreBlock
            title="Website-Signale"
            subtitle="aus Website_Pruefung"
            rows={WEBSITE_ROWS}
          />
          <ScoreBlock
            title="Weitere Signale"
            subtitle="Rating, Phone, Google, Risiko"
            rows={SIGNAL_ROWS}
          />

          <div>
            <h3 className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/45">
              Prioritätsstufen
            </h3>
            <p className="mt-1 text-[11px] text-white/40">nach Summe aus allen Punkten</p>
            <ul className="mt-3 divide-y divide-white/[0.05] rounded-md border border-white/[0.06]">
              {PRIORITY_ROWS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between px-3 py-2 text-[12.5px]"
                >
                  <span className="text-white/85">{r.label}</span>
                  <span className="tabular-nums text-white/55">{r.range}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/45">
            Next Best Step — Entscheidungsreihenfolge
          </h3>
          <p className="mt-1 text-[11px] text-white/40">
            Die erste zutreffende Regel gewinnt — von oben nach unten geprüft.
          </p>
          <ol className="mt-3 space-y-1.5">
            {NEXT_STEP_ROWS.map((r, i) => (
              <li
                key={r.step}
                className="flex gap-3 rounded-md border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[12.5px]"
              >
                <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] tabular-nums text-white/55">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <span className="text-white/90">{r.step}</span>
                  <span className="ml-2 text-white/50">— {r.condition}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-5 text-[11.5px] text-white/40">
          Quelle:{" "}
          <code className="rounded bg-white/[0.05] px-1.5 py-0.5 text-white/65">
            src/app/portal/data/scoring.ts
          </code>
        </p>
      </div>
    </details>
  );
}

function ScoreBlock({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
}) {
  return (
    <div>
      <h3 className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/45">
        {title}
      </h3>
      <p className="mt-1 text-[11px] text-white/40">{subtitle}</p>
      <ul className="mt-3 divide-y divide-white/[0.05] rounded-md border border-white/[0.06]">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-start gap-3 px-3 py-2 text-[12.5px]"
          >
            <span className="flex-1 text-white/80">
              {r.label}
              {r.note ? (
                <span className="mt-0.5 block text-[11px] text-white/40">
                  {r.note}
                </span>
              ) : null}
            </span>
            <span
              className={`shrink-0 tabular-nums ${
                r.points.startsWith("−")
                  ? "text-rose-200/80"
                  : "text-emerald-200/85"
              }`}
            >
              {r.points}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

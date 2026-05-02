import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { parseCsv, type MappedRow, type ParsedCsv } from "../data/csv";
import { dedupeKey } from "../data/normalize";
import { useStore, portalStore } from "../hooks/useStore";

interface DupeInfo {
  rowIndex: number;
  existingCompany: string;
  existingId: string;
}

export default function CsvImportPage() {
  const navigate = useNavigate();
  const settings = useStore((s) => s.getSettings());
  const existingLeads = useStore((s) => s.getLeads());

  const fileInput = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Per-row "skip duplicate" decisions (keyed by row index).
  const [skipDuplicates, setSkipDuplicates] = useState<Record<number, boolean>>({});

  const [campaignName, setCampaignName] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState(settings.defaultRegion ?? "");
  const [source, setSource] = useState(settings.defaultSource ?? "");
  const [notes, setNotes] = useState("");

  const handleFile = async (file: File) => {
    setError(null);
    setFilename(file.name);
    try {
      const text = await file.text();
      const result = parseCsv(text);
      if (result.error) {
        setError(result.error);
        setParsed(null);
        return;
      }
      setParsed(result);
      // Default campaign name = filename without extension.
      setCampaignName((prev) =>
        prev || file.name.replace(/\.csv$/i, "").replace(/[_-]+/g, " ").trim(),
      );
      setSkipDuplicates({});
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Datei konnte nicht gelesen werden.";
      setError(message);
      setParsed(null);
    }
  };

  const dupes = useMemo<Map<number, DupeInfo>>(() => {
    if (!parsed) return new Map();
    const map = new Map<number, DupeInfo>();
    const existingByKey = new Map<string, { id: string; company: string }>();
    for (const l of existingLeads) {
      const key = dedupeKey(l.companyName, l.city, l.phone);
      if (key) existingByKey.set(key, { id: l.id, company: l.companyName });
    }
    parsed.rows.forEach((row, idx) => {
      const key = dedupeKey(row.companyName, row.city, row.phone);
      if (!key) return;
      const hit = existingByKey.get(key);
      if (hit) {
        map.set(idx, {
          rowIndex: idx,
          existingCompany: hit.company,
          existingId: hit.id,
        });
      }
    });
    return map;
  }, [parsed, existingLeads]);

  const validRows = parsed
    ? parsed.rows.filter((r, idx) => {
        if (!r.companyName) return false;
        if (dupes.has(idx) && skipDuplicates[idx]) return false;
        return true;
      })
    : [];
  const skippedCount = parsed
    ? parsed.rows.length - validRows.length
    : 0;

  const onImport = () => {
    if (!parsed || !validRows.length) return;
    if (!campaignName.trim()) {
      setError("Bitte einen Kampagnennamen vergeben.");
      return;
    }

    const campaign = portalStore.createCampaign({
      name: campaignName.trim(),
      kind: "industry",
      industry: industry.trim() || undefined,
      region: region.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    const inputs = validRows.map((row: MappedRow) => ({
      companyName: row.companyName ?? "(unbenannt)",
      city: row.city ?? "",
      campaignId: campaign.id,
      distanceFromKassel: row.distanceFromKassel,
      industry: row.industry ?? industry.trim() ?? undefined,
      phone: row.phone,
      ratingSignal: row.ratingSignal,
      websiteCheck: row.websiteCheck,
      googleCheckStatus: row.googleCheckStatus,
      leadStatusRaw: row.leadStatusRaw,
      sourceUrl: row.sourceUrl,
      researchNote: row.researchNote,
      assessment: row.assessment,
      rawMetadata: row.rawMetadata,
    }));

    portalStore.importLeads(inputs);
    navigate(`/portal/kampagnen/${campaign.id}`);
  };

  const previewLimit = 50;
  const previewRows = parsed?.rows.slice(0, previewLimit) ?? [];

  return (
    <>
      <PortalSeo title="CSV Import" />
      <PageHeader
        eyebrow="Import"
        title="Leads aus CSV importieren"
        description="Semikolon- oder Komma-getrennte UTF-8-Datei. Header werden automatisch erkannt; unbekannte Spalten landen in den Roh-Metadaten des jeweiligen Leads."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInput}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[13px] font-medium text-black transition hover:bg-white"
              >
                CSV-Datei wählen
              </button>
              <span className="text-[12.5px] text-white/55">
                {filename ?? "Keine Datei ausgewählt."}
              </span>
            </div>
            {error ? (
              <div className="mt-3 rounded-md border border-rose-400/25 bg-rose-400/[0.06] px-3 py-2 text-[12.5px] text-rose-200">
                {error}
              </div>
            ) : null}
            {parsed ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-white/65 sm:grid-cols-4">
                <Stat label="Trenner" value={parsed.delimiter === ";" ? "Semikolon" : "Komma"} />
                <Stat label="Zeilen" value={String(parsed.rows.length)} />
                <Stat label="Erkannte Spalten" value={String(parsed.fieldMap.filter((f) => f.mapped).length)} />
                <Stat
                  label="Mögliche Duplikate"
                  value={String(dupes.size)}
                  emphasis={dupes.size > 0}
                />
              </div>
            ) : null}
          </section>

          {parsed ? (
            <>
              <section className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
                <h2 className="font-instrument text-xl text-white">Spalten-Mapping</h2>
                <p className="mt-1 text-[12.5px] text-white/55">
                  Erkannte Spalten werden in das Lead-Schema gemappt. Unbekannte Spalten bleiben als
                  Roh-Metadaten am Lead erhalten.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {parsed.fieldMap.map((m) => (
                    <li
                      key={m.header}
                      className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12.5px]"
                    >
                      <code className="font-mono text-white/85">{m.header}</code>
                      {m.mapped ? (
                        <span className="text-white/55">→ {m.mapped}</span>
                      ) : (
                        <span className="text-white/35">→ rawMetadata</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <h2 className="font-instrument text-xl text-white">
                    Vorschau{" "}
                    <span className="text-[12px] text-white/45">
                      (erste {Math.min(previewLimit, parsed.rows.length)} von {parsed.rows.length})
                    </span>
                  </h2>
                </header>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-white/45">
                        <th className="px-3 py-2 text-left font-medium">#</th>
                        <th className="px-3 py-2 text-left font-medium">Unternehmen</th>
                        <th className="px-3 py-2 text-left font-medium">Ort</th>
                        <th className="px-3 py-2 text-left font-medium">Branche</th>
                        <th className="px-3 py-2 text-left font-medium">Telefon</th>
                        <th className="px-3 py-2 text-left font-medium">Lead</th>
                        <th className="px-3 py-2 text-left font-medium">Web-Check</th>
                        <th className="px-3 py-2 text-right font-medium">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, idx) => {
                        const dupe = dupes.get(idx);
                        const skip = !!skipDuplicates[idx];
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-white/[0.04] ${
                              dupe ? "bg-amber-400/[0.04]" : ""
                            } ${skip ? "opacity-50" : ""}`}
                          >
                            <td className="px-3 py-2 text-white/45 tabular-nums">{idx + 1}</td>
                            <td className="px-3 py-2 text-white">{row.companyName ?? "—"}</td>
                            <td className="px-3 py-2 text-white/75">{row.city ?? "—"}</td>
                            <td className="px-3 py-2 text-white/65">{row.industry ?? "—"}</td>
                            <td className="px-3 py-2 text-white/65">{row.phone ?? "—"}</td>
                            <td className="px-3 py-2 text-white/65">{row.leadStatusRaw ?? "—"}</td>
                            <td
                              className="max-w-[220px] truncate px-3 py-2 text-white/55"
                              title={row.websiteCheck}
                            >
                              {row.websiteCheck ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {dupe ? (
                                <label className="inline-flex items-center gap-1.5 text-[11.5px] text-amber-100/80">
                                  <input
                                    type="checkbox"
                                    checked={skip}
                                    onChange={(e) =>
                                      setSkipDuplicates((prev) => ({
                                        ...prev,
                                        [idx]: e.target.checked,
                                      }))
                                    }
                                  />
                                  Überspringen
                                </label>
                              ) : (
                                <span className="text-white/30">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {dupes.size > 0 ? (
                  <div className="border-t border-white/[0.06] bg-amber-300/[0.03] px-4 py-3 text-[12px] text-amber-100/85">
                    {dupes.size} mögliche Duplikate erkannt (gleiche Firma/Ort/Telefon-Kombi). Per
                    Häkchen können sie vom Import ausgeschlossen werden.
                  </div>
                ) : null}
              </section>
            </>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-16">
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
            <h2 className="font-instrument text-xl text-white">Kampagne</h2>
            <p className="mt-1 text-[12.5px] text-white/55">
              Importierte Leads werden dieser Kampagne zugeordnet.
            </p>

            <div className="mt-4 grid gap-3">
              <Field label="Name *">
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="z. B. Friseure-Kassel-Apr-26"
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
              </Field>
              <Field label="Branche">
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Friseure / Barbershops"
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
              </Field>
              <Field label="Region">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
              </Field>
              <Field label="Quelle">
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
              </Field>
              <Field label="Notizen">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
              </Field>
            </div>

            <button
              type="button"
              disabled={!parsed || validRows.length === 0 || !campaignName.trim()}
              onClick={onImport}
              className="mt-5 w-full rounded-md border border-white/15 bg-white/95 px-3 py-2 text-[13px] font-medium text-black transition hover:bg-white disabled:opacity-50"
            >
              {parsed
                ? `Importieren (${validRows.length})${
                    skippedCount > 0 ? ` · ${skippedCount} übersprungen` : ""
                  }`
                : "CSV laden, dann importieren"}
            </button>

            <div className="mt-4 text-[11px] leading-relaxed text-white/35">
              Score, Priorität und Next-Best-Step werden automatisch beim Import berechnet.
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${
        emphasis ? "border-amber-300/25 bg-amber-300/[0.05]" : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">{label}</div>
      <div className="mt-1 text-white tabular-nums">{value}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

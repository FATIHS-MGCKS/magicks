import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import {
  FilterBar,
  PortalSearch,
  PortalSelect,
  type SelectOption,
} from "../components/FilterBar";
import {
  LeadGradeBadge,
  LeadStatusBadge,
  PriorityBadge,
  ScoreChip,
} from "../components/StatusBadge";
import { useStore, portalStore } from "../hooks/useStore";
import {
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from "../data/types";

type SortKey = "score" | "newest" | "company" | "city";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "Alle Status" },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: "", label: "Alle Prioritäten" },
  { value: "Hot", label: "Hot" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
  { value: "Archive", label: "Archive" },
];

const GRADE_OPTIONS: SelectOption[] = [
  { value: "", label: "Alle Grades" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "Unknown", label: "—" },
];

const GOOGLE_OPTIONS: SelectOption[] = [
  { value: "", label: "Google-Check egal" },
  { value: "open", label: "Offen / nicht geprüft" },
  { value: "checked", label: "Geprüft" },
];

const WEBSITE_OPTIONS: SelectOption[] = [
  { value: "", label: "Web-Check egal" },
  { value: "missing", label: "Keine Website / nur Profile" },
  { value: "weak", label: "Schwach / nicht SSL / langsam" },
  { value: "good", label: "Website gut" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "score", label: "Sortierung: Score" },
  { value: "newest", label: "Sortierung: Neueste" },
  { value: "company", label: "Sortierung: Firma A–Z" },
  { value: "city", label: "Sortierung: Stadt" },
];

function matchesWebsite(lead: Lead, key: string): boolean {
  if (!key) return true;
  const wc = (lead.websiteCheck ?? "").toLowerCase();
  if (key === "missing") {
    return /keine\s+website|linktree|facebook|instagram|profilseite|baukasten|website hinzuf/i.test(
      wc,
    );
  }
  if (key === "weak") {
    return /schwach|nicht ssl|nicht ssl-zertif|mobil nicht optimiert|l(?:ä|ae)dt langsam/i.test(wc);
  }
  if (key === "good") {
    return /website gut|seriös|sauber|professionell/i.test(wc);
  }
  return true;
}

function matchesGoogle(lead: Lead, key: string): boolean {
  if (!key) return true;
  const g = (lead.googleCheckStatus ?? "").trim();
  if (key === "open") {
    return !g || /Nicht\s+(gepr|sep|sys)/i.test(g);
  }
  return /^Geprüft$/i.test(g);
}

export default function LeadsPage() {
  const { leads, campaigns } = useStore((s) => ({
    leads: s.getLeads(),
    campaigns: s.getCampaigns(),
  }));

  const campaignOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Alle Kampagnen" },
      ...campaigns.map((c) => ({ value: c.id, label: c.name })),
    ],
    [campaigns],
  );

  const industryOptions: SelectOption[] = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) if (l.industry) set.add(l.industry);
    return [
      { value: "", label: "Alle Branchen" },
      ...Array.from(set)
        .sort()
        .map((i) => ({ value: i, label: i })),
    ];
  }, [leads]);

  const [search, setSearch] = useState("");
  const [campaign, setCampaign] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [grade, setGrade] = useState("");
  const [google, setGoogle] = useState("");
  const [website, setWebsite] = useState("");
  const [sort, setSort] = useState<SortKey>("score");

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = leads.filter((l) => {
      if (campaign && l.campaignId !== campaign) return false;
      if (industry && l.industry !== industry) return false;
      if (status && l.status !== status) return false;
      if (priority && l.priority !== priority) return false;
      if (grade && l.leadGrade !== grade) return false;
      if (!matchesGoogle(l, google)) return false;
      if (!matchesWebsite(l, website)) return false;
      if (q) {
        const hay = [l.companyName, l.city, l.phone, l.industry, l.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "score") {
      list = list.slice().sort((a, b) => b.leadScore - a.leadScore);
    } else if (sort === "newest") {
      list = list.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (sort === "company") {
      list = list.slice().sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else if (sort === "city") {
      list = list.slice().sort((a, b) => a.city.localeCompare(b.city));
    }
    return list;
  }, [
    leads,
    search,
    campaign,
    industry,
    status,
    priority,
    grade,
    google,
    website,
    sort,
  ]);

  const allVisibleIds = useMemo(() => filtered.map((l) => l.id), [filtered]);
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      if (allSelected) return new Set();
      const next = new Set(prev);
      for (const id of allVisibleIds) next.add(id);
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const onBulkStatus = (next: LeadStatus) => {
    portalStore.bulkUpdateLeads(Array.from(selected), { status: next });
    clearSelection();
  };
  const onBulkArchive = () => {
    portalStore.bulkUpdateLeads(Array.from(selected), { archive: true });
    clearSelection();
  };
  const onBulkGoogleCheck = () => {
    portalStore.bulkUpdateLeads(Array.from(selected), {
      markGoogleCheckNeeded: true,
    });
    clearSelection();
  };
  const onBulkAssignCampaign = (id: string) => {
    if (!id) return;
    portalStore.bulkUpdateLeads(Array.from(selected), { campaignId: id });
    clearSelection();
  };

  const empty = leads.length === 0;

  return (
    <>
      <PortalSeo title="Leads" />
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description={`${leads.length} Leads gesamt · ${filtered.length} sichtbar`}
        actions={
          <Link
            to="/portal/csv-import"
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
          >
            CSV importieren
          </Link>
        }
      />

      {empty ? (
        <EmptyState
          title="Noch keine Leads."
          description="Importiere eine CSV-Datei, um die erste Kampagne anzulegen."
          action={
            <Link
              to="/portal/csv-import"
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[13px] font-medium text-black transition hover:bg-white"
            >
              CSV importieren
            </Link>
          }
        />
      ) : (
        <>
          <FilterBar>
            <div className="min-w-[200px] flex-1">
              <PortalSearch
                value={search}
                onChange={setSearch}
                placeholder="Firma, Ort, Telefon…"
              />
            </div>
            <PortalSelect value={campaign} onChange={setCampaign} options={campaignOptions} ariaLabel="Kampagne" />
            <PortalSelect value={industry} onChange={setIndustry} options={industryOptions} ariaLabel="Branche" />
            <PortalSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} ariaLabel="Status" />
            <PortalSelect value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} ariaLabel="Priorität" />
            <PortalSelect value={grade} onChange={setGrade} options={GRADE_OPTIONS} ariaLabel="Grade" />
            <PortalSelect value={google} onChange={setGoogle} options={GOOGLE_OPTIONS} ariaLabel="Google-Check" />
            <PortalSelect value={website} onChange={setWebsite} options={WEBSITE_OPTIONS} ariaLabel="Web-Check" />
            <PortalSelect
              value={sort}
              onChange={(v) => setSort(v as SortKey)}
              options={SORT_OPTIONS}
              ariaLabel="Sortierung"
            />
          </FilterBar>

          {selected.size > 0 ? (
            <div className="sticky top-12 z-20 mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-white/15 bg-[#101012]/95 px-3 py-2 shadow-lg backdrop-blur">
              <span className="text-[12.5px] text-white/65">
                {selected.size} ausgewählt
              </span>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <PortalSelect
                  value=""
                  onChange={(v) => {
                    if (v) onBulkStatus(v as LeadStatus);
                  }}
                  options={[{ value: "", label: "Status setzen…" }, ...STATUS_OPTIONS.slice(1)]}
                  ariaLabel="Bulk-Status"
                />
                <PortalSelect
                  value=""
                  onChange={(v) => onBulkAssignCampaign(v)}
                  options={[
                    { value: "", label: "Kampagne zuordnen…" },
                    ...campaigns.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  ariaLabel="Bulk-Kampagne"
                />
                <button
                  type="button"
                  onClick={onBulkGoogleCheck}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/85 transition hover:bg-white/[0.08]"
                >
                  Google-Check öffnen
                </button>
                <button
                  type="button"
                  onClick={onBulkArchive}
                  className="rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12px] text-rose-200 transition hover:bg-rose-400/[0.16]"
                >
                  Archivieren
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-md border border-white/10 bg-transparent px-3 py-1.5 text-[12px] text-white/55 hover:text-white"
                >
                  Auswahl aufheben
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full min-w-[960px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/45">
                  <th className="px-3 py-2 text-left font-medium">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Alle auswählen"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Firma · Ort</th>
                  <th className="px-3 py-2 text-left font-medium">Branche</th>
                  <th className="px-3 py-2 text-left font-medium">Grade · Score</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Web-Check</th>
                  <th className="px-3 py-2 text-left font-medium">Bewertung</th>
                  <th className="px-3 py-2 text-left font-medium">Next Step</th>
                  <th className="px-3 py-2 text-right font-medium">↗</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const campaignName = campaigns.find((c) => c.id === l.campaignId)?.name;
                  return (
                    <tr
                      key={l.id}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          checked={selected.has(l.id)}
                          onChange={() => toggleOne(l.id)}
                          aria-label={`Auswahl ${l.companyName}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Link
                          to={`/portal/leads/${l.id}`}
                          className="block min-w-0 truncate text-white hover:text-white/80"
                        >
                          {l.companyName}
                        </Link>
                        <div className="mt-0.5 text-[11.5px] text-white/45">
                          {l.city || "—"}
                          {campaignName ? ` · ${campaignName}` : ""}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-white/65">
                        {l.industry ?? "—"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex items-center gap-1.5">
                          <LeadGradeBadge grade={l.leadGrade} />
                          <ScoreChip score={l.leadScore} />
                          <PriorityBadge priority={l.priority} />
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <LeadStatusBadge status={l.status} />
                      </td>
                      <td
                        className="max-w-[200px] truncate px-3 py-2 align-top text-white/55"
                        title={l.websiteCheck}
                      >
                        {l.websiteCheck ?? "—"}
                      </td>
                      <td
                        className="max-w-[150px] truncate px-3 py-2 align-top text-white/55"
                        title={l.ratingSignal}
                      >
                        {l.ratingSignal ?? "—"}
                      </td>
                      <td className="px-3 py-2 align-top text-white/75">
                        {l.nextBestStep}
                      </td>
                      <td className="px-3 py-2 text-right align-top">
                        <Link
                          to={`/portal/leads/${l.id}`}
                          className="text-white/45 hover:text-white"
                        >
                          ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12.5px] text-white/45">
                Keine Treffer für die aktuellen Filter.
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

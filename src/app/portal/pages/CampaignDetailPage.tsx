import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { LeadGradeBadge, LeadStatusBadge, PriorityBadge, ScoreChip } from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useStore, portalStore } from "../hooks/useStore";
import { LEAD_STATUSES, type Lead } from "../data/types";
import { formatDate } from "../components/format";

export default function CampaignDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { campaign, leads, customers } = useStore((s) => {
    const campaign = s.getCampaign(id);
    const allLeads = s.getLeads();
    const inCampaign = allLeads.filter((l) => l.campaignId === id);
    const cs = s
      .getCustomers()
      .filter((c) => inCampaign.some((l) => l.id === c.sourceLeadId));
    return { campaign, leads: inCampaign, customers: cs };
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(campaign?.name ?? "");
  const [notes, setNotes] = useState(campaign?.notes ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!campaign) {
    return (
      <>
        <PortalSeo title="Kampagne" />
        <PageHeader
          back={{ to: "/portal/kampagnen", label: "Zurück zu Kampagnen" }}
          title="Kampagne nicht gefunden"
        />
      </>
    );
  }

  const counts = {
    total: leads.length,
    a: leads.filter((l) => l.leadGrade === "A").length,
    b: leads.filter((l) => l.leadGrade === "B").length,
    c: leads.filter((l) => l.leadGrade === "C").length,
    hot: leads.filter((l) => l.priority === "Hot").length,
    high: leads.filter((l) => l.priority === "High").length,
    contacted: leads.filter((l) =>
      ["Kontaktiert", "Interessiert", "Follow-up", "Angebot angefragt", "Kunde geworden"].includes(
        l.status,
      ),
    ).length,
    customers: customers.length,
  };

  const byStatus: Record<string, number> = {};
  for (const l of leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;

  const onSave = () => {
    portalStore.updateCampaign(campaign.id, {
      name: name.trim() || campaign.name,
      notes: notes.trim() || undefined,
    });
    setEditing(false);
  };

  const onDelete = () => {
    portalStore.deleteCampaign(campaign.id);
    setConfirmDelete(false);
    navigate("/portal/kampagnen");
  };

  return (
    <>
      <PortalSeo title={`Kampagne · ${campaign.name}`} />
      <PageHeader
        back={{ to: "/portal/kampagnen", label: "Zurück zu Kampagnen" }}
        eyebrow={`Importiert · ${formatDate(campaign.importedAt)}`}
        title={campaign.name}
        description={[campaign.industry, campaign.region, campaign.source].filter(Boolean).join(" · ")}
        actions={
          <>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/85 transition hover:bg-white/[0.08]"
            >
              {editing ? "Abbrechen" : "Bearbeiten"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200 transition hover:bg-rose-400/[0.16]"
            >
              Löschen
            </button>
          </>
        }
      />

      {editing ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">Notizen</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="mt-3 rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
          >
            Speichern
          </button>
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Leads" value={counts.total} />
        <Metric label="Grade A" value={counts.a} accent="success" />
        <Metric label="Grade B" value={counts.b} accent="info" />
        <Metric label="Grade C" value={counts.c} accent="warn" />
        <Metric label="Hot" value={counts.hot} accent="warn" />
        <Metric label="High" value={counts.high} accent="info" />
        <Metric label="Kontaktiert" value={counts.contacted} />
        <Metric label="Kunden geworden" value={counts.customers} accent="success" />
      </section>

      {Object.keys(byStatus).length > 0 ? (
        <section className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="mb-3 font-instrument text-lg text-white">Verteilung nach Status</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LEAD_STATUSES.filter((s) => byStatus[s]).map((s) => (
              <li
                key={s}
                className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.015] px-3 py-2 text-[12.5px]"
              >
                <span className="text-white/85">{s}</span>
                <span className="tabular-nums text-white">{byStatus[s]}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.02]">
        <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <h2 className="font-instrument text-lg text-white">Leads in dieser Kampagne</h2>
          <Link to="/portal/leads" className="text-[12px] text-white/45 hover:text-white">
            Alle Leads ↗
          </Link>
        </header>
        {leads.length === 0 ? (
          <div className="p-4 text-sm text-white/45">Noch keine Leads.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/45">
                  <th className="px-3 py-2 text-left font-medium">Firma · Ort</th>
                  <th className="px-3 py-2 text-left font-medium">Branche</th>
                  <th className="px-3 py-2 text-left font-medium">Grade · Score</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Next Step</th>
                </tr>
              </thead>
              <tbody>
                {leads
                  .slice()
                  .sort((a: Lead, b: Lead) => b.leadScore - a.leadScore)
                  .map((l) => (
                    <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                      <td className="px-3 py-2">
                        <Link
                          to={`/portal/leads/${l.id}`}
                          className="text-white hover:text-white/80"
                        >
                          {l.companyName}
                        </Link>
                        <div className="text-[11.5px] text-white/45">{l.city}</div>
                      </td>
                      <td className="px-3 py-2 text-white/65">{l.industry ?? "—"}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <LeadGradeBadge grade={l.leadGrade} />
                          <ScoreChip score={l.leadScore} />
                          <PriorityBadge priority={l.priority} />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <LeadStatusBadge status={l.status} />
                      </td>
                      <td className="px-3 py-2 text-white/75">{l.nextBestStep}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmDelete}
        title="Kampagne löschen?"
        description="Die Kampagne wird gelöscht. Zugehörige Leads bleiben erhalten, verlieren aber ihre Kampagnenzuordnung."
        destructive
        confirmLabel="Löschen"
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "success" | "info" | "warn";
}) {
  const tone =
    accent === "success"
      ? "border-emerald-400/20 bg-emerald-400/[0.05]"
      : accent === "info"
        ? "border-sky-400/20 bg-sky-400/[0.05]"
        : accent === "warn"
          ? "border-amber-300/25 bg-amber-300/[0.05]"
          : "border-white/[0.08] bg-white/[0.02]";
  return (
    <div className={`rounded-lg border ${tone} p-4`}>
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="mt-2 font-instrument text-[1.6rem] leading-none text-white tabular-nums">
        {value}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { useStore, portalStore } from "../hooks/useStore";
import { formatDate } from "../components/format";

export default function CampaignsPage() {
  const { campaigns, leads, customers, projects } = useStore((s) => ({
    campaigns: s.getCampaigns(),
    leads: s.getLeads(),
    customers: s.getCustomers(),
    projects: s.getProjects(),
  }));

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [source, setSource] = useState("");

  const rows = useMemo(() => {
    return campaigns
      .map((c) => {
        const cLeads = leads.filter((l) => l.campaignId === c.id);
        const cCustomers = customers.filter((cu) =>
          cLeads.some((l) => l.id === cu.sourceLeadId),
        );
        const cProjects = projects.filter((p) =>
          cLeads.some((l) => l.id === p.sourceLeadId),
        );
        return {
          campaign: c,
          total: cLeads.length,
          hot: cLeads.filter((l) => l.priority === "Hot").length,
          contacted: cLeads.filter((l) =>
            [
              "Kontaktiert",
              "Interessiert",
              "Follow-up",
              "Angebot angefragt",
              "Kunde geworden",
            ].includes(l.status),
          ).length,
          customers: cCustomers.length,
          projects: cProjects.length,
        };
      })
      .sort((a, b) =>
        a.campaign.importedAt > b.campaign.importedAt ? -1 : 1,
      );
  }, [campaigns, leads, customers, projects]);

  const onCreate = () => {
    if (!name.trim()) return;
    const created = portalStore.createCampaign({
      name: name.trim(),
      industry: industry.trim() || undefined,
      region: region.trim() || undefined,
      source: source.trim() || undefined,
    });
    setName("");
    setIndustry("");
    setRegion("");
    setSource("");
    setShowForm(false);
    return created;
  };

  return (
    <>
      <PortalSeo title="Kampagnen" />
      <PageHeader
        eyebrow="Pipeline"
        title="Kampagnen"
        description="Lead-Batches aus CSV-Importen oder manuell angelegt."
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/85 transition hover:bg-white/[0.08]"
            >
              Manuell anlegen
            </button>
            <Link
              to="/portal/csv-import"
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
            >
              CSV importieren
            </Link>
          </>
        }
      />

      {showForm ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="font-instrument text-lg text-white">Neue Kampagne</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Name *">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Branche">
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Region">
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Quelle">
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onCreate}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
            >
              Anlegen
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
            >
              Abbrechen
            </button>
          </div>
        </section>
      ) : null}

      {campaigns.length === 0 ? (
        <EmptyState
          title="Noch keine Kampagnen."
          description="Lade eine CSV hoch, um deine erste Kampagne mit Leads anzulegen."
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
        <div className="overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/45">
                <th className="px-3 py-2 text-left font-medium">Kampagne</th>
                <th className="px-3 py-2 text-left font-medium">Branche · Region</th>
                <th className="px-3 py-2 text-right font-medium">Leads</th>
                <th className="px-3 py-2 text-right font-medium">Hot</th>
                <th className="px-3 py-2 text-right font-medium">Kontaktiert</th>
                <th className="px-3 py-2 text-right font-medium">Kunden</th>
                <th className="px-3 py-2 text-right font-medium">Projekte</th>
                <th className="px-3 py-2 text-right font-medium">Import</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ campaign, total, hot, contacted, customers, projects }) => (
                <tr
                  key={campaign.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2">
                    <Link
                      to={`/portal/kampagnen/${campaign.id}`}
                      className="text-white hover:text-white/80"
                    >
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-white/65">
                    {[campaign.industry, campaign.region].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-white">{total}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-amber-200/85">{hot}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-white/75">{contacted}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-emerald-200/85">{customers}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-white/75">{projects}</td>
                  <td className="px-3 py-2 text-right text-[11.5px] text-white/45">
                    {formatDate(campaign.importedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const inputCls =
  "rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

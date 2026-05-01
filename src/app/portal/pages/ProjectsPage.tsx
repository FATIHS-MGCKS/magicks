import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { ProjectStatusBadge } from "../components/StatusBadge";
import {
  FilterBar,
  PortalSearch,
  PortalSelect,
  type SelectOption,
} from "../components/FilterBar";
import { useStore, portalStore } from "../hooks/useStore";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type ProjectStatus,
  type ProjectType,
} from "../data/types";

export default function ProjectsPage() {
  const { projects, customers } = useStore((s) => ({
    projects: s.getProjects(),
    customers: s.getCustomers(),
  }));

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Website");

  const statusOptions: SelectOption[] = [
    { value: "", label: "Alle Status" },
    ...PROJECT_STATUSES.map((s) => ({ value: s, label: s })),
  ];
  const typeOptions: SelectOption[] = [
    { value: "", label: "Alle Typen" },
    ...PROJECT_TYPES.map((t) => ({ value: t, label: t })),
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (status && p.status !== status) return false;
      if (type && p.projectType !== type) return false;
      if (!q) return true;
      const customerName = customers.find((c) => c.id === p.customerId)?.companyName ?? "";
      return [p.name, customerName, p.projectType].join(" ").toLowerCase().includes(q);
    });
  }, [projects, customers, search, status, type]);

  const onCreate = () => {
    if (!name.trim()) return;
    portalStore.createProject({
      name: name.trim(),
      customerId: customerId || undefined,
      projectType,
      status: "Anfrage",
    });
    setName("");
    setCustomerId("");
    setProjectType("Website");
    setShowForm(false);
  };

  return (
    <>
      <PortalSeo title="Projekte" />
      <PageHeader
        eyebrow="Geschäft"
        title="Projekte"
        description={`${projects.length} Projekte`}
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
          >
            Neues Projekt
          </button>
        }
      />

      {showForm ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="font-instrument text-lg text-white">Neues Projekt</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Name *">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Typ">
              <PortalSelect
                value={projectType}
                onChange={(v) => setProjectType(v as ProjectType)}
                options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </Field>
            <Field label="Kunde (optional)">
              <PortalSelect
                value={customerId}
                onChange={setCustomerId}
                options={[
                  { value: "", label: "Kein Kunde" },
                  ...customers.map((c) => ({ value: c.id, label: c.companyName })),
                ]}
              />
            </Field>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onCreate}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
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

      {projects.length === 0 ? (
        <EmptyState
          title="Noch keine Projekte."
          description="Projekte entstehen aus Leads/Kunden oder werden hier manuell angelegt."
        />
      ) : (
        <>
          <FilterBar>
            <div className="min-w-[200px] flex-1">
              <PortalSearch value={search} onChange={setSearch} placeholder="Projekt, Kunde, Typ…" />
            </div>
            <PortalSelect value={status} onChange={(v) => setStatus(v)} options={statusOptions} />
            <PortalSelect value={type} onChange={(v) => setType(v)} options={typeOptions} />
          </FilterBar>

          <div className="mt-4 overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/45">
                  <th className="px-3 py-2 text-left font-medium">Projekt</th>
                  <th className="px-3 py-2 text-left font-medium">Kunde</th>
                  <th className="px-3 py-2 text-left font-medium">Typ</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Wert</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const customerName = customers.find((c) => c.id === p.customerId)?.companyName;
                  return (
                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                      <td className="px-3 py-2">
                        <Link to={`/portal/projekte/${p.id}`} className="text-white hover:text-white/80">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-white/65">{customerName ?? "—"}</td>
                      <td className="px-3 py-2 text-white/65">{p.projectType}</td>
                      <td className="px-3 py-2">
                        <ProjectStatusBadge status={p.status as ProjectStatus} />
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-white/85">
                        {p.estimatedValue ? `€ ${p.estimatedValue.toLocaleString("de-DE")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12.5px] text-white/45">
                Keine Treffer.
              </div>
            ) : null}
          </div>
        </>
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

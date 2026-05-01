import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PortalSelect } from "../components/FilterBar";
import { ProjectStatusBadge } from "../components/StatusBadge";
import { useStore, portalStore } from "../hooks/useStore";
import { PROJECT_TYPES, type ProjectType } from "../data/types";
import { formatDate, formatDateTime } from "../components/format";

export default function CustomerDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { customer, lead, projects, tasks } = useStore((s) => {
    const customer = s.getCustomer(id);
    return {
      customer,
      lead: customer?.sourceLeadId ? s.getLead(customer.sourceLeadId) : undefined,
      projects: customer ? s.getProjects().filter((p) => p.customerId === customer.id) : [],
      tasks: customer ? s.getTasks().filter((t) => t.relatedCustomerId === customer.id) : [],
    };
  });

  const [editing, setEditing] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Website");

  const [form, setForm] = useState({
    companyName: customer?.companyName ?? "",
    contactName: customer?.contactName ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    website: customer?.website ?? "",
    city: customer?.city ?? "",
    address: customer?.address ?? "",
    industry: customer?.industry ?? "",
    notes: customer?.notes ?? "",
  });

  if (!customer) {
    return (
      <>
        <PortalSeo title="Kunde" />
        <PageHeader
          back={{ to: "/portal/kunden", label: "Zurück zu Kunden" }}
          title="Kunde nicht gefunden"
        />
      </>
    );
  }

  const onSave = () => {
    portalStore.updateCustomer(customer.id, {
      companyName: form.companyName.trim() || customer.companyName,
      contactName: form.contactName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined,
      city: form.city.trim() || undefined,
      address: form.address.trim() || undefined,
      industry: form.industry.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
    setEditing(false);
  };

  const onCreateProject = () => {
    if (!projectName.trim()) return;
    const created = portalStore.createProjectFromCustomer(customer.id, {
      name: projectName.trim(),
      projectType,
    });
    if (created) navigate(`/portal/projekte/${created.id}`);
  };

  const onDelete = () => {
    portalStore.deleteCustomer(customer.id);
    setConfirmDelete(false);
    navigate("/portal/kunden");
  };

  return (
    <>
      <PortalSeo title={`Kunde · ${customer.companyName}`} />
      <PageHeader
        back={{ to: "/portal/kunden", label: "Zurück zu Kunden" }}
        eyebrow="Kunde"
        title={customer.companyName}
        description={[customer.city, customer.industry].filter(Boolean).join(" · ")}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowProjectForm((v) => !v)}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Projekt anlegen
            </button>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/85 hover:bg-white/[0.08]"
            >
              {editing ? "Abbrechen" : "Bearbeiten"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200 hover:bg-rose-400/[0.16]"
            >
              Löschen
            </button>
          </>
        }
      />

      {showProjectForm ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="font-instrument text-lg text-white">Neues Projekt</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={inputCls}
                placeholder={`Website ${customer.companyName}`}
              />
            </Field>
            <Field label="Typ">
              <PortalSelect
                value={projectType}
                onChange={(v) => setProjectType(v as ProjectType)}
                options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </Field>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onCreateProject}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Anlegen
            </button>
            <button
              type="button"
              onClick={() => setShowProjectForm(false)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
            >
              Abbrechen
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h2 className="mb-3 font-instrument text-lg text-white">Stammdaten</h2>
            {editing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["companyName", "Firma"],
                    ["contactName", "Ansprechperson"],
                    ["phone", "Telefon"],
                    ["email", "E-Mail"],
                    ["website", "Website"],
                    ["city", "Ort"],
                    ["address", "Adresse"],
                    ["industry", "Branche"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                ))}
                <Field label="Notizen">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={onSave}
                    className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            ) : (
              <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
                <DefRow label="Firma" value={customer.companyName} />
                <DefRow label="Ansprechperson" value={customer.contactName} />
                <DefRow label="Telefon" value={customer.phone} href={customer.phone ? `tel:${customer.phone}` : undefined} />
                <DefRow label="E-Mail" value={customer.email} href={customer.email ? `mailto:${customer.email}` : undefined} />
                <DefRow label="Website" value={customer.website} href={customer.website ?? undefined} />
                <DefRow label="Ort" value={customer.city} />
                <DefRow label="Adresse" value={customer.address} />
                <DefRow label="Branche" value={customer.industry} />
                {customer.notes ? <DefRow label="Notizen" value={customer.notes} /> : null}
              </dl>
            )}
          </section>

          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <h2 className="font-instrument text-lg text-white">Projekte</h2>
            </header>
            {projects.length === 0 ? (
              <div className="p-4 text-sm text-white/45">Noch keine Projekte.</div>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-4 py-3">
                    <Link
                      to={`/portal/projekte/${p.id}`}
                      className="min-w-0 flex-1 truncate text-white hover:text-white/80"
                    >
                      {p.name}
                    </Link>
                    <ProjectStatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <h2 className="font-instrument text-lg text-white">Aufgaben</h2>
            </header>
            {tasks.length === 0 ? (
              <div className="p-4 text-sm text-white/45">Keine Aufgaben.</div>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-4 py-2.5">
                    <div className="min-w-0">
                      <div className="text-[13px] text-white">{t.title}</div>
                      <div className="text-[11.5px] text-white/45">
                        {t.dueDate ? `fällig ${formatDate(t.dueDate)}` : "ohne Termin"}
                      </div>
                    </div>
                    <span className="text-[12px] text-white/65">{t.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h2 className="mb-3 font-instrument text-lg text-white">Verknüpfungen</h2>
            {lead ? (
              <Link
                to={`/portal/leads/${lead.id}`}
                className="block rounded-md border border-white/[0.06] bg-white/[0.015] px-3 py-2 text-[12.5px] text-white hover:bg-white/[0.05]"
              >
                Quell-Lead · {lead.companyName}
                <div className="text-[11px] text-white/45">{lead.city}</div>
              </Link>
            ) : (
              <div className="rounded-md border border-dashed border-white/10 bg-white/[0.015] px-3 py-2 text-[12.5px] text-white/45">
                Manuell angelegt — kein Quell-Lead.
              </div>
            )}
          </section>

          <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            <h2 className="mb-3 font-instrument text-lg text-white">Meta</h2>
            <dl className="grid gap-2 text-[12px] text-white/70">
              <DefRow label="Angelegt" value={formatDateTime(customer.createdAt)} />
              <DefRow label="Aktualisiert" value={formatDateTime(customer.updatedAt)} />
            </dl>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Kunde löschen?"
        description="Der Kundeneintrag wird entfernt. Zugehörige Projekte verlieren ihre Kundenzuordnung."
        destructive
        confirmLabel="Löschen"
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      />
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

function DefRow({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string;
}) {
  const display = value ?? "—";
  return (
    <div>
      <dt className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">{label}</dt>
      <dd className="mt-0.5 break-words text-white/85">
        {value && href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-white underline-offset-2 hover:underline">
            {display}
          </a>
        ) : (
          display
        )}
      </dd>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PortalSelect } from "../components/FilterBar";
import { ProjectStatusBadge, TaskStatusBadge } from "../components/StatusBadge";
import { useStore, portalStore } from "../hooks/useStore";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type ProjectStatus,
  type ProjectType,
} from "../data/types";
import { formatDate, formatDateTime } from "../components/format";

export default function ProjectDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { project, customer, lead, tasks } = useStore((s) => {
    const project = s.getProject(id);
    return {
      project,
      customer: project?.customerId ? s.getCustomer(project.customerId) : undefined,
      lead: project?.sourceLeadId ? s.getLead(project.sourceLeadId) : undefined,
      tasks: project ? s.getTasks().filter((t) => t.relatedProjectId === project.id) : [],
    };
  });

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");

  const [form, setForm] = useState({
    name: project?.name ?? "",
    projectType: project?.projectType ?? ("Website" as ProjectType),
    estimatedValue: project?.estimatedValue ? String(project.estimatedValue) : "",
    startDate: project?.startDate?.slice(0, 10) ?? "",
    deadline: project?.deadline?.slice(0, 10) ?? "",
    notes: project?.notes ?? "",
  });

  if (!project) {
    return (
      <>
        <PortalSeo title="Projekt" />
        <PageHeader back={{ to: "/portal/projekte", label: "Zurück zu Projekten" }} title="Projekt nicht gefunden" />
      </>
    );
  }

  const onSave = () => {
    portalStore.updateProject(project.id, {
      name: form.name.trim() || project.name,
      projectType: form.projectType,
      estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      notes: form.notes.trim() || undefined,
    });
    setEditing(false);
  };

  const onChangeStatus = (status: ProjectStatus) => {
    portalStore.updateProject(project.id, { status });
  };

  const onAddTask = () => {
    if (!taskTitle.trim()) return;
    portalStore.createTask({
      title: taskTitle.trim(),
      relatedProjectId: project.id,
      dueDate: taskDate || undefined,
      status: "Offen",
      priority: "Medium",
    });
    setTaskTitle("");
    setTaskDate("");
  };

  const onDelete = () => {
    portalStore.deleteProject(project.id);
    setConfirmDelete(false);
    navigate("/portal/projekte");
  };

  return (
    <>
      <PortalSeo title={`Projekt · ${project.name}`} />
      <PageHeader
        back={{ to: "/portal/projekte", label: "Zurück zu Projekten" }}
        eyebrow={project.projectType}
        title={project.name}
        actions={
          <>
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

      <section className="grid grid-cols-2 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 sm:grid-cols-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">Status</div>
          <div className="mt-1.5">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">Typ</div>
          <div className="mt-1.5 text-[13px] text-white">{project.projectType}</div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">Wert</div>
          <div className="mt-1.5 text-[13px] text-white tabular-nums">
            {project.estimatedValue ? `€ ${project.estimatedValue.toLocaleString("de-DE")}` : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">Deadline</div>
          <div className="mt-1.5 text-[13px] text-white">
            {project.deadline ? formatDate(project.deadline) : "—"}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {editing ? (
            <Card title="Projekt bearbeiten">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Typ">
                  <PortalSelect
                    value={form.projectType}
                    onChange={(v) => setForm({ ...form, projectType: v as ProjectType })}
                    options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
                  />
                </Field>
                <Field label="Wert (€)">
                  <input
                    type="number"
                    value={form.estimatedValue}
                    onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Start">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Deadline">
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Notizen">
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={onSave}
                className="mt-3 rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
              >
                Speichern
              </button>
            </Card>
          ) : (
            <Card title="Status & Notizen">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Status">
                  <PortalSelect
                    value={project.status}
                    onChange={(v) => onChangeStatus(v as ProjectStatus)}
                    options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
                  />
                </Field>
                <div />
              </div>
              {project.notes ? (
                <div className="mt-4 whitespace-pre-wrap rounded-md border border-white/[0.06] bg-white/[0.015] p-3 text-[13px] leading-relaxed text-white/85">
                  {project.notes}
                </div>
              ) : null}
            </Card>
          )}

          <Card title="Aufgaben">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_auto]">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Titel der Aufgabe"
                className={inputCls}
              />
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className={inputCls}
              />
              <button
                type="button"
                onClick={onAddTask}
                className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
              >
                Anlegen
              </button>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {tasks.length === 0 ? (
                <li className="py-3 text-[12.5px] text-white/45">Keine Aufgaben.</li>
              ) : (
                tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="text-[13px] text-white">{t.title}</div>
                      <div className="text-[11.5px] text-white/45">
                        {t.dueDate ? `fällig ${formatDate(t.dueDate)}` : "ohne Termin"}
                      </div>
                    </div>
                    <TaskStatusBadge status={t.status} />
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Verknüpfungen">
            {customer ? (
              <Link
                to={`/portal/kunden/${customer.id}`}
                className="block rounded-md border border-white/[0.06] bg-white/[0.015] px-3 py-2 text-[12.5px] text-white hover:bg-white/[0.05]"
              >
                Kunde · {customer.companyName}
              </Link>
            ) : (
              <div className="rounded-md border border-dashed border-white/10 bg-white/[0.015] px-3 py-2 text-[12.5px] text-white/45">
                Kein Kunde verknüpft.
              </div>
            )}
            {lead ? (
              <Link
                to={`/portal/leads/${lead.id}`}
                className="mt-2 block rounded-md border border-white/[0.06] bg-white/[0.015] px-3 py-2 text-[12.5px] text-white hover:bg-white/[0.05]"
              >
                Quell-Lead · {lead.companyName}
              </Link>
            ) : null}
          </Card>

          <Card title="Meta">
            <dl className="grid gap-2 text-[12px] text-white/70">
              <DefRow label="Angelegt" value={formatDateTime(project.createdAt)} />
              <DefRow label="Aktualisiert" value={formatDateTime(project.updatedAt)} />
              <DefRow label="Start" value={project.startDate ? formatDate(project.startDate) : undefined} />
            </dl>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Projekt löschen?"
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
      <h2 className="mb-3 font-instrument text-lg text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

function DefRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">{label}</dt>
      <dd className="mt-0.5 text-white/85">{value ?? "—"}</dd>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { TaskStatusBadge } from "../components/StatusBadge";
import { PortalSelect, FilterBar } from "../components/FilterBar";
import { useStore, portalStore } from "../hooks/useStore";
import { TASK_PRIORITIES, type Task, type TaskPriority, type TaskStatus } from "../data/types";
import { classifyDue, formatDate } from "../components/format";

type Bucket = "all" | "today" | "overdue" | "upcoming" | "done";

const BUCKETS: { value: Bucket; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "today", label: "Heute" },
  { value: "overdue", label: "Überfällig" },
  { value: "upcoming", label: "Kommend" },
  { value: "done", label: "Erledigt" },
];

export default function TasksPage() {
  const { tasks, leads, customers, projects } = useStore((s) => ({
    tasks: s.getTasks(),
    leads: s.getLeads(),
    customers: s.getCustomers(),
    projects: s.getProjects(),
  }));

  const [bucket, setBucket] = useState<Bucket>("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        const due = classifyDue(t.dueDate);
        if (bucket === "today") return t.status === "Offen" && due === "today";
        if (bucket === "overdue") return t.status === "Offen" && due === "overdue";
        if (bucket === "upcoming")
          return t.status === "Offen" && (due === "soon" || due === "later");
        if (bucket === "done") return t.status === "Erledigt";
        return true;
      })
      .sort((a: Task, b: Task) => {
        if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return a.createdAt < b.createdAt ? -1 : 1;
      });
  }, [tasks, bucket]);

  const onCreate = () => {
    if (!title.trim()) return;
    portalStore.createTask({
      title: title.trim(),
      dueDate: dueDate || undefined,
      status: "Offen",
      priority,
    });
    setTitle("");
    setDueDate("");
    setPriority("Medium");
    setShowForm(false);
  };

  return (
    <>
      <PortalSeo title="Aufgaben" />
      <PageHeader
        eyebrow="Workflow"
        title="Aufgaben & Follow-ups"
        description="Standalone-Aufgaben oder Follow-ups, verknüpft mit Lead, Kunde oder Projekt."
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
          >
            Neue Aufgabe
          </button>
        }
      />

      {showForm ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="font-instrument text-lg text-white">Neue Aufgabe</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_140px_auto]">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              className={inputCls}
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputCls}
            />
            <PortalSelect
              value={priority}
              onChange={(v) => setPriority(v as TaskPriority)}
              options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
            <button
              type="button"
              onClick={onCreate}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Anlegen
            </button>
          </div>
        </section>
      ) : null}

      <FilterBar>
        {BUCKETS.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => setBucket(b.value)}
            className={`rounded-md px-3 py-1.5 text-[12px] transition ${
              bucket === b.value
                ? "bg-white text-black"
                : "border border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]"
            }`}
          >
            {b.label}
          </button>
        ))}
      </FilterBar>

      {tasks.length === 0 ? (
        <EmptyState
          title="Keine Aufgaben."
          description="Aufgaben entstehen aus Lead-Detail-Seiten oder werden hier direkt angelegt."
        />
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/45">
                <th className="px-3 py-2 text-left font-medium">Titel</th>
                <th className="px-3 py-2 text-left font-medium">Verknüpft mit</th>
                <th className="px-3 py-2 text-left font-medium">Fällig</th>
                <th className="px-3 py-2 text-left font-medium">Priorität</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const related =
                  (t.relatedLeadId &&
                    leads.find((l) => l.id === t.relatedLeadId) &&
                    {
                      to: `/portal/leads/${t.relatedLeadId}`,
                      label: `Lead · ${leads.find((l) => l.id === t.relatedLeadId)?.companyName}`,
                    }) ||
                  (t.relatedCustomerId &&
                    customers.find((c) => c.id === t.relatedCustomerId) &&
                    {
                      to: `/portal/kunden/${t.relatedCustomerId}`,
                      label: `Kunde · ${customers.find((c) => c.id === t.relatedCustomerId)?.companyName}`,
                    }) ||
                  (t.relatedProjectId &&
                    projects.find((p) => p.id === t.relatedProjectId) &&
                    {
                      to: `/portal/projekte/${t.relatedProjectId}`,
                      label: `Projekt · ${projects.find((p) => p.id === t.relatedProjectId)?.name}`,
                    }) ||
                  null;
                const due = classifyDue(t.dueDate);
                const dueClass =
                  due === "overdue"
                    ? "text-rose-300"
                    : due === "today"
                      ? "text-amber-200"
                      : "text-white/65";
                return (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                    <td className="px-3 py-2 text-white">{t.title}</td>
                    <td className="px-3 py-2">
                      {related ? (
                        <Link to={related.to} className="text-white/75 hover:text-white">
                          {related.label}
                        </Link>
                      ) : (
                        <span className="text-white/35">—</span>
                      )}
                    </td>
                    <td className={`px-3 py-2 ${dueClass}`}>
                      {t.dueDate ? formatDate(t.dueDate) : "—"}
                    </td>
                    <td className="px-3 py-2 text-white/75">{t.priority}</td>
                    <td className="px-3 py-2">
                      <TaskStatusBadge status={t.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <PortalSelect
                        value={t.status}
                        onChange={(v) =>
                          portalStore.setTaskStatus(t.id, v as TaskStatus)
                        }
                        options={[
                          { value: "Offen", label: "Offen" },
                          { value: "Erledigt", label: "Erledigt" },
                          { value: "Verschoben", label: "Verschoben" },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12.5px] text-white/45">
              Nichts in diesem Bucket.
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

const inputCls =
  "rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30";

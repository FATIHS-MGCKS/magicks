import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import {
  LeadGradeBadge,
  LeadStatusBadge,
  PriorityBadge,
  ScoreChip,
} from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PortalSelect } from "../components/FilterBar";
import { formatDate, formatDateTime, formatRelative } from "../components/format";
import { useStore, portalStore } from "../hooks/useStore";
import {
  ACTIVITY_CHANNELS,
  GOOGLE_CHECK_STATUSES,
  LEAD_STATUSES,
  PROJECT_TYPES,
  WEBSITE_CHECK_BUCKETS,
  type ActivityChannel,
  type GoogleCheckStatus,
  type LeadStatus,
  type ProjectType,
  type WebsiteCheckBucket,
} from "../data/types";
import { AutoCheckModal } from "../components/AutoCheckModal";

export default function LeadDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { lead, campaign, customer, projects, tasks } = useStore((s) => {
    const lead = s.getLead(id);
    return {
      lead,
      campaign: lead ? s.getCampaign(lead.campaignId) : undefined,
      customer: lead ? s.getCustomers().find((c) => c.sourceLeadId === lead.id) : undefined,
      projects: lead
        ? s.getProjects().filter((p) => p.sourceLeadId === lead.id)
        : [],
      tasks: lead
        ? s.getTasks().filter((t) => t.relatedLeadId === lead.id)
        : [],
    };
  });

  const settings = useStore((s) => s.getSettings());
  const geminiReady = !!settings.geminiApiKey;

  const [activityChannel, setActivityChannel] = useState<ActivityChannel>("Anruf");
  const [activityNote, setActivityNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Website");
  const [autoCheckOpen, setAutoCheckOpen] = useState(false);

  if (!lead) {
    return (
      <>
        <PortalSeo title="Lead nicht gefunden" />
        <PageHeader
          back={{ to: "/portal/leads", label: "Zurück zu Leads" }}
          title="Lead nicht gefunden"
          description="Der angeforderte Lead existiert nicht oder wurde gelöscht."
        />
      </>
    );
  }

  const onChangeStatus = (status: LeadStatus) => {
    portalStore.updateLead(lead.id, { status });
  };

  const onChangeWebsite = (bucket: WebsiteCheckBucket) => {
    portalStore.updateLead(lead.id, {
      websiteCheckBucket: bucket,
      websiteCheck: bucket === "Unbekannt" ? undefined : bucket,
    });
  };

  const onChangeGoogle = (next: GoogleCheckStatus) => {
    portalStore.updateLead(lead.id, { googleCheckStatus: next });
  };

  const onMarkGoogleChecked = () => {
    portalStore.updateLead(lead.id, { googleCheckStatus: "Geprüft" });
  };

  const onAddActivity = () => {
    if (!activityChannel) return;
    portalStore.addLeadActivity(lead.id, activityChannel, activityNote);
    setActivityNote("");
  };

  const onAddTask = () => {
    if (!taskTitle.trim()) return;
    portalStore.createTask({
      title: taskTitle.trim(),
      relatedLeadId: lead.id,
      dueDate: taskDate || undefined,
      status: "Offen",
      priority: "Medium",
    });
    setTaskTitle("");
    setTaskDate("");
  };

  const onCreateCustomer = () => {
    const created = portalStore.createCustomerFromLead(lead.id, {
      contactName: contactName.trim() || undefined,
    });
    if (created) navigate(`/portal/kunden/${created.id}`);
  };

  const onCreateProject = () => {
    if (!projectName.trim()) return;
    const created = portalStore.createProjectFromLead(lead.id, {
      name: projectName.trim(),
      projectType,
    });
    if (created) navigate(`/portal/projekte/${created.id}`);
  };

  const onArchive = () => {
    portalStore.updateLead(lead.id, { status: "Archiviert" });
    setConfirmArchive(false);
  };

  return (
    <>
      <PortalSeo title={lead.companyName} />
      <PageHeader
        back={{ to: "/portal/leads", label: "Zurück zu Leads" }}
        eyebrow={campaign?.name ? `Kampagne · ${campaign.name}` : "Lead"}
        title={lead.companyName}
        description={lead.city ? `${lead.city}${lead.industry ? ` · ${lead.industry}` : ""}` : lead.industry}
        actions={
          <>
            <button
              type="button"
              onClick={() => setAutoCheckOpen(true)}
              disabled={!geminiReady}
              title={
                geminiReady
                  ? "Gemini-Recherche mit Google-Suche starten"
                  : "Bitte unter Einstellungen → KI-Recherche einen Gemini-API-Key hinterlegen"
              }
              className="rounded-md border border-amber-300/30 bg-amber-300/[0.10] px-3 py-1.5 text-[12.5px] font-medium text-amber-100 transition hover:bg-amber-300/[0.18] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Auto-Check (Gemini)
            </button>
            <button
              type="button"
              onClick={() => setShowCustomerForm((v) => !v)}
              disabled={!!customer}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white disabled:opacity-50"
            >
              {customer ? "Kunde existiert" : "Kunde erstellen"}
            </button>
            <button
              type="button"
              onClick={() => setShowProjectForm((v) => !v)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/85 transition hover:bg-white/[0.08]"
            >
              Projekt anlegen
            </button>
            <button
              type="button"
              onClick={() => setConfirmArchive(true)}
              className="rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200 transition hover:bg-rose-400/[0.16]"
            >
              Archivieren
            </button>
          </>
        }
      />

      {/* Top-line status row ------------------------------------------ */}
      <section className="grid grid-cols-2 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 sm:grid-cols-4">
        <Stat label="Score">
          <ScoreChip score={lead.leadScore} />
        </Stat>
        <Stat label="Grade">
          <LeadGradeBadge grade={lead.leadGrade} />
        </Stat>
        <Stat label="Priorität">
          <PriorityBadge priority={lead.priority} />
        </Stat>
        <Stat label="Status">
          <LeadStatusBadge status={lead.status} />
        </Stat>
        <div className="col-span-2 sm:col-span-4 mt-1 border-t border-white/[0.06] pt-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">
                Next Best Step
              </div>
              <div className="mt-1 font-instrument text-xl text-white">
                {lead.nextBestStep}
              </div>
            </div>
            {lead.enrichedAt ? (
              <div
                className="flex items-center gap-2.5 rounded-md border border-amber-300/25 bg-amber-300/[0.06] px-3 py-1.5"
                title={`Letzter Auto-Check: ${formatDateTime(lead.enrichedAt)}`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-300/40 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300/85" />
                </span>
                <div>
                  <div className="text-[9.5px] uppercase tracking-[0.16em] text-amber-200/70">
                    Auto-Check
                  </div>
                  <div className="text-[12px] text-amber-100/95">
                    {formatRelative(lead.enrichedAt)}
                    {lead.pitchSuggestion ? " · Pitch verfügbar" : ""}
                  </div>
                </div>
              </div>
            ) : geminiReady ? (
              <div
                className="text-[11px] text-white/35"
                title="Auto-Check (Gemini) wurde für diesen Lead noch nicht ausgeführt."
              >
                Auto-Check noch nicht ausgeführt
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Inline customer-from-lead form */}
          {showCustomerForm && !customer ? (
            <Card title="Kunde aus Lead anlegen">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Ansprechperson (optional)">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={inputCls}
                    placeholder="z. B. Inhaber:in / Empfang"
                  />
                </Field>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onCreateCustomer}
                  className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
                >
                  Anlegen & öffnen
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
                >
                  Abbrechen
                </button>
              </div>
            </Card>
          ) : null}

          {showProjectForm ? (
            <Card title="Projekt aus Lead anlegen">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Projektname">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={inputCls}
                    placeholder={`Website ${lead.companyName}`}
                  />
                </Field>
                <Field label="Typ">
                  <PortalSelect
                    value={projectType}
                    onChange={(v) => setProjectType(v as ProjectType)}
                    options={PROJECT_TYPES.map((p) => ({ value: p, label: p }))}
                  />
                </Field>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onCreateProject}
                  className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
                >
                  Anlegen & öffnen
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
                >
                  Abbrechen
                </button>
              </div>
            </Card>
          ) : null}

          {/* Status / website / google check controls --------------- */}
          <Card title="Status & Prüfungen">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Lead-Status">
                <PortalSelect
                  value={lead.status}
                  onChange={(v) => onChangeStatus(v as LeadStatus)}
                  options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
                />
              </Field>
              <Field label="Web-Check">
                <PortalSelect
                  value={lead.websiteCheckBucket ?? "Unbekannt"}
                  onChange={(v) => onChangeWebsite(v as WebsiteCheckBucket)}
                  options={WEBSITE_CHECK_BUCKETS.map((b) => ({ value: b, label: b }))}
                />
              </Field>
              <Field label="Google-Check">
                <div className="flex items-center gap-2">
                  <PortalSelect
                    value={(lead.googleCheckStatus as GoogleCheckStatus) ?? "Nicht geprüft"}
                    onChange={(v) => onChangeGoogle(v as GoogleCheckStatus)}
                    options={GOOGLE_CHECK_STATUSES.map((g) => ({ value: g, label: g }))}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={onMarkGoogleChecked}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] text-white/75 hover:text-white"
                  >
                    Als geprüft markieren
                  </button>
                </div>
              </Field>
              <Field label="Follow-up am">
                <input
                  type="date"
                  value={lead.nextFollowUpAt?.slice(0, 10) ?? ""}
                  onChange={(e) =>
                    portalStore.updateLead(lead.id, {
                      nextFollowUpAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  className={inputCls}
                />
              </Field>
            </div>

            {lead.websiteCheck && lead.websiteCheck !== lead.websiteCheckBucket ? (
              <div className="mt-3 rounded-md border border-white/[0.06] bg-white/[0.015] p-3 text-[12px] leading-relaxed text-white/65">
                <div className="mb-1 text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                  Recherche-Notiz Web-Check
                </div>
                {lead.websiteCheck}
              </div>
            ) : null}
          </Card>

          {/* Pitch suggestion (only when present, e.g. after Auto-Check) */}
          {lead.pitchSuggestion ? (
            <Card title="Pitch-Vorschlag">
              <p className="text-[13.5px] leading-relaxed text-amber-50/95">
                {lead.pitchSuggestion}
              </p>
              {lead.enrichedAt ? (
                <div className="mt-2 text-[11px] text-white/35">
                  Aus Auto-Check vom {formatDateTime(lead.enrichedAt)}
                </div>
              ) : null}
            </Card>
          ) : null}

          {/* Contact / source / research --------------------------- */}
          <Card title="Kontakt & Quelle">
            <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
              <DefRow label="Telefon" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <DefRow label="E-Mail" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
              <DefRow label="Website" value={lead.website} href={lead.website ?? undefined} />
              <DefRow label="Adresse" value={lead.address} />
              <DefRow label="Öffnungszeiten" value={lead.openingHours} />
              <DefRow label="Entfernung" value={lead.distanceFromKassel} />
              <DefRow
                label="Quelle"
                value={lead.sourceUrl}
                href={lead.sourceUrl ?? undefined}
              />
              <DefRow label="Bewertungssignal" value={lead.ratingSignal} />
            </dl>
            {lead.social && Object.values(lead.social).some(Boolean) ? (
              <div className="mt-4 border-t border-white/[0.06] pt-3">
                <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                  Social Media
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["instagram", "Instagram"],
                      ["facebook", "Facebook"],
                      ["tiktok", "TikTok"],
                      ["linkedin", "LinkedIn"],
                      ["youtube", "YouTube"],
                    ] as const
                  ).map(([key, label]) => {
                    const url = lead.social?.[key];
                    if (!url) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[12px] text-white/85 hover:bg-white/[0.07]"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {lead.researchNote ? (
              <div className="mt-4 rounded-md border border-white/[0.06] bg-white/[0.015] p-3 text-[13px] leading-relaxed text-white/75">
                <div className="mb-1 text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                  Recherche-Hinweis
                </div>
                {lead.researchNote}
              </div>
            ) : null}
            {lead.assessment ? (
              <div className="mt-3 rounded-md border border-white/[0.06] bg-white/[0.015] p-3 text-[13px] leading-relaxed text-white/75">
                <div className="mb-1 text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                  Einschätzung
                </div>
                {lead.assessment}
              </div>
            ) : null}
          </Card>

          {/* Activity timeline ------------------------------------- */}
          <Card title="Aktivität">
            <div className="grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)_auto]">
              <PortalSelect
                value={activityChannel}
                onChange={(v) => setActivityChannel(v as ActivityChannel)}
                options={ACTIVITY_CHANNELS.map((c) => ({ value: c, label: c }))}
              />
              <input
                type="text"
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                placeholder="Notiz (optional)"
                className={inputCls}
              />
              <button
                type="button"
                onClick={onAddActivity}
                className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
              >
                Eintragen
              </button>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {lead.activities.length === 0 ? (
                <li className="py-3 text-[12.5px] text-white/45">Noch keine Aktivität.</li>
              ) : (
                lead.activities.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <div className="text-[13px] text-white">{a.channel}</div>
                      {a.note ? (
                        <div className="mt-0.5 max-w-prose text-[12.5px] text-white/65">
                          {a.note}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-[11.5px] text-white/40">
                      {formatDateTime(a.createdAt)}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Card>

          {/* Tasks ------------------------------------------------- */}
          <Card title="Folgeaufgaben">
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
                className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
              >
                Anlegen
              </button>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {tasks.length === 0 ? (
                <li className="py-3 text-[12.5px] text-white/45">Keine Aufgaben.</li>
              ) : (
                tasks.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-white">{t.title}</div>
                      <div className="text-[11.5px] text-white/45">
                        {t.dueDate ? `fällig ${formatDate(t.dueDate)}` : "ohne Termin"} · {t.status}
                      </div>
                    </div>
                    <PortalSelect
                      value={t.status}
                      onChange={(v) => portalStore.setTaskStatus(t.id, v as "Offen" | "Erledigt" | "Verschoben")}
                      options={[
                        { value: "Offen", label: "Offen" },
                        { value: "Erledigt", label: "Erledigt" },
                        { value: "Verschoben", label: "Verschoben" },
                      ]}
                    />
                  </li>
                ))
              )}
            </ul>
          </Card>

          {/* Raw metadata ----------------------------------------- */}
          {Object.keys(lead.rawMetadata).length > 0 ? (
            <Card title="Roh-Metadaten (CSV)">
              <dl className="grid gap-2 text-[12.5px] sm:grid-cols-2">
                {Object.entries(lead.rawMetadata).map(([k, v]) => (
                  <div key={k} className="rounded border border-white/[0.06] bg-white/[0.015] px-3 py-2">
                    <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">{k}</div>
                    <div className="mt-0.5 break-words text-white/75">{v}</div>
                  </div>
                ))}
              </dl>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-6">
          {/* Linked customer/projects */}
          <Card title="Verknüpfungen">
            <div className="space-y-2 text-[12.5px]">
              {customer ? (
                <Link
                  to={`/portal/kunden/${customer.id}`}
                  className="block rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-emerald-100 hover:bg-emerald-400/[0.12]"
                >
                  Kunde · {customer.companyName}
                </Link>
              ) : (
                <div className="rounded-md border border-dashed border-white/10 bg-white/[0.015] px-3 py-2 text-white/45">
                  Noch kein Kunde aus diesem Lead.
                </div>
              )}
              {projects.length > 0 ? (
                <ul className="space-y-1.5">
                  {projects.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/portal/projekte/${p.id}`}
                        className="block rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-white/85 hover:bg-white/[0.05]"
                      >
                        {p.name}
                        <span className="ml-2 text-white/40">{p.status}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-dashed border-white/10 bg-white/[0.015] px-3 py-2 text-white/45">
                  Noch kein Projekt aus diesem Lead.
                </div>
              )}
            </div>
          </Card>

          <Card title="Meta">
            <dl className="grid gap-2 text-[12px] text-white/70">
              <DefRow label="Angelegt" value={formatDateTime(lead.createdAt)} />
              <DefRow label="Aktualisiert" value={formatDateTime(lead.updatedAt)} />
              <DefRow
                label="Letzter Auto-Check"
                value={
                  lead.enrichedAt
                    ? `${formatRelative(lead.enrichedAt)} · ${formatDateTime(lead.enrichedAt)}`
                    : "Nie"
                }
              />
              <DefRow label="Lead-Status (CSV)" value={lead.leadStatusRaw} />
            </dl>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmArchive}
        title="Lead archivieren?"
        description="Der Lead wird auf 'Archiviert' gesetzt und verschwindet aus dem Standardfilter."
        destructive
        confirmLabel="Archivieren"
        onConfirm={onArchive}
        onCancel={() => setConfirmArchive(false)}
      />

      {autoCheckOpen ? (
        <AutoCheckModal lead={lead} onClose={() => setAutoCheckOpen(false)} />
      ) : null}
    </>
  );
}

const inputCls =
  "rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30";

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

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
          <a href={href} className="text-white underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
            {display}
          </a>
        ) : (
          display
        )}
      </dd>
    </div>
  );
}

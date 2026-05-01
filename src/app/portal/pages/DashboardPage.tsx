import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { LeadGradeBadge, PriorityBadge } from "../components/StatusBadge";
import { useStore } from "../hooks/useStore";
import { classifyDue, formatRelative } from "../components/format";

interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
  to?: string;
  emphasis?: boolean;
}

function MetricCard({ label, value, hint, to, emphasis }: MetricCardProps) {
  const inner = (
    <div
      className={`rounded-lg border p-4 transition ${
        emphasis
          ? "border-amber-300/25 bg-amber-300/[0.04] hover:bg-amber-300/[0.08]"
          : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </div>
      <div className="mt-2 font-instrument text-[2rem] leading-none text-white tabular-nums">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-[12px] text-white/45">{hint}</div>
      ) : null}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const { leads, customers, projects, campaigns, tasks } = useStore((s) => ({
    leads: s.getLeads(),
    customers: s.getCustomers(),
    projects: s.getProjects(),
    campaigns: s.getCampaigns(),
    tasks: s.getTasks(),
  }));

  const newLeads = leads.filter((l) => l.status === "Neu").length;
  const needGoogleCheck = leads.filter(
    (l) =>
      !l.googleCheckStatus ||
      /Nicht\s+(gepr|sep|sys)/i.test(l.googleCheckStatus),
  ).length;
  const hotLeads = leads.filter((l) => l.priority === "Hot").length;
  const followUpsToday = tasks.filter(
    (t) => t.status === "Offen" && classifyDue(t.dueDate) === "today",
  ).length;
  const overdueTasks = tasks.filter(
    (t) => t.status === "Offen" && classifyDue(t.dueDate) === "overdue",
  ).length;
  const activeProjects = projects.filter(
    (p) =>
      p.status !== "Abgeschlossen" &&
      p.status !== "Abgelehnt" &&
      p.status !== "Pausiert",
  ).length;

  // Top campaigns by lead count
  const campaignCounts = campaigns
    .map((c) => ({
      campaign: c,
      leadCount: leads.filter((l) => l.campaignId === c.id).length,
      hot: leads.filter((l) => l.campaignId === c.id && l.priority === "Hot")
        .length,
    }))
    .sort((a, b) => b.leadCount - a.leadCount)
    .slice(0, 5);

  // Top industries by lead count
  const industryCounts: Record<string, number> = {};
  for (const l of leads) {
    if (!l.industry) continue;
    industryCounts[l.industry] = (industryCounts[l.industry] ?? 0) + 1;
  }
  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent activity — flatten lead activities + lead createdAt
  const events = leads
    .flatMap((l) => [
      ...l.activities.map((a) => ({
        kind: "activity" as const,
        at: a.createdAt,
        leadId: l.id,
        company: l.companyName,
        label: `${a.channel}${a.note ? ` — ${a.note.slice(0, 70)}` : ""}`,
      })),
      {
        kind: "created" as const,
        at: l.createdAt,
        leadId: l.id,
        company: l.companyName,
        label: "Lead angelegt",
      },
    ])
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  const empty = leads.length === 0 && campaigns.length === 0;

  return (
    <>
      <PortalSeo title="Dashboard" />
      <PageHeader
        eyebrow="MAGICKS Portal"
        title="Übersicht"
        description="Stand der Pipeline auf einen Blick — Leads, Kampagnen, Folgeaufgaben."
        actions={
          <>
            <Link
              to="/portal/csv-import"
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
            >
              CSV importieren
            </Link>
            <Link
              to="/portal/leads"
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/80 transition hover:bg-white/[0.08]"
            >
              Alle Leads
            </Link>
          </>
        }
      />

      {empty ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.015] p-8">
          <h2 className="font-instrument text-2xl text-white">Noch keine Daten.</h2>
          <p className="mt-2 max-w-prose text-sm text-white/55">
            Lade eine Lead-CSV hoch, um die erste Kampagne anzulegen. Alles
            weitere — Scoring, Priorisierung, Next-Best-Step — passiert
            automatisch beim Import.
          </p>
          <div className="mt-5">
            <Link
              to="/portal/csv-import"
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[13px] font-medium text-black transition hover:bg-white"
            >
              CSV importieren
            </Link>
          </div>
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <MetricCard label="Leads gesamt" value={leads.length} to="/portal/leads" />
        <MetricCard label="Neue Leads" value={newLeads} to="/portal/leads" />
        <MetricCard
          label="Hot Leads"
          value={hotLeads}
          to="/portal/leads"
          emphasis={hotLeads > 0}
        />
        <MetricCard
          label="Google-Check offen"
          value={needGoogleCheck}
          to="/portal/leads"
        />
        <MetricCard
          label="Follow-ups heute"
          value={followUpsToday}
          to="/portal/aufgaben"
          emphasis={followUpsToday > 0}
        />
        <MetricCard
          label="Überfällig"
          value={overdueTasks}
          to="/portal/aufgaben"
          emphasis={overdueTasks > 0}
        />
        <MetricCard label="Aktive Projekte" value={activeProjects} to="/portal/projekte" />
        <MetricCard label="Kunden" value={customers.length} to="/portal/kunden" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="font-instrument text-lg text-white">Top-Kampagnen</h2>
            <Link to="/portal/kampagnen" className="text-[12px] text-white/45 hover:text-white">
              Alle ↗
            </Link>
          </header>
          {campaignCounts.length === 0 ? (
            <div className="p-4 text-sm text-white/45">Noch keine Kampagnen.</div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {campaignCounts.map((row) => (
                <li key={row.campaign.id} className="flex items-center justify-between px-4 py-3">
                  <Link
                    to={`/portal/kampagnen/${row.campaign.id}`}
                    className="min-w-0 flex-1 truncate text-sm text-white hover:text-white/80"
                  >
                    {row.campaign.name}
                  </Link>
                  <div className="ml-3 flex items-center gap-3 text-[12px] text-white/55 tabular-nums">
                    <span>
                      <span className="text-white/35">Leads</span> {row.leadCount}
                    </span>
                    <span className="text-amber-200/80">
                      <span className="text-white/35">Hot</span> {row.hot}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="font-instrument text-lg text-white">Top-Branchen</h2>
            <Link to="/portal/leads" className="text-[12px] text-white/45 hover:text-white">
              Filtern ↗
            </Link>
          </header>
          {topIndustries.length === 0 ? (
            <div className="p-4 text-sm text-white/45">Noch keine Branchen erfasst.</div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {topIndustries.map(([name, count]) => (
                <li key={name} className="flex items-center justify-between px-4 py-3">
                  <span className="truncate text-sm text-white">{name}</span>
                  <span className="text-[12px] text-white/55 tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-white/[0.08] bg-white/[0.02]">
        <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <h2 className="font-instrument text-lg text-white">Zuletzt passiert</h2>
        </header>
        {events.length === 0 ? (
          <div className="p-4 text-sm text-white/45">Noch keine Aktivität.</div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {events.map((e, i) => (
              <li
                key={`${e.leadId}-${e.at}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <Link
                  to={`/portal/leads/${e.leadId}`}
                  className="min-w-0 max-w-[55%] truncate text-sm text-white hover:text-white/80"
                >
                  <span className="text-white/45">{e.company}</span>{" "}
                  <span className="ml-1 text-white">— {e.label}</span>
                </Link>
                <span className="text-[11.5px] text-white/45">{formatRelative(e.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {hotLeads > 0 ? (
        <section className="mt-8 rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="font-instrument text-lg text-white">Heiße Leads</h2>
            <Link to="/portal/leads" className="text-[12px] text-white/45 hover:text-white">
              Alle ↗
            </Link>
          </header>
          <ul className="divide-y divide-white/[0.06]">
            {leads
              .filter((l) => l.priority === "Hot")
              .slice(0, 6)
              .map((l) => (
                <li
                  key={l.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <Link
                    to={`/portal/leads/${l.id}`}
                    className="min-w-0 truncate text-sm text-white hover:text-white/80"
                  >
                    {l.companyName}
                    <span className="ml-2 text-white/45">{l.city}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <LeadGradeBadge grade={l.leadGrade} />
                    <PriorityBadge priority={l.priority} />
                    <span className="text-[12px] text-white/55">{l.nextBestStep}</span>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

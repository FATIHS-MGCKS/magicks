import type {
  LeadGrade,
  LeadPriority,
  LeadStatus,
  ProjectStatus,
  TaskStatus,
} from "../data/types";

const baseClass =
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap";

const dotClass = "h-1.5 w-1.5 rounded-full";

interface BadgeProps {
  label: string;
  tone: "neutral" | "info" | "success" | "warn" | "danger" | "muted";
}

function ToneBadge({ label, tone }: BadgeProps) {
  const map: Record<BadgeProps["tone"], string> = {
    neutral: "border-white/10 bg-white/[0.04] text-white/80",
    info: "border-sky-400/20 bg-sky-400/[0.06] text-sky-200",
    success: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200",
    warn: "border-amber-400/25 bg-amber-400/[0.06] text-amber-200",
    danger: "border-rose-400/25 bg-rose-400/[0.06] text-rose-200",
    muted: "border-white/[0.06] bg-white/[0.02] text-white/45",
  };
  const dot: Record<BadgeProps["tone"], string> = {
    neutral: "bg-white/60",
    info: "bg-sky-300",
    success: "bg-emerald-300",
    warn: "bg-amber-300",
    danger: "bg-rose-300",
    muted: "bg-white/30",
  };
  return (
    <span className={`${baseClass} ${map[tone]}`}>
      <span className={`${dotClass} ${dot[tone]}`} />
      {label}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const tone: BadgeProps["tone"] =
    status === "Kunde geworden"
      ? "success"
      : status === "Interessiert"
        ? "info"
        : status === "Kontaktiert" || status === "Follow-up" || status === "Angebot angefragt"
          ? "warn"
          : status === "Kein Interesse" || status === "Archiviert"
            ? "muted"
            : "neutral";
  return <ToneBadge label={status} tone={tone} />;
}

export function LeadGradeBadge({ grade }: { grade: LeadGrade }) {
  const tone: BadgeProps["tone"] =
    grade === "A" ? "success" : grade === "B" ? "info" : grade === "C" ? "warn" : "muted";
  return <ToneBadge label={grade === "Unknown" ? "—" : grade} tone={tone} />;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const tone: BadgeProps["tone"] =
    status === "Abgeschlossen"
      ? "success"
      : status === "Abgelehnt" || status === "Pausiert"
        ? "muted"
        : status === "In Umsetzung" || status === "Review"
          ? "info"
          : status === "Angenommen"
            ? "success"
            : "neutral";
  return <ToneBadge label={status} tone={tone} />;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const tone: BadgeProps["tone"] =
    status === "Erledigt" ? "success" : status === "Verschoben" ? "muted" : "warn";
  return <ToneBadge label={status} tone={tone} />;
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const tone: BadgeProps["tone"] =
    priority === "Hot"
      ? "danger"
      : priority === "High"
        ? "warn"
        : priority === "Medium"
          ? "info"
          : priority === "Low"
            ? "neutral"
            : "muted";
  return <ToneBadge label={priority} tone={tone} />;
}

export function ScoreChip({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-ui text-[11px] tabular-nums text-white/80">
      <span className="text-white/45">Score</span>
      <span className="text-white">{score}</span>
    </span>
  );
}

import { useSyncStatus } from "../hooks/useSyncStatus";

interface TopBarProps {
  onLock: () => void;
  onToggleSidebar: () => void;
}

function relativeFromNow(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.round(diff / 1000);
  if (sec < 5) return "gerade eben";
  if (sec < 60) return `vor ${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `vor ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `vor ${hr} h`;
  return new Date(iso).toLocaleString("de-DE");
}

function SyncBadge() {
  const sync = useSyncStatus();

  let label = "Synchronisiert";
  let tone = "text-emerald-300/80 border-emerald-300/15 bg-emerald-300/[0.04]";
  let title = sync.lastSyncedAt
    ? `Letzter Sync: ${new Date(sync.lastSyncedAt).toLocaleString("de-DE")}`
    : "Noch nichts gespeichert";

  switch (sync.status) {
    case "saving":
      label = "Speichere…";
      tone = "text-sky-200/85 border-sky-300/20 bg-sky-300/[0.05]";
      break;
    case "saved":
    case "idle":
      label = `Gespeichert · ${relativeFromNow(sync.lastSyncedAt)}`;
      tone = "text-emerald-300/80 border-emerald-300/15 bg-emerald-300/[0.04]";
      break;
    case "offline":
      label = "Offline";
      tone = "text-amber-200/85 border-amber-300/25 bg-amber-300/[0.05]";
      title = sync.lastError ?? "Keine Server-Verbindung";
      break;
    case "error":
      label = "Sync-Fehler";
      tone = "text-rose-200/90 border-rose-300/25 bg-rose-300/[0.06]";
      title = sync.lastError ?? "Unbekannter Fehler";
      break;
  }

  return (
    <span
      className={`hidden rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-tight transition sm:inline-flex ${tone}`}
      title={title}
    >
      {label}
    </span>
  );
}

export function PortalTopBar({ onLock, onToggleSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#0B0B0D]/85 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
        aria-label="Menü öffnen"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
          <path
            d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="hidden text-[11px] uppercase tracking-[0.16em] text-white/45 lg:block">
        MAGICKS · Internes Portal
      </div>
      <div className="flex items-center gap-2">
        <SyncBadge />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/65 transition hover:text-white sm:block"
        >
          Öffentliche Seite ↗
        </a>
        <button
          type="button"
          onClick={onLock}
          className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/65 transition hover:text-white"
        >
          Sperren
        </button>
      </div>
    </header>
  );
}

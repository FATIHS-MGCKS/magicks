/**
 * One-shot migration UI: if the browser still carries the old
 * localStorage-only portal data, offer a single click to push it to the
 * server and wipe the local copy. Dismissing the banner sets a marker
 * so it doesn't reappear on every page.
 */
import { useEffect, useState } from "react";
import {
  clearLegacyLocalData,
  hasLegacyLocalData,
  portalStore,
  readLegacyLocalSnapshot,
} from "../data/store";
import { useStore } from "../hooks/useStore";

const DISMISSED_KEY = "magicks-portal:migration-dismissed";

export function MigrationBanner() {
  const leadCount = useStore((s) => s.getLeads().length);
  const campaignCount = useStore((s) => s.getCampaigns().length);
  const customerCount = useStore((s) => s.getCustomers().length);
  const projectCount = useStore((s) => s.getProjects().length);
  const taskCount = useStore((s) => s.getTasks().length);

  const serverHasData =
    leadCount + campaignCount + customerCount + projectCount + taskCount > 0;

  const [hasLegacy, setHasLegacy] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setHasLegacy(hasLegacyLocalData());
    try {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  if (done) {
    return (
      <div className="mb-4 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.05] px-4 py-3 text-[12.5px] text-emerald-100/90">
        Lokale Portal-Daten wurden erfolgreich auf den Server übertragen.
      </div>
    );
  }

  if (!hasLegacy || dismissed || serverHasData) return null;

  const localSnapshot = readLegacyLocalSnapshot();
  const localCounts = localSnapshot
    ? {
        leads: localSnapshot.leads.length,
        campaigns: localSnapshot.campaigns.length,
        customers: localSnapshot.customers.length,
        projects: localSnapshot.projects.length,
        tasks: localSnapshot.tasks.length,
      }
    : null;

  const upload = async () => {
    if (!localSnapshot) return;
    setBusy(true);
    setError(null);
    try {
      await portalStore.importSnapshot(localSnapshot);
      clearLegacyLocalData();
      setHasLegacy(false);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-300/25 bg-amber-300/[0.05] px-4 py-3.5 text-amber-100/90 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[12.5px] leading-relaxed">
        <div className="font-medium text-amber-100">
          Lokale Portal-Daten gefunden
        </div>
        <div className="text-amber-100/75">
          {localCounts
            ? `${localCounts.leads} Leads · ${localCounts.campaigns} Kampagnen · ${localCounts.customers} Kunden · ${localCounts.projects} Projekte · ${localCounts.tasks} Aufgaben`
            : "Aus früherer Browser-Speicherung."}{" "}
          Jetzt zum Server übertragen, damit alle Geräte denselben Stand sehen.
        </div>
        {error ? (
          <div className="mt-1 text-rose-200/90">{error}</div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md border border-amber-300/20 bg-transparent px-3 py-1.5 text-[12px] text-amber-100/70 transition hover:text-amber-100"
        >
          Später
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void upload()}
          className="rounded-md border border-amber-200/40 bg-amber-200/95 px-3 py-1.5 text-[12px] font-medium text-amber-950 transition hover:bg-amber-100 disabled:opacity-50"
        >
          {busy ? "Übertrage…" : "Jetzt übertragen"}
        </button>
      </div>
    </div>
  );
}

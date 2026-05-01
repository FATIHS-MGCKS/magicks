import { useRef, useState } from "react";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useStore, portalStore } from "../hooks/useStore";
import { PORTAL_SCHEMA_VERSION, type PortalSnapshot } from "../data/types";

export default function SettingsPage() {
  const settings = useStore((s) => s.getSettings());
  const fileRef = useRef<HTMLInputElement>(null);

  const [defaultRegion, setDefaultRegion] = useState(settings.defaultRegion);
  const [defaultSource, setDefaultSource] = useState(settings.defaultSource);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const onSaveDefaults = () => {
    portalStore.updateSettings({
      defaultRegion: defaultRegion.trim() || "Kassel & 50 km",
      defaultSource: defaultSource.trim() || "ChatGPT-Recherche",
    });
  };

  const onExport = () => {
    const snapshot = portalStore.exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
    a.download = `magicks-portal-backup-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    setImportError(null);
    setImportMessage(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as PortalSnapshot;
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.leads)) {
        setImportError("Ungültiges Backup-Format.");
        return;
      }
      if (parsed.schemaVersion && parsed.schemaVersion > PORTAL_SCHEMA_VERSION) {
        setImportError(
          `Backup-Version ${parsed.schemaVersion} ist neuer als die aktuelle Schema-Version ${PORTAL_SCHEMA_VERSION}.`,
        );
        return;
      }
      await portalStore.importSnapshot(parsed);
      setImportMessage(
        `Backup importiert: ${parsed.leads.length} Leads, ${parsed.campaigns?.length ?? 0} Kampagnen, ${parsed.customers?.length ?? 0} Kunden, ${parsed.projects?.length ?? 0} Projekte.`,
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Datei konnte nicht gelesen werden.";
      setImportError(message);
    }
  };

  const onClearAll = () => {
    void portalStore.clearAll().finally(() => setConfirmClear(false));
  };

  return (
    <>
      <PortalSeo title="Einstellungen" />
      <PageHeader
        eyebrow="Konfiguration"
        title="Einstellungen"
        description="Standardwerte, Backup und lokale Datenverwaltung."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Standardwerte">
          <p className="text-[12.5px] text-white/55">
            Werden beim CSV-Import als Vorbelegung für neue Kampagnen verwendet.
          </p>
          <div className="mt-4 grid gap-3">
            <Field label="Region (Default)">
              <input
                type="text"
                value={defaultRegion}
                onChange={(e) => setDefaultRegion(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Quelle (Default)">
              <input
                type="text"
                value={defaultSource}
                onChange={(e) => setDefaultSource(e.target.value)}
                className={inputCls}
              />
            </Field>
            <button
              type="button"
              onClick={onSaveDefaults}
              className="mt-1 self-start rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Speichern
            </button>
          </div>
        </Card>

        <Card title="Backup & Wiederherstellung">
          <p className="text-[12.5px] text-white/55">
            Gesamten Portal-Datenbestand als JSON exportieren oder ein bestehendes Backup
            wieder einspielen. Beim Import wird der aktuelle Bestand{" "}
            <strong className="text-white/85">vollständig ersetzt</strong>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExport}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Export (JSON)
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onImport(f);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/85 hover:bg-white/[0.08]"
            >
              Backup importieren
            </button>
          </div>
          {importMessage ? (
            <div className="mt-3 rounded-md border border-emerald-400/25 bg-emerald-400/[0.05] px-3 py-2 text-[12.5px] text-emerald-200">
              {importMessage}
            </div>
          ) : null}
          {importError ? (
            <div className="mt-3 rounded-md border border-rose-400/25 bg-rose-400/[0.06] px-3 py-2 text-[12.5px] text-rose-200">
              {importError}
            </div>
          ) : null}
        </Card>

        <Card title="Portal-Daten zurücksetzen">
          <p className="text-[12.5px] text-white/55">
            Leads, Kampagnen, Kunden, Projekte und Aufgaben werden in
            Supabase gelöscht. Diese Aktion ist sofort wirksam und kann
            nicht rückgängig gemacht werden — vorher Backup exportieren.
          </p>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200 hover:bg-rose-400/[0.16]"
          >
            Daten zurücksetzen
          </button>
        </Card>

        <Card title="Über">
          <dl className="grid gap-2 text-[12.5px] text-white/75">
            <Row label="Schema-Version" value={String(settings.schemaVersion)} />
            <Row
              label="Lead-Score"
              value="Hardcodierte Regeln (siehe data/scoring.ts)"
            />
            <Row label="Persistenz" value="Supabase Postgres (auto-sync)" />
            <Row label="Zugang" value="Supabase Magic-Link · RLS-Allowlist" />
          </dl>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Alle Portal-Daten zurücksetzen?"
        description="Leads, Kampagnen, Kunden, Projekte und Aufgaben werden in Supabase unwiderruflich gelöscht. Vorher unbedingt Backup exportieren!"
        destructive
        confirmLabel="Zurücksetzen"
        onConfirm={onClearAll}
        onCancel={() => setConfirmClear(false)}
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

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-2 last:border-b-0">
      <dt className="text-white/55">{label}</dt>
      <dd className="text-right text-white/85">{value}</dd>
    </div>
  );
}

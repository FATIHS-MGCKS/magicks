/**
 * High-level facade over the per-entity Repositories.
 *
 * Components only ever touch this object (or the `useStore` hook). It
 * is the only place that performs cross-entity work (createCustomerFromLead,
 * createProjectFromLead, etc.) and the only place that publishes change
 * events to subscribed React hooks.
 *
 * Persistence:
 *   - Reads are served from in-memory caches inside each Repository.
 *   - At startup, `hydrateFromServer()` pulls the canonical snapshot
 *     from `/api/portal/state` and fills those caches.
 *   - Every mutation triggers `scheduleServerSync()`, which debounces a
 *     PUT back to the server with the current full snapshot. If the
 *     server reports a 409 we re-hydrate to recover.
 */
import { newId, nowIso } from "./ids";
import { dedupeKey } from "./normalize";
import {
  PORTAL_STORAGE_PREFIX,
  Repository,
  setRepositoryMutationHook,
} from "./repository";
import { recomputeLead } from "./scoring";
import { getSupabase, supabaseConfigured } from "./supabase";
import {
  PORTAL_SCHEMA_VERSION,
  type Activity,
  type ActivityChannel,
  type Campaign,
  type Customer,
  type Lead,
  type LeadStatus,
  type PortalSettings,
  type PortalSnapshot,
  type Project,
  type ProjectStatus,
  type ProjectType,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "./types";

type Listener = () => void;

const SETTINGS_KEY = `${PORTAL_STORAGE_PREFIX}settings`;

const defaultSettings = (): PortalSettings => ({
  defaultRegion: "Kassel & 50 km",
  defaultSource: "ChatGPT-Recherche",
  schemaVersion: PORTAL_SCHEMA_VERSION,
  updatedAt: nowIso(),
});

let cachedSettings: PortalSettings = defaultSettings();

const settingsRepo = {
  read(): PortalSettings {
    return cachedSettings;
  },
  write(value: PortalSettings): void {
    cachedSettings = value;
  },
};

const leads = new Repository<Lead>("leads");
const campaigns = new Repository<Campaign>("campaigns");
const customers = new Repository<Customer>("customers");
const projects = new Repository<Project>("projects");
const tasks = new Repository<Task>("tasks");

const listeners = new Set<Listener>();

function bumpVersion(): void {
  for (const l of listeners) l();
}

// --- Server sync state ------------------------------------------------

export type SyncStatus = "idle" | "saving" | "saved" | "error" | "offline";

interface SyncState {
  status: SyncStatus;
  serverVersion: number;
  lastSyncedAt: string | null;
  lastError: string | null;
}

let syncState: SyncState = {
  status: "idle",
  serverVersion: 0,
  lastSyncedAt: null,
  lastError: null,
};

const syncListeners = new Set<(state: SyncState) => void>();

function setSyncState(patch: Partial<SyncState>): void {
  syncState = { ...syncState, ...patch };
  for (const l of syncListeners) l(syncState);
}

function buildSnapshot(): PortalSnapshot {
  return {
    schemaVersion: PORTAL_SCHEMA_VERSION,
    exportedAt: nowIso(),
    leads: leads.list(),
    campaigns: campaigns.list(),
    customers: customers.list(),
    projects: projects.list(),
    tasks: tasks.list(),
    settings: settingsRepo.read(),
  };
}

let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let inFlight = false;
let dirtySinceLastFlush = false;
let hydrated = false;

const SYNC_DEBOUNCE_MS = 600;

function scheduleServerSync(): void {
  bumpVersion();
  if (!hydrated) return;
  dirtySinceLastFlush = true;
  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    void flushSync();
  }, SYNC_DEBOUNCE_MS);
}

interface WriteStateRow {
  version: number;
  updated_at: string;
}

async function flushSync(): Promise<void> {
  if (inFlight) return;
  if (!dirtySinceLastFlush) return;
  if (!supabaseConfigured) {
    setSyncState({
      status: "error",
      lastError:
        "Supabase nicht konfiguriert — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY fehlen.",
    });
    return;
  }

  inFlight = true;
  dirtySinceLastFlush = false;
  setSyncState({ status: "saving", lastError: null });

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("write_portal_state", {
      new_snapshot: buildSnapshot(),
      expected_version: syncState.serverVersion,
    });

    if (error) throw error;

    // Conflict — RPC returned an empty set because the stored version
    // moved on under us (another tab/device wrote first). Reload and
    // let the next mutation push fresh.
    const row = Array.isArray(data) ? (data[0] as WriteStateRow | undefined) : undefined;
    if (!row) {
      console.warn("[portal] supabase snapshot newer, rehydrating");
      await hydrateFromServer();
      setSyncState({ status: "saved", lastError: null });
      return;
    }

    setSyncState({
      status: "saved",
      serverVersion: row.version,
      lastSyncedAt: row.updated_at,
      lastError: null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Sync fehlgeschlagen.";
    const offline = typeof navigator !== "undefined" && navigator.onLine === false;
    setSyncState({
      status: offline ? "offline" : "error",
      lastError: message,
    });
    dirtySinceLastFlush = true;
  } finally {
    inFlight = false;
    if (dirtySinceLastFlush) {
      pendingTimer = setTimeout(() => {
        void flushSync();
      }, SYNC_DEBOUNCE_MS);
    }
  }
}

setRepositoryMutationHook(scheduleServerSync);

/**
 * Loads the canonical snapshot from Supabase and replaces all caches.
 * Call this once after a successful login. Subsequent mutations will
 * be pushed back automatically (debounced).
 */
export async function hydrateFromServer(): Promise<void> {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase nicht konfiguriert — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY fehlen.",
    );
  }
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("portal_state")
    .select("snapshot, version, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;

  const snap = (data?.snapshot as PortalSnapshot | null) ?? null;
  const version = (data?.version as number | undefined) ?? 0;
  const updatedAt = (data?.updated_at as string | undefined) ?? null;

  leads.replaceAll(snap?.leads ?? [], true);
  campaigns.replaceAll(snap?.campaigns ?? [], true);
  customers.replaceAll(snap?.customers ?? [], true);
  projects.replaceAll(snap?.projects ?? [], true);
  tasks.replaceAll(snap?.tasks ?? [], true);
  cachedSettings = snap?.settings ?? defaultSettings();

  hydrated = true;
  dirtySinceLastFlush = false;
  setSyncState({
    status: "idle",
    serverVersion: version,
    lastSyncedAt: updatedAt,
    lastError: null,
  });
  bumpVersion();
}

/** Drops cached data and forces a fresh hydration on next call. */
export function resetHydration(): void {
  hydrated = false;
  leads.replaceAll([], true);
  campaigns.replaceAll([], true);
  customers.replaceAll([], true);
  projects.replaceAll([], true);
  tasks.replaceAll([], true);
  cachedSettings = defaultSettings();
  dirtySinceLastFlush = false;
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  setSyncState({
    status: "idle",
    serverVersion: 0,
    lastSyncedAt: null,
    lastError: null,
  });
  bumpVersion();
}

/** True once the initial server hydration finished. */
export function isHydrated(): boolean {
  return hydrated;
}

export function subscribeToSync(listener: (state: SyncState) => void): () => void {
  syncListeners.add(listener);
  listener(syncState);
  return () => syncListeners.delete(listener);
}

export function getSyncState(): SyncState {
  return syncState;
}

/** Forces an immediate flush. Returns the active sync promise. */
export async function flushNow(): Promise<void> {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  await flushSync();
}

// --- Local-data migration helpers (one-shot, used by MigrationBanner) -

/** True if any old localStorage portal slice still exists in this browser. */
export function hasLegacyLocalData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const keys = ["leads", "campaigns", "customers", "projects", "tasks"];
    for (const k of keys) {
      const raw = window.localStorage.getItem(`${PORTAL_STORAGE_PREFIX}${k}`);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    }
  } catch {
    // ignore
  }
  return false;
}

/** Returns whatever legacy snapshot we can reconstruct from localStorage. */
export function readLegacyLocalSnapshot(): PortalSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const read = <T>(key: string): T[] => {
      const raw = window.localStorage.getItem(`${PORTAL_STORAGE_PREFIX}${key}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    };
    const settingsRaw = window.localStorage.getItem(`${PORTAL_STORAGE_PREFIX}settings`);
    const settings = settingsRaw
      ? (JSON.parse(settingsRaw) as PortalSettings)
      : defaultSettings();
    return {
      schemaVersion: PORTAL_SCHEMA_VERSION,
      exportedAt: nowIso(),
      leads: read<Lead>("leads"),
      campaigns: read<Campaign>("campaigns"),
      customers: read<Customer>("customers"),
      projects: read<Project>("projects"),
      tasks: read<Task>("tasks"),
      settings,
    };
  } catch {
    return null;
  }
}

/** Removes all legacy localStorage entries created by the MVP build. */
export function clearLegacyLocalData(): void {
  if (typeof window === "undefined") return;
  try {
    const keys = [
      "leads",
      "campaigns",
      "customers",
      "projects",
      "tasks",
      "settings",
    ];
    for (const k of keys) {
      window.localStorage.removeItem(`${PORTAL_STORAGE_PREFIX}${k}`);
    }
  } catch {
    // ignore
  }
}

// --- Mutation API (unchanged surface for existing pages) --------------

export interface BulkLeadUpdate {
  status?: LeadStatus;
  campaignId?: string;
  archive?: boolean;
  markGoogleCheckNeeded?: boolean;
}

export interface CreateLeadInput {
  companyName: string;
  city: string;
  campaignId: string;
  distanceFromKassel?: string;
  industry?: string;
  serviceArea?: string;
  phone?: string;
  email?: string;
  website?: string;
  ratingSignal?: string;
  websiteCheck?: string;
  googleCheckStatus?: string;
  leadStatusRaw?: string;
  status?: LeadStatus;
  sourceUrl?: string;
  researchNote?: string;
  assessment?: string;
  rawMetadata?: Record<string, string>;
}

export const portalStore = {
  // --- Subscriptions ---------------------------------------------------
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // --- Reads -----------------------------------------------------------
  getLeads(): Lead[] {
    return leads.list();
  },
  getLead(id: string): Lead | undefined {
    return leads.get(id);
  },
  getCampaigns(): Campaign[] {
    return campaigns.list();
  },
  getCampaign(id: string): Campaign | undefined {
    return campaigns.get(id);
  },
  getCustomers(): Customer[] {
    return customers.list();
  },
  getCustomer(id: string): Customer | undefined {
    return customers.get(id);
  },
  getProjects(): Project[] {
    return projects.list();
  },
  getProject(id: string): Project | undefined {
    return projects.get(id);
  },
  getTasks(): Task[] {
    return tasks.list();
  },
  getTask(id: string): Task | undefined {
    return tasks.get(id);
  },
  getSettings(): PortalSettings {
    return settingsRepo.read();
  },

  // --- Settings --------------------------------------------------------
  updateSettings(patch: Partial<PortalSettings>): PortalSettings {
    const current = settingsRepo.read();
    const next: PortalSettings = {
      ...current,
      ...patch,
      schemaVersion: PORTAL_SCHEMA_VERSION,
      updatedAt: nowIso(),
    };
    settingsRepo.write(next);
    scheduleServerSync();
    return next;
  },

  // --- Campaigns -------------------------------------------------------
  createCampaign(
    input: Omit<Campaign, "id" | "importedAt" | "createdAt" | "updatedAt">,
  ): Campaign {
    const at = nowIso();
    const campaign: Campaign = {
      id: newId(),
      importedAt: at,
      createdAt: at,
      updatedAt: at,
      ...input,
    };
    campaigns.upsert(campaign);
    return campaign;
  },

  updateCampaign(id: string, patch: Partial<Campaign>): Campaign | undefined {
    const current = campaigns.get(id);
    if (!current) return undefined;
    const next: Campaign = {
      ...current,
      ...patch,
      id: current.id,
      importedAt: current.importedAt,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    campaigns.upsert(next);
    return next;
  },

  deleteCampaign(id: string): void {
    campaigns.remove(id);
  },

  // --- Leads -----------------------------------------------------------
  createLead(input: CreateLeadInput): Lead {
    const at = nowIso();
    const seed: Lead = {
      id: newId(),
      campaignId: input.campaignId,
      companyName: input.companyName.trim(),
      city: input.city.trim(),
      distanceFromKassel: input.distanceFromKassel,
      industry: input.industry,
      serviceArea: input.serviceArea,
      phone: input.phone,
      email: input.email,
      website: input.website,
      ratingSignal: input.ratingSignal,
      websiteCheck: input.websiteCheck,
      googleCheckStatus: input.googleCheckStatus,
      leadStatusRaw: input.leadStatusRaw,
      sourceUrl: input.sourceUrl,
      researchNote: input.researchNote,
      assessment: input.assessment,
      status: input.status ?? "Neu",
      leadGrade: "Unknown",
      leadScore: 0,
      priority: "Low",
      nextBestStep: "Lead prüfen",
      activities: [],
      rawMetadata: input.rawMetadata ?? {},
      createdAt: at,
      updatedAt: at,
    };
    const computed = recomputeLead(seed);
    leads.upsert(computed);
    return computed;
  },

  importLeads(rows: CreateLeadInput[]): Lead[] {
    if (rows.length === 0) return [];
    const at = nowIso();
    const created: Lead[] = rows.map((input) => {
      const seed: Lead = {
        id: newId(),
        campaignId: input.campaignId,
        companyName: input.companyName.trim(),
        city: input.city.trim(),
        distanceFromKassel: input.distanceFromKassel,
        industry: input.industry,
        serviceArea: input.serviceArea,
        phone: input.phone,
        email: input.email,
        website: input.website,
        ratingSignal: input.ratingSignal,
        websiteCheck: input.websiteCheck,
        googleCheckStatus: input.googleCheckStatus,
        leadStatusRaw: input.leadStatusRaw,
        sourceUrl: input.sourceUrl,
        researchNote: input.researchNote,
        assessment: input.assessment,
        status: input.status ?? "Neu",
        leadGrade: "Unknown",
        leadScore: 0,
        priority: "Low",
        nextBestStep: "Lead prüfen",
        activities: [],
        rawMetadata: input.rawMetadata ?? {},
        createdAt: at,
        updatedAt: at,
      };
      return recomputeLead(seed);
    });
    leads.upsertMany(created);
    return created;
  },

  updateLead(id: string, patch: Partial<Lead>): Lead | undefined {
    const current = leads.get(id);
    if (!current) return undefined;
    const merged: Lead = {
      ...current,
      ...patch,
      id: current.id,
      campaignId: patch.campaignId ?? current.campaignId,
      activities: patch.activities ?? current.activities,
      rawMetadata: patch.rawMetadata ?? current.rawMetadata,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    const next = recomputeLead(merged);
    leads.upsert(next);
    return next;
  },

  bulkUpdateLeads(ids: string[], patch: BulkLeadUpdate): void {
    if (ids.length === 0) return;
    const list = leads.list().slice();
    const idSet = new Set(ids);
    const at = nowIso();
    let touched = 0;
    for (let i = 0; i < list.length; i += 1) {
      const lead = list[i];
      if (!idSet.has(lead.id)) continue;
      let next: Lead = { ...lead, updatedAt: at };
      if (patch.status) next.status = patch.status;
      if (patch.campaignId) next.campaignId = patch.campaignId;
      if (patch.archive) next.status = "Archiviert";
      if (patch.markGoogleCheckNeeded) next.googleCheckStatus = "Nicht geprüft";
      next = recomputeLead(next);
      list[i] = next;
      touched += 1;
    }
    if (touched > 0) {
      leads.replaceAll(list);
    }
  },

  addLeadActivity(
    id: string,
    channel: ActivityChannel,
    note?: string,
  ): Lead | undefined {
    const current = leads.get(id);
    if (!current) return undefined;
    const activity: Activity = {
      id: newId(),
      channel,
      note: note?.trim() ? note.trim() : undefined,
      createdAt: nowIso(),
    };
    return this.updateLead(id, {
      activities: [activity, ...current.activities],
    });
  },

  deleteLead(id: string): void {
    leads.remove(id);
  },

  /** Returns existing lead ids that match the given dedupe key. */
  findDuplicates(
    companyName: string | undefined,
    city: string | undefined,
    phone: string | undefined,
  ): Lead[] {
    const target = dedupeKey(companyName, city, phone);
    if (!target) return [];
    return leads
      .list()
      .filter((l) => dedupeKey(l.companyName, l.city, l.phone) === target);
  },

  // --- Customers -------------------------------------------------------
  createCustomer(input: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
    const at = nowIso();
    const customer: Customer = {
      id: newId(),
      ...input,
      createdAt: at,
      updatedAt: at,
    };
    customers.upsert(customer);
    return customer;
  },

  updateCustomer(id: string, patch: Partial<Customer>): Customer | undefined {
    const current = customers.get(id);
    if (!current) return undefined;
    const next: Customer = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    customers.upsert(next);
    return next;
  },

  deleteCustomer(id: string): void {
    customers.remove(id);
  },

  /** Creates a Customer from a Lead and flips the lead status to "Kunde geworden". */
  createCustomerFromLead(leadId: string, overrides?: Partial<Customer>): Customer | undefined {
    const lead = leads.get(leadId);
    if (!lead) return undefined;
    const customer = this.createCustomer({
      companyName: overrides?.companyName ?? lead.companyName,
      contactName: overrides?.contactName,
      phone: overrides?.phone ?? lead.phone,
      email: overrides?.email ?? lead.email,
      website: overrides?.website ?? lead.website,
      city: overrides?.city ?? lead.city,
      address: overrides?.address,
      industry: overrides?.industry ?? lead.industry,
      sourceLeadId: lead.id,
      notes: overrides?.notes,
    });
    this.updateLead(lead.id, { status: "Kunde geworden" });
    return customer;
  },

  // --- Projects --------------------------------------------------------
  createProject(input: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const at = nowIso();
    const project: Project = {
      id: newId(),
      ...input,
      createdAt: at,
      updatedAt: at,
    };
    projects.upsert(project);
    return project;
  },

  updateProject(id: string, patch: Partial<Project>): Project | undefined {
    const current = projects.get(id);
    if (!current) return undefined;
    const next: Project = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    projects.upsert(next);
    return next;
  },

  deleteProject(id: string): void {
    projects.remove(id);
  },

  createProjectFromLead(
    leadId: string,
    input: { name: string; projectType: ProjectType; status?: ProjectStatus },
  ): Project | undefined {
    const lead = leads.get(leadId);
    if (!lead) return undefined;
    return this.createProject({
      name: input.name,
      sourceLeadId: lead.id,
      projectType: input.projectType,
      status: input.status ?? "Anfrage",
    });
  },

  createProjectFromCustomer(
    customerId: string,
    input: { name: string; projectType: ProjectType; status?: ProjectStatus },
  ): Project | undefined {
    const customer = customers.get(customerId);
    if (!customer) return undefined;
    return this.createProject({
      name: input.name,
      customerId: customer.id,
      projectType: input.projectType,
      status: input.status ?? "Anfrage",
    });
  },

  // --- Tasks -----------------------------------------------------------
  createTask(input: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const at = nowIso();
    const task: Task = {
      id: newId(),
      ...input,
      createdAt: at,
      updatedAt: at,
    };
    tasks.upsert(task);
    return task;
  },

  updateTask(id: string, patch: Partial<Task>): Task | undefined {
    const current = tasks.get(id);
    if (!current) return undefined;
    const next: Task = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    tasks.upsert(next);
    return next;
  },

  setTaskStatus(id: string, status: TaskStatus): Task | undefined {
    return this.updateTask(id, { status });
  },

  setTaskPriority(id: string, priority: TaskPriority): Task | undefined {
    return this.updateTask(id, { priority });
  },

  deleteTask(id: string): void {
    tasks.remove(id);
  },

  // --- Snapshot / backup ----------------------------------------------
  exportSnapshot(): PortalSnapshot {
    return buildSnapshot();
  },

  async importSnapshot(snapshot: PortalSnapshot): Promise<void> {
    if (!supabaseConfigured) {
      throw new Error("Supabase nicht konfiguriert.");
    }
    leads.replaceAll(snapshot.leads ?? [], true);
    campaigns.replaceAll(snapshot.campaigns ?? [], true);
    customers.replaceAll(snapshot.customers ?? [], true);
    projects.replaceAll(snapshot.projects ?? [], true);
    tasks.replaceAll(snapshot.tasks ?? [], true);
    if (snapshot.settings) settingsRepo.write(snapshot.settings);
    bumpVersion();

    const supabase = getSupabase();
    // Force-write: pass null expected_version so the RPC always succeeds.
    const { data, error } = await supabase.rpc("write_portal_state", {
      new_snapshot: buildSnapshot(),
      expected_version: null,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? (data[0] as WriteStateRow | undefined) : undefined;
    if (row) {
      setSyncState({
        status: "saved",
        serverVersion: row.version,
        lastSyncedAt: row.updated_at,
        lastError: null,
      });
    }
  },

  async clearAll(): Promise<void> {
    if (!supabaseConfigured) {
      throw new Error("Supabase nicht konfiguriert.");
    }
    const empty: PortalSnapshot = {
      schemaVersion: PORTAL_SCHEMA_VERSION,
      exportedAt: nowIso(),
      leads: [],
      campaigns: [],
      customers: [],
      projects: [],
      tasks: [],
      settings: defaultSettings(),
    };
    leads.replaceAll([], true);
    campaigns.replaceAll([], true);
    customers.replaceAll([], true);
    projects.replaceAll([], true);
    tasks.replaceAll([], true);
    cachedSettings = empty.settings;
    bumpVersion();

    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("write_portal_state", {
      new_snapshot: empty,
      expected_version: null,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? (data[0] as WriteStateRow | undefined) : undefined;
    if (row) {
      setSyncState({
        status: "saved",
        serverVersion: row.version,
        lastSyncedAt: row.updated_at,
        lastError: null,
      });
    }
  },
};

export type PortalStore = typeof portalStore;

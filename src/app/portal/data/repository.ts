/**
 * In-memory repository used by every entity slice.
 *
 * The persistence backend is NOT localStorage anymore — the canonical
 * copy lives in SQLite on the server. The Frontend keeps an in-memory
 * cache for synchronous reads (so all existing components keep working
 * unchanged), and `store.ts` registers a sync hook here so each
 * mutation triggers a debounced snapshot push to the server.
 *
 * The portal bootstrap (see `store.ts#hydrateFromServer`) calls
 * `Repository.replaceAll()` once at start-up to fill every cache from
 * the server snapshot.
 *
 * If the bundle ever runs without a Frontend mount (SSR, smoketests),
 * everything still works: the caches just stay empty.
 */

const STORAGE_PREFIX = "magicks-portal:v1:";

export interface RepositoryEntity {
  id: string;
}

let onMutate: (() => void) | null = null;

/** Called by `store.ts` to wire mutations into the server-sync pipeline. */
export function setRepositoryMutationHook(hook: () => void): void {
  onMutate = hook;
}

function notifyMutation(): void {
  if (onMutate) onMutate();
}

export class Repository<T extends RepositoryEntity> {
  private readonly storageKey: string;
  private cache: T[] = [];

  constructor(name: string) {
    this.storageKey = `${STORAGE_PREFIX}${name}`;
  }

  list(): T[] {
    return this.cache;
  }

  get(id: string): T | undefined {
    return this.cache.find((item) => item.id === id);
  }

  /**
   * Bulk replace, used both by mutations (which subsequently call
   * `notifyMutation`) and by the bootstrap hydrator. The optional
   * `silent` flag skips the mutation hook so initial hydration doesn't
   * trigger a redundant push back to the server.
   */
  replaceAll(items: T[], silent = false): void {
    this.cache = [...items];
    if (!silent) notifyMutation();
  }

  upsert(item: T): T {
    const idx = this.cache.findIndex((entry) => entry.id === item.id);
    if (idx >= 0) {
      this.cache = [
        ...this.cache.slice(0, idx),
        item,
        ...this.cache.slice(idx + 1),
      ];
    } else {
      this.cache = [item, ...this.cache];
    }
    notifyMutation();
    return item;
  }

  upsertMany(items: T[]): T[] {
    if (items.length === 0) return [];
    const map = new Map(this.cache.map((entry) => [entry.id, entry] as const));
    for (const item of items) {
      map.set(item.id, item);
    }
    this.cache = Array.from(map.values());
    notifyMutation();
    return items;
  }

  remove(id: string): void {
    this.cache = this.cache.filter((item) => item.id !== id);
    notifyMutation();
  }

  clear(): void {
    this.cache = [];
    notifyMutation();
  }

  /** Used by the local-data migration helper. */
  get internalStorageKey(): string {
    return this.storageKey;
  }
}

export const PORTAL_STORAGE_PREFIX = STORAGE_PREFIX;

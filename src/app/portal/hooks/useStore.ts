/**
 * useStore — React hook for subscribing to portal data changes.
 *
 * Wraps `React.useSyncExternalStore` so every component that reads a
 * slice (leads, campaigns, …) re-renders whenever the store mutates.
 *
 * A single global version counter is incremented every time the store
 * notifies listeners; React calls `getSnapshot()` afterwards to detect
 * the change. The selector keeps rerender granularity to a minimum.
 */
import { useSyncExternalStore } from "react";
import { portalStore, type PortalStore } from "../data/store";

let version = 0;

const subscribe = (cb: () => void): (() => void) => {
  return portalStore.subscribe(() => {
    version += 1;
    cb();
  });
};

const getSnapshot = (): number => version;

/** Returns a typed selection from the store. The selector re-runs on every change. */
export function useStore<T>(selector: (store: PortalStore) => T): T {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector(portalStore);
}

export { portalStore };

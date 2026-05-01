/**
 * Subscribes to the server-sync status published by the store. Used by
 * the TopBar indicator and the Settings page to surface "Saving…",
 * "Saved", "Offline", and conflict-recovery messages.
 */
import { useEffect, useState } from "react";
import { getSyncState, subscribeToSync, type SyncStatus } from "../data/store";

export interface SyncStateView {
  status: SyncStatus;
  serverVersion: number;
  lastSyncedAt: string | null;
  lastError: string | null;
}

export function useSyncStatus(): SyncStateView {
  const [state, setState] = useState<SyncStateView>(() => getSyncState());
  useEffect(() => subscribeToSync(setState), []);
  return state;
}

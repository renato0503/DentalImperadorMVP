import { useState, useCallback, useRef, useEffect } from "react";

export type SyncEntity = "products" | "clients" | "stock" | "tech-sheets" | "all";

export interface SyncLogEntry {
  id: string;
  entity: string;
  status: "queued" | "running" | "completed" | "failed";
  startedAt: string;
  finishedAt: string | null;
  result: {
    success: boolean;
    entity: string;
    recordsProcessed: number;
    recordsUpdated: number;
    recordsCreated: number;
    errors: string[];
    durationMs: number;
  } | null;
  error: string | null;
}

export interface SyncState {
  loading: boolean;
  entry: SyncLogEntry | null;
  error: string | null;
}

export function useSync() {
  const [states, setStates] = useState<Record<SyncEntity, SyncState>>({
    products: { loading: false, entry: null, error: null },
    clients: { loading: false, entry: null, error: null },
    stock: { loading: false, entry: null, error: null },
    "tech-sheets": { loading: false, entry: null, error: null },
    all: { loading: false, entry: null, error: null },
  });

  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  const pollStatus = useCallback((entity: SyncEntity, syncId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/flextotal/sync/status/${syncId}`);
        if (!res.ok) {
          clearInterval(interval);
          return;
        }
        const entry: SyncLogEntry = await res.json();

        if (!mountedRef.current) {
          clearInterval(interval);
          return;
        }

        setStates((prev) => ({
          ...prev,
          [entity]: { loading: entry.status === "queued" || entry.status === "running", entry, error: null },
        }));

        if (entry.status === "completed" || entry.status === "failed") {
          clearInterval(interval);
          delete intervalsRef.current[syncId];
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);

    intervalsRef.current[syncId] = interval;
  }, []);

  const runSync = useCallback(async (entity: SyncEntity) => {
    setStates((prev) => ({ ...prev, [entity]: { loading: true, entry: null, error: null } }));

    try {
      const res = await fetch(`/api/v1/flextotal/sync/${entity}`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        setStates((prev) => ({ ...prev, [entity]: { loading: false, entry: null, error: text } }));
        return;
      }

      const { syncId } = await res.json();
      pollStatus(entity, syncId);
    } catch (err) {
      setStates((prev) => ({ ...prev, [entity]: { loading: false, entry: null, error: (err as Error).message } }));
    }
  }, [pollStatus]);

  const reset = useCallback((entity: SyncEntity) => {
    setStates((prev) => ({ ...prev, [entity]: { loading: false, entry: null, error: null } }));
  }, []);

  return { states, runSync, reset };
}

import { useState, useCallback } from "react";
import { showToast } from "../lib/toast";

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

export function useSyncStatus() {
  const [statuses, setStatuses] = useState<Record<string, SyncLogEntry | null>>({});
  const [loading, setLoading] = useState(false);

  const fetchLastSync = useCallback(async (entity: string) => {
    try {
      const res = await fetch(`/api/v1/flextotal/sync/last/${entity}`);
      if (!res.ok) return;
      const entry: SyncLogEntry = await res.json();
      setStatuses((prev) => ({ ...prev, [entity]: entry }));
    } catch {
      // silencioso
    }
  }, []);

  const triggerSync = useCallback(async (entity: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/flextotal/sync/${entity}`, { method: "POST" });
      if (!res.ok) return false;
      const { syncId } = await res.json();
      return syncId;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { statuses, loading, fetchLastSync, triggerSync };
}

export function formatDuration(ms: number): string {
  if (ms > 60000) return `${(ms / 60000).toFixed(1)}min`;
  if (ms > 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function formatSyncTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const hoje = new Date();
  const diff = hoje.getTime() - d.getTime();
  if (diff < 60000) return "Agora mesmo";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
  if (diff < 86400000) return `Hoje, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

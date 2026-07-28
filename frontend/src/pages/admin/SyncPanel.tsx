import { useState, useEffect } from "react";
import { useSyncStatus, formatDuration, formatSyncTime, type SyncLogEntry } from "../../hooks/useSync";
import { showToast } from "../../lib/toast";

const ENTITIES: { type: string; label: string }[] = [
  { type: "products", label: "Produtos" },
  { type: "clients", label: "Clientes" },
  { type: "stock", label: "Estoque" },
  { type: "tech-sheets", label: "Fichas Técnicas" },
  { type: "all", label: "Sync Completo" },
];

export function SyncPanel() {
  const { statuses, loading, fetchLastSync, triggerSync } = useSyncStatus();
  const [confirmEntity, setConfirmEntity] = useState<string | null>(null);

  useEffect(() => {
    ENTITIES.forEach((e) => fetchLastSync(e.type));
  }, [fetchLastSync]);

  const handleSync = async (entity: string) => {
    setConfirmEntity(null);
    const syncId = await triggerSync(entity);
    if (!syncId) {
      showToast("Erro ao iniciar sincronização");
      return;
    }
    showToast(`Sincronização de ${entity} iniciada em segundo plano`);
    setTimeout(() => fetchLastSync(entity), 3000);
  };

  const renderStatus = (entry: SyncLogEntry | null) => {
    if (!entry) return <span style={{ color: "#9CA3AF" }}>Nunca sincronizado</span>;
    const ok = entry.status === "completed" && entry.result?.success;
    return (
      <span style={{ color: ok ? "#00A650" : "#E31E24" }}>
        {ok ? "✅" : "❌"} {formatSyncTime(entry.finishedAt)} — {entry.result?.recordsProcessed.toLocaleString()} itens em {formatDuration(entry.result?.durationMs || 0)}
      </span>
    );
  };

  return (
    <div>
      <h1>Sincronia ERP</h1>
      <p className="page-subtitle">
        Clique para sincronizar dados com o FlexTotal ERP.
        O sync roda em segundo plano — o resultado aparece aqui automaticamente.
      </p>

      <div className="card" style={{ padding: 0 }}>
        {ENTITIES.map(({ type, label }) => {
          const entry = statuses[type] || null;
          return (
            <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
              <div>
                <strong>{label}</strong>
                <div style={{ fontSize: 13, marginTop: 4 }}>{renderStatus(entry)}</div>
              </div>
                <button
                  className={`btn btn-sm ${type === "all" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setConfirmEntity(type)}
                  disabled={loading}
                >
                  {loading ? "..." : "Sincronizar"}
                </button>
            </div>
          );
        })}
      </div>

      {confirmEntity && (
        <div className="modal-overlay" onClick={() => setConfirmEntity(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h2>Confirmar sincronização</h2>
            <p style={{ marginBottom: 20, color: "var(--cinza-medio)", fontSize: 14 }}>
              Deseja iniciar a sincronização de <strong>{ENTITIES.find(e => e.type === confirmEntity)?.label}</strong> com o ERP FlexTotal?
              {confirmEntity === "all" && " Esta operação pode levar alguns minutos."}
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmEntity(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => handleSync(confirmEntity)}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

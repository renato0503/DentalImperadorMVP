import { useSync, type SyncEntity } from "../../hooks/useSync";

const ENTITIES: { type: SyncEntity; label: string }[] = [
  { type: "products", label: "Sincronizar Produtos" },
  { type: "clients", label: "Sincronizar Clientes" },
  { type: "stock", label: "Sincronizar Estoque" },
  { type: "tech-sheets", label: "Sincronizar Fichas Técnicas" },
  { type: "all", label: "Sync All (completo)" },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  queued: { label: "Na fila", color: "#6B7280" },
  running: { label: "Sincronizando...", color: "#3B82F6" },
  completed: { label: "Concluído", color: "#00A650" },
  failed: { label: "Falhou", color: "#E31E24" },
};

export function SyncPanel() {
  const { states, runSync, reset } = useSync();

  return (
    <div>
      <h1>Sincronia ERP</h1>
      <p className="page-subtitle">
        Dispare manualmente a sincronização com o FlexTotal ERP.
        O sync roda em segundo plano — você pode acompanhar o progresso aqui.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        {ENTITIES.map(({ type, label }) => {
          const s = states[type];
          return (
            <button
              key={type}
              className={`btn ${type === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => runSync(type)}
              disabled={s.loading}
            >
              {s.loading ? "Disparando..." : label}
            </button>
          );
        })}
      </div>

      {ENTITIES.map(({ type }) => {
        const s = states[type];
        if (!s.entry && !s.error) return null;

        const statusInfo = s.entry ? STATUS_LABEL[s.entry.status] : null;

        return (
          <div key={type} className="card" style={{ marginBottom: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>
                {type === "all" ? "Sync Completo" : `Sync ${type}`}
              </h3>
              {statusInfo && (
                <span
                  style={{
                    background: statusInfo.color,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {statusInfo.label}
                </span>
              )}
            </div>

            {s.error && <p style={{ color: "#E31E24" }}>Erro: {s.error}</p>}

            {s.entry && s.entry.status === "running" && (
              <p style={{ color: statusInfo?.color }}>
                Aguardando conclusão... <span style={{ fontSize: 12 }}>(atualiza a cada 2s)</span>
              </p>
            )}

            {s.entry?.result && (
              <>
                <div style={{ display: "flex", gap: 24, marginBottom: 12, flexWrap: "wrap" }}>
                  <div>
                    <strong style={{ fontSize: 13 }}>Registros</strong>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
                      {s.entry.result.recordsProcessed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 13 }}>Criados</strong>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#00A650" }}>
                      {s.entry.result.recordsCreated.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 13 }}>Atualizados</strong>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#3B82F6" }}>
                      {s.entry.result.recordsUpdated.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 13 }}>Duração</strong>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
                      {s.entry.result.durationMs > 1000
                        ? `${(s.entry.result.durationMs / 1000).toFixed(1)}s`
                        : `${s.entry.result.durationMs}ms`}
                    </p>
                  </div>
                </div>

                {s.entry.result.errors.length > 0 && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ color: "#E31E24", cursor: "pointer", fontSize: 13 }}>
                      {s.entry.result.errors.length} erro(s)
                    </summary>
                    <pre style={{ fontSize: 12, background: "#fef2f2", padding: 12, borderRadius: 8, overflow: "auto", maxHeight: 200, marginTop: 8 }}>
                      {s.entry.result.errors.join("\n")}
                    </pre>
                  </details>
                )}
              </>
            )}

            {s.entry?.status === "failed" && s.entry.error && (
              <p style={{ color: "#E31E24" }}>{s.entry.error}</p>
            )}

            {(s.entry?.status === "completed" || s.entry?.status === "failed") && (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => reset(type)}
                style={{ marginTop: 8 }}
              >
                Limpar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

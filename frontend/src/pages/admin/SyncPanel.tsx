import { useState, useCallback } from "react";

interface SyncState {
  loading: boolean;
  result: string | null;
  error: string | null;
}

type SyncType = "products" | "clients" | "stock" | "tech-sheets" | "all";

export function SyncPanel() {
  const [syncs, setSyncs] = useState<Record<SyncType, SyncState>>({
    products: { loading: false, result: null, error: null },
    clients: { loading: false, result: null, error: null },
    stock: { loading: false, result: null, error: null },
    "tech-sheets": { loading: false, result: null, error: null },
    all: { loading: false, result: null, error: null },
  });

  const runSync = useCallback(async (type: SyncType) => {
    setSyncs((prev) => ({
      ...prev,
      [type]: { loading: true, result: null, error: null },
    }));

    try {
      const res = await fetch(`/api/v1/flextotal/sync/${type}`, { method: "POST" });
      const data = await res.json();
      const text = JSON.stringify(data, null, 2);
      setSyncs((prev) => ({
        ...prev,
        [type]: { loading: false, result: text, error: null },
      }));
    } catch (err) {
      setSyncs((prev) => ({
        ...prev,
        [type]: { loading: false, result: null, error: (err as Error).message },
      }));
    }
  }, []);

  const buttons: { type: SyncType; label: string }[] = [
    { type: "products", label: "Sincronizar Produtos" },
    { type: "clients", label: "Sincronizar Clientes" },
    { type: "stock", label: "Sincronizar Estoque" },
    { type: "tech-sheets", label: "Sincronizar Fichas Técnicas" },
    { type: "all", label: "Sync All (completo)" },
  ];

  return (
    <div>
      <h1>Sincronia ERP</h1>
      <p className="page-subtitle">
        Dispare manualmente a sincronização com o FlexTotal ERP.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        {buttons.map(({ type, label }) => {
          const s = syncs[type];
          return (
            <button
              key={type}
              className={`btn ${type === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => runSync(type)}
              disabled={s.loading}
            >
              {s.loading ? "Sincronizando..." : label}
            </button>
          );
        })}
      </div>

      {buttons.map(({ type }) => {
        const s = syncs[type];
        if (!s.result && !s.error) return null;
        return (
          <div key={type} className="card" style={{ marginBottom: 12, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{type === "all" ? "Sync Completo" : `Sync ${type}`}</h3>
            {s.error && <p style={{ color: "#E31E24" }}>Erro: {s.error}</p>}
            {s.result && (
              <pre style={{ fontSize: 12, background: "#f5f5f5", padding: 12, borderRadius: 8, overflow: "auto", maxHeight: 300 }}>
                {s.result}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}

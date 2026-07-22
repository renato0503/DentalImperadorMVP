import { useState, useEffect } from "react";

interface PickRequest {
  id: string;
  pedido_numero: string;
  sku: string;
  produto: string;
  quantidade_solicitada: number;
  quantidade_separada: number;
  status: "pendente" | "separando" | "concluido" | "erro";
  local_estoque: string;
  criado_em: string;
  atualizado_em: string;
  observacao?: string;
}

interface PickingEvent {
  pickId: string;
  pedidoNumero: string;
  tipo: string;
  timestamp: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "#FEF3C7" },
  separando: { label: "Separando", color: "#DBEAFE" },
  concluido: { label: "Concluído", color: "#D1FAE5" },
  erro: { label: "Ressalva", color: "#FEE2E2" },
};

export function PickingMonitor() {
  const [picks, setPicks] = useState<PickRequest[]>([]);
  const [events, setEvents] = useState<PickingEvent[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ pedido_numero: "", sku: "", produto: "", quantidade: 1, local_estoque: "" });

  const fetchData = async () => {
    try {
      const [picksRes, eventsRes] = await Promise.all([
        fetch(`/api/v1/warehouse/picks${filter ? `?status=${filter}` : ""}`).then((r) => r.json()),
        fetch("/api/v1/warehouse/events").then((r) => r.json()),
      ]);
      setPicks(Array.isArray(picksRes) ? picksRes : []);
      setEvents(Array.isArray(eventsRes) ? eventsRes : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/v1/warehouse/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowCreate(false);
      setForm({ pedido_numero: "", sku: "", produto: "", quantidade: 1, local_estoque: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (pick: PickRequest) => {
    try {
      await fetch(`/api/v1/warehouse/picks/${pick.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: pick.quantidade_solicitada }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const progress = (p: PickRequest) =>
    Math.round((p.quantidade_separada / p.quantidade_solicitada) * 100);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="page page-picking">
      <div className="page-header-row">
        <div>
          <h1>Monitor de Picking</h1>
          <p className="page-subtitle">Acompanhe a separação de pedidos em tempo real.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Nova Separação
        </button>
      </div>

      <div className="picking-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="separando">Separando</option>
          <option value="concluido">Concluído</option>
        </select>
        <span className="picking-count">{picks.length} itens</span>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Separação</h2>
            <form onSubmit={handleCreate} className="campaign-form">
              <label>Pedido <input value={form.pedido_numero} onChange={(e) => setForm({...form, pedido_numero: e.target.value})} required /></label>
              <label>SKU <input value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} required /></label>
              <label>Produto <input value={form.produto} onChange={(e) => setForm({...form, produto: e.target.value})} required /></label>
              <label>Quantidade <input type="number" min={1} value={form.quantidade} onChange={(e) => setForm({...form, quantidade: +e.target.value})} required /></label>
              <label>Local Estoque <input value={form.local_estoque} onChange={(e) => setForm({...form, local_estoque: e.target.value})} /></label>
              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Criar</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowCreate(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="picking-grid">
        {picks.map((pick) => {
          const st = STATUS_MAP[pick.status] || STATUS_MAP.pendente;
          return (
            <div key={pick.id} className="card picking-card">
              <div className="picking-card-header">
                <span className="picking-badge" style={{ background: st.color, color: "#1f2937" }}>
                  {st.label}
                </span>
                <span className="picking-pedido">Pedido #{pick.pedido_numero}</span>
              </div>
              <h3>{pick.produto}</h3>
              <div className="picking-details">
                <div><span>SKU</span><strong>{pick.sku}</strong></div>
                <div><span>Local</span><strong>{pick.local_estoque}</strong></div>
                <div><span>Solicitado</span><strong>{pick.quantidade_solicitada}</strong></div>
                <div><span>Separado</span><strong>{pick.quantidade_separada}</strong></div>
              </div>
              <div className="picking-progress">
                <div className="picking-progress-bar">
                  <div className="picking-progress-fill" style={{ width: `${progress(pick)}%` }} />
                </div>
                <span>{progress(pick)}%</span>
              </div>
              {pick.status === "pendente" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleComplete(pick)}
                  style={{ marginTop: 8, width: "100%" }}
                >
                  Concluir Separação
                </button>
              )}
              {pick.observacao && (
                <p className="picking-obs">{pick.observacao}</p>
              )}
              <p className="picking-time">
                Atualizado: {new Date(pick.atualizado_em).toLocaleTimeString("pt-BR")}
              </p>
            </div>
          );
        })}
      </div>

      {events.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>Eventos de Picking</h3>
          <div className="picking-events">
            {events.slice().reverse().map((ev, i) => (
              <div key={i} className="picking-event">
                <span className={`picking-event-type picking-event-${ev.tipo.split(".")[1] || "info"}`}>
                  {ev.tipo === "picking.start" ? "▶ Iniciado" : ev.tipo === "picking.done" ? "✅ Concluído" : "⚠️ Ressalva"}
                </span>
                <span>Pedido #{ev.pedidoNumero}</span>
                <span className="picking-event-time">
                  {new Date(ev.timestamp).toLocaleTimeString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

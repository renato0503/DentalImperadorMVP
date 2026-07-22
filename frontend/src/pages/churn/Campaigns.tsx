import { useState, useEffect, type FormEvent } from "react";

interface Campaign {
  id: string;
  nome: string;
  canal: "email" | "sms";
  publico_alvo: string;
  mensagem: string;
  status: "rascunho" | "agendada" | "enviada" | "concluida";
  agendada_para: string | null;
  enviada_em: string | null;
  total_destinatarios: number;
  total_convertidos: number;
  criado_em: string;
}

const STATUS_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  agendada: "Agendada",
  enviada: "Enviada",
  concluida: "Concluída",
};

const STATUS_COLORS: Record<string, string> = {
  rascunho: "#6B7280",
  agendada: "#2563EB",
  enviada: "#00A650",
  concluida: "#065F46",
};

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", canal: "email" as "email" | "sms", publico_alvo: "", mensagem: "", agendada_para: "" });
  const [triggering, setTriggering] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/v1/churn/campaigns");
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/v1/churn/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          agendada_para: form.agendada_para || null,
        }),
      });
      setShowForm(false);
      setForm({ nome: "", canal: "email", publico_alvo: "", mensagem: "", agendada_para: "" });
      fetchCampaigns();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrigger = async (id: string) => {
    setTriggering(id);
    try {
      await fetch(`/api/v1/churn/trigger/${id}`, { method: "POST" });
      fetchCampaigns();
    } catch (e) {
      console.error(e);
    } finally {
      setTriggering(null);
    }
  };

  const conversao = (c: Campaign) =>
    c.total_destinatarios > 0
      ? Math.round((c.total_convertidos / c.total_destinatarios) * 100)
      : 0;

  return (
    <div className="page page-campaigns">
      <div className="page-header-row">
        <div>
          <h1>Campanhas de Retenção</h1>
          <p className="page-subtitle">Gerencie campanhas para recuperar clientes inativos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Nova Campanha
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Campanha</h2>
            <form onSubmit={handleCreate} className="campaign-form">
              <label>
                Nome
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </label>
              <label>
                Canal
                <select value={form.canal} onChange={(e) => setForm({ ...form, canal: e.target.value as "email" | "sms" })}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </label>
              <label>
                Público-alvo
                <input value={form.publico_alvo} onChange={(e) => setForm({ ...form, publico_alvo: e.target.value })} required />
              </label>
              <label>
                Mensagem
                <textarea value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} rows={3} required />
              </label>
              <label>
                Agendar para
                <input type="datetime-local" value={form.agendada_para} onChange={(e) => setForm({ ...form, agendada_para: e.target.value })} />
              </label>
              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Criar</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : campaigns.length === 0 ? (
        <p className="empty-state">Nenhuma campanha criada ainda.</p>
      ) : (
        <div className="campaigns-list">
          {campaigns.map((c) => (
            <div key={c.id} className="card campaign-card">
              <div className="campaign-header">
                <div>
                  <h3>{c.nome}</h3>
                  <span className="campaign-channel">{c.canal.toUpperCase()}</span>
                </div>
                <span
                  className="campaign-status"
                  style={{ background: STATUS_COLORS[c.status], color: "white" }}
                >
                  {STATUS_LABELS[c.status]}
                </span>
              </div>

              <p className="campaign-target">{c.publico_alvo}</p>
              <p className="campaign-message">"{c.mensagem}"</p>

              <div className="campaign-stats">
                <div>
                  <strong>{c.total_destinatarios}</strong>
                  <span>Destinatários</span>
                </div>
                <div>
                  <strong>{c.total_convertidos}</strong>
                  <span>Convertidos</span>
                </div>
                <div>
                  <strong>{conversao(c)}%</strong>
                  <span>Conversão</span>
                </div>
              </div>

              {c.status === "rascunho" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleTrigger(c.id)}
                  disabled={triggering === c.id}
                  style={{ marginTop: 12 }}
                >
                  {triggering === c.id ? "Disparando..." : "Disparar Agora"}
                </button>
              )}

              {c.status === "agendada" && c.agendada_para && (
                <p className="campaign-schedule">
                  Agendada para: {new Date(c.agendada_para).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

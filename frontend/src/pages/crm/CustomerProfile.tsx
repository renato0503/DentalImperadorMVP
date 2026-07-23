import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface TimelineEvent {
  id: string; tipo: string; descricao: string; data: string; responsavel: string;
}

interface CustomerDetail {
  id: string; nome: string; cpf_cnpj: string; email: string; telefone: string;
  segmento: string; status: string; origem: string;
  total_gasto: number; ultima_compra: string;
  ticket_cluster: string; frequencia_cluster: string; categorias_compra: string[];
  vendedor_nome: string | null; ultimo_contato: string | null; proximo_contato: string | null;
  nota_interna: string | null; propensao_compra: number; churn_risk: string;
  endereco: { logradouro: string; numero: string; bairro: string; cidade: string; estado: string; cep: string };
  criado_em: string;
}

interface Order { id: string; numero: string; data: string; status: string; valor: number; itens: number; }
interface Estimate { id: string; numero: string; data: string; status: string; valor: number; itens: number; }

const TIPO_ICON: Record<string, string> = { chat: "💬", pedido: "📦", orcamento: "📋", nota: "📝", ligacao: "📞", email: "✉️", lead: "👤" };
const STATUS_COLORS: Record<string, string> = { lead: "#FEF3C7", contato: "#DBEAFE", proposta: "#E0E7FF", negociacao: "#FCE7F3", cliente: "#D1FAE5", inativo: "#F3F4F6" };

export function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [aba, setAba] = useState("timeline");
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/v1/crm/customers/${id}`).then((r) => r.json()),
      fetch(`/api/v1/crm/customers/${id}/timeline`).then((r) => r.json()),
      fetch(`/api/v1/crm/customers/${id}/orders`).then((r) => r.json()),
      fetch(`/api/v1/crm/customers/${id}/estimates`).then((r) => r.json()),
    ]).then(([c, t, o, e]) => {
      setCustomer(c);
      setTimeline(Array.isArray(t) ? t : []);
      setOrders(Array.isArray(o) ? o : []);
      setEstimates(Array.isArray(e) ? e : []);
      setLoading(false);
    });
  }, [id]);

  const addNote = async () => {
    if (!noteText.trim() || !id) return;
    await fetch(`/api/v1/crm/customers/${id}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: noteText, autor: "Vendedor" }),
    });
    const newEvent: TimelineEvent = { id: `n${Date.now()}`, tipo: "nota", descricao: noteText, data: new Date().toISOString(), responsavel: "Vendedor" };
    setTimeline((prev) => [newEvent, ...prev]);
    setNoteText("");
  };

  if (loading || !customer) return <p>Carregando perfil...</p>;

  return (
    <div className="page page-customer-profile">
      <Link to="/crm" className="btn btn-sm btn-outline" style={{ marginBottom: 16 }}>← Voltar ao CRM</Link>

      <div className="profile-header card">
        <div className="profile-header-main">
          <div>
            <h1>{customer.nome}</h1>
            <div className="profile-badges">
              <span className="kanban-card-segmento">{customer.segmento}</span>
              <span className="kanban-card-origem">{customer.origem}</span>
              <span className="profile-cluster ticket">{customer.ticket_cluster === "grande" ? "🏆" : customer.ticket_cluster === "medio" ? "💎" : "💰"} {customer.ticket_cluster}</span>
              <span className="profile-cluster freq">{customer.frequencia_cluster === "recorrente" ? "🔄" : customer.frequencia_cluster === "sazonal" ? "📅" : "💤"} {customer.frequencia_cluster}</span>
              <span className="profile-status" style={{ background: STATUS_COLORS[customer.status] || "#eee" }}>{customer.status}</span>
            </div>
          </div>
          <div className="profile-score-ring">
            <div className="score-ring">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="36" cy="36" r="30" fill="none" stroke={customer.propensao_compra > 70 ? "#00A650" : customer.propensao_compra > 40 ? "#FFD700" : "#E31E24"} strokeWidth="6"
                  strokeDasharray={`${(customer.propensao_compra / 100) * 188.5} 188.5`} transform="rotate(-90 36 36)" />
              </svg>
              <span className="score-ring-value">{customer.propensao_compra}%</span>
            </div>
            <span className="score-ring-label">Propensão</span>
          </div>
        </div>

        <div className="profile-info-grid">
          <div><strong>CPF/CNPJ:</strong> {customer.cpf_cnpj}</div>
          <div><strong>Email:</strong> {customer.email}</div>
          <div><strong>Telefone:</strong> {customer.telefone}</div>
          <div><strong>Vendedor:</strong> {customer.vendedor_nome || "Não atribuído"}</div>
          <div><strong>Último contato:</strong> {customer.ultimo_contato ? new Date(customer.ultimo_contato).toLocaleDateString("pt-BR") : "Nunca"}</div>
          <div><strong>Próximo contato:</strong> {customer.proximo_contato ? new Date(customer.proximo_contato).toLocaleDateString("pt-BR") : "—"}</div>
          <div><strong>Endereço:</strong> {customer.endereco.logradouro}, {customer.endereco.numero} — {customer.endereco.cidade}/{customer.endereco.estado}</div>
          <div><strong>Categorias:</strong> {customer.categorias_compra.join(", ")}</div>
        </div>
      </div>

      {customer.nota_interna && (
        <div className="card profile-note">
          <strong>📝 Nota interna:</strong> {customer.nota_interna}
        </div>
      )}

      <div className="profile-tabs">
        {["timeline", "pedidos", "orcamentos", "whatsapp", "notas"].map((t) => (
          <button key={t} className={`profile-tab${aba === t ? " active" : ""}`} onClick={() => setAba(t)}>
            {t === "timeline" ? "📋 Timeline" : t === "pedidos" ? "📦 Pedidos" : t === "orcamentos" ? "📋 Orçamentos" : t === "whatsapp" ? "💬 WhatsApp" : "📝 Notas"}
          </button>
        ))}
      </div>

      <div className="profile-content card">
        {aba === "timeline" && (
          <div className="timeline-feed">
            {timeline.length === 0 && <p className="empty-state">Nenhum evento registrado.</p>}
            {timeline.map((ev) => (
              <div key={ev.id} className="timeline-item">
                <div className={`timeline-icon timeline-${ev.tipo}`}>{TIPO_ICON[ev.tipo] || "📌"}</div>
                <div className="timeline-body">
                  <p>{ev.descricao}</p>
                  <span className="timeline-meta">{ev.responsavel} · {new Date(ev.data).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === "pedidos" && (
          <div>
            {orders.length === 0 && <p className="empty-state">Nenhum pedido encontrado.</p>}
            {orders.length > 0 && (
              <table className="reports-table">
                <thead><tr><th>Nº</th><th>Data</th><th>Status</th><th>Valor</th><th>Itens</th></tr></thead>
                <tbody>{orders.map((o) => (
                  <tr key={o.id}><td>#{o.numero}</td><td>{new Date(o.data).toLocaleDateString("pt-BR")}</td><td>{o.status}</td><td>R$ {o.valor.toFixed(2)}</td><td>{o.itens}</td></tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {aba === "orcamentos" && (
          <div>
            {estimates.length === 0 && <p className="empty-state">Nenhum orçamento encontrado.</p>}
            {estimates.length > 0 && (
              <table className="reports-table">
                <thead><tr><th>Nº</th><th>Data</th><th>Status</th><th>Valor</th><th>Itens</th></tr></thead>
                <tbody>{estimates.map((e) => (
                  <tr key={e.id}><td>{e.numero}</td><td>{new Date(e.data).toLocaleDateString("pt-BR")}</td><td>{e.status}</td><td>R$ {e.valor.toFixed(2)}</td><td>{e.itens}</td></tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {aba === "whatsapp" && (
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
              <a
                href={`https://wa.me/55${customer.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                📱 Abrir WhatsApp
              </a>
              <span style={{ fontSize: 13, color: "var(--cinza-medio)" }}>
                {customer.telefone}
              </span>
            </div>
            <div className="whatsapp-conversas">
              <div className="whatsapp-msg bot">
                <div className="whatsapp-msg-bubble">
                  <p>Olá! Tudo bem? Aqui é da Dental Imperador. Recebemos sua solicitação e estamos prontos para ajudar!</p>
                  <span className="whatsapp-msg-time">21/07/2026 09:00</span>
                </div>
              </div>
              <div className="whatsapp-msg cliente">
                <div className="whatsapp-msg-bubble">
                  <p>Olá! Gostaria de saber sobre os kits acadêmicos disponíveis.</p>
                  <span className="whatsapp-msg-time">21/07/2026 09:05</span>
                </div>
              </div>
              <div className="whatsapp-msg bot">
                <div className="whatsapp-msg-bubble">
                  <p>Temos Kits Acadêmicos completos a partir de R$ 299,90. Gostaria de receber o catálogo por email?</p>
                  <span className="whatsapp-msg-time">21/07/2026 09:06</span>
                </div>
              </div>
              <div className="whatsapp-msg cliente">
                <div className="whatsapp-msg-bubble">
                  <p>Sim, por favor! Meu email é {customer.email || "cliente@email.com"}</p>
                  <span className="whatsapp-msg-time">21/07/2026 09:10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {aba === "notas" && (
          <div>
            <div className="note-form">
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Adicionar nota interna..." rows={3} />
              <button className="btn btn-primary btn-sm" onClick={addNote} disabled={!noteText.trim()}>Salvar Nota</button>
            </div>
            <div className="timeline-feed" style={{ marginTop: 16 }}>
              {timeline.filter((t) => t.tipo === "nota").map((ev) => (
                <div key={ev.id} className="timeline-item">
                  <div className="timeline-icon timeline-nota">📝</div>
                  <div className="timeline-body">
                    <p>{ev.descricao}</p>
                    <span className="timeline-meta">{ev.responsavel} · {new Date(ev.data).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              ))}
              {timeline.filter((t) => t.tipo === "nota").length === 0 && <p className="empty-state">Nenhuma nota adicionada.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

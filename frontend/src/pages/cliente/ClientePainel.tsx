import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { showToast } from "../../lib/toast";

export function ClientePainel() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<{ numero: string; status: string; valor: number; criado_em: string }[]>([]);
  const [estimates, setEstimates] = useState<{ id: string; status: string; valor: number; criado_em: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    Promise.all([
      fetch(`/api/v1/orders?cliente_uid=${userData.uid}`).then((r) => r.json()),
      fetch(`/api/v1/crm/customers/${userData.uid}/estimates`).then((r) => r.json()),
    ])
      .then(([o, e]) => {
        setOrders(Array.isArray(o) ? o.slice(0, 3) : []);
        setEstimates(Array.isArray(e) ? e.slice(0, 3) : []);
      })
      .catch(() => showToast("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) return <p className="cliente-loading">Carregando...</p>;

  const ultimoPedido = orders[0];
  const orcamentoPendente = estimates.find((e) => e.status === "rascunho");

  return (
    <div className="cliente-page">
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Olá, {userData?.nome?.split(" ")[0]}! 👋</h1>
      <p style={{ color: "var(--cinza-medio)", marginBottom: 24, fontSize: 14 }}>
        {ultimoPedido ? `Último pedido: #${ultimoPedido.numero} — ${ultimoPedido.status}` : "Bem-vindo à Dental Imperador"}
      </p>

      <div className="cliente-cards">
        <a href="/cliente/pedidos" className="card cliente-card">
          <span style={{ fontSize: 28 }}>📦</span>
          <div>
            <strong>{orders.length}</strong>
            <span style={{ fontSize: 12, color: "var(--cinza-medio)" }}> pedidos</span>
          </div>
        </a>
        <a href="/cliente/orcamentos" className="card cliente-card">
          <span style={{ fontSize: 28 }}>📋</span>
          <div>
            <strong>{estimates.length}</strong>
            <span style={{ fontSize: 12, color: "var(--cinza-medio)" }}> orçamentos</span>
          </div>
        </a>
        <a href="/cliente/chat" className="card cliente-card">
          <span style={{ fontSize: 28 }}>💬</span>
          <div>
            <strong>{orcamentoPendente ? "1 pendente" : "ok"}</strong>
            <span style={{ fontSize: 12, color: "var(--cinza-medio)" }}> conversa ativa</span>
          </div>
        </a>
      </div>

      {ultimoPedido && (
        <div className="card" style={{ marginTop: 16, padding: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>📦 Último Pedido — #{ultimoPedido.numero}</h3>
          <div className="cliente-timeline">
            {["Aguardando", "Confirmado", "Separado", "Saiu para entrega", "Entregue"].map((step, i) => {
              const statusOrder = ["Aguardando", "Confirmado", "Separado", "Saiu para entrega", "Entregue"];
              const currentIdx = statusOrder.indexOf(ultimoPedido.status);
              const done = i <= currentIdx;
              return (
                <div key={step} className={`timeline-step ${done ? "done" : ""}`}>
                  <div className={`timeline-dot ${done ? "filled" : ""}`} />
                  <span style={{ fontSize: 11 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {orcamentoPendente && (
        <div className="card" style={{ marginTop: 12, padding: 16, borderLeft: "4px solid #F59E0B" }}>
          <span style={{ fontSize: 13 }}>📋 Você tem <strong>1 orçamento pendente</strong></span>
          <a href="/cliente/orcamentos" className="btn btn-sm btn-primary" style={{ marginTop: 8, display: "inline-block" }}>
            Revisar orçamento
          </a>
        </div>
      )}
    </div>
  );
}

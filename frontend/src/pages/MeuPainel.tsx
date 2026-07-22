import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";

interface Order { numero: string; status: string; valor: number; data: string; }

export function MeuPainel() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!userData) return;
    fetch(`/api/v1/orders?cliente_uid=${userData.uid}`)
      .then((r) => r.json())
      .then((o) => setOrders(Array.isArray(o) ? o : []))
      .catch(() => {});
  }, [userData]);

  if (!userData) return <p className="empty-state">Faça login para ver seu painel.</p>;

  return (
    <div className="page page-meu-painel">
      <div className="profile-header" style={{ marginBottom: 24 }}>
        <div className="profile-header-main">
          <div>
            <h1>Olá, {userData.nome}! 👋</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              {userData.papel === "admin" ? "Administrador" : userData.papel === "manager" ? "Gerente" : userData.papel === "operator" ? "Operador" : "Cliente"}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <div className="card metric-card">
          <h3>Meus Pedidos</h3>
          <p className="metric-value">{orders.length}</p>
        </div>
        <div className="card metric-card">
          <h3>Última Compra</h3>
          <p className="metric-value" style={{ fontSize: 20 }}>
            {orders.length > 0 ? new Date(orders[0].data).toLocaleDateString("pt-BR") : "—"}
          </p>
        </div>
        <div className="card metric-card">
          <h3>Total Gasto</h3>
          <p className="metric-value">
            R$ {orders.reduce((s, o) => s + o.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card metric-card">
          <h3>Status</h3>
          <p className="metric-value" style={{ fontSize: 16, color: "#00A650" }}>
            {orders.some((o) => o.status === "Separado") ? "🟢 Pedido em andamento" : "📌 Em dia"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>📦 Meus Pedidos</h2>
          {orders.length === 0 ? (
            <p className="empty-state">Nenhum pedido encontrado.</p>
          ) : (
            <table className="reports-table">
              <thead><tr><th>Nº</th><th>Data</th><th>Status</th><th>Valor</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.numero}>
                    <td>#{o.numero}</td>
                    <td>{new Date(o.data).toLocaleDateString("pt-BR")}</td>
                    <td><span className={`status-badge status-${"Separado Entregue".includes(o.status) ? "2" : "0"}`}>{o.status}</span></td>
                    <td>R$ {o.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>📋 Ações Rápidas</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a className="btn btn-primary" href="/chatbot">💬 Conversar com Assistente</a>
            <a className="btn btn-outline" href="/orcamento">📋 Fazer Orçamento</a>
            <a className="btn btn-outline" href="/pedido">📦 Status de Pedido</a>
          </div>
        </div>
      </div>
    </div>
  );
}

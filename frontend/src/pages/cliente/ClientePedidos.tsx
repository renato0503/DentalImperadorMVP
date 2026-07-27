import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { showToast } from "../../lib/toast";

const STATUS_FLOW = ["Aguardando", "Confirmado", "Separado", "Saiu para entrega", "Entregue"];

export function ClientePedidos() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    fetch(`/api/v1/orders?cliente_uid=${userData.uid}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => showToast("Erro ao carregar pedidos"))
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) return <p className="cliente-loading">Carregando...</p>;

  if (orders.length === 0) {
    return (
      <div className="cliente-page">
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Meus Pedidos</h1>
        <p style={{ color: "var(--cinza-medio)" }}>Nenhum pedido encontrado.</p>
        <a href="/orcamento" className="btn btn-primary" style={{ marginTop: 16 }}>Fazer um orçamento</a>
      </div>
    );
  }

  return (
    <div className="cliente-page">
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>Meus Pedidos</h1>
      <p style={{ color: "var(--cinza-medio)", fontSize: 13, marginBottom: 20 }}>
        {orders.length} pedido(s) encontrado(s)
      </p>

      {orders.map((order) => {
        const currentIdx = STATUS_FLOW.indexOf(order.status);
        return (
          <div key={order.numero} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <strong>Pedido #{order.numero}</strong>
                <span style={{ color: "var(--cinza-medio)", fontSize: 12, marginLeft: 8 }}>
                  {new Date(order.criado_em || order.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <span className={`badge badge-${order.status === "Entregue" ? "success" : "warning"}`}>
                {order.status}
              </span>
            </div>

            <div className="cliente-timeline">
              {STATUS_FLOW.map((step, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={step} className={`timeline-step ${done ? "done" : ""}`}>
                    <div className={`timeline-dot ${done ? "filled" : ""}`} />
                    <span style={{ fontSize: 11 }}>{step}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                R$ {(order.valor || order.valor_total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <button className="btn btn-sm btn-outline" onClick={() => showToast("Função de reordenar em breve")}>
                Reordenar
              </button>
            </div>

            {order.items && order.items.length > 0 && (
              <details style={{ marginTop: 8, fontSize: 12 }}>
                <summary style={{ cursor: "pointer", color: "var(--cinza-medio)" }}>
                  {order.items.length} item(ns)
                </summary>
                <div style={{ marginTop: 8 }}>
                  {order.items.map((item: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span>{item.product?.nome || item.produto || `SKU ${item.sku || item.product_id}`}</span>
                      <span>{item.quantidade}x R$ {Number(item.preco_unit || item.preco_unitario || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

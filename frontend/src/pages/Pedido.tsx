import { useState } from "react";

interface OrderItem {
  sku: string;
  produto: string;
  quantidade: number;
  preco_unit: number;
}

interface Order {
  id: string;
  numero: string;
  cliente: string;
  status: string;
  status_index: number;
  items: OrderItem[];
  valor_total: number;
  criado_em: string;
  atualizado_em: string;
  endereco_entrega: string;
}

const STATUS_FLOW = [
  "Aguardando",
  "Confirmado",
  "Separado",
  "Saiu para entrega",
  "Entregue",
];

export function PedidoPage() {
  const [numero, setNumero] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarPedido = async () => {
    const trimmed = numero.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/v1/orders/${trimmed}`);
      if (!res.ok) {
        setError("Pedido não encontrado. Verifique o número e tente novamente.");
        return;
      }
      const data: Order = await res.json();
      setOrder(data);
    } catch {
      setError("Erro ao consultar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-pedido">
      <h1>Status de Pedido</h1>
      <p className="page-subtitle">
        Consulte o andamento dos seus pedidos pelo número.
      </p>

      <div className="pedido-search">
        <div className="search-box">
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Nº do pedido (ex: 10482)"
            onKeyDown={(e) => e.key === "Enter" && buscarPedido()}
            aria-label="Número do pedido"
          />
          <button
            className="btn btn-primary"
            onClick={buscarPedido}
            disabled={loading || !numero.trim()}
          >
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>
      </div>

      {error && <p className="pedido-error">{error}</p>}

      {order && (
        <div className="pedido-detalhes">
          <div className="card pedido-header">
            <div className="pedido-header-top">
              <h2>Pedido #{order.numero}</h2>
              <span className={`status-badge status-${order.status_index}`}>
                {order.status}
              </span>
            </div>
            <p className="pedido-cliente">{order.cliente}</p>
            <p className="pedido-data">
              Emitido em:{" "}
              {new Date(order.criado_em).toLocaleDateString("pt-BR")}
            </p>
            <p className="pedido-endereco">
              Entrega: {order.endereco_entrega}
            </p>
          </div>

          <div className="card pedido-timeline">
            <h3>Acompanhamento</h3>
            <div className="timeline">
              {STATUS_FLOW.map((status, index) => {
                const isComplete = index <= order.status_index;
                const isCurrent = index === order.status_index;
                return (
                  <div
                    key={status}
                    className={`timeline-step${isComplete ? " complete" : ""}${isCurrent ? " current" : ""}`}
                  >
                    <div className="timeline-dot" />
                    <span className="timeline-label">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card pedido-itens">
            <h3>Itens do Pedido</h3>
            <table className="pedido-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Qtd</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.produto}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {item.preco_unit.toFixed(2)}</td>
                    <td>
                      R$ {(item.preco_unit * item.quantidade).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>R$ {order.valor_total.toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

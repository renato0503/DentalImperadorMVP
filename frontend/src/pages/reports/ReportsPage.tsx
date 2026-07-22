import { useState, useEffect, useRef } from "react";

interface SalesPeriod {
  periodo: string;
  vendas: number;
  pedidos: number;
}

interface SalesCategory {
  categoria: string;
  vendas: number;
  quantidade: number;
}

interface TopProduct {
  sku: string;
  produto: string;
  quantidade: number;
  receita: number;
}

interface SalesSummary {
  total_vendas: number;
  total_pedidos: number;
  ticket_medio: number;
  total_clientes: number;
  media_por_cliente: number;
}

type Aba = "resumo" | "vendas" | "categorias" | "produtos";

export function ReportsPage() {
  const [aba, setAba] = useState<Aba>("resumo");
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [vendas, setVendas] = useState<SalesPeriod[]>([]);
  const [categorias, setCategorias] = useState<SalesCategory[]>([]);
  const [produtos, setProdutos] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [inicio, setInicio] = useState("2026-01");
  const [fim, setFim] = useState("2026-12");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/v1/reports/summary").then((r) => r.json()),
      fetch(`/api/v1/reports/sales?inicio=${inicio}&fim=${fim}`).then((r) => r.json()),
      fetch("/api/v1/reports/categories").then((r) => r.json()),
      fetch("/api/v1/reports/top-products").then((r) => r.json()),
    ])
      .then(([s, v, c, p]) => {
        setSummary(s);
        setVendas(Array.isArray(v) ? v : []);
        setCategorias(Array.isArray(c) ? c : []);
        setProdutos(Array.isArray(p) ? p : []);
      })
      .finally(() => setLoading(false));
  }, [inicio, fim]);

  const exportCSV = async (tipo: string) => {
    const url = `/api/v1/reports/export/csv?tipo=${tipo}&inicio=${inicio}&fim=${fim}`;
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `relatorio-${tipo}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (n: number) =>
    `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  if (loading) return <p>Carregando relatórios...</p>;

  return (
    <div className="page page-reports" ref={printRef}>
      <div className="page-header-row no-print">
        <div>
          <h1>Relatórios</h1>
          <p className="page-subtitle">Análise de vendas, categorias e produtos.</p>
        </div>
        <div className="reports-actions">
          <button className="btn btn-outline btn-sm" onClick={handlePrint}>
            🖨 Imprimir
          </button>
          <select
            onChange={(e) => e.target.value && exportCSV(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Exportar CSV</option>
            <option value="vendas">Vendas por Período</option>
            <option value="categorias">Vendas por Categoria</option>
            <option value="produtos">Top Produtos</option>
          </select>
        </div>
      </div>

      <div className="reports-filters no-print">
        <label>
          De
          <input
            type="month"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </label>
        <label>
          Até
          <input
            type="month"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </label>
      </div>

      <div className="reports-tabs no-print">
        {(["resumo", "vendas", "categorias", "produtos"] as Aba[]).map((a) => (
          <button
            key={a}
            className={`reports-tab${aba === a ? " active" : ""}`}
            onClick={() => setAba(a)}
          >
            {a === "resumo" ? "Resumo" : a === "vendas" ? "Vendas" : a === "categorias" ? "Categorias" : "Top Produtos"}
          </button>
        ))}
      </div>

      <div className="reports-content">
        {aba === "resumo" && summary && (
          <div className="reports-summary">
            <div className="report-header-print">
              <img src="/logodental.png" alt="Dental Imperador" className="report-logo" />
              <div>
                <h2>Dental Imperador</h2>
                <p>Relatório Gerencial — {new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="card metric-card">
                <h3>Vendas Totais</h3>
                <p className="metric-value">{formatCurrency(summary.total_vendas)}</p>
              </div>
              <div className="card metric-card">
                <h3>Total Pedidos</h3>
                <p className="metric-value">{summary.total_pedidos}</p>
              </div>
              <div className="card metric-card">
                <h3>Ticket Médio</h3>
                <p className="metric-value">{formatCurrency(summary.ticket_medio)}</p>
              </div>
              <div className="card metric-card">
                <h3>Clientes Ativos</h3>
                <p className="metric-value">{summary.total_clientes}</p>
              </div>
            </div>
            <table className="reports-table">
              <thead>
                <tr><th>Período</th><th>Vendas</th><th>Pedidos</th></tr>
              </thead>
              <tbody>
                {vendas.map((v) => (
                  <tr key={v.periodo}>
                    <td>{v.periodo}</td>
                    <td>{formatCurrency(v.vendas)}</td>
                    <td>{v.pedidos}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{formatCurrency(vendas.reduce((s, v) => s + v.vendas, 0))}</strong></td>
                  <td><strong>{vendas.reduce((s, v) => s + v.pedidos, 0)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {aba === "vendas" && (
          <div>
            <h2>Vendas por Período</h2>
            <table className="reports-table">
              <thead>
                <tr><th>Período</th><th>Vendas (R$)</th><th>Pedidos</th></tr>
              </thead>
              <tbody>
                {vendas.map((v) => (
                  <tr key={v.periodo}>
                    <td>{v.periodo}</td>
                    <td>{formatCurrency(v.vendas)}</td>
                    <td>{v.pedidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aba === "categorias" && (
          <div>
            <h2>Vendas por Categoria</h2>
            <table className="reports-table">
              <thead>
                <tr><th>Categoria</th><th>Vendas (R$)</th><th>Quantidade</th></tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.categoria}>
                    <td>{c.categoria}</td>
                    <td>{formatCurrency(c.vendas)}</td>
                    <td>{c.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aba === "produtos" && (
          <div>
            <h2>Top Produtos</h2>
            <table className="reports-table">
              <thead>
                <tr><th>SKU</th><th>Produto</th><th>Qtd</th><th>Receita</th></tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.sku}>
                    <td>{p.sku}</td>
                    <td>{p.produto}</td>
                    <td>{p.quantidade}</td>
                    <td>{formatCurrency(p.receita)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

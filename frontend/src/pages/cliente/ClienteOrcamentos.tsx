import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { showToast } from "../../lib/toast";

export function ClienteOrcamentos() {
  const { userData } = useAuth();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    fetch(`/api/v1/crm/customers/${userData.uid}/estimates`)
      .then((r) => r.json())
      .then((data) => setEstimates(Array.isArray(data) ? data : []))
      .catch(() => showToast("Erro ao carregar orçamentos"))
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) return <p className="cliente-loading">Carregando...</p>;

  if (estimates.length === 0) {
    return (
      <div className="cliente-page">
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Meus Orçamentos</h1>
        <p style={{ color: "var(--cinza-medio)" }}>Nenhum orçamento encontrado.</p>
        <a href="/orcamento" className="btn btn-primary" style={{ marginTop: 16 }}>Solicitar orçamento</a>
      </div>
    );
  }

  return (
    <div className="cliente-page">
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>Meus Orçamentos</h1>
      <p style={{ color: "var(--cinza-medio)", fontSize: 13, marginBottom: 20 }}>
        {estimates.length} orçamento(s) gerado(s)
      </p>

      {estimates.map((est) => (
        <div key={est.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <strong>Orçamento #{est.id.slice(-6)}</strong>
              <span style={{ color: "var(--cinza-medio)", fontSize: 12, marginLeft: 8 }}>
                {new Date(est.criado_em || est.data).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <span className={`badge badge-${est.status === "rascunho" ? "warning" : "success"}`}>
              {est.status === "rascunho" ? "Pendente" : est.status}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              R$ {(est.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-sm btn-outline" onClick={() => showToast("Detalhes do orçamento")}>
                Ver
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => showToast("Orçamento convertido em pedido! Em breve você receberá a confirmação.")}
                disabled={est.status !== "rascunho"}
              >
                Converter em Pedido
              </button>
            </div>
          </div>

          {est.itens && (
            <div style={{ fontSize: 12, color: "var(--cinza-medio)", marginTop: 8 }}>
              {est.itens} item(ns)
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

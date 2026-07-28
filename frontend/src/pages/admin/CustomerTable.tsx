import { useState, useEffect } from "react";

interface Customer {
  id: string;
  uid: string;
  nome: string;
  email: string;
  cpf_cnpj: string | null;
  telefone: string | null;
  cidade: string;
  uf: string;
  ativo: boolean;
  segmento: string | null;
  origem: string | null;
  ultima_compra: string | null;
  status: string;
}

export function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroUf, setFiltroUf] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtroUf) params.set("uf", filtroUf);
    if (filtroStatus) params.set("status", filtroStatus);
    fetch(`/api/v1/customers?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => { console.error("Erro customers:", e); setLoading(false); });
  }, [filtroUf, filtroStatus]);

  const filtered = customers.filter((c) =>
    !search || c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf_cnpj?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const ufs = [...new Set(customers.map((c) => c.uf).filter(Boolean))].sort() as string[];

  return (
    <div>
      <h1>Clientes</h1>
      <p className="page-subtitle">Todos os clientes da base ({filtered.length}).</p>

      <div className="admin-filters" style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Buscar por nome ou CPF/CNPJ..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
        />
        <select value={filtroUf} onChange={(e) => { setFiltroUf(e.target.value); setPage(1); }} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">Todos os estados</option>
          {ufs.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setPage(1); }} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      {loading ? (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>Status</th>
                <th>Origem</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton skeleton-cell skeleton-cell-md" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-lg" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                  <td><div className="skeleton skeleton-cell skeleton-cell-sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>Nenhum cliente encontrado</h3>
          <p>{search ? "Tente alterar os filtros de busca." : "Nenhum cliente cadastrado na base."}</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>UF</th>
                  <th>Status</th>
                  <th>Origem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.cpf_cnpj ?? "-"}</td>
                    <td style={{ fontSize: 13 }}>{c.email}</td>
                    <td>{c.telefone ?? "-"}</td>
                    <td>{c.cidade}</td>
                    <td>{c.uf}</td>
                    <td>
                      <span className={`badge-status badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{c.origem ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
              <button className="btn btn-sm btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
              <span style={{ padding: "4px 12px" }}>{page} / {totalPages}</span>
              <button className="btn btn-sm btn-outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Próxima</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

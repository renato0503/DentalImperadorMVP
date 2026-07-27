import { useState, useEffect } from "react";

interface Product {
  id: string;
  sku: string;
  nome: string;
  categoria: string | null;
  marca: string | null;
  preco_tabela: number | null;
  preco_promocional: number | null;
  ativo: boolean;
  ncm: string | null;
  imagem_url: string | null;
  descricao_html: string | null;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const pageSize = 50;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    fetch(`/api/v1/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => { console.error("Erro products:", e); setLoading(false); });
  }, [categoria]);

  const filtered = products.filter((p) =>
    !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const categorias = [...new Set(products.map((p) => p.categoria).filter(Boolean))] as string[];

  return (
    <div>
      <h1>Produtos</h1>
      <p className="page-subtitle">Listagem completa do catálogo ({products.length} produtos).</p>

      <div className="admin-filters" style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
        />
        <select
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPage(1); }}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">Todas categorias</option>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <p>Carregando...</p> : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>NCM</th>
                  <th>Ativo</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
                    <td>{p.sku}</td>
                    <td>{p.nome}</td>
                    <td>{p.marca ?? "-"}</td>
                    <td>{p.categoria ?? "-"}</td>
                    <td>R$ {(p.preco_promocional ?? p.preco_tabela ?? 0).toFixed(2)}</td>
                    <td>{p.ncm ?? "-"}</td>
                    <td>{p.ativo ? "✅" : "❌"}</td>
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

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.nome}</h2>
            <p style={{ marginBottom: 16, color: "#666" }}>SKU: {selected.sku}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 14 }}>
              <div><strong>Marca:</strong> {selected.marca ?? "-"}</div>
              <div><strong>Categoria:</strong> {selected.categoria ?? "-"}</div>
              <div><strong>Preço Tabela:</strong> R$ {(selected.preco_tabela ?? 0).toFixed(2)}</div>
              <div><strong>Preço Promocional:</strong> R$ {(selected.preco_promocional ?? 0).toFixed(2)}</div>
              <div><strong>NCM:</strong> {selected.ncm ?? "-"}</div>
              <div><strong>Ativo:</strong> {selected.ativo ? "Sim" : "Não"}</div>
            </div>
            {selected.imagem_url && (
              <div style={{ marginTop: 12 }}>
                <img src={selected.imagem_url} alt={selected.nome} style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
              </div>
            )}
            {selected.descricao_html && (
              <div style={{ marginTop: 12 }}>
                <h3>Ficha Técnica</h3>
                <div style={{ fontSize: 13, maxHeight: 200, overflow: "auto", padding: 8, background: "#f9f9f9", borderRadius: 6 }} dangerouslySetInnerHTML={{ __html: selected.descricao_html }} />
              </div>
            )}
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

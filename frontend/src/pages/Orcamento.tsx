import { useState, useEffect } from "react";

interface Product {
  id: string;
  sku: string;
  nome: string;
  categoria: string;
  preco_tabela: number;
  preco_promocional: number | null;
  ncm: string;
  controlado_anvisa: boolean;
}

interface CartItem {
  product: Product;
  quantidade: number;
  usandoPromocional: boolean;
}

const CATEGORIAS = [
  "Restauradores",
  "Moldagem",
  "Adesivos",
  "Anestésicos",
];

function precoEfetivo(p: Product): number {
  return p.preco_promocional ?? p.preco_tabela;
}

export function OrcamentoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProposal, setShowProposal] = useState(false);
  const [listaAcademica, setListaAcademica] = useState(false);

  useEffect(() => {
    const url = categoria
      ? `/api/v1/products?categoria=${categoria}`
      : "/api/v1/products";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoria]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, quantidade: c.quantidade + 1 }
            : c
        );
      }
      return [{ product, quantidade: 1, usandoPromocional: !listaAcademica }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.product.id === productId ? { ...c, quantidade: qty } : c
      )
    );
  };

  const getPreco = (item: CartItem): number =>
    item.usandoPromocional
      ? item.product.preco_promocional ?? item.product.preco_tabela
      : item.product.preco_tabela;

  const total = cart.reduce((sum, c) => sum + getPreco(c) * c.quantidade, 0);

  return (
    <div className="page page-orcamento">
      <h1>Orçamento Automático</h1>
      <p className="page-subtitle">
        Selecione os produtos e gere uma proposta comercial.
      </p>

      <div className="card" style={{ marginBottom: 16, padding: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={listaAcademica} onChange={(e) => setListaAcademica(e.target.checked)} />
          <span>Lista Acadêmica (preço tabela cheia — sem desconto)</span>
        </label>
      </div>

      <div className="orcamento-layout">
        <div className="orcamento-catalogo">
          <div className="orcamento-filtros">
            <label>Filtrar por categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <div key={p.id} className="card product-card">
                  <div className="product-info">
                    <h3>{p.nome}</h3>
                    <p className="product-sku">SKU: {p.sku}</p>
                    <p className="product-categoria">{p.categoria}</p>
                    {p.controlado_anvisa && (
                      <span className="badge-anvisa">Controlado ANVISA</span>
                    )}
                    {listaAcademica || !p.preco_promocional ? (
                      <p className="product-preco">
                        R$ {p.preco_tabela.toFixed(2)}
                      </p>
                    ) : (
                      <p className="product-preco">
                        <span style={{ textDecoration: "line-through", color: "#999", marginRight: 8 }}>
                          R$ {p.preco_tabela.toFixed(2)}
                        </span>
                        <span style={{ color: "#00A650", fontWeight: "bold", fontSize: 20 }}>
                          R$ {p.preco_promocional.toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => addToCart(p)}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="orcamento-cart">
          <h2>Carrinho</h2>
          {cart.length === 0 ? (
            <p className="cart-empty">Nenhum item selecionado.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((c) => (
                  <div key={c.product.id} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{c.product.nome}</strong>
                      <span>R$ {getPreco(c).toFixed(2)}</span>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          updateQty(c.product.id, c.quantidade - 1)
                        }
                      >
                        -
                      </button>
                      <span>{c.quantidade}</span>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          updateQty(c.product.id, c.quantidade + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-outline remove"
                        onClick={() => removeFromCart(c.product.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total:</strong>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowProposal(true)}
                style={{ width: "100%", marginTop: 12 }}
              >
                Gerar Proposta
              </button>
            </>
          )}
        </aside>
      </div>

      {showProposal && (
        <div className="modal-overlay" onClick={() => setShowProposal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Proposta Comercial</h2>
            {listaAcademica && (
              <p style={{ color: "#E31E24", fontWeight: "bold", marginBottom: 12 }}>
                Lista Acadêmica — preço tabela cheia (sem desconto promocional)
              </p>
            )}
            <table className="proposal-table">
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
                {cart.map((c) => (
                  <tr key={c.product.id}>
                    <td>{c.product.nome}</td>
                    <td>{c.product.sku}</td>
                    <td>{c.quantidade}</td>
                    <td>R$ {getPreco(c).toFixed(2)}</td>
                    <td>R$ {(getPreco(c) * c.quantidade).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}><strong>Total</strong></td>
                  <td><strong>R$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p className="proposal-disclaimer">
              Proposta gerada em {new Date().toLocaleDateString("pt-BR")}.
              {listaAcademica
                ? " Preço tabela cheia — sem incidência de descontos promocionais."
                : " Consulte condições especiais com nosso time de vendas."}
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => window.print()}>
                Imprimir
              </button>
              <button className="btn btn-outline" onClick={() => setShowProposal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

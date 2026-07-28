import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { showToast } from "../lib/toast";

interface Customer {
  id: string; nome: string; email: string; telefone: string;
  segmento: string; status: string; origem: string;
  total_gasto: number; ultima_compra: string;
  ticket_cluster: string; frequencia_cluster: string; categorias_compra: string[];
  vendedor_uid: string | null; vendedor_nome: string | null;
  ultimo_contato: string | null; propensao_compra: number; churn_risk: string;
}

interface Vendor {
  uid: string; nome: string; role: string;
}

const COLUMNS = [
  { id: "lead", title: "Leads" },
  { id: "contato", title: "Contato Inicial" },
  { id: "proposta", title: "Proposta" },
  { id: "negociacao", title: "Negociação" },
  { id: "cliente", title: "Clientes" },
  { id: "inativo", title: "Inativos" },
];

const TICKET_LABELS: Record<string, string> = { pequeno: "💰 Pequeno", medio: "💎 Médio", grande: "🏆 Grande" };
const FREQ_LABELS: Record<string, string> = { recorrente: "🔄 Recorrente", sazonal: "📅 Sazonal", inativo: "💤 Inativo" };

export function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [columns, setColumns] = useState<Record<string, Customer[]>>(() => {
    const m: Record<string, Customer[]> = {};
    COLUMNS.forEach((c) => (m[c.id] = []));
    return m;
  });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVendedor, setFilterVendedor] = useState("");
  const [filterCluster, setFilterCluster] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", segmento: "Consultório", origem: "Manual" });

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterVendedor) params.set("vendedor_uid", filterVendedor);
      const res = await fetch(`/api/v1/customers?${params}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch { setLoading(false); }
  }, [filterVendedor]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  useEffect(() => {
    fetch("/api/v1/admin/vendors").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setVendors(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const map: Record<string, Customer[]> = {};
    COLUMNS.forEach((c) => (map[c.id] = []));
    let filtered = [...customers];
    if (filterCluster) {
      filtered = filtered.filter(
        (c) => c.ticket_cluster === filterCluster || c.frequencia_cluster === filterCluster
      );
    }
    for (const c of filtered) {
      const col = map[c.status] ? c.status : "lead";
      map[col].push(c);
    }
    setColumns(map);
  }, [customers, filterCluster]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const s = result.source.droppableId;
    const d = result.destination.droppableId;
    if (s === d) return;
    const src = [...columns[s]];
    const dst = [...columns[d]];
    const [moved] = src.splice(result.source.index, 1);
    moved.status = d;
    dst.splice(result.destination.index, 0, moved);
    setColumns({ ...columns, [s]: src, [d]: dst });
    try {
      await fetch(`/api/v1/customers/${moved.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: d }),
      });
    } catch { fetchCustomers(); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/v1/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, criado_em: new Date().toISOString() }),
      });
      setShowCreate(false);
      setForm({ nome: "", email: "", telefone: "", segmento: "Consultório", origem: "Manual" });
      fetchCustomers();
    } catch (e) { showToast("Erro ao criar cliente"); }
  };

  const handleAssign = async (customerId: string, vendedorUid: string) => {
    const v = vendors.find((v) => v.uid === vendedorUid);
    try {
      await fetch(`/api/v1/crm/customers/${customerId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendedor_uid: vendedorUid, vendedor_nome: v?.nome || "" }),
      });
      fetchCustomers();
    } catch (e) { showToast("Erro ao atribuir vendedor"); }
  };

  const totalCard = (col: Customer[]) =>
    col.reduce((s, c) => s + c.total_gasto, 0);

  if (loading) return <p>Carregando CRM...</p>;

  return (
    <div className="page page-crm">
      <div className="page-header-row">
        <div>
          <h1>CRM / Pipeline de Vendas</h1>
          <p className="page-subtitle">Gestão de leads e clientes com clusterização inteligente.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Novo Lead</button>
      </div>

      <div className="crm-filters" style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select value={filterVendedor} onChange={(e) => setFilterVendedor(e.target.value)}>
          <option value="">Todos vendedores</option>
          {vendors.map((v) => <option key={v.uid} value={v.uid}>{v.nome}</option>)}
        </select>
        <select value={filterCluster} onChange={(e) => setFilterCluster(e.target.value)}>
          <option value="">Todos clusters</option>
          <optgroup label="Ticket">
            <option value="pequeno">💰 Pequeno</option>
            <option value="medio">💎 Médio</option>
            <option value="grande">🏆 Grande</option>
          </optgroup>
          <optgroup label="Frequência">
            <option value="recorrente">🔄 Recorrente</option>
            <option value="sazonal">📅 Sazonal</option>
            <option value="inativo">💤 Inativo</option>
          </optgroup>
        </select>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Novo Lead</h2>
            <form onSubmit={handleCreate} className="campaign-form">
              <label>Nome <input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required /></label>
              <label>Email <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></label>
              <label>Telefone <input value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} /></label>
              <label>Segmento
                <select value={form.segmento} onChange={(e) => setForm({...form, segmento: e.target.value})}>
                  <option>Consultório</option><option>Clínica</option><option>Distribuidor</option><option>Instituição</option><option>Estudante</option>
                </select>
              </label>
              <label>Origem
                <select value={form.origem} onChange={(e) => setForm({...form, origem: e.target.value})}>
                  <option>Manual</option><option>Site</option><option>WhatsApp</option><option>Indicação</option><option>Chatbot</option>
                </select>
              </label>
              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Criar</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowCreate(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <h3>{col.title}</h3>
                <span className="kanban-count">{columns[col.id].length}</span>
              </div>
              <div className="kanban-column-stats">
                R$ {totalCard(columns[col.id]).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className={`kanban-list${snapshot.isDraggingOver ? " dragging-over" : ""}`}>
                    {columns[col.id].map((c, i) => (
                      <Draggable key={c.id} draggableId={c.id} index={i}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            className={`kanban-card${snapshot.isDragging ? " dragging" : ""}`}
                            onClick={() => window.location.href = `/crm/cliente/${c.id}`}>
                            <div className="kanban-card-name">{c.nome}</div>
                            <div className="kanban-card-meta">
                              <span className="kanban-card-segmento">{c.segmento}</span>
                              <span className="kanban-card-origem">{c.origem}</span>
                            </div>
                            {c.ticket_cluster && (
                              <div className="kanban-card-clusters">
                                <span className="kanban-cluster ticket">{TICKET_LABELS[c.ticket_cluster] || c.ticket_cluster}</span>
                                <span className="kanban-cluster freq">{FREQ_LABELS[c.frequencia_cluster] || c.frequencia_cluster}</span>
                              </div>
                            )}
                            <div className="kanban-card-footer">
                              <span>R$ {c.total_gasto.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                              {!c.vendedor_uid ? (
                                <select className="assign-select" value="" onChange={(e) => { e.stopPropagation(); handleAssign(c.id, e.target.value); }}
                                  onClick={(e) => e.stopPropagation()}>
                                  <option value="">Atribuir</option>
                                  {vendors.map((v) => <option key={v.uid} value={v.uid}>{v.nome}</option>)}
                                </select>
                              ) : (
                                <span className="kanban-card-vendedor" title={c.vendedor_nome || ""}>👤 {c.vendedor_nome}</span>
                              )}
                            </div>
                            {c.propensao_compra > 0 && (
                              <div className="kanban-card-score" title="Propensão de compra">
                                <div className="score-bar">
                                  <div className="score-fill" style={{ width: `${c.propensao_compra}%` }} />
                                </div>
                                <span className="score-value">{c.propensao_compra}%</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

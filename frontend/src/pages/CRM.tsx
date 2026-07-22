import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

interface Customer {
  id: string;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  segmento: string;
  limite_credito: number;
  total_gasto: number;
  ultima_compra: string;
  status: string;
  origem: string;
}

const COLUMNS = [
  { id: "lead", title: "Leads" },
  { id: "contato", title: "Contato Inicial" },
  { id: "proposta", title: "Proposta" },
  { id: "negociacao", title: "Negociação" },
  { id: "cliente", title: "Clientes" },
];

export function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [columns, setColumns] = useState<Record<string, Customer[]>>(() => {
    const map: Record<string, Customer[]> = {};
    for (const col of COLUMNS) map[col.id] = [];
    return map;
  });
  const [loading, setLoading] = useState(true);
  const [filterSegmento, setFilterSegmento] = useState("");
  const [filterOrigem, setFilterOrigem] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterSegmento) params.set("segmento", filterSegmento);
      if (filterOrigem) params.set("origem", filterOrigem);
      const url = `/api/v1/customers?${params.toString()}`;
      const res = await fetch(url);
      const data: Customer[] = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      console.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, [filterSegmento, filterOrigem]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const map: Record<string, Customer[]> = {};
    for (const col of COLUMNS) map[col.id] = [];
    for (const c of customers) {
      const col = map[c.status] ? c.status : "lead";
      map[col].push(c);
    }
    setColumns(map);
  }, [customers]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    if (sourceCol === destCol) return;

    const sourceItems = [...columns[sourceCol]];
    const destItems = [...columns[destCol]];
    const [moved] = sourceItems.splice(result.source.index, 1);
    moved.status = destCol;
    destItems.splice(result.destination.index, 0, moved);

    setColumns({ ...columns, [sourceCol]: sourceItems, [destCol]: destItems });

    try {
      await fetch(`/api/v1/customers/${moved.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destCol }),
      });
    } catch {
      fetchCustomers();
    }
  };

  const getTotalGasto = (col: Customer[]) =>
    col.reduce((s, c) => s + c.total_gasto, 0);

  if (loading) return <p>Carregando CRM...</p>;

  return (
    <div className="page page-crm">
      <div className="crm-header">
        <h1>CRM / Pipeline de Leads</h1>
        <div className="crm-filters">
          <select
            value={filterSegmento}
            onChange={(e) => setFilterSegmento(e.target.value)}
          >
            <option value="">Todos segmentos</option>
            <option value="Consultório">Consultório</option>
            <option value="Clínica">Clínica</option>
            <option value="Distribuidor">Distribuidor</option>
            <option value="Instituição">Instituição</option>
          </select>
          <select
            value={filterOrigem}
            onChange={(e) => setFilterOrigem(e.target.value)}
          >
            <option value="">Todas origens</option>
            <option value="Site">Site</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Indicação">Indicação</option>
            <option value="Licitação">Licitação</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <h3>{col.title}</h3>
                <span className="kanban-count">{columns[col.id].length}</span>
              </div>
              <div className="kanban-column-stats">
                <span>R$ {getTotalGasto(columns[col.id]).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-list${snapshot.isDraggingOver ? " dragging-over" : ""}`}
                  >
                    {columns[col.id].map((customer, index) => (
                      <Draggable
                        key={customer.id}
                        draggableId={customer.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`kanban-card${snapshot.isDragging ? " dragging" : ""}`}
                          >
                            <div className="kanban-card-name">{customer.nome}</div>
                            <div className="kanban-card-meta">
                              <span className="kanban-card-segmento">
                                {customer.segmento}
                              </span>
                              <span className="kanban-card-origem">
                                {customer.origem}
                              </span>
                            </div>
                            <div className="kanban-card-footer">
                              <span>R$ {customer.total_gasto.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                              <span className="kanban-card-data">
                                {customer.ultima_compra
                                  ? new Date(customer.ultima_compra).toLocaleDateString("pt-BR")
                                  : ""}
                              </span>
                            </div>
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

import { useState } from "react";
import { ChatWidget } from "../components/chat/ChatWidget";
import { TriagemForm, type TriagemData } from "../components/chat/TriagemForm";
import { API_BASE } from "../lib/api";

export function ChatbotPage() {
  const [triagemComplete, setTriagemComplete] = useState(false);
  const [triagemData, setTriagemData] = useState<TriagemData | null>(null);
  const [leadCreated, setLeadCreated] = useState(false);
  const [vendedorNome, setVendedorNome] = useState("");
  const [creatingLead, setCreatingLead] = useState(false);

  const handleTriagemComplete = async (data: TriagemData) => {
    setTriagemData(data);
    setCreatingLead(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/crm/auto-create-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "demo-key-2026",
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          tipo_solicitacao: data.tipo_solicitacao,
          lista_academica: data.lista_academica,
          origem: "Chatbot",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setVendedorNome(result.vendedor_nome);
        setLeadCreated(true);
      }
    } catch {
      // lead é secundário — chat funciona mesmo sem criar lead
    } finally {
      setCreatingLead(false);
      setTriagemComplete(true);
    }
  };

  return (
    <div className="page page-chatbot">
      <h1>Chatbot Dental Imperador</h1>
      <p className="page-subtitle">
        Tire dúvidas, solicite orçamentos e acompanhe pedidos.
      </p>

      {!triagemComplete ? (
        <div className="card">
          <TriagemForm onComplete={handleTriagemComplete} />
        </div>
      ) : (
        <div className="chatbot-container">
          {leadCreated && vendedorNome && (
            <div className="lead-created-banner">
              <span className="lead-created-icon">&#10003;</span>
              <div>
                <strong>Lead criado com sucesso!</strong>
                <p>
                  {creatingLead
                    ? "Registrando suas informações..."
                    : `Um vendedor entrará em contato em até 24h pelo WhatsApp. Seu contato será com ${vendedorNome}.`}
                </p>
              </div>
            </div>
          )}

          {triagemData && (
            <div className="chatbot-context">
              <span className="badge-info">
                {triagemData.tipo_solicitacao}
              </span>
              <span className="chatbot-user-name">
                {triagemData.nome}
              </span>
            </div>
          )}
          <ChatWidget leadData={triagemData} />
        </div>
      )}
    </div>
  );
}

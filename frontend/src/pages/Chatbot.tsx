import { useState } from "react";
import { ChatWidget } from "../components/chat/ChatWidget";
import { TriagemForm, type TriagemData } from "../components/chat/TriagemForm";

export function ChatbotPage() {
  const [triagemComplete, setTriagemComplete] = useState(false);
  const [triagemData, setTriagemData] = useState<TriagemData | null>(null);

  const handleTriagemComplete = (data: TriagemData) => {
    setTriagemData(data);
    setTriagemComplete(true);
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
          <ChatWidget />
        </div>
      )}
    </div>
  );
}

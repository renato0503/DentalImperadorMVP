import { useEffect, useRef } from "react";
import { useAuth } from "../../lib/auth";

export interface Message {
  id: string;
  remetente: string;
  texto: string;
  criado_em: Date;
}

interface Props {
  messages: Message[];
  loading?: boolean;
}

export function MessageList({ messages, loading }: Props) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="messages-loading">
        <span>Carregando mensagens...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="messages-empty">
        <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
      </div>
    );
  }

  return (
    <div className="messages-list" role="log" aria-live="polite">
      {messages.map((msg) => {
        const isMe = msg.remetente === user?.uid;
        return (
          <div
            key={msg.id}
            className={`message ${isMe ? "message--me" : "message--them"}`}
          >
            <div className="message-bubble">{msg.texto}</div>
            <span className="message-time">
              {msg.criado_em instanceof Date
                ? msg.criado_em.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

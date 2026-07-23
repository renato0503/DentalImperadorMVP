import { useEffect, useRef } from "react";

export interface Message {
  id: string;
  remetente: string;
  texto: string;
  criado_em: Date;
  nome?: string;
}

interface Props {
  messages: Message[];
  loading?: boolean;
  sending?: boolean;
  currentUserId?: string;
  currentUserName?: string;
}

function formatBotText(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>");
  return `<p>${html}</p>`;
}

export function MessageList({ messages, loading, sending, currentUserId, currentUserName }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (loading) {
    return (
      <div className="messages-loading">
        <span>Carregando mensagens...</span>
      </div>
    );
  }

  if (messages.length === 0 && !sending) {
    return (
      <div className="messages-empty">
        <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
      </div>
    );
  }

  return (
    <div className="messages-list" role="log" aria-live="polite">
      {messages.map((msg) => {
        const isBot = msg.remetente === "bot";
        const isMe = !isBot && msg.remetente === currentUserId;
        const time = msg.criado_em instanceof Date
          ? msg.criado_em.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          : "";
        const name = msg.nome || (isBot ? "Dental Imperador" : currentUserName || "Você");

        return (
          <div
            key={msg.id}
            className={`message ${isBot ? "message--bot" : isMe ? "message--me" : "message--them"}`}
          >
            <span className="message-author">{name}</span>
            <div className="message-bubble">
              {isBot ? (
                <div className="message-text formatted" dangerouslySetInnerHTML={{ __html: formatBotText(msg.texto) }} />
              ) : (
                <div className="message-text">{msg.texto}</div>
              )}
            </div>
            <span className="message-time">{time}</span>
          </div>
        );
      })}

      {sending && (
        <div className="message message--bot">
          <span className="message-author">Dental Imperador</span>
          <div className="message-bubble typing-indicator">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

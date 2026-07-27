import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../lib/auth";
import { showToast } from "../../lib/toast";

interface Message {
  id: string;
  texto: string;
  remetente: "bot" | "user" | "humano";
  criado_em: string;
}

export function ClienteChat() {
  const { userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [escalado, setEscalado] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userData) return;
    fetch(`/api/v1/crm/customers/${userData.uid}/timeline`)
      .then((r) => r.json())
      .then((data) => {
        const chat: Message[] = Array.isArray(data)
          ? data.filter((e: any) => e.tipo === "chat" || e.tipo === "lead")
              .map((e: any) => ({
                id: e.id,
                texto: e.descricao,
                remetente: (e.responsavel === "Chatbot" ? "bot" : "user") as "bot" | "user",
                criado_em: e.data,
              }))
          : [];
        setMessages(chat);
      })
      .catch(() => {});
  }, [userData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      texto: text,
      remetente: "user",
      criado_em: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          texto: data.resposta || "Não entendi. Pode reformular?",
          remetente: "bot",
          criado_em: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          texto: "Desculpe, não consegui processar sua mensagem agora.",
          remetente: "bot",
          criado_em: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const escalarParaHumano = () => {
    setEscalado(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sistema-${Date.now()}`,
        texto: "🔔 Seu chamado foi aberto! Um operador irá atender você em breve.",
        remetente: "bot",
        criado_em: new Date().toISOString(),
      },
    ]);
    showToast("Chamado aberto! Um operador vai te atender.");
  };

  return (
    <div className="cliente-page" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>Chat</h1>
      <p style={{ color: "var(--cinza-medio)", fontSize: 13, marginBottom: 12 }}>
        Histórico da sua conversa com nosso assistente
      </p>

      <div className="cliente-chat-messages" style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
        {messages.length === 0 && (
          <p style={{ color: "var(--cinza-medio)", textAlign: "center", marginTop: 40 }}>
            Nenhuma conversa anterior. Envie uma mensagem para começar.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-msg ${msg.remetente === "user" ? "chat-msg-user" : "chat-msg-bot"}`}
          >
            <div className="chat-msg-text">{msg.texto}</div>
            <div className="chat-msg-time">
              {new Date(msg.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
        {sending && <div className="chat-msg chat-msg-bot"><div className="chat-msg-text">Digitando...</div></div>}
        <div ref={bottomRef} />
      </div>

      <div className="cliente-chat-input" style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          className="form-input"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={sending || !input.trim()}>
          Enviar
        </button>
      </div>

      {!escalado && (
        <button
          className="btn btn-sm btn-outline"
          onClick={escalarParaHumano}
          style={{ marginTop: 8, color: "#F59E0B", borderColor: "#F59E0B" }}
        >
          Falar com Humano
        </button>
      )}
    </div>
  );
}

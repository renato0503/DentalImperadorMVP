import { useState, useEffect, useCallback } from "react";
import { showToast } from "../../lib/toast";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { API_BASE } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { MessageList, type Message } from "./MessageList";
import { InputBox } from "./InputBox";
import type { TriagemData } from "./TriagemForm";

interface Props {
  leadData?: TriagemData;
}

function generateId(): string {
  return crypto.randomUUID?.() || `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatWidget({ leadData }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);

  const userId = user?.uid || leadData?.email || generateId();
  const userName = user?.displayName || leadData?.nome || "Visitante";

  const findOrCreateConversation = useCallback(async () => {
    const q = query(
      collection(db, "conversations"),
      where("participantes", "array-contains", userId),
      orderBy("ultima_mensagem_em", "desc"),
      limit(1)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      setConvId(docSnap.id);
      return docSnap.ref;
    }

    const ref = await addDoc(collection(db, "conversations"), {
      participantes: [userId],
      nome: userName,
      email: leadData?.email || null,
      telefone: leadData?.telefone || null,
      tipo_solicitacao: leadData?.tipo_solicitacao || null,
      logado: !!user,
      criado_em: serverTimestamp(),
      ultima_mensagem_em: serverTimestamp(),
    });
    setConvId(ref.id);
    return ref;
  }, [userId, userName, leadData, user]);

  useEffect(() => {
    findOrCreateConversation().then(() => setLoading(false));
  }, [findOrCreateConversation]);

  useEffect(() => {
    if (!convId) return;

    const q = query(
      collection(db, "conversations", convId, "messages"),
      orderBy("criado_em", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        criado_em: d.data().criado_em?.toDate() || new Date(),
      })) as Message[];
      setMessages(msgs);
    });

    return unsub;
  }, [convId]);

  const handleSend = async (text: string) => {
    if (!convId) return;
    setSending(true);

    try {
      await addDoc(
        collection(db, "conversations", convId, "messages"),
        {
          remetente: userId,
          nome: userName,
          texto: text,
          criado_em: serverTimestamp(),
        }
      );

      const result = await fetch(`${API_BASE}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: text,
          contexto: `Assistente de vendas da Dental Imperador. Cliente: ${userName}`,
        }),
      });

      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      const data = await result.json();
      const resposta = data?.resposta;
      if (resposta) {
        await addDoc(
          collection(db, "conversations", convId, "messages"),
          {
            remetente: "bot",
            texto: data.resposta,
            criado_em: serverTimestamp(),
          }
        );
      }
    } catch (error) {
      showToast("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget">
      <MessageList
        messages={messages}
        loading={loading}
        sending={sending}
        currentUserId={userId}
        currentUserName={userName}
      />
      <InputBox onSend={handleSend} disabled={sending} />
    </div>
  );
}

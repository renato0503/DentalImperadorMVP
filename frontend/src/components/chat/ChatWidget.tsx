import { useState, useEffect, useCallback } from "react";
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
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";
import { MessageList, type Message } from "./MessageList";
import { InputBox } from "./InputBox";

export function ChatWidget() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);

  const findOrCreateConversation = useCallback(async () => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participantes", "array-contains", user.uid),
      orderBy("ultima_mensagem_em", "desc"),
      limit(1)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0];
      setConvId(doc.id);
      return doc.ref;
    }

    const ref = await addDoc(collection(db, "conversations"), {
      participantes: [user.uid],
      criado_em: serverTimestamp(),
      ultima_mensagem_em: serverTimestamp(),
    });
    setConvId(ref.id);
    return ref;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    findOrCreateConversation().then(() => setLoading(false));
  }, [user, findOrCreateConversation]);

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
    if (!convId || !user) return;
    setSending(true);

    try {
      await addDoc(
        collection(db, "conversations", convId, "messages"),
        {
          remetente: user.uid,
          texto: text,
          criado_em: serverTimestamp(),
        }
      );

      const fn = getFunctions();
      const callGroq = httpsCallable(fn, "callGroq");
      const result = await callGroq({
        mensagem: text,
        contexto: "Assistente de vendas da Dental Imperador",
      });

      const data = result.data as { resposta: string };
      if (data.resposta) {
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
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="chat-login-prompt">
        <p>Faça login para usar o chat</p>
      </div>
    );
  }

  return (
    <div className="chat-widget">
      <MessageList messages={messages} loading={loading} />
      <InputBox onSend={handleSend} disabled={sending} />
    </div>
  );
}

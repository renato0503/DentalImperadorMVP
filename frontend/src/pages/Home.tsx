import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function HomePage() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const role = userData?.papel || "cliente";
    const dest = { admin: "/gestao", manager: "/gestao", operator: "/operacao", cliente: "/meu-painel" }[role] || "/";
    navigate(dest, { replace: true });
  }, [user, userData, navigate]);

  if (user) return null;

  return (
    <div className="page page-home">
      <section className="hero" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", maxWidth: 600, margin: "0 auto 16px" }}>
          Atendimento odontológico, do primeiríssimo contato à entrega.
        </h1>
        <p className="lead" style={{ maxWidth: 500, margin: "0 auto 32px", color: "var(--cinza-medio)" }}>
          Da Dental Imperador, representante Gnatus em Cuiabá-MT.
          Tire dúvidas, solicite orçamentos e acompanhe pedidos com nosso assistente virtual.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/chatbot" className="btn btn-primary" style={{ fontSize: 18, padding: "14px 32px" }}>
            Falar com o Assistente Virtual
          </a>
          <a href="/orcamento" className="btn btn-outline" style={{ fontSize: 18, padding: "14px 32px" }}>
            Ver Catálogo
          </a>
        </div>
        <div style={{ marginTop: 24 }}>
          <a href="/pedido" style={{ color: "var(--cinza-medio)", fontSize: 14 }}>Já tem um pedido? Acompanhe aqui</a>
        </div>
      </section>
    </div>
  );
}

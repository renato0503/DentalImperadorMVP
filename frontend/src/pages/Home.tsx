import { useState, useEffect } from "react";
import { useAuth, type UserRole } from "../lib/auth";

export function HomePage() {
  const { user, userData } = useAuth();
  const [alerts, setAlerts] = useState(0);
  const [picks, setPicks] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onbStep, setOnbStep] = useState(0);

  useEffect(() => {
    if (user) {
      fetch("/api/v1/notifications/unread-count").then((r) => r.json()).then((d) => setAlerts(d?.total || 0)).catch(() => {});
      fetch("/api/v1/warehouse/picks?status=pendente").then((r) => r.json()).then((d) => setPicks(Array.isArray(d) ? d.length : 0)).catch(() => {});
    }
    const seen = localStorage.getItem("onboarding_seen");
    if (user && !seen) {
      setShowOnboarding(true);
    }
  }, [user]);

  const finishOnboarding = () => {
    localStorage.setItem("onboarding_seen", "1");
    setShowOnboarding(false);
  };

  const role: UserRole = userData?.papel || "cliente";

  const heroContent = () => {
    if (!user) {
      return {
        title: "Atendimento odontológico, do primeiríssimo contato à entrega.",
        lead: "Da Dental Imperador, representante Gnatus em Cuiabá-MT: chatbot inteligente, orçamentos automáticos e gestão de pedidos.",
        cta: [{ label: "Conversar com o assistente", href: "/chatbot", cls: "btn-light" }, { label: "Ver o Dashboard", href: "/dashboard", cls: "btn-outline" }],
      };
    }
    if (role === "admin") {
      return {
        title: `Bom dia! 🎯 ${alerts > 0 ? `${alerts} alertas pendentes` : "Tudo em dia"}`,
        lead: "Visão consolidada da plataforma. Acesse o painel admin para gerenciar.",
        cta: [{ label: "Ir para Admin", href: "/admin", cls: "btn-primary" }, { label: "Ver CRM", href: "/crm", cls: "btn-outline" }],
      };
    }
    if (role === "manager") {
      return {
        title: "Dashboard Comercial 📊",
        lead: "Acompanhe as métricas do time de vendas e as oportunidades do pipeline.",
        cta: [{ label: "Ver Dashboard", href: "/dashboard", cls: "btn-primary" }, { label: "CRM", href: "/crm", cls: "btn-outline" }],
      };
    }
    if (role === "operator") {
      return {
        title: `${picks > 0 ? `${picks} separações pendentes 📦` : "Todas as separações concluídas ✅"}`,
        lead: "Acesse o picking para gerenciar as separações do dia.",
        cta: [{ label: "Ir para Picking", href: "/picking", cls: "btn-primary" }, { label: "Dashboard", href: "/dashboard", cls: "btn-outline" }],
      };
    }
    return {
      title: "Bem-vindo de volta! 👋",
      lead: "Acompanhe seus pedidos, faça orçamentos e converse com nosso assistente.",
      cta: [{ label: "Meu Painel", href: "/meu-painel", cls: "btn-primary" }, { label: "Chatbot", href: "/chatbot", cls: "btn-outline" }],
    };
  };

  const hero = heroContent();

  return (
    <div className="page page-home">
      <section className="hero">
        <h1>{hero.title}</h1>
        <p className="lead">{hero.lead}</p>
        <div className="hero-cta">
          {hero.cta.map((btn, i) => (
            <a key={i} className={`btn ${btn.cls}`} href={btn.href}>{btn.label}</a>
          ))}
        </div>
      </section>

      {!user && (
        <section style={{ textAlign: "center", marginTop: 40 }}>
          <div className="dashboard-grid" style={{ maxWidth: 600, margin: "0 auto" }}>
            <a href="/chatbot" className="card" style={{ textDecoration: "none", cursor: "pointer" }}>
              <h3>💬 Chatbot</h3>
              <p style={{ fontSize: 13, color: "var(--cinza-medio)" }}>Tire dúvidas com IA</p>
            </a>
            <a href="/orcamento" className="card" style={{ textDecoration: "none", cursor: "pointer" }}>
              <h3>📋 Orçamento</h3>
              <p style={{ fontSize: 13, color: "var(--cinza-medio)" }}>Catálogo de produtos</p>
            </a>
            <a href="/pedido" className="card" style={{ textDecoration: "none", cursor: "pointer" }}>
              <h3>📦 Status</h3>
              <p style={{ fontSize: 13, color: "var(--cinza-medio)" }}>Acompanhe pedidos</p>
            </a>
            <a href="/login" className="card" style={{ textDecoration: "none", cursor: "pointer" }}>
              <h3>🔐 Login</h3>
              <p style={{ fontSize: 13, color: "var(--cinza-medio)" }}>Acesse sua conta</p>
            </a>
          </div>
        </section>
      )}

      {showOnboarding && (
        <div className="modal-overlay" onClick={finishOnboarding}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            {onbStep === 0 && (
              <>
                <h2>👋 Bem-vindo à Dental Imperador!</h2>
                <p style={{ margin: "16px 0", lineHeight: 1.6 }}>
                  Essa é sua plataforma completa de atendimento odontológico.
                  Vamos mostrar os principais recursos em 30 segundos.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => setOnbStep(1)}>Começar Tour</button>
                  <button className="btn btn-outline" onClick={finishOnboarding}>Pular</button>
                </div>
              </>
            )}
            {onbStep === 1 && (
              <>
                <h2>📊 Dashboards</h2>
                <p style={{ margin: "16px 0", lineHeight: 1.6 }}>
                  Acompanhe KPIs, métricas de vendas, SLA e desempenho do time
                  nos dashboards administrativos.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={() => setOnbStep(0)}>Voltar</button>
                  <button className="btn btn-primary" onClick={() => setOnbStep(2)}>Próximo</button>
                </div>
              </>
            )}
            {onbStep === 2 && (
              <>
                <h2>👥 CRM Completo</h2>
                <p style={{ margin: "16px 0", lineHeight: 1.6 }}>
                  Gerencie leads, visualize o perfil 360° dos clientes, acompanhe
                  timeline e atribua vendedores.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={() => setOnbStep(1)}>Voltar</button>
                  <button className="btn btn-primary" onClick={() => setOnbStep(3)}>Próximo</button>
                </div>
              </>
            )}
            {onbStep === 3 && (
              <>
                <h2>🔔 Notificações</h2>
                <p style={{ margin: "16px 0", lineHeight: 1.6 }}>
                  O sino no topo da tela mostra alertas de leads, churn e
                  pedidos que precisam de atenção.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={() => setOnbStep(2)}>Voltar</button>
                  <button className="btn btn-primary" onClick={finishOnboarding}>Concluir</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

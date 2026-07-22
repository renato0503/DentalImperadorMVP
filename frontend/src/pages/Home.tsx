export function HomePage() {
  return (
    <div className="page page-home">
      <section className="hero">
        <h1>Atendimento odontológico, do primeiríssimo contato à entrega.</h1>
        <p className="lead">
          Da Dental Imperador, representante <strong>Gnatus</strong> em Cuiabá-MT:
          chatbot inteligente, orçamentos automáticos e gestão de pedidos.
        </p>
        <div className="hero-cta">
          <a className="btn btn-light" href="/chatbot">
            Conversar com o assistente
          </a>
          <a className="btn btn-outline-light" href="/dashboard">
            Ver o Dashboard
          </a>
        </div>
      </section>
    </div>
  );
}

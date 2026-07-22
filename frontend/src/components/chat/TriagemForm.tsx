import { useState, type FormEvent } from "react";

export interface TriagemData {
  nome: string;
  email: string;
  telefone: string;
  tipo_solicitacao: string;
}

interface Props {
  onComplete: (data: TriagemData) => void;
}

const TIPOS = [
  "Orçamento",
  "Status de Pedido",
  "Suporte Técnico",
  "Informações de Produto",
  "Outro",
];

export function TriagemForm({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TriagemData>({
    nome: "",
    email: "",
    telefone: "",
    tipo_solicitacao: "",
  });

  const update = (field: keyof TriagemData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="triagem-form">
      <div className="triagem-header">
        <div className="triagem-steps">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`triagem-step-indicator${s <= step + 1 ? " active" : ""}`}
            >
              {s}
            </div>
          ))}
        </div>
        <p className="triagem-title">Antes de começarmos, precisamos de algumas informações:</p>
      </div>

      <form onSubmit={handleSubmit} className="triagem-fields">
        {step === 0 && (
          <div className="triagem-field">
            <label htmlFor="triagem-nome">Qual seu nome?</label>
            <input
              id="triagem-nome"
              type="text"
              value={data.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Seu nome completo"
              required
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="triagem-field">
            <label htmlFor="triagem-email">Qual seu email?</label>
            <input
              id="triagem-email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="triagem-field">
            <label htmlFor="triagem-telefone">Qual seu telefone?</label>
            <input
              id="triagem-telefone"
              type="tel"
              value={data.telefone}
              onChange={(e) => update("telefone", e.target.value)}
              placeholder="(65) 99999-9999"
              required
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="triagem-field">
            <label htmlFor="triagem-tipo">Como podemos ajudar?</label>
            <select
              id="triagem-tipo"
              value={data.tipo_solicitacao}
              onChange={(e) => update("tipo_solicitacao", e.target.value)}
              required
              autoFocus
            >
              <option value="">Selecione uma opção</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="triagem-actions">
          {step > 0 && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {step < 3 ? "Próximo" : "Iniciar Conversa"}
          </button>
        </div>
      </form>
    </div>
  );
}

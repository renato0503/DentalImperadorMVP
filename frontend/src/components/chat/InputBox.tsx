import { useState, type FormEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputBox({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={disabled}
        aria-label="Mensagem"
        autoFocus
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        aria-label="Enviar"
      >
        Enviar
      </button>
    </form>
  );
}

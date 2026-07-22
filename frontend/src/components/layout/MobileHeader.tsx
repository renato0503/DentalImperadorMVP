interface Props {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: Props) {
  return (
    <header className="mobile-header">
      <a className="mobile-brand" href="/" aria-label="Início">
        <img src="/logodental.png" alt="Dental Imperador" />
        <strong>Dental Imperador</strong>
      </a>
      <div className="mobile-header-actions">
        <button
          className="hamburger"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
          aria-expanded="false"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

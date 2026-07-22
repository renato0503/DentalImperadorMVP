import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { NotificationBell } from "../notifications/NotificationBell";

export function Header() {
  const { user, userData, logout, isAdmin } = useAuth();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Dental Imperador - Início">
          <img
            className="brand-logo"
            src="/logodental.png"
            alt="Dental Imperador"
          />
          <span className="brand-text">
            <strong>Dental Imperador</strong>
            <span>Representante Gnatus · Cuiabá-MT</span>
          </span>
        </a>

        <div className="header-actions">
          {user ? (
            <div className="user-info">
              <span className="user-name">
                {userData?.nome || user.email}
                {isAdmin && <span className="badge-admin">Admin</span>}
              </span>
              <button className="btn btn-sm btn-outline" onClick={logout}>
                Sair
              </button>
            </div>
          ) : (
            <a className="btn btn-primary btn-sm" href="/login">
              Entrar
            </a>
          )}
          <NotificationBell />
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Modo claro" : "Modo escuro"}
            title={dark ? "Modo claro" : "Modo escuro"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

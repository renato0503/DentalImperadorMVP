import { useAuth } from "../lib/auth";

export function PerfilPage() {
  const { user, userData, logout } = useAuth();

  if (!user || !userData) {
    return <p className="empty-state">Faça login para acessar seu perfil.</p>;
  }

  return (
    <div className="page page-perfil">
      <h1>Meu Perfil</h1>
      <p className="page-subtitle">Seus dados e preferências da plataforma.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 20 }}>👤 Dados Pessoais</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Nome</label>
              <strong>{userData.nome}</strong>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Email</label>
              <strong>{userData.email}</strong>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Papel</label>
              <span className="badge-admin" style={{ display: "inline-block", marginTop: 4 }}>
                {userData.papel}
              </span>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>UID (Firebase)</label>
              <code style={{ fontSize: 11, color: "var(--cinza-medio)" }}>{userData.uid}</code>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 20 }}>⚙️ Preferências</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Receber notificações por email</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Notificações push</span>
            </label>
            <hr style={{ border: "none", borderTop: "1px solid var(--borda)" }} />
            <button className="btn btn-outline" onClick={logout} style={{ width: "100%" }}>
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

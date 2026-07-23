import { useState } from "react";
import { useAuth } from "../lib/auth";
import { showToast } from "../lib/toast";

export function PerfilPage() {
  const { user, userData, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(userData?.nome || "");
  const [telefone, setTelefone] = useState(userData?.telefone || "");
  const [saving, setSaving] = useState(false);

  if (!user || !userData) {
    return <p className="empty-state">Faça login para acessar seu perfil.</p>;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/v1/customers/${userData.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone }),
      });
      showToast("Dados atualizados com sucesso!");
      setEditing(false);
    } catch {
      showToast("Erro ao salvar dados");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = () => {
    showToast("Verifique seu email para redefinir a senha");
  };

  return (
    <div className="page page-perfil">
      <h1>Meu Perfil</h1>
      <p className="page-subtitle">Seus dados e preferências da plataforma.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 20 }}>
            👤 Dados Pessoais
            <button
              className="btn btn-sm btn-outline"
              style={{ float: "right", fontSize: 12 }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancelar" : "Editar"}
            </button>
          </h2>

          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Nome</label>
                <input className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Telefone</label>
                <input className="form-input" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
              </div>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          ) : (
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
                <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Telefone</label>
                <strong>{userData.telefone || "—"}</strong>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--cinza-medio)", display: "block" }}>Papel</label>
                <span className="badge-admin" style={{ display: "inline-block", marginTop: 4 }}>
                  {userData.papel}
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h2 style={{ fontSize: 18, marginBottom: 20 }}>🔒 Segurança</h2>
            <button className="btn btn-outline" style={{ width: "100%" }} onClick={handleResetPassword}>
              Alterar Senha
            </button>
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
            </div>
          </div>

          <div className="card">
            <button className="btn btn-danger" style={{ width: "100%" }} onClick={logout}>
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

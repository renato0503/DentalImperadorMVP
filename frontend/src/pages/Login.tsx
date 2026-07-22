import { useState, useEffect, type FormEvent } from "react";
import { useAuth, ROLE_HOME } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

export function LoginPage() {
  const { login, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (userData && !authLoading) {
      navigate(ROLE_HOME[userData.papel] || "/", { replace: true });
    }
  }, [userData, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Email ou senha inválidos");
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) { setError("Informe seu email"); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError("Erro ao enviar email de recuperação");
    }
  };

  if (resetMode) {
    return (
      <div className="page page-login">
        <div className="login-card">
          <h1>Recuperar Senha</h1>
          {resetSent ? (
            <>
              <p style={{ textAlign: "center", color: "var(--green-imperador)", margin: "20px 0" }}>
                ✅ Email de recuperação enviado para {email}
              </p>
              <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => { setResetMode(false); setResetSent(false); }}>
                Voltar ao Login
              </button>
            </>
          ) : (
            <>
              <p style={{ margin: "12px 0", fontSize: 14, color: "var(--cinza-medio)" }}>
                Digite seu email cadastrado para receber o link de recuperação.
              </p>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={handleReset}>
                Enviar Link
              </button>
              <button className="btn btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={() => setResetMode(false)}>
                Voltar
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-login">
      <div className="login-card">
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <button className="btn btn-outline" type="button" style={{ width: "100%", marginTop: 4 }}
            onClick={() => setResetMode(true)}>
            Esqueci minha senha
          </button>
        </form>
      </div>
    </div>
  );
}

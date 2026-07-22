import { useState, useEffect, type FormEvent } from "react";
import { useAuth, ROLE_HOME } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const { login, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        </form>
      </div>
    </div>
  );
}

import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "../../lib/auth";
import { hasPermission, type Resource } from "../../lib/permissions";

interface Props {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ resource, children, fallback }: Props) {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>
        Carregando...
      </div>
    );
  }

  const role: UserRole = userData?.papel || "cliente";

  if (!hasPermission(role, resource)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

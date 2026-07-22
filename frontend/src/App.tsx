import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppShell } from "./components/layout/AppShell";
import { InstallPrompt, OfflineNotice } from "./components/pwa/InstallPrompt";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";

const ChatbotPage = lazy(() => import("./pages/Chatbot").then((m) => ({ default: m.ChatbotPage })));
const DashboardPage = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.DashboardPage })));
const OrcamentoPage = lazy(() => import("./pages/Orcamento").then((m) => ({ default: m.OrcamentoPage })));
const PedidoPage = lazy(() => import("./pages/Pedido").then((m) => ({ default: m.PedidoPage })));
const CRMPage = lazy(() => import("./pages/CRM").then((m) => ({ default: m.CRMPage })));
const CustomerProfile = lazy(() => import("./pages/crm/CustomerProfile").then((m) => ({ default: m.CustomerProfile })));
const ChurnDashboard = lazy(() => import("./pages/churn/ChurnDashboard").then((m) => ({ default: m.ChurnDashboard })));
const CampaignsPage = lazy(() => import("./pages/churn/Campaigns").then((m) => ({ default: m.CampaignsPage })));
const PickingMonitor = lazy(() => import("./pages/warehouse/PickingMonitor").then((m) => ({ default: m.PickingMonitor })));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const MeuPainel = lazy(() => import("./pages/MeuPainel").then((m) => ({ default: m.MeuPainel })));
const SalesMetricsPage = lazy(() => import("./pages/SalesMetrics").then((m) => ({ default: m.SalesMetricsPage })));
const PerfilPage = lazy(() => import("./pages/Perfil").then((m) => ({ default: m.PerfilPage })));

function Loading() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>Carregando...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstallPrompt />
        <OfflineNotice />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={
            <AppShell>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute resource="dashboard"><DashboardPage /></ProtectedRoute>} />
                  <Route path="/orcamento" element={<OrcamentoPage />} />
                  <Route path="/pedido" element={<PedidoPage />} />
                  <Route path="/crm" element={<ProtectedRoute resource="crm"><CRMPage /></ProtectedRoute>} />
                  <Route path="/crm/cliente/:id" element={<ProtectedRoute resource="crm"><CustomerProfile /></ProtectedRoute>} />
                  <Route path="/churn" element={<ProtectedRoute resource="churn"><ChurnDashboard /></ProtectedRoute>} />
                  <Route path="/campanhas" element={<ProtectedRoute resource="campanhas"><CampaignsPage /></ProtectedRoute>} />
                  <Route path="/picking" element={<ProtectedRoute resource="picking"><PickingMonitor /></ProtectedRoute>} />
                  <Route path="/relatorios" element={<ProtectedRoute resource="relatorios"><ReportsPage /></ProtectedRoute>} />
                  <Route path="/metricas-vendas" element={<ProtectedRoute resource="relatorios"><SalesMetricsPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute resource="admin"><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/meu-painel" element={<MeuPainel />} />
                  <Route path="/perfil" element={<PerfilPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AppShell>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

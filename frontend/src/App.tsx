import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppShell } from "./components/layout/AppShell";
import { GestaoLayout } from "./components/layout/GestaoLayout";
import { OperatorLayout } from "./components/layout/OperatorLayout";
import { ClienteLayout } from "./components/layout/ClienteLayout";
import { InstallPrompt, OfflineNotice } from "./components/pwa/InstallPrompt";
import { ToastContainer } from "./components/ToastContainer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { HomePage } from "./pages/Home";

const LoginPage = lazy(() => import("./pages/Login").then((m) => ({ default: m.LoginPage })));
const ChatbotPage = lazy(() => import("./pages/Chatbot").then((m) => ({ default: m.ChatbotPage })));
const OrcamentoPage = lazy(() => import("./pages/Orcamento").then((m) => ({ default: m.OrcamentoPage })));
const PedidoPage = lazy(() => import("./pages/Pedido").then((m) => ({ default: m.PedidoPage })));
const CRMPage = lazy(() => import("./pages/CRM").then((m) => ({ default: m.CRMPage })));
const ChurnDashboard = lazy(() => import("./pages/churn/ChurnDashboard").then((m) => ({ default: m.ChurnDashboard })));
const CampaignsPage = lazy(() => import("./pages/churn/Campaigns").then((m) => ({ default: m.CampaignsPage })));
const PickingMonitor = lazy(() => import("./pages/warehouse/PickingMonitor").then((m) => ({ default: m.PickingMonitor })));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const SyncPanel = lazy(() => import("./pages/admin/SyncPanel").then((m) => ({ default: m.SyncPanel })));
const ProductManager = lazy(() => import("./pages/admin/ProductManager").then((m) => ({ default: m.ProductManager })));
const CustomerTable = lazy(() => import("./pages/admin/CustomerTable").then((m) => ({ default: m.CustomerTable })));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard").then((m) => ({ default: m.ManagerDashboard })));
const SalesMetricsPage = lazy(() => import("./pages/SalesMetrics").then((m) => ({ default: m.SalesMetricsPage })));
const DashboardPage = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.DashboardPage })));
const PerfilPage = lazy(() => import("./pages/Perfil").then((m) => ({ default: m.PerfilPage })));
const ClientePainel = lazy(() => import("./pages/cliente/ClientePainel").then((m) => ({ default: m.ClientePainel })));
const ClientePedidos = lazy(() => import("./pages/cliente/ClientePedidos").then((m) => ({ default: m.ClientePedidos })));
const ClienteOrcamentos = lazy(() => import("./pages/cliente/ClienteOrcamentos").then((m) => ({ default: m.ClienteOrcamentos })));
const ClienteChat = lazy(() => import("./pages/cliente/ClienteChat").then((m) => ({ default: m.ClienteChat })));

function Loading() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>Carregando...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstallPrompt />
        <OfflineNotice />
        <ToastContainer />
        <Routes>
          {/* Gestão Unificada (Admin + Manager) */}
          <Route path="/gestao" element={
            <ProtectedRoute resource="gestao">
              <GestaoLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="crm" element={<ProtectedRoute resource="gestao.crm"><CRMPage /></ProtectedRoute>} />
            <Route path="equipe" element={<ProtectedRoute resource="gestao.equipe"><ManagerDashboard /></ProtectedRoute>} />
            <Route path="churn" element={<ProtectedRoute resource="gestao.churn"><ChurnDashboard /></ProtectedRoute>} />
            <Route path="campanhas" element={<ProtectedRoute resource="gestao.churn"><CampaignsPage /></ProtectedRoute>} />
            <Route path="relatorios" element={<ProtectedRoute resource="gestao.relatorios"><ReportsPage /></ProtectedRoute>} />
            <Route path="metricas" element={<ProtectedRoute resource="gestao.relatorios"><SalesMetricsPage /></ProtectedRoute>} />
            <Route path="produtos" element={<ProtectedRoute resource="gestao"><ProductManager /></ProtectedRoute>} />
            <Route path="clientes" element={<ProtectedRoute resource="gestao"><CustomerTable /></ProtectedRoute>} />
            <Route path="sync" element={<ProtectedRoute resource="gestao.config"><SyncPanel /></ProtectedRoute>} />
            <Route path="usuarios" element={<ProtectedRoute resource="gestao.config"><AdminDashboard /></ProtectedRoute>} />
          </Route>

          {/* Operação (Operador) */}
          <Route path="/operacao" element={
            <ProtectedRoute resource="operacao">
              <OperatorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PickingMonitor />} />
            <Route path="crm" element={<ProtectedRoute resource="operacao.crm"><CRMPage /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute resource="operacao"><DashboardPage /></ProtectedRoute>} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>

          {/* Cliente Logado */}
          <Route path="/cliente" element={
            <ProtectedRoute resource="chatbot">
              <ClienteLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/cliente/painel" replace />} />
            <Route path="painel" element={<ClientePainel />} />
            <Route path="pedidos" element={<ClientePedidos />} />
            <Route path="orcamentos" element={<ClienteOrcamentos />} />
            <Route path="chat" element={<ClienteChat />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>

          {/* Experiência Pública + Redirecionamento de Login */}
          <Route path="*" element={
            <AppShell>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/orcamento" element={<OrcamentoPage />} />
                  <Route path="/pedido" element={<PedidoPage />} />
                  <Route path="/meu-painel" element={<Navigate to="/cliente/painel" replace />} />
                  <Route path="/perfil" element={<Navigate to="/cliente/perfil" replace />} />
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

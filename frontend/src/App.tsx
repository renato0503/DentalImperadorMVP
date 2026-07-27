import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppShell } from "./components/layout/AppShell";
import { GestaoLayout } from "./components/layout/GestaoLayout";
import { OperatorLayout } from "./components/layout/OperatorLayout";
import { InstallPrompt, OfflineNotice } from "./components/pwa/InstallPrompt";
import { ToastContainer } from "./components/ToastContainer";
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
const SyncPanel = lazy(() => import("./pages/admin/SyncPanel").then((m) => ({ default: m.SyncPanel })));
const ProductManager = lazy(() => import("./pages/admin/ProductManager").then((m) => ({ default: m.ProductManager })));
const CustomerTable = lazy(() => import("./pages/admin/CustomerTable").then((m) => ({ default: m.CustomerTable })));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard").then((m) => ({ default: m.ManagerDashboard })));
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
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

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

          {/* Experiência do Cliente (AppShell) */}
          <Route path="*" element={
            <AppShell>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/orcamento" element={<OrcamentoPage />} />
                  <Route path="/pedido" element={<PedidoPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute resource="gestao"><DashboardPage /></ProtectedRoute>} />
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

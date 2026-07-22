import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppShell } from "./components/layout/AppShell";
import { InstallPrompt, OfflineNotice } from "./components/pwa/InstallPrompt";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";

const ChatbotPage = lazy(() => import("./pages/Chatbot").then((m) => ({ default: m.ChatbotPage })));
const DashboardPage = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.DashboardPage })));
const OrcamentoPage = lazy(() => import("./pages/Orcamento").then((m) => ({ default: m.OrcamentoPage })));
const PedidoPage = lazy(() => import("./pages/Pedido").then((m) => ({ default: m.PedidoPage })));
const CRMPage = lazy(() => import("./pages/CRM").then((m) => ({ default: m.CRMPage })));
const ChurnDashboard = lazy(() => import("./pages/churn/ChurnDashboard").then((m) => ({ default: m.ChurnDashboard })));
const CampaignsPage = lazy(() => import("./pages/churn/Campaigns").then((m) => ({ default: m.CampaignsPage })));
const PickingMonitor = lazy(() => import("./pages/warehouse/PickingMonitor").then((m) => ({ default: m.PickingMonitor })));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage").then((m) => ({ default: m.ReportsPage })));

function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>
      Carregando...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstallPrompt />
        <OfflineNotice />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <AppShell>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chatbot" element={<ChatbotPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/orcamento" element={<OrcamentoPage />} />
                    <Route path="/pedido" element={<PedidoPage />} />
                    <Route path="/crm" element={<CRMPage />} />
                    <Route path="/churn" element={<ChurnDashboard />} />
                    <Route path="/campanhas" element={<CampaignsPage />} />
                    <Route path="/picking" element={<PickingMonitor />} />
                    <Route path="/relatorios" element={<ReportsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </AppShell>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

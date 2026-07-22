import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

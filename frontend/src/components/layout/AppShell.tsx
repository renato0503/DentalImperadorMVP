import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileNav } from "./MobileNav";
import { DrawerMenu } from "./DrawerMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>

      {isMobile ? (
        <>
          <MobileHeader onMenuToggle={() => setDrawerOpen(true)} />
          <main className="app-content" id="main-content" role="main">
            {children}
          </main>
          <MobileNav />
          <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
      ) : (
        <>
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="app-content" id="main-content" role="main">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

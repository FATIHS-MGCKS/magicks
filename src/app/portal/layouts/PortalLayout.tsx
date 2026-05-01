import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAccessGate } from "../hooks/useAccessGate";
import { PortalSidebar } from "../components/Sidebar";
import { PortalTopBar } from "../components/TopBar";
import { MigrationBanner } from "../components/MigrationBanner";

export function PortalLayout() {
  const { lock } = useAccessGate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLock = () => {
    void lock();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-zinc-100">
      <div className="flex min-h-screen">
        {/* Desktop sidebar — always visible from lg up */}
        <div className="hidden w-[240px] flex-shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <PortalSidebar />
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative h-full w-[260px] bg-[#0B0B0D]"
              onClick={(e) => e.stopPropagation()}
            >
              <PortalSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <PortalTopBar onLock={handleLock} onToggleSidebar={() => setMobileOpen((v) => !v)} />
          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <MigrationBanner />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

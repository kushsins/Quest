import { Outlet, useLocation } from "react-router-dom";

import { AmbientBackground } from "@/shared/components/layout/AmbientBackground";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { SidebarBackdrop } from "@/shared/components/layout/SidebarBackdrop";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { cn } from "@/shared/lib/utils";

export function AppLayout() {
  const { viewport } = useSidebar();
  const location = useLocation();
  const isMobile = viewport === "mobile";
  const isFullHeightWorkspace = location.pathname.startsWith("/tickets");

  const isTicketsRoute = location.pathname.startsWith("/tickets");
  const mainPanel = (
    <main className="glass-floating flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        className={cn(
          "glass-floating-scroll min-h-0 flex-1",
          isFullHeightWorkspace
            ? "flex flex-col overflow-hidden p-0"
            : "p-6 lg:p-8",
        )}
      >
        <Outlet />
      </div>
    </main>
  );

  const ticketsContent = isMobile ? (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col layout-gap">
      <MobileHeader />
      <Outlet />
    </div>
  ) : (
    <Outlet />
  );

  return (
    /*
     * Full-viewport app shell — fixed height so only the content scrolls.
     * The ambient background is fixed behind all layers via z-index: -1.
     */
    <div className="h-screen overflow-hidden">
      {/* Multi-radial ambient background (fixed, z-index: -1) */}
      <AmbientBackground />

      <SidebarBackdrop />

      {/*
       * Inner layout: tight padding + gap on all sides.
       * h-full explicitly ensures the flex container fills the parent's
       * h-screen so sidebar and main content both stretch to full height.
       */}
      <div className="layout-padding flex h-full layout-gap">
        {/* Desktop / tablet sidebar — not rendered on mobile */}
        {viewport !== "mobile" ? <Sidebar /> : null}

        {isTicketsRoute ? (
          ticketsContent
        ) : isMobile ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col layout-gap">
            <MobileHeader />
            {mainPanel}
          </div>
        ) : (
          mainPanel
        )}
      </div>

      {/* Mobile drawer overlay — rendered outside layout flow */}
      {isMobile ? <Sidebar /> : null}
    </div>
  );
}

import { Outlet } from "react-router-dom";

import { AmbientBackground } from "@/shared/components/layout/AmbientBackground";
import { MobileHeader } from "@/shared/components/layout/MobileHeader";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { SidebarBackdrop } from "@/shared/components/layout/SidebarBackdrop";
import { useSidebar } from "@/shared/hooks/useSidebar";

export function AppLayout() {
  const { viewport } = useSidebar();
  const isMobile = viewport === "mobile";

  const mainPanel = (
    <main className="glass-floating min-h-0 min-w-0 flex-1">
      <div className="glass-floating-scroll p-6 lg:p-8">
        <Outlet />
      </div>
    </main>
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

        {isMobile ? (
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

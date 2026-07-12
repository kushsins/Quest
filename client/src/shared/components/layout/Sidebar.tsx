import { ChevronLeft, LayoutDashboard, Ticket, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { QuestLogo } from "@/shared/components/layout/QuestLogo";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { cn } from "@/shared/lib/utils";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
] as const;

export function Sidebar() {
  const { viewport, isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } =
    useSidebar();

  const isMobile = viewport === "mobile";
  const showLabels = isMobile || !isCollapsed;

  const innerContent = (
    <>
      {/* Logo row */}
      <div
        className={cn(
          "flex shrink-0 items-center py-1",
          showLabels ? "justify-between gap-2" : "justify-center",
        )}
      >
        <QuestLogo
          collapsed={!showLabels}
          onNavigate={isMobile ? closeMobile : undefined}
        />

        {/* Mobile close button */}
        {isMobile ? (
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="glass-subtle flex size-7 shrink-0 items-center justify-center rounded-[var(--control-radius)] text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!showLabels ? item.label : undefined}
            onClick={isMobile ? closeMobile : undefined}
            className={({ isActive }) =>
              cn(
                "nav-item w-full",
                !showLabels && "justify-center px-0",
                isActive && "nav-item-active",
              )
            }
          >
            <item.icon
              className={cn("shrink-0", showLabels ? "size-[1.0625rem]" : "size-[1.125rem]")}
            />
            {showLabels ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="mt-auto flex flex-col gap-2">
        <ThemeToggle collapsed={!showLabels} />

        {/* User profile */}
        <div className="glass-subtle rounded-[var(--control-radius)] px-3 py-2.5">
          <div
            className={cn(
              "flex items-center",
              showLabels ? "gap-2.5" : "justify-center",
            )}
          >
            <div className="flex size-[2.125rem] shrink-0 items-center justify-center rounded-full bg-primary/20 text-[0.6875rem] font-semibold text-primary ring-1 ring-primary/25">
              KS
            </div>
            {showLabels ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] font-medium leading-tight text-foreground">
                  Kushagra Singh
                </p>
                <p className="text-[0.6875rem] leading-tight text-muted-foreground">
                  Admin
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );

  /* ── Mobile overlay drawer ── */
  if (isMobile) {
    return (
      <aside
        aria-hidden={!isMobileOpen}
        className={cn(
          "drawer-transition fixed inset-y-0 left-0 z-50",
          "w-[var(--sidebar-width-expanded)]",
          isMobileOpen
            ? "translate-x-0"
            : "pointer-events-none -translate-x-full",
        )}
      >
        <div className="glass-floating flex h-full flex-col overflow-hidden px-4 py-4">
          {innerContent}
        </div>
      </aside>
    );
  }

  /* ── Desktop / tablet sidebar ── */
  return (
    /*
     * Outer aside is overflow-visible so the collapse toggle can sit
     * on the panel edge. Glass + clip live on the inner shell only.
     */
    <aside
      className={cn(
        "sidebar-transition relative shrink-0",
        isCollapsed
          ? "w-[var(--sidebar-width-collapsed)]"
          : "w-[var(--sidebar-width-expanded)]",
      )}
    >
      <div className="glass-floating h-full">
        {/*
         * Inner wrapper: clips content during width animation.
         * Horizontal padding reduces to px-2 when collapsed so that
         * the 3.5rem (56px) narrow rail has 40px inner width — enough
         * for centered icons (size-10 = 40px fits exactly).
         */}
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden pt-5 pb-4",
            showLabels ? "px-4" : "px-2",
          )}
        >
          {innerContent}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="sidebar-collapse-btn"
      >
        <ChevronLeft
          className={cn(
            "sidebar-collapse-icon size-3",
            isCollapsed && "sidebar-collapse-icon--flipped",
          )}
        />
      </button>
    </aside>
  );
}

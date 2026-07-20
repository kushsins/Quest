import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import {
  DeleteTicketDialog,
  type DeleteTicketTarget,
} from "@/features/tickets/components/DeleteTicketDialog";
import { TicketPanel } from "@/features/tickets/components/TicketPanel";
import { TicketWorkspace } from "@/features/tickets/components/TicketWorkspace";
import { TICKET_PANEL_WIDTH } from "@/features/tickets/constants/ticket.constants";
import { useTicketFilters } from "@/features/tickets/hooks/useTicketFilters";
import { ticketQueryKeys } from "@/features/tickets/hooks/ticketQueryKeys";
import { useTicket, useUsers } from "@/features/tickets/hooks/useTicketQueries";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useResizablePanel } from "@/shared/hooks/useResizablePanel";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { cn } from "@/shared/lib/utils";

export function TicketsLayout() {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const { viewport } = useSidebar();
  const { filters, closeTicketPanel, setTicketView } = useTicketFilters();
  const ticketQuery = useTicket(filters.ticketId);
  const usersQuery = useUsers();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTicketTarget | null>(
    null,
  );

  const canDeleteTicket = hasPermission("DELETE_TICKET");

  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";
  const isDesktop = viewport === "desktop";
  const isOverlayPanel = isMobile || isTablet;
  const isPanelExpanded = filters.view === "expanded";

  const { width, onResizePointerDown } = useResizablePanel({
    storageKey: TICKET_PANEL_WIDTH.storageKey,
    defaultWidth: TICKET_PANEL_WIDTH.default,
    minWidth: TICKET_PANEL_WIDTH.min,
    maxWidth: TICKET_PANEL_WIDTH.max,
  });

  if (!hasPermission("VIEW_TICKETS")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleToggleExpand = () => {
    setTicketView(isPanelExpanded ? "panel" : "expanded");
  };

  const handleRequestDelete = (ticket: DeleteTicketTarget) => {
    setDeleteTarget(ticket);
  };

  const handleTicketDeleted = () => {
    if (deleteTarget?.id === filters.ticketId) {
      closeTicketPanel();
    }

    setDeleteTarget(null);
  };

  const listSection = (
    <section className="glass-floating flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="glass-floating-scroll flex min-h-0 flex-1 flex-col overflow-hidden">
        <TicketWorkspace
          canDeleteTicket={canDeleteTicket}
          onRequestDelete={handleRequestDelete}
        />
      </div>
    </section>
  );

  const ticketPanel = filters.ticketId ? (
    <TicketPanel
      ticketId={filters.ticketId}
      ticket={ticketQuery.data}
      isLoading={ticketQuery.isLoading}
      error={ticketQuery.error}
      users={usersQuery.data ?? []}
      isLoadingUsers={usersQuery.isLoading}
      embedded={isDesktop}
      isOverlay={isOverlayPanel}
      isFullScreen={isMobile}
      isExpanded={isPanelExpanded}
      canDeleteTicket={canDeleteTicket}
      onResizePointerDown={onResizePointerDown}
      onToggleExpand={handleToggleExpand}
      onRequestDelete={() => {
        if (!ticketQuery.data) {
          return;
        }

        handleRequestDelete({
          id: ticketQuery.data.id,
          ticketNumber: ticketQuery.data.ticketNumber,
          title: ticketQuery.data.title,
        });
      }}
      onClose={closeTicketPanel}
      onRetry={() => {
        if (!filters.ticketId) {
          return;
        }

        void queryClient.invalidateQueries({
          queryKey: ticketQueryKeys.detail(filters.ticketId),
        });
      }}
    />
  ) : null;

  if (!isDesktop) {
    return (
      <>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {isMobile ? (
            <main className="glass-floating flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="glass-floating-scroll flex min-h-0 flex-1 flex-col overflow-hidden">
                <TicketWorkspace
                  canDeleteTicket={canDeleteTicket}
                  onRequestDelete={handleRequestDelete}
                />
              </div>
            </main>
          ) : (
            listSection
          )}

          {isTablet && filters.ticketId && !isPanelExpanded ? (
            <button
              type="button"
              aria-label="Close ticket panel"
              className="absolute inset-0 z-10"
              onClick={closeTicketPanel}
            />
          ) : null}

          {isOverlayPanel ? ticketPanel : null}
        </div>

        <DeleteTicketDialog
          ticket={deleteTarget}
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
            }
          }}
          onDeleted={handleTicketDeleted}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 layout-gap lg:flex-row">
      {!isPanelExpanded ? listSection : null}

      {filters.ticketId ? (
        <section
          className={cn(
            "glass-floating drawer-transition relative hidden min-h-0 flex-col overflow-hidden lg:flex",
            isPanelExpanded ? "min-w-0 flex-1" : "shrink-0",
          )}
          style={isPanelExpanded ? undefined : { width }}
        >
          {ticketPanel}
        </section>
      ) : null}
      </div>

      <DeleteTicketDialog
        ticket={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onDeleted={handleTicketDeleted}
      />
    </>
  );
}

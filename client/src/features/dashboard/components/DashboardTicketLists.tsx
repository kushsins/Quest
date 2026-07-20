import { Link } from "react-router-dom";
import { Activity, Plus, Ticket } from "lucide-react";

import { DashboardWidget } from "@/features/dashboard/components/DashboardWidget";
import { DashboardTicketListItem } from "@/features/dashboard/components/DashboardTicketListItem";
import type { DashboardTicketSummary } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

function TicketListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-3 py-2.5">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DashboardMyTicketsProps {
  tickets?: DashboardTicketSummary[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function DashboardMyTickets({
  tickets = [],
  isLoading = false,
  error,
  onRetry,
}: DashboardMyTicketsProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission("VIEW_TICKETS")) {
    return null;
  }

  return (
    <DashboardWidget
      title="My Assigned Tickets"
      description="Tickets currently assigned to you."
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && !error && tickets.length === 0}
      emptyIcon={Ticket}
      emptyTitle="No assigned tickets"
      emptyDescription="You do not have any tickets assigned right now."
      emptyAction={
        <Button variant="outline" size="sm" asChild>
          <Link to="/tickets">Browse tickets</Link>
        </Button>
      }
      onRetry={onRetry}
      skeleton={<TicketListSkeleton />}
    >
      <div className="-mx-1 space-y-1">
        {tickets.map((ticket) => (
          <DashboardTicketListItem
            key={ticket.id}
            ticket={ticket}
            variant="assigned"
          />
        ))}
      </div>
    </DashboardWidget>
  );
}

interface DashboardRecentlyUpdatedProps {
  tickets?: DashboardTicketSummary[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function DashboardRecentlyUpdated({
  tickets = [],
  isLoading = false,
  error,
  onRetry,
}: DashboardRecentlyUpdatedProps) {
  const { hasPermission } = usePermissions();
  const canCreateTicket = hasPermission("CREATE_TICKET");

  if (!hasPermission("VIEW_TICKETS")) {
    return null;
  }

  return (
    <DashboardWidget
      title="Recently Updated Tickets"
      description="Latest ticket changes across the workspace."
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && !error && tickets.length === 0}
      emptyIcon={Activity}
      emptyTitle="No tickets yet"
      emptyDescription="Create the first ticket to start tracking support work."
      emptyAction={
        canCreateTicket ? (
          <Button size="sm" asChild>
            <Link to="/tickets">
              <Plus className="size-4" />
              Create Ticket
            </Link>
          </Button>
        ) : undefined
      }
      onRetry={onRetry}
      skeleton={<TicketListSkeleton />}
    >
      <div className="-mx-1 space-y-1">
        {tickets.map((ticket) => (
          <DashboardTicketListItem
            key={ticket.id}
            ticket={ticket}
            variant="updated"
          />
        ))}
      </div>
    </DashboardWidget>
  );
}

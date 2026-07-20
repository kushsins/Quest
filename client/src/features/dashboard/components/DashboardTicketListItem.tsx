import { useNavigate } from "react-router-dom";

import type { DashboardTicketSummary } from "@/features/dashboard/types/dashboard.types";
import {
  TicketPriorityBadge,
  TicketStatusBadge,
  UserCell,
} from "@/shared/components/tickets/TicketBadges";
import { formatRelativeTime } from "@/shared/utils/formatDate";
import { getTicketUrl } from "@/shared/utils/ticketRoutes";
import { cn } from "@/shared/lib/utils";

type DashboardTicketListVariant = "assigned" | "updated";

interface DashboardTicketListItemProps {
  ticket: DashboardTicketSummary;
  variant: DashboardTicketListVariant;
  className?: string;
}

export function DashboardTicketListItem({
  ticket,
  variant,
  className,
}: DashboardTicketListItemProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        void navigate(getTicketUrl(ticket.id));
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--control-radius)] px-3 py-2.5 text-left transition-colors",
        "hover:bg-[var(--glass-surface-subtle)]",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            #{ticket.ticketNumber}
          </span>
          <span className="truncate text-sm font-medium text-foreground">
            {ticket.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {variant === "assigned" ? (
            <>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
              <span className="text-xs text-muted-foreground">
                Updated {formatRelativeTime(ticket.updatedAt)}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(ticket.updatedAt)}
              </span>
              <UserCell user={ticket.assignee} />
            </>
          )}
        </div>
      </div>
    </button>
  );
}

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";

import { DashboardWidget } from "@/features/dashboard/components/DashboardWidget";
import type { DashboardActivityItem } from "@/features/dashboard/types/dashboard.types";
import { UserAvatar } from "@/shared/components/tickets/TicketBadges";
import {
  buildActivityUserNameLookup,
  formatActivityMessage,
} from "@/shared/utils/formatActivity";
import { formatRelativeTime } from "@/shared/utils/formatDate";
import { getTicketUrl } from "@/shared/utils/ticketRoutes";
import type { UserSummary } from "@/shared/types/ticket.types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DashboardActivityItemRowProps {
  activity: DashboardActivityItem;
  message: string;
}

function DashboardActivityItemRow({
  activity,
  message,
}: DashboardActivityItemRowProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 py-2">
      <UserAvatar user={activity.performedBy} className="size-8 text-[0.6875rem]" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm text-foreground">{message}</p>
          <time
            dateTime={activity.createdAt}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatRelativeTime(activity.createdAt)}
          </time>
        </div>
        <button
          type="button"
          onClick={() => {
            void navigate(getTicketUrl(activity.ticket.id));
          }}
          className={cn(
            "mt-1 text-left text-xs text-primary transition-colors hover:underline",
          )}
        >
          #{activity.ticket.ticketNumber} · {activity.ticket.title}
        </button>
      </div>
    </div>
  );
}

interface DashboardRecentActivityProps {
  activities?: DashboardActivityItem[];
  referencedUsers?: UserSummary[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function DashboardRecentActivity({
  activities = [],
  referencedUsers = [],
  isLoading = false,
  error,
  onRetry,
}: DashboardRecentActivityProps) {
  const userNames = useMemo(
    () => buildActivityUserNameLookup(referencedUsers),
    [referencedUsers],
  );

  return (
    <DashboardWidget
      title="Recent Activity"
      description="Latest ticket events across the workspace."
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && !error && activities.length === 0}
      emptyIcon={Activity}
      emptyTitle="No activity yet"
      emptyDescription="Ticket updates and comments will appear here."
      onRetry={onRetry}
      skeleton={<ActivitySkeleton />}
    >
      <div className="divide-y divide-[var(--glass-border-subtle)]">
        {activities.map((activity) => (
          <DashboardActivityItemRow
            key={activity.id}
            activity={activity}
            message={formatActivityMessage(activity, {
              userNames,
              scope: "dashboard",
            })}
          />
        ))}
      </div>
    </DashboardWidget>
  );
}

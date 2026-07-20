import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
} from "@/features/tickets/constants/ticket.constants";
import type {
  TicketPriority,
  TicketStatus,
  UserSummary,
} from "@/features/tickets/types/ticket.types";
import { cn } from "@/shared/lib/utils";

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return (parts[0] ?? "?").slice(0, 2).toUpperCase();
  }

  const [first, second] = parts;
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase() || "?";
}

export function UserAvatar({
  user,
  className,
}: {
  user: UserSummary;
  className?: string;
}) {
  return (
    <div className="relative shrink-0">
      <div
        title={user.name}
        className={cn(
          "flex size-7 items-center justify-center rounded-full bg-primary/15 text-[0.625rem] font-semibold text-primary ring-1 ring-primary/20",
          className,
        )}
      >
        {getUserInitials(user.name)}
      </div>
    </div>
  );
}

export function UserCell({ user }: { user: UserSummary }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <UserAvatar user={user} />
      <span className="truncate text-sm text-foreground">{user.name}</span>
    </div>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn("ticket-semantic-badge", STATUS_BADGE_CLASS[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn("ticket-semantic-badge", PRIORITY_BADGE_CLASS[priority])}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

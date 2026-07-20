import { Link } from "react-router-dom";
import { Plus, Ticket } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { formatDisplayDate } from "@/shared/utils/formatDate";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

interface DashboardWelcomeProps {
  className?: string;
}

export function DashboardWelcome({ className }: DashboardWelcomeProps) {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const canViewTickets = hasPermission("VIEW_TICKETS");
  const canCreateTicket = hasPermission("CREATE_TICKET");
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div
      className={cn(
        "glass-surface flex flex-col gap-4 rounded-[var(--panel-radius)] p-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">{formatDisplayDate()}</p>
        <h1 className="text-page-title text-foreground">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-page-description">
          Here is a quick overview of your support workload.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {canViewTickets ? (
          <Button variant="outline" asChild>
            <Link to="/tickets">
              <Ticket className="size-4" />
              View Tickets
            </Link>
          </Button>
        ) : null}
        {canCreateTicket ? (
          <Button asChild>
            <Link to="/tickets">
              <Plus className="size-4" />
              Create Ticket
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

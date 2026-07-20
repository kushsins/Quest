import { RefreshCw } from "lucide-react";
import { Navigate } from "react-router-dom";

import { DashboardPriorityDistribution } from "@/features/dashboard/components/DashboardPriorityDistribution";
import { DashboardRecentActivity } from "@/features/dashboard/components/DashboardRecentActivity";
import { DashboardStatGrid } from "@/features/dashboard/components/DashboardStatGrid";
import { DashboardStatusDistribution } from "@/features/dashboard/components/DashboardStatusDistribution";
import {
  DashboardMyTickets,
  DashboardRecentlyUpdated,
} from "@/features/dashboard/components/DashboardTicketLists";
import { DashboardWelcome } from "@/features/dashboard/components/DashboardWelcome";
import { useDashboard } from "@/features/dashboard/hooks/useDashboardQueries";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { ApiClientError } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";

export function DashboardPage() {
  const { hasPermission } = usePermissions();
  const { data, isLoading, error, isFetching, refetch } = useDashboard();

  if (!hasPermission("VIEW_DASHBOARD")) {
    return <Navigate to="/tickets" replace />;
  }

  const apiError = error instanceof ApiClientError ? error : null;
  const showPageError = !isLoading && apiError;

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-end">
        {showPageError ? (
          <div className="flex flex-1 flex-col gap-2 sm:items-end">
            <p className="text-sm text-destructive">{apiError.message}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className={isFetching ? "animate-spin" : ""} />
              Retry
            </Button>
          </div>
        ) : null}
      </div>

      <DashboardWelcome />

      <DashboardStatGrid statistics={data?.statistics} isLoading={isLoading} />

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardRecentActivity
          activities={data?.recentActivity}
          referencedUsers={data?.referencedUsers}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
        <DashboardMyTickets
          tickets={data?.myAssignedTickets}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardRecentlyUpdated
          tickets={data?.recentlyUpdatedTickets}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
        <DashboardStatusDistribution
          distribution={data?.statusDistribution}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </div>

      <DashboardPriorityDistribution
        distribution={data?.priorityDistribution}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
}

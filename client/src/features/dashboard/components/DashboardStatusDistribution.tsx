import { BarChart3 } from "lucide-react";

import {
  buildStatusChartItems,
  DashboardDistributionChart,
} from "@/features/dashboard/components/DashboardDistributionChart";
import { DashboardWidget } from "@/features/dashboard/components/DashboardWidget";
import { STATUS_CHART_ORDER } from "@/features/dashboard/constants/dashboard.constants";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { Skeleton } from "@/shared/components/ui/skeleton";

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

interface DashboardStatusDistributionProps {
  distribution?: DashboardData["statusDistribution"];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function DashboardStatusDistribution({
  distribution,
  isLoading = false,
  error,
  onRetry,
}: DashboardStatusDistributionProps) {
  const items = distribution
    ? buildStatusChartItems(distribution, STATUS_CHART_ORDER)
    : [];
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardWidget
      title="Ticket Status Distribution"
      description="How tickets are distributed across workflow states."
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && !error && total === 0}
      emptyIcon={BarChart3}
      emptyTitle="No ticket data"
      emptyDescription="Status distribution will appear once tickets exist."
      onRetry={onRetry}
      skeleton={<ChartSkeleton />}
    >
      <DashboardDistributionChart
        items={items}
        total={total}
        emptyLabel="No tickets to chart yet."
      />
    </DashboardWidget>
  );
}

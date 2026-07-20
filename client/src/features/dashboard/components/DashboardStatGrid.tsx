import type { ComponentType } from "react";

import { DASHBOARD_STAT_CARDS } from "@/features/dashboard/constants/dashboard.constants";
import type { DashboardStatistics } from "@/features/dashboard/types/dashboard.types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface DashboardStatCardProps {
  label: string;
  subtitle: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}

function DashboardStatCard({
  label,
  subtitle,
  value,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="glass-subtle flex flex-col gap-3 rounded-[var(--panel-radius)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="glass-subtle rounded-[var(--panel-radius)] p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

interface DashboardStatGridProps {
  statistics?: DashboardStatistics;
  isLoading?: boolean;
  className?: string;
}

export function DashboardStatGrid({
  statistics,
  isLoading = false,
  className,
}: DashboardStatGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7",
          className,
        )}
      >
        {DASHBOARD_STAT_CARDS.map((card) => (
          <StatCardSkeleton key={card.key} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7",
        className,
      )}
    >
      {DASHBOARD_STAT_CARDS.map((card) => (
        <DashboardStatCard
          key={card.key}
          label={card.label}
          subtitle={card.subtitle}
          value={statistics?.[card.key] ?? 0}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

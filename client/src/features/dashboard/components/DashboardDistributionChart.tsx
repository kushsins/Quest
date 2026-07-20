import {
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  STATUS_DOT_CLASS,
  STATUS_LABELS,
} from "@/shared/constants/ticketPresentation.constants";
import type { TicketPriority, TicketStatus } from "@/shared/types/ticket.types";
import { cn } from "@/shared/lib/utils";

interface DistributionItem {
  key: string;
  label: string;
  value: number;
  dotClass: string;
}

interface DashboardDistributionChartProps {
  items: DistributionItem[];
  total: number;
  emptyLabel?: string;
}

export function DashboardDistributionChart({
  items,
  total,
  emptyLabel = "No data",
}: DashboardDistributionChartProps) {
  if (total === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;

        return (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", item.dotClass)}
                  aria-hidden="true"
                />
                <span className="truncate text-foreground">{item.label}</span>
              </div>
              <span className="shrink-0 text-muted-foreground">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--glass-surface-subtle)]"
              role="img"
              aria-label={`${item.label}: ${String(item.value)} tickets (${percentage.toFixed(0)}%)`}
            >
              <div
                className={cn("h-full rounded-full transition-all", item.dotClass)}
                style={{ width: `${String(percentage)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function buildStatusChartItems(
  distribution: Record<TicketStatus, number>,
  order: TicketStatus[],
): DistributionItem[] {
  return order.map((status) => ({
    key: status,
    label: STATUS_LABELS[status],
    value: distribution[status],
    dotClass: STATUS_DOT_CLASS[status],
  }));
}

export function buildPriorityChartItems(
  distribution: Record<TicketPriority, number>,
  order: readonly TicketPriority[],
): DistributionItem[] {
  return order.map((priority) => ({
    key: priority,
    label: PRIORITY_LABELS[priority],
    value: distribution[priority],
    dotClass: PRIORITY_DOT_CLASS[priority],
  }));
}

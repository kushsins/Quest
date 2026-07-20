import {
  CheckCircle2,
  CheckSquare,
  OctagonX,
  Shield,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  QUICK_FILTERS,
  type QuickFilterId,
} from "@/features/tickets/constants/ticket.constants";
import { cn } from "@/shared/lib/utils";

const FILTER_ICONS: Partial<Record<QuickFilterId, LucideIcon>> = {
  my: User,
  OPEN: Shield,
  IN_PROGRESS: Sparkles,
  RESOLVED: CheckCircle2,
  CLOSED: CheckSquare,
  CANCELLED: OctagonX,
};

const FILTER_TONES: Partial<Record<QuickFilterId, string>> = {
  OPEN: "quick-filter-tone-open",
  IN_PROGRESS: "quick-filter-tone-progress",
  RESOLVED: "quick-filter-tone-resolved",
  CANCELLED: "quick-filter-tone-cancelled",
};

interface TicketQuickFiltersProps {
  activeFilterId: QuickFilterId;
  counts: Record<QuickFilterId, number | undefined>;
  onSelect: (filterId: QuickFilterId) => void;
}

function formatCount(count: number | undefined): string {
  if (count === undefined) {
    return "—";
  }

  return String(count);
}

export function TicketQuickFilters({
  activeFilterId,
  counts,
  onSelect,
}: TicketQuickFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {QUICK_FILTERS.map((filter) => {
        const isActive = activeFilterId === filter.id;
        const Icon = FILTER_ICONS[filter.id];
        const toneClass = FILTER_TONES[filter.id];

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => {
              onSelect(filter.id);
            }}
            className={cn(
              "quick-filter-card",
              isActive && "quick-filter-card-active",
            )}
          >
            <span
              className={cn("quick-filter-card-label", !isActive && toneClass)}
            >
              {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
              <span className="whitespace-nowrap">{filter.label}</span>
            </span>
            <span className="quick-filter-count-panel">
              {formatCount(counts[filter.id])}
            </span>
          </button>
        );
      })}
    </div>
  );
}

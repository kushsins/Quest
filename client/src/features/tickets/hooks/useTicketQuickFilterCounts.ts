import { useQueries } from "@tanstack/react-query";

import { fetchTickets } from "@/features/tickets/api/tickets.api";
import {
  getQuickFilterParams,
  QUICK_FILTERS,
  type QuickFilterId,
} from "@/features/tickets/constants/ticket.constants";
import { ticketQueryKeys } from "@/features/tickets/hooks/ticketQueryKeys";
import type { TicketListParams } from "@/features/tickets/types/ticket.types";

function buildCountParams(filterId: QuickFilterId): TicketListParams {
  return {
    page: 1,
    limit: 1,
    sortBy: "updatedAt",
    sortOrder: "desc",
    ...getQuickFilterParams(filterId),
  };
}

export function useTicketQuickFilterCounts(): Record<QuickFilterId, number | undefined> {
  const results = useQueries({
    queries: QUICK_FILTERS.map((filter) => ({
      queryKey: ticketQueryKeys.count(filter.id),
      queryFn: () => fetchTickets(buildCountParams(filter.id)),
      staleTime: 60_000,
      select: (data: Awaited<ReturnType<typeof fetchTickets>>) =>
        data.pagination.totalItems,
    })),
  });

  return QUICK_FILTERS.reduce(
    (counts, filter, index) => {
      counts[filter.id] = results[index]?.data;
      return counts;
    },
    {} as Record<QuickFilterId, number | undefined>,
  );
}

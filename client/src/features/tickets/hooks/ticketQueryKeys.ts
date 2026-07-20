import type { TicketListParams } from "@/features/tickets/types/ticket.types";

export const ticketQueryKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketQueryKeys.all, "list"] as const,
  list: (params: TicketListParams) =>
    [...ticketQueryKeys.lists(), params] as const,
  details: () => [...ticketQueryKeys.all, "detail"] as const,
  detail: (ticketId: string) =>
    [...ticketQueryKeys.details(), ticketId] as const,
  users: () => ["users", "list"] as const,
  counts: () => [...ticketQueryKeys.all, "counts"] as const,
  count: (filterId: string) => [...ticketQueryKeys.counts(), filterId] as const,
};

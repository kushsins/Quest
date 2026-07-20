import type { TicketPriority, TicketStatus } from "@prisma/client";

/**
 * V1 accepted limitation: ticket numbers are generated sequentially without
 * row-level locking. Concurrent ticket creation may produce duplicate numbers
 * under race conditions. Acceptable for MVP scope.
 */
export const TICKET_NUMBER_PREFIX = "QST-";
export const TICKET_SORT_FIELDS = [
  "updatedAt",
  "createdAt",
  "title",
  "priority",
  "ticketNumber",
] as const;

export const VALID_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  CANCELLED: [],
};

export function isValidStatusTransition(
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
): boolean {
  if (currentStatus === nextStatus) {
    return true;
  }

  return VALID_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

export const PRIORITY_RANK: Record<TicketPriority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function comparePriority(
  left: TicketPriority,
  right: TicketPriority,
  sortOrder: "asc" | "desc",
): number {
  const difference = PRIORITY_RANK[left] - PRIORITY_RANK[right];
  return sortOrder === "asc" ? difference : -difference;
}

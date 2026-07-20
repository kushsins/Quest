import type {
  TicketListParams,
  TicketPriority,
  TicketSortField,
  TicketStatus,
} from "@/features/tickets/types/ticket.types";
export const TICKET_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const TICKET_PAGE_LIMIT = 10;

export const DEFAULT_TICKET_PAGE_LIMIT = TICKET_PAGE_LIMIT;

export const TICKET_PANEL_WIDTH = {
  storageKey: "quest-ticket-panel-width",
  default: 420,
  min: 320,
  max: 640,
} as const;

export const QUICK_FILTERS = [
  { id: "all", label: "All" },
  { id: "my", label: "My Tickets" },
  { id: "OPEN", label: "Open" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "CLOSED", label: "Closed" },
  { id: "CANCELLED", label: "Cancelled" },
] as const;

export const QUICK_FILTER_SORT_LABELS: Record<string, string> = {
  "updated-desc": "Latest",
  "created-desc": "Recently Created",
  "priority-desc": "Priority",
  "title-asc": "Alphabetical",
};

export type QuickFilterId = (typeof QUICK_FILTERS)[number]["id"];

export const SORT_OPTIONS: {
  id: string;
  label: string;
  sortBy: TicketSortField;
  sortOrder: "asc" | "desc";
}[] = [
  { id: "updated-desc", label: "Recently Updated", sortBy: "updatedAt", sortOrder: "desc" },
  { id: "created-desc", label: "Recently Created", sortBy: "createdAt", sortOrder: "desc" },
  { id: "priority-desc", label: "Priority", sortBy: "priority", sortOrder: "desc" },
  { id: "title-asc", label: "Alphabetical", sortBy: "title", sortOrder: "asc" },
];

export const DEFAULT_SORT_OPTION = SORT_OPTIONS[0] as (typeof SORT_OPTIONS)[number];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export const VALID_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  CANCELLED: [],
};

export function getSelectableStatuses(
  currentStatus: TicketStatus,
): TicketStatus[] {
  const nextStatuses = VALID_STATUS_TRANSITIONS[currentStatus];

  if (nextStatuses.length === 0) {
    return [currentStatus];
  }

  return [currentStatus, ...nextStatuses];
}

export function canChangeTicketStatus(currentStatus: TicketStatus): boolean {
  return VALID_STATUS_TRANSITIONS[currentStatus].length > 0;
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const STATUS_BADGE_CLASS: Record<TicketStatus, string> = {
  OPEN: "ticket-semantic-badge--status-open",
  IN_PROGRESS: "ticket-semantic-badge--status-in-progress",
  RESOLVED: "ticket-semantic-badge--status-resolved",
  CLOSED: "ticket-semantic-badge--status-closed",
  CANCELLED: "ticket-semantic-badge--status-cancelled",
};

export const PRIORITY_BADGE_CLASS: Record<TicketPriority, string> = {
  LOW: "ticket-semantic-badge--priority-low",
  MEDIUM: "ticket-semantic-badge--priority-medium",
  HIGH: "ticket-semantic-badge--priority-high",
  URGENT: "ticket-semantic-badge--priority-urgent",
};

export const STATUS_TEXT_CLASS: Record<TicketStatus, string> = {
  OPEN: "ticket-semantic-text--status-open",
  IN_PROGRESS: "ticket-semantic-text--status-in-progress",
  RESOLVED: "ticket-semantic-text--status-resolved",
  CLOSED: "ticket-semantic-text--status-closed",
  CANCELLED: "ticket-semantic-text--status-cancelled",
};

export const PRIORITY_TEXT_CLASS: Record<TicketPriority, string> = {
  LOW: "ticket-semantic-text--priority-low",
  MEDIUM: "ticket-semantic-text--priority-medium",
  HIGH: "ticket-semantic-text--priority-high",
  URGENT: "ticket-semantic-text--priority-urgent",
};

export const STATUS_DOT_CLASS: Record<TicketStatus, string> = {
  OPEN: "ticket-semantic-dot--status-open",
  IN_PROGRESS: "ticket-semantic-dot--status-in-progress",
  RESOLVED: "ticket-semantic-dot--status-resolved",
  CLOSED: "ticket-semantic-dot--status-closed",
  CANCELLED: "ticket-semantic-dot--status-cancelled",
};

export const PRIORITY_DOT_CLASS: Record<TicketPriority, string> = {
  LOW: "ticket-semantic-dot--priority-low",
  MEDIUM: "ticket-semantic-dot--priority-medium",
  HIGH: "ticket-semantic-dot--priority-high",
  URGENT: "ticket-semantic-dot--priority-urgent",
};

export const PRIORITY_PILL_CLASS: Record<TicketPriority, string> = {
  LOW: "ticket-priority-pill--low",
  MEDIUM: "ticket-priority-pill--medium",
  HIGH: "ticket-priority-pill--high",
  URGENT: "ticket-priority-pill--urgent",
};

export function getQuickFilterParams(
  filterId: QuickFilterId,
): Pick<TicketListParams, "status" | "assignee"> {
  if (filterId === "all") {
    return {};
  }

  if (filterId === "my") {
    return { assignee: "me" };
  }

  return { status: filterId };
}

export function getActiveQuickFilter(
  status?: TicketStatus,
  assignee?: string,
): QuickFilterId {
  if (assignee === "me") {
    return "my";
  }

  if (status) {
    return status;
  }

  return "all";
}

export type {
  ActivityAction,
  ActivityItem,
  TicketPriority,
  TicketStatus,
  TicketView,
  UserSummary,
} from "@/shared/types/ticket.types";

export type TicketSortField =
  | "updatedAt"
  | "createdAt"
  | "title"
  | "priority"
  | "ticketNumber";

export type SortOrder = "asc" | "desc";

export interface TicketListItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string | null;
  status: import("@/shared/types/ticket.types").TicketStatus;
  priority: import("@/shared/types/ticket.types").TicketPriority;
  reporter: import("@/shared/types/ticket.types").UserSummary;
  assignee: import("@/shared/types/ticket.types").UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  author: import("@/shared/types/ticket.types").UserSummary;
  message: string;
  createdAt: string;
}

export interface TicketDetail extends TicketListItem {
  comments: CommentItem[];
  activities: import("@/shared/types/ticket.types").ActivityItem[];
}

export interface CreateTicketResult {
  id: string;
  ticketNumber: string;
}

export interface TicketListParams {
  page: number;
  limit: number;
  search?: string;
  status?: import("@/shared/types/ticket.types").TicketStatus;
  priority?: import("@/shared/types/ticket.types").TicketPriority;
  assignee?: string;
  reporter?: string;
  sortBy: TicketSortField;
  sortOrder: SortOrder;
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  priority?: import("@/shared/types/ticket.types").TicketPriority;
  assigneeId?: string | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: import("@/shared/types/ticket.types").TicketStatus;
  priority?: import("@/shared/types/ticket.types").TicketPriority;
  assigneeId?: string;
  reporterId?: string;
}

export interface AddCommentInput {
  message: string;
}

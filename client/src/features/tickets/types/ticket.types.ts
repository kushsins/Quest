export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "COMMENT_ADDED";

export type TicketSortField =
  | "updatedAt"
  | "createdAt"
  | "title"
  | "priority"
  | "ticketNumber";

export type SortOrder = "asc" | "desc";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

export interface TicketListItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  reporter: UserSummary;
  assignee: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  action: ActivityAction;
  fieldName: string | null;
  previousValue: string | null;
  newValue: string | null;
  performedBy: UserSummary;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  author: UserSummary;
  message: string;
  createdAt: string;
}

export interface TicketDetail extends TicketListItem {
  comments: CommentItem[];
  activities: ActivityItem[];
}

export interface CreateTicketResult {
  id: string;
  ticketNumber: string;
}

export interface TicketListParams {
  page: number;
  limit: number;
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string;
  sortBy: TicketSortField;
  sortOrder: SortOrder;
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  priority?: TicketPriority;
  assigneeId?: string | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  reporterId?: string;
}

export interface AddCommentInput {
  message: string;
}

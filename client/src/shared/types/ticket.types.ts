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

export type TicketView = "panel" | "expanded";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
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

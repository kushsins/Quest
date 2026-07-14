import type { ActivityAction, Ticket, TicketPriority, TicketStatus } from "@prisma/client";

import type { UserSummary } from "../../shared/types/user.types.js";

export type { UserSummary };

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

export type TicketWithUsers = Ticket & {
  reporter: UserSummary;
  assignee: UserSummary;
};

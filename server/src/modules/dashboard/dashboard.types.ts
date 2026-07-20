import type { ActivityAction, TicketPriority, TicketStatus } from "@prisma/client";

import type { UserSummary } from "../../shared/types/user.types.js";

export interface DashboardStatistics {
  totalTickets: number;
  myTickets: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  cancelled: number;
}

export interface DashboardTicketSummary {
  id: string;
  ticketNumber: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: UserSummary;
  updatedAt: string;
}

export interface DashboardActivityItem {
  id: string;
  action: ActivityAction;
  fieldName: string | null;
  previousValue: string | null;
  newValue: string | null;
  performedBy: UserSummary;
  createdAt: string;
  ticket: {
    id: string;
    ticketNumber: string;
    title: string;
  };
}

export interface DashboardData {
  statistics: DashboardStatistics;
  statusDistribution: Record<TicketStatus, number>;
  priorityDistribution: Record<TicketPriority, number>;
  recentActivity: DashboardActivityItem[];
  myAssignedTickets: DashboardTicketSummary[];
  recentlyUpdatedTickets: DashboardTicketSummary[];
  referencedUsers: UserSummary[];
}

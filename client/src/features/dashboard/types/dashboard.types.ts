import type {
  ActivityItem,
  TicketPriority,
  TicketStatus,
  UserSummary,
} from "@/shared/types/ticket.types";

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

export interface DashboardActivityItem extends ActivityItem {
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

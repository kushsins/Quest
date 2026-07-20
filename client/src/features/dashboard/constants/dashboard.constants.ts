import type { LucideIcon } from "lucide-react";
import {
  Ban,
  CheckCircle2,
  CircleDot,
  LoaderCircle,
  Ticket,
  UserRound,
} from "lucide-react";

import type { DashboardStatistics } from "@/features/dashboard/types/dashboard.types";
import type { TicketStatus } from "@/shared/types/ticket.types";

export const DASHBOARD_TICKET_LIMIT = 5;
export const DASHBOARD_ACTIVITY_LIMIT = 15;

export interface DashboardStatConfig {
  key: keyof DashboardStatistics;
  label: string;
  subtitle: string;
  icon: LucideIcon;
}

export const DASHBOARD_STAT_CARDS: DashboardStatConfig[] = [
  {
    key: "totalTickets",
    label: "Total Tickets",
    subtitle: "Across all statuses",
    icon: Ticket,
  },
  {
    key: "open",
    label: "Open",
    subtitle: "Awaiting action",
    icon: CircleDot,
  },
  {
    key: "inProgress",
    label: "In Progress",
    subtitle: "Currently being worked",
    icon: LoaderCircle,
  },
  {
    key: "resolved",
    label: "Resolved",
    subtitle: "Ready to close",
    icon: CheckCircle2,
  },
  {
    key: "closed",
    label: "Closed",
    subtitle: "Completed tickets",
    icon: CheckCircle2,
  },
  {
    key: "cancelled",
    label: "Cancelled",
    subtitle: "No longer active",
    icon: Ban,
  },
  {
    key: "myTickets",
    label: "My Assigned",
    subtitle: "Assigned to you",
    icon: UserRound,
  },
];

export const STATUS_CHART_ORDER: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

export const PRIORITY_CHART_ORDER = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

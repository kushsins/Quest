import type { TicketPriority, TicketStatus } from "@/shared/types/ticket.types";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

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

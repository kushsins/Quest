import {
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/features/tickets/constants/ticket.constants";
import type {
  ActivityItem,
  TicketDetail,
  UserSummary,
} from "@/features/tickets/types/ticket.types";

function formatFieldLabel(fieldName: string): string {
  switch (fieldName) {
    case "status":
      return "Status";
    case "priority":
      return "Priority";
    case "assigneeId":
    case "assignee":
      return "Assignee";
    case "reporterId":
    case "reporter":
      return "Reporter";
    case "title":
      return "Title";
    case "description":
      return "Description";
    default:
      return fieldName;
  }
}

function isUserReferenceField(fieldName: string): boolean {
  return (
    fieldName === "assignee" ||
    fieldName === "assigneeId" ||
    fieldName === "reporter" ||
    fieldName === "reporterId"
  );
}

export function buildActivityUserNameLookup(
  users: UserSummary[],
  ticket?: TicketDetail,
): Map<string, string> {
  const lookup = new Map<string, string>();

  for (const user of users) {
    lookup.set(user.id, user.name);
  }

  if (ticket) {
    lookup.set(ticket.reporter.id, ticket.reporter.name);
    lookup.set(ticket.assignee.id, ticket.assignee.name);
  }

  return lookup;
}

function formatFieldValue(
  fieldName: string,
  value: string | null,
  userNames?: Map<string, string>,
): string {
  if (!value) {
    return "None";
  }

  if (fieldName === "status" && value in STATUS_LABELS) {
    return STATUS_LABELS[value as keyof typeof STATUS_LABELS];
  }

  if (fieldName === "priority" && value in PRIORITY_LABELS) {
    return PRIORITY_LABELS[value as keyof typeof PRIORITY_LABELS];
  }

  if (isUserReferenceField(fieldName)) {
    return userNames?.get(value) ?? "Unknown user";
  }

  return value;
}

export function formatActivityMessage(
  activity: ActivityItem,
  options?: { userNames?: Map<string, string> },
): string {
  const actor = activity.performedBy.name;
  const userNames = options?.userNames;

  switch (activity.action) {
    case "CREATED":
      return `${actor} created this ticket`;
    case "COMMENT_ADDED":
      return `${actor} added a comment`;
    case "DELETED":
      return `${actor} deleted this ticket`;
    case "UPDATED": {
      if (!activity.fieldName) {
        return `${actor} updated this ticket`;
      }

      const field = formatFieldLabel(activity.fieldName);
      const previous = formatFieldValue(
        activity.fieldName,
        activity.previousValue,
        userNames,
      );
      const next = formatFieldValue(
        activity.fieldName,
        activity.newValue,
        userNames,
      );

      return `${actor} changed ${field} from ${previous} to ${next}`;
    }
    default:
      return `${actor} performed an action`;
  }
}

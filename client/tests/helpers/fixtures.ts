import type { ActivityItem, UserSummary } from "@/shared/types/ticket.types";

export function makeUser(overrides: Partial<UserSummary> = {}): UserSummary {
  return {
    id: "user-1",
    name: "Ada Lovelace",
    email: "ada@quest.com",
    role: { id: 2, name: "Member" },
    ...overrides,
  };
}

export function makeActivity(
  overrides: Partial<ActivityItem> = {},
): ActivityItem {
  return {
    id: "activity-1",
    action: "CREATED",
    fieldName: null,
    previousValue: null,
    newValue: null,
    performedBy: makeUser(),
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

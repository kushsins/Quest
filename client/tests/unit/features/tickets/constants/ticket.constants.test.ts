import { describe, expect, it } from "vitest";

import {
  canChangeTicketStatus,
  getActiveQuickFilter,
  getQuickFilterParams,
  getSelectableStatuses,
  VALID_STATUS_TRANSITIONS,
} from "@/features/tickets/constants/ticket.constants";
import type { TicketStatus } from "@/features/tickets/types/ticket.types";

describe("getQuickFilterParams", () => {
  it("returns no filters for 'all'", () => {
    expect(getQuickFilterParams("all")).toEqual({});
  });

  it("maps 'my' to assignee=me", () => {
    expect(getQuickFilterParams("my")).toEqual({ assignee: "me" });
  });

  it("maps a status filter to a status param", () => {
    expect(getQuickFilterParams("OPEN")).toEqual({ status: "OPEN" });
    expect(getQuickFilterParams("CANCELLED")).toEqual({ status: "CANCELLED" });
  });
});

describe("getActiveQuickFilter", () => {
  it("prioritizes 'my' when the assignee is me", () => {
    expect(getActiveQuickFilter("OPEN", "me")).toBe("my");
  });

  it("returns the status when set and assignee is not me", () => {
    expect(getActiveQuickFilter("RESOLVED", undefined)).toBe("RESOLVED");
  });

  it("returns 'all' when nothing is active", () => {
    expect(getActiveQuickFilter(undefined, undefined)).toBe("all");
  });
});

describe("getSelectableStatuses", () => {
  it("includes the current status followed by valid transitions", () => {
    expect(getSelectableStatuses("OPEN")).toEqual([
      "OPEN",
      "IN_PROGRESS",
      "CANCELLED",
    ]);
    expect(getSelectableStatuses("IN_PROGRESS")).toEqual([
      "IN_PROGRESS",
      "RESOLVED",
      "CANCELLED",
    ]);
    expect(getSelectableStatuses("RESOLVED")).toEqual(["RESOLVED", "CLOSED"]);
  });

  it("returns only the current status for terminal states", () => {
    expect(getSelectableStatuses("CLOSED")).toEqual(["CLOSED"]);
    expect(getSelectableStatuses("CANCELLED")).toEqual(["CANCELLED"]);
  });
});

describe("canChangeTicketStatus", () => {
  it("is true when transitions exist", () => {
    expect(canChangeTicketStatus("OPEN")).toBe(true);
    expect(canChangeTicketStatus("IN_PROGRESS")).toBe(true);
    expect(canChangeTicketStatus("RESOLVED")).toBe(true);
  });

  it("is false for terminal states", () => {
    expect(canChangeTicketStatus("CLOSED")).toBe(false);
    expect(canChangeTicketStatus("CANCELLED")).toBe(false);
  });

  it("agrees with the transition table for every status", () => {
    const statuses = Object.keys(VALID_STATUS_TRANSITIONS) as TicketStatus[];

    for (const status of statuses) {
      expect(canChangeTicketStatus(status)).toBe(
        VALID_STATUS_TRANSITIONS[status].length > 0,
      );
    }
  });
});

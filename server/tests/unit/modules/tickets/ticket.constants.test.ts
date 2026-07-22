import { describe, expect, it } from "vitest";

import {
  VALID_STATUS_TRANSITIONS,
  comparePriority,
  isValidStatusTransition,
} from "../../../../src/modules/tickets/ticket.constants.js";

describe("isValidStatusTransition", () => {
  it("allows every documented transition from the workflow map", () => {
    for (const [currentStatus, nextStatuses] of Object.entries(
      VALID_STATUS_TRANSITIONS,
    )) {
      for (const nextStatus of nextStatuses) {
        expect(
          isValidStatusTransition(
            currentStatus as keyof typeof VALID_STATUS_TRANSITIONS,
            nextStatus,
          ),
        ).toBe(true);
      }
    }
  });

  it("allows a ticket to remain in the same status", () => {
    expect(isValidStatusTransition("OPEN", "OPEN")).toBe(true);
    expect(isValidStatusTransition("CLOSED", "CLOSED")).toBe(true);
  });

  it("rejects skipping workflow steps", () => {
    expect(isValidStatusTransition("OPEN", "RESOLVED")).toBe(false);
    expect(isValidStatusTransition("OPEN", "CLOSED")).toBe(false);
    expect(isValidStatusTransition("IN_PROGRESS", "CLOSED")).toBe(false);
  });

  it("rejects transitions from terminal statuses", () => {
    expect(isValidStatusTransition("CLOSED", "OPEN")).toBe(false);
    expect(isValidStatusTransition("CLOSED", "IN_PROGRESS")).toBe(false);
    expect(isValidStatusTransition("CANCELLED", "OPEN")).toBe(false);
    expect(isValidStatusTransition("CANCELLED", "IN_PROGRESS")).toBe(false);
  });

  it("rejects reopening resolved tickets directly to open", () => {
    expect(isValidStatusTransition("RESOLVED", "OPEN")).toBe(false);
    expect(isValidStatusTransition("RESOLVED", "IN_PROGRESS")).toBe(false);
  });
});

describe("comparePriority", () => {
  it("orders priorities from low to high when sort order is ascending", () => {
    expect(comparePriority("LOW", "MEDIUM", "asc")).toBeLessThan(0);
    expect(comparePriority("MEDIUM", "HIGH", "asc")).toBeLessThan(0);
    expect(comparePriority("HIGH", "URGENT", "asc")).toBeLessThan(0);
    expect(comparePriority("URGENT", "LOW", "asc")).toBeGreaterThan(0);
  });

  it("orders priorities from high to low when sort order is descending", () => {
    expect(comparePriority("URGENT", "LOW", "desc")).toBeLessThan(0);
    expect(comparePriority("LOW", "URGENT", "desc")).toBeGreaterThan(0);
  });

  it("returns zero when both priorities are equal", () => {
    expect(comparePriority("MEDIUM", "MEDIUM", "asc")).toBe(0);
    expect(comparePriority("HIGH", "HIGH", "desc")).not.toBeGreaterThan(0);
    expect(comparePriority("HIGH", "HIGH", "desc")).not.toBeLessThan(0);
  });
});

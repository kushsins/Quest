import { TicketPriority, TicketStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
} from "../../../../src/modules/tickets/ticket.validation.js";
import { VALID_UUID } from "../../../helpers/fixtures.js";

describe("ticketIdParamSchema", () => {
  it("accepts a valid ticket id", () => {
    const result = ticketIdParamSchema.parse({ id: VALID_UUID });

    expect(result.id).toBe(VALID_UUID);
  });

  it("rejects an invalid ticket id", () => {
    expect(() => ticketIdParamSchema.parse({ id: "not-a-uuid" })).toThrow();
  });
});

describe("createTicketSchema", () => {
  it("accepts a valid create ticket payload", () => {
    const result = createTicketSchema.parse({
      title: "Login page broken",
      description: "Users cannot sign in.",
      priority: TicketPriority.HIGH,
      assigneeId: VALID_UUID,
    });

    expect(result).toEqual({
      title: "Login page broken",
      description: "Users cannot sign in.",
      priority: TicketPriority.HIGH,
      assigneeId: VALID_UUID,
    });
  });

  it("trims the title and allows optional fields to be omitted", () => {
    const result = createTicketSchema.parse({
      title: "  Trimmed title  ",
    });

    expect(result.title).toBe("Trimmed title");
    expect(result.description).toBeUndefined();
    expect(result.priority).toBeUndefined();
    expect(result.assigneeId).toBeUndefined();
  });

  it("rejects an empty title", () => {
    expect(() => createTicketSchema.parse({ title: "   " })).toThrow(
      /Title is required/,
    );
  });

  it("rejects a title longer than 255 characters", () => {
    expect(() =>
      createTicketSchema.parse({ title: "a".repeat(256) }),
    ).toThrow(/255 characters/);
  });

  it("rejects an invalid assignee id", () => {
    expect(() =>
      createTicketSchema.parse({
        title: "Valid title",
        assigneeId: "invalid",
      }),
    ).toThrow(/valid assignee id/);
  });
});

describe("updateTicketSchema", () => {
  it("accepts a patch with at least one defined field", () => {
    const result = updateTicketSchema.parse({
      status: TicketStatus.IN_PROGRESS,
    });

    expect(result.status).toBe(TicketStatus.IN_PROGRESS);
  });

  it("rejects an empty patch", () => {
    expect(() => updateTicketSchema.parse({})).toThrow(
      /At least one field is required/,
    );
  });

  it("rejects an invalid status value", () => {
    expect(() =>
      updateTicketSchema.parse({ status: "INVALID_STATUS" }),
    ).toThrow();
  });

  it("rejects an invalid reporter id", () => {
    expect(() =>
      updateTicketSchema.parse({ reporterId: "not-a-uuid" }),
    ).toThrow(/valid reporter id/);
  });
});

describe("listTicketsQuerySchema", () => {
  it("applies default pagination and sorting values", () => {
    const result = listTicketsQuerySchema.parse({});

    expect(result).toEqual({
      page: 1,
      limit: 20,
      sortBy: "updatedAt",
      sortOrder: "desc",
    });
  });

  it("coerces numeric query parameters", () => {
    const result = listTicketsQuerySchema.parse({
      page: "2",
      limit: "10",
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it("accepts me for assignee and reporter filters", () => {
    const result = listTicketsQuerySchema.parse({
      assignee: "me",
      reporter: "me",
    });

    expect(result.assignee).toBe("me");
    expect(result.reporter).toBe("me");
  });

  it("accepts a uuid for assignee and reporter filters", () => {
    const result = listTicketsQuerySchema.parse({
      assignee: VALID_UUID,
      reporter: VALID_UUID,
    });

    expect(result.assignee).toBe(VALID_UUID);
    expect(result.reporter).toBe(VALID_UUID);
  });

  it("rejects a limit above the maximum", () => {
    expect(() => listTicketsQuerySchema.parse({ limit: 101 })).toThrow();
  });

  it("rejects an unsupported sort field", () => {
    expect(() => listTicketsQuerySchema.parse({ sortBy: "createdBy" })).toThrow();
  });
});

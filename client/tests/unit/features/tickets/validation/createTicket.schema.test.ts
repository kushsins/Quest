import { describe, expect, it } from "vitest";

import { createTicketSchema } from "@/features/tickets/validation/createTicket.schema";

const validUuid = "11111111-1111-4111-8111-111111111111";

describe("createTicketSchema", () => {
  it("accepts a minimal valid ticket", () => {
    const result = createTicketSchema.safeParse({
      title: "Login fails on Safari",
      priority: "MEDIUM",
    });

    expect(result.success).toBe(true);
  });

  it("trims the title", () => {
    const result = createTicketSchema.safeParse({
      title: "  Spacing  ",
      priority: "LOW",
    });

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("Spacing");
  });

  it("rejects an empty title", () => {
    const result = createTicketSchema.safeParse({
      title: "   ",
      priority: "LOW",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Title is required.");
  });

  it("rejects a title over 200 characters", () => {
    const result = createTicketSchema.safeParse({
      title: "a".repeat(201),
      priority: "LOW",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Title must be 200 characters or fewer.",
    );
  });

  it("rejects a description over 5000 characters", () => {
    const result = createTicketSchema.safeParse({
      title: "Valid",
      description: "a".repeat(5001),
      priority: "LOW",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Description must be 5000 characters or fewer.",
    );
  });

  it("rejects an invalid priority", () => {
    const result = createTicketSchema.safeParse({
      title: "Valid",
      priority: "CRITICAL",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty-string assignee (unassigned)", () => {
    const result = createTicketSchema.safeParse({
      title: "Valid",
      priority: "HIGH",
      assigneeId: "",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid uuid assignee", () => {
    const result = createTicketSchema.safeParse({
      title: "Valid",
      priority: "HIGH",
      assigneeId: validUuid,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a non-uuid assignee", () => {
    const result = createTicketSchema.safeParse({
      title: "Valid",
      priority: "HIGH",
      assigneeId: "not-a-uuid",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Please select a valid assignee.",
    );
  });
});

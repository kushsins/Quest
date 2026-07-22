import { describe, expect, it } from "vitest";

import {
  buildActivityUserNameLookup,
  formatActivityMessage,
} from "@/shared/utils/formatActivity";

import { makeActivity, makeUser } from "../../../helpers/fixtures";

describe("buildActivityUserNameLookup", () => {
  it("maps user ids to names", () => {
    const lookup = buildActivityUserNameLookup([
      makeUser({ id: "u1", name: "Grace Hopper" }),
      makeUser({ id: "u2", name: "Alan Turing" }),
    ]);

    expect(lookup.get("u1")).toBe("Grace Hopper");
    expect(lookup.get("u2")).toBe("Alan Turing");
  });

  it("includes the ticket reporter and assignee when provided", () => {
    const lookup = buildActivityUserNameLookup([], {
      reporter: makeUser({ id: "rep", name: "Reporter Person" }),
      assignee: makeUser({ id: "asg", name: "Assignee Person" }),
    });

    expect(lookup.get("rep")).toBe("Reporter Person");
    expect(lookup.get("asg")).toBe("Assignee Person");
  });
});

describe("formatActivityMessage", () => {
  const actor = makeUser({ name: "Ada Lovelace" });

  it("formats a CREATED activity for the ticket scope", () => {
    const message = formatActivityMessage(
      makeActivity({ action: "CREATED", performedBy: actor }),
    );

    expect(message).toBe("Ada Lovelace created this ticket");
  });

  it("uses 'a ticket' in the dashboard scope", () => {
    const message = formatActivityMessage(
      makeActivity({ action: "CREATED", performedBy: actor }),
      { scope: "dashboard" },
    );

    expect(message).toBe("Ada Lovelace created a ticket");
  });

  it("formats comment and delete activities", () => {
    expect(
      formatActivityMessage(
        makeActivity({ action: "COMMENT_ADDED", performedBy: actor }),
      ),
    ).toBe("Ada Lovelace added a comment");

    expect(
      formatActivityMessage(
        makeActivity({ action: "DELETED", performedBy: actor }),
      ),
    ).toBe("Ada Lovelace deleted this ticket");
  });

  it("summarizes a generic UPDATED activity without a field", () => {
    expect(
      formatActivityMessage(
        makeActivity({ action: "UPDATED", performedBy: actor, fieldName: null }),
      ),
    ).toBe("Ada Lovelace updated this ticket");
  });

  it("maps status codes to human labels on change", () => {
    const message = formatActivityMessage(
      makeActivity({
        action: "UPDATED",
        performedBy: actor,
        fieldName: "status",
        previousValue: "OPEN",
        newValue: "IN_PROGRESS",
      }),
    );

    expect(message).toBe(
      "Ada Lovelace changed Status from Open to In Progress",
    );
  });

  it("maps priority codes to human labels on change", () => {
    const message = formatActivityMessage(
      makeActivity({
        action: "UPDATED",
        performedBy: actor,
        fieldName: "priority",
        previousValue: "LOW",
        newValue: "URGENT",
      }),
    );

    expect(message).toBe("Ada Lovelace changed Priority from Low to Urgent");
  });

  it("resolves user reference fields via the name lookup", () => {
    const userNames = new Map<string, string>([["asg-1", "Grace Hopper"]]);

    const message = formatActivityMessage(
      makeActivity({
        action: "UPDATED",
        performedBy: actor,
        fieldName: "assignee",
        previousValue: null,
        newValue: "asg-1",
      }),
      { userNames },
    );

    expect(message).toBe(
      "Ada Lovelace changed Assignee from None to Grace Hopper",
    );
  });

  it("falls back to 'Unknown user' for unresolved user references", () => {
    const message = formatActivityMessage(
      makeActivity({
        action: "UPDATED",
        performedBy: actor,
        fieldName: "reporterId",
        previousValue: "missing",
        newValue: null,
      }),
    );

    expect(message).toBe(
      "Ada Lovelace changed Reporter from Unknown user to None",
    );
  });
});

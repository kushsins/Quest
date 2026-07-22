import { describe, expect, it } from "vitest";

import { authHeader, loginAs } from "../helpers/auth.helper.js";
import { createTestAgent } from "../helpers/app.helper.js";
import { TEST_USERS } from "../helpers/fixtures.js";
import { parseApiError, parseApiSuccess } from "../helpers/response.helper.js";
import { getSeededTestData } from "../setup/integration.setup.js";

interface CreatedTicket {
  id: string;
  ticketNumber: string;
}

interface TicketListItem {
  title: string;
}

interface TicketListData {
  items: TicketListItem[];
}

describe("Permissions integration", () => {
  const agent = createTestAgent();

  it("forbids members from deleting tickets", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const response = await agent
      .delete(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken));

    expect(response.status).toBe(403);
    expect(parseApiError(response.body)).toEqual({
      success: false,
      message: "You don't have permission to perform this action.",
      errors: [],
    });
  });

  it("allows managers to delete tickets", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.manager.email,
      TEST_USERS.manager.password,
    );

    const response = await agent
      .delete(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken));

    expect(response.status).toBe(204);
  });

  it("allows members to create and view tickets", async () => {
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const createResponse = await agent
      .post("/api/v1/tickets")
      .set(authHeader(accessToken))
      .send({
        title: "Member created ticket",
      });

    const createBody = parseApiSuccess<CreatedTicket>(createResponse.body);
    expect(createResponse.status).toBe(201);
    expect(createBody.data.ticketNumber).toEqual(expect.any(String));

    const listResponse = await agent
      .get("/api/v1/tickets")
      .set(authHeader(accessToken));

    const listBody = parseApiSuccess<TicketListData>(listResponse.body);

    expect(listResponse.status).toBe(200);
    expect(listBody.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Member created ticket",
        }),
      ]),
    );
  });

  it("allows managers to update tickets", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.manager.email,
      TEST_USERS.manager.password,
    );

    const response = await agent
      .patch(`/api/v1/tickets/${seeded.inProgressTicketId}`)
      .set(authHeader(accessToken))
      .send({
        priority: "URGENT",
      });

    const body = parseApiSuccess<Record<string, never>>(response.body);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });
});

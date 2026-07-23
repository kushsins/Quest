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

interface TicketDetail {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  reporter: { email: string };
  assignee: { email: string };
  comments: unknown[];
  activities: unknown[];
}

interface TicketListItem {
  ticketNumber: string;
  status: string;
}

interface TicketListData {
  items: TicketListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

describe("Tickets integration", () => {
  const agent = createTestAgent();

  it("creates a ticket with reporter and assignee defaults", async () => {
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const response = await agent
      .post("/api/v1/tickets")
      .set(authHeader(accessToken))
      .send({
        title: "New integration test ticket",
        description: "Created through the tickets API.",
      });

    const body = parseApiSuccess<CreatedTicket>(response.body);

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.ticketNumber).toBe("QST-003");
    expect(typeof body.data.id).toBe("string");
  });

  it("returns ticket details by id", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const response = await agent
      .get(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken));

    const body = parseApiSuccess<TicketDetail>(response.body);

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      id: seeded.openTicketId,
      ticketNumber: seeded.openTicketNumber,
      title: "Integration test open ticket",
      status: "OPEN",
      priority: "MEDIUM",
      reporter: { email: TEST_USERS.member.email },
      assignee: { email: TEST_USERS.member.email },
    });
    expect(body.data.comments).toEqual(expect.any(Array));
    expect(body.data.activities).toEqual(expect.any(Array));
  });

  it("lists tickets with pagination metadata", async () => {
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.manager.email,
      TEST_USERS.manager.password,
    );

    const response = await agent
      .get("/api/v1/tickets")
      .query({ page: 1, limit: 10, status: "OPEN" })
      .set(authHeader(accessToken));

    const body = parseApiSuccess<TicketListData>(response.body);

    expect(response.status).toBe(200);
    expect(body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ticketNumber: "QST-001",
          status: "OPEN",
        }),
      ]),
    );
    expect(body.data.pagination).toEqual({
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    });
  });

  it("updates an allowed ticket field", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const response = await agent
      .patch(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken))
      .send({
        title: "Updated integration test ticket",
      });

    const body = parseApiSuccess<Record<string, never>>(response.body);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);

    const getResponse = await agent
      .get(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken));

    const getBody = parseApiSuccess<TicketDetail>(getResponse.body);
    expect(getBody.data.title).toBe("Updated integration test ticket");
  });

  it("deletes a ticket and returns 404 on subsequent fetch", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.manager.email,
      TEST_USERS.manager.password,
    );

    const deleteResponse = await agent
      .delete(`/api/v1/tickets/${seeded.inProgressTicketId}`)
      .set(authHeader(accessToken));

    expect(deleteResponse.status).toBe(204);

    const getResponse = await agent
      .get(`/api/v1/tickets/${seeded.inProgressTicketId}`)
      .set(authHeader(accessToken));

    expect(getResponse.status).toBe(404);
    expect(parseApiError(getResponse.body).message).toBe("Ticket not found.");
  });

  it("rejects invalid status transitions with a validation error", async () => {
    const seeded = getSeededTestData();
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const response = await agent
      .patch(`/api/v1/tickets/${seeded.openTicketId}`)
      .set(authHeader(accessToken))
      .send({
        status: "CLOSED",
      });

    expect(response.status).toBe(422);
    expect(parseApiError(response.body)).toEqual({
      success: false,
      message:
        "This status change is not allowed for the current ticket workflow.",
      errors: [
        {
          field: "status",
          message:
            "This status change is not allowed for the current ticket workflow.",
        },
      ],
    });
  });
});

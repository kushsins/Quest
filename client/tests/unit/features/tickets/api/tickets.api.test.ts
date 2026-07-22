import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchTickets } from "@/features/tickets/api/tickets.api";
import { getJson } from "@/shared/api/getJson";
import type { TicketListParams } from "@/features/tickets/types/ticket.types";

vi.mock("@/shared/api/getJson", () => ({
  getJson: vi.fn(),
}));

const getJsonMock = vi.mocked(getJson);

function baseParams(overrides: Partial<TicketListParams> = {}): TicketListParams {
  return {
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
    ...overrides,
  };
}

/** Reads the query string that fetchTickets passed to getJson. */
function getRequestedQuery(): URLSearchParams {
  const url = getJsonMock.mock.calls[0]?.[0] ?? "";
  const queryString = url.split("?")[1] ?? "";
  return new URLSearchParams(queryString);
}

describe("fetchTickets query builder", () => {
  beforeEach(() => {
    getJsonMock.mockReset();
    getJsonMock.mockResolvedValue({
      success: true,
      message: "ok",
      data: {
        items: [],
        pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
      },
    });
  });

  it("always sends page, limit, sortBy, and sortOrder", async () => {
    await fetchTickets(baseParams());

    const query = getRequestedQuery();
    expect(query.get("page")).toBe("1");
    expect(query.get("limit")).toBe("10");
    expect(query.get("sortBy")).toBe("updatedAt");
    expect(query.get("sortOrder")).toBe("desc");
  });

  it("omits optional filters when they are undefined", async () => {
    await fetchTickets(baseParams());

    const query = getRequestedQuery();
    expect(query.has("search")).toBe(false);
    expect(query.has("status")).toBe(false);
    expect(query.has("priority")).toBe(false);
    expect(query.has("assignee")).toBe(false);
    expect(query.has("reporter")).toBe(false);
  });

  it("includes every optional filter when provided", async () => {
    await fetchTickets(
      baseParams({
        page: 2,
        limit: 20,
        search: "crash",
        status: "OPEN",
        priority: "HIGH",
        assignee: "a1",
        reporter: "r1",
        sortBy: "title",
        sortOrder: "asc",
      }),
    );

    const query = getRequestedQuery();
    expect(Object.fromEntries(query)).toEqual({
      page: "2",
      limit: "20",
      sortBy: "title",
      sortOrder: "asc",
      search: "crash",
      status: "OPEN",
      priority: "HIGH",
      assignee: "a1",
      reporter: "r1",
    });
  });

  it("requests the /tickets endpoint and returns the response data", async () => {
    const result = await fetchTickets(baseParams());

    expect(getJsonMock.mock.calls[0]?.[0]).toMatch(/^\/tickets\?/);
    expect(result.pagination.totalItems).toBe(0);
  });
});

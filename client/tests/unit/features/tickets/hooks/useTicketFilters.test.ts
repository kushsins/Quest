import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useTicketFilters } from "@/features/tickets/hooks/useTicketFilters";

import { createRouterWrapper } from "../../../../helpers/render";

function renderFilters(initialUrl = "/tickets") {
  return renderHook(() => useTicketFilters(), {
    wrapper: createRouterWrapper([initialUrl]),
  });
}

describe("useTicketFilters", () => {
  describe("parsing defaults", () => {
    it("returns documented defaults when no params are present", () => {
      const { result } = renderFilters();

      expect(result.current.filters).toMatchObject({
        page: 1,
        limit: 10,
        sortBy: "updatedAt",
        sortOrder: "desc",
        view: "panel",
      });
      expect(result.current.filters.search).toBeUndefined();
      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.priority).toBeUndefined();
    });

    it("parses valid params from the URL", () => {
      const { result } = renderFilters(
        "/tickets?search=bug&status=OPEN&priority=HIGH&assignee=me&reporter=r1&sortBy=title&sortOrder=asc&page=3&limit=20&ticketId=t1&view=expanded",
      );

      expect(result.current.filters).toMatchObject({
        search: "bug",
        status: "OPEN",
        priority: "HIGH",
        assignee: "me",
        reporter: "r1",
        sortBy: "title",
        sortOrder: "asc",
        page: 3,
        limit: 20,
        ticketId: "t1",
        view: "expanded",
      });
    });
  });

  describe("sanitizing invalid params", () => {
    it("ignores an unknown status and priority", () => {
      const { result } = renderFilters(
        "/tickets?status=NONSENSE&priority=WHATEVER",
      );

      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.priority).toBeUndefined();
    });

    it("falls back to updatedAt for an unknown sort field", () => {
      const { result } = renderFilters("/tickets?sortBy=explode");

      expect(result.current.filters.sortBy).toBe("updatedAt");
    });

    it("defaults sortOrder to desc for anything other than asc", () => {
      const { result } = renderFilters("/tickets?sortOrder=sideways");

      expect(result.current.filters.sortOrder).toBe("desc");
    });

    it("clamps an invalid page to 1", () => {
      const { result } = renderFilters("/tickets?page=-4");

      expect(result.current.filters.page).toBe(1);
    });

    it("falls back to the default limit for an unsupported page size", () => {
      const { result } = renderFilters("/tickets?limit=999");

      expect(result.current.filters.limit).toBe(10);
    });
  });

  describe("search", () => {
    it("trims search and resets the page", () => {
      const { result } = renderFilters("/tickets?page=5");

      act(() => {
        result.current.setSearch("  urgent  ");
      });

      expect(result.current.filters.search).toBe("urgent");
      expect(result.current.filters.page).toBe(1);
    });

    it("clears search when set to whitespace", () => {
      const { result } = renderFilters("/tickets?search=old");

      act(() => {
        result.current.setSearch("   ");
      });

      expect(result.current.filters.search).toBeUndefined();
    });
  });

  describe("quick filters", () => {
    it("selecting 'my' sets assignee=me and clears status", () => {
      const { result } = renderFilters("/tickets?status=OPEN");

      act(() => {
        result.current.setQuickFilter("my");
      });

      expect(result.current.filters.assignee).toBe("me");
      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.page).toBe(1);
    });

    it("selecting a status clears the assignee", () => {
      const { result } = renderFilters("/tickets?assignee=me");

      act(() => {
        result.current.setQuickFilter("OPEN");
      });

      expect(result.current.filters.status).toBe("OPEN");
      expect(result.current.filters.assignee).toBeUndefined();
    });

    it("selecting 'all' clears both status and assignee", () => {
      const { result } = renderFilters("/tickets?status=OPEN&assignee=me");

      act(() => {
        result.current.setQuickFilter("all");
      });

      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.assignee).toBeUndefined();
    });
  });

  describe("advanced filter setters", () => {
    it("sets and clears priority, resetting the page", () => {
      const { result } = renderFilters("/tickets?page=4");

      act(() => {
        result.current.setPriority("URGENT");
      });
      expect(result.current.filters.priority).toBe("URGENT");
      expect(result.current.filters.page).toBe(1);

      act(() => {
        result.current.setPriority(undefined);
      });
      expect(result.current.filters.priority).toBeUndefined();
    });

    it("sets assignee and reporter", () => {
      const { result } = renderFilters();

      act(() => {
        result.current.setAssignee("a1");
      });
      act(() => {
        result.current.setReporter("r1");
      });

      expect(result.current.filters.assignee).toBe("a1");
      expect(result.current.filters.reporter).toBe("r1");
    });

    it("updates sort field and order and resets the page", () => {
      const { result } = renderFilters("/tickets?page=6");

      act(() => {
        result.current.setSort("priority", "asc");
      });

      expect(result.current.filters.sortBy).toBe("priority");
      expect(result.current.filters.sortOrder).toBe("asc");
      expect(result.current.filters.page).toBe(1);
    });
  });

  describe("pagination", () => {
    it("sets the page without resetting other params", () => {
      const { result } = renderFilters("/tickets?search=bug");

      act(() => {
        result.current.setPage(3);
      });

      expect(result.current.filters.page).toBe(3);
      expect(result.current.filters.search).toBe("bug");
    });

    it("changing page size resets the page to 1", () => {
      const { result } = renderFilters("/tickets?page=8");

      act(() => {
        result.current.setPageSize(50);
      });

      expect(result.current.filters.limit).toBe(50);
      expect(result.current.filters.page).toBe(1);
    });
  });

  describe("ticket panel", () => {
    it("selecting a ticket sets ticketId and resets the view", () => {
      const { result } = renderFilters("/tickets?view=expanded");

      act(() => {
        result.current.setSelectedTicketId("t9");
      });

      expect(result.current.filters.ticketId).toBe("t9");
      expect(result.current.filters.view).toBe("panel");
    });

    it("expanding the panel sets view=expanded", () => {
      const { result } = renderFilters("/tickets?ticketId=t9");

      act(() => {
        result.current.setTicketView("expanded");
      });

      expect(result.current.filters.view).toBe("expanded");
    });

    it("closing the panel clears ticketId and view", () => {
      const { result } = renderFilters("/tickets?ticketId=t9&view=expanded");

      act(() => {
        result.current.closeTicketPanel();
      });

      expect(result.current.filters.ticketId).toBeUndefined();
      expect(result.current.filters.view).toBe("panel");
    });
  });

  describe("clearing filters", () => {
    it("clearFilters removes search, status, and advanced filters", () => {
      const { result } = renderFilters(
        "/tickets?search=x&status=OPEN&priority=HIGH&assignee=a&reporter=r",
      );

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters.search).toBeUndefined();
      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.priority).toBeUndefined();
      expect(result.current.filters.assignee).toBeUndefined();
      expect(result.current.filters.reporter).toBeUndefined();
    });

    it("clearAdvancedFilters keeps search and status", () => {
      const { result } = renderFilters(
        "/tickets?search=keep&status=OPEN&priority=HIGH&assignee=a&reporter=r",
      );

      act(() => {
        result.current.clearAdvancedFilters();
      });

      expect(result.current.filters.search).toBe("keep");
      expect(result.current.filters.status).toBe("OPEN");
      expect(result.current.filters.priority).toBeUndefined();
      expect(result.current.filters.assignee).toBeUndefined();
      expect(result.current.filters.reporter).toBeUndefined();
    });
  });

  describe("listParams", () => {
    it("excludes ticketId and view (API params only)", () => {
      const { result } = renderFilters("/tickets?ticketId=t1&view=expanded");

      expect(result.current.listParams).not.toHaveProperty("ticketId");
      expect(result.current.listParams).not.toHaveProperty("view");
      expect(result.current.listParams).toMatchObject({
        page: 1,
        limit: 10,
        sortBy: "updatedAt",
        sortOrder: "desc",
      });
    });
  });
});

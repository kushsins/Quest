import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  DEFAULT_TICKET_PAGE_LIMIT,
  TICKET_PAGE_SIZE_OPTIONS,
} from "@/features/tickets/constants/ticket.constants";
import type {
  TicketListParams,
  TicketPriority,
  TicketSortField,
  TicketStatus,
} from "@/features/tickets/types/ticket.types";

const TICKET_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

const TICKET_PRIORITIES: TicketPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const SORT_FIELDS: TicketSortField[] = [
  "updatedAt",
  "createdAt",
  "title",
  "priority",
  "ticketNumber",
];

function parseStatus(value: string | null): TicketStatus | undefined {
  if (!value) {
    return undefined;
  }

  return TICKET_STATUSES.includes(value as TicketStatus)
    ? (value as TicketStatus)
    : undefined;
}

function parsePriority(value: string | null): TicketPriority | undefined {
  if (!value) {
    return undefined;
  }

  return TICKET_PRIORITIES.includes(value as TicketPriority)
    ? (value as TicketPriority)
    : undefined;
}

function parseSortField(value: string | null): TicketSortField {
  if (!value) {
    return "updatedAt";
  }

  return SORT_FIELDS.includes(value as TicketSortField)
    ? (value as TicketSortField)
    : "updatedAt";
}

function parseSortOrder(value: string | null): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

function parsePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(
    value ?? String(DEFAULT_TICKET_PAGE_LIMIT),
    10,
  );

  if (
    Number.isNaN(parsed) ||
    !TICKET_PAGE_SIZE_OPTIONS.includes(
      parsed as (typeof TICKET_PAGE_SIZE_OPTIONS)[number],
    )
  ) {
    return DEFAULT_TICKET_PAGE_LIMIT;
  }

  return parsed;
}

export type TicketView = "panel" | "expanded";

function parseTicketView(value: string | null): TicketView {
  return value === "expanded" ? "expanded" : "panel";
}

export function useTicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<TicketListParams & { ticketId?: string; view: TicketView }>(() => {
    const search = searchParams.get("search")?.trim() || undefined;
    const assignee = searchParams.get("assignee") || undefined;

    return {
      page: parsePage(searchParams.get("page")),
      limit: parseLimit(searchParams.get("limit")),
      search,
      status: parseStatus(searchParams.get("status")),
      priority: parsePriority(searchParams.get("priority")),
      assignee,
      sortBy: parseSortField(searchParams.get("sortBy")),
      sortOrder: parseSortOrder(searchParams.get("sortOrder")),
      ticketId: searchParams.get("ticketId") ?? undefined,
      view: parseTicketView(searchParams.get("view")),
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          for (const [key, value] of Object.entries(updates)) {
            if (value === undefined || value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => {
      updateParams({
        search: search.trim() || null,
        page: "1",
      });
    },
    [updateParams],
  );

  const setQuickFilter = useCallback(
    (filterId: string) => {
      if (filterId === "all") {
        updateParams({
          status: null,
          assignee: null,
          page: "1",
        });
        return;
      }

      if (filterId === "my") {
        updateParams({
          status: null,
          assignee: "me",
          page: "1",
        });
        return;
      }

      updateParams({
        status: filterId,
        assignee: null,
        page: "1",
      });
    },
    [updateParams],
  );

  const setPriority = useCallback(
    (priority: TicketPriority | undefined) => {
      updateParams({
        priority: priority ?? null,
        page: "1",
      });
    },
    [updateParams],
  );

  const setAssignee = useCallback(
    (assignee: string | undefined) => {
      updateParams({
        assignee: assignee ?? null,
        page: "1",
      });
    },
    [updateParams],
  );

  const setSort = useCallback(
    (sortBy: TicketSortField, sortOrder: "asc" | "desc") => {
      updateParams({
        sortBy,
        sortOrder,
        page: "1",
      });
    },
    [updateParams],
  );

  const setPage = useCallback(
    (page: number) => {
      updateParams({ page: String(page) });
    },
    [updateParams],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      updateParams({
        limit: String(limit),
        page: "1",
      });
    },
    [updateParams],
  );

  const setSelectedTicketId = useCallback(
    (ticketId: string | undefined) => {
      updateParams({
        ticketId: ticketId ?? null,
        view: null,
      });
    },
    [updateParams],
  );

  const setTicketView = useCallback(
    (view: TicketView) => {
      updateParams({
        view: view === "expanded" ? "expanded" : null,
      });
    },
    [updateParams],
  );

  const closeTicketPanel = useCallback(() => {
    updateParams({
      ticketId: null,
      view: null,
    });
  }, [updateParams]);

  const clearFilters = useCallback(() => {
    updateParams({
      search: null,
      status: null,
      priority: null,
      assignee: null,
      page: "1",
    });
  }, [updateParams]);

  const clearAdvancedFilters = useCallback(() => {
    updateParams({
      priority: null,
      assignee: null,
      page: "1",
    });
  }, [updateParams]);

  const listParams = useMemo<TicketListParams>(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
      assignee: filters.assignee,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [filters],
  );

  return {
    filters,
    listParams,
    setSearch,
    setQuickFilter,
    setPriority,
    setAssignee,
    setSort,
    setPage,
    setPageSize,
    setSelectedTicketId,
    setTicketView,
    closeTicketPanel,
    clearFilters,
    clearAdvancedFilters,
  };
}

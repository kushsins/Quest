import {
  ChevronDown,
  Filter,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { CreateTicketModal } from "@/features/tickets/components/CreateTicketModal";
import type { DeleteTicketTarget } from "@/features/tickets/components/DeleteTicketDialog";
import { StatusDot } from "@/features/tickets/components/TicketPanelSelect";
import { UserAvatar } from "@/features/tickets/components/TicketBadges";
import { getHasActiveFilters, TicketList } from "@/features/tickets/components/TicketList";
import { TicketQuickFilters } from "@/features/tickets/components/TicketQuickFilters";
import { TicketSearchBar } from "@/features/tickets/components/TicketSearchBar";
import {
  DEFAULT_SORT_OPTION,
  getActiveQuickFilter,
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  PRIORITY_TEXT_CLASS,
  QUICK_FILTERS,
  QUICK_FILTER_SORT_LABELS,
  SORT_OPTIONS,
} from "@/features/tickets/constants/ticket.constants";
import { useTicketFilters } from "@/features/tickets/hooks/useTicketFilters";
import { ticketQueryKeys } from "@/features/tickets/hooks/ticketQueryKeys";
import { useTicketQuickFilterCounts } from "@/features/tickets/hooks/useTicketQuickFilterCounts";
import { useTickets, useUsers } from "@/features/tickets/hooks/useTicketQueries";
import type { TicketPriority, UserSummary } from "@/features/tickets/types/ticket.types";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Select } from "@/shared/components/ui/select";

export function TicketWorkspace({
  canDeleteTicket = false,
  onRequestDelete,
}: {
  canDeleteTicket?: boolean;
  onRequestDelete?: (ticket: DeleteTicketTarget) => void;
}) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const canCreateTicket = hasPermission("CREATE_TICKET");

  const {
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
    clearFilters,
    clearAdvancedFilters,
  } = useTicketFilters();

  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? "")) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, filters.search, setSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        if (!canCreateTicket) {
          return;
        }

        event.preventDefault();
        setIsCreateOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canCreateTicket]);

  const ticketsQuery = useTickets(listParams);
  const usersQuery = useUsers();
  const quickFilterCounts = useTicketQuickFilterCounts();

  const activeQuickFilter = getActiveQuickFilter(filters.status, filters.assignee);
  const activeSort =
    SORT_OPTIONS.find(
      (option) =>
        option.sortBy === filters.sortBy &&
        option.sortOrder === filters.sortOrder,
    ) ?? DEFAULT_SORT_OPTION;
  const activeSortLabel =
    QUICK_FILTER_SORT_LABELS[activeSort.id] ?? activeSort.label;

  const hasActiveFilters = getHasActiveFilters({
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
    assignee: filters.assignee,
  });

  const advancedFilterCount = [filters.priority, filters.assignee].filter(Boolean)
    .length;

  const activeFilterLabel =
    QUICK_FILTERS.find((filter) => filter.id === activeQuickFilter)?.label ??
    "All Tickets";

  const totalTickets = ticketsQuery.data?.pagination.totalItems;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-5">
        <div className="shrink-0 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <TicketSearchBar
              value={searchInput}
              onChange={setSearchInput}
            />

            <div className="flex shrink-0 items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter />
                    <span className="hidden sm:inline">Filter</span>
                    {advancedFilterCount > 0 ? (
                      <span className="flex size-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground">
                        {advancedFilterCount}
                      </span>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="space-y-4">
                  <AdvancedFilters
                    priority={filters.priority}
                    assignee={filters.assignee}
                    users={usersQuery.data ?? []}
                    isLoadingUsers={usersQuery.isLoading}
                    advancedFilterCount={advancedFilterCount}
                    onPriorityChange={setPriority}
                    onAssigneeChange={setAssignee}
                    onClearAdvanced={clearAdvancedFilters}
                  />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort: {activeSortLabel}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={activeSort.id}
                    onValueChange={(value) => {
                      const option = SORT_OPTIONS.find(
                        (item) => item.id === value,
                      );

                      if (option) {
                        setSort(option.sortBy, option.sortOrder);
                      }
                    }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.id} value={option.id}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {canCreateTicket ? (
                <Button
                  onClick={() => {
                    setIsCreateOpen(true);
                  }}
                >
                  <Plus />
                  New Ticket
                </Button>
              ) : null}
            </div>
          </div>

          <TicketQuickFilters
            activeFilterId={activeQuickFilter}
            counts={quickFilterCounts}
            onSelect={setQuickFilter}
          />

          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              {activeFilterLabel}
            </h2>
            {totalTickets !== undefined ? (
              <p className="text-sm text-muted-foreground">
                {totalTickets} total
              </p>
            ) : null}
          </div>
        </div>

        <section className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--panel-radius)]">
          <TicketList
            tickets={ticketsQuery.data?.items ?? []}
            pagination={ticketsQuery.data?.pagination}
            selectedTicketId={filters.ticketId}
            isLoading={ticketsQuery.isLoading}
            isFetching={ticketsQuery.isFetching}
            error={ticketsQuery.error}
            hasActiveFilters={hasActiveFilters}
            canDeleteTicket={canDeleteTicket}
            onSelectTicket={setSelectedTicketId}
            onRequestDelete={onRequestDelete}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onClearFilters={clearFilters}
            onCreateTicket={
              canCreateTicket
                ? () => {
                    setIsCreateOpen(true);
                  }
                : undefined
            }
            onRetry={() => {
              void queryClient.invalidateQueries({
                queryKey: ticketQueryKeys.list(listParams),
              });
            }}
          />
        </section>
      </div>

      {canCreateTicket ? (
        <CreateTicketModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          users={usersQuery.data ?? []}
          isLoadingUsers={usersQuery.isLoading}
          onCreated={(ticketId) => {
            setSelectedTicketId(ticketId);
          }}
        />
      ) : null}
    </>
  );
}

function AdvancedFilters({
  priority,
  assignee,
  users,
  isLoadingUsers,
  advancedFilterCount,
  onPriorityChange,
  onAssigneeChange,
  onClearAdvanced,
}: {
  priority?: TicketPriority;
  assignee?: string;
  users: UserSummary[];
  isLoadingUsers: boolean;
  advancedFilterCount: number;
  onPriorityChange: (priority: TicketPriority | undefined) => void;
  onAssigneeChange: (assignee: string | undefined) => void;
  onClearAdvanced: () => void;
}) {
  const priorityOptions = useMemo(
    () => [
      { value: "", label: "Any priority" },
      ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
        value,
        label,
        labelClassName: PRIORITY_TEXT_CLASS[value as TicketPriority],
        leading: (
          <StatusDot className={PRIORITY_DOT_CLASS[value as TicketPriority]} />
        ),
      })),
    ],
    [],
  );

  const assigneeOptions = useMemo(
    () => [
      { value: "", label: "Any assignee" },
      { value: "me", label: "Me" },
      ...users.map((user) => ({
        value: user.id,
        label: user.name,
        leading: <UserAvatar user={user} className="size-5 text-[0.5rem]" />,
      })),
    ],
    [users],
  );

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="filter-priority"
          className="text-sm font-medium text-foreground"
        >
          Priority
        </label>
        <Select
          id="filter-priority"
          value={priority ?? ""}
          options={priorityOptions}
          onChange={(value) => {
            onPriorityChange(value ? (value as TicketPriority) : undefined);
          }}
          aria-label="Filter by priority"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="filter-assignee"
          className="text-sm font-medium text-foreground"
        >
          Assignee
        </label>
        <Select
          id="filter-assignee"
          value={assignee ?? ""}
          options={assigneeOptions}
          disabled={isLoadingUsers}
          onChange={(value) => {
            onAssigneeChange(value || undefined);
          }}
          aria-label="Filter by assignee"
        />
      </div>

      {advancedFilterCount > 0 ? (
        <Button variant="ghost" size="sm" className="w-full" onClick={onClearAdvanced}>
          Clear advanced filters
        </Button>
      ) : null}
    </>
  );
}

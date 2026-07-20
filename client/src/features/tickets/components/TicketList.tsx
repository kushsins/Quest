import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MoreVertical,
  SearchX,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import {
  TicketPriorityBadge,
  TicketStatusBadge,
  UserCell,
} from "@/features/tickets/components/TicketBadges";
import { TICKET_PAGE_SIZE_OPTIONS } from "@/features/tickets/constants/ticket.constants";
import type { DeleteTicketTarget } from "@/features/tickets/components/DeleteTicketDialog";
import { formatRelativeTime } from "@/features/tickets/utils/formatDate";
import type { TicketListItem } from "@/features/tickets/types/ticket.types";
import {
  getPaginationRange,
  getVisiblePages,
  type PaginationMeta,
} from "@/shared/api/pagination.types";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ApiClientError } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface TicketListProps {
  tickets: TicketListItem[];
  pagination?: PaginationMeta;
  selectedTicketId?: string;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasActiveFilters: boolean;
  canDeleteTicket?: boolean;
  onSelectTicket: (ticketId: string) => void;
  onRequestDelete?: (ticket: DeleteTicketTarget) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onClearFilters: () => void;
  onCreateTicket?: () => void;
  onRetry: () => void;
}

function formatTicketId(ticketNumber: string): string {
  return ticketNumber.startsWith("#") ? ticketNumber : `#${ticketNumber}`;
}

function stopRowClick(event: MouseEvent) {
  event.stopPropagation();
}

function TicketTableSkeleton({ showActionsColumn }: { showActionsColumn: boolean }) {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <tr key={index} className="ticket-table-row">
          <td>
            <Skeleton className="h-4 w-20" />
          </td>
          <td>
            <Skeleton className="h-4 w-full max-w-xs" />
          </td>
          <td>
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td>
            <Skeleton className="h-5 w-16 rounded-full" />
          </td>
          <td>
            <Skeleton className="h-7 w-28" />
          </td>
          <td>
            <Skeleton className="h-7 w-28" />
          </td>
          <td>
            <Skeleton className="h-4 w-12" />
          </td>
          {showActionsColumn ? (
            <td>
              <Skeleton className="mx-auto size-4" />
            </td>
          ) : null}
        </tr>
      ))}
    </>
  );
}

function TicketTableRow({
  ticket,
  isSelected,
  canDeleteTicket,
  onSelect,
  onRequestDelete,
}: {
  ticket: TicketListItem;
  isSelected: boolean;
  canDeleteTicket: boolean;
  onSelect: (ticketId: string) => void;
  onRequestDelete?: (ticket: DeleteTicketTarget) => void;
}) {
  return (
    <tr
      className={cn("ticket-table-row", isSelected && "ticket-table-row-selected")}
      onClick={() => {
        onSelect(ticket.id);
      }}
    >
      <td className="ticket-table-id">{formatTicketId(ticket.ticketNumber)}</td>
      <td className="ticket-table-title">{ticket.title}</td>
      <td>
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td>
        <TicketPriorityBadge priority={ticket.priority} />
      </td>
      <td>
        <UserCell user={ticket.assignee} />
      </td>
      <td>
        <UserCell user={ticket.reporter} />
      </td>
      <td className="ticket-table-updated">
        {formatRelativeTime(ticket.updatedAt)}
      </td>
      {canDeleteTicket ? (
        <td onClick={stopRowClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ticket-table-actions size-8"
                aria-label={`Actions for ${formatTicketId(ticket.ticketNumber)}`}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  onRequestDelete?.({
                    id: ticket.id,
                    ticketNumber: ticket.ticketNumber,
                    title: ticket.title,
                  });
                }}
              >
                <Trash2 />
                Delete ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      ) : null}
    </tr>
  );
}

function TicketListPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const { from, to } = getPaginationRange(pagination);
  const visiblePages = getVisiblePages(
    pagination.page,
    pagination.totalPages,
  );

  return (
    <div className="ticket-table-pagination">
      <p className="text-sm text-muted-foreground">
        Showing {from} to {to} of {pagination.totalItems} results
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={pagination.page <= 1}
          onClick={() => {
            onPageChange(pagination.page - 1);
          }}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {visiblePages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${String(index)}`}
              className="px-1 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={pagination.page === page ? "default" : "outline"}
              size="icon"
              className="size-8"
              onClick={() => {
                onPageChange(page);
              }}
              aria-label={`Page ${String(page)}`}
              aria-current={pagination.page === page ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => {
            onPageChange(pagination.page + 1);
          }}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            {pagination.limit} / page
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {TICKET_PAGE_SIZE_OPTIONS.map((size) => (
            <DropdownMenuItem
              key={size}
              onClick={() => {
                onPageSizeChange(size);
              }}
            >
              {size} / page
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function TicketList({
  tickets,
  pagination,
  selectedTicketId,
  isLoading,
  isFetching,
  error,
  hasActiveFilters,
  canDeleteTicket = false,
  onSelectTicket,
  onRequestDelete,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
  onCreateTicket,
  onRetry,
}: TicketListProps) {
  const apiError = error instanceof ApiClientError ? error : null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHeaderOpaque, setIsHeaderOpaque] = useState(false);

  const handleTableScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    setIsHeaderOpaque(container.scrollTop > 0);
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    setIsHeaderOpaque(container.scrollTop > 0);
  }, [isLoading, tickets]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleTableScroll}
        className={cn(
          "ticket-table-scroll min-h-0 flex-1 overflow-auto transition-opacity",
          isFetching && !isLoading && "opacity-70",
        )}
      >
        {isLoading ? (
          <table
            className={cn(
              "ticket-table",
              isHeaderOpaque && "ticket-table-is-scrolled",
            )}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Reporter</th>
                <th>Updated</th>
                {canDeleteTicket ? <th className="w-10" /> : null}
              </tr>
            </thead>
            <tbody>
              <TicketTableSkeleton showActionsColumn={canDeleteTicket} />
            </tbody>
          </table>
        ) : null}

        {!isLoading && apiError && tickets.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="Unable to load tickets"
            description={apiError.message}
            action={
              <Button type="button" variant="outline" onClick={onRetry}>
                Try again
              </Button>
            }
          />
        ) : null}

        {!isLoading && tickets.length === 0 && !hasActiveFilters && !apiError ? (
          <EmptyState
            icon={Inbox}
            title="No tickets yet"
            description="Create your first support ticket to start tracking issues with your team."
            action={
              onCreateTicket ? (
                <Button onClick={onCreateTicket}>Create ticket</Button>
              ) : null
            }
          />
        ) : null}

        {!isLoading && tickets.length === 0 && hasActiveFilters && !apiError ? (
          <EmptyState
            icon={SearchX}
            title="No tickets match your filters"
            description="Try adjusting your search or filter criteria to find what you are looking for."
            action={
              <Button variant="outline" onClick={onClearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : null}

        {!isLoading && tickets.length > 0 ? (
          <table
            className={cn(
              "ticket-table",
              isHeaderOpaque && "ticket-table-is-scrolled",
            )}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Reporter</th>
                <th>Updated</th>
                {canDeleteTicket ? <th className="w-10" /> : null}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <TicketTableRow
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={ticket.id === selectedTicketId}
                  canDeleteTicket={canDeleteTicket}
                  onSelect={onSelectTicket}
                  onRequestDelete={onRequestDelete}
                />
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {!isLoading && !error && pagination && pagination.totalItems > 0 ? (
        <div className="shrink-0">
          <TicketListPagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export function getHasActiveFilters(filters: {
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}): boolean {
  return Boolean(
    filters.search || filters.status || filters.priority || filters.assignee,
  );
}

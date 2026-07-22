import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Maximize,
  MessageSquare,
  Minimize,
  MoreVertical,
  Paperclip,
  Send,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { usePermissions } from "@/features/auth/hooks/usePermissions";
import {
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  PRIORITY_PILL_CLASS,
  PRIORITY_TEXT_CLASS,
  STATUS_DOT_CLASS,
  STATUS_LABELS,
  STATUS_TEXT_CLASS,
  TICKET_PANEL_WIDTH,
  canChangeTicketStatus,
  getSelectableStatuses,
} from "@/features/tickets/constants/ticket.constants";
import { UserAvatar } from "@/features/tickets/components/TicketBadges";
import { InlineEditableText } from "@/features/tickets/components/InlineEditableText";
import {
  StatusDot,
  TicketPanelSelect,
} from "@/features/tickets/components/TicketPanelSelect";
import { formatActivityMessage, buildActivityUserNameLookup } from "@/features/tickets/utils/formatActivity";
import { formatDateTime, formatRelativeTime } from "@/features/tickets/utils/formatDate";
import { openTicketInNewTab } from "@/features/tickets/utils/ticketRoutes";
import {
  useAddComment,
  useUpdateTicket,
} from "@/features/tickets/hooks/useTicketQueries";
import type {
  TicketDetail,
  TicketPriority,
  TicketStatus,
  UserSummary,
} from "@/features/tickets/types/ticket.types";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { useResizablePanel } from "@/shared/hooks/useResizablePanel";
import { ApiClientError } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";

interface TicketPanelProps {
  ticketId: string;
  ticket?: TicketDetail;
  isLoading: boolean;
  error: Error | null;
  users: UserSummary[];
  isLoadingUsers: boolean;
  isOverlay?: boolean;
  isFullScreen?: boolean;
  embedded?: boolean;
  isExpanded?: boolean;
  canDeleteTicket?: boolean;
  onResizePointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onRetry: () => void;
  onToggleExpand?: () => void;
  onRequestDelete?: () => void;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 p-5">
      <div className="space-y-3">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
      <Skeleton className="h-52 w-full rounded-[var(--ticket-panel-radius)]" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

function TicketCommentBar({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState("");
  const addCommentMutation = useAddComment(ticketId);

  const handleSubmit = () => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    void (async () => {
      try {
        await addCommentMutation.mutateAsync({ message: trimmed });
        setMessage("");
        toast.success("Comment added.");
      } catch (error) {
        if (error instanceof ApiClientError) {
          toast.error(error.message);
          return;
        }

        toast.error("Unable to add comment. Please try again.");
      }
    })();
  };

  return (
    <div className="ticket-panel-comment-bar shrink-0">
      <div className="ticket-panel-comment-input-wrap">
        <input
          type="text"
          value={message}
          placeholder="Add a comment..."
          disabled={addCommentMutation.isPending}
          className="ticket-panel-comment-input"
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Paperclip
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
          aria-hidden="true"
        />
      </div>
      <Button
        size="icon"
        className="size-10 shrink-0 rounded-[var(--ticket-panel-control-radius)]"
        disabled={!message.trim() || addCommentMutation.isPending}
        onClick={handleSubmit}
        aria-label="Send comment"
      >
        {addCommentMutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Send />
        )}
      </Button>
    </div>
  );
}

function TicketDetailsHeader({
  ticket,
  canUpdateTicket,
  isUpdating,
  onUpdate,
}: {
  ticket: TicketDetail;
  canUpdateTicket: boolean;
  isUpdating: boolean;
  onUpdate: (
    input: Partial<{ title: string; description: string }>,
  ) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "ticket-panel-priority-pill w-fit",
          PRIORITY_PILL_CLASS[ticket.priority],
        )}
      >
        <StatusDot className={PRIORITY_DOT_CLASS[ticket.priority]} />
        <span>{PRIORITY_LABELS[ticket.priority]} Priority</span>
      </div>

      <InlineEditableText
        value={ticket.title}
        disabled={!canUpdateTicket || isUpdating}
        placeholder="Ticket title"
        displayClassName="ticket-panel-title px-0 py-0"
        inputClassName="ticket-panel-title"
        onSave={async (title) => {
          await onUpdate({ title });
        }}
      />

      <InlineEditableText
        value={ticket.description ?? ""}
        disabled={!canUpdateTicket || isUpdating}
        multiline
        placeholder="Add a description"
        emptyText="No description provided."
        displayClassName="ticket-panel-summary px-0 py-0"
        inputClassName="min-h-[5rem] text-sm"
        onSave={async (description) => {
          await onUpdate({ description });
        }}
      />
    </div>
  );
}

function TicketMetadataCard({
  ticket,
  users,
  isLoadingUsers,
  canUpdateTicket,
  canAssignTicket,
  isUpdating,
  onUpdate,
}: {
  ticket: TicketDetail;
  users: UserSummary[];
  isLoadingUsers: boolean;
  canUpdateTicket: boolean;
  canAssignTicket: boolean;
  isUpdating: boolean;
  onUpdate: (
    input: Partial<{
      status: TicketStatus;
      priority: TicketPriority;
      assigneeId: string;
      reporterId: string;
    }>,
  ) => Promise<void>;
}) {
  const statusOptions = getSelectableStatuses(ticket.status).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
    labelClassName: STATUS_TEXT_CLASS[status],
    leading: <StatusDot className={STATUS_DOT_CLASS[status]} />,
  }));

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(
    ([value, label]) => ({
      value: value as TicketPriority,
      label,
      labelClassName: PRIORITY_TEXT_CLASS[value as TicketPriority],
      leading: (
        <StatusDot className={PRIORITY_DOT_CLASS[value as TicketPriority]} />
      ),
    }),
  );

  const assigneeOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
    leading: <UserAvatar user={user} className="size-5 text-[0.5rem]" />,
  }));

  const reporterOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
    leading: <UserAvatar user={user} className="size-5 text-[0.5rem]" />,
  }));

  return (
    <div className="ticket-panel-metadata-card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TicketPanelSelect
          label="Status"
          value={ticket.status}
          options={statusOptions}
          disabled={
            !canUpdateTicket ||
            isUpdating ||
            !canChangeTicketStatus(ticket.status)
          }
          renderValue={(status) => (
            <>
              <StatusDot className={STATUS_DOT_CLASS[status]} />
              <span className={cn("truncate", STATUS_TEXT_CLASS[status])}>
                {STATUS_LABELS[status]}
              </span>
            </>
          )}
          onChange={(status) => {
            void onUpdate({ status });
          }}
        />
        <TicketPanelSelect
          label="Priority"
          value={ticket.priority}
          options={priorityOptions}
          disabled={!canUpdateTicket || isUpdating}
          renderValue={(priority) => (
            <>
              <StatusDot className={PRIORITY_DOT_CLASS[priority]} />
              <span className={cn("truncate", PRIORITY_TEXT_CLASS[priority])}>
                {PRIORITY_LABELS[priority]}
              </span>
            </>
          )}
          onChange={(priority) => {
            void onUpdate({ priority });
          }}
        />
        <TicketPanelSelect
          label="Assignee"
          value={ticket.assignee.id}
          options={assigneeOptions}
          disabled={!canAssignTicket || isLoadingUsers || isUpdating}
          renderValue={() => (
            <>
              <UserAvatar user={ticket.assignee} className="size-5 text-[0.5rem]" />
              <span className="truncate">{ticket.assignee.name}</span>
            </>
          )}
          onChange={(assigneeId) => {
            void onUpdate({ assigneeId });
          }}
        />
        <TicketPanelSelect
          label="Reporter"
          value={ticket.reporter.id}
          options={reporterOptions}
          disabled={!canUpdateTicket || isLoadingUsers || isUpdating}
          renderValue={() => (
            <>
              <UserAvatar user={ticket.reporter} className="size-5 text-[0.5rem]" />
              <span className="truncate">{ticket.reporter.name}</span>
            </>
          )}
          onChange={(reporterId) => {
            void onUpdate({ reporterId });
          }}
        />
      </div>

      <div className="grid gap-3 border-t border-[var(--glass-border-subtle)] pt-3 sm:grid-cols-2">
        <div>
          <p className="ticket-panel-field-label">Created</p>
          <p className="ticket-panel-meta-value">
            {formatDateTime(ticket.createdAt)}
          </p>
        </div>
        <div>
          <p className="ticket-panel-field-label">Updated</p>
          <p className="ticket-panel-meta-value">
            {formatDateTime(ticket.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function TicketComments({ ticket }: { ticket: TicketDetail }) {
  if (ticket.comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No comments yet"
        description="Comments will appear here once team members start discussing this ticket."
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      {ticket.comments.map((comment) => (
        <div
          key={comment.id}
          className="ticket-panel-content-card"
        >
          <div className="flex items-start gap-3">
            <UserAvatar user={comment.author} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="ticket-panel-comment-author">
                  {comment.author.name}
                </p>
                <span className="text-[0.6875rem] text-muted-foreground">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="ticket-panel-comment-message">
                {comment.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketActivity({
  ticket,
  users,
}: {
  ticket: TicketDetail;
  users: UserSummary[];
}) {
  const userNames = buildActivityUserNameLookup(users, ticket);

  if (ticket.activities.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No activity recorded"
        description="Activity history will appear here as changes are made to this ticket."
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      {ticket.activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--primary)]" />
          <div className="min-w-0 flex-1">
            <p className="ticket-panel-activity-message">
              {formatActivityMessage(activity, { userNames })}
            </p>
            <p className="ticket-panel-activity-time">
              {formatDateTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketPanelContent({
  ticket,
  isLoading,
  error,
  users,
  isLoadingUsers,
  onRetry,
}: {
  ticket?: TicketDetail;
  isLoading: boolean;
  error: Error | null;
  users: UserSummary[];
  isLoadingUsers: boolean;
  onRetry: () => void;
}) {
  const { hasPermission } = usePermissions();
  const canUpdateTicket = hasPermission("UPDATE_TICKET");
  const canAssignTicket = hasPermission("ASSIGN_TICKET");
  const canAddComment = hasPermission("ADD_COMMENT");
  const apiError = error instanceof ApiClientError ? error : null;

  if (isLoading && !ticket) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DetailSkeleton />
      </div>
    );
  }

  if (apiError && !ticket) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <EmptyState
          icon={AlertCircle}
          title="Unable to load ticket"
          description={apiError.message}
          action={
            <Button type="button" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          }
          className="py-24"
        />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DetailSkeleton />
      </div>
    );
  }

  return (
    <TicketPanelBody
      ticket={ticket}
      users={users}
      isLoadingUsers={isLoadingUsers}
      canUpdateTicket={canUpdateTicket}
      canAssignTicket={canAssignTicket}
      canAddComment={canAddComment}
    />
  );
}

function TicketPanelBody({
  ticket,
  users,
  isLoadingUsers,
  canUpdateTicket,
  canAssignTicket,
  canAddComment,
}: {
  ticket: TicketDetail;
  users: UserSummary[];
  isLoadingUsers: boolean;
  canUpdateTicket: boolean;
  canAssignTicket: boolean;
  canAddComment: boolean;
}) {
  const updateTicketMutation = useUpdateTicket(ticket.id);
  const [activeTab, setActiveTab] = useState("comments");

  const handleUpdate = async (
    input: Parameters<typeof updateTicketMutation.mutateAsync>[0],
  ) => {
    try {
      await updateTicketMutation.mutateAsync(input);
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        throw error;
      }

      toast.error("Unable to update ticket. Please try again.");
      throw error;
    }
  };

  return (
    <div className="ticket-panel-body flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <TicketDetailsHeader
            ticket={ticket}
            canUpdateTicket={canUpdateTicket}
            isUpdating={updateTicketMutation.isPending}
            onUpdate={handleUpdate}
          />

          <TicketMetadataCard
            ticket={ticket}
            users={users}
            isLoadingUsers={isLoadingUsers}
            canUpdateTicket={canUpdateTicket}
            canAssignTicket={canAssignTicket}
            isUpdating={updateTicketMutation.isPending}
            onUpdate={handleUpdate}
          />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col"
          >
            <TabsList className="ticket-panel-tab-list h-auto">
              <TabsTrigger value="comments" className="ticket-panel-tab">
                Comments ({ticket.comments.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="ticket-panel-tab">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4 data-[state=inactive]:hidden">
              <TicketComments ticket={ticket} />
            </TabsContent>

            <TabsContent value="activity" className="mt-4 data-[state=inactive]:hidden">
              <TicketActivity ticket={ticket} users={users} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {canAddComment && activeTab === "comments" ? (
        <TicketCommentBar ticketId={ticket.id} />
      ) : null}
    </div>
  );
}

export function TicketPanel({
  ticketId,
  ticket,
  isLoading,
  error,
  users,
  isLoadingUsers,
  isOverlay = false,
  isFullScreen = false,
  embedded = false,
  isExpanded = false,
  canDeleteTicket = false,
  onResizePointerDown,
  onClose,
  onRetry,
  onToggleExpand,
  onRequestDelete,
}: TicketPanelProps) {
  const { width, onResizePointerDown: defaultOnResizePointerDown } =
    useResizablePanel({
      storageKey: TICKET_PANEL_WIDTH.storageKey,
      defaultWidth: TICKET_PANEL_WIDTH.default,
      minWidth: TICKET_PANEL_WIDTH.min,
      maxWidth: TICKET_PANEL_WIDTH.max,
    });

  const isExpandedLayout = isExpanded || (isOverlay && isFullScreen);
  const canToggleExpand = embedded || (isOverlay && !isFullScreen);

  const resizeHandler = onResizePointerDown ?? defaultOnResizePointerDown;

  const panelBody = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--glass-border-subtle)] px-4 py-3">
        <p className="ticket-panel-header-id">
          #{ticket?.ticketNumber ?? ticketId}
        </p>
        <div className="flex items-center gap-1">
          {canDeleteTicket ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ticket actions"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onRequestDelete}
                >
                  <Trash2 />
                  Delete ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              openTicketInNewTab(ticketId);
            }}
            aria-label="Open ticket in new tab"
          >
            <ExternalLink className="size-4" />
          </Button>
          {canToggleExpand ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              aria-label={isExpandedLayout ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isExpandedLayout ? (
                <Minimize className="size-4" />
              ) : (
                <Maximize className="size-4" />
              )}
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close ticket panel"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <TicketPanelContent
        ticket={ticket}
        isLoading={isLoading}
        error={error}
        users={users}
        isLoadingUsers={isLoadingUsers}
        onRetry={onRetry}
      />
    </div>
  );

  if (isOverlay) {
    return (
      <aside
        className={cn(
          "drawer-transition glass-floating z-20 flex h-full min-h-0 flex-col overflow-hidden",
          isFullScreen
            ? "fixed inset-0"
            : isExpandedLayout
              ? "absolute inset-0 rounded-[var(--ticket-panel-radius)]"
              : "absolute inset-y-0 right-0 w-full max-w-lg rounded-l-[var(--ticket-panel-radius)]",
        )}
      >
        {panelBody}
      </aside>
    );
  }

  if (embedded) {
    return (
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
        {!isExpandedLayout ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize ticket panel"
            onPointerDown={resizeHandler}
            className="panel-resize-handle absolute bottom-0 left-0 top-0 z-10 w-1.5 cursor-col-resize"
          />
        ) : null}
        {panelBody}
      </div>
    );
  }

  return (
    <aside
      className="drawer-transition relative hidden h-full min-h-0 shrink-0 flex-col self-stretch overflow-hidden rounded-[var(--ticket-panel-radius)] border border-[var(--glass-border-subtle)] bg-[var(--glass-surface-subtle)] lg:flex"
      style={{ width }}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize ticket panel"
        onPointerDown={resizeHandler}
        className="panel-resize-handle absolute bottom-0 left-0 top-0 z-10 w-1.5 cursor-col-resize"
      />
      {panelBody}
    </aside>
  );
}

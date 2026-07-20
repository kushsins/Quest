import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserAvatar } from "@/features/tickets/components/TicketBadges";
import { StatusDot } from "@/features/tickets/components/TicketPanelSelect";
import {
  PRIORITY_DOT_CLASS,
  PRIORITY_LABELS,
  PRIORITY_TEXT_CLASS,
} from "@/features/tickets/constants/ticket.constants";
import { useCreateTicket } from "@/features/tickets/hooks/useTicketQueries";
import {
  createTicketSchema,
  type CreateTicketFormValues,
} from "@/features/tickets/validation/createTicket.schema";
import type { TicketPriority, UserSummary } from "@/features/tickets/types/ticket.types";
import { ApiClientError } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserSummary[];
  isLoadingUsers: boolean;
  onCreated: (ticketId: string) => void;
}

export function CreateTicketModal({
  open,
  onOpenChange,
  users,
  isLoadingUsers,
  onCreated,
}: CreateTicketModalProps) {
  const createTicketMutation = useCreateTicket();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      assigneeId: "",
    },
  });

  const priorityOptions = useMemo(
    () =>
      Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
        value: value as TicketPriority,
        label,
        labelClassName: PRIORITY_TEXT_CLASS[value as TicketPriority],
        leading: (
          <StatusDot className={PRIORITY_DOT_CLASS[value as TicketPriority]} />
        ),
      })),
    [],
  );

  const assigneeOptions = useMemo(
    () => [
      { value: "", label: "Unassigned" },
      ...users.map((user) => ({
        value: user.id,
        label: user.name,
        leading: <UserAvatar user={user} className="size-5 text-[0.5rem]" />,
      })),
    ],
    [users],
  );

  const closeModal = () => {
    onOpenChange(false);
    reset();
  };

  const onSubmit = (values: CreateTicketFormValues) => {
    void (async () => {
      try {
        const result = await createTicketMutation.mutateAsync({
          title: values.title,
          description: values.description || undefined,
          priority: values.priority,
          assigneeId: values.assigneeId || null,
        });

        toast.success("Ticket created successfully.");
        closeModal();
        onCreated(result.id);
      } catch (error) {
        if (error instanceof ApiClientError) {
          if (error.errors.length > 0) {
            for (const fieldError of error.errors) {
              if (
                fieldError.field === "title" ||
                fieldError.field === "description" ||
                fieldError.field === "priority" ||
                fieldError.field === "assigneeId"
              ) {
                setError(fieldError.field, { message: fieldError.message });
              }
            }
            return;
          }

          toast.error(error.message);
          return;
        }

        toast.error("Unable to create ticket. Please try again.");
      }
    })();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeModal();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create ticket</DialogTitle>
          <DialogDescription>
            Add a new support ticket to track an issue with your team.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="ticket-title">Title</Label>
            <Input
              id="ticket-title"
              placeholder="Brief summary of the issue"
              {...register("title")}
            />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-description">Description</Label>
            <Textarea
              id="ticket-description"
              placeholder="Provide additional context about the issue"
              rows={4}
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticket-priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    id="ticket-priority"
                    value={field.value}
                    options={priorityOptions}
                    onChange={field.onChange}
                    aria-label="Priority"
                  />
                )}
              />
              {errors.priority ? (
                <p className="text-sm text-destructive">
                  {errors.priority.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-assignee">Assignee</Label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="ticket-assignee"
                    value={field.value ?? ""}
                    options={assigneeOptions}
                    onChange={field.onChange}
                    disabled={isLoadingUsers}
                    aria-label="Assignee"
                  />
                )}
              />
              {errors.assigneeId ? (
                <p className="text-sm text-destructive">
                  {errors.assigneeId.message}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Create ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

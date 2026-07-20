import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteTicket } from "@/features/tickets/hooks/useTicketQueries";
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

export interface DeleteTicketTarget {
  id: string;
  ticketNumber: string;
  title: string;
}

interface DeleteTicketDialogProps {
  ticket: DeleteTicketTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

function formatTicketLabel(ticketNumber: string): string {
  return ticketNumber.startsWith("#") ? ticketNumber : `#${ticketNumber}`;
}

export function DeleteTicketDialog({
  ticket,
  open,
  onOpenChange,
  onDeleted,
}: DeleteTicketDialogProps) {
  const deleteTicketMutation = useDeleteTicket();

  const handleDelete = () => {
    if (!ticket) {
      return;
    }

    void (async () => {
      try {
        await deleteTicketMutation.mutateAsync(ticket.id);
        toast.success("Ticket deleted successfully.");
        onOpenChange(false);
        onDeleted();
      } catch (error) {
        if (error instanceof ApiClientError) {
          toast.error(error.message);
          return;
        }

        toast.error("Unable to delete ticket. Please try again.");
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete ticket</DialogTitle>
          <DialogDescription>
            {ticket
              ? `This will permanently delete ${formatTicketLabel(ticket.ticketNumber)} "${ticket.title}". This action cannot be undone.`
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteTicketMutation.isPending}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={deleteTicketMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            {deleteTicketMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Delete ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

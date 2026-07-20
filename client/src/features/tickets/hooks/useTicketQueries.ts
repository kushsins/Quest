import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addComment,
  createTicket,
  deleteTicket,
  fetchTicket,
  fetchTickets,
  updateTicket,
} from "@/features/tickets/api/tickets.api";
import { fetchUsers } from "@/features/tickets/api/users.api";
import { ticketQueryKeys } from "@/features/tickets/hooks/ticketQueryKeys";
import type {
  AddCommentInput,
  CreateTicketInput,
  TicketListParams,
  UpdateTicketInput,
} from "@/features/tickets/types/ticket.types";

export function useTickets(params: TicketListParams) {
  return useQuery({
    queryKey: ticketQueryKeys.list(params),
    queryFn: () => fetchTickets(params),
    placeholderData: keepPreviousData,
  });
}

export function useTicket(ticketId: string | undefined) {
  return useQuery({
    queryKey: ticketQueryKeys.detail(ticketId ?? ""),
    queryFn: () => {
      if (!ticketId) {
        throw new Error("Ticket id is required.");
      }

      return fetchTicket(ticketId);
    },
    enabled: Boolean(ticketId),
    placeholderData: keepPreviousData,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ticketQueryKeys.users(),
    queryFn: fetchUsers,
    staleTime: 5 * 60_000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.counts() });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTicketInput) => updateTicket(ticketId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketQueryKeys.detail(ticketId),
      });
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.counts() });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => deleteTicket(ticketId),
    onSuccess: async (_data, ticketId) => {
      queryClient.removeQueries({
        queryKey: ticketQueryKeys.detail(ticketId),
      });
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: ticketQueryKeys.counts() });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCommentInput) => addComment(ticketId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketQueryKeys.detail(ticketId),
      });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

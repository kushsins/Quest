import type { PaginatedResponse } from "@/shared/api/pagination.types";
import { deleteJson } from "@/shared/api/deleteJson";
import { getJson } from "@/shared/api/getJson";
import { patchJson } from "@/shared/api/patchJson";
import { postJson } from "@/shared/api/postJson";

import type {
  AddCommentInput,
  CreateTicketInput,
  CreateTicketResult,
  TicketDetail,
  TicketListItem,
  TicketListParams,
  UpdateTicketInput,
} from "@/features/tickets/types/ticket.types";

function buildTicketQuery(params: TicketListParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  searchParams.set("sortBy", params.sortBy);
  searchParams.set("sortOrder", params.sortOrder);

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.priority) {
    searchParams.set("priority", params.priority);
  }

  if (params.assignee) {
    searchParams.set("assignee", params.assignee);
  }

  if (params.reporter) {
    searchParams.set("reporter", params.reporter);
  }

  return searchParams.toString();
}

export async function fetchTickets(
  params: TicketListParams,
): Promise<PaginatedResponse<TicketListItem>> {
  const query = buildTicketQuery(params);
  const response = await getJson<PaginatedResponse<TicketListItem>>(
    `/tickets?${query}`,
  );

  return response.data;
}

export async function fetchTicket(ticketId: string): Promise<TicketDetail> {
  const response = await getJson<TicketDetail>(`/tickets/${ticketId}`);
  return response.data;
}

export async function createTicket(
  input: CreateTicketInput,
): Promise<CreateTicketResult> {
  const response = await postJson<CreateTicketResult>("/tickets", input);
  return response.data;
}

export async function updateTicket(
  ticketId: string,
  input: UpdateTicketInput,
): Promise<void> {
  await patchJson(`/tickets/${ticketId}`, input);
}

export async function deleteTicket(ticketId: string): Promise<void> {
  await deleteJson(`/tickets/${ticketId}`);
}

export async function addComment(
  ticketId: string,
  input: AddCommentInput,
): Promise<void> {
  await postJson(`/tickets/${ticketId}/comments`, input);
}

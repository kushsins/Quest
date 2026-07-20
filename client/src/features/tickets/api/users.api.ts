import { getJson } from "@/shared/api/getJson";

import type { UserSummary } from "@/features/tickets/types/ticket.types";

export async function fetchUsers(): Promise<UserSummary[]> {
  const response = await getJson<UserSummary[]>("/users");
  return response.data;
}

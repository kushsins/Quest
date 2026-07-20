import { apiClient } from "@/shared/api/client";

export async function deleteJson(url: string): Promise<void> {
  await apiClient.delete(url);
}

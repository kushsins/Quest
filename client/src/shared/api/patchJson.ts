import type { ApiSuccessResponse } from "@/shared/api/types";
import { apiClient } from "@/shared/api/client";

export async function patchJson<T>(
  url: string,
  body?: unknown,
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.patch<ApiSuccessResponse<T>>(url, body);
  return response.data;
}

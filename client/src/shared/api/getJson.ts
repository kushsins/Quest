import type { ApiSuccessResponse } from "@/shared/api/types";
import { apiClient } from "@/shared/api/client";

export async function getJson<T>(
  url: string,
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.get<ApiSuccessResponse<T>>(url);
  return response.data;
}

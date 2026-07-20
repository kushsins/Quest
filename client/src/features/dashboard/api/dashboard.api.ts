import { getJson } from "@/shared/api/getJson";

import type { DashboardData } from "@/features/dashboard/types/dashboard.types";

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await getJson<DashboardData>("/dashboard");
  return response.data;
}

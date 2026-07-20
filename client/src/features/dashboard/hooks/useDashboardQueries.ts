import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "@/features/dashboard/api/dashboard.api";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/dashboardQueryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: fetchDashboard,
    staleTime: 30_000,
  });
}

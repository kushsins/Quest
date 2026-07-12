import { useQuery } from "@tanstack/react-query";

import { fetchHealthStatus } from "@/features/health/api/health.api";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealthStatus,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

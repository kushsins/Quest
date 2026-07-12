import { getJson } from "@/shared/api/getJson";

export interface HealthStatus {
  status: "ok";
  database: boolean;
  timestamp: string;
}

export async function fetchHealthStatus(): Promise<HealthStatus> {
  const response = await getJson<HealthStatus>("/health");
  return response.data;
}

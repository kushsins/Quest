import { prisma } from "../../config/database.js";
import { ApiError } from "../../shared/errors/ApiError.js";

export interface HealthStatus {
  status: "ok";
  database: boolean;
  timestamp: string;
}

export async function getHealthStatus(): Promise<HealthStatus> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      database: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Database health check failed:", error);

    throw new ApiError(
      503,
      "Service is temporarily unavailable.",
    );
  }
}

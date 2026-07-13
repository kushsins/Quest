import { z } from "zod";

import { logger } from "../shared/utils/logger.js";
import { parseDurationToMs } from "../shared/utils/duration.util.js";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/),
  REFRESH_TOKEN_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error(
      "Invalid environment configuration",
      result.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment configuration.");
  }

  return result.data;
}

export const env = loadEnv();

export const refreshTokenMaxAgeMs = parseDurationToMs(env.REFRESH_TOKEN_EXPIRES_IN);

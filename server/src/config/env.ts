import { z } from "zod";

import { logger } from "../shared/utils/logger.js";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
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

import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

const serverRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

function getTestEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://quest:quest@localhost:5433/quest_test",
    PORT: "3001",
    CORS_ORIGIN: "http://localhost:5173",
    JWT_ACCESS_SECRET: "test-access-secret-minimum-32-characters-long",
    JWT_REFRESH_SECRET: "test-refresh-secret-minimum-32-characters-long",
    ACCESS_TOKEN_EXPIRES_IN: "15m",
    REFRESH_TOKEN_EXPIRES_IN: "7d",
    SWAGGER_ENABLED: "false",
  };
}

async function ensureTestDatabaseExists(): Promise<void> {
  const databaseUrl = "postgresql://quest:quest@localhost:5433/quest_test";
  const adminUrl = databaseUrl.replace(/\/[^/]+$/, "/postgres");
  const databaseName = decodeURIComponent(
    new URL(databaseUrl).pathname.replace(/^\//, ""),
  );

  const admin = new PrismaClient({
    datasources: {
      db: {
        url: adminUrl,
      },
    },
  });

  try {
    const result = await admin.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS(
        SELECT 1 FROM pg_database WHERE datname = ${databaseName}
      ) AS exists
    `;

    if (!result[0]?.exists) {
      await admin.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`);
    }
  } finally {
    await admin.$disconnect();
  }
}

export default async function globalSetup(): Promise<void> {
  const testEnv = getTestEnv();
  Object.assign(process.env, testEnv);

  await ensureTestDatabaseExists();

  execSync("npx prisma migrate deploy", {
    cwd: serverRoot,
    env: testEnv,
    stdio: "inherit",
  });

  execSync("npx tsx prisma/seed.ts", {
    cwd: serverRoot,
    env: testEnv,
    stdio: "inherit",
  });
}

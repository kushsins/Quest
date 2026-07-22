/**
 * Loaded before any test file. Sets safe defaults so future imports
 * of env-dependent modules do not fail during unit or integration runs.
 */
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.DATABASE_URL =
  "postgresql://quest:quest@localhost:5433/quest_test";
process.env.CORS_ORIGIN ??= "http://localhost:5173";
process.env.JWT_ACCESS_SECRET ??=
  "test-access-secret-minimum-32-characters-long";
process.env.JWT_REFRESH_SECRET ??=
  "test-refresh-secret-minimum-32-characters-long";
process.env.ACCESS_TOKEN_EXPIRES_IN ??= "15m";
process.env.REFRESH_TOKEN_EXPIRES_IN ??= "7d";
process.env.SWAGGER_ENABLED ??= "false";

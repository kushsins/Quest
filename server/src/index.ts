import "dotenv/config";

import { createApp } from "./app.js";
import { disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Quest API listening on port ${String(env.PORT)}`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} received. Shutting down gracefully.`);

  server.close(() => {
    void disconnectDatabase().finally(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

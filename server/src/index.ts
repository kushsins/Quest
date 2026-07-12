import "dotenv/config";

import { createApp } from "./app.js";
import { disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Quest API listening on port ${String(env.PORT)}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down gracefully.`);

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

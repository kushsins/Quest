import cors from "cors";
import express from "express";
import { Router } from "express";

import { env } from "./config/env.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { logger } from "./shared/utils/logger.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use((request, _response, next) => {
    logger.info(`${request.method} ${request.path}`);
    next();
  });

  const apiRouter = Router();
  apiRouter.use(healthRouter);

  app.use("/api/v1", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

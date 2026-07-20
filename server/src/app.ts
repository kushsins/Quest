import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";

import { env } from "./config/env.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { ticketRouter } from "./modules/tickets/ticket.routes.js";
import { userRouter } from "./modules/users/user.routes.js";
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
  app.use(cookieParser());

  app.use((request, _response, next) => {
    logger.info(`${request.method} ${request.path}`);
    next();
  });

  const apiRouter = Router();
  apiRouter.use(healthRouter);
  apiRouter.use("/auth", authRouter);
  apiRouter.use("/dashboard", dashboardRouter);
  apiRouter.use("/tickets", ticketRouter);
  apiRouter.use("/users", userRouter);

  app.use("/api/v1", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

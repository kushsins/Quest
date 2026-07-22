import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { env } from "../config/env.js";
import { logger } from "../shared/utils/logger.js";
import { openApiSpec } from "./swagger.config.js";

export function setupSwagger(app: Express): void {
  if (!env.SWAGGER_ENABLED) {
    return;
  }

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: "Quest API",
    }),
  );

  logger.info("Swagger UI enabled at /api/docs");
}

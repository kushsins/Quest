import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";
import { Permission } from "../../shared/constants/permissions.js";
import { getDashboardHandler } from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_DASHBOARD),
  getDashboardHandler,
);

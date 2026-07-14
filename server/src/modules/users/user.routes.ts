import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";
import { Permission } from "../../shared/constants/permissions.js";
import { getUsers } from "./user.controller.js";

export const userRouter = Router();

userRouter.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  getUsers,
);

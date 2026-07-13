import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../shared/errors/ApiError.js";
import type { PermissionKey } from "../shared/constants/permissions.js";

export function requirePermission(permission: PermissionKey) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new ApiError(401, "Authentication required."));
      return;
    }

    if (!request.user.permissions.includes(permission)) {
      next(new ApiError(403, "You don't have permission to perform this action."));
      return;
    }

    next();
  };
}

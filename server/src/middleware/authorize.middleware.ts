import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../shared/errors/ApiError.js";
import {
  Permission,
  type PermissionKey,
} from "../shared/constants/permissions.js";

const PERMISSION_DENIED_MESSAGES: Partial<Record<PermissionKey, string>> = {
  [Permission.VIEW_USERS]: "You don't have permission to view users.",
  [Permission.ADD_COMMENT]: "You don't have permission to add comments.",
};

export function requirePermission(permission: PermissionKey) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new ApiError(401, "Authentication required."));
      return;
    }

    if (!request.user.permissions.includes(permission)) {
      next(
        new ApiError(
          403,
          PERMISSION_DENIED_MESSAGES[permission] ??
            "You don't have permission to perform this action.",
        ),
      );
      return;
    }

    next();
  };
}

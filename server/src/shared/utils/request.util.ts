import type { Request } from "express";

import { ApiError } from "../errors/ApiError.js";
import type { AuthenticatedUser } from "../types/express.js";

export function getAuthenticatedUser(request: Request): AuthenticatedUser {
  if (!request.user) {
    throw new ApiError(401, "Authentication required.");
  }

  return request.user;
}

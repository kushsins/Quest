import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../shared/errors/ApiError.js";
import { verifyAccessToken } from "../shared/utils/jwt.util.js";
import { validateSession } from "../modules/auth/auth.service.js";

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required.");
    }

    const accessToken = authorizationHeader.slice("Bearer ".length).trim();

    if (!accessToken) {
      throw new ApiError(401, "Authentication required.");
    }

    const payload = verifyAccessToken(accessToken);
    const user = await validateSession(payload.sid, payload.sub);

    request.user = {
      id: user.id,
      sessionId: payload.sid,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, "Your session has expired. Please sign in again."));
  }
}

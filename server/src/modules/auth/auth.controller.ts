import type { CookieOptions, NextFunction, Request, Response } from "express";

import { env, refreshTokenMaxAgeMs } from "../../config/env.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "../../shared/constants/auth.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
} from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";

function getRefreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: refreshTokenMaxAgeMs,
  };
}

function setRefreshTokenCookie(
  response: Response,
  refreshToken: string,
): void {
  response.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshTokenCookieOptions(),
  );
}

function clearRefreshTokenCookie(response: Response): void {
  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function postLogin(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = loginSchema.parse(request.body);
    const result = await login(input);

    setRefreshTokenCookie(response, result.refreshToken);

    response.status(200).json(
      ApiResponse("Login successful.", {
        accessToken: result.accessToken,
        user: result.user,
      }),
    );
  } catch (error) {
    next(error);
  }
}

export async function postRefresh(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as
      | string
      | undefined;

    if (!refreshToken) {
      response.status(401).json({
        success: false,
        message: "Your session has expired. Please sign in again.",
        errors: [],
      });
      return;
    }

    const result = await refreshAccessToken(refreshToken);

    setRefreshTokenCookie(response, result.refreshToken);

    response.status(200).json(
      ApiResponse("Access token refreshed successfully.", {
        accessToken: result.accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
}

export async function postLogout(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (request.user) {
      await logout(request.user.sessionId);
    }

    clearRefreshTokenCookie(response);

    response.status(200).json(ApiResponse("Logged out successfully.", {}));
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.user) {
      response.status(401).json({
        success: false,
        message: "Authentication required.",
        errors: [],
      });
      return;
    }

    const user = await getCurrentUser(request.user.id);

    response.status(200).json(
      ApiResponse("User retrieved successfully.", user),
    );
  } catch (error) {
    next(error);
  }
}

import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../shared/errors/ApiError.js";
import { logger } from "../shared/utils/logger.js";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express requires 4-arg error handler signature
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  logger.error("Unhandled error", error);

  response.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
    errors: [],
  });
}

export function notFoundMiddleware(
  _request: Request,
  _response: Response,
  next: NextFunction,
): void {
  next(new ApiError(404, "The requested resource was not found."));
}

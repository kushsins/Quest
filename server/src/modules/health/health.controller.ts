import type { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { getHealthStatus } from "./health.service.js";

export async function getHealth(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getHealthStatus();

    response.status(200).json(
      ApiResponse("Service is healthy.", data),
    );
  } catch (error) {
    next(error);
  }
}

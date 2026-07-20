import type { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { getAuthenticatedUser } from "../../shared/utils/request.util.js";
import { getDashboard } from "./dashboard.service.js";

export async function getDashboardHandler(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(request);
    const data = await getDashboard(user.id);

    response.status(200).json(
      ApiResponse("Dashboard retrieved successfully.", data),
    );
  } catch (error) {
    next(error);
  }
}

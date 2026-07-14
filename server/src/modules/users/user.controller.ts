import type { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { listUsers } from "./user.service.js";

export async function getUsers(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await listUsers();

    response.status(200).json(
      ApiResponse("Users retrieved successfully.", users),
    );
  } catch (error) {
    next(error);
  }
}

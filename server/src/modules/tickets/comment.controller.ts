import type { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { getAuthenticatedUser } from "../../shared/utils/request.util.js";
import { createComment, listComments } from "./comment.service.js";
import { createCommentSchema } from "./comment.validation.js";
import { ticketIdParamSchema } from "./ticket.validation.js";

export async function getTicketComments(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = ticketIdParamSchema.parse(request.params);
    const comments = await listComments(id);

    response.status(200).json(
      ApiResponse("Comments retrieved successfully.", comments),
    );
  } catch (error) {
    next(error);
  }
}

export async function postTicketComment(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = ticketIdParamSchema.parse(request.params);
    const input = createCommentSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    await createComment(id, input, user.id);

    response.status(201).json(
      ApiResponse("Comment added successfully.", {}),
    );
  } catch (error) {
    next(error);
  }
}

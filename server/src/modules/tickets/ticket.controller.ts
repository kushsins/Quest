import type { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { getAuthenticatedUser } from "../../shared/utils/request.util.js";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  listTickets,
  updateTicket,
} from "./ticket.service.js";
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
} from "./ticket.validation.js";

export async function getTickets(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = listTicketsQuerySchema.parse(request.query);
    const user = getAuthenticatedUser(request);
    const result = await listTickets(query, user.id);

    response.status(200).json(
      ApiResponse("Tickets retrieved successfully.", result),
    );
  } catch (error) {
    next(error);
  }
}

export async function getTicket(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = ticketIdParamSchema.parse(request.params);
    const ticket = await getTicketById(id);

    response.status(200).json(
      ApiResponse("Ticket retrieved successfully.", ticket),
    );
  } catch (error) {
    next(error);
  }
}

export async function postTicket(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = createTicketSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const ticket = await createTicket(input, user.id, user.permissions);

    response.status(201).json(
      ApiResponse("Ticket created successfully.", ticket),
    );
  } catch (error) {
    next(error);
  }
}

export async function patchTicket(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = ticketIdParamSchema.parse(request.params);
    const input = updateTicketSchema.parse(request.body);
    const user = getAuthenticatedUser(request);

    await updateTicket(id, input, user.id, user.permissions);

    response.status(200).json(
      ApiResponse("Ticket updated successfully.", {}),
    );
  } catch (error) {
    next(error);
  }
}

export async function removeTicket(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = ticketIdParamSchema.parse(request.params);
    await deleteTicket(id);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

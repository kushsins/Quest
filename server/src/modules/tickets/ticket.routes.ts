import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";
import { Permission } from "../../shared/constants/permissions.js";
import {
  getTicketComments,
  postTicketComment,
} from "./comment.controller.js";
import {
  getTicket,
  getTickets,
  patchTicket,
  postTicket,
  removeTicket,
} from "./ticket.controller.js";

export const ticketRouter = Router();

ticketRouter.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_TICKETS),
  getTickets,
);

ticketRouter.get(
  "/:id",
  authenticate,
  requirePermission(Permission.VIEW_TICKETS),
  getTicket,
);

ticketRouter.post(
  "/",
  authenticate,
  requirePermission(Permission.CREATE_TICKET),
  postTicket,
);

ticketRouter.patch(
  "/:id",
  authenticate,
  requirePermission(Permission.UPDATE_TICKET),
  patchTicket,
);

ticketRouter.delete(
  "/:id",
  authenticate,
  requirePermission(Permission.DELETE_TICKET),
  removeTicket,
);

ticketRouter.get(
  "/:id/comments",
  authenticate,
  requirePermission(Permission.VIEW_TICKETS),
  getTicketComments,
);

ticketRouter.post(
  "/:id/comments",
  authenticate,
  requirePermission(Permission.ADD_COMMENT),
  postTicketComment,
);

import { TicketPriority, TicketStatus } from "@prisma/client";
import { z } from "zod";

import {
  assigneeIdField,
  hasAtLeastOneDefinedField,
  ticketTitleField,
  uuidField,
} from "../../shared/validation/common.schema.js";
import {
  paginationQuerySchema,
  sortOrderSchema,
} from "../../shared/validation/pagination.schema.js";
import { TICKET_SORT_FIELDS } from "./ticket.constants.js";

export const ticketIdParamSchema = z.object({
  id: uuidField("Please provide a valid ticket id."),
});

export const createTicketSchema = z.object({
  title: ticketTitleField,
  description: z.string().trim().optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assigneeId: assigneeIdField,
});

export const updateTicketSchema = z
  .object({
    title: ticketTitleField.optional(),
    description: z.string().trim().optional(),
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    assigneeId: assigneeIdField,
  })
  .refine(
    (value) =>
      hasAtLeastOneDefinedField(value, [
        "title",
        "description",
        "status",
        "priority",
        "assigneeId",
      ]),
    {
      message: "At least one field is required.",
    },
  );

export const listTicketsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assignee: z
    .union([
      z.literal("me"),
      uuidField("Assignee must be a valid user id or 'me'."),
    ])
    .optional(),
  sortBy: z.enum(TICKET_SORT_FIELDS).default("updatedAt"),
  sortOrder: sortOrderSchema,
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
export type TicketIdParam = z.infer<typeof ticketIdParamSchema>;

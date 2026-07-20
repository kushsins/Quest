import { z } from "zod";

const ticketPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be 5000 characters or fewer.")
    .optional(),
  priority: ticketPrioritySchema,
  assigneeId: z.union([z.uuid("Please select a valid assignee."), z.literal("")]).optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

import { z } from "zod";

export const uuidField = (message: string) => z.string().uuid(message);

export const ticketTitleField = z
  .string()
  .trim()
  .min(1, "Title is required.")
  .max(255, "Title must be 255 characters or fewer.");

export const assigneeIdField = uuidField(
  "Please provide a valid assignee id.",
).optional();

export const reporterIdField = uuidField(
  "Please provide a valid reporter id.",
).optional();

export const commentMessageField = z
  .string()
  .trim()
  .min(1, "Message is required.")
  .max(5000, "Message must be 5000 characters or fewer.");

export function hasAtLeastOneDefinedField<T extends Record<string, unknown>>(
  value: T,
  fields: (keyof T)[],
): boolean {
  return fields.some((field) => value[field] !== undefined);
}

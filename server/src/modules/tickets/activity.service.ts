import type { ActivityAction, Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";

interface CreateActivityInput {
  ticketId: string;
  action: ActivityAction;
  performedBy: string;
  fieldName?: string;
  previousValue?: string | null;
  newValue?: string | null;
}

export async function createActivity(
  input: CreateActivityInput,
  transaction?: Prisma.TransactionClient,
): Promise<void> {
  const client = transaction ?? prisma;

  await client.activity.create({
    data: {
      ticketId: input.ticketId,
      action: input.action,
      performedBy: input.performedBy,
      fieldName: input.fieldName,
      previousValue: input.previousValue ?? null,
      newValue: input.newValue ?? null,
    },
  });
}

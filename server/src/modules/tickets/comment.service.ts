import { prisma } from "../../config/database.js";
import {
  mapUserSummary,
  userSummarySelect,
} from "../../shared/mappers/user.mapper.js";
import { createActivity } from "./activity.service.js";
import type { CommentItem } from "./ticket.types.js";
import { assertTicketExists } from "./ticket.service.js";
import type { CreateCommentInput } from "./comment.validation.js";

const commentInclude = {
  author: { select: userSummarySelect },
} as const;

export async function listComments(ticketId: string): Promise<CommentItem[]> {
  await assertTicketExists(ticketId);

  const comments = await prisma.comment.findMany({
    where: { ticketId },
    include: commentInclude,
    orderBy: { createdAt: "desc" },
  });

  return comments.map((comment) => ({
    id: comment.id,
    author: mapUserSummary(comment.author),
    message: comment.message,
    createdAt: comment.createdAt.toISOString(),
  }));
}

export async function createComment(
  ticketId: string,
  input: CreateCommentInput,
  authorId: string,
): Promise<void> {
  await assertTicketExists(ticketId);

  await prisma.$transaction(async (transaction) => {
    await transaction.comment.create({
      data: {
        ticketId,
        authorId,
        message: input.message,
      },
    });

    await createActivity(
      {
        ticketId,
        action: "COMMENT_ADDED",
        performedBy: authorId,
        fieldName: "comment",
        newValue: input.message,
      },
      transaction,
    );
  });
}

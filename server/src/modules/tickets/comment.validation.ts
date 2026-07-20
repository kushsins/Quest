import { z } from "zod";

import { commentMessageField } from "../../shared/validation/common.schema.js";

export const createCommentSchema = z.object({
  message: commentMessageField,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

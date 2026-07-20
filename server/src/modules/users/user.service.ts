import { prisma } from "../../config/database.js";
import {
  mapUserSummary,
  userSummarySelect,
} from "../../shared/mappers/user.mapper.js";
import type { UserSummary } from "../../shared/types/user.types.js";

export async function listUsers(): Promise<UserSummary[]> {
  const users = await prisma.user.findMany({
    select: userSummarySelect,
    orderBy: { name: "asc" },
  });

  return users.map(mapUserSummary);
}

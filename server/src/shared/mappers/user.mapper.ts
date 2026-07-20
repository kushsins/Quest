import type { UserSummary } from "../types/user.types.js";

export const userSummarySelect = {
  id: true,
  name: true,
  email: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export type UserSummaryRecord = {
  id: string;
  name: string;
  email: string;
  role: { id: number; name: string };
};

export function mapUserSummary(user: UserSummaryRecord): UserSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  };
}

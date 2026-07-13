import type { Permission, User } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../shared/errors/ApiError.js";
import type { PermissionKey } from "../../shared/constants/permissions.js";
import { signAccessToken } from "../../shared/utils/jwt.util.js";
import { verifyPassword } from "../../shared/utils/password.util.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../shared/utils/token.util.js";
import { parseDurationToMs } from "../../shared/utils/duration.util.js";
import type { LoginInput } from "./auth.validation.js";
import type { AuthUser, LoginResult, RefreshResult } from "./auth.types.js";

type UserWithRoleAndPermissions = User & {
  role: {
    id: number;
    name: string;
    rolePermissions: Array<{
      permission: Pick<Permission, "key">;
    }>;
  };
};

function mapUser(user: UserWithRoleAndPermissions): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
    permissions: user.role.rolePermissions.map(
      (rolePermission) => rolePermission.permission.key as PermissionKey,
    ),
  };
}

const userInclude = {
  role: {
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  },
} as const;

async function findUserByEmail(email: string): Promise<UserWithRoleAndPermissions | null> {
  return prisma.user.findUnique({
    where: { email },
    include: userInclude,
  });
}

async function findUserById(userId: string): Promise<UserWithRoleAndPermissions | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
}

function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + parseDurationToMs(env.REFRESH_TOKEN_EXPIRES_IN));
}

async function createSession(userId: string, refreshToken: string) {
  return prisma.session.create({
    data: {
      userId,
      hashedRefreshToken: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiry(),
    },
  });
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new ApiError(401, "The email or password you entered is incorrect.");
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "The email or password you entered is incorrect.");
  }

  const refreshToken = generateRefreshToken();
  const session = await createSession(user.id, refreshToken);
  const accessToken = signAccessToken({
    sub: user.id,
    sid: session.id,
  });

  return {
    accessToken,
    refreshToken,
    user: mapUser(user),
  };
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResult> {
  const session = await prisma.session.findUnique({
    where: {
      hashedRefreshToken: hashRefreshToken(refreshToken),
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  const nextRefreshToken = generateRefreshToken();

  await prisma.session.update({
    where: { id: session.id },
    data: {
      hashedRefreshToken: hashRefreshToken(nextRefreshToken),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const accessToken = signAccessToken({
    sub: session.userId,
    sid: session.id,
  });

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  };
}

export async function logout(sessionId: string): Promise<void> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.revokedAt) {
    return;
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }

  return mapUser(user);
}

export async function validateSession(sessionId: string, userId: string): Promise<AuthUser> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  if (session.revokedAt || session.expiresAt <= new Date()) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  return getCurrentUser(userId);
}

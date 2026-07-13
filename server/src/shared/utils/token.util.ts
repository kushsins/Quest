import { createHash, randomBytes } from "node:crypto";

import { env } from "../../config/env.js";

export function generateRefreshToken(): string {
  return randomBytes(64).toString("hex");
}

export function hashRefreshToken(refreshToken: string): string {
  return createHash("sha256")
    .update(`${refreshToken}${env.JWT_REFRESH_SECRET}`)
    .digest("hex");
}

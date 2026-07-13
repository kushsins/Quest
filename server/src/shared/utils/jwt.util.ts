import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../../config/env.js";
import { parseDurationToSeconds } from "./duration.util.js";

interface AccessTokenPayload {
  sub: string;
  sid: string;
}

function isAccessTokenPayload(decoded: JwtPayload | string): decoded is JwtPayload & AccessTokenPayload {
  return (
    typeof decoded !== "string" &&
    typeof decoded.sub === "string" &&
    typeof decoded.sid === "string"
  );
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: parseDurationToSeconds(env.ACCESS_TOKEN_EXPIRES_IN),
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (!isAccessTokenPayload(decoded)) {
    throw new Error("Invalid access token payload.");
  }

  return {
    sub: decoded.sub,
    sid: decoded.sid,
  };
}

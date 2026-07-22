import type { Agent, Response } from "supertest";

import {
  parseApiSuccess,
  type ApiSuccessResponse,
} from "./response.helper.js";

export interface LoginResult {
  accessToken: string;
  refreshCookie: string;
  user: {
    id: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
  };
}

interface LoginResponseData {
  accessToken: string;
  user: LoginResult["user"];
}

function extractRefreshCookie(response: Response): string {
  const cookies = response.headers["set-cookie"];

  if (!cookies) {
    return "";
  }

  const cookieList: string[] = Array.isArray(cookies)
    ? cookies.filter((cookie): cookie is string => typeof cookie === "string")
    : typeof cookies === "string"
      ? [cookies]
      : [];

  for (const cookie of cookieList) {
    if (cookie.startsWith("refreshToken=")) {
      return cookie;
    }
  }

  return "";
}

export async function loginAs(
  agent: Agent,
  email: string,
  password: string,
): Promise<LoginResult> {
  const response = await agent.post("/api/v1/auth/login").send({
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error(
      `Login failed for ${email} with status ${String(response.status)}.`,
    );
  }

  const body = parseApiSuccess<LoginResponseData>(response.body);

  return {
    accessToken: body.data.accessToken,
    refreshCookie: extractRefreshCookie(response),
    user: body.data.user,
  };
}

export function authHeader(accessToken: string): { Authorization: string } {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export type { ApiSuccessResponse };

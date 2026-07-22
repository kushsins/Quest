import { describe, expect, it } from "vitest";

import { authHeader, loginAs } from "../helpers/auth.helper.js";
import { createTestAgent } from "../helpers/app.helper.js";
import { TEST_USERS } from "../helpers/fixtures.js";
import { parseApiError, parseApiSuccess } from "../helpers/response.helper.js";

interface AuthUser {
  email: string;
  role: {
    name: string;
  };
}

describe("Auth integration", () => {
  const agent = createTestAgent();

  it("returns an access token and user on successful login", async () => {
    const result = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshCookie).toContain("refreshToken=");
    expect(result.user).toMatchObject({
      email: TEST_USERS.member.email,
      role: { name: TEST_USERS.member.role },
    });
  });

  it("returns 401 for invalid login credentials", async () => {
    const response = await agent.post("/api/v1/auth/login").send({
      email: TEST_USERS.member.email,
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(parseApiError(response.body)).toEqual({
      success: false,
      message: "The email or password you entered is incorrect.",
      errors: [],
    });
  });

  it("returns the authenticated user from GET /auth/me", async () => {
    const { accessToken } = await loginAs(
      agent,
      TEST_USERS.manager.email,
      TEST_USERS.manager.password,
    );

    const response = await agent
      .get("/api/v1/auth/me")
      .set(authHeader(accessToken));

    const body = parseApiSuccess<AuthUser>(response.body);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      email: TEST_USERS.manager.email,
      role: { name: TEST_USERS.manager.role },
    });
  });

  it("returns 401 from GET /auth/me without an access token", async () => {
    const response = await agent.get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(parseApiError(response.body)).toEqual({
      success: false,
      message: "Authentication required.",
      errors: [],
    });
  });

  it("logs out the current session and rejects subsequent /auth/me requests", async () => {
    const { accessToken, refreshCookie } = await loginAs(
      agent,
      TEST_USERS.member.email,
      TEST_USERS.member.password,
    );

    const logoutResponse = await agent
      .post("/api/v1/auth/logout")
      .set(authHeader(accessToken))
      .set("Cookie", refreshCookie);

    const logoutBody = parseApiSuccess<Record<string, never>>(logoutResponse.body);

    expect(logoutResponse.status).toBe(200);
    expect(logoutBody.success).toBe(true);

    const meResponse = await agent
      .get("/api/v1/auth/me")
      .set(authHeader(accessToken));

    expect(meResponse.status).toBe(401);
    expect(parseApiError(meResponse.body).message).toBe(
      "Your session has expired. Please sign in again.",
    );
  });

  it("returns 401 for protected routes without authentication", async () => {
    const response = await agent.get("/api/v1/tickets");

    expect(response.status).toBe(401);
    expect(parseApiError(response.body).success).toBe(false);
  });
});

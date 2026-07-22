import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { requirePermission } from "../../../src/middleware/authorize.middleware.js";
import { ApiError } from "../../../src/shared/errors/ApiError.js";
import {
  MEMBER_PERMISSIONS,
  Permission,
} from "../../../src/shared/constants/permissions.js";
import type { AuthenticatedUser } from "../../../src/shared/types/express.js";

function createAuthenticatedUser(
  permissions: AuthenticatedUser["permissions"],
): AuthenticatedUser {
  return {
    id: "550e8400-e29b-41d4-a716-446655440001",
    sessionId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Test User",
    email: "member@quest.com",
    role: { id: 2, name: "Member" },
    permissions,
  };
}

function createMockResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function getPassedError(next: Mock): ApiError {
  expect(next).toHaveBeenCalledOnce();
  const error: unknown = next.mock.calls[0]?.[0];
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

describe("requirePermission", () => {
  it("returns 401 when the request is not authenticated", () => {
    const middleware = requirePermission(Permission.VIEW_TICKETS);
    const request = {} as Request;
    const response = createMockResponse();
    const next = vi.fn() as Mock;

    middleware(request, response, next as NextFunction);

    const error = getPassedError(next);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Authentication required.");
  });

  it("returns 403 when the user lacks the required permission", () => {
    const middleware = requirePermission(Permission.DELETE_TICKET);
    const request = {
      user: createAuthenticatedUser(MEMBER_PERMISSIONS),
    } as Request;
    const response = createMockResponse();
    const next = vi.fn() as Mock;

    middleware(request, response, next as NextFunction);

    const error = getPassedError(next);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe(
      "You don't have permission to perform this action.",
    );
  });

  it("uses a permission-specific denial message when one is defined", () => {
    const middleware = requirePermission(Permission.VIEW_USERS);
    const request = {
      user: createAuthenticatedUser([]),
    } as Request;
    const response = createMockResponse();
    const next = vi.fn() as Mock;

    middleware(request, response, next as NextFunction);

    const error = getPassedError(next);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("You don't have permission to view users.");
  });

  it("calls next without an error when the user has the required permission", () => {
    const middleware = requirePermission(Permission.VIEW_TICKETS);
    const request = {
      user: createAuthenticatedUser(MEMBER_PERMISSIONS),
    } as Request;
    const response = createMockResponse();
    const next = vi.fn() as Mock;

    middleware(request, response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

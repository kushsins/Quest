import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { z } from "zod";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "../../../src/middleware/error.middleware.js";
import { ApiError } from "../../../src/shared/errors/ApiError.js";

function createMockResponse(): {
  response: Response;
  status: Mock;
  json: Mock;
} {
  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();

  const response = {
    status,
    json,
  } as unknown as Response;

  return { response, status, json };
}

describe("errorMiddleware", () => {
  it("formats ApiError responses using the documented error contract", () => {
    const { response, status, json } = createMockResponse();
    const next = vi.fn() as NextFunction;
    const error = new ApiError(403, "Forbidden.", [
      { field: "status", message: "Not allowed." },
    ]);

    errorMiddleware(error, {} as Request, response, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden.",
      errors: [{ field: "status", message: "Not allowed." }],
    });
  });

  it("formats Zod validation errors as 422 field errors", () => {
    const { response, status, json } = createMockResponse();
    const next = vi.fn() as NextFunction;
    const schema = z.object({
      email: z.string().email("Please enter a valid email address."),
    });

    let zodError: z.ZodError | undefined;
    try {
      schema.parse({ email: "invalid" });
    } catch (error) {
      zodError = error as z.ZodError;
    }

    errorMiddleware(zodError, {} as Request, response, next);

    expect(status).toHaveBeenCalledWith(422);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Please correct the highlighted fields.",
      errors: [{ field: "email", message: "Please enter a valid email address." }],
    });
  });

  it("returns a generic 500 response for unexpected errors", () => {
    const { response, status, json } = createMockResponse();
    const next = vi.fn() as NextFunction;

    errorMiddleware(new Error("Unexpected failure"), {} as Request, response, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "An unexpected error occurred.",
      errors: [],
    });
  });
});

describe("notFoundMiddleware", () => {
  it("forwards a 404 ApiError to the error middleware", () => {
    const next = vi.fn() as Mock;

    notFoundMiddleware({} as Request, createMockResponse().response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const error: unknown = next.mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).statusCode).toBe(404);
    expect((error as ApiError).message).toBe(
      "The requested resource was not found.",
    );
  });
});

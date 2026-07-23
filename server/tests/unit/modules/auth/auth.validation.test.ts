import { describe, expect, it } from "vitest";

import { loginSchema } from "../../../../src/modules/auth/auth.validation.js";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.parse({
      email: "manager@quest.com",
      password: "password123",
    });

    expect(result).toEqual({
      email: "manager@quest.com",
      password: "password123",
    });
  });

  it("trims the email address", () => {
    const result = loginSchema.parse({
      email: "  member@quest.com  ",
      password: "password123",
    });

    expect(result.email).toBe("member@quest.com");
  });

  it("rejects a missing email", () => {
    const result = loginSchema.safeParse({ password: "password123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Required");
    }
  });

  it("rejects an invalid email format", () => {
    expect(() =>
      loginSchema.parse({ email: "not-an-email", password: "password123" }),
    ).toThrow(/valid email address/);
  });

  it("rejects a missing password", () => {
    const result = loginSchema.safeParse({ email: "manager@quest.com" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Required");
    }
  });

  it("rejects a blank password", () => {
    expect(() =>
      loginSchema.parse({ email: "manager@quest.com", password: "" }),
    ).toThrow(/Password is required/);
  });
});

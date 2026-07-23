import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/validation/login.schema";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "member@quest.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = loginSchema.safeParse({ email: "", password: "x" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Email is required.");
  });

  it("rejects a malformed email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "x",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Please enter a valid email address.",
    );
  });

  it("rejects a missing password", () => {
    const result = loginSchema.safeParse({
      email: "member@quest.com",
      password: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Password is required.");
  });
});

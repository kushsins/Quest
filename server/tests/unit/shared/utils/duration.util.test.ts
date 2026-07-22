import { describe, expect, it } from "vitest";

import {
  parseDurationToMs,
  parseDurationToSeconds,
} from "../../../../src/shared/utils/duration.util.js";

describe("parseDurationToMs", () => {
  it("parses second-based durations", () => {
    expect(parseDurationToMs("30s")).toBe(30_000);
  });

  it("parses minute-based durations", () => {
    expect(parseDurationToMs("15m")).toBe(15 * 60 * 1000);
  });

  it("parses hour-based durations", () => {
    expect(parseDurationToMs("2h")).toBe(2 * 60 * 60 * 1000);
  });

  it("parses day-based durations", () => {
    expect(parseDurationToMs("7d")).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("rejects unsupported duration formats", () => {
    expect(() => parseDurationToMs("15")).toThrow(/Invalid duration format/);
    expect(() => parseDurationToMs("15x")).toThrow(/Invalid duration format/);
    expect(() => parseDurationToMs("")).toThrow(/Invalid duration format/);
  });
});

describe("parseDurationToSeconds", () => {
  it("converts a duration to whole seconds", () => {
    expect(parseDurationToSeconds("90s")).toBe(90);
    expect(parseDurationToSeconds("1m")).toBe(60);
    expect(parseDurationToSeconds("1h")).toBe(3600);
  });
});

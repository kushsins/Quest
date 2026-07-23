import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  formatDateTime,
  formatDisplayDate,
  formatRelativeTime,
} from "@/shared/utils/formatDate";

const NOW = new Date("2026-06-15T12:00:00.000Z");

function minutesAgo(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60_000).toISOString();
}

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Just now' for very recent times", () => {
    expect(formatRelativeTime(minutesAgo(0))).toBe("Just now");
  });

  it("returns minutes for the last hour", () => {
    expect(formatRelativeTime(minutesAgo(5))).toBe("5m ago");
    expect(formatRelativeTime(minutesAgo(59))).toBe("59m ago");
  });

  it("returns hours within the last day", () => {
    expect(formatRelativeTime(minutesAgo(60))).toBe("1h ago");
    expect(formatRelativeTime(minutesAgo(60 * 5))).toBe("5h ago");
  });

  it("returns days within the last week", () => {
    expect(formatRelativeTime(minutesAgo(60 * 24))).toBe("1d ago");
    expect(formatRelativeTime(minutesAgo(60 * 24 * 6))).toBe("6d ago");
  });

  it("falls back to an absolute date beyond a week", () => {
    const result = formatRelativeTime(minutesAgo(60 * 24 * 30));

    expect(result).not.toMatch(/ago|Just now/);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatDateTime", () => {
  it("produces a non-empty absolute timestamp string", () => {
    const result = formatDateTime("2026-01-02T09:30:00.000Z");

    expect(result).toMatch(/2026/);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatDisplayDate", () => {
  it("formats a provided date with a year", () => {
    const result = formatDisplayDate(new Date("2026-03-04T00:00:00.000Z"));

    expect(result).toMatch(/2026/);
  });
});

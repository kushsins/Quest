import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getGreeting, getGreetingPeriod } from "@/shared/utils/greeting";

describe("getGreetingPeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns morning between 5:00 and 11:59", () => {
    vi.setSystemTime(new Date("2026-07-24T08:30:00"));

    expect(getGreetingPeriod()).toBe("morning");
  });

  it("returns afternoon between 12:00 and 16:59", () => {
    vi.setSystemTime(new Date("2026-07-24T14:15:00"));

    expect(getGreetingPeriod()).toBe("afternoon");
  });

  it("returns evening between 17:00 and 21:59", () => {
    vi.setSystemTime(new Date("2026-07-24T19:45:00"));

    expect(getGreetingPeriod()).toBe("evening");
  });

  it("returns night before 5:00", () => {
    vi.setSystemTime(new Date("2026-07-24T02:12:00"));

    expect(getGreetingPeriod()).toBe("night");
  });

  it("returns night after 22:00", () => {
    vi.setSystemTime(new Date("2026-07-24T23:30:00"));

    expect(getGreetingPeriod()).toBe("night");
  });
});

describe("getGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps periods to greeting copy", () => {
    vi.setSystemTime(new Date("2026-07-24T09:00:00"));
    expect(getGreeting()).toBe("Good morning");

    vi.setSystemTime(new Date("2026-07-24T13:00:00"));
    expect(getGreeting()).toBe("Good afternoon");

    vi.setSystemTime(new Date("2026-07-24T18:00:00"));
    expect(getGreeting()).toBe("Good evening");

    vi.setSystemTime(new Date("2026-07-24T02:00:00"));
    expect(getGreeting()).toBe("Good evening");
  });
});

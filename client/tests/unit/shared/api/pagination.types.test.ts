import { describe, expect, it } from "vitest";

import {
  getPaginationRange,
  getVisiblePages,
  type PaginationMeta,
} from "@/shared/api/pagination.types";

function meta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return { page: 1, limit: 10, totalItems: 0, totalPages: 0, ...overrides };
}

describe("getPaginationRange", () => {
  it("returns a zero range when there are no items", () => {
    expect(getPaginationRange(meta({ totalItems: 0 }))).toEqual({
      from: 0,
      to: 0,
    });
  });

  it("computes the range for the first page", () => {
    expect(
      getPaginationRange(meta({ page: 1, limit: 10, totalItems: 45 })),
    ).toEqual({ from: 1, to: 10 });
  });

  it("computes the range for a middle page", () => {
    expect(
      getPaginationRange(meta({ page: 3, limit: 10, totalItems: 45 })),
    ).toEqual({ from: 21, to: 30 });
  });

  it("caps the upper bound on the last partial page", () => {
    expect(
      getPaginationRange(meta({ page: 5, limit: 10, totalItems: 45 })),
    ).toEqual({ from: 41, to: 45 });
  });
});

describe("getVisiblePages", () => {
  it("lists every page when there are seven or fewer", () => {
    expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows a trailing ellipsis near the start", () => {
    expect(getVisiblePages(2, 10)).toEqual([1, 2, 3, "ellipsis", 10]);
  });

  it("shows a leading ellipsis near the end", () => {
    expect(getVisiblePages(9, 10)).toEqual([1, "ellipsis", 8, 9, 10]);
  });

  it("shows both ellipses in the middle", () => {
    expect(getVisiblePages(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
  });
});

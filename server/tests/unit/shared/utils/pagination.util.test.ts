import { describe, expect, it } from "vitest";

import {
  buildPaginationMeta,
  resolvePagination,
} from "../../../../src/shared/utils/pagination.util.js";

describe("resolvePagination", () => {
  it("calculates skip and take for the first page", () => {
    expect(resolvePagination({ page: 1, limit: 20 })).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    });
  });

  it("calculates skip and take for later pages", () => {
    expect(resolvePagination({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });
});

describe("buildPaginationMeta", () => {
  it("returns zero total pages when there are no items", () => {
    const pagination = resolvePagination({ page: 1, limit: 20 });

    expect(buildPaginationMeta(pagination, 0)).toEqual({
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
    });
  });

  it("calculates total pages for partial last pages", () => {
    const pagination = resolvePagination({ page: 1, limit: 20 });

    expect(buildPaginationMeta(pagination, 45)).toEqual({
      page: 1,
      limit: 20,
      totalItems: 45,
      totalPages: 3,
    });
  });

  it("calculates total pages when items divide evenly", () => {
    const pagination = resolvePagination({ page: 2, limit: 10 });

    expect(buildPaginationMeta(pagination, 40)).toEqual({
      page: 2,
      limit: 10,
      totalItems: 40,
      totalPages: 4,
    });
  });
});

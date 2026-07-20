import type { PaginationQuery } from "../validation/pagination.schema.js";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function resolvePagination(query: PaginationQuery): PaginationParams {
  const page = query.page;
  const limit = query.limit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginationMeta(
  pagination: PaginationParams,
  totalItems: number,
): PaginationMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
  };
}

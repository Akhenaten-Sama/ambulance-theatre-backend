import { PaginationParams, PaginationMeta, PaginatedResponse } from '../types';

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  return {
    data,
    meta: createPaginationMeta(page, limit, total),
  };
}

/**
 * Parse pagination parameters with defaults
 */
export function parsePaginationParams(
  page?: number,
  limit?: number,
): PaginationParams {
  const parsedPage = Math.max(1, page || 1);
  const parsedLimit = Math.min(100, Math.max(1, limit || 10)); // Max 100 items per page

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
}

/**
 * Calculate skip value for database queries
 */
export function getSkipValue(page: number, limit: number): number {
  return (page - 1) * limit;
}

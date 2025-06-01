/**
 * Pagination parameters for API queries
 */
export interface PaginationParameters {
  /** Page number (indexed from 1) */
  pageNumber: number;

  /** Number of items per page */
  pageSize: number;

  /** Sort field */
  sortField?: string;

  /** Sort direction (asc/desc) */
  ascending?: boolean;
}

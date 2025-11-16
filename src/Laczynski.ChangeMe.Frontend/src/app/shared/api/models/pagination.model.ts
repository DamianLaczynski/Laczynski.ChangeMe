/**
 * Pagination Models
 *
 * Models matching backend pagination structures.
 *
 * @see Laczynski.ChangeMe.Backend.Shared.Pagination
 */

/**
 * Pagination parameters for API requests
 * Matches backend PaginationParameters<T> structure
 *
 * @see Laczynski.ChangeMe.Backend.Shared.Pagination.PaginationParameters
 */
export interface PaginationParameters {
  /** Page number (1-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Field to sort by */
  sortField?: string;
  /** Whether to sort ascending (true) or descending (false) */
  ascending?: boolean;
  /** Additional query parameters */
  [key: string]: any;
}

/**
 * Pagination result from API
 * Matches backend PaginationResult<T> structure
 *
 * @see Laczynski.ChangeMe.Backend.Shared.Pagination.PaginationResult
 * @template T - The type of items in the result
 */
export interface PaginationResult<T> {
  /** List of items on the current page (backend uses "Items" but JSON serializes to "items") */
  items: T[];
  /** Total number of items satisfying the criteria */
  totalCount: number;
  /** Number of pages */
  totalPages: number;
  /** Current page number (1-based) */
  currentPage: number;
  /** Page size */
  pageSize: number;
  /** Field by which the results are sorted */
  sortField: string;
  /** Whether the sorting is ascending */
  ascending: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
}


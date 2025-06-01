/**
 * Pagination result for list data
 */
export interface PaginationResult<T> {
  /** List of items for the current page */
  items: T[];

  /** Total number of items */
  totalCount: number;

  /** Current page number (indexed from 1) */
  currentPage: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there is a previous page */
  hasPrevious: boolean;

  /** Whether there is a next page */
  hasNext: boolean;
}

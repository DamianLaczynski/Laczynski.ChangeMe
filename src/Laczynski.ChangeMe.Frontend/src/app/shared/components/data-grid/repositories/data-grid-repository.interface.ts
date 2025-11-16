/**
 * Repository Pattern for DataGrid
 *
 * Provides abstraction for data operations, enabling easy switching between
 * different data sources (API, local storage, etc.)
 *
 * @template T - The type of data items
 * @template F - The type of filters
 */

import { Observable } from 'rxjs';
import { DataGridQueryParams } from '../data-sources/data-grid-data-source.interface';
import { DataGridActiveFilter } from '../models/data-grid-filter.model';

/**
 * Result of a repository query
 *
 * @template T - The type of data items
 */
export interface DataGridResult<T> {
  /** Array of data items */
  data: T[];
  /** Total count of items (for pagination) */
  totalCount: number;
  /** Current page number */
  page?: number;
  /** Page size used */
  pageSize?: number;
}

/**
 * Extended query parameters with typed filters
 *
 * Note: For now, filters are always DataGridActiveFilter[].
 * Type parameter F is kept for future extensibility.
 */
export interface DataGridRepositoryQueryParams<F = any>
  extends Omit<DataGridQueryParams, 'filters'> {
  /** Filters - always DataGridActiveFilter[] for compatibility */
  filters?: DataGridActiveFilter[];
}

/**
 * Repository interface for DataGrid data operations
 *
 * @template T - The type of data items
 * @template F - The type of filters
 */
export interface DataGridRepository<T, F = any> {
  /**
   * Finds all items matching the query parameters
   *
   * @param params - Query parameters (pagination, sorting, filtering)
   * @returns Observable that emits the query result
   */
  findAll(params: DataGridRepositoryQueryParams<F>): Observable<DataGridResult<T>>;

  /**
   * Finds a single item by ID
   *
   * @param id - Item identifier
   * @returns Observable that emits the item or throws if not found
   */
  findById(id: string): Observable<T>;
}

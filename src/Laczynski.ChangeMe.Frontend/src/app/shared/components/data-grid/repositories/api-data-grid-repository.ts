/**
 * API Data Grid Repository Implementation
 *
 * Provides repository implementation for REST API endpoints.
 * Handles pagination, sorting, and filtering through query parameters.
 *
 * @template T - The type of data items
 */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DataGridRepository,
  DataGridRepositoryQueryParams,
  DataGridResult,
} from './data-grid-repository.interface';
import { ApiService } from '@shared/api/services/api.service';
import { PaginationResult } from '@shared/api/models/pagination.model';

/**
 * API Repository for DataGrid
 *
 * Use this for REST API endpoints. Automatically converts DataGrid query
 * parameters to HTTP query parameters.
 *
 * @example
 * ```typescript
 * const apiService = inject(ApiService);
 * const repository = new ApiDataGridRepository<User>('users', apiService);
 * ```
 */
export class ApiDataGridRepository<T> implements DataGridRepository<T> {
  /**
   * Creates a new ApiDataGridRepository instance
   *
   * @param endpoint - API endpoint URL (e.g., 'users' - without /api prefix)
   * @param apiService - ApiService instance (must be injected in injection context)
   * @param options - Optional configuration
   */
  constructor(
    private endpoint: string,
    private apiService: ApiService,
    private options?: {
      /** Custom parameter name for page (default: 'page') */
      pageParamName?: string;
      /** Custom parameter name for page size (default: 'pageSize') */
      pageSizeParamName?: string;
      /** Custom parameter name for sort field (default: 'sortBy') */
      sortFieldParamName?: string;
      /** Custom parameter name for sort direction (default: 'sortDirection') */
      sortDirectionParamName?: string;
      /** Custom parameter name for filters (default: 'Filters') */
      filtersParamName?: string;
    },
  ) {}

  /**
   * @inheritdoc
   */
  findAll(params: DataGridRepositoryQueryParams): Observable<DataGridResult<T>> {
    const queryParams = this.buildQueryParams(params);

    return this.apiService.get<PaginationResult<T>>(this.endpoint, queryParams).pipe(
      map((response: PaginationResult<T>) => {
        // Direct mapping from PaginationResult<T> to DataGridResult<T>
        // No additional transformation needed - backend structure matches data-grid expectations
        return {
          data: response.items || [],
          totalCount: response.totalCount || 0,
          page: response.currentPage || params.page || 1,
          pageSize: response.pageSize || params.pageSize || 10,
        };
      }),
    );
  }

  /**
   * @inheritdoc
   */
  findById(id: string): Observable<T> {
    return this.apiService.get<T>(`${this.endpoint}/${id}`);
  }

  /**
   * Builds query parameters object from DataGrid query parameters
   *
   * Uses flat parameter structure for query string (e.g., ?PageNumber=1&PageSize=10)
   */
  private buildQueryParams(params: DataGridRepositoryQueryParams): any {
    const queryParams: any = {};

    const pageParamName = this.options?.pageParamName || 'PageNumber';
    const pageSizeParamName = this.options?.pageSizeParamName || 'PageSize';
    const sortFieldParamName = this.options?.sortFieldParamName || 'SortField';
    const sortDirectionParamName = this.options?.sortDirectionParamName || 'Ascending';
    const filtersParamName = this.options?.filtersParamName || 'Filters';

    if (params.page != null) {
      queryParams[pageParamName] = params.page;
    }

    if (params.pageSize != null) {
      queryParams[pageSizeParamName] = params.pageSize;
    }

    if (params.sort) {
      queryParams[sortFieldParamName] = params.sort.field;
      // Convert 'asc'/'desc' to boolean if sortDirectionParamName suggests boolean (e.g., 'Ascending')
      if (sortDirectionParamName.toLowerCase().includes('ascending')) {
        queryParams[sortDirectionParamName] = params.sort.direction === 'asc';
      } else {
        queryParams[sortDirectionParamName] = params.sort.direction;
      }
    }

    if (params.filters && params.filters.length > 0) {
      queryParams[filtersParamName] = JSON.stringify(params.filters);
    }

    return queryParams;
  }
}

import { of } from 'rxjs';
import { DataGridBaseConfig } from '../../../models/data-grid-base-config.model';
import { PaginationParameters } from '../../../models/pagination-parameters.model';
import { DataGridColumn } from './data-grid-column.model';

/**
 * Configuration for paginated table
 */
export interface PaginatedTableConfig<T, P extends PaginationParameters = PaginationParameters>
  extends DataGridBaseConfig<T, P> {
  /** Available page sizes */
  pageSizeOptions?: number[];

  /** Whether to show page size selector */
  showPageSizeSelector?: boolean;

  /** Column definitions */
  columns: DataGridColumn<T>[];
}

export function createPaginatedTableConfig<
  T,
  P extends PaginationParameters = PaginationParameters,
>(config: Partial<PaginatedTableConfig<T, P>>): PaginatedTableConfig<T, P> {
  if (!config.state) {
    throw new Error('State is required for PaginatedTableConfig');
  }

  return {
    ...config,
    state: config.state,
    columns: config?.columns ?? [],
    pageSizeOptions: config?.pageSizeOptions ?? [10, 25, 50, 100],
    showPageSizeSelector: config?.showPageSizeSelector ?? true,
    serverSideSorting: config?.serverSideSorting ?? true,
    dataSource:
      config?.dataSource ??
      (() =>
        of({
          items: [],
          totalCount: 0,
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
        })),
    params: {
      ...config.params,
      pageNumber: config.params?.pageNumber ?? 1,
      pageSize: config.params?.pageSize ?? 10,
      sortField: config.params?.sortField ?? 'id',
      ascending: config.params?.ascending ?? true,
    } as P,
  };
}

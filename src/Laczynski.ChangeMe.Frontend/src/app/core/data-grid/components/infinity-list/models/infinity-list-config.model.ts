import { of } from 'rxjs';
import { PaginationParameters } from '../../../models/pagination-parameters.model';
import { DataGridBaseConfig } from '@core/data-grid/models/data-grid-base-config.model';
import { TemplateRef } from '@angular/core';

/**
 * Configuration for the infinity list component
 */
export interface InfinityListConfig<T, P extends PaginationParameters = PaginationParameters>
  extends DataGridBaseConfig<T, P> {
  /**
   * Custom template reference for each item in the list
   */
  itemTemplate?: TemplateRef<any>;

  /**
   * Custom empty state template
   */
  emptyTemplate?: TemplateRef<any>;

  /**
   * Custom loading template
   */
  loadingTemplate?: TemplateRef<any>;

  /**
   * Message to display when no data is available
   */
  emptyMessage?: string;

  /**
   * Whether to show loading indicator
   */
  showLoadingIndicator?: boolean;
}

export function createInfinityListConfig<T, P extends PaginationParameters = PaginationParameters>(
  config: Partial<InfinityListConfig<T, P>>,
): InfinityListConfig<T, P> {
  if (!config.state) {
    throw new Error('State is required for InfinityListConfig');
  }

  return {
    ...config,
    state: config.state,
    serverSideSorting: config?.serverSideSorting ?? true,
    emptyMessage: config?.emptyMessage ?? 'No items available',
    showLoadingIndicator: config?.showLoadingIndicator ?? true,
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

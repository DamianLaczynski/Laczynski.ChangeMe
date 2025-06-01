import { createPaginatedTableConfig } from './paginated-table-config.model';
import { PaginationResult } from '../../../models/pagination-result.model';
import { DataGridColumn } from './data-grid-column.model';
import { Signal, signal } from '@angular/core';
import { State, loadedState } from '@shared/state';

describe('PaginatedTableConfig', () => {
  interface TestItem {
    id: number;
    name: string;
  }

  const createMockState = () => {
    const mockItems: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    const mockPaginationResult: PaginationResult<TestItem> = {
      items: mockItems,
      totalCount: 2,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
    };

    return signal<State<PaginationResult<TestItem>>>(loadedState(mockPaginationResult));
  };

  it('should create a valid paginated table config with minimal properties', () => {
    const state = createMockState();

    const config = createPaginatedTableConfig<TestItem>({
      state: state as Signal<State<PaginationResult<TestItem>>>,
    });

    expect(config.state).toBe(state);
    expect(config.columns).toEqual([]);
    expect(config.pageSizeOptions).toEqual([10, 25, 50, 100]);
    expect(config.showPageSizeSelector).toBe(true);
    expect(config.serverSideSorting).toBe(true);
    expect(config.params.pageNumber).toBe(1);
    expect(config.params.pageSize).toBe(10);
    expect(config.params.sortField).toBe('id');
    expect(config.params.ascending).toBe(true);
  });

  it('should create a config with custom properties', () => {
    const state = createMockState();
    const columns: DataGridColumn<TestItem>[] = [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'name', header: 'Name', sortable: true },
    ];

    const dataSourceSpy = jasmine.createSpy('dataSource');

    const config = createPaginatedTableConfig<TestItem>({
      state: state as Signal<State<PaginationResult<TestItem>>>,
      columns: columns,
      pageSizeOptions: [5, 10, 20],
      showPageSizeSelector: false,
      serverSideSorting: false,
      dataSource: dataSourceSpy,
      params: {
        pageNumber: 2,
        pageSize: 5,
        sortField: 'name',
        ascending: false,
      },
      showEmptyState: true,
      emptyStateMessage: 'Custom empty message',
    });

    expect(config.state).toBe(state);
    expect(config.columns).toBe(columns);
    expect(config.pageSizeOptions).toEqual([5, 10, 20]);
    expect(config.showPageSizeSelector).toBe(false);
    expect(config.serverSideSorting).toBe(false);
    expect(config.dataSource).toBe(dataSourceSpy);
    expect(config.params.pageNumber).toBe(2);
    expect(config.params.pageSize).toBe(5);
    expect(config.params.sortField).toBe('name');
    expect(config.params.ascending).toBe(false);
    expect(config.showEmptyState).toBe(true);
    expect(config.emptyStateMessage).toBe('Custom empty message');
  });

  it('should throw an error if state is not provided', () => {
    expect(() => {
      createPaginatedTableConfig<TestItem>({} as any);
    }).toThrowError('State is required for PaginatedTableConfig');
  });

  it('should use default dataSource if none provided', () => {
    const state = createMockState();

    const config = createPaginatedTableConfig<TestItem>({
      state: state as Signal<State<PaginationResult<TestItem>>>,
    });

    const result = config.dataSource({
      pageNumber: 1,
      pageSize: 10,
      sortField: 'id',
      ascending: true,
    });

    // Check it returns an Observable with empty PaginationResult
    result.subscribe(paginationResult => {
      expect(paginationResult.items).toEqual([]);
      expect(paginationResult.totalCount).toBe(0);
      expect(paginationResult.currentPage).toBe(1);
      expect(paginationResult.pageSize).toBe(10);
      expect(paginationResult.totalPages).toBe(0);
      expect(paginationResult.hasPrevious).toBe(false);
      expect(paginationResult.hasNext).toBe(false);
    });
  });
});

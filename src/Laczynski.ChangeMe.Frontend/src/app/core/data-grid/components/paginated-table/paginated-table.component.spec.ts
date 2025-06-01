import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PaginatedTableComponent } from './paginated-table.component';
import { DataGridColumn } from './models/data-grid-column.model';
import { signal } from '@angular/core';
import { SortMeta } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import {
  PaginatedTableConfig,
  createPaginatedTableConfig,
} from './models/paginated-table-config.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Model for State from core state module
interface State<T> {
  isInitial: boolean;
  isLoading: boolean;
  isError: boolean;
  data?: T;
  error?: string;
}

// Helper function to create loaded state
function loadedState<T>(data: T): State<T> {
  return {
    isInitial: false,
    isLoading: false,
    isError: false,
    data,
  };
}

describe('PaginatedTableComponent', () => {
  // Component instance we're testing
  let component: PaginatedTableComponent<TestItem>;
  let fixture: ComponentFixture<PaginatedTableComponent<TestItem>>;
  let mockDataSource: jasmine.Spy;

  // Test data
  interface TestItem {
    id: number;
    name: string | null;
    description: string;
  }

  const mockItems: TestItem[] = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
    { id: 3, name: 'Item 3', description: 'Description 3' },
  ];

  const mockPaginationResult = {
    items: mockItems,
    totalCount: 10,
    currentPage: 1,
    pageSize: 3,
    totalPages: 4,
    hasPrevious: false,
    hasNext: true,
  };

  const mockColumns: DataGridColumn<TestItem>[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'description', header: 'Description' },
    { field: '', header: 'Actions' },
  ];

  beforeEach(async () => {
    mockDataSource = jasmine.createSpy('dataSource').and.returnValue(of(mockPaginationResult));

    await TestBed.configureTestingModule({
      imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, PaginatedTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatedTableComponent<TestItem>);
    component = fixture.componentInstance;

    // Setup the component with test data
    const config = createPaginatedTableConfig<TestItem>({
      state: signal(loadedState(mockPaginationResult)),
      columns: mockColumns,
      dataSource: mockDataSource,
      params: {
        pageNumber: 1,
        pageSize: 3,
        sortField: 'id',
        ascending: true,
      },
      emptyStateMessage: 'No data available',
      pageSizeOptions: [3, 5, 10],
      showPageSizeSelector: true,
    });

    component.config.set(config);

    // Mock the columnTemplates input
    // Instead of trying to set it (which might not be possible with InputSignal),
    // we can use a mock or stub approach
    const mockTemplates = {};
    Object.defineProperty(component, 'columnTemplates', {
      get: () => () => mockTemplates,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the provided configuration', () => {
    expect(component.config().columns).toEqual(mockColumns);
    expect(mockDataSource).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 3,
      sortField: 'id',
      ascending: true,
    });
  });

  it('should emit rowSelect event when row is selected', () => {
    const testRow = mockItems[0];
    spyOn(component.rowSelect, 'emit');

    component.handleRowSelect({ data: testRow });

    expect(component.rowSelect.emit).toHaveBeenCalledWith(testRow);
  });

  it('should handle sort changes', () => {
    mockDataSource.calls.reset();

    const mockSortEvent: SortMeta = {
      field: 'name',
      order: -1,
    };

    component.onSortChange(mockSortEvent);

    expect(component.config().params.sortField).toBe('name');
    expect(component.config().params.ascending).toBe(false);
    expect(mockDataSource).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 3,
      sortField: 'name',
      ascending: false,
    });
  });

  it('should not reload data if sort field and order are the same', () => {
    mockDataSource.calls.reset();

    const mockSortEvent: SortMeta = {
      field: 'id',
      order: 1,
    };

    component.onSortChange(mockSortEvent);

    expect(component.config().params.sortField).toBe('id');
    expect(component.config().params.ascending).toBe(true);
    expect(mockDataSource).not.toHaveBeenCalled();
  });

  it('should ignore sort events without field', () => {
    mockDataSource.calls.reset();

    const mockSortEvent: SortMeta = {
      field: '',
      order: 1,
    };

    component.onSortChange(mockSortEvent);

    expect(mockDataSource).not.toHaveBeenCalled();
  });

  it('should handle page changes', () => {
    mockDataSource.calls.reset();

    const mockPageEvent: PaginatorState = {
      page: 2,
      rows: 5,
      first: 5,
      pageCount: 2,
    };

    component.onPageChange(mockPageEvent);

    expect(component.config().params.pageNumber).toBe(2);
    expect(component.config().params.pageSize).toBe(5);
    expect(mockDataSource).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 5,
      sortField: 'id',
      ascending: true,
    });
  });

  it('should get cell value without formatter', () => {
    const row = mockItems[0];
    const column = mockColumns[0];

    const value = component.getCellValue(row, column);
    expect(value).toBe('1');
  });

  it('should get cell value with formatter', () => {
    const row = mockItems[0];
    const column: DataGridColumn<TestItem> = {
      field: 'name',
      header: 'Name',
      formatter: (value: any, item: TestItem) => `${value} (ID: ${item.id})`,
    };

    const value = component.getCellValue(row, column);
    expect(value).toBe('Item 1 (ID: 1)');
  });

  it('should return empty string for columns with no field', () => {
    const row = mockItems[0];
    const column = mockColumns[3];

    const value = component.getCellValue(row, column);
    expect(value).toBe('');
  });

  it('should return empty string for null values', () => {
    const row = { id: 1, name: null, description: 'Description' };
    const column = mockColumns[1];

    const value = component.getCellValue(row, column);
    expect(value).toBe('');
  });
});

/**
 * DataGrid Component
 *
 * A flexible and feature-rich data grid component following Fluent 2 Design System principles.
 * Uses DataSource Pattern for flexible data management and Builder Pattern for easy configuration.
 *
 * @template T - The type of data items
 */

import {
  Component,
  input,
  output,
  signal,
  computed,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';
import {
  DataGridFilterConfig,
  DataGridFilterValue,
  DataGridActiveFilter,
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from './models/data-grid-filter.model';
import { CheckboxComponent } from '../field/checkbox/checkbox.component';
import type { DateRange } from '../field/date-range/date-range.component';
import { DropdownItem } from '../field/dropdown/dropdown.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateContainerComponent } from '../state-container/state-container.component';
import { PaginationComponent, PaginationConfig } from '../pagination/pagination.component';
import { ButtonComponent } from '../button/button.component';
import { QuickAction } from '../utils';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { State } from '@shared/state/models/state.model';
import { IconName } from '../icon';
import { DataGridFilterService } from './services/data-grid-filter.service';
import { DataGridSelectionService } from './services/data-grid-selection.service';
import { DataGridSortService } from './services/data-grid-sort.service';
import { DataGridHeaderComponent } from './components/data-grid-header.component';
import { DataGridFilterRowComponent } from './components/data-grid-filter-row.component';
import { DataGridConfig } from './builders/data-grid-config.interface';
import { DataGridDataSource } from './data-sources/data-grid-data-source.interface';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CheckboxComponent,
    LoadingStateComponent,
    StateContainerComponent,
    PaginationComponent,
    ButtonComponent,
    DataGridHeaderComponent,
    DataGridFilterRowComponent,
  ],
  providers: [DataGridFilterService, DataGridSelectionService, DataGridSortService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent<T = any> implements OnInit, OnDestroy {
  // Main configuration input
  config = input.required<DataGridConfig<T>>();

  // Template for expandable rows
  rowDetailsTemplate =
    contentChild<TemplateRef<{ $implicit: DataGridRow<T> }>>('rowDetailsTemplate');

  // Outputs
  rowClick = output<DataGridRow<T>>();
  rowSelect = output<DataGridRow<T>>();
  selectionChange = output<DataGridRow<T>[]>();
  cellClick = output<{ row: DataGridRow<T>; column: DataGridColumn<T> }>();
  emptyActionClick = output<QuickAction>();
  errorActionClick = output<QuickAction>();
  sortChange = output<{ field: string; direction: 'asc' | 'desc' }>();
  pageChange = output<number>();
  pageSizeChange = output<number>();
  rowExpand = output<DataGridRow<T>>();
  rowCollapse = output<DataGridRow<T>>();
  filterChange = output<DataGridActiveFilter[]>();

  // Internal state
  private destroyRef = inject(DestroyRef);

  hoveredRowId = signal<string | null>(null);
  expandedRows = signal<Set<string>>(new Set());
  currentPage = signal<number>(1);
  currentPageSize = signal<number>(10);
  currentSort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  rows = signal<DataGridRow<T>[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalCount = signal<number>(0);

  // Services
  private filterService = inject(DataGridFilterService<T>);
  private selectionService = inject(DataGridSelectionService<T>);
  private sortService = inject(DataGridSortService<T>);

  // Computed properties from config
  columns = computed(() => this.config().columns);
  dataSource = computed(() => this.config().dataSource);
  selectionMode = computed(() => this.config().selection || 'none');
  paginationConfig = computed(() => this.config().pagination);
  sortingConfig = computed(() => this.config().sorting);
  filteringConfig = computed(() => this.config().filtering);
  stylingConfig = computed(() => this.config().styling);
  virtualizationConfig = computed(() => this.config().virtualization);
  expandable = computed(() => this.config().expandable || false);
  callbacks = computed(() => this.config().callbacks);
  loadingConfig = computed(() => this.config().loading);
  emptyConfig = computed(() => this.config().empty);
  errorConfig = computed(() => this.config().error);

  // Selection computed
  allRowsSelected = computed(() => {
    return this.selectionService.allRowsSelected(this.rows());
  });

  someRowsSelected = computed(() => {
    return this.selectionService.someRowsSelected(this.rows());
  });

  hasData = computed(() => {
    return this.rows().length > 0;
  });

  // Computed state for state-container integration
  gridState = computed<State<DataGridRow<T>[]>>(() => {
    const isLoading = this.loading();
    const isError = this.error() != null;
    const rows = this.rows();
    const errorMessage = this.error();

    return {
      isInitial: false,
      isLoading,
      isError,
      data: rows,
      error: errorMessage || undefined,
    };
  });

  // Pagination computed
  paginationConfigComputed = computed<PaginationConfig | null>(() => {
    const pagination = this.paginationConfig();
    if (!pagination?.enabled) {
      return null;
    }

    const pageSize = this.currentPageSize();
    const totalCount = this.totalCount();
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      currentPage: this.currentPage(),
      totalPages: totalPages,
      totalItems: totalCount,
      pageSize: pageSize,
      showPageSizeSelector: pagination.showPageSizeSelector ?? true,
      pageSizeOptions: pagination.pageSizeOptions ?? [10, 20, 50, 100],
      showPageNumbers: pagination.showPageNumbers ?? true,
      maxVisiblePages: 7,
      showFirstLast: pagination.showFirstLast ?? false,
      showInfo: pagination.showInfo ?? false,
    };
  });

  // Virtualization computed
  virtualizationViewportHeight = computed(() => {
    const itemHeight = this.virtualizationItemHeight();
    const rowCount = this.rows().length;

    // If virtualization is explicitly enabled, use limited height
    const virtualization = this.virtualizationConfig();
    if (virtualization?.enabled) {
      const maxVisibleRows = 10;
      return itemHeight * Math.min(rowCount, maxVisibleRows);
    }

    return itemHeight * rowCount;
  });

  // Styling computed
  size = computed(() => this.stylingConfig()?.size || 'medium');
  striped = computed(() => this.stylingConfig()?.striped || false);
  bordered = computed(() => this.stylingConfig()?.bordered || false);
  hoverable = computed(() => this.stylingConfig()?.hoverable ?? true);
  stickyHeaders = computed(() => this.stylingConfig()?.stickyHeaders || false);

  // Filter computed
  hasFilterableColumns = computed(() => {
    return this.columns().some(col => this.filterService.isColumnFilterable(col));
  });

  filterConfigsMap = computed(() => {
    const map = new Map<string, DataGridFilterConfig>();
    this.columns().forEach(column => {
      const config = this.filterService.getFilterConfig(column);
      if (config) {
        map.set(column.id, config);
      }
    });
    return map;
  });

  filterValuesMap = computed(() => {
    return this.filterService.activeFilters();
  });

  filterableColumnIdsSet = computed(() => {
    const set = new Set<string>();
    this.columns().forEach(column => {
      if (this.filterService.isColumnFilterable(column)) {
        set.add(column.id);
      }
    });
    return set;
  });

  columnMinWidthsMap = computed(() => {
    const map = new Map<string, string | null>();
    this.columns().forEach(column => {
      map.set(column.id, this.getColumnMinWidth(column));
    });
    return map;
  });

  filterPlaceholdersMap = computed(() => {
    const map = new Map<string, string>();
    this.columns().forEach(column => {
      map.set(column.id, this.filterService.getFilterPlaceholder(column));
    });
    return map;
  });

  needsOperatorSelectorMap = computed(() => {
    const map = new Map<string, boolean>();
    this.columns().forEach(column => {
      map.set(column.id, this.filterService.needsOperatorSelector(column));
    });
    return map;
  });

  needsSecondValueMap = computed(() => {
    const map = new Map<string, boolean>();
    this.columns().forEach(column => {
      map.set(column.id, this.filterService.needsSecondValue(column));
    });
    return map;
  });

  filterOperatorsMap = computed(() => {
    const map = new Map<string, DropdownItem[]>();
    this.columns().forEach(column => {
      const config = this.filterService.getFilterConfig(column);
      if (config && config.operators) {
        map.set(
          column.id,
          config.operators.map(op => ({
            value: op,
            label: this.getOperatorText(op, config.type),
            icon: this.getOperatorIcon(op),
          })),
        );
      }
    });
    return map;
  });

  currentOperatorIconsMap = computed(() => {
    const map = new Map<string, IconName>();
    this.columns().forEach(column => {
      map.set(column.id, this.getCurrentOperatorIcon(column));
    });
    return map;
  });

  dropdownItemsMap = computed(() => {
    const map = new Map<string, DropdownItem[]>();
    this.columns().forEach(column => {
      const config = this.filterService.getFilterConfig(column);
      if (config && config.options) {
        map.set(
          column.id,
          config.options.map(opt => ({
            value: opt.value,
            label: opt.label,
            disabled: opt.disabled || false,
          })),
        );
      }
    });
    return map;
  });

  booleanFilterValuesMap = computed(() => {
    const map = new Map<string, string | null>();
    this.columns().forEach(column => {
      map.set(column.id, this.getBooleanFilterValue(column.id));
    });
    return map;
  });

  dateRangeValues = computed(() => {
    return this.filterService.getDateRangeValues(this.columns());
  });

  operatorIcons = computed(() => {
    const icons = new Map<string, IconName>();
    this.columns().forEach(column => {
      if (this.isColumnFilterable(column)) {
        const filter = this.filterService.getFilterValue(column.id);
        const config = this.getFilterConfig(column);
        const operator =
          filter?.operator ||
          config?.defaultOperator ||
          (config?.type === 'text' ? 'contains' : 'equals');
        icons.set(column.id, this.getOperatorIcon(operator));
      }
    });
    return icons;
  });

  // Loading/Empty/Error state computed
  loadingTitle = computed(() => this.loadingConfig()?.title || 'Loading...');
  loadingDescription = computed(() => this.loadingConfig()?.description || '');
  loadingSpinnerSize = computed(() => this.loadingConfig()?.spinnerSize || 'medium');

  emptyTitle = computed(() => this.emptyConfig()?.title || 'No data available');
  emptyDescription = computed(
    () => this.emptyConfig()?.description || 'There is no data to display.',
  );
  emptyIcon = computed(() => {
    const icon = this.emptyConfig()?.icon;
    return icon ? (icon as IconName) : undefined;
  });
  emptyPrimaryAction = computed(() => {
    const action = this.emptyConfig()?.primaryAction;
    return action
      ? {
          label: action.label,
          variant: action.variant,
          action: action.action,
        }
      : null;
  });
  emptySecondaryAction = computed(() => {
    const action = this.emptyConfig()?.secondaryAction;
    return action
      ? {
          label: action.label,
          variant: action.variant,
          action: action.action,
        }
      : null;
  });

  errorTitle = computed(() => this.errorConfig()?.title || 'Error');
  errorDescription = computed(() => this.errorConfig()?.description || 'An error occurred');
  errorIcon = computed(() => {
    const icon = this.errorConfig()?.icon || 'error_circle';
    return icon as IconName;
  });
  errorPrimaryAction = computed(() => {
    const action = this.errorConfig()?.primaryAction;
    return action
      ? {
          label: action.label,
          variant: action.variant,
          action: action.action,
        }
      : null;
  });
  errorSecondaryAction = computed(() => {
    const action = this.errorConfig()?.secondaryAction;
    return action
      ? {
          label: action.label,
          variant: action.variant,
          action: action.action,
        }
      : null;
  });

  // Virtualization settings
  // Always use a consistent item height for CDK virtual scroll
  // Default to 48px which is standard row height
  virtualizationItemHeight = computed(() => {
    const configHeight = this.virtualizationConfig()?.itemHeight;
    return configHeight || 48;
  });
  virtualizationBufferSize = computed(() => this.virtualizationConfig()?.bufferSize || 3);

  // Sort state
  sortField = computed(() => this.sortService.getSortState().field);
  sortDirection = computed(() => this.sortService.getSortState().direction);

  constructor() {
    // Initialize default sort if configured (only once)
    effect(() => {
      const sorting = this.sortingConfig();
      if (sorting?.enabled && sorting.defaultSort && !this.currentSort()) {
        this.sortService.setSort(sorting.defaultSort.field, sorting.defaultSort.direction);
        this.currentSort.set(sorting.defaultSort);
      }
    });

    // Initialize pagination (only once)
    effect(() => {
      const pagination = this.paginationConfig();
      if (pagination?.enabled && this.currentPageSize() === 10 && this.currentPage() === 1) {
        this.currentPageSize.set(pagination.pageSize || 10);
        this.currentPage.set(1);
      }
    });

    // Connect to data source when config changes
    effect(() => {
      const source = this.dataSource();
      if (source) {
        this.connectDataSource(source);
      }
    });

    // Update data source query params when filters/sort/pagination change
    effect(() => {
      const source = this.dataSource();
      if (!source) return;

      // Read all reactive values
      const filters = this.filterService.getActiveFiltersArray(this.columns());
      const sort = this.currentSort();
      const page = this.currentPage();
      const pageSize = this.currentPageSize();
      const pagination = this.paginationConfig();

      // Update query params
      source.setQueryParams({
        filters: filters.length > 0 ? filters : undefined,
        sort: sort || undefined,
        page: pagination?.enabled ? page : undefined,
        pageSize: pagination?.enabled ? pageSize : undefined,
      });
    });
  }

  ngOnInit(): void {
    // Data source connection is handled by effect in constructor
  }

  ngOnDestroy(): void {
    this.disconnectDataSource();
  }

  private currentDataSource: DataGridDataSource<T> | null = null;

  /**
   * Connects to the data source
   */
  private connectDataSource(source: DataGridDataSource<T>): void {
    // Validate source
    if (!source) {
      console.warn('DataGrid: Attempted to connect null data source');
      return;
    }

    if (!source.connect || typeof source.connect !== 'function') {
      throw new Error('DataGrid: Invalid data source - missing connect() method');
    }

    // Only disconnect if source changed
    if (this.currentDataSource && this.currentDataSource !== source) {
      this.disconnectDataSource();
    }

    this.currentDataSource = source;

    // Subscribe to data with automatic cleanup
    source
      .connect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: rows => {
          this.rows.set(rows);
        },
        error: error => {
          console.error('DataGrid data source error:', error);
          this.error.set(error?.message || 'Failed to load data');
        },
      });

    // Subscribe to loading state with automatic cleanup
    source
      .isLoading()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: isLoading => {
          this.loading.set(isLoading);
        },
      });

    // Subscribe to error state with automatic cleanup
    source
      .getError()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: error => {
          this.error.set(error);
        },
      });

    // Subscribe to total count with automatic cleanup
    source
      .getTotalCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: count => {
          this.totalCount.set(count);
        },
      });
  }

  /**
   * Disconnects from the data source
   */
  private disconnectDataSource(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // Only reset the current data source reference
    if (this.currentDataSource) {
      this.currentDataSource = null;
    }
  }

  // Methods
  getDataGridClasses(): string {
    const classes = ['data-grid'];
    classes.push(`data-grid--${this.size()}`);

    if (this.striped()) {
      classes.push('data-grid--striped');
    }

    if (this.bordered()) {
      classes.push('data-grid--bordered');
    }

    if (this.hoverable()) {
      classes.push('data-grid--hoverable');
    }

    return classes.join(' ');
  }

  getHeaderClasses(): string {
    const classes = ['data-grid__header'];

    if (this.stickyHeaders()) {
      classes.push('data-grid__header--sticky');
    }

    return classes.join(' ');
  }

  getHeaderCellClasses(column: DataGridColumn<T> | null, isSelection: boolean = false): string {
    const classes = ['data-grid__header-cell'];

    if (isSelection) {
      classes.push('data-grid__header-cell--selection');
    }

    if (column?.headerStyle) {
      classes.push(`data-grid__header-cell--${column.headerStyle}`);
    }

    if (column?.alignment) {
      classes.push(`data-grid__header-cell--${column.alignment}`);
    }

    if (column?.sortable) {
      classes.push('data-grid__header-cell--sortable');
    }

    if (column?.sortable && this.sortService.isColumnSorted(column)) {
      const sortState = this.sortService.getSortState();
      classes.push(`data-grid__header-cell--sorted-${sortState.direction}`);
    }

    return classes.join(' ');
  }

  getSelectionHeaderClasses(): string {
    return this.getHeaderCellClasses(null, true);
  }

  getRowClasses(row: DataGridRow<T>): string {
    const classes = ['data-grid__row'];

    if (row.selected || this.selectionService.isRowSelected(row)) {
      classes.push('data-grid__row--selected');
    }

    if (row.disabled) {
      classes.push('data-grid__row--disabled');
    }

    if (this.hoveredRowId() === row.id) {
      classes.push('data-grid__row--hovered');
    }

    if (this.isRowExpanded(row)) {
      classes.push('data-grid__row--expanded');
    }

    return classes.join(' ');
  }

  getCellClasses(column: DataGridColumn<T> | null, isSelection: boolean = false): string {
    const classes = ['data-grid__cell'];

    if (isSelection) {
      classes.push('data-grid__cell--selection');
    }

    const style = column?.style || 'none';
    classes.push(`data-grid__cell--${style}`);

    if (column?.alignment) {
      classes.push(`data-grid__cell--${column.alignment}`);
    }

    return classes.join(' ');
  }

  getSelectionCellClasses(): string {
    return this.getCellClasses(null, true);
  }

  // Selection methods
  isSelectable(): boolean {
    return this.selectionMode() !== 'none';
  }

  isMultiSelect(): boolean {
    return this.selectionMode() === 'multi';
  }

  toggleAllRows(): void {
    this.selectionService.toggleAllRows(this.rows());
    this.emitSelectionChange();
  }

  toggleRow(row: DataGridRow<T>): void {
    const multiSelect = this.isMultiSelect();
    this.selectionService.toggleRow(row, multiSelect);
    this.rowSelect.emit(row);
    this.emitSelectionChange();
  }

  isRowSelected(row: DataGridRow<T>): boolean {
    return this.selectionService.isRowSelected(row);
  }

  private emitSelectionChange(): void {
    const selected = this.selectionService.getSelectedRows(this.rows());
    this.selectionChange.emit(selected);
    this.callbacks()?.onSelectionChange?.(selected);
  }

  // Row interaction methods
  onRowMouseEnter(row: DataGridRow<T>): void {
    if (!row.disabled) {
      this.hoveredRowId.set(row.id);
    }
  }

  onRowMouseLeave(row: DataGridRow<T>): void {
    this.hoveredRowId.set(null);
  }

  onRowClick(row: DataGridRow<T>): void {
    if (!row.disabled) {
      this.rowClick.emit(row);
      this.callbacks()?.onRowClick?.(row);

      if (this.isSelectable()) {
        this.toggleRow(row);
      }
    }
  }

  onCellClick(row: DataGridRow<T>, column: DataGridColumn<T>, event: MouseEvent): void {
    event.stopPropagation();
    this.cellClick.emit({ row, column });
    this.callbacks()?.onCellClick?.(row, column);
  }

  // Cell value retrieval
  getCellValue(row: DataGridRow<T>, column: DataGridColumn<T>): any {
    if (column.cellTemplate) {
      return column.cellTemplate(row.data);
    }

    if (column.field) {
      return row.data[column.field];
    }

    return '';
  }

  // Track by functions for performance
  trackByRowId(index: number, row: DataGridRow<T>): string {
    return row.id;
  }

  trackByColumnId(index: number, column: DataGridColumn<T>): string {
    return column.id;
  }

  // Sorting methods
  onHeaderClick(column: DataGridColumn<T>, event: Event): void {
    event.stopPropagation();

    const sorting = this.sortingConfig();
    if (!sorting?.enabled || !column.sortable || !column.field) {
      return;
    }

    const sortState = this.sortService.handleHeaderClick(column);
    if (sortState) {
      this.currentSort.set({
        field: sortState.field!,
        direction: sortState.direction,
      });
      this.sortChange.emit({
        field: sortState.field!,
        direction: sortState.direction,
      });
      this.callbacks()?.onSortChange?.({
        field: sortState.field!,
        direction: sortState.direction,
      });
    }
  }

  getSortIcon(column: DataGridColumn<T>): IconName | null {
    return this.sortService.getSortIcon(column);
  }

  isColumnSorted(column: DataGridColumn<T>): boolean {
    return this.sortService.isColumnSorted(column);
  }

  // State component helpers
  onEmptyActionClick(action: QuickAction): void {
    this.emptyActionClick.emit(action);
    action.action();
  }

  onErrorActionClick(action: QuickAction): void {
    this.errorActionClick.emit(action);
    action.action();
  }

  // Pagination event handlers
  onPaginationPageChange(page: number): void {
    this.currentPage.set(page);
    this.pageChange.emit(page);
    this.callbacks()?.onPageChange?.(page);
  }

  onPaginationPageSizeChange(size: number): void {
    this.currentPageSize.set(size);
    this.currentPage.set(1); // Reset to first page
    this.pageSizeChange.emit(size);
    this.callbacks()?.onPageSizeChange?.(size);
  }

  // Expandable rows methods
  toggleRowExpansion(row: DataGridRow<T>, event?: Event): void {
    if (row.disabled || !this.expandable()) {
      return;
    }

    if (event) {
      event.stopPropagation();
    }

    const expanded = new Set(this.expandedRows());
    const isExpanded = expanded.has(row.id);

    if (isExpanded) {
      expanded.delete(row.id);
      this.rowCollapse.emit(row);
      this.callbacks()?.onRowCollapse?.(row);
    } else {
      expanded.add(row.id);
      this.rowExpand.emit(row);
      this.callbacks()?.onRowExpand?.(row);
    }

    this.expandedRows.set(expanded);
  }

  isRowExpanded(row: DataGridRow<T>): boolean {
    return this.expandedRows().has(row.id) || row.expanded === true;
  }

  getExpandIcon(row: DataGridRow<T>): IconName {
    return this.isRowExpanded(row) ? 'chevron_down' : 'chevron_right';
  }

  hasRowDetails(row: DataGridRow<T>): boolean {
    return this.expandable() && this.rowDetailsTemplate() != null;
  }

  // Filter methods - delegate to filterService
  isColumnFilterable(column: DataGridColumn<T>): boolean {
    return this.filterService.isColumnFilterable(column);
  }

  getFilterConfig(column: DataGridColumn<T>): DataGridFilterConfig | null {
    return this.filterService.getFilterConfig(column);
  }

  getFilterValue(columnId: string): DataGridFilterValue | null {
    return this.filterService.getFilterValue(columnId);
  }

  hasActiveFilter(columnId: string): boolean {
    return this.filterService.hasActiveFilter(columnId);
  }

  getFilterPlaceholder(column: DataGridColumn<T>): string {
    return this.filterService.getFilterPlaceholder(column);
  }

  // Text filter methods
  onTextFilterChange(column: DataGridColumn<T>, value: string): void {
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  onTextFilterOperatorChange(column: DataGridColumn<T>, operator: TextFilterOperator): void {
    this.filterService.handleFilterOperatorChange(column, operator);
    this.emitFilterChange();
  }

  // Number filter methods
  onNumberFilterChange(
    column: DataGridColumn<T>,
    value: string,
    operator?: NumberFilterOperator,
  ): void {
    if (operator) {
      this.filterService.handleFilterOperatorChange(column, operator);
    }
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  onNumberFilterOperatorChange(column: DataGridColumn<T>, operator: NumberFilterOperator): void {
    this.filterService.handleFilterOperatorChange(column, operator);
    this.emitFilterChange();
  }

  onNumberFilterValueToChange(column: DataGridColumn<T>, value: string): void {
    this.filterService.handleFilterValueToChange(column, value);
    this.emitFilterChange();
  }

  // Date filter methods
  onDateFilterChange(
    column: DataGridColumn<T>,
    value: string,
    operator?: DateFilterOperator,
  ): void {
    if (operator) {
      this.filterService.handleFilterOperatorChange(column, operator);
    }
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  onDateFilterOperatorChange(column: DataGridColumn<T>, operator: DateFilterOperator): void {
    this.filterService.handleFilterOperatorChange(column, operator);
    this.emitFilterChange();
  }

  onDateFilterValueToChange(column: DataGridColumn<T>, value: string): void {
    this.filterService.handleFilterValueToChange(column, value);
    this.emitFilterChange();
  }

  // Date range filter method (for 'between' operator)
  onDateRangeFilterChange(column: DataGridColumn<T>, range: DateRange | null): void {
    this.filterService.handleDateRangeChange(column, range);
    this.emitFilterChange();
  }

  // Get date range value for binding
  getDateRangeValue(columnId: string): DateRange | null {
    return this.dateRangeValues().get(columnId) ?? null;
  }

  // Select filter methods
  onSelectFilterChange(column: DataGridColumn<T>, value: any): void {
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  // Multi-select filter methods
  onMultiSelectFilterChange(column: DataGridColumn<T>, value: any): void {
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  // Boolean filter methods
  onBooleanFilterChange(column: DataGridColumn<T>, value: any): void {
    this.filterService.handleFilterChange(column, value, filter => {
      this.filterService.updateFilter(column.id, column, filter);
      this.emitFilterChange();
    });
  }

  // Clear filter
  clearFilter(column: DataGridColumn<T>): void {
    this.filterService.clearFilter(column);
    this.emitFilterChange();
  }

  // Emit filter change
  private emitFilterChange(): void {
    const activeFiltersArray = this.filterService.getActiveFiltersArray(this.columns());
    this.filterChange.emit(activeFiltersArray);
    this.callbacks()?.onFilterChange?.(activeFiltersArray);
  }

  private getOperatorIcon(
    operator: TextFilterOperator | NumberFilterOperator | DateFilterOperator | undefined,
  ): IconName {
    if (!operator) return 'filter';

    const iconMap: Record<string, IconName> = {
      // Text operators
      contains: 'search',
      equals: 'checkmark',
      startsWith: 'text_align_left',
      endsWith: 'text_align_right',
      // Number operators
      notEquals: 'dismiss',
      greaterThan: 'arrow_up',
      lessThan: 'arrow_down',
      greaterOrEqual: 'arrow_maximize_vertical',
      lessOrEqual: 'arrow_minimize_vertical',
      between: 'arrow_swap',
      // Date operators
      before: 'chevron_left',
      after: 'chevron_right',
    };

    return iconMap[operator] || 'filter';
  }

  // Get filter operators for dropdown
  getFilterOperators(column: DataGridColumn<T>): DropdownItem[] {
    const config = this.getFilterConfig(column);
    if (!config || !config.operators) return [];

    return config.operators.map(op => ({
      value: op,
      label: this.getOperatorText(op, config.type),
      icon: this.getOperatorIcon(op),
    }));
  }

  // Get operator text for display
  private getOperatorText(
    operator: TextFilterOperator | NumberFilterOperator | DateFilterOperator,
    filterType: string,
  ): string {
    const operatorMap: Record<string, string> = {
      // Text operators
      contains: 'contains',
      equals: '=',
      startsWith: 'starts with',
      endsWith: 'ends with',
      // Number operators
      notEquals: '!=',
      greaterThan: '>',
      lessThan: '<',
      greaterOrEqual: '>=',
      lessOrEqual: '<=',
      between: 'between',
      // Date operators
      before: 'before',
      after: 'after',
    };

    return operatorMap[operator] || operator;
  }

  // Get current operator icon for dropdown
  getCurrentOperatorIcon(column: DataGridColumn<T>): IconName {
    const filter = this.filterService.getFilterValue(column.id);
    const config = this.getFilterConfig(column);
    const operator =
      filter?.operator ||
      config?.defaultOperator ||
      (config?.type === 'text' ? 'contains' : 'equals');
    return this.getOperatorIcon(operator);
  }

  // Get operator icon for a column (reactive version)
  getOperatorIconForColumn(columnId: string): string {
    return this.operatorIcons().get(columnId) ?? 'filter';
  }

  // Check if filter needs operator selector
  needsOperatorSelector(column: DataGridColumn<T>): boolean {
    return this.filterService.needsOperatorSelector(column);
  }

  // Check if filter needs second value (for 'between' operator)
  needsSecondValue(column: DataGridColumn<T>): boolean {
    return this.filterService.needsSecondValue(column);
  }

  // Get dropdown items from filter options
  getDropdownItems(column: DataGridColumn<T>): DropdownItem[] {
    const config = this.getFilterConfig(column);
    if (!config || !config.options) return [];

    return config.options.map(opt => ({
      value: opt.value,
      label: opt.label,
      disabled: opt.disabled || false,
    }));
  }

  // Get filter cell classes
  getFilterCellClasses(column: DataGridColumn<T> | null, isSelection: boolean = false): string {
    const classes = ['data-grid__filter-cell'];

    if (isSelection) {
      classes.push('data-grid__filter-cell--selection');
    }

    if (column?.alignment) {
      classes.push(`data-grid__filter-cell--${column.alignment}`);
    }

    return classes.join(' ');
  }

  // Get boolean filter options
  getBooleanFilterOptions(): DropdownItem[] {
    return [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ];
  }

  // Get boolean filter value for binding
  getBooleanFilterValue(columnId: string): string | null {
    const filter = this.getFilterValue(columnId);
    if (filter?.value === true) return 'true';
    if (filter?.value === false) return 'false';
    return null;
  }

  // Get minimum width for column with filter
  getColumnMinWidth(column: DataGridColumn<T>): string | null {
    if (!this.isColumnFilterable(column)) {
      return null;
    }

    const config = this.getFilterConfig(column);
    if (!config) return null;

    // Columns with operator selector need more space (operator button + input)
    if (config.type === 'number' || config.type === 'date' || config.type === 'text') {
      if (this.needsOperatorSelector(column)) {
        return '280px'; // Operator button (~40px) + input (~200px) + gap + padding
      }
      return '200px'; // Just input
    }

    // Other filter types
    return '180px';
  }
}

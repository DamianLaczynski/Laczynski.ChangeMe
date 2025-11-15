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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';
import {
  DataGridFilterConfig,
  DataGridFilterValue,
  DataGridActiveFilter,
  DataGridFilterType,
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from './models/data-grid-filter.model';
import { CheckboxComponent } from '../field/checkbox/checkbox.component';
import { TextComponent } from '../field/text/text.component';
import { NumberComponent } from '../field/number/number.component';
import { DateComponent } from '../field/date/date.component';
import { DateRangeComponent } from '../field/date-range/date-range.component';
import type { DateRange } from '../field/date-range/date-range.component';
import { DropdownComponent, DropdownItem } from '../field/dropdown/dropdown.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { StateContainerComponent } from '../state-container/state-container.component';
import { IconComponent } from '../icon/icon.component';
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
export class DataGridComponent<T = any> {
  // Inputs
  columns = input<DataGridColumn<T>[]>([]);
  rows = input<DataGridRow<T>[]>([]);
  selectable = input<boolean>(false);
  multiSelect = input<boolean>(false);
  striped = input<boolean>(false);
  bordered = input<boolean>(false);
  hoverable = input<boolean>(true);
  size = input<'small' | 'medium' | 'large'>('medium');
  loading = input<boolean>(false);
  stickyHeaders = input<boolean>(false);

  // State input (optional - if provided, will override loading/error/rows)
  state = input<State<DataGridRow<T>[]> | null>(null);

  // Loading state configuration
  loadingTitle = input<string>('');
  loadingDescription = input<string>('');
  loadingSpinnerSize = input<
    'extra-tiny' | 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge'
  >('medium');

  // Empty state configuration
  emptyTitle = input<string>('');
  emptyDescription = input<string>('');
  emptyIcon = input<IconName | undefined>(undefined);
  emptyPrimaryAction = input<QuickAction | null>(null);
  emptySecondaryAction = input<QuickAction | null>(null);

  // Error state configuration
  error = input<boolean>(false);
  errorTitle = input<string>('');
  errorDescription = input<string>('');
  errorIcon = input<IconName>('error_circle');
  errorPrimaryAction = input<QuickAction | null>(null);
  errorSecondaryAction = input<QuickAction | null>(null);

  // Pagination configuration
  enablePagination = input<boolean>(false);
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  paginationShowPageSizeSelector = input<boolean>(true);
  paginationShowPageNumbers = input<boolean>(true);
  paginationMaxVisiblePages = input<number>(7);
  paginationShowFirstLast = input<boolean>(false);
  paginationShowInfo = input<boolean>(false);

  // Expandable rows configuration
  expandable = input<boolean>(false);
  rowDetailsTemplate =
    contentChild<TemplateRef<{ $implicit: DataGridRow<T> }>>('rowDetailsTemplate');

  // Virtualization configuration
  virtualizationItemHeight = input<number>(48); // Default row height in pixels
  virtualizationBufferSize = input<number>(3); // Number of items to render outside viewport

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
  hoveredRowId = signal<string | null>(null);
  expandedRows = signal<Set<string>>(new Set());

  // Services
  private filterService = inject(DataGridFilterService<T>);
  private selectionService = inject(DataGridSelectionService<T>);
  private sortService = inject(DataGridSortService<T>);

  // Computed properties
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
    const providedState = this.state();
    if (providedState !== null) {
      // Ensure data is always an array
      return {
        ...providedState,
        data: providedState.data ?? [],
      };
    }

    // Build state from individual inputs for backward compatibility
    const isLoading = this.loading();
    const isError = this.error();
    const rows = this.rows();

    // Don't set isInitial = true, let empty state handle empty arrays
    // This ensures empty state is shown instead of initial template (which we don't provide)
    const isInitial = false;

    return {
      isInitial,
      isLoading,
      isError,
      data: rows,
      error: isError ? this.errorDescription() || 'An error occurred' : undefined,
    };
  });

  paginationConfig = computed<PaginationConfig>(() => {
    const totalPages = Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
    return {
      currentPage: this.currentPage(),
      totalPages: totalPages,
      totalItems: this.totalCount(),
      pageSize: this.pageSize(),
      showPageSizeSelector: this.paginationShowPageSizeSelector(),
      pageSizeOptions: this.pageSizeOptions(),
      showPageNumbers: this.paginationShowPageNumbers(),
      maxVisiblePages: this.paginationMaxVisiblePages(),
      showFirstLast: this.paginationShowFirstLast(),
      showInfo: this.paginationShowInfo(),
    };
  });

  virtualizationViewportHeight = computed(() => {
    // Use data from state if available, otherwise fall back to rows()
    const rowCount = this.gridState().data?.length ?? this.rows().length;
    const maxVisibleRows = 10; // Maximum visible rows before scrolling
    return this.virtualizationItemHeight() * Math.min(rowCount, maxVisibleRows);
  });

  hasFilterableColumns = computed(() => {
    return this.columns().some(col => this.filterService.isColumnFilterable(col));
  });

  // Computed properties for filter row component
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
  toggleAllRows(): void {
    this.selectionService.toggleAllRows(this.rows());
    this.emitSelectionChange();
  }

  toggleRow(row: DataGridRow<T>): void {
    this.selectionService.toggleRow(row, this.multiSelect());
    this.rowSelect.emit(row);
    this.emitSelectionChange();
  }

  isRowSelected(row: DataGridRow<T>): boolean {
    return this.selectionService.isRowSelected(row);
  }

  private emitSelectionChange(): void {
    const selected = this.selectionService.getSelectedRows(this.rows());
    this.selectionChange.emit(selected);
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
      if (this.selectable()) {
        this.toggleRow(row);
      }
    }
  }

  onCellClick(row: DataGridRow<T>, column: DataGridColumn<T>, event: MouseEvent): void {
    event.stopPropagation();
    this.cellClick.emit({ row, column });
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
    const sortState = this.sortService.handleHeaderClick(column);
    if (sortState) {
      this.sortChange.emit({
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

  // Expose sort state for template
  sortField(): string | null {
    return this.sortService.getSortState().field;
  }

  sortDirection(): 'asc' | 'desc' {
    return this.sortService.getSortState().direction;
  }

  // State component helpers
  onEmptyActionClick(action: QuickAction): void {
    this.emptyActionClick.emit(action);
  }

  onErrorActionClick(action: QuickAction): void {
    this.errorActionClick.emit(action);
  }

  // Pagination event handlers
  onPaginationPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPaginationPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
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
    } else {
      expanded.add(row.id);
      this.rowExpand.emit(row);
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

  // Get date range value for binding (uses computed signal to prevent infinite loops)
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
    filterType: DataGridFilterType,
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

  // Computed map of column IDs to operator icons for reactive updates
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

  // Computed map of column IDs to date range values (for 'between' operator)
  // This prevents creating new objects on every call, which causes infinite loops
  dateRangeValues = computed(() => {
    return this.filterService.getDateRangeValues(this.columns());
  });

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

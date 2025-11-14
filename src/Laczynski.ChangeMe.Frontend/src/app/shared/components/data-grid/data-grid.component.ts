import {
  Component,
  input,
  output,
  signal,
  computed,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
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
import { DateRangeComponent, DateRange } from '../field/date-range/date-range.component';
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

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CheckboxComponent,
    TextComponent,
    NumberComponent,
    DateComponent,
    DateRangeComponent,
    DropdownComponent,
    LoadingStateComponent,
    StateContainerComponent,
    IconComponent,
    PaginationComponent,
    ButtonComponent,
  ],
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
  selectedRows = signal<Set<string>>(new Set());
  hoveredRowId = signal<string | null>(null);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  expandedRows = signal<Set<string>>(new Set());

  // Filter state
  activeFilters = signal<Map<string, DataGridFilterValue>>(new Map());
  filterDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Cache for date range values to prevent creating new objects unnecessarily
  private dateRangeCache = new Map<string, DateRange | null>();

  // Computed properties
  allRowsSelected = computed(() => {
    const rows = this.rows();
    if (rows.length === 0) return false;
    const selectableRows = rows.filter(row => !row.disabled);
    return selectableRows.every(row => this.selectedRows().has(row.id));
  });

  someRowsSelected = computed(() => {
    return this.selectedRows().size > 0 && !this.allRowsSelected();
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
    return this.columns().some(col => this.isColumnFilterable(col));
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

    if (column?.sortable && this.sortField() === column.field?.toString()) {
      classes.push(`data-grid__header-cell--sorted-${this.sortDirection()}`);
    }

    return classes.join(' ');
  }

  getSelectionHeaderClasses(): string {
    return this.getHeaderCellClasses(null, true);
  }

  getRowClasses(row: DataGridRow<T>): string {
    const classes = ['data-grid__row'];

    if (row.selected || this.selectedRows().has(row.id)) {
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
    if (this.allRowsSelected()) {
      this.selectedRows.set(new Set());
    } else {
      const selectableRowIds = this.rows()
        .filter(row => !row.disabled)
        .map(row => row.id);
      this.selectedRows.set(new Set(selectableRowIds));
    }
    this.emitSelectionChange();
  }

  toggleRow(row: DataGridRow<T>): void {
    if (row.disabled) return;

    const selected = new Set(this.selectedRows());

    if (selected.has(row.id)) {
      selected.delete(row.id);
    } else {
      if (!this.multiSelect()) {
        selected.clear();
      }
      selected.add(row.id);
    }

    this.selectedRows.set(selected);
    this.rowSelect.emit(row);
    this.emitSelectionChange();
  }

  isRowSelected(row: DataGridRow<T>): boolean {
    return this.selectedRows().has(row.id);
  }

  private emitSelectionChange(): void {
    const selected = this.rows().filter(row => this.selectedRows().has(row.id));
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
    if (!column.sortable || !column.field) {
      return;
    }

    event.stopPropagation();
    const field = column.field.toString();
    const isCurrentField = this.sortField() === field;

    if (isCurrentField) {
      // Toggle sort direction if same field
      const newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortDirection.set(newDirection);
    } else {
      // Set new field and default to ascending
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    this.sortChange.emit({
      field: field,
      direction: this.sortDirection(),
    });
  }

  getSortIcon(column: DataGridColumn<T>): IconName | null {
    if (!column.sortable || !column.field) {
      return null;
    }

    const field = column.field.toString();
    if (this.sortField() !== field) {
      // Neutral/unsorted state - show both arrows or sort icon
      return 'arrow_sort';
    }

    // Show direction-specific icon
    return this.sortDirection() === 'asc' ? 'arrow_up' : 'arrow_down';
  }

  isColumnSorted(column: DataGridColumn<T>): boolean {
    if (!column.sortable || !column.field) {
      return false;
    }
    return this.sortField() === column.field.toString();
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
    return this.expandable() && this.rowDetailsTemplate() !== null;
  }

  // Filter methods
  isColumnFilterable(column: DataGridColumn<T>): boolean {
    return (
      column.filterable === true ||
      (typeof column.filterable === 'object' && column.filterable !== null)
    );
  }

  getFilterConfig(column: DataGridColumn<T>): DataGridFilterConfig | null {
    if (column.filterable === true) {
      // Default text filter
      return {
        type: 'text',
        placeholder: `Filter ${column.header}...`,
        debounceMs: 300,
      };
    }
    if (typeof column.filterable === 'object' && column.filterable !== null) {
      return column.filterable;
    }
    return null;
  }

  getFilterValue(columnId: string): DataGridFilterValue | null {
    return this.activeFilters().get(columnId) || null;
  }

  hasActiveFilter(columnId: string): boolean {
    const filter = this.activeFilters().get(columnId);
    if (!filter) return false;

    // Check if filter has any meaningful value
    if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
      return true;
    }
    if (filter.valueTo !== null && filter.valueTo !== undefined && filter.valueTo !== '') {
      return true;
    }
    if (filter.values && filter.values.length > 0) {
      return true;
    }

    return false;
  }

  getFilterPlaceholder(column: DataGridColumn<T>): string {
    const config = this.getFilterConfig(column);
    return config?.placeholder || `Filter ${column.header}...`;
  }

  // Text filter methods
  onTextFilterChange(column: DataGridColumn<T>, value: string): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const debounceMs = config.debounceMs || 300;

    // Clear existing timer
    const existingTimer = this.filterDebounceTimers.get(columnId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      const currentFilter = this.activeFilters().get(columnId) || {};
      const operator = currentFilter.operator || config.defaultOperator || 'contains';

      const newFilter: DataGridFilterValue = {
        ...currentFilter,
        operator: operator as TextFilterOperator,
        value: value,
      };

      this.updateFilter(columnId, column, newFilter);
      this.filterDebounceTimers.delete(columnId);
    }, debounceMs);

    this.filterDebounceTimers.set(columnId, timer);
  }

  onTextFilterOperatorChange(column: DataGridColumn<T>, operator: TextFilterOperator): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      operator: operator,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Number filter methods
  onNumberFilterChange(
    column: DataGridColumn<T>,
    value: string,
    operator?: NumberFilterOperator,
  ): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const currentFilter = this.activeFilters().get(columnId) || {};
    const filterOperator = operator || currentFilter.operator || config.defaultOperator || 'equals';

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      operator: filterOperator as NumberFilterOperator,
      value: value ? parseFloat(value) : null,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  onNumberFilterOperatorChange(column: DataGridColumn<T>, operator: NumberFilterOperator): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      operator: operator,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  onNumberFilterValueToChange(column: DataGridColumn<T>, value: string): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      valueTo: value ? parseFloat(value) : null,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Date filter methods
  onDateFilterChange(
    column: DataGridColumn<T>,
    value: string,
    operator?: DateFilterOperator,
  ): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const currentFilter = this.activeFilters().get(columnId) || {};
    const filterOperator = operator || currentFilter.operator || config.defaultOperator || 'equals';

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      operator: filterOperator as DateFilterOperator,
      value: value || null,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  onDateFilterOperatorChange(column: DataGridColumn<T>, operator: DateFilterOperator): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      operator: operator,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  onDateFilterValueToChange(column: DataGridColumn<T>, value: string): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      valueTo: value || null,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Date range filter method (for 'between' operator)
  onDateRangeFilterChange(column: DataGridColumn<T>, range: DateRange | null): void {
    const columnId = column.id;
    const currentFilter = this.activeFilters().get(columnId) || {};

    // Check if values actually changed to prevent infinite loops
    const currentStartDate = currentFilter.value || null;
    const currentEndDate = currentFilter.valueTo || null;
    const newStartDate = range?.startDate || null;
    const newEndDate = range?.endDate || null;

    if (currentStartDate === newStartDate && currentEndDate === newEndDate) {
      // Values haven't changed, skip update
      return;
    }

    const newFilter: DataGridFilterValue = {
      ...currentFilter,
      value: newStartDate,
      valueTo: newEndDate,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Get date range value for binding (uses computed signal to prevent infinite loops)
  getDateRangeValue(columnId: string): DateRange | null {
    return this.dateRangeValues().get(columnId) || null;
  }

  // Select filter methods
  onSelectFilterChange(column: DataGridColumn<T>, value: any): void {
    const columnId = column.id;

    const newFilter: DataGridFilterValue = {
      value: value || null,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Multi-select filter methods
  onMultiSelectFilterChange(column: DataGridColumn<T>, value: any): void {
    const columnId = column.id;
    // Dropdown in multi mode returns array
    const values = Array.isArray(value) ? value : value ? [value] : [];

    const newFilter: DataGridFilterValue = {
      values: values,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Boolean filter methods
  onBooleanFilterChange(column: DataGridColumn<T>, value: any): void {
    const columnId = column.id;
    // Handle null/undefined from clearable dropdown
    let boolValue: boolean | null = null;
    if (value === 'true' || value === true) {
      boolValue = true;
    } else if (value === 'false' || value === false) {
      boolValue = false;
    }

    const newFilter: DataGridFilterValue = {
      value: boolValue,
    };

    this.updateFilter(columnId, column, newFilter);
  }

  // Clear filter
  clearFilter(column: DataGridColumn<T>): void {
    const columnId = column.id;

    // Clear debounce timer if exists
    const timer = this.filterDebounceTimers.get(columnId);
    if (timer) {
      clearTimeout(timer);
      this.filterDebounceTimers.delete(columnId);
    }

    const filters = new Map(this.activeFilters());
    filters.delete(columnId);
    this.activeFilters.set(filters);

    this.emitFilterChange();
  }

  // Update filter helper
  private updateFilter(
    columnId: string,
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
  ): void {
    const filters = new Map(this.activeFilters());

    // Check if filter is empty (no values)
    const isEmpty =
      !filter.value && !filter.valueTo && (!filter.values || filter.values.length === 0);

    // Remove filter if empty AND has no operator
    // Keep filter if it has operator (even without values yet) - user might be selecting values
    if (isEmpty && !filter.operator) {
      filters.delete(columnId);
    } else {
      // Keep filter if it has operator or values
      filters.set(columnId, filter);
    }

    this.activeFilters.set(filters);
    this.emitFilterChange();
  }

  // Emit filter change
  private emitFilterChange(): void {
    const activeFiltersArray: DataGridActiveFilter[] = [];

    this.activeFilters().forEach((filter, columnId) => {
      const column = this.columns().find(col => col.id === columnId);
      if (!column) return;

      const config = this.getFilterConfig(column);
      if (!config) return;

      activeFiltersArray.push({
        columnId,
        type: config.type,
        filter,
        displayText: this.getFilterDisplayText(column, filter),
      });
    });

    this.filterChange.emit(activeFiltersArray);
  }

  // Get filter display text
  private getFilterDisplayText(column: DataGridColumn<T>, filter: DataGridFilterValue): string {
    const config = this.getFilterConfig(column);
    if (!config) return '';

    const operatorText = this.getOperatorText(filter.operator, config.type);

    if (config.type === 'text') {
      return `${column.header} ${operatorText} "${filter.value}"`;
    }

    if (config.type === 'number') {
      if (filter.operator === 'between') {
        return `${column.header} between ${filter.value} and ${filter.valueTo}`;
      }
      return `${column.header} ${operatorText} ${filter.value}`;
    }

    if (config.type === 'date') {
      if (filter.operator === 'between') {
        return `${column.header} between ${filter.value} and ${filter.valueTo}`;
      }
      return `${column.header} ${operatorText} ${filter.value}`;
    }

    if (config.type === 'select') {
      const option = config.options?.find(opt => opt.value === filter.value);
      return `${column.header} = ${option?.label || filter.value}`;
    }

    if (config.type === 'multi-select') {
      if (!filter.values || filter.values.length === 0) return '';
      const selectedOptions = config.options
        ?.filter(opt => filter.values?.includes(opt.value))
        .map(opt => opt.label)
        .join(', ');
      return `${column.header} in (${selectedOptions || filter.values.join(', ')})`;
    }

    if (config.type === 'boolean') {
      if (filter.value === true) return `${column.header} = Yes`;
      if (filter.value === false) return `${column.header} = No`;
      return '';
    }

    return '';
  }

  // Get operator text
  private getOperatorText(
    operator: TextFilterOperator | NumberFilterOperator | DateFilterOperator | undefined,
    filterType: DataGridFilterType,
  ): string {
    if (!operator) return '';

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

  // Get current operator icon for dropdown
  getCurrentOperatorIcon(column: DataGridColumn<T>): IconName {
    // Use computed to track changes in activeFilters
    const filter = this.activeFilters().get(column.id);
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
        const filter = this.activeFilters().get(column.id);
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
    const ranges = new Map<string, DateRange | null>();
    const filters = this.activeFilters();

    this.columns().forEach(column => {
      if (this.isColumnFilterable(column)) {
        const filter = filters.get(column.id);
        if (filter && filter.operator === 'between') {
          const startDate = filter.value || null;
          const endDate = filter.valueTo || null;

          // Check cache first to avoid creating new objects
          const cached = this.dateRangeCache.get(column.id);
          if (cached && cached.startDate === startDate && cached.endDate === endDate) {
            ranges.set(column.id, cached);
          } else {
            // Create new object only if values changed
            const newRange: DateRange | null =
              startDate || endDate
                ? {
                    startDate: startDate,
                    endDate: endDate,
                  }
                : null;
            ranges.set(column.id, newRange);
            this.dateRangeCache.set(column.id, newRange);
          }
        } else {
          ranges.set(column.id, null);
          this.dateRangeCache.delete(column.id);
        }
      }
    });
    return ranges;
  });

  // Get operator icon for a column (reactive version)
  getOperatorIconForColumn(columnId: string): string {
    return this.operatorIcons().get(columnId) || 'filter';
  }

  // Check if filter needs operator selector
  needsOperatorSelector(column: DataGridColumn<T>): boolean {
    const config = this.getFilterConfig(column);
    if (!config) return false;

    if (config.showOperator !== undefined) {
      return config.showOperator;
    }

    // Default: show for number, date, and text (if operators are defined)
    if (config.type === 'number' || config.type === 'date') {
      return true;
    }

    if (config.type === 'text') {
      // Show operator selector if operators are defined
      return config.operators !== undefined && config.operators.length > 0;
    }

    return false;
  }

  // Check if filter needs second value (for 'between' operator)
  needsSecondValue(column: DataGridColumn<T>): boolean {
    const filter = this.getFilterValue(column.id);
    const config = this.getFilterConfig(column);

    // Check operator from filter first
    if (filter?.operator === 'between') {
      return true;
    }

    // If no filter yet, check if default operator is 'between'
    if (!filter && config?.defaultOperator === 'between') {
      return true;
    }

    return false;
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

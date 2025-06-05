import {
  Component,
  input,
  output,
  computed,
  signal,
  inject,
  OnInit,
  ElementRef,
  TemplateRef,
  AfterContentInit,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentSize, getNestedValue } from '../shared';
import { InputComponent } from '../input/input.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { IconComponent } from '../shared/icon/icon.component';

import {
  TableColumn,
  TableVariant,
  TableBorder,
  TableRowSelectEvent,
  TableSortEvent,
  TablePageEvent,
  TableFilterEvent,
  createTableConfig,
  getTableClasses,
  getTableColumnClasses,
  formatCellValue,
  generateTableId,
  calculateVisiblePages,
  PaginationResult,
  State,
} from './table.model';
import { ButtonComponent } from '../button';

/**
 * Table Component
 *
 * Modern data table component with sorting, pagination, filtering, and selection.
 * Compatible with existing paginated table data sources while providing modern design system features.
 * Built with Angular Signals API.
 */
@Component({
  selector: 'ds-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent, CheckboxComponent, IconComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = any> implements OnInit, AfterContentInit {
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Table visual variant */
  variant = input<TableVariant>('default');

  /** Table size */
  size = input<ComponentSize>('md');

  /** Table border style */
  border = input<TableBorder>('horizontal');

  /** Whether table has striped rows */
  striped = input<boolean>(false);

  /** Whether table rows are hoverable */
  hoverable = input<boolean>(true);

  /** Whether table is responsive */
  responsive = input<boolean>(true);

  /** Whether table is disabled */
  disabled = input<boolean>(false);

  /** Table columns configuration */
  columns = input.required<TableColumn<T>[]>();

  /** Table data state */
  dataState = input.required<Signal<State<PaginationResult<T>>>>();

  /** Column templates for custom rendering */
  columnTemplates = input<Record<string, TemplateRef<any>>>({});

  /** Whether to show search input */
  showSearch = input<boolean>(false);

  /** Whether to show column filters */
  showColumnFilters = input<boolean>(false);

  /** Whether to show refresh button */
  showRefresh = input<boolean>(true);

  /** Whether to show loading overlay */
  showLoadingOverlay = input<boolean>(true);

  /** Whether to show pagination */
  showPagination = input<boolean>(true);

  /** Whether to show page size selector */
  showPageSizeSelector = input<boolean>(true);

  /** Available page sizes */
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  /** Whether to show sort icons */
  showSortIcons = input<boolean>(true);

  /** Whether to show retry button on error */
  showRetry = input<boolean>(true);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Table ID (auto-generated if not provided) */
  tableId = input<string>('');

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  /** Row selection events */
  rowSelect = output<TableRowSelectEvent<T>>();

  /** Sort change events */
  sortChange = output<TableSortEvent>();

  /** Page change events */
  pageChange = output<TablePageEvent>();

  /** Filter change events */
  filterChange = output<TableFilterEvent>();

  /** Refresh events */
  refresh = output<void>();

  /** Retry events */
  retry = output<void>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal table ID */
  private internalTableId = signal<string>('');

  /** Internal search term */
  private internalSearchTerm = signal<string>('');

  /** Internal selected items */
  private internalSelectedItems = signal<T[]>([]);

  /** Internal sort state */
  private internalSortField = signal<string | null>(null);
  private internalSortDirection = signal<'asc' | 'desc' | null>(null);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Final table ID */
  finalTableId = computed(() => this.tableId() || this.internalTableId());

  /** Current search term */
  searchTerm = computed(() => this.internalSearchTerm());

  /** Current data state */
  currentDataState = computed(() => this.dataState()());

  /** Whether table is loading */
  isLoading = computed(() => this.currentDataState().isLoading);

  /** Whether table has error */
  isError = computed(() => this.currentDataState().isError);

  /** Error message */
  errorMessage = computed(
    () => this.currentDataState().error || 'An error occurred while loading data',
  );

  /** Current data */
  currentData = computed(() => this.currentDataState().data);

  /** Whether table is empty */
  isEmpty = computed(() => {
    const data = this.currentData();
    return !data || !data.items || data.items.length === 0;
  });

  /** Display data */
  displayData = computed(() => {
    const data = this.currentData();
    return data?.items || [];
  });

  /** Current page */
  currentPage = computed(() => this.currentData()?.currentPage || 1);

  /** Current page size */
  currentPageSize = computed(() => this.currentData()?.pageSize || 10);

  /** Total pages */
  totalPages = computed(() => this.currentData()?.totalPages || 1);

  /** Total items */
  totalItems = computed(() => this.currentData()?.totalCount || 0);

  /** Visible page numbers */
  visiblePages = computed(() => calculateVisiblePages(this.currentPage(), this.totalPages(), 5));

  /** Table configuration */
  config = computed(() =>
    createTableConfig({
      variant: this.variant(),
      size: this.size(),
      border: this.border(),
      striped: this.striped(),
      hoverable: this.hoverable(),
      responsive: this.responsive(),
      showLoading: true,
      showEmptyState: true,
    }),
  );

  /** Empty state configuration */
  emptyState = computed(() => this.config().emptyState);

  /** Display columns (filtered by responsive settings) */
  displayColumns = computed(() => {
    // This could be enhanced to filter columns based on screen size
    return this.columns();
  });

  /** Whether to show select column */
  showSelectColumn = computed(() => this.config().selection.mode !== 'none');

  /** Whether to show select all checkbox */
  showSelectAll = computed(
    () => this.config().selection.mode === 'multiple' && this.config().selection.showSelectAll,
  );

  /** Select all state */
  selectAllState = computed(() => {
    const items = this.displayData();
    const selected = this.internalSelectedItems();

    if (items.length === 0) return false;
    return items.every(item => selected.includes(item));
  });

  /** Select all indeterminate state */
  selectAllIndeterminate = computed(() => {
    const items = this.displayData();
    const selected = this.internalSelectedItems();

    if (items.length === 0) return false;
    const selectedCount = items.filter(item => selected.includes(item)).length;
    return selectedCount > 0 && selectedCount < items.length;
  });

  /** Total columns count for colspan */
  totalColumnsCount = computed(() => {
    let count = this.displayColumns().length;
    if (this.showSelectColumn()) count++;
    return count;
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-table-container'];

    if (this.customClasses()) {
      classes.push(this.customClasses());
    }

    return classes.join(' ');
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes = ['ds-table__wrapper'];

    if (this.responsive()) {
      classes.push('ds-table__wrapper--responsive');
    }

    return classes.join(' ');
  });

  /** Table CSS classes */
  tableClasses = computed(() => getTableClasses(this.config()).join(' '));

  /** Icon values with proper typing */
  emptyStateIconStart = computed(() => {
    const action = this.emptyState().action;
    return action?.icon ? (action.icon as any) : null;
  });

  firstPageIcon = computed(() => '⟪' as any);
  prevPageIcon = computed(() => '⟨' as any);
  nextPageIcon = computed(() => '⟩' as any);
  lastPageIcon = computed(() => '⟫' as any);

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Generate internal table ID if not provided
    if (!this.tableId()) {
      this.internalTableId.set(generateTableId());
    }
  }

  ngAfterContentInit(): void {
    // Any additional setup after content initialization
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle search input changes */
  onSearchChange(searchTerm: string): void {
    this.internalSearchTerm.set(searchTerm);

    this.filterChange.emit({
      field: 'search',
      value: searchTerm,
      filters: { search: searchTerm },
      originalEvent: new Event('search'),
    });
  }

  /** Handle refresh button click */
  onRefreshClick(): void {
    this.refresh.emit();
  }

  /** Handle retry button click */
  onRetryClick(): void {
    this.retry.emit();
  }

  /** Handle header click for sorting */
  onHeaderClick(column: TableColumn<T>, event: Event): void {
    if (!column.sortable || this.disabled() || this.isLoading()) return;

    const currentField = this.internalSortField();
    const currentDirection = this.internalSortDirection();

    let newDirection: 'asc' | 'desc';
    if (currentField === column.field.toString()) {
      // Toggle direction for same column
      newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, start with ascending
      newDirection = 'asc';
    }

    this.internalSortField.set(column.field.toString());
    this.internalSortDirection.set(newDirection);

    this.sortChange.emit({
      field: column.field.toString(),
      direction: newDirection,
      originalEvent: event,
    });
  }

  /** Handle row click */
  onRowClick(row: T, event: Event): void {
    if (this.disabled() || this.isLoading() || !this.isRowSelectable(row)) return;

    // Only handle click if it's not on a checkbox or button
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    if (this.config().selection.mode === 'single') {
      this.internalSelectedItems.set([row]);
    } else if (this.config().selection.mode === 'multiple') {
      const selected = this.internalSelectedItems();
      const isSelected = selected.includes(row);

      if (isSelected) {
        this.internalSelectedItems.set(selected.filter(item => item !== row));
      } else {
        this.internalSelectedItems.set([...selected, row]);
      }
    }

    this.rowSelect.emit({
      item: row,
      selectedItems: this.internalSelectedItems(),
      originalEvent: event,
    });
  }

  /** Handle row selection change */
  onRowSelectChange(row: T, event: any): void {
    if (this.disabled() || this.isLoading() || !this.isRowSelectable(row)) return;

    const checked = event.checked;
    const selected = this.internalSelectedItems();

    if (checked) {
      if (this.config().selection.mode === 'single') {
        this.internalSelectedItems.set([row]);
      } else {
        this.internalSelectedItems.set([...selected, row]);
      }
    } else {
      this.internalSelectedItems.set(selected.filter(item => item !== row));
    }

    this.rowSelect.emit({
      item: row,
      selectedItems: this.internalSelectedItems(),
      originalEvent: new Event('change'),
    });
  }

  /** Handle select all change */
  onSelectAllChange(event: any): void {
    if (this.disabled() || this.isLoading()) return;

    const checked = event.checked;
    const items = this.displayData();
    const selectableItems = items.filter(item => this.isRowSelectable(item));

    if (checked) {
      this.internalSelectedItems.set(selectableItems);
    } else {
      this.internalSelectedItems.set([]);
    }

    this.rowSelect.emit({
      item: selectableItems[0], // First item as representative
      selectedItems: this.internalSelectedItems(),
      originalEvent: new Event('change'),
    });
  }

  /** Handle page size change */
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.pageChange.emit({
      page: 1, // Reset to first page
      pageSize: newPageSize,
      totalRecords: this.totalItems(),
      originalEvent: event,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Get column template safely */
  getColumnTemplate(templateName: string): TemplateRef<any> | null {
    return this.columnTemplates()[templateName] || null;
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Go to specific page */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || this.disabled() || this.isLoading()) return;

    this.pageChange.emit({
      page,
      pageSize: this.currentPageSize(),
      totalRecords: this.totalItems(),
      originalEvent: new Event('page'),
    });
  }

  /** Get row ID for tracking */
  getRowId(row: T): string | number {
    const getRowIdFn = this.config().selection.getRowId;
    if (getRowIdFn) {
      return getRowIdFn(row);
    }
    return (row as any)?.id || (row as any)?.Id || JSON.stringify(row);
  }

  /** Check if row is selectable */
  isRowSelectable(row: T): boolean {
    const isSelectableFn = this.config().selection.isSelectable;
    if (isSelectableFn) {
      return isSelectableFn(row);
    }
    return true;
  }

  /** Check if row is selected */
  isRowSelected(row: T): boolean {
    return this.internalSelectedItems().includes(row);
  }

  /** Get cell value */
  getCellValue(row: T, column: TableColumn<T>): any {
    return getNestedValue(row, column.field as string);
  }

  /** Get formatted cell value */
  getFormattedCellValue(row: T, column: TableColumn<T>): string {
    const value = this.getCellValue(row, column);
    return formatCellValue(value, column);
  }

  /** Get header CSS classes */
  getHeaderClasses(column: TableColumn<T>): string {
    const classes = getTableColumnClasses(column);
    classes.push('ds-table__header');

    if (column.sortable) {
      classes.push('ds-table__header--sortable');
    }

    if (this.internalSortField() === column.field.toString()) {
      classes.push(`ds-table__header--sorted-${this.internalSortDirection()}`);
    }

    return classes.join(' ');
  }

  /** Get cell CSS classes */
  getCellClasses(column: TableColumn<T>, row: T): string {
    const classes = getTableColumnClasses(column);

    return classes.join(' ');
  }

  /** Get row CSS classes */
  getRowClasses(row: T, index: number): string {
    const classes = ['ds-table__row--data'];

    if (this.isRowSelected(row)) {
      classes.push('ds-table__row--selected');
    }

    if (!this.isRowSelectable(row)) {
      classes.push('ds-table__row--disabled');
    }

    if (this.striped() && index % 2 === 1) {
      classes.push('ds-table__row--striped');
    }

    return classes.join(' ');
  }

  /** Get sort icon */
  getSortIcon(column: TableColumn<T>): string {
    if (this.internalSortField() !== column.field.toString()) {
      return '⇅'; // Neutral sort icon
    }

    return this.internalSortDirection() === 'asc' ? '⇈' : '⇊';
  }

  /** Get sort icon CSS class */
  getSortIconClass(column: TableColumn<T>): string {
    const classes = ['ds-table__sort-icon'];

    if (this.internalSortField() === column.field.toString()) {
      classes.push(`ds-table__sort-icon--${this.internalSortDirection()}`);
    } else {
      classes.push('ds-table__sort-icon--neutral');
    }

    return classes.join(' ');
  }

  /** Get sort ARIA attribute */
  getSortAriaAttribute(column: TableColumn<T>): string | null {
    if (!column.sortable) return null;

    if (this.internalSortField() === column.field.toString()) {
      return this.internalSortDirection() === 'asc' ? 'ascending' : 'descending';
    }

    return 'none';
  }

  /** Get first item number for pagination info */
  getFirstItemNumber(): number {
    const data = this.currentData();
    if (!data || !data.items || data.items.length === 0) return 0;
    return (data.currentPage - 1) * data.pageSize + 1;
  }

  /** Get last item number for pagination info */
  getLastItemNumber(): number {
    const data = this.currentData();
    if (!data || !data.items || data.items.length === 0) return 0;
    return Math.min(data.currentPage * data.pageSize, data.totalCount);
  }

  /** Clear selection */
  clearSelection(): void {
    this.internalSelectedItems.set([]);
  }

  /** Get selected items */
  getSelectedItems(): T[] {
    return this.internalSelectedItems();
  }

  /** Select all items */
  selectAll(): void {
    const items = this.displayData();
    const selectableItems = items.filter((item: T) => this.isRowSelectable(item));
    this.internalSelectedItems.set(selectableItems);
  }
}

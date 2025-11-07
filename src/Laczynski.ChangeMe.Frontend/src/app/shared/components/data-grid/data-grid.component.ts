import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';
import { CheckboxComponent } from '../field/checkbox/checkbox.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';
import { IconComponent } from '../icon/icon.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { QuickAction } from '../utils';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    IconComponent,
    PaginationComponent,
  ],
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

  // Loading state configuration
  loadingTitle = input<string>('');
  loadingDescription = input<string>('');
  loadingSpinnerSize = input<
    'extra-tiny' | 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge'
  >('medium');

  // Empty state configuration
  emptyTitle = input<string>('');
  emptyDescription = input<string>('');
  emptyIcon = input<string>('database');
  emptyPrimaryAction = input<QuickAction | null>(null);
  emptySecondaryAction = input<QuickAction | null>(null);

  // Error state configuration
  error = input<boolean>(false);
  errorTitle = input<string>('');
  errorDescription = input<string>('');
  errorIcon = input<string>('error_circle');
  errorPrimaryAction = input<QuickAction | null>(null);
  errorSecondaryAction = input<QuickAction | null>(null);

  // Pagination configuration
  enablePagination = input<boolean>(false);
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);

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

  // Internal state
  selectedRows = signal<Set<string>>(new Set());
  hoveredRowId = signal<string | null>(null);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

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
    return 'data-grid__header';
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

  getSortIcon(column: DataGridColumn<T>): string | null {
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
}

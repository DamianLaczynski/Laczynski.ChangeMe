// =============================================================================
// DataGrid Header Component
// =============================================================================

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGridColumn } from '../models/data-grid-column.model';
import { CheckboxComponent } from '../../field/checkbox/checkbox.component';
import { IconComponent } from '../../icon/icon.component';
import { IconName } from '../../icon';

/**
 * Component for rendering data grid header row with column labels and sorting
 */
@Component({
  selector: 'app-data-grid-header',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxComponent, IconComponent],
  template: `
    <div [class]="headerClasses()">
      <!-- Header Label Row -->
      <div class="data-grid__header-row">
        <!-- Expand Column Header -->
        @if (expandable()) {
          <div
            [class]="getHeaderCellClasses(null, false)"
            class="data-grid__header-cell--expand"
          ></div>
        }

        <!-- Selection Column Header -->
        @if (selectable() && multiSelect()) {
          <div [class]="getSelectionHeaderClasses()">
            <app-checkbox
              [ngModel]="allRowsSelected()"
              [indeterminate]="someRowsSelected()"
              (ngModelChange)="toggleAllRows.emit()"
            />
          </div>
        }

        <!-- Column Headers -->
        @for (column of columns(); track trackByColumnId($index, column)) {
          <div
            [class]="getHeaderCellClasses(column)"
            [style.width]="column.width || 'auto'"
            [style.min-width]="getColumnMinWidth()(column) || column.width || null"
            [style.flex]="column.width ? 'none' : '1'"
            (click)="onHeaderClick(column, $event)"
            [attr.role]="column.sortable ? 'button' : null"
            [attr.tabindex]="column.sortable ? '0' : null"
            [attr.aria-sort]="
              column.sortable && isColumnSorted(column)
                ? sortDirection() === 'asc'
                  ? 'ascending'
                  : 'descending'
                : column.sortable
                  ? 'none'
                  : null
            "
            [attr.aria-label]="
              column.sortable
                ? column.header +
                  (isColumnSorted(column) ? ' sorted ' + sortDirection() : ' sortable')
                : null
            "
            (keydown.enter)="column.sortable && onHeaderClick(column, $event)"
            (keydown.space)="
              column.sortable && onHeaderClick(column, $event); $event.preventDefault()
            "
          >
            <div class="data-grid__header-label-content">
              @if (column.headerTemplate) {
                <div [innerHTML]="column.headerTemplate()"></div>
              } @else {
                <div class="data-grid__header-text">{{ column.header }}</div>
              }
              @if (column.sortable) {
                <div class="data-grid__header-sort-indicator">
                  @if (getSortIcon()(column)) {
                    <app-icon
                      [icon]="getSortIcon()(column)!"
                      [size]="size() === 'small' ? 'small' : 'medium'"
                    />
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridHeaderComponent<T = any> {
  // Inputs
  columns = input<DataGridColumn<T>[]>([]);
  size = input<'small' | 'medium' | 'large'>('medium');
  stickyHeaders = input<boolean>(false);
  selectable = input<boolean>(false);
  multiSelect = input<boolean>(false);
  expandable = input<boolean>(false);
  allRowsSelected = input<boolean>(false);
  someRowsSelected = input<boolean>(false);
  sortField = input<string | null>(null);
  sortDirection = input<'asc' | 'desc'>('asc');
  getColumnMinWidth = input.required<(column: DataGridColumn<T>) => string | null>();
  getSortIcon = input.required<(column: DataGridColumn<T>) => IconName | null>();

  // Outputs
  headerClick = output<{ column: DataGridColumn<T>; event: Event }>();
  toggleAllRows = output<void>();

  // Methods
  headerClasses(): string {
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

    if (column?.sortable && this.isColumnSorted(column)) {
      classes.push(`data-grid__header-cell--sorted-${this.sortDirection()}`);
    }

    return classes.join(' ');
  }

  getSelectionHeaderClasses(): string {
    return this.getHeaderCellClasses(null, true);
  }

  onHeaderClick(column: DataGridColumn<T>, event: Event): void {
    this.headerClick.emit({ column, event });
  }

  trackByColumnId(index: number, column: DataGridColumn<T>): string {
    return column.id;
  }

  isColumnSorted(column: DataGridColumn<T>): boolean {
    if (!column.sortable || !column.field) {
      return false;
    }
    return this.sortField() === column.field.toString();
  }
}

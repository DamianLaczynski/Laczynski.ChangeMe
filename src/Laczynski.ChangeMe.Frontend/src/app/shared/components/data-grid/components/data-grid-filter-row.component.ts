// =============================================================================
// DataGrid Filter Row Component
// =============================================================================

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGridColumn } from '../models/data-grid-column.model';
import {
  DataGridFilterConfig,
  DataGridFilterValue,
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from '../models/data-grid-filter.model';
import { TextComponent } from '../../field/text/text.component';
import { NumberComponent } from '../../field/number/number.component';
import { DateComponent } from '../../field/date/date.component';
import { DateRangeComponent, DateRange } from '../../field/date-range/date-range.component';
import { DropdownComponent, DropdownItem } from '../../field/dropdown/dropdown.component';
import { IconName } from '../../icon';

/**
 * Component for rendering data grid filter row
 */
@Component({
  selector: 'app-data-grid-filter-row',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextComponent,
    NumberComponent,
    DateComponent,
    DateRangeComponent,
    DropdownComponent,
  ],
  template: `
    @if (hasFilterableColumns()) {
      <div class="data-grid__filter-row">
        <!-- Expand Column Filter (empty) -->
        @if (expandable()) {
          <div [class]="getFilterCellClasses(null, false, true)"></div>
        }

        <!-- Selection Column Filter (empty) -->
        @if (selectable() && multiSelect()) {
          <div [class]="getFilterCellClasses(null, true)"></div>
        }

        <!-- Column Filters -->
        @for (column of columns(); track trackByColumnId($index, column)) {
          <div
            [class]="getFilterCellClasses(column)"
            [style.width]="column.width || 'auto'"
            [style.min-width]="columnMinWidths().get(column.id) || column.width || null"
            [style.flex]="column.width ? 'none' : '1'"
          >
            @if (filterableColumnIds().has(column.id)) {
              @switch (filterConfigs().get(column.id)?.type) {
                @case ('text') {
                  <div class="data-grid__filter-wrapper">
                    @if (needsOperatorSelectorMap().get(column.id)) {
                      <app-dropdown
                        [items]="filterOperatorsMap().get(column.id) || []"
                        [size]="size()"
                        [ngModel]="
                          filterValues().get(column.id)?.operator ||
                          filterConfigs().get(column.id)?.defaultOperator ||
                          'contains'
                        "
                        (ngModelChange)="
                          onTextFilterOperatorChange.emit({ column, operator: $event })
                        "
                        [clearable]="false"
                        [compact]="true"
                        [compactIcon]="
                          operatorIcons().get(column.id) ||
                          currentOperatorIcons().get(column.id) ||
                          'filter'
                        "
                        class="data-grid__filter-operator"
                      />
                    }
                    <app-text
                      [placeholder]="filterPlaceholders().get(column.id) || ''"
                      [size]="size()"
                      [variant]="'filled-gray'"
                      [ngModel]="filterValues().get(column.id)?.value || ''"
                      (ngModelChange)="onTextFilterChange.emit({ column, value: $event })"
                    />
                  </div>
                }
                @case ('number') {
                  <div class="data-grid__filter-wrapper">
                    @if (needsOperatorSelectorMap().get(column.id)) {
                      <app-dropdown
                        [items]="filterOperatorsMap().get(column.id) || []"
                        [size]="size()"
                        [ngModel]="
                          filterValues().get(column.id)?.operator ||
                          filterConfigs().get(column.id)?.defaultOperator ||
                          'equals'
                        "
                        (ngModelChange)="
                          onNumberFilterOperatorChange.emit({ column, operator: $event })
                        "
                        [clearable]="false"
                        [compact]="true"
                        [compactIcon]="
                          operatorIcons().get(column.id) ||
                          currentOperatorIcons().get(column.id) ||
                          'filter'
                        "
                        class="data-grid__filter-operator"
                      />
                    }
                    <app-number
                      [placeholder]="filterPlaceholders().get(column.id) || ''"
                      [size]="size()"
                      [variant]="'filled-gray'"
                      [ngModel]="filterValues().get(column.id)?.value?.toString() || ''"
                      (ngModelChange)="onNumberFilterChange.emit({ column, value: $event })"
                    />
                    @if (needsSecondValueMap().get(column.id)) {
                      <span class="data-grid__filter-separator">and</span>
                      <app-number
                        [placeholder]="'To'"
                        [size]="size()"
                        [variant]="'filled-gray'"
                        [ngModel]="filterValues().get(column.id)?.valueTo?.toString() || ''"
                        (ngModelChange)="
                          onNumberFilterValueToChange.emit({ column, value: $event })
                        "
                      />
                    }
                  </div>
                }
                @case ('date') {
                  <div class="data-grid__filter-wrapper">
                    @if (needsOperatorSelectorMap().get(column.id)) {
                      <app-dropdown
                        [items]="filterOperatorsMap().get(column.id) || []"
                        [size]="size()"
                        [ngModel]="
                          filterValues().get(column.id)?.operator ||
                          filterConfigs().get(column.id)?.defaultOperator ||
                          'equals'
                        "
                        (ngModelChange)="
                          onDateFilterOperatorChange.emit({ column, operator: $event })
                        "
                        [clearable]="false"
                        [compact]="true"
                        [compactIcon]="
                          operatorIcons().get(column.id) ||
                          currentOperatorIcons().get(column.id) ||
                          'filter'
                        "
                        class="data-grid__filter-operator"
                      />
                    }
                    @if (needsSecondValueMap().get(column.id)) {
                      <app-date-range
                        [placeholder]="filterPlaceholders().get(column.id) || ''"
                        [size]="size()"
                        [variant]="'filled-gray'"
                        [ngModel]="dateRangeValues().get(column.id)"
                        (ngModelChange)="onDateRangeFilterChange.emit({ column, range: $event })"
                      />
                    } @else {
                      <app-date
                        [dateType]="'date'"
                        [placeholder]="filterPlaceholders().get(column.id) || ''"
                        [size]="size()"
                        [variant]="'filled-gray'"
                        [ngModel]="filterValues().get(column.id)?.value || ''"
                        (ngModelChange)="onDateFilterChange.emit({ column, value: $event })"
                      />
                    }
                  </div>
                }
                @case ('select') {
                  <div class="data-grid__filter-wrapper">
                    <app-dropdown
                      variant="filled-gray"
                      [items]="dropdownItemsMap().get(column.id) || []"
                      [size]="size()"
                      [ngModel]="filterValues().get(column.id)?.value"
                      (ngModelChange)="onSelectFilterChange.emit({ column, value: $event })"
                      [clearable]="true"
                      [placeholder]="filterPlaceholders().get(column.id) || ''"
                    />
                  </div>
                }
                @case ('multi-select') {
                  <div class="data-grid__filter-wrapper">
                    <app-dropdown
                      variant="filled-gray"
                      [items]="dropdownItemsMap().get(column.id) || []"
                      [mode]="'multi'"
                      [size]="size()"
                      [ngModel]="filterValues().get(column.id)?.values || []"
                      (ngModelChange)="onMultiSelectFilterChange.emit({ column, value: $event })"
                      [clearable]="true"
                      [placeholder]="filterPlaceholders().get(column.id) || ''"
                    />
                  </div>
                }
                @case ('boolean') {
                  <div class="data-grid__filter-wrapper data-grid__filter-wrapper--boolean">
                    <app-dropdown
                      [items]="booleanFilterOptions()"
                      [size]="size()"
                      [ngModel]="booleanFilterValues().get(column.id)"
                      (ngModelChange)="onBooleanFilterChange.emit({ column, value: $event })"
                      [clearable]="true"
                      [placeholder]="filterPlaceholders().get(column.id) || ''"
                    />
                  </div>
                }
              }
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridFilterRowComponent<T = any> {
  // Inputs
  columns = input<DataGridColumn<T>[]>([]);
  size = input<'small' | 'medium' | 'large'>('medium');
  selectable = input<boolean>(false);
  multiSelect = input<boolean>(false);
  expandable = input<boolean>(false);
  hasFilterableColumns = input<boolean>(false);

  // Filter data - computed values passed as inputs
  filterConfigs = input<Map<string, DataGridFilterConfig>>(new Map());
  filterValues = input<Map<string, DataGridFilterValue>>(new Map());
  filterableColumnIds = input<Set<string>>(new Set());
  operatorIcons = input<Map<string, IconName>>(new Map());
  dateRangeValues = input<Map<string, DateRange | null>>(new Map());

  // Column metadata
  columnMinWidths = input<Map<string, string | null>>(new Map());
  filterPlaceholders = input<Map<string, string>>(new Map());
  needsOperatorSelectorMap = input<Map<string, boolean>>(new Map());
  needsSecondValueMap = input<Map<string, boolean>>(new Map());
  filterOperatorsMap = input<Map<string, DropdownItem[]>>(new Map());
  currentOperatorIcons = input<Map<string, IconName>>(new Map());
  dropdownItemsMap = input<Map<string, DropdownItem[]>>(new Map());
  booleanFilterOptions = input<DropdownItem[]>([]);
  booleanFilterValues = input<Map<string, string | null>>(new Map());

  // Outputs
  onTextFilterChange = output<{ column: DataGridColumn<T>; value: string }>();
  onTextFilterOperatorChange = output<{
    column: DataGridColumn<T>;
    operator: TextFilterOperator;
  }>();
  onNumberFilterChange = output<{ column: DataGridColumn<T>; value: string }>();
  onNumberFilterOperatorChange = output<{
    column: DataGridColumn<T>;
    operator: NumberFilterOperator;
  }>();
  onNumberFilterValueToChange = output<{ column: DataGridColumn<T>; value: string }>();
  onDateFilterChange = output<{ column: DataGridColumn<T>; value: string }>();
  onDateFilterOperatorChange = output<{
    column: DataGridColumn<T>;
    operator: DateFilterOperator;
  }>();
  onDateFilterValueToChange = output<{ column: DataGridColumn<T>; value: string }>();
  onDateRangeFilterChange = output<{ column: DataGridColumn<T>; range: DateRange | null }>();
  onSelectFilterChange = output<{ column: DataGridColumn<T>; value: any }>();
  onMultiSelectFilterChange = output<{ column: DataGridColumn<T>; value: any }>();
  onBooleanFilterChange = output<{ column: DataGridColumn<T>; value: any }>();

  // Methods
  getFilterCellClasses(column: DataGridColumn<T> | null, isSelection: boolean = false, isExpand: boolean = false): string {
    const classes = ['data-grid__filter-cell'];

    if (isSelection) {
      classes.push('data-grid__filter-cell--selection');
    }

    if (isExpand) {
      classes.push('data-grid__filter-cell--expand');
    }

    if (column?.alignment) {
      classes.push(`data-grid__filter-cell--${column.alignment}`);
    }

    return classes.join(' ');
  }

  trackByColumnId(index: number, column: DataGridColumn<T>): string {
    return column.id;
  }
}

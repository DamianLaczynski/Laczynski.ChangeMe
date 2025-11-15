// =============================================================================
// Boolean Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

export class BooleanFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: any,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    // Handle null/undefined from clearable dropdown
    let boolValue: boolean | null = null;
    if (value === 'true' || value === true) {
      boolValue = true;
    } else if (value === 'false' || value === false) {
      boolValue = false;
    }

    return {
      value: boolValue,
    };
  }

  handleOperatorChange(): DataGridFilterValue {
    throw new Error('Boolean filter does not support operator changes');
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    if (filter.value === true) return `${column.header} = Yes`;
    if (filter.value === false) return `${column.header} = No`;
    return '';
  }

  hasActiveValue(filter: DataGridFilterValue): boolean {
    return filter.value === true || filter.value === false;
  }

  needsSecondValue(): boolean {
    return false;
  }
}


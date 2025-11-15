// =============================================================================
// Multi-Select Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

export class MultiSelectFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: any,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    // Dropdown in multi mode returns array
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return {
      values: values,
    };
  }

  handleOperatorChange(): DataGridFilterValue {
    throw new Error('Multi-select filter does not support operator changes');
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    if (!filter.values?.length) return '';

    const selectedOptions = config.options
      ?.filter(opt => filter.values?.includes(opt.value))
      .map(opt => opt.label)
      .join(', ');

    return `${column.header} in (${selectedOptions ?? filter.values.join(', ')})`;
  }

  hasActiveValue(filter: DataGridFilterValue): boolean {
    return (filter.values?.length ?? 0) > 0;
  }

  needsSecondValue(): boolean {
    return false;
  }
}


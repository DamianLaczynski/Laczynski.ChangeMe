// =============================================================================
// Select Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

export class SelectFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: any,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    return {
      value: value ?? null,
    };
  }

  handleOperatorChange(): DataGridFilterValue {
    throw new Error('Select filter does not support operator changes');
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    const option = config.options?.find(opt => opt.value === filter.value);
    return `${column.header} = ${option?.label ?? filter.value}`;
  }

  hasActiveValue(filter: DataGridFilterValue): boolean {
    return filter.value != null;
  }

  needsSecondValue(): boolean {
    return false;
  }
}


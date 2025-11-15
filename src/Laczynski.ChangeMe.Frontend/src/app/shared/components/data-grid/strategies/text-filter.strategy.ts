// =============================================================================
// Text Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
  TextFilterOperator,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

export class TextFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: string,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    const operator =
      currentFilter?.operator ?? (config.defaultOperator as TextFilterOperator) ?? 'contains';

    return {
      ...currentFilter,
      operator: operator as TextFilterOperator,
      value: value,
    };
  }

  handleOperatorChange(
    operator: TextFilterOperator,
    currentFilter: DataGridFilterValue | null,
  ): DataGridFilterValue {
    return {
      ...currentFilter,
      operator: operator,
    };
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    const operatorText = this.getOperatorText(filter.operator as TextFilterOperator);
    return `${column.header} ${operatorText} "${filter.value}"`;
  }

  hasActiveValue(filter: DataGridFilterValue): boolean {
    return filter.value != null && filter.value !== '';
  }

  needsSecondValue(): boolean {
    return false; // Text filters don't support 'between'
  }

  private getOperatorText(operator?: TextFilterOperator): string {
    if (!operator) return 'contains';

    const operatorMap: Record<TextFilterOperator, string> = {
      contains: 'contains',
      equals: '=',
      startsWith: 'starts with',
      endsWith: 'ends with',
    };

    return operatorMap[operator] ?? operator;
  }
}


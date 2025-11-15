// =============================================================================
// Date Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
  DateFilterOperator,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';
import { DateRange } from '../../field/date-range/date-range.component';

export class DateFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: string,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    const operator =
      currentFilter?.operator ??
      (config.defaultOperator as DateFilterOperator) ??
      'equals';

    return {
      ...currentFilter,
      operator: operator as DateFilterOperator,
      value: value ?? null,
    };
  }

  handleOperatorChange(
    operator: DateFilterOperator,
    currentFilter: DataGridFilterValue | null,
  ): DataGridFilterValue {
    return {
      ...currentFilter,
      operator: operator,
    };
  }

  handleValueToChange(
    value: string,
    currentFilter: DataGridFilterValue | null,
  ): DataGridFilterValue {
    return {
      ...currentFilter,
      valueTo: value ?? null,
    };
  }

  handleDateRangeChange(
    range: DateRange | null,
    currentFilter: DataGridFilterValue | null,
  ): DataGridFilterValue {
    return {
      ...currentFilter,
      value: range?.startDate ?? null,
      valueTo: range?.endDate ?? null,
    };
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    const operator = filter.operator as DateFilterOperator;
    const operatorText = this.getOperatorText(operator);

    if (operator === 'between') {
      return `${column.header} between ${filter.value} and ${filter.valueTo}`;
    }

    return `${column.header} ${operatorText} ${filter.value}`;
  }

  hasActiveValue(filter: DataGridFilterValue): boolean {
    return (
      (filter.value != null && filter.value !== '') ||
      (filter.valueTo != null && filter.valueTo !== '')
    );
  }

  needsSecondValue(
    filter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): boolean {
    if (filter?.operator === 'between') {
      return true;
    }

    if (!filter && config.defaultOperator === 'between') {
      return true;
    }

    return false;
  }

  private getOperatorText(operator?: DateFilterOperator): string {
    if (!operator) return '=';

    const operatorMap: Record<DateFilterOperator, string> = {
      equals: '=',
      before: 'before',
      after: 'after',
      between: 'between',
    };

    return operatorMap[operator] ?? operator;
  }
}


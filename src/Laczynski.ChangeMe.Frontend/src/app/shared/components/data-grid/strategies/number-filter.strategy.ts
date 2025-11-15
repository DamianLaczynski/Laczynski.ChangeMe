// =============================================================================
// Number Filter Strategy
// =============================================================================

import { FilterStrategy } from './filter-strategy.interface';
import {
  DataGridFilterValue,
  DataGridFilterConfig,
  NumberFilterOperator,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

export class NumberFilterStrategy<T = any> implements FilterStrategy<T> {
  handleChange(
    value: string,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue {
    const operator =
      currentFilter?.operator ??
      (config.defaultOperator as NumberFilterOperator) ??
      'equals';

    return {
      ...currentFilter,
      operator: operator as NumberFilterOperator,
      value: value ? parseFloat(value) : null,
    };
  }

  handleOperatorChange(
    operator: NumberFilterOperator,
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
      valueTo: value ? parseFloat(value) : null,
    };
  }

  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string {
    const operator = filter.operator as NumberFilterOperator;
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

  private getOperatorText(operator?: NumberFilterOperator): string {
    if (!operator) return '=';

    const operatorMap: Record<NumberFilterOperator, string> = {
      equals: '=',
      notEquals: '!=',
      greaterThan: '>',
      lessThan: '<',
      greaterOrEqual: '>=',
      lessOrEqual: '<=',
      between: 'between',
    };

    return operatorMap[operator] ?? operator;
  }
}


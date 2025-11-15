// =============================================================================
// Filter Strategy Interface
// =============================================================================

import { DataGridFilterValue, DataGridFilterConfig } from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';

/**
 * Strategy interface for handling different filter types
 */
export interface FilterStrategy<T = any> {
  /**
   * Handle filter value change
   */
  handleChange(
    value: any,
    currentFilter: DataGridFilterValue | null,
    config: DataGridFilterConfig,
  ): DataGridFilterValue;

  /**
   * Handle operator change
   */
  handleOperatorChange(
    operator: any,
    currentFilter: DataGridFilterValue | null,
  ): DataGridFilterValue;

  /**
   * Handle secondary value change (for 'between' operator)
   */
  handleValueToChange?(value: any, currentFilter: DataGridFilterValue | null): DataGridFilterValue;

  /**
   * Get display text for the filter
   */
  getDisplayText(
    column: DataGridColumn<T>,
    filter: DataGridFilterValue,
    config: DataGridFilterConfig,
  ): string;

  /**
   * Check if filter has active value
   */
  hasActiveValue(filter: DataGridFilterValue): boolean;

  /**
   * Check if filter needs second value input
   */
  needsSecondValue(filter: DataGridFilterValue | null, config: DataGridFilterConfig): boolean;
}

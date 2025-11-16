// =============================================================================
// DataGrid Filter Service
// =============================================================================

import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import {
  DataGridFilterConfig,
  DataGridFilterValue,
  DataGridActiveFilter,
  DataGridFilterType,
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from '../models/data-grid-filter.model';
import { DataGridColumn } from '../models/data-grid-column.model';
import { FilterStrategyFactory } from '../strategies/filter-strategy.factory';
import { DateRange } from '../../field/date-range/date-range.component';

/**
 * Service for managing data grid filter logic
 * Uses Strategy Pattern for different filter types
 */
@Injectable()
export class DataGridFilterService<T = any> {
  private strategyFactory = inject(FilterStrategyFactory);
  private destroyRef = inject(DestroyRef);

  // Filter state
  activeFilters = signal<Map<string, DataGridFilterValue>>(new Map());
  filterDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Cache for date range values to prevent creating new objects unnecessarily
  private dateRangeCache = new Map<string, DateRange | null>();

  /**
   * Maximum number of date range cache entries
   * Prevents memory leaks in long-running applications
   */
  private readonly MAX_DATE_RANGE_CACHE_SIZE = 50;

  constructor() {
    // Cleanup timers on service destruction
    this.destroyRef.onDestroy(() => {
      this.filterDebounceTimers.forEach(timer => clearTimeout(timer));
      this.filterDebounceTimers.clear();
      // Also clear date range cache on destruction
      this.dateRangeCache.clear();
    });
  }

  /**
   * Check if column is filterable
   */
  isColumnFilterable(column: DataGridColumn<T>): boolean {
    return (
      column.filterable === true ||
      (typeof column.filterable === 'object' && column.filterable !== null)
    );
  }

  /**
   * Get filter configuration for a column
   */
  getFilterConfig(column: DataGridColumn<T>): DataGridFilterConfig | null {
    if (column.filterable === true) {
      // Default text filter
      return {
        type: 'text',
        placeholder: `Filter ${column.header}...`,
        debounceMs: 300,
      };
    }
    if (typeof column.filterable === 'object' && column.filterable !== null) {
      return column.filterable;
    }
    return null;
  }

  /**
   * Get filter value for a column
   */
  getFilterValue(columnId: string): DataGridFilterValue | null {
    return this.activeFilters().get(columnId) ?? null;
  }

  /**
   * Check if column has active filter
   */
  hasActiveFilter(columnId: string): boolean {
    const filter = this.activeFilters().get(columnId);
    if (!filter) return false;

    const config = this.getFilterConfigForColumn(columnId);
    if (!config) return false;

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    return strategy.hasActiveValue(filter);
  }

  /**
   * Get filter placeholder text
   */
  getFilterPlaceholder(column: DataGridColumn<T>): string {
    const config = this.getFilterConfig(column);
    return config?.placeholder ?? `Filter ${column.header}...`;
  }

  /**
   * Handle filter value change using strategy
   */
  handleFilterChange(
    column: DataGridColumn<T>,
    value: any,
    debounceCallback?: (filter: DataGridFilterValue) => void,
  ): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    const currentFilter = this.activeFilters().get(columnId) ?? null;

    // Handle debouncing for text filters
    if (config.type === 'text' && config.debounceMs && config.debounceMs > 0) {
      this.debounceFilterChange(columnId, config.debounceMs, () => {
        const newFilter = strategy.handleChange(value, currentFilter, config);
        if (debounceCallback) {
          debounceCallback(newFilter);
        } else {
          this.updateFilter(columnId, column, newFilter);
        }
      });
    } else {
      const newFilter = strategy.handleChange(value, currentFilter, config);
      if (debounceCallback) {
        debounceCallback(newFilter);
      } else {
        this.updateFilter(columnId, column, newFilter);
      }
    }
  }

  /**
   * Handle filter operator change using strategy
   */
  handleFilterOperatorChange(
    column: DataGridColumn<T>,
    operator: TextFilterOperator | NumberFilterOperator | DateFilterOperator,
  ): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    const currentFilter = this.activeFilters().get(columnId) ?? null;

    const newFilter = strategy.handleOperatorChange(operator, currentFilter);
    this.updateFilter(columnId, column, newFilter);
  }

  /**
   * Handle secondary value change (for 'between' operator)
   */
  handleFilterValueToChange(column: DataGridColumn<T>, value: any): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config) return;

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    const currentFilter = this.activeFilters().get(columnId) ?? null;

    if (strategy.handleValueToChange) {
      const newFilter = strategy.handleValueToChange(value, currentFilter);
      this.updateFilter(columnId, column, newFilter);
    }
  }

  /**
   * Handle date range change (special case for date filters)
   */
  handleDateRangeChange(column: DataGridColumn<T>, range: DateRange | null): void {
    const columnId = column.id;
    const config = this.getFilterConfig(column);
    if (!config || config.type !== 'date') return;

    const strategy = this.strategyFactory.getStrategy<T>(config.type) as any;
    const currentFilter = this.activeFilters().get(columnId) ?? null;

    // Check if values actually changed to prevent infinite loops
    const currentStartDate = currentFilter?.value ?? null;
    const currentEndDate = currentFilter?.valueTo ?? null;
    const newStartDate = range?.startDate ?? null;
    const newEndDate = range?.endDate ?? null;

    if (currentStartDate === newStartDate && currentEndDate === newEndDate) {
      return;
    }

    if (strategy.handleDateRangeChange) {
      const newFilter = strategy.handleDateRangeChange(range, currentFilter);
      this.updateFilter(columnId, column, newFilter);
    }
  }

  /**
   * Check if filter needs operator selector
   */
  needsOperatorSelector(column: DataGridColumn<T>): boolean {
    const config = this.getFilterConfig(column);
    if (!config) return false;

    if (config.showOperator !== undefined) {
      return config.showOperator;
    }

    // Default: show for number, date, and text (if operators are defined)
    if (config.type === 'number' || config.type === 'date') {
      return true;
    }

    if (config.type === 'text') {
      return (config.operators?.length ?? 0) > 0;
    }

    return false;
  }

  /**
   * Check if filter needs second value input
   */
  needsSecondValue(column: DataGridColumn<T>): boolean {
    const columnId = column.id;
    const filter = this.getFilterValue(columnId);
    const config = this.getFilterConfig(column);
    if (!config) return false;

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    return strategy.needsSecondValue(filter, config);
  }

  /**
   * Get display text for active filter
   */
  getFilterDisplayText(column: DataGridColumn<T>, filter: DataGridFilterValue): string {
    const config = this.getFilterConfig(column);
    if (!config) return '';

    const strategy = this.strategyFactory.getStrategy<T>(config.type);
    return strategy.getDisplayText(column, filter, config);
  }

  /**
   * Clear filter for a column
   */
  clearFilter(column: DataGridColumn<T>): void {
    const columnId = column.id;

    // Clear debounce timer if exists
    const timer = this.filterDebounceTimers.get(columnId);
    if (timer) {
      clearTimeout(timer);
      this.filterDebounceTimers.delete(columnId);
    }

    const filters = new Map(this.activeFilters());
    filters.delete(columnId);
    this.activeFilters.set(filters);
  }

  /**
   * Get computed date range values (for 'between' operator)
   */
  getDateRangeValues(columns: DataGridColumn<T>[]): Map<string, DateRange | null> {
    const ranges = new Map<string, DateRange | null>();
    const filters = this.activeFilters();

    columns.forEach(column => {
      if (this.isColumnFilterable(column)) {
        const filter = filters.get(column.id);
        const config = this.getFilterConfig(column);
        if (config?.type === 'date' && filter?.operator === 'between') {
          const startDate = filter.value ?? null;
          const endDate = filter.valueTo ?? null;

          // Check cache first to avoid creating new objects
          const cached = this.dateRangeCache.get(column.id);
          if (cached != null && cached.startDate === startDate && cached.endDate === endDate) {
            ranges.set(column.id, cached);
          } else {
            // Create new object only if values changed
            const newRange: DateRange | null =
              (startDate ?? endDate)
                ? {
                    startDate: startDate,
                    endDate: endDate,
                  }
                : null;
            ranges.set(column.id, newRange);

            // Enforce cache size limit - remove oldest entries if limit exceeded
            if (this.dateRangeCache.size >= this.MAX_DATE_RANGE_CACHE_SIZE) {
              // Remove the first (oldest) entry
              const firstKey = this.dateRangeCache.keys().next().value;
              if (firstKey) {
                this.dateRangeCache.delete(firstKey);
              }
            }

            this.dateRangeCache.set(column.id, newRange);
          }
        } else {
          ranges.set(column.id, null);
          this.dateRangeCache.delete(column.id);
        }
      }
    });

    return ranges;
  }

  /**
   * Get active filters as array
   */
  getActiveFiltersArray(columns: DataGridColumn<T>[]): DataGridActiveFilter[] {
    const activeFiltersArray: DataGridActiveFilter[] = [];

    this.activeFilters().forEach((filter, columnId) => {
      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      const config = this.getFilterConfig(column);
      if (!config) return;

      activeFiltersArray.push({
        columnId,
        field: column.field?.toString(), // Add field for proper data access
        type: config.type,
        filter,
        displayText: this.getFilterDisplayText(column, filter),
      });
    });

    return activeFiltersArray;
  }

  /**
   * Update filter for a column
   */
  updateFilter(columnId: string, column: DataGridColumn<T>, filter: DataGridFilterValue): void {
    const filters = new Map(this.activeFilters());

    // Check if filter is empty (no values)
    const isEmpty = !filter.value && !filter.valueTo && !filter.values?.length;

    // Remove filter if empty AND has no operator
    // Keep filter if it has operator (even without values yet) - user might be selecting values
    if (isEmpty && !filter.operator) {
      filters.delete(columnId);
    } else {
      // Keep filter if it has operator or values
      filters.set(columnId, filter);
    }

    this.activeFilters.set(filters);
  }

  /**
   * Private helper methods
   */
  private getFilterConfigForColumn(columnId: string): DataGridFilterConfig | null {
    // This is a helper - in real usage, we need columns array
    // For now, return null - this should be called with column object
    return null;
  }

  private debounceFilterChange(columnId: string, debounceMs: number, callback: () => void): void {
    // Clear existing timer
    const existingTimer = this.filterDebounceTimers.get(columnId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      callback();
      this.filterDebounceTimers.delete(columnId);
    }, debounceMs);

    this.filterDebounceTimers.set(columnId, timer);
  }
}

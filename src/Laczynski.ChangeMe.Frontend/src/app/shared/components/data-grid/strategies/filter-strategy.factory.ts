// =============================================================================
// Filter Strategy Factory
// =============================================================================

import { Injectable } from '@angular/core';
import { FilterStrategy } from './filter-strategy.interface';
import { DataGridFilterType } from '../models/data-grid-filter.model';
import { TextFilterStrategy } from './text-filter.strategy';
import { NumberFilterStrategy } from './number-filter.strategy';
import { DateFilterStrategy } from './date-filter.strategy';
import { SelectFilterStrategy } from './select-filter.strategy';
import { MultiSelectFilterStrategy } from './multi-select-filter.strategy';
import { BooleanFilterStrategy } from './boolean-filter.strategy';

/**
 * Factory for creating filter strategies based on filter type
 * Implements Factory Pattern
 */
@Injectable({
  providedIn: 'root',
})
export class FilterStrategyFactory {
  private strategyCache = new Map<DataGridFilterType, FilterStrategy>();

  /**
   * Maximum number of cached strategies
   * Prevents memory leaks in long-running applications
   * Note: There are only 6 filter types, so this limit is mainly for safety
   */
  private readonly MAX_CACHE_SIZE = 10;

  /**
   * Get or create strategy for the given filter type
   */
  getStrategy<T = any>(filterType: DataGridFilterType): FilterStrategy<T> {
    // Check cache first
    const cached = this.strategyCache.get(filterType);
    if (cached) {
      return cached as FilterStrategy<T>;
    }

    // Enforce cache size limit - remove oldest entries if limit exceeded
    if (this.strategyCache.size >= this.MAX_CACHE_SIZE) {
      // Remove the first (oldest) entry
      const firstKey = this.strategyCache.keys().next().value;
      if (firstKey) {
        this.strategyCache.delete(firstKey);
      }
    }

    // Create new strategy based on type
    let strategy: FilterStrategy<T>;

    switch (filterType) {
      case 'text':
        strategy = new TextFilterStrategy<T>();
        break;
      case 'number':
        strategy = new NumberFilterStrategy<T>();
        break;
      case 'date':
        strategy = new DateFilterStrategy<T>();
        break;
      case 'select':
        strategy = new SelectFilterStrategy<T>();
        break;
      case 'multi-select':
        strategy = new MultiSelectFilterStrategy<T>();
        break;
      case 'boolean':
        strategy = new BooleanFilterStrategy<T>();
        break;
      default:
        throw new Error(`Unknown filter type: ${filterType}`);
    }

    // Cache the strategy
    this.strategyCache.set(filterType, strategy);

    return strategy;
  }

  /**
   * Clear strategy cache (useful for testing)
   */
  clearCache(): void {
    this.strategyCache.clear();
  }
}

// =============================================================================
// DataGrid Sort Service
// =============================================================================

import { Injectable, signal } from '@angular/core';
import { DataGridColumn } from '../models/data-grid-column.model';

export interface SortState {
  field: string | null;
  direction: 'asc' | 'desc';
}

/**
 * Service for managing data grid sorting logic
 */
@Injectable()
export class DataGridSortService<T = any> {
  // Sort state
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  /**
   * Get current sort state
   */
  getSortState(): SortState {
    return {
      field: this.sortField(),
      direction: this.sortDirection(),
    };
  }

  /**
   * Handle header click for sorting
   */
  handleHeaderClick(column: DataGridColumn<T>): SortState | null {
    if (!column.sortable || !column.field) {
      return null;
    }

    const field = column.field.toString();
    const isCurrentField = this.sortField() === field;

    if (isCurrentField) {
      // Toggle sort direction if same field
      const newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortDirection.set(newDirection);
    } else {
      // Set new field and default to ascending
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    return this.getSortState();
  }

  /**
   * Check if column is sorted
   */
  isColumnSorted(column: DataGridColumn<T>): boolean {
    if (!column.sortable || !column.field) {
      return false;
    }
    return this.sortField() === column.field.toString();
  }

  /**
   * Get sort icon for column
   */
  getSortIcon(column: DataGridColumn<T>): 'arrow_sort' | 'arrow_up' | 'arrow_down' | null {
    if (!column.sortable || !column.field) {
      return null;
    }

    const field = column.field.toString();
    if (this.sortField() !== field) {
      // Neutral/unsorted state
      return 'arrow_sort';
    }

    // Show direction-specific icon
    return this.sortDirection() === 'asc' ? 'arrow_up' : 'arrow_down';
  }

  /**
   * Reset sort state
   */
  reset(): void {
    this.sortField.set(null);
    this.sortDirection.set('asc');
  }

  /**
   * Set sort state
   */
  setSort(field: string, direction: 'asc' | 'desc'): void {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }
}


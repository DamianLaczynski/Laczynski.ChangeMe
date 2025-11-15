// =============================================================================
// DataGrid Selection Service
// =============================================================================

import { Injectable, signal, computed } from '@angular/core';
import { DataGridRow } from '../models/data-grid-column.model';

/**
 * Service for managing data grid row selection logic
 */
@Injectable()
export class DataGridSelectionService<T = any> {
  // Selection state
  selectedRows = signal<Set<string>>(new Set());

  /**
   * Check if all rows are selected
   */
  allRowsSelected(rows: DataGridRow<T>[]): boolean {
    if (rows.length === 0) return false;
    const selectableRows = rows.filter(row => !row.disabled);
    return selectableRows.every(row => this.selectedRows().has(row.id));
  }

  /**
   * Check if some (but not all) rows are selected
   */
  someRowsSelected(rows: DataGridRow<T>[]): boolean {
    return this.selectedRows().size > 0 && !this.allRowsSelected(rows);
  }

  /**
   * Toggle selection for all rows
   */
  toggleAllRows(rows: DataGridRow<T>[]): void {
    if (this.allRowsSelected(rows)) {
      this.selectedRows.set(new Set());
    } else {
      const selectableRowIds = rows.filter(row => !row.disabled).map(row => row.id);
      this.selectedRows.set(new Set(selectableRowIds));
    }
  }

  /**
   * Toggle selection for a single row
   */
  toggleRow(row: DataGridRow<T>, multiSelect: boolean): void {
    if (row.disabled) return;

    const selected = new Set(this.selectedRows());

    if (selected.has(row.id)) {
      selected.delete(row.id);
    } else {
      if (!multiSelect) {
        selected.clear();
      }
      selected.add(row.id);
    }

    this.selectedRows.set(selected);
  }

  /**
   * Check if row is selected
   */
  isRowSelected(row: DataGridRow<T>): boolean {
    return this.selectedRows().has(row.id);
  }

  /**
   * Get selected rows
   */
  getSelectedRows(rows: DataGridRow<T>[]): DataGridRow<T>[] {
    return rows.filter(row => this.selectedRows().has(row.id));
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this.selectedRows.set(new Set());
  }

  /**
   * Set selected rows
   */
  setSelectedRows(rowIds: string[]): void {
    this.selectedRows.set(new Set(rowIds));
  }
}

/**
 * Adapter Pattern for DataGrid
 *
 * Provides a way to transform data from different formats into DataGridRow format.
 * Useful when integrating with APIs that return data in different structures.
 *
 * @template T - The target type (what DataGrid expects)
 * @template R - The raw type (what the source provides)
 */

import { DataGridRow } from '../models/data-grid-column.model';

/**
 * Interface for adapting raw data to DataGridRow format
 *
 * @template T - The target type
 * @template R - The raw type
 */
export interface DataGridAdapter<T, R = any> {
  /**
   * Adapts a single raw item to DataGridRow format
   *
   * @param raw - Raw data item
   * @returns DataGridRow with adapted data
   */
  adapt(raw: R): DataGridRow<T>;

  /**
   * Adapts multiple raw items to DataGridRow format
   *
   * @param raw - Array of raw data items
   * @returns Array of DataGridRow with adapted data
   */
  adaptMany(raw: R[]): DataGridRow<T>[];
}


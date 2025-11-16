/**
 * Default Data Grid Adapter
 *
 * Provides default implementation for adapting data with common id fields.
 */

import { DataGridAdapter } from './data-grid-adapter.interface';
import { DataGridRow } from '../models/data-grid-column.model';

/**
 * Default adapter for items with id field
 *
 * Handles common cases where data has an `id` or `_id` field.
 *
 * @template T - The type of data items (must have an id field)
 */
export class DefaultDataGridAdapter<T extends { id?: any; _id?: any }>
  implements DataGridAdapter<T, T>
{
  /**
   * @inheritdoc
   */
  adapt(raw: T): DataGridRow<T> {
    const id = raw.id ?? raw._id;
    if (id == null) {
      throw new Error('Data item must have an id or _id field');
    }

    return {
      id: id.toString(),
      data: raw,
      selected: false,
      disabled: (raw as any).disabled === true,
    };
  }

  /**
   * @inheritdoc
   */
  adaptMany(raw: T[]): DataGridRow<T>[] {
    return raw.map((item) => this.adapt(item));
  }
}


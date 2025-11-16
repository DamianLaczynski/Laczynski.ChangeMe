/**
 * DataGrid Column Factory
 *
 * Provides factory methods for creating common column types.
 * Reduces boilerplate and ensures consistency across columns.
 */

import { DataGridColumn } from '../models/data-grid-column.model';
import { DataGridFilterConfig } from '../models/data-grid-filter.model';
import {
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from '../models/data-grid-filter.model';

/**
 * Factory for creating DataGrid columns
 *
 * Provides convenient methods for creating columns with sensible defaults,
 * reducing boilerplate code significantly.
 */
export class DataGridColumnFactory {
  /**
   * Creates a text column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.text('name', 'Name', 'name');
   * ```
   */
  static text<T>(
    id: string,
    header: string,
    field: keyof T,
    options?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text',
      sortable: true,
      filterable: {
        type: 'text',
        placeholder: `Filter ${header}...`,
        debounceMs: 300,
      },
      ...options,
    };
  }

  /**
   * Creates a number column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.number('age', 'Age', 'age');
   * ```
   */
  static number<T>(
    id: string,
    header: string,
    field: keyof T,
    options?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text', // Display as text
      sortable: true,
      filterable: {
        type: 'number',
        placeholder: `Filter ${header}...`,
        operators: [
          'equals',
          'notEquals',
          'greaterThan',
          'lessThan',
          'greaterOrEqual',
          'lessOrEqual',
          'between',
        ] as NumberFilterOperator[],
        showOperator: true,
      },
      alignment: 'right',
      ...options,
    };
  }

  /**
   * Creates a date column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.date('createdAt', 'Created', 'createdAt');
   * ```
   */
  static date<T>(
    id: string,
    header: string,
    field: keyof T,
    options?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text',
      sortable: true,
      filterable: {
        type: 'date',
        placeholder: `Filter ${header}...`,
        operators: ['equals', 'before', 'after', 'between'] as DateFilterOperator[],
        showOperator: true,
      },
      ...options,
    };
  }

  /**
   * Creates a select (dropdown) filter column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Filter options for the dropdown
   * @param columnOptions - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.select(
   *   'status',
   *   'Status',
   *   'status',
   *   [
   *     { label: 'Active', value: 'active' },
   *     { label: 'Inactive', value: 'inactive' }
   *   ]
   * );
   * ```
   */
  static select<T>(
    id: string,
    header: string,
    field: keyof T,
    options: Array<{ label: string; value: any; disabled?: boolean }>,
    columnOptions?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text',
      sortable: true,
      filterable: {
        type: 'select',
        placeholder: `Select ${header}...`,
        options: options.map(opt => ({
          label: opt.label,
          value: opt.value,
          disabled: opt.disabled || false,
        })),
      },
      ...columnOptions,
    };
  }

  /**
   * Creates a multi-select filter column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Filter options for the multi-select
   * @param columnOptions - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.multiSelect(
   *   'tags',
   *   'Tags',
   *   'tags',
   *   [
   *     { label: 'Important', value: 'important' },
   *     { label: 'Urgent', value: 'urgent' }
   *   ]
   * );
   * ```
   */
  static multiSelect<T>(
    id: string,
    header: string,
    field: keyof T,
    options: Array<{ label: string; value: any; disabled?: boolean }>,
    columnOptions?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text',
      sortable: true,
      filterable: {
        type: 'multi-select',
        placeholder: `Select ${header}...`,
        options: options.map(opt => ({
          label: opt.label,
          value: opt.value,
          disabled: opt.disabled || false,
        })),
      },
      ...columnOptions,
    };
  }

  /**
   * Creates a boolean column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param field - Field name in the data object
   * @param options - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.boolean('isActive', 'Active', 'isActive');
   * ```
   */
  static boolean<T>(
    id: string,
    header: string,
    field: keyof T,
    options?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      field,
      type: 'text',
      sortable: true,
      filterable: {
        type: 'boolean',
        placeholder: `Filter ${header}...`,
      },
      ...options,
    };
  }

  /**
   * Creates an actions column
   *
   * @template T - The type of data items
   * @param id - Unique column identifier
   * @param header - Column header text
   * @param actions - Array of actions to display
   * @param options - Additional column options
   * @returns Column definition
   *
   * @example
   * ```typescript
   * const column = DataGridColumnFactory.actions('actions', 'Actions', [
   *   { id: 'edit', icon: 'edit', label: 'Edit', action: () => {} },
   *   { id: 'delete', icon: 'delete', label: 'Delete', action: () => {} }
   * ]);
   * ```
   */
  static actions<T>(
    id: string,
    header: string,
    actions: Array<{
      id: string;
      icon: string;
      label?: string;
      disabled?: boolean;
      action: (row: T) => void;
    }>,
    options?: Partial<DataGridColumn<T>>,
  ): DataGridColumn<T> {
    return {
      id,
      header,
      type: 'actions',
      cellTemplate: (row: T) => ({
        actions: actions.map(action => ({
          id: action.id,
          icon: action.icon,
          label: action.label,
          disabled: action.disabled || false,
          action: () => action.action(row),
        })),
      }),
      sortable: false,
      filterable: false,
      width: '120px',
      ...options,
    };
  }

  /**
   * Creates a custom column
   *
   * Use this when you need full control over the column configuration.
   * All other factory methods are convenience wrappers around this.
   *
   * @template T - The type of data items
   * @param config - Complete column configuration
   * @returns Column definition
   */
  static custom<T>(config: DataGridColumn<T>): DataGridColumn<T> {
    return config;
  }
}

/**
 * Column definition for data grid
 */
export interface DataGridColumn<T> {
  /** Field name in data object */
  field: keyof T | '';

  /** Display header */
  header: string;

  /** Whether column is sortable */
  sortable?: boolean;

  /** Custom template reference name */
  templateRef?: string;

  /** Column width */
  width?: string;

  /** Whether to hide column on mobile */
  hideOnMobile?: boolean;

  /** Custom cell formatter function */
  formatter?: (value: any, row: T) => string;
}

import { DataGridFilterConfig } from './data-grid-filter.model';

export type DataGridColumnType = 
  | 'text' 
  | 'link' 
  | 'actions' 
  | 'icon' 
  | 'avatar' 
  | 'product-icon';

export type DataGridColumnStyle = 
  | 'primary' 
  | 'secondary' 
  | 'none';

export type DataGridHeaderStyle = 
  | 'regular'   // font-weight: 400
  | 'semibold'; // font-weight: 600

export type DataGridCellAlignment = 
  | 'left' 
  | 'center' 
  | 'right';

export interface DataGridColumn<T = any> {
  id: string;
  header: string;
  field?: keyof T;
  type?: DataGridColumnType;
  style?: DataGridColumnStyle;
  headerStyle?: DataGridHeaderStyle;
  width?: string;
  sortable?: boolean;
  resizable?: boolean;
  filterable?: boolean | DataGridFilterConfig;
  alignment?: DataGridCellAlignment;
  cellTemplate?: (row: T) => string | DataGridCellContent;
  headerTemplate?: () => string;
}

export interface DataGridCellContent {
  text?: string;
  icon?: string;
  iconColor?: string;
  link?: {
    text: string;
    url: string;
    visited?: boolean;
  };
  avatar?: {
    name: string;
    imageUrl?: string;
  };
  productIcon?: {
    type: 'folder' | 'file' | 'document';
    color?: string;
  };
  actions?: DataGridAction[];
}

export interface DataGridAction {
  id: string;
  icon: string;
  label?: string;
  disabled?: boolean;
  action: () => void;
}

export interface DataGridRow<T = any> {
  id: string;
  data: T;
  selected?: boolean;
  disabled?: boolean;
  expanded?: boolean;
}

export interface DataGridConfig<T = any> {
  columns: DataGridColumn<T>[];
  rows: DataGridRow<T>[];
  selectable?: boolean;
  multiSelect?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  emptyMessage?: string;
  filterable?: boolean; // Global filter enable
}


import { Size, TreeNode } from '../../utils';

// Nav Component Types
export type NavState = 'collapsed' | 'expanded';
export type NavWidth = 'compact' | 'standard' | 'wide';
export type NavNodeState = 'rest' | 'hover' | 'pressed' | 'selected' | 'disabled';

export interface NavConfig {
  width?: number;
  collapsible?: boolean;
  defaultState?: NavState;
}

export interface NavNodeConfig extends Omit<TreeNode<any>, 'id'> {
  id?: string | number;
  size?: Size;
  open?: boolean;
}

export interface NavSubItemConfig extends Omit<TreeNode<any>, 'id'> {
  id?: string | number;
  // Nav sub items extend TreeNode
}

export interface NavAppItemConfig {
  name: string;
  icon?: string;
  onClick?: () => void;
}

export interface NavSectionHeaderConfig {
  label: string;
}

import { IconName } from '@shared/components/icon';

export type MenuItemType = 'item' | 'split' | 'header' | 'divider';
export type MenuItemState = 'rest' | 'hover' | 'pressed' | 'selected' | 'disabled';

export interface MenuItem {
  id: string;
  type?: MenuItemType;
  label: string;
  icon?: IconName;
  iconTheme?: 'regular' | 'filled';
  shortcut?: string;
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: MenuItem[]; // Nested submenu items
  action?: () => void;
  submenuAction?: () => void;
}

export interface MenuSection {
  header?: string;
  items: MenuItem[];
  divider?: boolean;
}

export interface MenuConfig {
  sections?: MenuSection[];
  items?: MenuItem[];
  width?: string;
  maxHeight?: string;
}

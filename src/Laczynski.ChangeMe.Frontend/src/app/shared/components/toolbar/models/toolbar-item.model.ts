import { IconName } from '@shared/components/icon';

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: IconName;
  iconTheme?: 'regular' | 'filled';
  disabled?: boolean;
  selected?: boolean;
  type?: 'button' | 'divider' | 'toggle' | 'custom';
  action?: () => void;
  tooltip?: string;
  ariaLabel?: string;
}

export interface ToolbarGroup {
  id: string;
  items: ToolbarItem[];
}

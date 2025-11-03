export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  iconTheme?: 'regular' | 'filled';
  shortcut?: string; // Keyboard shortcut like "Ctrl+K"
  keywords?: string[]; // Additional keywords for search
  disabled?: boolean;
  section?: string; // Section name to group commands
  action?: () => void;
}

export interface CommandSection {
  header: string;
  items: CommandItem[];
}

import { Component, input, output, model, signal, computed, effect, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandItem, CommandSection } from './models/command-item.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class CommandPaletteComponent implements AfterViewInit {
  // Inputs
  commands = input<CommandItem[]>([]);
  sections = input<CommandSection[]>([]);
  placeholder = input<string>('Type a command or search...');
  visible = model<boolean>(false);

  // Outputs
  commandSelected = output<CommandItem>();
  close = output<void>();

  // Internal state
  searchQuery = signal<string>('');
  selectedIndex = signal<number>(0);
  filteredCommands = signal<CommandItem[]>([]);
  groupedCommands = signal<CommandSection[]>([]);

  @ViewChild('searchInput', { static: false }) searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('commandList', { static: false }) commandList?: ElementRef<HTMLDivElement>;

  constructor() {
    // Combine commands and sections into grouped structure
    effect(() => {
      const allCommands = this.getFlatCommands();
      const filtered = this.filterCommands(allCommands, this.searchQuery());
      this.filteredCommands.set(filtered);
      this.groupedCommands.set(this.groupCommands(filtered));
    });
  }

  ngAfterViewInit(): void {
    // Focus search input when visible
    effect(() => {
      if (this.visible() && this.searchInput) {
        setTimeout(() => {
          this.searchInput?.nativeElement.focus();
        }, 100);
      }
    });
  }

  getFlatCommands(): CommandItem[] {
    const sections = this.sections();
    if (sections.length > 0) {
      return sections.flatMap(section => section.items);
    }
    return this.commands();
  }

  filterCommands(commands: CommandItem[], query: string): CommandItem[] {
    if (!query.trim()) {
      return commands;
    }

    const lowerQuery = query.toLowerCase().trim();
    return commands.filter(cmd => {
      // Check label
      if (cmd.label.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // Check description
      if (cmd.description?.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // Check keywords
      if (cmd.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery))) {
        return true;
      }
      return false;
    });
  }

  groupCommands(commands: CommandItem[]): CommandSection[] {
    const sections = this.sections();
    if (sections.length > 0) {
      // If sections are provided, group by section
      const grouped: CommandSection[] = [];
      sections.forEach(section => {
        const sectionCommands = commands.filter(cmd => {
          // Check if command belongs to this section
          return cmd.section === section.header || section.items.some(item => item.id === cmd.id);
        });
        if (sectionCommands.length > 0) {
          grouped.push({
            header: section.header,
            items: sectionCommands,
          });
        }
      });
      return grouped;
    }

    // Group by section property if no sections provided
    const sectionMap = new Map<string, CommandItem[]>();
    commands.forEach(cmd => {
      const sectionName = cmd.section || 'Commands';
      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(cmd);
    });

    return Array.from(sectionMap.entries()).map(([header, items]) => ({
      header,
      items,
    }));
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.selectedIndex.set(0); // Reset selection when searching
    this.scrollToSelected();
  }

  onCommandClick(command: CommandItem): void {
    if (!command.disabled) {
      this.executeCommand(command);
    }
  }

  executeCommand(command: CommandItem): void {
    if (command.action) {
      command.action();
    }
    this.commandSelected.emit(command);
    this.closePalette();
  }

  getSelectedCommand(): CommandItem | null {
    const flatCommands = this.getFlatCommandsForNavigation();
    return flatCommands[this.selectedIndex()] || null;
  }

  getFlatCommandsForNavigation(): CommandItem[] {
    return this.groupedCommands().flatMap(section => section.items.filter(cmd => !cmd.disabled));
  }

  scrollToSelected(): void {
    setTimeout(() => {
      const selectedElement = document.querySelector('.command-palette__item--selected');
      if (selectedElement && this.commandList) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 0);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.visible()) {
      return;
    }

    // Close on Escape
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePalette();
      return;
    }

    // Handle navigation only if no input is focused (or if command list should handle it)
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' && activeElement !== this.searchInput?.nativeElement) {
      return;
    }

    const flatCommands = this.getFlatCommandsForNavigation();
    if (flatCommands.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.set((this.selectedIndex() + 1) % flatCommands.length);
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.set(
          this.selectedIndex() === 0 ? flatCommands.length - 1 : this.selectedIndex() - 1
        );
        this.scrollToSelected();
        break;

      case 'Enter':
        event.preventDefault();
        const selected = this.getSelectedCommand();
        if (selected) {
          this.executeCommand(selected);
        }
        break;
    }
  }

  closePalette(): void {
    this.visible.set(false);
    this.searchQuery.set('');
    this.selectedIndex.set(0);
    this.close.emit();
  }

  getCommandItemClasses(command: CommandItem, index: number): string {
    const classes = ['command-palette__item'];
    const flatCommands = this.getFlatCommandsForNavigation();
    const flatIndex = flatCommands.findIndex(cmd => cmd.id === command.id);

    if (flatIndex >= 0 && flatIndex === this.selectedIndex()) {
      classes.push('command-palette__item--selected');
    }

    if (command.disabled) {
      classes.push('command-palette__item--disabled');
    }

    return classes.join(' ');
  }

  getCommandIndex(command: CommandItem): number {
    const flatCommands = this.getFlatCommandsForNavigation();
    return flatCommands.findIndex(cmd => cmd.id === command.id);
  }

  getSectionClasses(section: CommandSection, index: number): string {
    const classes = ['command-palette__section'];
    if (index > 0) {
      classes.push('command-palette__section--not-first');
    }
    return classes.join(' ');
  }

  shouldShowIcon(command: CommandItem): boolean {
    return !!command.icon;
  }

  getIconTheme(command: CommandItem): 'regular' | 'filled' {
    return command.iconTheme || 'regular';
  }

  getBackdropClasses(): string {
    const classes = ['command-palette__backdrop'];
    if (!this.visible()) {
      classes.push('command-palette__backdrop--hidden');
    }
    return classes.join(' ');
  }

  getContentClasses(): string {
    return 'command-palette__content';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closePalette();
    }
  }

  hasResults(): boolean {
    return this.groupedCommands().length > 0;
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery().trim()) {
      return `No commands found for "${this.searchQuery()}"`;
    }
    return 'No commands available';
  }
}


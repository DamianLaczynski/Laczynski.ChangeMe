import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandPaletteComponent } from './command-palette.component';
import { CommandItem, CommandSection } from './models/command-item.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-command-palette-showcase',
  imports: [CommonModule, CommandPaletteComponent, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Command Palette Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Command Palette component built with Fluent 2 Design System. The
        Command Palette provides a quick way to search and execute commands using keyboard navigation.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Example</h2>
        <p class="showcase__section__description">
          Simple command palette with a list of commands. Press Ctrl+K (or Cmd+K on Mac) or click the
          button to open it.
        </p>
        <div class="showcase__preview">
          <app-button (click)="openBasicPalette()">Open Command Palette</app-button>
        </div>
      </div>

      <!-- With Sections -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Sections</h2>
        <p class="showcase__section__description">
          Command palette organized into sections with headers for better organization.
        </p>
        <div class="showcase__preview">
          <app-button (click)="openSectionsPalette()">Open Command Palette (Sections)</app-button>
        </div>
      </div>

      <!-- With Icons and Shortcuts -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Icons and Shortcuts</h2>
        <p class="showcase__section__description">
          Commands with icons and keyboard shortcuts displayed.
        </p>
        <div class="showcase__preview">
          <app-button (click)="openIconsPalette()">Open Command Palette (Icons & Shortcuts)</app-button>
        </div>
      </div>

      <!-- With Descriptions -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Descriptions</h2>
        <p class="showcase__section__description">
          Commands with descriptive text to provide more context.
        </p>
        <div class="showcase__preview">
          <app-button (click)="openDescriptionsPalette()">Open Command Palette (Descriptions)</app-button>
        </div>
      </div>

      <!-- Keyboard Navigation -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Keyboard Navigation</h2>
        <p class="showcase__section__description">
          The Command Palette supports full keyboard navigation:
        </p>
        <ul class="showcase__list">
          <li><strong>Arrow Up/Down:</strong> Navigate through commands</li>
          <li><strong>Enter:</strong> Execute selected command</li>
          <li><strong>Escape:</strong> Close the palette</li>
          <li><strong>Type to search:</strong> Filter commands by typing</li>
        </ul>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Command Palette in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>

      <!-- Command Palette Components -->
      <app-command-palette
        [commands]="basicCommands()"
        [visible]="basicVisible()"
        (commandSelected)="onCommandSelected($event)"
        (close)="basicVisible.set(false)"
      />

      <app-command-palette
        [sections]="sectionsCommands()"
        [visible]="sectionsVisible()"
        (commandSelected)="onCommandSelected($event)"
        (close)="sectionsVisible.set(false)"
      />

      <app-command-palette
        [sections]="iconsCommands()"
        [visible]="iconsVisible()"
        (commandSelected)="onCommandSelected($event)"
        (close)="iconsVisible.set(false)"
      />

      <app-command-palette
        [sections]="descriptionsCommands()"
        [visible]="descriptionsVisible()"
        (commandSelected)="onCommandSelected($event)"
        (close)="descriptionsVisible.set(false)"
      />
    </div>
  `,
})
export class CommandPaletteShowcaseComponent {
  basicVisible = signal(false);
  sectionsVisible = signal(false);
  iconsVisible = signal(false);
  descriptionsVisible = signal(false);

  basicCommands = signal<CommandItem[]>([
    { id: 'new-file', label: 'New File', action: () => this.handleAction('New File') },
    { id: 'open-file', label: 'Open File', action: () => this.handleAction('Open File') },
    { id: 'save', label: 'Save', action: () => this.handleAction('Save') },
    { id: 'save-as', label: 'Save As...', action: () => this.handleAction('Save As') },
    { id: 'close', label: 'Close', action: () => this.handleAction('Close') },
  ]);

  sectionsCommands = signal<CommandSection[]>([
    {
      header: 'File',
      items: [
        { id: 'new-file', label: 'New File', section: 'File', action: () => this.handleAction('New File') },
        {
          id: 'open-file',
          label: 'Open File',
          section: 'File',
          action: () => this.handleAction('Open File'),
        },
        { id: 'save', label: 'Save', section: 'File', action: () => this.handleAction('Save') },
        {
          id: 'save-as',
          label: 'Save As...',
          section: 'File',
          action: () => this.handleAction('Save As'),
        },
      ],
    },
    {
      header: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', section: 'Edit', action: () => this.handleAction('Undo') },
        { id: 'redo', label: 'Redo', section: 'Edit', action: () => this.handleAction('Redo') },
        { id: 'cut', label: 'Cut', section: 'Edit', action: () => this.handleAction('Cut') },
        { id: 'copy', label: 'Copy', section: 'Edit', action: () => this.handleAction('Copy') },
        { id: 'paste', label: 'Paste', section: 'Edit', action: () => this.handleAction('Paste') },
      ],
    },
    {
      header: 'View',
      items: [
        { id: 'zoom-in', label: 'Zoom In', section: 'View', action: () => this.handleAction('Zoom In') },
        {
          id: 'zoom-out',
          label: 'Zoom Out',
          section: 'View',
          action: () => this.handleAction('Zoom Out'),
        },
        {
          id: 'reset-zoom',
          label: 'Reset Zoom',
          section: 'View',
          action: () => this.handleAction('Reset Zoom'),
        },
      ],
    },
  ]);

  iconsCommands = signal<CommandSection[]>([
    {
      header: 'Navigation',
      items: [
        {
          id: 'go-to-file',
          label: 'Go to File',
          icon: 'document',
          shortcut: 'Ctrl+P',
          section: 'Navigation',
          action: () => this.handleAction('Go to File'),
        },
        {
          id: 'go-to-line',
          label: 'Go to Line',
          icon: 'number_row',
          shortcut: 'Ctrl+G',
          section: 'Navigation',
          action: () => this.handleAction('Go to Line'),
        },
        {
          id: 'find',
          label: 'Find',
          icon: 'search',
          shortcut: 'Ctrl+F',
          section: 'Navigation',
          action: () => this.handleAction('Find'),
        },
        {
          id: 'find-replace',
          label: 'Find and Replace',
          icon: 'arrow_replace',
          shortcut: 'Ctrl+H',
          section: 'Navigation',
          action: () => this.handleAction('Find and Replace'),
        },
      ],
    },
    {
      header: 'Git',
      items: [
        {
          id: 'git-status',
          label: 'Git: Status',
          icon: 'branch',
          shortcut: 'Ctrl+Shift+G',
          section: 'Git',
          action: () => this.handleAction('Git Status'),
        },
        {
          id: 'git-commit',
          label: 'Git: Commit',
          icon: 'checkmark',
          shortcut: 'Ctrl+Shift+C',
          section: 'Git',
          action: () => this.handleAction('Git Commit'),
        },
        {
          id: 'git-push',
          label: 'Git: Push',
          icon: 'arrow_up',
          shortcut: 'Ctrl+Shift+P',
          section: 'Git',
          action: () => this.handleAction('Git Push'),
        },
      ],
    },
    {
      header: 'Terminal',
      items: [
        {
          id: 'new-terminal',
          label: 'New Terminal',
          icon: 'terminal',
          shortcut: 'Ctrl+`',
          section: 'Terminal',
          action: () => this.handleAction('New Terminal'),
        },
        {
          id: 'split-terminal',
          label: 'Split Terminal',
          icon: 'split_vertical',
          shortcut: 'Ctrl+Shift+`',
          section: 'Terminal',
          action: () => this.handleAction('Split Terminal'),
        },
      ],
    },
  ]);

  descriptionsCommands = signal<CommandSection[]>([
    {
      header: 'File Operations',
      items: [
        {
          id: 'new-file',
          label: 'New File',
          description: 'Create a new file in the current workspace',
          icon: 'document_add',
          shortcut: 'Ctrl+N',
          section: 'File Operations',
          action: () => this.handleAction('New File'),
        },
        {
          id: 'open-file',
          label: 'Open File',
          description: 'Open an existing file from your computer',
          icon: 'folder_open',
          shortcut: 'Ctrl+O',
          section: 'File Operations',
          action: () => this.handleAction('Open File'),
        },
        {
          id: 'save',
          label: 'Save',
          description: 'Save the current file',
          icon: 'save',
          shortcut: 'Ctrl+S',
          section: 'File Operations',
          action: () => this.handleAction('Save'),
        },
      ],
    },
    {
      header: 'Editor',
      items: [
        {
          id: 'format-document',
          label: 'Format Document',
          description: 'Format the entire document using the default formatter',
          icon: 'text_align_left',
          shortcut: 'Shift+Alt+F',
          section: 'Editor',
          action: () => this.handleAction('Format Document'),
        },
        {
          id: 'rename-symbol',
          label: 'Rename Symbol',
          description: 'Rename the symbol under the cursor',
          icon: 'text_edit',
          shortcut: 'F2',
          section: 'Editor',
          action: () => this.handleAction('Rename Symbol'),
        },
        {
          id: 'quick-fix',
          label: 'Quick Fix',
          description: 'Show quick fixes and refactorings',
          icon: 'lightbulb',
          shortcut: 'Ctrl+.',
          section: 'Editor',
          action: () => this.handleAction('Quick Fix'),
        },
      ],
    },
  ]);

  usageExample = `// In your component
import { CommandPaletteComponent } from '@shared/components/command-palette';
import { CommandItem } from '@shared/components/command-palette/models/command-item.model';

@Component({
  template: \`
    <app-command-palette
      [commands]="commands()"
      [visible]="paletteVisible()"
      (commandSelected)="onCommandSelected($event)"
      (close)="paletteVisible.set(false)"
    />
  \`
})
export class MyComponent {
  paletteVisible = signal(false);
  commands = signal<CommandItem[]>([
    { 
      id: 'action1', 
      label: 'Action 1', 
      action: () => console.log('Action 1') 
    }
  ]);
  
  onCommandSelected(command: CommandItem) {
    console.log('Selected:', command.label);
  }
}`;

  openBasicPalette(): void {
    this.basicVisible.set(true);
  }

  openSectionsPalette(): void {
    this.sectionsVisible.set(true);
  }

  openIconsPalette(): void {
    this.iconsVisible.set(true);
  }

  openDescriptionsPalette(): void {
    this.descriptionsVisible.set(true);
  }

  onCommandSelected(command: CommandItem): void {
    console.log('Command selected:', command.label);
    // Close all palettes
    this.basicVisible.set(false);
    this.sectionsVisible.set(false);
    this.iconsVisible.set(false);
    this.descriptionsVisible.set(false);
  }

  handleAction(actionName: string): void {
    alert(`Action executed: ${actionName}`);
  }
}


import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarItem, ToolbarGroup } from './models/toolbar-item.model';
import { DropdownComponent, DropdownItem } from '../field/dropdown/dropdown.component';
import { TextComponent } from '../field/text/text.component';
import { DividerComponent } from '../divider/divider.component';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-toolbar-showcase',
  imports: [CommonModule, ToolbarComponent, DropdownComponent, TextComponent, DividerComponent, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Toolbar Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Toolbar component built with Fluent 2 Design System. The
        Toolbar provides a horizontal or vertical container for buttons and controls with grouping
        support.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Toolbar</h2>
        <p class="showcase__section__description">
          Simple toolbar with icon-only buttons for common actions.
        </p>
        <div class="showcase__preview">
          <app-toolbar [items]="basicItems()" (itemClick)="onItemClick($event)" />
        </div>
      </div>

      <!-- With Labels -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar with Labels</h2>
        <p class="showcase__section__description">
          Toolbar with buttons that include both icons and labels for better clarity.
        </p>
        <div class="showcase__preview">
          <app-toolbar [items]="labeledItems()" (itemClick)="onItemClick($event)" />
        </div>
      </div>

      <!-- With Groups and Dividers -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Grouped Toolbar</h2>
        <p class="showcase__section__description">
          Toolbar organized into groups with automatic dividers between groups.
        </p>
        <div class="showcase__preview">
          <app-toolbar [groups]="groupedItems()" (itemClick)="onItemClick($event)" />
        </div>
      </div>

      <!-- With Selected State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar with Selection</h2>
        <p class="showcase__section__description">
          Toolbar with toggle buttons that maintain selected state.
        </p>
        <div class="showcase__preview">
          <app-toolbar [items]="selectedItems()" (itemClick)="onItemClick($event)" />
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar Sizes</h2>
        <p class="showcase__section__description">
          Toolbar in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-toolbar [items]="basicItems()" size="small" (itemClick)="onItemClick($event)" />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-toolbar [items]="basicItems()" size="medium" (itemClick)="onItemClick($event)" />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-toolbar [items]="basicItems()" size="large" (itemClick)="onItemClick($event)" />
          </div>
        </div>
      </div>

      <!-- With Disabled Items -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar with Disabled Items</h2>
        <p class="showcase__section__description">
          Some toolbar items can be disabled based on context or state.
        </p>
        <div class="showcase__preview">
          <app-toolbar [items]="disabledItems()" (itemClick)="onItemClick($event)" />
        </div>
      </div>

      <!-- Vertical Toolbar -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Toolbar</h2>
        <p class="showcase__section__description">
          Toolbar can be displayed vertically for sidebars or panels.
        </p>
        <div class="showcase__preview">
          <app-toolbar 
            [items]="basicItems()" 
            orientation="vertical"
            (itemClick)="onItemClick($event)" 
          />
        </div>
      </div>

      <!-- With Dropdown -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar with Dropdown</h2>
        <p class="showcase__section__description">
          Toolbar integrated with dropdown component for selection controls.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <app-toolbar [items]="formattingItems()" (itemClick)="onItemClick($event)" />
            <app-dropdown
              [items]="fontSizeItems()"
              [placeholder]="'Font Size'"
              [size]="toolbarSize()"
              style="width: 120px;"
            />
            <app-dropdown
              [items]="fontFamilyItems()"
              [placeholder]="'Font'"
              [size]="toolbarSize()"
              style="width: 150px;"
            />
          </div>
        </div>
      </div>

      <!-- With Text Input -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toolbar with Text Input</h2>
        <p class="showcase__section__description">
          Toolbar integrated with text input for search or input fields.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <app-toolbar [items]="fileActionsItems()" (itemClick)="onItemClick($event)" />
            <app-text
              [placeholder]="'Search...'"
              [size]="toolbarSize()"
              style="width: 200px;"
            />
            <app-toolbar [items]="viewActionsItems()" (itemClick)="onItemClick($event)" />
          </div>
        </div>
      </div>

      <!-- Rich Editor Toolbar Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Rich Editor Toolbar Example</h2>
        <p class="showcase__section__description">
          Complete example showing toolbar with buttons, dropdowns, and text inputs for a rich text editor.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px; background: #f3f2f1; border-radius: 4px;">
            <app-toolbar [groups]="editorToolbarGroups()" (itemClick)="onItemClick($event)" />
            <app-divider orientation="vertical" />
            <app-dropdown
              [items]="fontSizeItems()"
              [placeholder]="'12'"
              [size]="toolbarSize()"
              style="width: 80px;"
            />
            <app-dropdown
              [items]="fontFamilyItems()"
              [placeholder]="'Arial'"
              [size]="toolbarSize()"
              style="width: 140px;"
            />
            <app-divider orientation="vertical" />
            <app-text
              [placeholder]="'Find...'"
              [size]="toolbarSize()"
              style="width: 150px;"
            />
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Toolbar in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class ToolbarShowcaseComponent {
  toolbarSize = signal<'small' | 'medium' | 'large'>('medium');
  basicItems = signal<ToolbarItem[]>([
    {
      id: 'bold',
      icon: 'text_bold',
      tooltip: 'Bold',
      action: () => this.handleAction('Bold'),
    },
    {
      id: 'italic',
      icon: 'text_italic',
      tooltip: 'Italic',
      action: () => this.handleAction('Italic'),
    },
    {
      id: 'underline',
      icon: 'text_underline',
      tooltip: 'Underline',
      action: () => this.handleAction('Underline'),
    },
    {
      id: 'strikethrough',
      icon: 'text_strikethrough',
      tooltip: 'Strikethrough',
      action: () => this.handleAction('Strikethrough'),
    },
  ]);

  labeledItems = signal<ToolbarItem[]>([
    {
      id: 'new',
      label: 'New',
      icon: 'document_add',
      action: () => this.handleAction('New'),
    },
    {
      id: 'open',
      label: 'Open',
      icon: 'folder_open',
      action: () => this.handleAction('Open'),
    },
    {
      id: 'save',
      label: 'Save',
      icon: 'save',
      action: () => this.handleAction('Save'),
    },
    {
      id: 'print',
      label: 'Print',
      icon: 'print',
      action: () => this.handleAction('Print'),
    },
  ]);

  groupedItems = signal<ToolbarGroup[]>([
    {
      id: 'file',
      items: [
        {
          id: 'new',
          icon: 'document_add',
          tooltip: 'New',
          action: () => this.handleAction('New'),
        },
        {
          id: 'open',
          icon: 'folder_open',
          tooltip: 'Open',
          action: () => this.handleAction('Open'),
        },
        {
          id: 'save',
          icon: 'save',
          tooltip: 'Save',
          action: () => this.handleAction('Save'),
        },
      ],
    },
    {
      id: 'edit',
      items: [
        {
          id: 'undo',
          icon: 'arrow_undo',
          tooltip: 'Undo',
          action: () => this.handleAction('Undo'),
        },
        {
          id: 'redo',
          icon: 'arrow_redo',
          tooltip: 'Redo',
          action: () => this.handleAction('Redo'),
        },
        {
          id: 'cut',
          icon: 'cut',
          tooltip: 'Cut',
          action: () => this.handleAction('Cut'),
        },
        {
          id: 'copy',
          icon: 'copy',
          tooltip: 'Copy',
          action: () => this.handleAction('Copy'),
        },
        {
          id: 'paste',
          icon: 'clipboard_paste',
          tooltip: 'Paste',
          action: () => this.handleAction('Paste'),
        },
      ],
    },
    {
      id: 'format',
      items: [
        {
          id: 'bold',
          icon: 'text_bold',
          tooltip: 'Bold',
          action: () => this.handleAction('Bold'),
        },
        {
          id: 'italic',
          icon: 'text_italic',
          tooltip: 'Italic',
          action: () => this.handleAction('Italic'),
        },
        {
          id: 'underline',
          icon: 'text_underline',
          tooltip: 'Underline',
          action: () => this.handleAction('Underline'),
        },
      ],
    },
  ]);

  selectedItems = signal<ToolbarItem[]>([
    {
      id: 'bold',
      icon: 'text_bold',
      tooltip: 'Bold',
      selected: true,
      action: () => this.toggleSelection('bold'),
    },
    {
      id: 'italic',
      icon: 'text_italic',
      tooltip: 'Italic',
      selected: false,
      action: () => this.toggleSelection('italic'),
    },
    {
      id: 'underline',
      icon: 'text_underline',
      tooltip: 'Underline',
      selected: false,
      action: () => this.toggleSelection('underline'),
    },
  ]);

  formattingItems = signal<ToolbarItem[]>([
    {
      id: 'bold',
      icon: 'text_bold',
      tooltip: 'Bold',
      action: () => this.handleAction('Bold'),
    },
    {
      id: 'italic',
      icon: 'text_italic',
      tooltip: 'Italic',
      action: () => this.handleAction('Italic'),
    },
    {
      id: 'underline',
      icon: 'text_underline',
      tooltip: 'Underline',
      action: () => this.handleAction('Underline'),
    },
  ]);

  fileActionsItems = signal<ToolbarItem[]>([
    {
      id: 'new',
      icon: 'document_add',
      tooltip: 'New',
      action: () => this.handleAction('New'),
    },
    {
      id: 'open',
      icon: 'folder_open',
      tooltip: 'Open',
      action: () => this.handleAction('Open'),
    },
    {
      id: 'save',
      icon: 'save',
      tooltip: 'Save',
      action: () => this.handleAction('Save'),
    },
  ]);

  viewActionsItems = signal<ToolbarItem[]>([
    {
      id: 'zoom-in',
      icon: 'zoom_in',
      tooltip: 'Zoom In',
      action: () => this.handleAction('Zoom In'),
    },
    {
      id: 'zoom-out',
      icon: 'zoom_out',
      tooltip: 'Zoom Out',
      action: () => this.handleAction('Zoom Out'),
    },
  ]);

  fontSizeItems = signal<DropdownItem[]>([
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' },
    { value: '20', label: '20' },
    { value: '24', label: '24' },
    { value: '28', label: '28' },
    { value: '32', label: '32' },
  ]);

  fontFamilyItems = signal<DropdownItem[]>([
    { value: 'arial', label: 'Arial' },
    { value: 'calibri', label: 'Calibri' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'courier', label: 'Courier New' },
    { value: 'verdana', label: 'Verdana' },
    { value: 'georgia', label: 'Georgia' },
  ]);

  editorToolbarGroups = signal<ToolbarGroup[]>([
    {
      id: 'format',
      items: [
        {
          id: 'bold',
          icon: 'text_bold',
          tooltip: 'Bold',
          action: () => this.handleAction('Bold'),
        },
        {
          id: 'italic',
          icon: 'text_italic',
          tooltip: 'Italic',
          action: () => this.handleAction('Italic'),
        },
        {
          id: 'underline',
          icon: 'text_underline',
          tooltip: 'Underline',
          action: () => this.handleAction('Underline'),
        },
        {
          id: 'strikethrough',
          icon: 'text_strikethrough',
          tooltip: 'Strikethrough',
          action: () => this.handleAction('Strikethrough'),
        },
      ],
    },
    {
      id: 'alignment',
      items: [
        {
          id: 'align-left',
          icon: 'text_align_left',
          tooltip: 'Align Left',
          action: () => this.handleAction('Align Left'),
        },
        {
          id: 'align-center',
          icon: 'text_align_center',
          tooltip: 'Align Center',
          action: () => this.handleAction('Align Center'),
        },
        {
          id: 'align-right',
          icon: 'text_align_right',
          tooltip: 'Align Right',
          action: () => this.handleAction('Align Right'),
        },
        {
          id: 'align-justify',
          icon: 'text_align_justify',
          tooltip: 'Justify',
          action: () => this.handleAction('Justify'),
        },
      ],
    },
  ]);

  disabledItems = signal<ToolbarItem[]>([
    {
      id: 'new',
      label: 'New',
      icon: 'document_add',
      action: () => this.handleAction('New'),
    },
    {
      id: 'open',
      label: 'Open',
      icon: 'folder_open',
      disabled: true,
      action: () => this.handleAction('Open'),
    },
    {
      id: 'save',
      label: 'Save',
      icon: 'save',
      disabled: true,
      action: () => this.handleAction('Save'),
    },
    {
      id: 'print',
      label: 'Print',
      icon: 'print',
      action: () => this.handleAction('Print'),
    },
  ]);

  usageExample = `// In your component
import { ToolbarComponent } from '@shared/components/toolbar';
import { ToolbarItem } from '@shared/components/toolbar/models/toolbar-item.model';

@Component({
  template: \`
    <app-toolbar
      [items]="toolbarItems()"
      (itemClick)="onItemClick($event)"
    />
  \`
})
export class MyComponent {
  toolbarItems = signal<ToolbarItem[]>([
    {
      id: 'bold',
      icon: 'text_bold',
      tooltip: 'Bold',
      action: () => console.log('Bold clicked')
    },
    {
      id: 'italic',
      icon: 'text_italic',
      tooltip: 'Italic',
      action: () => console.log('Italic clicked')
    }
  ]);
  
  onItemClick(item: ToolbarItem) {
    console.log('Item clicked:', item.id);
  }
}`;

  onItemClick(item: ToolbarItem): void {
    console.log('Toolbar item clicked:', item.id);
  }

  handleAction(actionName: string): void {
    alert(`Action executed: ${actionName}`);
  }

  toggleSelection(id: string): void {
    const items = this.selectedItems();
    const updated = items.map(item => ({
      ...item,
      selected: item.id === id ? !item.selected : item.selected,
    }));
    this.selectedItems.set(updated);
    this.handleAction(`Toggle ${id}`);
  }
}


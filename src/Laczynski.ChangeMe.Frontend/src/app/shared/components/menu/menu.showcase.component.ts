import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItem, MenuSection } from './models/menu-item.model';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-menu-showcase',

  imports: [CommonModule, MenuComponent, TableOfContentComponent],
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
        <h1 class="showcase__title">Menu Component</h1>
      <p class="showcase__description">
        Menu component zgodny z Fluent 2 Design System. Obsługuje różne warianty elementów menu,
        stany interakcji oraz hierarchiczne sekcje.
      </p>

      <!-- Basic Menu -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Basic Menu</h2>
        <p class="showcase__section__description">Podstawowe menu z kilkoma elementami</p>
        <div class="showcase__preview">
          <app-menu [items]="basicMenuItems" />
        </div>
      </section>

      <!-- Menu with Sections -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Menu with Sections</h2>
        <p class="showcase__section__description">Menu z nagłówkami sekcji i separatorami</p>
        <div class="showcase__preview">
          <app-menu [sections]="menuSections" />
        </div>
      </section>

      <!-- Menu with Icons -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Menu with Icons</h2>
        <p class="showcase__section__description">Menu z ikonami i skrótami klawiszowymi</p>
        <div class="showcase__preview">
          <app-menu [items]="iconMenuItems" />
        </div>
      </section>

      <!-- Menu with Split Items -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Menu with Split Items</h2>
        <p class="showcase__section__description">
          Menu z elementami split (z dodatkowym przyciskiem submenu)
        </p>
        <div class="showcase__preview">
          <app-menu [sections]="splitMenuSections" />
        </div>
      </section>

      <!-- Menu with Submenu Indicators (chevron only) -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Menu with Submenu Indicators (Chevron Only)</h2>
        <p class="showcase__section__description">
          Menu z wskaźnikami submenu (tylko ikona, bez działającego podmenu)
        </p>
        <p style="color: #616161; font-size: 12px;">
          <strong>Note:</strong> To pokazuje tylko chevron indicator. Dla działającego submenu
          zobacz sekcje "Nested Submenu" i "Multi-level Submenu" poniżej.
        </p>
        <div class="showcase__preview">
          <app-menu [items]="submenuIndicatorItems" />
        </div>
      </section>

      <!-- Menu States -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Menu States</h2>
        <p class="showcase__section__description">Demonstracja różnych stanów elementów menu</p>
        <div class="showcase__preview" style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div>
            <h3 style="font-size: 12px; margin-bottom: 8px;">Normal</h3>
            <app-menu [items]="normalStateItems" />
          </div>
          <div>
            <h3 style="font-size: 12px; margin-bottom: 8px;">Selected</h3>
            <app-menu [items]="selectedStateItems" />
          </div>
          <div>
            <h3 style="font-size: 12px; margin-bottom: 8px;">Disabled</h3>
            <app-menu [items]="disabledStateItems" />
          </div>
          <div>
            <h3 style="font-size: 12px; margin-bottom: 8px;">Checked</h3>
            <app-menu [items]="checkedStateItems" />
          </div>
        </div>
      </section>

      <!-- Nested Submenu -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Nested Submenu</h2>
        <p class="showcase__section__description">Menu z zagnieżdżonymi podmenu (hover to open)</p>
        <div style="margin-bottom: 12px; padding: 12px; background: #f0f0f0; border-radius: 4px;">
          <strong>Debug info:</strong><br />
          Total items: {{ nestedSubmenuItems.length }}<br />
          First item has submenu: {{ nestedSubmenuItems[0].submenuItems?.length || 0 }} items
        </div>
        <div class="showcase__preview">
          <app-menu [items]="nestedSubmenuItems" (itemClick)="onItemClick($event)" />
        </div>
      </section>

      <!-- Multi-level Submenu -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Multi-level Submenu</h2>
        <p class="showcase__section__description">Menu z wielopoziomowymi podmenu</p>
        <div class="showcase__preview">
          <app-menu [sections]="multiLevelSections" (itemClick)="onItemClick($event)" />
        </div>
      </section>

      <!-- Complete Example -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Complete Example</h2>
        <p class="showcase__section__description">Pełny przykład menu z wszystkimi funkcjami</p>
        <div class="showcase__preview">
          <app-menu
            [sections]="completeMenuSections"
            (itemClick)="onItemClick($event)"
            (submenuClick)="onSubmenuClick($event)"
          />
        </div>
        @if (lastAction) {
          <div style="margin-top: 16px; padding: 12px; border-radius: 4px;">
            <strong>Last action:</strong> {{ lastAction }}
          </div>
        }
      </section>
      </div>
    </div>
  `,
})
export class MenuShowcaseComponent {
  lastAction: string = '';

  // Basic Menu
  basicMenuItems: MenuItem[] = [
    { id: '1', label: 'New File', icon: 'image' },
    { id: '2', label: 'Open File', icon: 'image' },
    { id: '3', label: 'Save File', icon: 'image' },
    { id: '4', label: 'Close File', icon: 'image' },
  ];

  // Menu with Sections
  menuSections: MenuSection[] = [
    {
      header: 'File Operations',
      items: [
        { id: '1', label: 'New', icon: 'image', shortcut: 'Ctrl+N' },
        { id: '2', label: 'Open', icon: 'image', shortcut: 'Ctrl+O' },
        { id: '3', label: 'Save', icon: 'image', shortcut: 'Ctrl+S' },
      ],
    },
    {
      header: 'Edit Operations',
      items: [
        { id: '4', label: 'Cut', icon: 'image', shortcut: 'Ctrl+X' },
        { id: '5', label: 'Copy', icon: 'image', shortcut: 'Ctrl+C' },
        { id: '6', label: 'Paste', icon: 'image', shortcut: 'Ctrl+V' },
      ],
      divider: true,
    },
  ];

  // Icon Menu
  iconMenuItems: MenuItem[] = [
    { id: '1', label: 'Cut', icon: 'image', shortcut: 'Ctrl+X' },
    { id: '2', label: 'Copy', icon: 'image', shortcut: 'Ctrl+C' },
    { id: '3', label: 'Paste', icon: 'image', shortcut: 'Ctrl+V' },
    { id: '4', label: 'Delete', icon: 'image', shortcut: 'Del' },
  ];

  // Split Menu
  splitMenuSections: MenuSection[] = [
    {
      header: 'Recent Files',
      items: [
        {
          id: '1',
          type: 'split',
          label: 'Document.docx',
          icon: 'image',
          shortcut: 'Ctrl+1',
          action: () => this.onItemClick({ id: '1', label: 'Document.docx' } as MenuItem),
          submenuAction: () => this.onSubmenuClick({ id: '1', label: 'Document.docx' } as MenuItem),
        },
        {
          id: '2',
          type: 'split',
          label: 'Presentation.pptx',
          icon: 'image',
          shortcut: 'Ctrl+2',
          action: () => this.onItemClick({ id: '2', label: 'Presentation.pptx' } as MenuItem),
          submenuAction: () =>
            this.onSubmenuClick({ id: '2', label: 'Presentation.pptx' } as MenuItem),
        },
        {
          id: '3',
          type: 'split',
          label: 'Spreadsheet.xlsx',
          icon: 'image',
          shortcut: 'Ctrl+3',
          action: () => this.onItemClick({ id: '3', label: 'Spreadsheet.xlsx' } as MenuItem),
          submenuAction: () =>
            this.onSubmenuClick({ id: '3', label: 'Spreadsheet.xlsx' } as MenuItem),
        },
      ],
    },
  ];

  // Submenu Indicator Items (chevron only, no actual submenu)
  submenuIndicatorItems: MenuItem[] = [
    { id: '1', label: 'File', icon: 'image', hasSubmenu: true },
    { id: '2', label: 'Edit', icon: 'image', hasSubmenu: true },
    { id: '3', label: 'View', icon: 'image', hasSubmenu: true },
    { id: '4', label: 'Tools', icon: 'image', hasSubmenu: true },
  ];

  // Nested Submenu Items
  nestedSubmenuItems: MenuItem[] = [
    {
      id: 'file',
      label: 'File',
      icon: 'image',
      submenuItems: [
        { id: 'file-new', label: 'New', icon: 'image', shortcut: 'Ctrl+N' },
        { id: 'file-open', label: 'Open', icon: 'image', shortcut: 'Ctrl+O' },
        { id: 'file-save', label: 'Save', icon: 'image', shortcut: 'Ctrl+S' },
        { id: 'file-close', label: 'Close', icon: 'image' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: 'image',
      submenuItems: [
        { id: 'edit-cut', label: 'Cut', icon: 'image', shortcut: 'Ctrl+X' },
        { id: 'edit-copy', label: 'Copy', icon: 'image', shortcut: 'Ctrl+C' },
        { id: 'edit-paste', label: 'Paste', icon: 'image', shortcut: 'Ctrl+V' },
        { id: 'edit-delete', label: 'Delete', icon: 'image', shortcut: 'Del' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      icon: 'image',
      submenuItems: [
        { id: 'view-zoom-in', label: 'Zoom In', icon: 'image', shortcut: 'Ctrl++' },
        { id: 'view-zoom-out', label: 'Zoom Out', icon: 'image', shortcut: 'Ctrl+-' },
        { id: 'view-reset', label: 'Reset Zoom', icon: 'image', shortcut: 'Ctrl+0' },
      ],
    },
  ];

  // Multi-level Submenu
  multiLevelSections: MenuSection[] = [
    {
      header: 'Navigation',
      items: [
        {
          id: 'file',
          label: 'File',
          icon: 'image',
          submenuItems: [
            {
              id: 'file-new',
              label: 'New',
              icon: 'image',
              submenuItems: [
                { id: 'file-new-text', label: 'Text File', icon: 'image' },
                { id: 'file-new-folder', label: 'Folder', icon: 'image' },
                { id: 'file-new-project', label: 'Project', icon: 'image' },
              ],
            },
            { id: 'file-open', label: 'Open', icon: 'image', shortcut: 'Ctrl+O' },
            {
              id: 'file-recent',
              label: 'Open Recent',
              icon: 'image',
              submenuItems: [
                { id: 'recent-1', label: 'Document1.txt', icon: 'image' },
                { id: 'recent-2', label: 'Document2.txt', icon: 'image' },
                { id: 'recent-3', label: 'Document3.txt', icon: 'image' },
              ],
            },
            { id: 'file-save', label: 'Save', icon: 'image', shortcut: 'Ctrl+S' },
          ],
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: 'image',
          submenuItems: [
            { id: 'edit-undo', label: 'Undo', icon: 'image', shortcut: 'Ctrl+Z' },
            { id: 'edit-redo', label: 'Redo', icon: 'image', shortcut: 'Ctrl+Y' },
            {
              id: 'edit-find',
              label: 'Find',
              icon: 'image',
              submenuItems: [
                { id: 'find-file', label: 'Find in File', icon: 'image', shortcut: 'Ctrl+F' },
                {
                  id: 'find-project',
                  label: 'Find in Project',
                  icon: 'image',
                  shortcut: 'Ctrl+Shift+F',
                },
                { id: 'find-replace', label: 'Replace', icon: 'image', shortcut: 'Ctrl+H' },
              ],
            },
          ],
        },
      ],
    },
  ];

  // State Items
  normalStateItems: MenuItem[] = [
    { id: '1', label: 'Normal Item', icon: 'image' },
    { id: '2', label: 'Another Item', icon: 'image' },
  ];

  selectedStateItems: MenuItem[] = [
    { id: '1', label: 'Selected Item', icon: 'image', selected: true },
    { id: '2', label: 'Another Item', icon: 'image' },
  ];

  disabledStateItems: MenuItem[] = [
    { id: '1', label: 'Disabled Item', icon: 'image', disabled: true },
    { id: '2', label: 'Another Disabled', icon: 'image', disabled: true },
  ];

  checkedStateItems: MenuItem[] = [
    { id: '1', label: 'Checked Item', icon: 'image', checked: true },
    { id: '2', label: 'Unchecked Item', icon: 'image', checked: false },
  ];

  // Complete Example
  completeMenuSections: MenuSection[] = [
    {
      header: 'Section Header',
      items: [
        {
          id: '1',
          label: 'Action',
          icon: 'image',
          action: () => this.handleAction('Action clicked'),
        },
        {
          id: '2',
          label: 'Action',
          icon: 'image',
          action: () => this.handleAction('Second action clicked'),
        },
        {
          id: '3',
          label: 'Action',
          icon: 'image',
          action: () => this.handleAction('Third action clicked'),
        },
      ],
      divider: true,
    },
    {
      header: 'Section Header',
      items: [
        {
          id: '4',
          type: 'split',
          label: 'Action',
          icon: 'image',
          shortcut: 'Shortcut text',
          selected: true,
          action: () => this.handleAction('Split action clicked'),
          submenuAction: () => this.handleAction('Split submenu clicked'),
        },
        {
          id: '5',
          type: 'split',
          label: 'Action',
          icon: 'image',
          shortcut: 'Shortcut text',
          action: () => this.handleAction('Second split action clicked'),
          submenuAction: () => this.handleAction('Second split submenu clicked'),
        },
        {
          id: '6',
          type: 'split',
          label: 'Action',
          icon: 'image',
          shortcut: 'Shortcut text',
          action: () => this.handleAction('Third split action clicked'),
          submenuAction: () => this.handleAction('Third split submenu clicked'),
        },
      ],
    },
  ];

  onItemClick(item: MenuItem): void {
    this.lastAction = `Item clicked: ${item.label}`;
    console.log('Item clicked:', item);
  }

  onSubmenuClick(item: MenuItem): void {
    this.lastAction = `Submenu clicked: ${item.label}`;
    console.log('Submenu clicked:', item);
  }

  handleAction(action: string): void {
    this.lastAction = action;
    console.log(action);
  }
}

import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { NavComponent, NavNode } from './nav.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-nav-showcase',
  imports: [NavComponent, CommonModule, ButtonComponent, TableOfContentComponent],
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
        <h1 class="showcase__title">Nav Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Nav component built with Fluent 2 Design System. Navigation
        supports hierarchical structures, icons, section headers, dividers, selection indicators,
        quick actions, and various appearance variants.
      </p>

      <!-- ========================================= -->
      <!-- BASIC NAVIGATION -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Navigation</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Simple Navigation</h3>
            <app-nav [items]="basicNavItems()" />
          </div>
          <div class="showcase__item">
            <h3>With Icons</h3>
            <app-nav [items]="navWithIcons()" />
          </div>
          <div class="showcase__item">
            <h3>With Nested Items</h3>
            <app-nav [items]="nestedNavItems()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SECTION HEADERS AND DIVIDERS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Section Headers and Dividers</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Section Headers</h3>
            <app-nav [items]="navWithSectionHeaders()" />
          </div>
          <div class="showcase__item">
            <h3>With Dividers</h3>
            <app-nav [items]="navWithDividers()" />
          </div>
          <div class="showcase__item">
            <h3>Combined Structure</h3>
            <app-nav [items]="navWithSectionsAndDividers()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SIZE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-nav [items]="sizeNavItems('small')" [size]="'small'" />
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-nav [items]="sizeNavItems('medium')" [size]="'medium'" />
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-nav [items]="sizeNavItems('large')" [size]="'large'" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- APPEARANCE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Appearance Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Transparent (Default)</h3>
            <app-nav [items]="basicNavItems()" [variant]="'transparent'" />
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-nav [items]="basicNavItems()" [variant]="'subtle'" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-nav [items]="basicNavItems()" [variant]="'subtle-circular'" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-nav [items]="basicNavItems()" [variant]="'filled-circular'" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SELECTION INDICATORS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicators</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Horizontal Indicator</h3>
            <app-nav
              [items]="selectionNavItems()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'horizontal'"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator</h3>
            <app-nav
              [items]="selectionNavItems()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
            />
          </div>
          <div class="showcase__item">
            <h3>No Indicator</h3>
            <app-nav [items]="selectionNavItems()" [showSelectionIndicator]="false" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CHEVRON POSITIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Chevron Positions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Before</h3>
            <app-nav [items]="nestedNavItems()" [chevronPosition]="'before'" />
          </div>
          <div class="showcase__item">
            <h3>After (Default)</h3>
            <app-nav [items]="nestedNavItems()" [chevronPosition]="'after'" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CHEVRON ICONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Chevron Icons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Custom Icons</h3>
            <app-nav
              [items]="nestedNavItems()"
              [chevronIconCollapsed]="'arrow_right'"
              [chevronIconExpanded]="'arrow_down'"
            />
          </div>
          <div class="showcase__item">
            <h3>Custom Icons (After)</h3>
            <app-nav
              [items]="nestedNavItems()"
              [chevronPosition]="'after'"
              [chevronIconCollapsed]="'star'"
              [chevronIconExpanded]="'star_off'"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EXPAND/SELECT BEHAVIOR -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Expand/Select Behavior</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Auto-detect (Default)</h3>
            <app-nav [items]="behaviorNavItems()" />
            <p style="font-size: 12px; margin-top: 8px; color: #666;">
              Items with children expand, items without children select.
            </p>
          </div>
          <div class="showcase__item">
            <h3>Always Expand</h3>
            <app-nav [items]="behaviorNavItems()" [expandOnClick]="true" />
          </div>
          <div class="showcase__item">
            <h3>Always Select</h3>
            <app-nav [items]="behaviorNavItems()" [selectOnClick]="true" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- QUICK ACTIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Quick Actions</h3>
            <app-nav
              [items]="quickActionsNavItems()"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CONTENT -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Content</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Badge</h3>
            <app-nav
              [items]="customContentNavItems()"
              [contentTemplate]="customContentWithBadgeTemplate"
            />
          </div>
          <div class="showcase__item">
            <h3>With Status Indicator</h3>
            <app-nav
              [items]="customContentNavItems()"
              [contentTemplate]="customContentWithStatusTemplate"
            />
          </div>
          <div class="showcase__item">
            <h3>With Count Badge</h3>
            <app-nav
              [items]="customContentNavItems()"
              [contentTemplate]="customContentWithCountTemplate"
            />
          </div>
          <div class="showcase__item">
            <h3>Custom Layout</h3>
            <app-nav
              [items]="customContentNavItems()"
              [contentTemplate]="customContentLayoutTemplate"
            />
          </div>
          <div class="showcase__item">
            <h3>With Icon and Description</h3>
            <app-nav
              [items]="customContentNavItemsWithDesc()"
              [contentTemplate]="customContentWithDescriptionTemplate"
            />
          </div>
          <div class="showcase__item">
            <h3>Colored Custom Content</h3>
            <app-nav
              [items]="customContentNavItems()"
              [contentTemplate]="customContentColoredTemplate"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- DISABLED STATE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Disabled State</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Disabled Items</h3>
            <app-nav [items]="disabledNavItems()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- WIDTH CONFIGURATION -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Width Configuration</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Default Width (260px)</h3>
            <app-nav [items]="basicNavItems()" />
          </div>
          <div class="showcase__item">
            <h3>Custom Width (320px)</h3>
            <app-nav [items]="basicNavItems()" [width]="320" />
          </div>
          <div class="showcase__item">
            <h3>Narrow Width (200px)</h3>
            <app-nav [items]="basicNavItems()" [width]="200" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- COMPLEX EXAMPLE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Complex Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item" style="grid-column: 1 / -1;">
            <h3>Full Featured Navigation</h3>
            <app-nav
              [items]="complexNavItems()"
              [width]="280"
              [size]="'medium'"
              [variant]="'subtle'"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
              [chevronPosition]="'after'"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EVENT TRACKING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Tracking</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Click Events</h3>
            <app-nav [items]="trackedNavItems()" />
            <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
              <p style="font-size: 12px; margin: 0 0 8px 0;">
                <strong>Last Clicked:</strong> {{ lastClickedItem() || 'None' }}
              </p>
              <p style="font-size: 12px; margin: 0;">
                <strong>Click Count:</strong> {{ clickCount() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Template -->
      <ng-template #quickActionsTemplate let-node>
        <div style="display: flex; gap: 4px; align-items: center;">
          <app-button
            variant="primary"
            size="small"
            (click)="onQuickActionClick('edit', node); $event.stopPropagation()"
          >
            Edit
          </app-button>
          <app-button
            variant="primary"
            size="small"
            (click)="onQuickActionClick('delete', node); $event.stopPropagation()"
          >
            Delete
          </app-button>
        </div>
      </ng-template>

      <!-- Custom Content Templates -->
      <ng-template #customContentWithBadgeTemplate let-node>
        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
          <span>{{ node.label }}</span>
          <span
            style="
              background: #0078d4;
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 11px;
              font-weight: 600;
            "
          >
            New
          </span>
        </div>
      </ng-template>

      <ng-template #customContentWithStatusTemplate let-node>
        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
          <span
            style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #107c10;
              flex-shrink: 0;
            "
          ></span>
          <span>{{ node.label }}</span>
        </div>
      </ng-template>

      <ng-template #customContentWithCountTemplate let-node>
        <div
          style="display: flex; align-items: center; justify-content: space-between; width: 100%;"
        >
          <span>{{ node.label }}</span>
          <span
            style="
              background: #f3f2f1;
              color: #323130;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
              min-width: 20px;
              text-align: center;
            "
          >
            {{ getItemCount(node.id) }}
          </span>
        </div>
      </ng-template>

      <ng-template #customContentLayoutTemplate let-node>
        <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 500;">{{ node.label }}</span>
          </div>
          <div style="font-size: 11px; color: #605e5c;">Custom layout content</div>
        </div>
      </ng-template>

      <ng-template #customContentWithDescriptionTemplate let-node>
        <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
          @if (node.icon) {
            <span style="font-size: 20px;">📁</span>
          }
          <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
            <span style="font-weight: 500; font-size: 14px;">{{ node.label }}</span>
            <span
              style="font-size: 11px; color: #605e5c; overflow: hidden; text-overflow: ellipsis;"
            >
              {{ getItemDescription(node.id) }}
            </span>
          </div>
        </div>
      </ng-template>

      <ng-template #customContentColoredTemplate let-node>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 4px 8px;
            border-radius: 4px;
            background: linear-gradient(90deg, #{{ getItemColor(node.id) }}20, #{{
            getItemColor(node.id)
          }}10);
          "
        >
          <span
            style="
              width: 4px;
              height: 20px;
              background: #{{ getItemColor(node.id) }};
              border-radius: 2px;
            "
          ></span>
          <span style="font-weight: 500;">{{ node.label }}</span>
        </div>
      </ng-template>
      </div>
    </div>
  `,
})
export class NavShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  customContentWithBadgeTemplate = viewChild<TemplateRef<any>>('customContentWithBadgeTemplate');
  customContentWithStatusTemplate = viewChild<TemplateRef<any>>('customContentWithStatusTemplate');
  customContentWithCountTemplate = viewChild<TemplateRef<any>>('customContentWithCountTemplate');
  customContentLayoutTemplate = viewChild<TemplateRef<any>>('customContentLayoutTemplate');
  customContentWithDescriptionTemplate = viewChild<TemplateRef<any>>(
    'customContentWithDescriptionTemplate',
  );
  customContentColoredTemplate = viewChild<TemplateRef<any>>('customContentColoredTemplate');

  lastClickedItem = signal<string>('');
  clickCount = signal<number>(0);

  // Basic navigation items
  basicNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: '3', label: 'Settings', icon: 'settings' },
  ]);

  // Navigation with icons
  navWithIcons = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: '3', label: 'Reports', icon: 'info' },
    { id: '4', label: 'Messages', icon: 'mail' },
    { id: '5', label: 'Notifications', icon: 'service_bell' },
  ]);

  // Nested navigation items
  nestedNavItems = signal<NavNode[]>([
    {
      id: '1',
      label: 'Dashboard',
      icon: 'home',
      hasChildren: true,
      children: [
        { id: '1-1', label: 'Overview' },
        { id: '1-2', label: 'Analytics' },
        { id: '1-3', label: 'Reports' },
      ],
    },
    {
      id: '2',
      label: 'Settings',
      icon: 'settings',
      hasChildren: true,
      children: [
        { id: '2-1', label: 'General' },
        { id: '2-2', label: 'Security' },
        {
          id: '2-3',
          label: 'Advanced',
          hasChildren: true,
          children: [
            { id: '2-3-1', label: 'API Keys' },
            { id: '2-3-2', label: 'Integrations' },
          ],
        },
      ],
    },
    { id: '3', label: 'Profile', icon: 'person' },
  ]);

  // Navigation with section headers
  navWithSectionHeaders = signal<NavNode[]>([
    { id: 'header1', label: 'Main', isSectionHeader: true },
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: 'header2', label: 'Settings', isSectionHeader: true },
    { id: '3', label: 'General', icon: 'settings' },
    { id: '4', label: 'Security', icon: 'lock_closed' },
  ]);

  // Navigation with dividers
  navWithDividers = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: '3', label: 'Settings', icon: 'settings' },
    { id: '4', label: 'Profile', icon: 'person' },
  ]);

  // Navigation with sections and dividers
  navWithSectionsAndDividers = signal<NavNode[]>([
    { id: 'header1', label: 'Navigation', isSectionHeader: true },
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: 'header2', label: 'Account', isSectionHeader: true },
    { id: '3', label: 'Profile', icon: 'person' },
    { id: '4', label: 'Settings', icon: 'settings' },
  ]);

  // Size navigation items
  sizeNavItems = (size: 'small' | 'medium' | 'large'): NavNode[] => [
    { id: '1', label: 'Home', icon: 'home', size },
    { id: '2', label: 'Dashboard', icon: 'home', size },
    { id: '3', label: 'Settings', icon: 'settings', size },
  ];

  // Selection navigation items
  selectionNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home', selected: true },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: '3', label: 'Settings', icon: 'settings' },
    { id: '4', label: 'Profile', icon: 'person' },
  ]);

  // Behavior navigation items
  behaviorNavItems = signal<NavNode[]>([
    {
      id: '1',
      label: 'Expandable Item',
      icon: 'folder',
      hasChildren: true,
      children: [
        { id: '1-1', label: 'Child 1' },
        { id: '1-2', label: 'Child 2' },
      ],
    },
    { id: '2', label: 'Selectable Item', icon: 'document' },
    {
      id: '3',
      label: 'Another Expandable',
      icon: 'folder',
      hasChildren: true,
      children: [{ id: '3-1', label: 'Nested Child' }],
    },
  ]);

  // Quick actions navigation items
  quickActionsNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home' },
    { id: '3', label: 'Settings', icon: 'settings' },
  ]);

  // Disabled navigation items
  disabledNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'home', disabled: true },
    { id: '3', label: 'Settings', icon: 'settings' },
    {
      id: '4',
      label: 'Disabled Parent',
      icon: 'folder',
      disabled: true,
      hasChildren: true,
      children: [
        { id: '4-1', label: 'Child 1' },
        { id: '4-2', label: 'Child 2' },
      ],
    },
  ]);

  // Complex navigation items
  complexNavItems = signal<NavNode[]>([
    { id: 'header1', label: 'Main Navigation', isSectionHeader: true },
    {
      id: '1',
      label: 'Dashboard',
      icon: 'home',
      selected: true,
      hasChildren: true,
      children: [
        { id: '1-1', label: 'Overview', icon: 'info' },
        { id: '1-2', label: 'Analytics', icon: 'info' },
        { id: '1-3', label: 'Reports', icon: 'info' },
      ],
    },
    { id: '2', label: 'Projects', icon: 'folder', hasChildren: true, children: [] },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: 'header2', label: 'Account', isSectionHeader: true },
    { id: '3', label: 'Profile', icon: 'person' },
    { id: '4', label: 'Settings', icon: 'settings', hasChildren: true, children: [] },
    { id: 'divider2', label: 'Divider', isDivider: true },
    { id: '5', label: 'Help', icon: 'info' },
    { id: '6', label: 'Logout', icon: 'arrow_exit', disabled: false },
  ]);

  // Tracked navigation items
  trackedNavItems = signal<NavNode[]>([
    {
      id: '1',
      label: 'Home',
      icon: 'home',
      onClick: () => this.onNavItemClick('Home'),
    },
    {
      id: '2',
      label: 'Dashboard',
      icon: 'home',
      onClick: () => this.onNavItemClick('Dashboard'),
    },
    {
      id: '3',
      label: 'Settings',
      icon: 'settings',
      onClick: () => this.onNavItemClick('Settings'),
    },
  ]);

  // Custom content navigation items
  customContentNavItems = signal<NavNode[]>([
    {
      id: '1',
      label: 'Inbox',
      children: [
        { id: '1-1', label: 'Inbox 1' },
        { id: '1-2', label: 'Inbox 2' },
        { id: '1-3', label: 'Inbox 3' },
      ],
      hasChildren: true,
    },
    { id: '2', label: 'Drafts' },
    { id: '3', label: 'Sent' },
    { id: '4', label: 'Archive' },
  ]);

  customContentNavItemsWithDesc = signal<NavNode[]>([
    { id: '1', label: 'Documents', icon: 'folder' },
    { id: '2', label: 'Pictures', icon: 'image' },
    { id: '3', label: 'Videos', icon: 'video' },
  ]);

  onNavItemClick(label: string): void {
    this.lastClickedItem.set(label);
    this.clickCount.update(count => count + 1);
    console.log('Nav item clicked:', label);
  }

  onQuickActionClick(action: string, node: NavNode): void {
    console.log('Quick action clicked:', action, node);
    alert(`Quick action: ${action} on ${node.label}`);
  }

  getItemCount(id: string): number {
    const counts: Record<string, number> = {
      '1': 5,
      '2': 12,
      '3': 0,
      '4': 23,
    };
    return counts[id] || 0;
  }

  getItemDescription(id: string): string {
    const descriptions: Record<string, string> = {
      '1': 'Your document files and folders',
      '2': 'Your image collection',
      '3': 'Your video library',
    };
    return descriptions[id] || 'No description';
  }

  getItemColor(id: string): string {
    const colors: Record<string, string> = {
      '1': '0078d4',
      '2': '107c10',
      '3': 'd13438',
      '4': 'ffaa44',
    };
    return colors[id] || '605e5c';
  }
}

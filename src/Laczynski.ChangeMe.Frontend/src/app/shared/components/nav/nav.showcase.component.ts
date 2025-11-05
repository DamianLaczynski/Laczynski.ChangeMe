import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { NavComponent, NavNode } from './nav.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-nav-showcase',
  imports: [NavComponent, CommonModule, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
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
              [chevronIconExpanded]="'star_filled'"
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
    </div>
  `,
})
export class NavShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  lastClickedItem = signal<string>('');
  clickCount = signal<number>(0);

  // Basic navigation items
  basicNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: '3', label: 'Settings', icon: 'settings' },
  ]);

  // Navigation with icons
  navWithIcons = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: '3', label: 'Reports', icon: 'chart' },
    { id: '4', label: 'Messages', icon: 'mail' },
    { id: '5', label: 'Notifications', icon: 'bell' },
  ]);

  // Nested navigation items
  nestedNavItems = signal<NavNode[]>([
    {
      id: '1',
      label: 'Dashboard',
      icon: 'dashboard',
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
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: 'header2', label: 'Settings', isSectionHeader: true },
    { id: '3', label: 'General', icon: 'settings' },
    { id: '4', label: 'Security', icon: 'lock' },
  ]);

  // Navigation with dividers
  navWithDividers = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: '3', label: 'Settings', icon: 'settings' },
    { id: '4', label: 'Profile', icon: 'person' },
  ]);

  // Navigation with sections and dividers
  navWithSectionsAndDividers = signal<NavNode[]>([
    { id: 'header1', label: 'Navigation', isSectionHeader: true },
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: 'header2', label: 'Account', isSectionHeader: true },
    { id: '3', label: 'Profile', icon: 'person' },
    { id: '4', label: 'Settings', icon: 'settings' },
  ]);

  // Size navigation items
  sizeNavItems = (size: 'small' | 'medium' | 'large'): NavNode[] => [
    { id: '1', label: 'Home', icon: 'home', size },
    { id: '2', label: 'Dashboard', icon: 'dashboard', size },
    { id: '3', label: 'Settings', icon: 'settings', size },
  ];

  // Selection navigation items
  selectionNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home', selected: true },
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
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
    { id: '2', label: 'Selectable Item', icon: 'file' },
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
    { id: '2', label: 'Dashboard', icon: 'dashboard' },
    { id: '3', label: 'Settings', icon: 'settings' },
  ]);

  // Disabled navigation items
  disabledNavItems = signal<NavNode[]>([
    { id: '1', label: 'Home', icon: 'home' },
    { id: '2', label: 'Dashboard', icon: 'dashboard', disabled: true },
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
      icon: 'dashboard',
      selected: true,
      hasChildren: true,
      children: [
        { id: '1-1', label: 'Overview', icon: 'chart' },
        { id: '1-2', label: 'Analytics', icon: 'bar_chart' },
        { id: '1-3', label: 'Reports', icon: 'description' },
      ],
    },
    { id: '2', label: 'Projects', icon: 'folder', hasChildren: true, children: [] },
    { id: 'divider1', label: 'Divider', isDivider: true },
    { id: 'header2', label: 'Account', isSectionHeader: true },
    { id: '3', label: 'Profile', icon: 'person' },
    { id: '4', label: 'Settings', icon: 'settings', hasChildren: true, children: [] },
    { id: 'divider2', label: 'Divider', isDivider: true },
    { id: '5', label: 'Help', icon: 'help' },
    { id: '6', label: 'Logout', icon: 'logout', disabled: false },
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
      icon: 'dashboard',
      onClick: () => this.onNavItemClick('Dashboard'),
    },
    {
      id: '3',
      label: 'Settings',
      icon: 'settings',
      onClick: () => this.onNavItemClick('Settings'),
    },
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
}

import { Component, signal } from '@angular/core';
import { NavComponent, NavNode } from './nav.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-showcase',
  imports: [CommonModule, NavComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Nav Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Nav component built with Fluent 2 Design System. Features
        collapsible navigation with hamburger menu, hierarchical navigation nodes, sub-items, and
        customizable layouts.
      </p>

      <!-- Keyboard Navigation Info -->
      <div
        class="showcase__info"
        style="background: #F0F0F0; padding: 16px; border-radius: 8px; margin-bottom: 24px;"
      >
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
          ⌨️ Keyboard Navigation
        </h3>
        <ul style="margin: 0; padding-left: 24px; line-height: 24px;">
          <li><kbd>↑</kbd> / <kbd>↓</kbd> - Navigate between items</li>
          <li><kbd>←</kbd> - Collapse group (when focused on group)</li>
          <li><kbd>→</kbd> - Expand group (when focused on group)</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate item or toggle group</li>
          <li><kbd>Home</kbd> - Focus first item</li>
          <li><kbd>End</kbd> - Focus last item</li>
          <li><kbd>Tab</kbd> - Move to next focusable element</li>
        </ul>
      </div>

      <!-- ========================================= -->
      <!-- BASIC NAV WRAPPER -->
      <!-- ========================================= -->

      <!-- Configuration-based Nav (Recommended) -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Configuration-based Nav (Recommended)</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          Simply pass an array of <code>NavNode</code> items - no manual template needed!
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav
              [width]="260"
              [collapsible]="true"
              [isCollapsed]="false"
              [items]="configItems()"
            />
          </div>
        </div>
      </div>

      <!-- Complete Configuration Example with All Item Types -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Complete Configuration with All Item Types</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          Example showcasing all item types: App Item, Navigation Nodes, Section Headers, and
          Dividers in a unified configuration array.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav
              [width]="280"
              [collapsible]="true"
              [isCollapsed]="false"
              [items]="completeConfigItems()"
            />
          </div>
        </div>
      </div>

      <!-- Collapsible Nav Demo -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Collapsible Nav Demo (Click Hamburger to Toggle)</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          In collapsed state, only icons and selection indicators are visible. Text labels are
          hidden.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav
              [width]="260"
              [collapsedWidth]="56"
              [collapsible]="true"
              [isCollapsed]="true"
              [items]="configItems()"
            />
          </div>
        </div>
      </div>

      <!-- Expanded Nav -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nav (Expanded by Default)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="true" [isCollapsed]="false">
              <div style="padding: 20px; text-align: center; color: #0F6CBD;">
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                  Expanded Navigation
                </p>
                <p style="font-size: 12px; opacity: 0.8;">This nav starts in expanded state.</p>
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- Non-Collapsible Nav -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Non-Collapsible Nav</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="false">
              <div style="padding: 20px; text-align: center; color: #0F6CBD;">
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                  Fixed Navigation
                </p>
                <p style="font-size: 12px; opacity: 0.8;">This nav cannot be collapsed.</p>
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- Width Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Width Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Compact (220px)</h3>
            <app-nav [width]="220" [collapsible]="true" [isCollapsed]="false">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Compact Nav
              </div>
            </app-nav>
          </div>
          <div class="showcase__item">
            <h3>Standard (260px)</h3>
            <app-nav [width]="260" [collapsible]="true" [isCollapsed]="false">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Standard Nav
              </div>
            </app-nav>
          </div>
          <div class="showcase__item">
            <h3>Wide (320px)</h3>
            <app-nav [width]="320" [collapsible]="true" [isCollapsed]="false">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Wide Nav
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- Event Logging -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
            <p><strong>Selected Node:</strong> {{ selectedNode() }}</p>
            <p><strong>Nav State:</strong> {{ lastState() || 'N/A' }}</p>
            <p><strong>Hamburger Clicks:</strong> {{ hamburgerClickCount() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NavShowcaseComponent {
  lastState = signal<boolean | null>(null);
  hamburgerClickCount = signal<number>(0);
  lastEvent = signal<string>('None');
  selectedNode = signal<string>('Dashboard');

  // Example configuration-based items with all item types
  configItems = signal<NavNode[]>([
    // Navigation Nodes
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      selected: true,
      onClick: () => this.onNodeClick('Home'),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'folder',
      expanded: true,
      hasChildren: true,
      children: [
        {
          id: 'project-a',
          label: 'Project A',
          icon: 'document',
          onClick: () => this.onSubItemClick('Project A'),
        },
        {
          id: 'project-b',
          label: 'Project B',
          icon: 'document',
          onClick: () => this.onSubItemClick('Project B'),
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'chart',
      onClick: () => this.onNodeClick('Reports'),
    },
    // Section Header
    {
      id: 'admin-header',
      label: 'Administration',
      isSectionHeader: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onClick: () => this.onNodeClick('Settings'),
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'people',
      expanded: false,
      hasChildren: true,
      children: [
        {
          id: 'active-users',
          label: 'Active Users',
          onClick: () => this.onSubItemClick('Active Users'),
        },
        {
          id: 'pending',
          label: 'Pending',
          onClick: () => this.onSubItemClick('Pending'),
        },
      ],
    },
    // Divider
    {
      id: 'divider-1',
      label: '',
      isDivider: true,
    },
    {
      id: 'help',
      label: 'Help',
      icon: 'help',
      onClick: () => this.onNodeClick('Help'),
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'feedback',
      onClick: () => this.onNodeClick('Feedback'),
    },
  ]);

  // Complete configuration example showcasing all features
  completeConfigItems = signal<NavNode[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      selected: true,
      onClick: () => this.onNodeClick('Dashboard'),
    },
    {
      id: 'main-section-header',
      label: 'Main Section',
      isSectionHeader: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'chart',
      expanded: true,
      hasChildren: true,
      children: [
        {
          id: 'overview',
          label: 'Overview',
          onClick: () => this.onSubItemClick('Overview'),
        },
        {
          id: 'reports',
          label: 'Reports',
          selected: true,
          onClick: () => this.onSubItemClick('Reports'),
        },
        {
          id: 'charts',
          label: 'Charts',
          onClick: () => this.onSubItemClick('Charts'),
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'folder',
      expanded: false,
      hasChildren: true,
      children: [
        {
          id: 'active-projects',
          label: 'Active Projects',
          onClick: () => this.onSubItemClick('Active Projects'),
        },
        {
          id: 'archived',
          label: 'Archived',
          onClick: () => this.onSubItemClick('Archived'),
        },
      ],
    },
    {
      id: 'settings-header',
      label: 'Settings',
      isSectionHeader: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person',
      onClick: () => this.onNodeClick('Profile'),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'settings',
      onClick: () => this.onNodeClick('Preferences'),
    },
    {
      id: 'divider-2',
      label: '',
      isDivider: true,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help',
      onClick: () => this.onNodeClick('Help'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'sign_out',
      onClick: () => this.onNodeClick('Logout'),
    },
  ]);

  onNodeClick(label: string): void {
    this.selectedNode.set(label);
    this.lastEvent.set(`Node clicked: ${label}`);
    console.log('Node clicked:', label);
  }

  onSubItemClick(label: string): void {
    this.selectedNode.set(label);
    this.lastEvent.set(`Sub item clicked: ${label}`);
    console.log('Sub item clicked:', label);
  }
}

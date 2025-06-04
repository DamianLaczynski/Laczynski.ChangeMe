import { Component, signal, TemplateRef, viewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentSize } from '../shared';
import { TabsComponent } from './tabs.component';
import {
  TabItem,
  TabsVariant,
  TabsOrientation,
  TabsAlignment,
  createTabItem,
  TabChangeEvent,
  TabCloseEvent,
} from './tabs.model';

// Showcase components
import { ApiDocumentationComponent } from '../showcases/api-documentation/api-documentation.component';
import {
  InteractiveExampleComponent,
  InteractiveExampleConfig,
  createSelectControl,
  createCheckboxControl,
  InteractiveConfigChangeEvent,
} from '../showcases/interactive-example';
import {
  ShowcaseComponent,
  ShowcaseConfig,
  createShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// TABS INTERACTIVE CONFIG TYPE
// =============================================================================

interface TabsInteractiveConfig {
  variant: TabsVariant;
  size: ComponentSize;
  orientation: TabsOrientation;
  alignment: TabsAlignment;
  closable: boolean;
  lazy: boolean;
  scrollable: boolean;
}

/**
 * Tabs Showcase Component
 *
 * Demonstrates all features and configurations of the Tabs component
 * including text content, template content, and various options.
 */
@Component({
  selector: 'ds-tabs-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabsComponent,
    ApiDocumentationComponent,
    InteractiveExampleComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">{{ showcaseConfig().component.description }}</p>
      </div>

      <!-- Interactive Example -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveTabsConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-tabs
          [tabs]="basicTabs"
          [(activeTabId)]="activeBasicTab"
          [variant]="interactiveTabsConfig().variant"
          [size]="interactiveTabsConfig().size"
          [orientation]="interactiveTabsConfig().orientation"
          [alignment]="interactiveTabsConfig().alignment"
          [closable]="interactiveTabsConfig().closable"
          [lazy]="interactiveTabsConfig().lazy"
          [scrollable]="interactiveTabsConfig().scrollable"
          (tabChange)="onTabChange($event)"
          (tabClose)="onTabClose($event)"
        />
      </ds-interactive-example>

      <!-- Text Content Example -->
      <div class="showcase-section">
        <h2>Text Content Tabs</h2>
        <p>Tabs with simple text content:</p>

        <ds-tabs [tabs]="textTabs" [(activeTabId)]="activeTextTab" variant="primary" size="md" />
      </div>

      <!-- Template Content Example -->
      <div class="showcase-section">
        <h2>Template Content Tabs</h2>
        <p>Tabs with complex template content:</p>

        <ds-tabs
          [tabs]="templateTabs"
          [(activeTabId)]="activeTemplateTab"
          variant="secondary"
          size="md"
        />
      </div>

      <!-- Scrollable Tabs Example -->
      <div class="showcase-section">
        <h2>Scrollable Tabs</h2>
        <p>Tabs with many items that require scrolling:</p>

        <ds-tabs
          [tabs]="scrollableTabs"
          [(activeTabId)]="activeScrollableTab"
          size="sm"
          [scrollable]="true"
        />
      </div>

      <!-- Closable Tabs Example -->
      <div class="showcase-section">
        <h2>Closable Tabs</h2>
        <p>Tabs that can be closed by the user:</p>

        <ds-tabs
          [tabs]="closableTabs()"
          [(activeTabId)]="activeClosableTab"
          size="md"
          [closable]="true"
          (tabClose)="removeClosableTab($event)"
        />

        <button type="button" class="add-tab-btn" (click)="addClosableTab()">Add New Tab</button>
      </div>

      <!-- Vertical Tabs Example -->
      <div class="showcase-section">
        <h2>Vertical Tabs</h2>
        <p>Tabs with vertical orientation:</p>

        <ds-tabs
          [tabs]="verticalTabs"
          [(activeTabId)]="activeVerticalTab"
          size="md"
          orientation="vertical"
        />
      </div>

      <!-- Tab States Example -->
      <div class="showcase-section">
        <h2>Tab States</h2>
        <p>Tabs with different states (loading, disabled, badges):</p>

        <ds-tabs [tabs]="stateTabs" [(activeTabId)]="activeStateTab" variant="primary" size="md" />
      </div>

      <!-- API Documentation -->
      <ds-api-documentation [api]="showcaseConfig().api" />

      <!-- Templates for complex content -->
      <ng-template #dashboardTemplate>
        <div class="template-content">
          <h3>Dashboard Overview</h3>
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <h4>Total Users</h4>
              <p class="metric">1,234</p>
            </div>
            <div class="dashboard-card">
              <h4>Revenue</h4>
              <p class="metric">$45,678</p>
            </div>
            <div class="dashboard-card">
              <h4>Orders</h4>
              <p class="metric">567</p>
            </div>
          </div>
        </div>
      </ng-template>

      <ng-template #analyticsTemplate>
        <div class="template-content">
          <h3>Analytics Report</h3>
          <div class="analytics-content">
            <div class="chart-placeholder">
              <p>📊 Chart would go here</p>
            </div>
            <div class="analytics-stats">
              <ul>
                <li>Page Views: 12,345</li>
                <li>Unique Visitors: 8,901</li>
                <li>Bounce Rate: 23.4%</li>
                <li>Avg. Session: 4:32</li>
              </ul>
            </div>
          </div>
        </div>
      </ng-template>

      <ng-template #settingsTemplate>
        <div class="template-content">
          <h3>Settings Panel</h3>
          <div class="settings-form">
            <div class="form-group">
              <label>Theme</label>
              <select>
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
            <div class="form-group">
              <label>Language</label>
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div class="form-group">
              <label> <input type="checkbox" /> Enable notifications </label>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './tabs-showcase.component.scss',
})
export class TabsShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE COMPONENT IMPLEMENTATION
  // =============================================================================

  componentName = 'Tabs Component';
  description =
    'Advanced tabs component with support for text and template content, scrolling, accessibility, and keyboard navigation.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // TEMPLATE REFERENCES
  // =============================================================================

  private dashboardTemplate = viewChild.required<TemplateRef<any>>('dashboardTemplate');
  private analyticsTemplate = viewChild.required<TemplateRef<any>>('analyticsTemplate');
  private settingsTemplate = viewChild.required<TemplateRef<any>>('settingsTemplate');

  // =============================================================================
  // INTERACTIVE CONFIGURATION
  // =============================================================================

  private interactiveTabsConfigSignal = signal<TabsInteractiveConfig>({
    variant: 'primary',
    size: 'md',
    orientation: 'horizontal',
    alignment: 'start',
    closable: false,
    lazy: true,
    scrollable: true,
  });

  readonly interactiveTabsConfig = computed(() => this.interactiveTabsConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Tabs Demo',
    description:
      'Customize the tabs component properties to see how they affect the appearance and behavior.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'default', label: 'Default' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Danger' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createSelectControl('orientation', 'Orientation', 'orientation', [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ]),
      createSelectControl('alignment', 'Alignment', 'alignment', [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'justified', label: 'Justified' },
      ]),
      createCheckboxControl('closable', 'Closable', 'closable', {
        helpText: 'Allow tabs to be closed',
      }),
      createCheckboxControl('lazy', 'Lazy Loading', 'lazy', {
        helpText: 'Load tab content only when active',
      }),
      createCheckboxControl('scrollable', 'Scrollable', 'scrollable', {
        helpText: 'Enable scrolling for overflow tabs',
      }),
    ],
  }));

  // =============================================================================
  // TAB DATA
  // =============================================================================

  // Active tab IDs
  activeBasicTab = 'tab1';
  activeTextTab = 'text1';
  activeTemplateTab = 'dashboard';
  activeScrollableTab = 'scroll1';
  activeClosableTab = 'close1';
  activeVerticalTab = 'vert1';
  activeStateTab = 'state1';

  // Closable tabs state
  private closableTabsState = signal<TabItem[]>([
    createTabItem('close1', 'Home', { content: 'Welcome to the home page!' }),
    createTabItem('close2', 'About', { content: 'Learn more about our company.' }),
    createTabItem('close3', 'Contact', { content: 'Get in touch with us.' }),
  ]);

  private nextClosableTabId = 4;

  // Basic tabs for interactive demo
  basicTabs: TabItem[] = [
    createTabItem('tab1', 'Overview', { content: 'This is the overview tab content.' }),
    createTabItem('tab2', 'Details', { content: 'Here are the detailed information.' }),
    createTabItem('tab3', 'Settings', { content: 'Configure your preferences here.' }),
    createTabItem('tab4', 'Help', { content: 'Find help and documentation.' }),
  ];

  // Text content tabs
  textTabs: TabItem[] = [
    createTabItem('text1', 'Introduction', {
      content:
        'Welcome to our comprehensive guide. This section provides an overview of what you can expect to learn.',
    }),
    createTabItem('text2', 'Getting Started', {
      content: 'Follow these step-by-step instructions to begin your journey with our platform.',
    }),
    createTabItem('text3', 'Advanced Topics', {
      content: 'Dive deeper into advanced features and configurations for power users.',
    }),
    createTabItem('text4', 'Troubleshooting', {
      content: 'Common issues and their solutions to help you resolve problems quickly.',
    }),
  ];

  // Template content tabs
  get templateTabs(): TabItem[] {
    return [
      createTabItem('dashboard', 'Dashboard', { template: this.dashboardTemplate() }),
      createTabItem('analytics', 'Analytics', { template: this.analyticsTemplate() }),
      createTabItem('settings', 'Settings', { template: this.settingsTemplate() }),
    ];
  }

  // Scrollable tabs
  scrollableTabs: TabItem[] = Array.from({ length: 36 }, (_, i) =>
    createTabItem(`scroll${i + 1}`, `Tab ${i + 1}`, {
      content: `This is the content for tab ${i + 1}. It demonstrates scrollable tabs functionality.`,
    }),
  );

  // Closable tabs (computed)
  closableTabs = this.closableTabsState.asReadonly();

  // Vertical tabs
  verticalTabs: TabItem[] = [
    createTabItem('vert1', 'Profile', {
      content: 'Manage your profile information and preferences.',
    }),
    createTabItem('vert2', 'Security', {
      content: 'Configure security settings and two-factor authentication.',
    }),
    createTabItem('vert3', 'Notifications', {
      content: 'Control email and push notification preferences.',
    }),
    createTabItem('vert4', 'Billing', {
      content: 'View billing history and manage payment methods.',
    }),
  ];

  // State tabs (loading, disabled, badges)
  stateTabs: TabItem[] = [
    createTabItem('state1', 'Normal', { content: 'This is a normal tab.' }),
    createTabItem('state2', 'Loading', { content: 'This tab was loading.', loading: true }),
    createTabItem('state3', 'Disabled', { content: 'This tab is disabled.', disabled: true }),
    createTabItem('state4', 'With Badge', { content: 'This tab has a badge.', badge: '3' }),
    createTabItem('state5', 'With Icon', { content: 'This tab has an icon.', icon: '⭐' }),
  ];

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    return createShowcaseConfig(
      {
        componentName: this.componentName,
        description: this.description,
      },
      {
        inputs: [
          {
            name: 'tabs',
            type: 'TabItem[]',
            required: true,
            description: 'Array of tab items to display',
          },
          {
            name: 'activeTabId',
            type: 'string | null',
            required: false,
            defaultValue: 'null',
            description: 'ID of the currently active tab',
          },
          {
            name: 'variant',
            type: 'TabsVariant',
            required: false,
            defaultValue: 'default',
            description: 'Visual variant of the tabs',
          },
          {
            name: 'size',
            type: 'ComponentSize',
            required: false,
            defaultValue: 'md',
            description: 'Size of the tabs',
          },
          {
            name: 'orientation',
            type: 'TabsOrientation',
            required: false,
            defaultValue: 'horizontal',
            description: 'Orientation of the tabs',
          },
          {
            name: 'alignment',
            type: 'TabsAlignment',
            required: false,
            defaultValue: 'start',
            description: 'Alignment of the tabs',
          },
          {
            name: 'closable',
            type: 'boolean',
            required: false,
            defaultValue: 'false',
            description: 'Whether tabs can be closed',
          },
          {
            name: 'lazy',
            type: 'boolean',
            required: false,
            defaultValue: 'false',
            description: 'Whether to use lazy loading for tab content',
          },
          {
            name: 'scrollable',
            type: 'boolean',
            required: false,
            defaultValue: 'true',
            description: 'Whether tabs should be scrollable when overflowing',
          },
          {
            name: 'ariaLabel',
            type: 'string',
            required: false,
            defaultValue: '',
            description: 'ARIA label for the tabs',
          },
        ],
        outputs: [
          {
            name: 'tabChange',
            type: 'TabChangeEvent',
            description: 'Emitted when the active tab changes',
          },
          {
            name: 'tabClose',
            type: 'TabCloseEvent',
            description: 'Emitted when a tab is closed',
          },
          {
            name: 'tabFocus',
            type: 'TabFocusEvent',
            description: 'Emitted when a tab receives or loses focus',
          },
          {
            name: 'tabReorder',
            type: 'TabReorderEvent',
            description: 'Emitted when tabs are reordered (if draggable)',
          },
        ],
      },
    );
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onTabChange(event: TabChangeEvent): void {
    this.lastActionSignal.set(`Tab changed to: ${event.currentTab.label}`);
  }

  onTabClose(event: TabCloseEvent): void {
    this.lastActionSignal.set(`Tab closed: ${event.tab.label}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<TabsInteractiveConfig>): void {
    this.interactiveTabsConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration updated: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // CLOSABLE TABS MANAGEMENT
  // =============================================================================

  removeClosableTab(event: TabCloseEvent): void {
    const currentTabs = this.closableTabsState();
    const updatedTabs = currentTabs.filter(tab => tab.id !== event.tab.id);
    this.closableTabsState.set(updatedTabs);

    // If the closed tab was active, select the first available tab
    if (this.activeClosableTab === event.tab.id && updatedTabs.length > 0) {
      this.activeClosableTab = updatedTabs[0].id;
    }
  }

  addClosableTab(): void {
    const newTab = createTabItem(
      `close${this.nextClosableTabId}`,
      `New Tab ${this.nextClosableTabId}`,
      { content: `This is dynamically added tab ${this.nextClosableTabId}.` },
    );

    const currentTabs = this.closableTabsState();
    this.closableTabsState.set([...currentTabs, newTab]);
    this.nextClosableTabId++;

    // Activate the new tab
    this.activeClosableTab = newTab.id;
  }
}

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DesignSystemNavigation } from '../showcase.model';

/**
 * Design System Layout Component
 *
 * Main layout for the design system with sidebar navigation and content area.
 * Provides responsive navigation and routing between component showcases.
 */
@Component({
  selector: 'ds-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="ds-layout">
      <!-- Sidebar Navigation -->
      <aside class="ds-sidebar" [class.open]="sidebarOpen()">
        <div class="ds-sidebar__header">
          <h2>Design System</h2>
          <button class="ds-sidebar__close" (click)="closeSidebar()" aria-label="Close sidebar">
            ✕
          </button>
        </div>

        <nav class="ds-navigation">
          @for (section of navigationSections(); track section.title) {
            <div class="ds-nav-section">
              <h3>{{ section.title }}</h3>
              @for (item of section.items; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  class="ds-nav-item"
                  [class.implemented]="item.implemented"
                  (click)="onMobile() && closeSidebar()"
                >
                  {{ item.label }}
                  @if (!item.implemented) {
                    <span class="coming-soon">Coming Soon</span>
                  }
                </a>
              }
            </div>
          }
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="ds-content">
        <!-- Mobile Header -->
        <header class="ds-mobile-header">
          <button class="ds-mobile-toggle" (click)="toggleSidebar()" aria-label="Toggle navigation">
            ☰
          </button>
          <h1>{{ currentPageTitle() }}</h1>
        </header>

        <!-- Router Outlet for Showcases -->
        <router-outlet></router-outlet>
      </main>

      <!-- Mobile Overlay -->
      <div
        class="ds-overlay"
        [class.open]="sidebarOpen() && onMobile()"
        (click)="closeSidebar()"
      ></div>
    </div>
  `,
  styleUrl: './ds-layout.component.scss',
})
export class DesignSystemLayoutComponent {
  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Whether sidebar is open on mobile */
  sidebarOpen = signal(false);

  /** Current viewport is mobile */
  onMobile = signal(false);

  // =============================================================================
  // NAVIGATION CONFIGURATION
  // =============================================================================

  private readonly navigation: DesignSystemNavigation = {
    overview: [
      {
        label: 'Overview',
        path: '/design-system/overview',
        category: 'overview',
        implemented: true,
      },
    ],
    actions: [
      {
        label: 'Button',
        path: '/design-system/actions/button',
        category: 'actions',
        implemented: true,
      },
    ],
    forms: [
      {
        label: 'Checkbox',
        path: '/design-system/forms/checkbox',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Input',
        path: '/design-system/forms/input',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Select',
        path: '/design-system/forms/select',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Switch',
        path: '/design-system/forms/switch',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Textarea',
        path: '/design-system/forms/textarea',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Radio',
        path: '/design-system/forms/radio',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Autocomplete',
        path: '/design-system/forms/autocomplete',
        category: 'forms',
        implemented: false,
      },
    ],
    data: [
      {
        label: 'Tree',
        path: '/design-system/data/tree',
        category: 'data',
        implemented: true,
      },
      {
        label: 'Table',
        path: '/design-system/data/table',
        category: 'data',
        implemented: true,
      },
      {
        label: 'List',
        path: '/design-system/data/list',
        category: 'data',
        implemented: false,
      },
    ],
    layout: [
      {
        label: 'Accordion',
        path: '/design-system/layout/accordion',
        category: 'layout',
        implemented: true,
      },
      {
        label: 'Card',
        path: '/design-system/layout/card',
        category: 'layout',
        implemented: false,
      },
      {
        label: 'ScrollPanel',
        path: '/design-system/layout/scrollpanel',
        category: 'layout',
        implemented: true,
      },
      {
        label: 'Splitter',
        path: '/design-system/layout/splitter',
        category: 'layout',
        implemented: true,
      },
      {
        label: 'Tabs',
        path: '/design-system/layout/tabs',
        category: 'layout',
        implemented: true,
      },
    ],
    overlay: [
      {
        label: 'Modal',
        path: '/design-system/overlay/modal',
        category: 'overlay',
        implemented: false,
      },
      {
        label: 'Toast',
        path: '/design-system/overlay/toast',
        category: 'overlay',
        implemented: false,
      },
      {
        label: 'Alert',
        path: '/design-system/overlay/alert',
        category: 'overlay',
        implemented: false,
      },
    ],
    foundation: [
      {
        label: 'Colors',
        path: '/design-system/foundation/colors',
        category: 'foundation',
        implemented: false,
      },
      {
        label: 'Typography',
        path: '/design-system/foundation/typography',
        category: 'foundation',
        implemented: false,
      },
      {
        label: 'Spacing',
        path: '/design-system/foundation/spacing',
        category: 'foundation',
        implemented: false,
      },
    ],
  };

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Navigation sections with titles */
  navigationSections = computed(() => [
    {
      title: 'Overview',
      items: this.navigation['overview'],
    },
    {
      title: 'Actions Components',
      items: this.navigation['actions'],
    },
    {
      title: 'Forms Components',
      items: this.navigation['forms'],
    },
    {
      title: 'Data Components',
      items: this.navigation['data'],
    },
    {
      title: 'Layout Components',
      items: this.navigation['layout'],
    },
    {
      title: 'Overlay Components',
      items: this.navigation['overlay'],
    },
    {
      title: 'Foundation Components',
      items: this.navigation['foundation'],
    },
  ]);

  /** Current page title based on route */
  currentPageTitle = computed(() => {
    // This would be enhanced to get actual route data
    return 'Design System';
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Check mobile viewport
    this.checkMobileViewport();
    window.addEventListener('resize', () => this.checkMobileViewport());
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Toggle sidebar visibility */
  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  /** Close sidebar */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /** Check if viewport is mobile */
  private checkMobileViewport(): void {
    this.onMobile.set(window.innerWidth <= 768);
    if (!this.onMobile()) {
      this.sidebarOpen.set(false);
    }
  }
}

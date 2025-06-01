import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DesignSystemNavigation, DesignSystemNavItem } from '../models/showcase.model';

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
  private readonly router = inject(Router);

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
        implemented: false,
      },
    ],
    ui: [
      {
        label: 'Button',
        path: '/design-system/ui/button',
        category: 'ui',
        implemented: true,
      },
      {
        label: 'Input',
        path: '/design-system/ui/input',
        category: 'ui',
        implemented: true,
      },
      {
        label: 'Select',
        path: '/design-system/ui/select',
        category: 'ui',
        implemented: true,
      },
      {
        label: 'Checkbox',
        path: '/design-system/ui/checkbox',
        category: 'ui',
        implemented: true,
      },
      {
        label: 'Radio',
        path: '/design-system/ui/radio',
        category: 'ui',
        implemented: true,
      },
    ],
    data: [
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
        implemented: true,
      },
      {
        label: 'Card',
        path: '/design-system/data/card',
        category: 'data',
        implemented: true,
      },
    ],
    layout: [
      {
        label: 'Grid',
        path: '/design-system/layout/grid',
        category: 'layout',
        implemented: true,
      },
      {
        label: 'Container',
        path: '/design-system/layout/container',
        category: 'layout',
        implemented: false,
      },
    ],
    feedback: [
      {
        label: 'Modal',
        path: '/design-system/feedback/modal',
        category: 'feedback',
        implemented: false,
      },
      {
        label: 'Toast',
        path: '/design-system/feedback/toast',
        category: 'feedback',
        implemented: false,
      },
      {
        label: 'Alert',
        path: '/design-system/feedback/alert',
        category: 'feedback',
        implemented: false,
      },
    ],
    forms: [
      {
        label: 'Form Field',
        path: '/design-system/forms/form-field',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Form Group',
        path: '/design-system/forms/form-group',
        category: 'forms',
        implemented: true,
      },
      {
        label: 'Validation',
        path: '/design-system/forms/validation',
        category: 'forms',
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
      title: 'UI Components',
      items: this.navigation['ui'],
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
      title: 'Feedback Components',
      items: this.navigation['feedback'],
    },
    {
      title: 'Form Components',
      items: this.navigation['forms'],
    },
    {
      title: 'Foundation',
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

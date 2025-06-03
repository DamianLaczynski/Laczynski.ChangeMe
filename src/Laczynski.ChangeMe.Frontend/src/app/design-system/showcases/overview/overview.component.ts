import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';

/**
 * Overview Component
 *
 * Provides a comprehensive overview of the design system including:
 * - Introduction and philosophy
 * - Getting started guide
 * - Component categories
 * - Design principles
 * - Usage guidelines
 */
@Component({
  selector: 'ds-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="overview">
      <!-- Hero Section -->
      <section class="overview__hero">
        <div class="hero__content">
          <h1 class="hero__title">Laczynski Design System</h1>
          <p class="hero__subtitle">
            A comprehensive collection of reusable components, design tokens, and guidelines for
            building consistent, accessible user interfaces.
          </p>
          <div class="hero__stats">
            <div class="stat">
              <span class="stat__number">{{ componentStats.total }}</span>
              <span class="stat__label">Components</span>
            </div>
            <div class="stat">
              <span class="stat__number">{{ componentStats.implemented }}</span>
              <span class="stat__label">Implemented</span>
            </div>
            <div class="stat">
              <span class="stat__number">{{ componentStats.categories }}</span>
              <span class="stat__label">Categories</span>
            </div>
          </div>
        </div>
        <div class="hero__visual">
          <div class="visual__grid">
            <div class="grid__item grid__item--primary"></div>
            <div class="grid__item grid__item--secondary"></div>
            <div class="grid__item grid__item--accent"></div>
            <div class="grid__item grid__item--muted"></div>
          </div>
        </div>
      </section>

      <!-- Quick Start Section -->
      <section class="overview__section">
        <h2 class="section__title">Quick Start</h2>
        <p class="section__description">
          Jump right in with these essential components and patterns to get started building your
          interface.
        </p>

        <div class="quick-start__grid">
          <div class="quick-start__card">
            <div class="card__icon">
              <app-icon name="sparkles" size="lg" color="primary"></app-icon>
            </div>
            <h3 class="card__title">UI Components</h3>
            <p class="card__description">
              Explore our collection of buttons, inputs, and interactive elements for building
              interfaces.
            </p>
            <a routerLink="/design-system/ui/button" class="card__link">
              Start Exploring
              <span class="link__arrow">→</span>
            </a>
          </div>

          <div class="quick-start__card">
            <div class="card__icon">
              <app-icon name="cog" size="lg" color="primary"></app-icon>
            </div>
            <h3 class="card__title">Layout System</h3>
            <p class="card__description">
              Learn about our responsive grid system and layout components for building interfaces.
            </p>
            <a routerLink="/design-system/layout/grid" class="card__link">
              View Layouts
              <span class="link__arrow">→</span>
            </a>
          </div>

          <div class="quick-start__card">
            <div class="card__icon">
              <app-icon name="clipboard" size="lg" color="primary"></app-icon>
            </div>
            <h3 class="card__title">Form Components</h3>
            <p class="card__description">
              Build forms with our comprehensive collection of input and validation components.
            </p>
            <a routerLink="/design-system/forms/form-field" class="card__link">
              Build Forms
              <span class="link__arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Design Principles Section -->
      <section class="overview__section">
        <h2 class="section__title">Design Principles</h2>
        <p class="section__description">
          Our design system is built on these core principles that guide every component and
          interaction.
        </p>

        <div class="principles__grid">
          <div class="principle">
            <div class="principle__icon">
              <app-icon name="shield" size="lg" color="success"></app-icon>
            </div>
            <h3 class="principle__title">Accessibility First</h3>
            <p class="principle__description">
              Every component is designed with accessibility in mind, following WCAG guidelines and
              supporting keyboard navigation, screen readers, and other assistive technologies.
            </p>
          </div>

          <div class="principle">
            <div class="principle__icon">
              <app-icon name="globe" size="lg" color="info"></app-icon>
            </div>
            <h3 class="principle__title">Responsive Design</h3>
            <p class="principle__description">
              Components adapt seamlessly across all device sizes, from mobile phones to large
              desktop displays, ensuring a consistent experience everywhere.
            </p>
          </div>

          <div class="principle">
            <div class="principle__icon">
              <app-icon name="star" size="lg" color="warning"></app-icon>
            </div>
            <h3 class="principle__title">Consistency</h3>
            <p class="principle__description">
              Standardized patterns, spacing, colors, and interactions create a cohesive experience
              that users can learn once and apply everywhere.
            </p>
          </div>

          <div class="principle">
            <div class="principle__icon">
              <app-icon name="rocket" size="lg" color="accent"></app-icon>
            </div>
            <h3 class="principle__title">Performance</h3>
            <p class="principle__description">
              Lightweight, optimized components that load fast and provide smooth interactions
              without compromising on functionality or visual appeal.
            </p>
          </div>

          <div class="principle">
            <div class="principle__icon">
              <app-icon name="cog" size="lg" color="secondary"></app-icon>
            </div>
            <h3 class="principle__title">Modularity</h3>
            <p class="principle__description">
              Each component is self-contained and composable, allowing for flexible combinations
              and easy maintenance of complex interfaces.
            </p>
          </div>

          <div class="principle">
            <div class="principle__icon">
              <app-icon name="sparkles" size="lg" color="primary"></app-icon>
            </div>
            <h3 class="principle__title">Theming</h3>
            <p class="principle__description">
              Built-in support for multiple themes including dark mode, high contrast, and custom
              brand themes to meet diverse user needs.
            </p>
          </div>
        </div>
      </section>

      <!-- Component Categories Section -->
      <section class="overview__section">
        <h2 class="section__title">Component Categories</h2>
        <p class="section__description">
          Our components are organized into logical categories to help you find what you need
          quickly.
        </p>

        <div class="categories__grid">
          <div class="category">
            <div class="category__header">
              <h3 class="category__title">UI Components</h3>
              <span class="category__count">{{ categories.ui.length }} components</span>
            </div>
            <p class="category__description">
              Basic interactive elements like buttons, inputs, and form controls.
            </p>
            <div class="category__items">
              @for (component of categories.ui; track component.name) {
                <a
                  [routerLink]="component.path"
                  class="category__item"
                  [class.category__item--implemented]="component.implemented"
                >
                  {{ component.name }}
                  @if (!component.implemented) {
                    <span class="item__badge">Soon</span>
                  }
                </a>
              }
            </div>
          </div>

          <div class="category">
            <div class="category__header">
              <h3 class="category__title">Data Components</h3>
              <span class="category__count">{{ categories.data.length }} components</span>
            </div>
            <p class="category__description">
              Components for displaying and managing data like tables, lists, and cards.
            </p>
            <div class="category__items">
              @for (component of categories.data; track component.name) {
                <a
                  [routerLink]="component.path"
                  class="category__item"
                  [class.category__item--implemented]="component.implemented"
                >
                  {{ component.name }}
                  @if (!component.implemented) {
                    <span class="item__badge">Soon</span>
                  }
                </a>
              }
            </div>
          </div>

          <div class="category">
            <div class="category__header">
              <h3 class="category__title">Layout Components</h3>
              <span class="category__count">{{ categories.layout.length }} components</span>
            </div>
            <p class="category__description">
              Structural components for organizing content and creating responsive layouts.
            </p>
            <div class="category__items">
              @for (component of categories.layout; track component.name) {
                <a
                  [routerLink]="component.path"
                  class="category__item"
                  [class.category__item--implemented]="component.implemented"
                >
                  {{ component.name }}
                  @if (!component.implemented) {
                    <span class="item__badge">Soon</span>
                  }
                </a>
              }
            </div>
          </div>

          <div class="category">
            <div class="category__header">
              <h3 class="category__title">Form Components</h3>
              <span class="category__count">{{ categories.forms.length }} components</span>
            </div>
            <p class="category__description">
              Advanced form components for building complex data entry interfaces.
            </p>
            <div class="category__items">
              @for (component of categories.forms; track component.name) {
                <a
                  [routerLink]="component.path"
                  class="category__item"
                  [class.category__item--implemented]="component.implemented"
                >
                  {{ component.name }}
                  @if (!component.implemented) {
                    <span class="item__badge">Soon</span>
                  }
                </a>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Getting Started Section -->
      <section class="overview__section">
        <h2 class="section__title">Getting Started</h2>
        <p class="section__description">
          Follow these steps to start using our design system in your projects.
        </p>

        <div class="getting-started__steps">
          <div class="step">
            <div class="step__number">1</div>
            <div class="step__content">
              <h3 class="step__title">Install Dependencies</h3>
              <p class="step__description">
                Add the necessary dependencies to your project and configure your build system.
              </p>
              <div class="step__code">
                <code>npm install &#64;laczynski/design-system</code>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step__number">2</div>
            <div class="step__content">
              <h3 class="step__title">Import Styles</h3>
              <p class="step__description">
                Import the base styles and design tokens to ensure consistent theming.
              </p>
              <div class="step__code">
                <code>&#64;import '&#64;laczynski/design-system/styles';</code>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step__number">3</div>
            <div class="step__content">
              <h3 class="step__title">Use Components</h3>
              <p class="step__description">
                Import and use components in your templates with full TypeScript support.
              </p>
              <div class="step__code">
                <code>&lt;ds-button variant="primary"&gt;Click me&lt;/ds-button&gt;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Resources Section -->
      <section class="overview__section overview__section--final">
        <h2 class="section__title">Resources & Support</h2>
        <p class="section__description">
          Additional resources to help you make the most of our design system.
        </p>

        <div class="resources__grid">
          <div class="resource">
            <h3 class="resource__title">
              <app-icon name="clipboard" size="sm" style="margin-right: 0.5rem;"></app-icon>
              Documentation
            </h3>
            <p class="resource__description">
              Comprehensive guides, API references, and examples for every component.
            </p>
          </div>

          <div class="resource">
            <h3 class="resource__title">
              <app-icon name="sparkles" size="sm" style="margin-right: 0.5rem;"></app-icon>
              Design Files
            </h3>
            <p class="resource__description">
              Figma libraries and design assets for designers and developers.
            </p>
          </div>

          <div class="resource">
            <h3 class="resource__title">
              <app-icon name="chat" size="sm" style="margin-right: 0.5rem;"></app-icon>
              Community
            </h3>
            <p class="resource__description">
              Join our community for support, discussions, and feature requests.
            </p>
          </div>

          <div class="resource">
            <h3 class="resource__title">
              <app-icon name="cog" size="sm" style="margin-right: 0.5rem;"></app-icon>
              Migration Guide
            </h3>
            <p class="resource__description">
              Step-by-step guides for migrating from other design systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  // =============================================================================
  // COMPONENT DATA
  // =============================================================================

  /** Component statistics */
  componentStats = {
    total: 25,
    implemented: 10,
    categories: 6,
  };

  /** Component categories with their items */
  categories = {
    ui: [
      { name: 'Button', path: '/design-system/ui/button', implemented: true },
      { name: 'Input', path: '/design-system/ui/input', implemented: true },
      { name: 'Select', path: '/design-system/ui/select', implemented: true },
      { name: 'Checkbox', path: '/design-system/ui/checkbox', implemented: true },
      { name: 'Radio', path: '/design-system/ui/radio', implemented: true },
      { name: 'Switch', path: '/design-system/ui/switch', implemented: false },
      { name: 'Slider', path: '/design-system/ui/slider', implemented: false },
    ],
    data: [
      { name: 'Table', path: '/design-system/data/table', implemented: true },
      { name: 'List', path: '/design-system/data/list', implemented: true },
      { name: 'Card', path: '/design-system/data/card', implemented: true },
      { name: 'Tree', path: '/design-system/data/tree', implemented: false },
      { name: 'Timeline', path: '/design-system/data/timeline', implemented: false },
    ],
    layout: [
      { name: 'Grid', path: '/design-system/layout/grid', implemented: true },
      { name: 'Container', path: '/design-system/layout/container', implemented: false },
      { name: 'Stack', path: '/design-system/layout/stack', implemented: false },
      { name: 'Divider', path: '/design-system/layout/divider', implemented: false },
    ],
    forms: [
      { name: 'Form Field', path: '/design-system/forms/form-field', implemented: true },
      { name: 'Form Group', path: '/design-system/forms/form-group', implemented: true },
      { name: 'Validation', path: '/design-system/forms/validation', implemented: false },
      { name: 'File Upload', path: '/design-system/forms/file-upload', implemented: false },
    ],
  };
}

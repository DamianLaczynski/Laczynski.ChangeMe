import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from './button.component';
import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';
import {
  ButtonVariant,
  ButtonSize,
  ButtonClickEvent,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
} from './button.model';

/**
 * Button Component Showcase
 *
 * Demonstrates all button variants, sizes, states, and functionality.
 * Provides interactive examples and complete API documentation.
 */
@Component({
  selector: 'ds-button-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <p>Different visual styles for various use cases and semantic meanings.</p>

        <div class="showcase-grid">
          @for (variant of buttonVariants; track variant.name) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <p>{{ variant.description }}</p>
              <ds-button [variant]="variant.name" [size]="'md'">
                {{ variant.label }} Button
              </ds-button>
            </div>
          }
        </div>
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <p>Different button sizes for various contexts and hierarchies.</p>

        <div class="showcase-grid">
          @for (size of buttonSizes; track size.name) {
            <div class="showcase-item">
              <h3>{{ size.label }} ({{ size.height }}px)</h3>
              <ds-button [variant]="'primary'" [size]="size.name">
                {{ size.label }} Button
              </ds-button>
            </div>
          }
        </div>
      </section>

      <!-- States Section -->
      <section class="showcase-section">
        <h2>States</h2>
        <p>Different button states including disabled, loading, and interactive states.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Normal</h3>
            <ds-button variant="primary">Normal Button</ds-button>
          </div>

          <div class="showcase-item">
            <h3>Disabled</h3>
            <ds-button variant="primary" [disabled]="true"> Disabled Button </ds-button>
          </div>

          <div class="showcase-item">
            <h3>Loading</h3>
            <ds-button variant="primary" [loading]="true"> Loading Button </ds-button>
          </div>

          <div class="showcase-item">
            <h3>With Icons</h3>
            <ds-button variant="primary" iconStart="➕"> Add Item </ds-button>
          </div>

          <div class="showcase-item">
            <h3>Full Width</h3>
            <ds-button variant="primary" [fullWidth]="true"> Full Width Button </ds-button>
          </div>
        </div>
      </section>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>
        <p>Try different configurations and see real-time behavior.</p>

        <div class="showcase-interactive">
          <div class="interactive-controls">
            <div class="control-group">
              <label for="variant-select">Variant:</label>
              <select id="variant-select" [(ngModel)]="selectedVariant" class="control-input">
                @for (variant of buttonVariants; track variant.name) {
                  <option [value]="variant.name">{{ variant.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="size-select">Size:</label>
              <select id="size-select" [(ngModel)]="selectedSize" class="control-input">
                @for (size of buttonSizes; track size.name) {
                  <option [value]="size.name">{{ size.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="isDisabled" />
                Disabled
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="isLoading" />
                Loading
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="isFullWidth" />
                Full Width
              </label>
            </div>

            <div class="control-group">
              <label for="icon-input">Icon:</label>
              <input
                id="icon-input"
                type="text"
                [(ngModel)]="iconText"
                placeholder="➕ 🔗 ⚙️"
                class="control-input"
              />
            </div>
          </div>

          <div class="interactive-preview">
            <ds-button
              [variant]="selectedVariant()"
              [size]="selectedSize()"
              [disabled]="isDisabled()"
              [loading]="isLoading()"
              [fullWidth]="isFullWidth()"
              [iconStart]="iconText() || undefined"
              (clicked)="handleInteractiveClick($event)"
            >
              {{ buttonText() }}
            </ds-button>
          </div>

          <div class="showcase-output">
            @if (lastActionSignal()) {
              {{ lastActionSignal() }}
            }
          </div>
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <div class="showcase-api">
          <!-- Inputs -->
          <div class="api-section">
            <h3>Inputs</h3>
            <ul>
              @for (input of showcaseConfig().api.inputs; track input.name) {
                <li>
                  <code>{{ input.name }}: {{ input.type }}</code>
                  @if (input.defaultValue) {
                    <span class="default-value">= {{ input.defaultValue }}</span>
                  }
                  <p>{{ input.description }}</p>
                </li>
              }
            </ul>
          </div>

          <!-- Outputs -->
          <div class="api-section">
            <h3>Outputs</h3>
            <ul>
              @for (output of showcaseConfig().api.outputs; track output.name) {
                <li>
                  <code>{{ output.name }}: {{ output.type }}</code>
                  <p>{{ output.description }}</p>
                </li>
              }
            </ul>
          </div>

          <!-- Methods -->
          @if (showcaseConfig().api.methods?.length) {
            <div class="api-section">
              <h3>Methods</h3>
              <ul>
                @for (method of showcaseConfig().api.methods; track method.name) {
                  <li>
                    <code>{{ method.signature }}</code>
                    <p>{{ method.description }}</p>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class ButtonShowcaseComponent implements ShowcaseComponent {
  componentName = 'Button Component';
  description =
    'A versatile button component with multiple variants, sizes, and states. Fully accessible with keyboard navigation, loading states, and icon support.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly buttonVariants = Object.values(BUTTON_VARIANTS);
  readonly buttonSizes = Object.values(BUTTON_SIZES);

  // =============================================================================
  // INTERACTIVE CONTROLS
  // =============================================================================

  selectedVariant = signal<ButtonVariant>('primary');
  selectedSize = signal<ButtonSize>('md');
  isDisabled = signal(false);
  isLoading = signal(false);
  isFullWidth = signal(false);
  iconText = signal('');

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  buttonText = computed(() => {
    const variant = this.selectedVariant();
    const size = this.selectedSize();
    return `${variant.charAt(0).toUpperCase() + variant.slice(1)} ${size.toUpperCase()} Button`;
  });

  // =============================================================================
  // SHOWCASE STATE
  // =============================================================================

  protected readonly lastActionSignal = signal<string>('');

  // Getter to implement ShowcaseComponent interface
  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
      lastAction: this.lastAction,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'variant',
          type: 'ButtonVariant',
          defaultValue: 'primary',
          description: 'Visual style variant of the button',
          examples: ['primary', 'secondary', 'danger', 'ghost'],
        },
        {
          name: 'size',
          type: 'ButtonSize',
          defaultValue: 'md',
          description: 'Size of the button',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'type',
          type: 'button | submit | reset',
          defaultValue: 'button',
          description: 'HTML button type attribute',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the button is disabled',
        },
        {
          name: 'loading',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the button is in loading state',
        },
        {
          name: 'iconStart',
          type: 'string',
          description: 'Icon to display at the start of button text',
        },
        {
          name: 'iconEnd',
          type: 'string',
          description: 'Icon to display at the end of button text',
        },
        {
          name: 'fullWidth',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether button should take full width of container',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          description: 'ARIA label for accessibility',
        },
      ],
      outputs: [
        {
          name: 'clicked',
          type: 'ButtonClickEvent',
          description: 'Emitted when button is clicked',
          examples: ['{ event, buttonElement, timestamp }'],
        },
        {
          name: 'focused',
          type: 'FocusEvent',
          description: 'Emitted when button receives focus',
        },
        {
          name: 'blurred',
          type: 'FocusEvent',
          description: 'Emitted when button loses focus',
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the button',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the button',
        },
        {
          name: 'click',
          signature: 'click(): void',
          description: 'Programmatically click the button',
        },
        {
          name: 'getDimensions',
          signature: 'getDimensions(): { width: number; height: number }',
          description: 'Get button element dimensions',
          returnType: '{ width: number; height: number }',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  handleInteractiveClick(event: ButtonClickEvent): void {
    const timestamp = new Date().toLocaleTimeString();
    const variant = this.selectedVariant();
    const size = this.selectedSize();

    this.lastActionSignal.set(
      `Button clicked at ${timestamp} - Variant: ${variant}, Size: ${size}`,
    );
  }
}

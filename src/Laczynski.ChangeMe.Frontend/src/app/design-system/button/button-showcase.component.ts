import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from './button.component';
import { ComponentVariant, ComponentSize } from '../shared';

import { ButtonClickEvent, BUTTON_VARIANTS, BUTTON_SIZES } from './button.model';
import {
  createCheckboxControl,
  createSizeControl,
  createTextControl,
  createVariantControl,
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import {
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseComponent,
  ShowcaseConfig,
} from '../showcases/showcase.model';
import { ApiDocumentationComponent } from '../showcases/api-documentation';

// =============================================================================
// BUTTON INTERACTIVE CONFIG TYPE
// =============================================================================

interface ButtonInteractiveConfig {
  variant: ComponentVariant;
  size: ComponentSize;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  icon: string;
}

/**
 * Button Component Showcase
 *
 * Demonstrates all button variants, sizes, states, and functionality.
 * Provides interactive examples and complete API documentation.
 */
@Component({
  selector: 'ds-button-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ApiDocumentationComponent,
    InteractiveExampleComponent,
  ],
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
              <ds-button
                [variant]="variant.name"
                [size]="'md'"
                (clicked)="handleVariantClick(variant.name)"
              >
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
              <ds-button
                [variant]="'primary'"
                [size]="size.name"
                (clicked)="handleSizeClick(size.name)"
              >
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

      <!-- Interactive Example using new component -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveButtonConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-button
          [variant]="interactiveButtonConfig().variant"
          [size]="interactiveButtonConfig().size"
          [disabled]="interactiveButtonConfig().disabled"
          [loading]="interactiveButtonConfig().loading"
          [fullWidth]="interactiveButtonConfig().fullWidth"
          [iconStart]="interactiveButtonConfig().icon || ''"
          (clicked)="handleInteractiveClick($event)"
        >
          {{ buttonText() }}
        </ds-button>
      </ds-interactive-example>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
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
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveButtonConfigSignal = signal<ButtonInteractiveConfig>({
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    icon: '',
  });

  readonly interactiveButtonConfig = computed(() => this.interactiveButtonConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Button Configuration',
    description: 'Try different configurations and see real-time behavior.',
    showOutput: true,
    controls: [
      createVariantControl(
        this.buttonVariants.map(v => ({ value: v.name, label: v.label })),
        'variant',
      ),
      createSizeControl(
        this.buttonSizes.map(s => ({ value: s.name, label: s.label })),
        'size',
      ),
      createCheckboxControl('disabled-control', 'Disabled', 'disabled'),
      createCheckboxControl('loading-control', 'Loading', 'loading'),
      createCheckboxControl('fullwidth-control', 'Full Width', 'fullWidth'),
      createTextControl('icon-control', 'Icon', 'icon', {
        placeholder: '➕ 🔗 ⚙️',
        helpText: 'Enter an emoji or icon character',
      }),
    ],
  }));

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  buttonText = computed(() => {
    const config = this.interactiveButtonConfig();
    const variant = config.variant;
    const size = config.size;
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
          required: false,
          description: 'Visual style variant of the button',
          examples: ['primary', 'secondary', 'danger', 'ghost'],
        },
        {
          name: 'size',
          type: 'ButtonSize',
          defaultValue: 'md',
          required: false,
          description: 'Size of the button',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'type',
          type: 'button | submit | reset',
          defaultValue: 'button',
          required: false,
          description: 'HTML button type attribute',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the button is disabled',
        },
        {
          name: 'loading',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the button is in loading state',
        },
        {
          name: 'iconStart',
          type: 'string',
          required: false,
          description: 'Icon to display at the start of button text',
        },
        {
          name: 'iconEnd',
          type: 'string',
          required: false,
          description: 'Icon to display at the end of button text',
        },
        {
          name: 'fullWidth',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether button should take full width of container',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          required: false,
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

  handleVariantClick(variant: ComponentVariant): void {
    this.interactiveButtonConfigSignal.update(config => ({ ...config, variant }));
    this.lastActionSignal.set(`Clicked ${variant} variant button`);
  }

  handleSizeClick(size: ComponentSize): void {
    this.interactiveButtonConfigSignal.update(config => ({ ...config, size }));
    this.lastActionSignal.set(`Clicked ${size} size button`);
  }

  handleInteractiveClick(event: ButtonClickEvent): void {
    const timestamp = new Date().toLocaleTimeString();
    const variant = this.interactiveButtonConfig().variant;
    const size = this.interactiveButtonConfig().size;

    this.lastActionSignal.set(
      `Button clicked at ${timestamp} - Variant: ${variant}, Size: ${size}`,
    );
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<ButtonInteractiveConfig>): void {
    this.interactiveButtonConfigSignal.set(event.config);

    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Configuration changed at ${timestamp} - ${event.property}: ${event.value}`,
    );
  }
}

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RadioComponent } from './radio.component';
import { ApiDocumentationComponent, InteractiveExampleComponent } from '../../shared/components';
import {
  InteractiveExampleConfig,
  InteractiveConfigChangeEvent,
  createSelectControl,
  createTextControl,
  createCheckboxControl,
} from '../../shared/components/interactive-example/interactive-example.model';

import {
  RadioOption,
  RadioVariant,
  RadioSize,
  RadioGroupLayout,
  RadioChangeEvent,
  RadioFocusEvent,
  createRadioOption,
} from './radio.model';
import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

// =============================================================================
// RADIO INTERACTIVE CONFIG TYPE
// =============================================================================

interface RadioInteractiveConfig {
  variant: RadioVariant;
  size: RadioSize;
  label: string;
  helperText: string;
  disabled: boolean;
  required: boolean;
  groupLayout: RadioGroupLayout;
  value: string | null;
}

/**
 * Radio Component Showcase
 *
 * Demonstrates all variants, states, and features of the Radio component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'radio-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioComponent,
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

      <!-- Interactive Example using new component -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveRadioConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-radio
          [variant]="interactiveRadioConfig().variant"
          [size]="interactiveRadioConfig().size"
          [label]="interactiveRadioConfig().label"
          [helperText]="interactiveRadioConfig().helperText"
          [disabled]="interactiveRadioConfig().disabled"
          [required]="interactiveRadioConfig().required"
          [groupLayout]="interactiveRadioConfig().groupLayout"
          [value]="interactiveRadioConfig().value"
          [options]="demoOptions()"
          (selectionChange)="onSelectionChange($event)"
          (focus)="onFocus($event)"
        />
      </ds-interactive-example>

      <!-- Basic Radio Groups Section -->
      <section class="showcase-section">
        <h2>Basic Radio Groups</h2>

        <!-- Variants -->
        <div class="showcase-subsection">
          <h3>Variants</h3>
          <div class="showcase-grid">
            @for (variant of radioVariants; track variant) {
              <div class="showcase-item">
                <h4>{{ variant | titlecase }}</h4>
                <ds-radio
                  [variant]="variant"
                  label="Choose Option"
                  [options]="basicOptions"
                  [value]="null"
                  size="md"
                />
              </div>
            }
          </div>
        </div>

        <!-- Sizes -->
        <div class="showcase-subsection">
          <h3>Sizes</h3>
          <div class="showcase-grid">
            @for (size of radioSizes; track size) {
              <div class="showcase-item">
                <h4>{{ getSizeLabel(size) }}</h4>
                <ds-radio
                  variant="default"
                  [label]="getSizeLabel(size)"
                  [options]="basicOptions"
                  [value]="null"
                  [size]="size"
                />
              </div>
            }
          </div>
        </div>

        <!-- States -->
        <div class="showcase-subsection">
          <h3>States</h3>
          <div class="showcase-grid">
            <!-- Default -->
            <div class="showcase-item">
              <h4>Default</h4>
              <ds-radio
                label="Default Radio Group"
                [options]="basicOptions"
                [value]="null"
                size="md"
              />
            </div>

            <!-- With Selection -->
            <div class="showcase-item">
              <h4>With Selection</h4>
              <ds-radio
                label="Radio with Selection"
                [options]="basicOptions"
                [value]="'option1'"
                size="md"
              />
            </div>

            <!-- Required -->
            <div class="showcase-item">
              <h4>Required</h4>
              <ds-radio
                label="Required Radio Group"
                [options]="basicOptions"
                [value]="null"
                [required]="true"
                size="md"
              />
            </div>

            <!-- Disabled -->
            <div class="showcase-item">
              <h4>Disabled</h4>
              <ds-radio
                label="Disabled Radio Group"
                [options]="basicOptions"
                [value]="null"
                [disabled]="true"
                size="md"
              />
            </div>

            <!-- Disabled with Selection -->
            <div class="showcase-item">
              <h4>Disabled with Selection</h4>
              <ds-radio
                label="Disabled with Selection"
                [options]="basicOptions"
                [value]="'option2'"
                [disabled]="true"
                size="md"
              />
            </div>

            <!-- With Helper Text -->
            <div class="showcase-item">
              <h4>With Helper Text</h4>
              <ds-radio
                label="Radio with Help"
                helperText="Choose one option from the list"
                [options]="basicOptions"
                [value]="null"
                size="md"
              />
            </div>

            <!-- Mixed Disabled Options -->
            <div class="showcase-item">
              <h4>Mixed Disabled Options</h4>
              <ds-radio
                label="Some Options Disabled"
                [options]="mixedDisabledOptions"
                [value]="null"
                size="md"
              />
            </div>

            <!-- No Label -->
            <div class="showcase-item">
              <h4>No Label</h4>
              <ds-radio [options]="basicOptions" [value]="null" size="md" />
            </div>
          </div>
        </div>
      </section>

      <!-- Group Layouts Section -->
      <section class="showcase-section">
        <h2>Group Layouts</h2>

        <div class="layout-demo">
          <h3>Vertical Layout (Default)</h3>
          <ds-radio
            label="Vertical Options"
            [options]="layoutOptions"
            [value]="null"
            groupLayout="vertical"
          />
        </div>

        <div class="layout-demo">
          <h3>Horizontal Layout</h3>
          <ds-radio
            label="Horizontal Options"
            [options]="layoutOptions"
            [value]="null"
            groupLayout="horizontal"
          />
        </div>

        <div class="layout-demo">
          <h3>Grid Layout</h3>
          <ds-radio
            label="Grid Options"
            [options]="gridOptions"
            [value]="null"
            groupLayout="grid"
          />
        </div>
      </section>

      <!-- Options with Descriptions Section -->
      <section class="showcase-section">
        <h2>Options with Descriptions</h2>

        <div class="showcase-subsection">
          <h3>Detailed Options</h3>
          <ds-radio
            label="Select Subscription Plan"
            [options]="subscriptionOptions"
            [value]="null"
            groupLayout="vertical"
          />
        </div>

        <div class="showcase-subsection">
          <h3>Feature Selection</h3>
          <ds-radio
            label="Choose Deployment Environment"
            [options]="environmentOptions"
            [value]="null"
            groupLayout="vertical"
          />
        </div>
      </section>

      <!-- Real-world Examples Section -->
      <section class="showcase-section">
        <h2>Real-world Examples</h2>

        <div class="showcase-subsection">
          <h3>Payment Method Selection</h3>
          <ds-radio
            label="Select Payment Method"
            [options]="paymentOptions"
            [value]="null"
            groupLayout="vertical"
            helperText="Choose your preferred payment method"
          />
        </div>

        <div class="showcase-subsection">
          <h3>Shipping Options</h3>
          <ds-radio
            label="Shipping Method"
            [options]="shippingOptions"
            [value]="null"
            groupLayout="vertical"
            [required]="true"
          />
        </div>

        <div class="showcase-subsection">
          <h3>Theme Selection</h3>
          <ds-radio
            label="Application Theme"
            [options]="themeOptions"
            [value]="'light'"
            groupLayout="horizontal"
          />
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class RadioShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Radio Component';
  description =
    'Radio button component for single selection from multiple options. Supports groups, variants, and accessibility features.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO CONFIGURATION
  // =============================================================================

  radioVariants: RadioVariant[] = ['default', 'filled', 'outlined'];
  radioSizes: RadioSize[] = ['sm', 'md', 'lg'];
  groupLayouts: RadioGroupLayout[] = ['vertical', 'horizontal', 'grid'];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveRadioConfigSignal = signal<RadioInteractiveConfig>({
    variant: 'default',
    size: 'md',
    label: 'Demo Radio Group',
    helperText: '',
    disabled: false,
    required: false,
    groupLayout: 'vertical',
    value: null,
  });

  readonly interactiveRadioConfig = computed(() => this.interactiveRadioConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Radio Example',
    description: 'Customize the radio group properties using the controls below.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'default', label: 'Default' },
        { value: 'filled', label: 'Filled' },
        { value: 'outlined', label: 'Outlined' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createSelectControl('groupLayout', 'Layout', 'groupLayout', [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'grid', label: 'Grid' },
      ]),
      createTextControl('label', 'Label', 'label', { placeholder: 'Enter label...' }),
      createTextControl('helperText', 'Helper Text', 'helperText', {
        placeholder: 'Enter helper text...',
      }),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('required', 'Required', 'required'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // LEGACY DEMO CONFIG (keeping for backward compatibility)
  // =============================================================================

  demoConfigVariant = signal<RadioVariant>('default');
  demoConfigSize = signal<RadioSize>('md');
  demoConfigLabel = signal<string>('Demo Radio Group');
  demoConfigHelperText = signal<string>('');
  demoConfigDisabled = signal<boolean>(false);
  demoConfigRequired = signal<boolean>(false);
  demoConfigGroupLayout = signal<RadioGroupLayout>('vertical');

  demoValue = signal<string | null>(null);

  // Computed properties for two-way binding with ngModel
  get demoConfigVariantValue(): RadioVariant {
    return this.demoConfigVariant();
  }
  set demoConfigVariantValue(value: RadioVariant) {
    this.demoConfigVariant.set(value);
  }

  get demoConfigSizeValue(): RadioSize {
    return this.demoConfigSize();
  }
  set demoConfigSizeValue(value: RadioSize) {
    this.demoConfigSize.set(value);
  }

  get demoConfigLabelValue(): string {
    return this.demoConfigLabel();
  }
  set demoConfigLabelValue(value: string) {
    this.demoConfigLabel.set(value);
  }

  get demoConfigHelperTextValue(): string {
    return this.demoConfigHelperText();
  }
  set demoConfigHelperTextValue(value: string) {
    this.demoConfigHelperText.set(value);
  }

  get demoConfigDisabledValue(): boolean {
    return this.demoConfigDisabled();
  }
  set demoConfigDisabledValue(value: boolean) {
    this.demoConfigDisabled.set(value);
  }

  get demoConfigRequiredValue(): boolean {
    return this.demoConfigRequired();
  }
  set demoConfigRequiredValue(value: boolean) {
    this.demoConfigRequired.set(value);
  }

  get demoConfigGroupLayoutValue(): RadioGroupLayout {
    return this.demoConfigGroupLayout();
  }
  set demoConfigGroupLayoutValue(value: RadioGroupLayout) {
    this.demoConfigGroupLayout.set(value);
  }

  // Computed demo options
  demoOptions = computed(() => this.basicOptions);

  // =============================================================================
  // SAMPLE DATA
  // =============================================================================

  basicOptions: RadioOption[] = [
    createRadioOption('option1', 'Option 1'),
    createRadioOption('option2', 'Option 2'),
    createRadioOption('option3', 'Option 3'),
  ];

  mixedDisabledOptions: RadioOption[] = [
    createRadioOption('available1', 'Available Option'),
    createRadioOption('disabled1', 'Disabled Option', { disabled: true }),
    createRadioOption('available2', 'Another Available'),
    createRadioOption('disabled2', 'Another Disabled', { disabled: true }),
  ];

  layoutOptions: RadioOption[] = [
    createRadioOption('layout1', 'Layout Option 1'),
    createRadioOption('layout2', 'Layout Option 2'),
    createRadioOption('layout3', 'Layout Option 3'),
  ];

  gridOptions: RadioOption[] = [
    createRadioOption('grid1', 'Grid Item 1'),
    createRadioOption('grid2', 'Grid Item 2'),
    createRadioOption('grid3', 'Grid Item 3'),
    createRadioOption('grid4', 'Grid Item 4'),
    createRadioOption('grid5', 'Grid Item 5'),
    createRadioOption('grid6', 'Grid Item 6'),
  ];

  subscriptionOptions: RadioOption[] = [
    createRadioOption('free', 'Free Plan', {
      description: 'Basic features for personal use, up to 5 projects',
    }),
    createRadioOption('pro', 'Pro Plan', {
      description: 'Advanced features for professionals, unlimited projects',
    }),
    createRadioOption('enterprise', 'Enterprise Plan', {
      description: 'Full feature set with priority support and custom integrations',
    }),
  ];

  environmentOptions: RadioOption[] = [
    createRadioOption('development', 'Development', {
      description: 'For testing and development purposes',
    }),
    createRadioOption('staging', 'Staging', {
      description: 'Pre-production environment for final testing',
    }),
    createRadioOption('production', 'Production', {
      description: 'Live environment for end users',
    }),
  ];

  paymentOptions: RadioOption[] = [
    createRadioOption('credit-card', 'Credit Card', {
      description: 'Pay with Visa, MasterCard, or American Express',
    }),
    createRadioOption('paypal', 'PayPal', {
      description: 'Secure payment through your PayPal account',
    }),
    createRadioOption('bank-transfer', 'Bank Transfer', {
      description: 'Direct transfer from your bank account',
    }),
    createRadioOption('crypto', 'Cryptocurrency', {
      description: 'Pay with Bitcoin, Ethereum, or other supported cryptocurrencies',
      disabled: true,
    }),
  ];

  shippingOptions: RadioOption[] = [
    createRadioOption('standard', 'Standard Shipping (5-7 days)', {
      description: 'Free shipping for orders over $50',
    }),
    createRadioOption('express', 'Express Shipping (2-3 days)', {
      description: 'Fast delivery with tracking - $9.99',
    }),
    createRadioOption('overnight', 'Overnight Shipping', {
      description: 'Next business day delivery - $24.99',
    }),
  ];

  themeOptions: RadioOption[] = [
    createRadioOption('light', 'Light Theme'),
    createRadioOption('dark', 'Dark Theme'),
    createRadioOption('auto', 'Auto (System)'),
  ];

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
          type: 'RadioVariant',
          defaultValue: "'default'",
          required: false,
          description: 'Visual style variant of the radio',
          examples: ['default', 'filled', 'outlined'],
        },
        {
          name: 'size',
          type: 'RadioSize',
          defaultValue: "'md'",
          required: false,
          description: 'Size of the radio button',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Name attribute for radio group',
        },
        {
          name: 'value',
          type: 'any',
          required: false,
          description: 'Selected value from radio group',
        },
        {
          name: 'options',
          type: 'RadioOption[]',
          defaultValue: '[]',
          required: false,
          description: 'Array of radio options',
        },
        {
          name: 'groupLayout',
          type: 'RadioGroupLayout',
          defaultValue: "'vertical'",
          required: false,
          description: 'Layout for radio group',
          examples: ['vertical', 'horizontal', 'grid'],
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the radio group is disabled',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the radio group is required',
        },
        {
          name: 'helperText',
          type: 'string',
          required: false,
          description: 'Helper text to display below the radio group',
        },
        {
          name: 'label',
          type: 'string',
          required: false,
          description: 'Label for the radio group',
        },
      ],
      outputs: [
        {
          name: 'valueChange',
          type: 'RadioChangeEvent',
          description: 'Emitted when radio selection changes',
          examples: ['{ value, option, radioElement, originalEvent }'],
        },
        {
          name: 'focused',
          type: 'RadioFocusEvent',
          description: 'Emitted when radio receives focus',
        },
        {
          name: 'blurred',
          type: 'RadioFocusEvent',
          description: 'Emitted when radio loses focus',
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the first radio button',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the focused radio button',
        },
        {
          name: 'selectOption',
          signature: 'selectOption(value: any): void',
          description: 'Programmatically select an option by value',
        },
        {
          name: 'clearSelection',
          signature: 'clearSelection(): void',
          description: 'Clear the current selection',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onSelectionChange(event: RadioChangeEvent): void {
    const option = event.option;
    this.lastActionSignal.set(
      `Selected: "${option.label}" (value: ${event.value}, previous: ${event.previousValue})`,
    );
  }

  onFocus(event: RadioFocusEvent): void {
    this.lastActionSignal.set(`Radio ${event.direction === 'in' ? 'focused' : 'blurred'}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<RadioInteractiveConfig>): void {
    this.interactiveRadioConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration changed: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSizeLabel(size: RadioSize): string {
    return `${size.toUpperCase()} Size`;
  }
}

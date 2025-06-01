import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RadioComponent } from './radio.component';
import {
  RadioOption,
  RadioVariant,
  RadioSize,
  RadioGroupLayout,
  RadioChangeEvent,
  RadioFocusEvent,
  createRadioOption,
} from './radio.model';
import { ShowcaseComponent, ComponentApiDocumentation } from '../../models/showcase.model';

/**
 * Radio Component Showcase
 *
 * Demonstrates all variants, states, and features of the Radio component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'radio-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, RadioComponent],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ componentName }}</h1>
        <p class="showcase-description">{{ description }}</p>
      </div>

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

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>

        <div class="interactive-controls">
          <div class="control-group">
            <label>
              Variant:
              <select [(ngModel)]="demoConfigVariantValue" class="control-input">
                @for (variant of radioVariants; track variant) {
                  <option [value]="variant">{{ variant | titlecase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Size:
              <select [(ngModel)]="demoConfigSizeValue" class="control-input">
                @for (size of radioSizes; track size) {
                  <option [value]="size">{{ size | uppercase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Layout:
              <select [(ngModel)]="demoConfigGroupLayoutValue" class="control-input">
                @for (layout of groupLayouts; track layout) {
                  <option [value]="layout">{{ layout | titlecase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Label:
              <input
                type="text"
                [(ngModel)]="demoConfigLabelValue"
                class="control-input"
                placeholder="Enter label..."
              />
            </label>
          </div>

          <div class="control-group">
            <label>
              Helper Text:
              <input
                type="text"
                [(ngModel)]="demoConfigHelperTextValue"
                class="control-input"
                placeholder="Enter helper text..."
              />
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigDisabledValue" />
              Disabled
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigRequiredValue" />
              Required
            </label>
          </div>
        </div>

        <div class="interactive-preview">
          <ds-radio
            [variant]="demoConfigVariant()"
            [size]="demoConfigSize()"
            [label]="demoConfigLabel()"
            [helperText]="demoConfigHelperText()"
            [disabled]="demoConfigDisabled()"
            [required]="demoConfigRequired()"
            [options]="demoOptions()"
            [groupLayout]="demoConfigGroupLayout()"
            [value]="demoValue()"
            (selectionChange)="onSelectionChange($event)"
            (focus)="onFocus($event)"
          />
        </div>

        <div class="showcase-output">
          {{ lastAction || 'Interact with the radio group above to see events...' }}
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>

        <div class="showcase-api">
          <h3>Inputs</h3>
          <ul>
            @for (input of apiDocumentation.inputs; track input.name) {
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

        <div class="showcase-api">
          <h3>Outputs</h3>
          <ul>
            @for (output of apiDocumentation.outputs; track output.name) {
              <li>
                <code>{{ output.name }}: {{ output.type }}</code>
                <p>{{ output.description }}</p>
              </li>
            }
          </ul>
        </div>

        <div class="showcase-api">
          <h3>Methods</h3>
          <ul>
            @for (method of apiDocumentation.methods || []; track method.name) {
              <li>
                <code>{{ method.signature }}</code>
                <p>{{ method.description }}</p>
              </li>
            }
          </ul>
        </div>
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
    'Radio button group component for single selection from a list of options. Built with Angular Signals API and comprehensive accessibility support including keyboard navigation.';

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

  // Individual signals for demo configuration
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
  // API DOCUMENTATION
  // =============================================================================

  apiDocumentation: ComponentApiDocumentation = {
    inputs: [
      {
        name: 'variant',
        type: 'RadioVariant',
        defaultValue: "'default'",
        description: 'Radio variant (default, filled, outlined)',
        examples: ['default', 'filled', 'outlined'],
      },
      {
        name: 'size',
        type: 'RadioSize',
        defaultValue: "'md'",
        description: 'Radio size variant',
        examples: ['sm', 'md', 'lg'],
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Radio group label text',
      },
      {
        name: 'value',
        type: 'T | null',
        defaultValue: 'null',
        description: 'Selected value - two-way binding',
      },
      {
        name: 'options',
        type: 'RadioOption<T>[]',
        defaultValue: '[]',
        description: 'Array of radio options to display',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether radio group is disabled',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether radio group is required',
      },
      {
        name: 'groupLayout',
        type: 'RadioGroupLayout',
        defaultValue: "'vertical'",
        description: 'Layout for radio group',
        examples: ['vertical', 'horizontal', 'grid'],
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Helper text shown below radio group',
      },
      {
        name: 'name',
        type: 'string',
        defaultValue: "''",
        description: 'Group name for radio inputs',
      },
    ],
    outputs: [
      {
        name: 'selectionChange',
        type: 'EventEmitter<RadioChangeEvent<T>>',
        description: 'Emitted when radio selection changes',
        examples: ['(selectionChange)="onSelectionChange($event)"'],
      },
      {
        name: 'focus',
        type: 'EventEmitter<RadioFocusEvent>',
        description: 'Emitted when radio gains or loses focus',
        examples: ['(focus)="onFocus($event)"'],
      },
    ],
    methods: [
      {
        name: 'clear',
        signature: 'clear(): void',
        description: 'Clear current selection',
      },
      {
        name: 'selectByValue',
        signature: 'selectByValue(value: T): void',
        description: 'Select option by value',
      },
      {
        name: 'focusGroup',
        signature: 'focusGroup(): void',
        description: 'Focus the radio group',
      },
      {
        name: 'getValidationState',
        signature: 'getValidationState(): RadioValidation',
        description: 'Get current validation state',
      },
      {
        name: 'getSelectedOption',
        signature: 'getSelectedOption(): RadioOption<T> | null',
        description: 'Get currently selected option',
      },
    ],
  };

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
    this.lastActionSignal.set(
      `Radio ${event.direction === 'in' ? 'focused' : 'blurred'} ${event.value ? `(${event.value})` : ''}`,
    );
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSizeLabel(size: RadioSize): string {
    return `${size.toUpperCase()} Size`;
  }
}

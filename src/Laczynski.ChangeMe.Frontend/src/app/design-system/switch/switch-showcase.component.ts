import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SwitchComponent } from './switch.component';
import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import {
  createCheckboxControl,
  createSelectControl,
  createTextControl,
} from '../showcases/interactive-example';
import { ComponentSize } from '../shared';

import {
  SwitchConfig,
  SwitchVariant,
  SwitchState,
  SwitchChangeEvent,
  SwitchFocusEvent,
  SwitchKeyboardEvent,
  createSwitchConfig,
  getSwitchSizeLabel,
  getSwitchVariantLabel,
} from './switch.model';
import {
  ShowcaseComponent,
  createShowcaseConfig,
  ComponentApiDocumentation,
  ShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// SWITCH INTERACTIVE CONFIG TYPE
// =============================================================================

interface SwitchInteractiveConfig {
  size: ComponentSize;
  variant: SwitchVariant;
  label: string;
  helperText: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  value: boolean;
}

/**
 * Switch Component Showcase
 *
 * Demonstrates all variants, states, and features of the Switch component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'switch-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SwitchComponent,
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
        [currentConfig]="interactiveSwitchConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-switch
          [size]="interactiveSwitchConfig().size"
          [variant]="interactiveSwitchConfig().variant"
          [label]="interactiveSwitchConfig().label"
          [helperText]="interactiveSwitchConfig().helperText"
          [disabled]="interactiveSwitchConfig().disabled"
          [readonly]="interactiveSwitchConfig().readonly"
          [required]="interactiveSwitchConfig().required"
          [value]="interactiveSwitchConfig().value"
          (checkedChange)="onCheckedChange($event)"
          (focusChange)="onFocusChange($event)"
          (keyboardEvent)="onKeyboardEvent($event)"
        />
      </ds-interactive-example>

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          @for (variant of switchVariants; track variant) {
            <div class="showcase-item">
              <h3>{{ getSwitchVariantLabel(variant) }}</h3>
              <ds-switch
                [variant]="variant"
                [label]="getSwitchVariantLabel(variant) + ' Switch'"
                [value]="true"
                size="md"
              />
            </div>
          }
        </div>
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          @for (size of switchSizes; track size) {
            <div class="showcase-item">
              <h3>{{ getSwitchSizeLabel(size) }}</h3>
              <ds-switch
                [size]="size"
                [label]="getSwitchSizeLabel(size) + ' Switch'"
                [value]="true"
                variant="default"
              />
            </div>
          }
        </div>
      </section>

      <!-- States Section -->
      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <!-- Default -->
          <div class="showcase-item">
            <h3>Default (Off)</h3>
            <ds-switch label="Default Switch" [value]="false" size="md" variant="default" />
          </div>

          <!-- Checked -->
          <div class="showcase-item">
            <h3>Checked (On)</h3>
            <ds-switch label="Checked Switch" [value]="true" size="md" variant="default" />
          </div>

          <!-- Disabled Off -->
          <div class="showcase-item">
            <h3>Disabled (Off)</h3>
            <ds-switch
              label="Disabled Switch"
              [value]="false"
              [disabled]="true"
              size="md"
              variant="default"
            />
          </div>

          <!-- Disabled On -->
          <div class="showcase-item">
            <h3>Disabled (On)</h3>
            <ds-switch
              label="Disabled Switch"
              [value]="true"
              [disabled]="true"
              size="md"
              variant="default"
            />
          </div>

          <!-- Readonly -->
          <div class="showcase-item">
            <h3>Readonly</h3>
            <ds-switch
              label="Readonly Switch"
              [value]="true"
              [readonly]="true"
              size="md"
              variant="default"
            />
          </div>

          <!-- Required -->
          <div class="showcase-item">
            <h3>Required</h3>
            <ds-switch
              label="Required Switch"
              [value]="false"
              [required]="true"
              size="md"
              variant="default"
            />
          </div>

          <!-- With Helper Text -->
          <div class="showcase-item">
            <h3>With Helper Text</h3>
            <ds-switch
              label="Switch with Help"
              helperText="This switch has helper text"
              [value]="false"
              size="md"
              variant="default"
            />
          </div>

          <!-- Error State -->
          <div class="showcase-item">
            <h3>Error State</h3>
            <ds-switch
              label="Error Switch"
              helperText="This switch has an error"
              [value]="false"
              size="md"
              variant="default"
            />
          </div>
        </div>
      </section>

      <!-- API Documentation -->
      <ds-api-documentation [api]="showcaseConfig().api" />
    </div>
  `,
  styles: [
    `
      @use '../showcases/showcase.scss';

      .showcase-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    `,
  ],
})
export class SwitchShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE COMPONENT INTERFACE
  // =============================================================================

  componentName = 'Switch Component';
  description =
    'A toggle switch component that provides an alternative to checkboxes for boolean values with better visual feedback.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // COMPONENT DATA
  // =============================================================================

  switchSizes: ComponentSize[] = ['sm', 'md', 'lg'];
  switchVariants: SwitchVariant[] = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
  ];

  // =============================================================================
  // INTERACTIVE CONFIGURATION
  // =============================================================================

  private interactiveSwitchConfigSignal = signal<SwitchInteractiveConfig>({
    size: 'md',
    variant: 'default',
    label: 'Interactive Switch',
    helperText: 'Toggle me to see events',
    disabled: false,
    readonly: false,
    required: false,
    value: false,
  });

  readonly interactiveSwitchConfig = computed(() => this.interactiveSwitchConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Switch',
    description: 'Customize the switch properties and see real-time changes',
    controls: [
      createSelectControl(
        'size',
        'Size',
        'size',
        this.switchSizes.map(size => ({
          label: getSwitchSizeLabel(size),
          value: size,
        })),
      ),
      createSelectControl(
        'variant',
        'Variant',
        'variant',
        this.switchVariants.map(variant => ({
          label: getSwitchVariantLabel(variant),
          value: variant,
        })),
      ),
      createTextControl('label', 'Label', 'label', {
        placeholder: 'Enter switch label...',
      }),
      createTextControl('helperText', 'Helper Text', 'helperText', {
        placeholder: 'Enter helper text...',
      }),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('readonly', 'Readonly', 'readonly'),
      createCheckboxControl('required', 'Required', 'required'),
      createCheckboxControl('value', 'Checked', 'value'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'size',
          type: 'SwitchSize',
          defaultValue: 'md',
          description: 'Size of the switch',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'variant',
          type: 'SwitchVariant',
          defaultValue: 'default',
          description: 'Visual variant of the switch',
          examples: ['default', 'success', 'warning', 'danger'],
        },
        {
          name: 'label',
          type: 'string',
          description: 'Label text displayed next to the switch',
          examples: ['Enable notifications', 'Dark mode'],
        },
        {
          name: 'helperText',
          type: 'string',
          description: 'Helper text displayed below the switch',
          examples: ['This will enable email notifications'],
        },
        {
          name: 'ariaLabel',
          type: 'string',
          description: 'Aria label for accessibility',
          examples: ['Toggle notifications'],
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the switch is disabled',
        },
        {
          name: 'readonly',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the switch is readonly',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the switch is required in forms',
        },
        {
          name: 'value',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Current checked state (two-way binding)',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS classes',
        },
      ],
      outputs: [
        {
          name: 'checkedChange',
          type: 'SwitchChangeEvent',
          description: 'Emitted when switch state changes',
          examples: ['{ checked: true, value: true, originalEvent: Event, timestamp: 1234567890 }'],
        },
        {
          name: 'focusChange',
          type: 'SwitchFocusEvent',
          description: 'Emitted when switch gains or loses focus',
          examples: [
            '{ checked: true, type: "focus", originalEvent: FocusEvent, timestamp: 1234567890 }',
          ],
        },
        {
          name: 'keyboardEvent',
          type: 'SwitchKeyboardEvent',
          description: 'Emitted on keyboard interactions',
          examples: [
            '{ checked: true, key: " ", keyCode: 32, originalEvent: KeyboardEvent, timestamp: 1234567890 }',
          ],
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the switch',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the switch',
        },
        {
          name: 'toggle',
          signature: 'toggle(): void',
          description: 'Toggle the switch state programmatically',
        },
        {
          name: 'setError',
          signature: 'setError(hasError: boolean): void',
          description: 'Set the error state of the switch',
          parameters: [
            {
              name: 'hasError',
              type: 'boolean',
              required: true,
              description: 'Whether the switch has an error',
            },
          ],
        },
      ],
    };

    return createShowcaseConfig(
      {
        componentName: this.componentName,
        description: this.description,
        lastAction: this.lastAction,
      },
      apiDocumentation,
    );
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onCheckedChange(event: SwitchChangeEvent): void {
    this.lastActionSignal.set(
      `Switch ${event.checked ? 'checked' : 'unchecked'} at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
    console.log('Switch checked change:', event);
  }

  onFocusChange(event: SwitchFocusEvent): void {
    this.lastActionSignal.set(
      `Switch ${event.direction} at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
  }

  onKeyboardEvent(event: SwitchKeyboardEvent): void {
    this.lastActionSignal.set(
      `Key "${event.key}" pressed at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
    console.log('Switch keyboard event:', event);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<SwitchInteractiveConfig>): void {
    this.interactiveSwitchConfigSignal.set({
      ...this.interactiveSwitchConfigSignal(),
      ...event.config,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSwitchSizeLabel = getSwitchSizeLabel;
  getSwitchVariantLabel = getSwitchVariantLabel;
}

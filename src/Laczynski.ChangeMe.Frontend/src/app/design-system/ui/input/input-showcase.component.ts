import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputComponent } from './input.component';
import { ApiDocumentationComponent } from '../../shared/components';
import {
  InputType,
  InputSize,
  InputChangeEvent,
  InputFocusEvent,
  InputClearEvent,
  InputEnterEvent,
  createInputConfig,
} from './input.model';
import {
  ShowcaseComponent,
  createShowcaseConfig,
  ComponentApiDocumentation,
  ShowcaseConfig,
} from '../../models/showcase.model';

/**
 * Input Component Showcase
 *
 * Demonstrates all variants, states, and features of the Input component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'input-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ApiDocumentationComponent],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">{{ showcaseConfig().component.description }}</p>
      </div>

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Input Types</h2>
        <div class="showcase-grid">
          @for (type of inputTypes; track type) {
            <div class="showcase-item">
              <h3>{{ type | titlecase }}</h3>
              <ds-input
                [type]="type"
                [label]="getTypeLabel(type)"
                [placeholder]="getPlaceholderForType(type)"
                [value]="''"
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
          @for (size of inputSizes; track size) {
            <div class="showcase-item">
              <h3>{{ getSizeLabel(size) }}</h3>
              <ds-input
                type="text"
                [label]="getSizeLabel(size)"
                placeholder="Enter text..."
                [value]="''"
                [size]="size"
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
            <h3>Default</h3>
            <ds-input
              type="text"
              label="Default Input"
              placeholder="Enter text..."
              [value]="''"
              size="md"
            />
          </div>

          <!-- With Value -->
          <div class="showcase-item">
            <h3>With Value</h3>
            <ds-input
              type="text"
              label="Input with Value"
              placeholder="Enter text..."
              value="Sample text"
              size="md"
            />
          </div>

          <!-- Disabled -->
          <div class="showcase-item">
            <h3>Disabled</h3>
            <ds-input
              type="text"
              label="Disabled Input"
              placeholder="Cannot edit..."
              [value]="''"
              size="md"
              [disabled]="true"
            />
          </div>

          <!-- Readonly -->
          <div class="showcase-item">
            <h3>Readonly</h3>
            <ds-input
              type="text"
              label="Readonly Input"
              value="Read only value"
              size="md"
              [readonly]="true"
            />
          </div>

          <!-- Required -->
          <div class="showcase-item">
            <h3>Required</h3>
            <ds-input
              type="text"
              label="Required Input"
              placeholder="This field is required"
              [value]="''"
              size="md"
              [required]="true"
            />
          </div>

          <!-- With Helper Text -->
          <div class="showcase-item">
            <h3>With Helper Text</h3>
            <ds-input
              type="text"
              label="Input with Help"
              placeholder="Enter text..."
              helperText="This is helpful information about the input"
              [value]="''"
              size="md"
            />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="showcase-section">
        <h2>Features</h2>
        <div class="showcase-grid">
          <!-- With Icons -->
          <div class="showcase-item">
            <h3>With Icons</h3>
            <ds-input
              type="email"
              label="Email with Icon"
              placeholder="Enter email..."
              startIcon="📧"
              [value]="''"
              size="md"
            />
          </div>

          <!-- Clearable -->
          <div class="showcase-item">
            <h3>Clearable</h3>
            <ds-input
              type="text"
              label="Clearable Input"
              placeholder="Type to see clear button..."
              value="Clear me!"
              [clearable]="true"
              size="md"
            />
          </div>

          <!-- Password Toggle -->
          <div class="showcase-item">
            <h3>Password Toggle</h3>
            <ds-input
              type="password"
              label="Password"
              placeholder="Enter password..."
              value="secretpassword"
              size="md"
            />
          </div>

          <!-- Character Counter -->
          <div class="showcase-item">
            <h3>Character Counter</h3>
            <ds-input
              type="text"
              label="Limited Input"
              placeholder="Max 50 characters..."
              value="Type here"
              [maxLength]="50"
              [showCounter]="true"
              size="md"
            />
          </div>

          <!-- Search -->
          <div class="showcase-item">
            <h3>Search Input</h3>
            <ds-input
              type="search"
              label="Search"
              placeholder="Search..."
              startIcon="🔍"
              [clearable]="true"
              [value]="''"
              size="md"
            />
          </div>

          <!-- Number Input -->
          <div class="showcase-item">
            <h3>Number Input</h3>
            <ds-input
              type="number"
              label="Quantity"
              placeholder="Enter number..."
              [min]="1"
              [max]="100"
              [step]="1"
              [value]="''"
              size="md"
            />
          </div>
        </div>
      </section>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>

        <div class="interactive-controls">
          <div class="control-group">
            <label>
              Type:
              <select [(ngModel)]="demoConfigTypeValue" class="control-input">
                @for (type of inputTypes; track type) {
                  <option [value]="type">{{ type | titlecase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Size:
              <select [(ngModel)]="demoConfigSizeValue" class="control-input">
                @for (size of inputSizes; track size) {
                  <option [value]="size">{{ size | uppercase }}</option>
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
              Placeholder:
              <input
                type="text"
                [(ngModel)]="demoConfigPlaceholderValue"
                class="control-input"
                placeholder="Enter placeholder..."
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
              <input type="checkbox" [(ngModel)]="demoConfigReadonlyValue" />
              Readonly
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigRequiredValue" />
              Required
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigClearableValue" />
              Clearable
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigShowCounterValue" />
              Show Counter
            </label>
          </div>
        </div>

        <div class="interactive-preview">
          <ds-input
            [type]="demoConfigType()"
            [size]="demoConfigSize()"
            [label]="demoConfigLabel()"
            [placeholder]="demoConfigPlaceholder()"
            [disabled]="demoConfigDisabled()"
            [readonly]="demoConfigReadonly()"
            [required]="demoConfigRequired()"
            [clearable]="demoConfigClearable()"
            [showCounter]="demoConfigShowCounter()"
            [maxLength]="demoConfigShowCounter() ? 100 : null"
            [helperText]="demoConfigHelperText()"
            [value]="demoValueInput"
            (valueChange)="onValueChange($event)"
            (focus)="onFocus($event)"
            (clear)="onClear($event)"
            (enterKey)="onEnterKey($event)"
          />
        </div>

        <div class="showcase-output">
          {{ lastAction || 'Interact with the input above to see events...' }}
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
export class InputShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Input Component';
  description =
    'Versatile input component supporting multiple types, validation, icons, and accessibility features. Built with Angular Signals and modern web standards.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO CONFIGURATION
  // =============================================================================

  inputTypes: InputType[] = ['text', 'email', 'password', 'number', 'search', 'tel', 'url'];
  inputSizes: InputSize[] = ['sm', 'md', 'lg'];

  // Individual signals for demo configuration
  demoConfigType = signal<InputType>('text');
  demoConfigSize = signal<InputSize>('md');
  demoConfigLabel = signal<string>('Demo Input');
  demoConfigPlaceholder = signal<string>('Enter text...');
  demoConfigDisabled = signal<boolean>(false);
  demoConfigReadonly = signal<boolean>(false);
  demoConfigRequired = signal<boolean>(false);
  demoConfigClearable = signal<boolean>(false);
  demoConfigShowCounter = signal<boolean>(false);
  demoConfigHelperText = signal<string>('');

  demoValue = signal<string>('');

  // Computed properties for two-way binding with ngModel
  get demoConfigTypeValue(): InputType {
    return this.demoConfigType();
  }
  set demoConfigTypeValue(value: InputType) {
    this.demoConfigType.set(value);
  }

  get demoConfigSizeValue(): InputSize {
    return this.demoConfigSize();
  }
  set demoConfigSizeValue(value: InputSize) {
    this.demoConfigSize.set(value);
  }

  get demoConfigLabelValue(): string {
    return this.demoConfigLabel();
  }
  set demoConfigLabelValue(value: string) {
    this.demoConfigLabel.set(value);
  }

  get demoConfigPlaceholderValue(): string {
    return this.demoConfigPlaceholder();
  }
  set demoConfigPlaceholderValue(value: string) {
    this.demoConfigPlaceholder.set(value);
  }

  get demoConfigDisabledValue(): boolean {
    return this.demoConfigDisabled();
  }
  set demoConfigDisabledValue(value: boolean) {
    this.demoConfigDisabled.set(value);
  }

  get demoConfigReadonlyValue(): boolean {
    return this.demoConfigReadonly();
  }
  set demoConfigReadonlyValue(value: boolean) {
    this.demoConfigReadonly.set(value);
  }

  get demoConfigRequiredValue(): boolean {
    return this.demoConfigRequired();
  }
  set demoConfigRequiredValue(value: boolean) {
    this.demoConfigRequired.set(value);
  }

  get demoConfigClearableValue(): boolean {
    return this.demoConfigClearable();
  }
  set demoConfigClearableValue(value: boolean) {
    this.demoConfigClearable.set(value);
  }

  get demoConfigShowCounterValue(): boolean {
    return this.demoConfigShowCounter();
  }
  set demoConfigShowCounterValue(value: boolean) {
    this.demoConfigShowCounter.set(value);
  }

  get demoValueInput(): string {
    return this.demoValue();
  }
  set demoValueInput(value: string) {
    this.demoValue.set(value);
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
          name: 'type',
          type: 'InputType',
          defaultValue: "'text'",
          required: false,
          description: 'Input type (text, email, password, number, search, tel, url)',
          examples: ['text', 'email', 'password'],
        },
        {
          name: 'size',
          type: 'InputSize',
          defaultValue: "'md'",
          required: false,
          description: 'Input size variant',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'label',
          type: 'string',
          defaultValue: "''",
          required: false,
          description: 'Input label text',
        },
        {
          name: 'placeholder',
          type: 'string',
          defaultValue: "''",
          required: false,
          description: 'Input placeholder text',
        },
        {
          name: 'value',
          type: 'string',
          defaultValue: "''",
          required: false,
          description: 'Input value (two-way binding)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the input is disabled',
        },
        {
          name: 'readonly',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the input is readonly',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the input is required',
        },
        {
          name: 'clearable',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether to show clear button when input has value',
        },
        {
          name: 'helperText',
          type: 'string',
          required: false,
          description: 'Helper text to display below the input',
        },
        {
          name: 'startIcon',
          type: 'string',
          required: false,
          description: 'Icon to display at the start of the input',
        },
        {
          name: 'endIcon',
          type: 'string',
          required: false,
          description: 'Icon to display at the end of the input',
        },
        {
          name: 'maxLength',
          type: 'number',
          required: false,
          description: 'Maximum number of characters allowed',
        },
        {
          name: 'showCharacterCount',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether to show character counter',
        },
      ],
      outputs: [
        {
          name: 'valueChange',
          type: 'InputChangeEvent',
          description: 'Emitted when input value changes',
          examples: ['{ value, inputElement, event }'],
        },
        {
          name: 'focused',
          type: 'InputFocusEvent',
          description: 'Emitted when input receives focus',
        },
        {
          name: 'blurred',
          type: 'InputFocusEvent',
          description: 'Emitted when input loses focus',
        },
        {
          name: 'cleared',
          type: 'InputClearEvent',
          description: 'Emitted when clear button is clicked',
        },
        {
          name: 'enterKey',
          type: 'InputEnterEvent',
          description: 'Emitted when Enter key is pressed',
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the input',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the input',
        },
        {
          name: 'clear',
          signature: 'clear(): void',
          description: 'Clear the input value',
        },
        {
          name: 'select',
          signature: 'select(): void',
          description: 'Select all text in the input',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onValueChange(event: string | InputChangeEvent): void {
    if (typeof event === 'string') {
      this.demoValue.set(event);
      this.lastActionSignal.set(`Value changed: "${event}"`);
    } else {
      this.demoValue.set(event.value);
      this.lastActionSignal.set(`Value changed: "${event.value}" (valid: ${event.valid})`);
    }
  }

  onFocus(event: InputFocusEvent): void {
    this.lastActionSignal.set(`Input ${event.direction === 'in' ? 'focused' : 'blurred'}`);
  }

  onClear(event: InputClearEvent): void {
    this.lastActionSignal.set(`Input cleared (previous value: "${event.previousValue}")`);
  }

  onEnterKey(event: InputEnterEvent): void {
    this.lastActionSignal.set(`Enter key pressed with value: "${event.value}"`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getPlaceholderForType(type: InputType): string {
    switch (type) {
      case 'email':
        return 'Enter email address...';
      case 'password':
        return 'Enter password...';
      case 'number':
        return 'Enter number...';
      case 'search':
        return 'Search...';
      case 'tel':
        return 'Enter phone number...';
      case 'url':
        return 'Enter URL...';
      default:
        return 'Enter text...';
    }
  }

  getTypeLabel(type: InputType): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1)} Input`;
  }

  getSizeLabel(size: InputSize): string {
    return `${size.toUpperCase()} Size`;
  }
}

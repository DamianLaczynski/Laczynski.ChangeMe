import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { FormFieldComponent } from './form-field.component';
import { ApiDocumentationComponent } from '../../shared/components';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { RadioComponent } from '../radio/radio.component';
import { ButtonComponent } from '../button/button.component';

import {
  FormFieldVariant,
  FormFieldSize,
  FormFieldLayout,
  FormFieldLabelPosition,
  FormFieldHint,
  createFormFieldHint,
  FormFieldValidationState,
  createFormFieldConfig,
} from './form-field.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

/**
 * Form Field Showcase Component
 *
 * Demonstrates the Form Field component in various configurations,
 * showing all variants, layouts, validation states, and real-world examples.
 */
@Component({
  selector: 'ds-form-field-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormFieldComponent,
    ApiDocumentationComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    ButtonComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">{{ showcaseConfig().component.description }}</p>
      </div>

      <!-- Basic Examples -->
      <section class="showcase-section">
        <h2>Basic Form Fields</h2>
        <p>Essential form field examples with different configurations.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Default</h3>
            <p>Basic form field with email input and required validation.</p>
            <ds-form-field label="Email Address" [required]="true">
              <ds-input type="email" placeholder="Enter your email" [value]="''" />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>With Hint</h3>
            <p>Form field with helpful hint text for user guidance.</p>
            <ds-form-field label="Password" [required]="true" [hint]="passwordHint()">
              <ds-input type="password" placeholder="Enter password" [value]="''" />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Optional Field</h3>
            <p>Non-required field with hint for additional information.</p>
            <ds-form-field label="Phone Number" [hint]="phoneHint()">
              <ds-input type="tel" placeholder="(555) 123-4567" [value]="''" />
            </ds-form-field>
          </div>
        </div>
      </section>

      <!-- Variants -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <p>Different visual styles for various design contexts.</p>

        <div class="showcase-grid">
          @for (variant of variants(); track variant) {
            <div class="showcase-item">
              <h3>{{ variant | titlecase }}</h3>
              <ds-form-field [variant]="variant" label="Full Name" [required]="true">
                <ds-input placeholder="Enter your name" [value]="''" />
              </ds-form-field>
            </div>
          }
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <p>Different form field sizes for various contexts and hierarchies.</p>

        <div class="showcase-grid">
          @for (size of sizes(); track size) {
            <div class="showcase-item">
              <h3>{{ size | uppercase }}</h3>
              <ds-form-field [size]="size" label="Company" [required]="true" [hint]="companyHint()">
                <ds-input placeholder="Enter company name" [value]="''" />
              </ds-form-field>
            </div>
          }
        </div>
      </section>

      <!-- Layouts -->
      <section class="showcase-section">
        <h2>Layout Options</h2>
        <p>Different layout orientations for form organization.</p>

        <div class="showcase-grid">
          @for (layout of layouts(); track layout) {
            <div class="showcase-item">
              <h3>{{ layout | titlecase }} Layout</h3>
              <ds-form-field [layout]="layout" label="Department" [required]="true">
                <ds-select [options]="departmentOptions()" placeholder="Select department" />
              </ds-form-field>
            </div>
          }
        </div>
      </section>

      <!-- Label Positions -->
      <section class="showcase-section">
        <h2>Label Positions</h2>
        <p>Different label positioning options for varied design needs.</p>

        <div class="showcase-grid">
          @for (position of labelPositions(); track position) {
            <div class="showcase-item">
              <h3>{{ position | titlecase }} Label</h3>
              <ds-form-field [labelPosition]="position" label="Address" [required]="true">
                <ds-input placeholder="Enter your address" [value]="''" />
              </ds-form-field>
            </div>
          }
        </div>
      </section>

      <!-- Validation States -->
      <section class="showcase-section">
        <h2>Validation States</h2>
        <p>Different validation states including valid, invalid, and warning states.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Valid State</h3>
            <p>Field with successful validation and confirmation message.</p>
            <ds-form-field label="Username" [required]="true" [validation]="validState()">
              <ds-input placeholder="Enter username" [value]="'john_doe'" />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Invalid State</h3>
            <p>Field with validation error and error message display.</p>
            <ds-form-field label="Email" [required]="true" [validation]="invalidState()">
              <ds-input type="email" placeholder="Enter email" [value]="'invalid-email'" />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Warning State</h3>
            <p>Field with warning message for user attention.</p>
            <ds-form-field label="Password" [required]="true" [validation]="warningState()">
              <ds-input type="password" placeholder="Enter password" [value]="'weak'" />
            </ds-form-field>
          </div>
        </div>
      </section>

      <!-- Character Count -->
      <section class="showcase-section">
        <h2>Character Count</h2>
        <p>Form fields with character counting and limit validation.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>With Character Counter</h3>
            <p>Real-time character counting with maximum limit display.</p>
            <ds-form-field
              label="Bio"
              [showCharacterCount]="true"
              [maxLength]="150"
              [value]="bioValue()"
              [hint]="bioHint()"
            >
              <ds-input
                placeholder="Tell us about yourself"
                [value]="bioValue()"
                (valueChange)="updateBioValue($event)"
              />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Approaching Limit</h3>
            <p>Character count with warning when approaching the limit.</p>
            <ds-form-field
              label="Description"
              [showCharacterCount]="true"
              [maxLength]="100"
              [value]="descriptionValue()"
              [validation]="descriptionValidation()"
            >
              <ds-input
                placeholder="Enter description"
                [value]="descriptionValue()"
                (valueChange)="updateDescriptionValue($event)"
              />
            </ds-form-field>
          </div>
        </div>
      </section>

      <!-- States -->
      <section class="showcase-section">
        <h2>States</h2>
        <p>Different form field states including disabled, readonly, and loading.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Disabled</h3>
            <p>Field that cannot be interacted with or modified.</p>
            <ds-form-field label="Disabled Field" [disabled]="true" [hint]="disabledHint()">
              <ds-input
                placeholder="Cannot interact"
                [value]="'Disabled value'"
                [disabled]="true"
              />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Readonly</h3>
            <p>Field that displays data but cannot be edited.</p>
            <ds-form-field label="Readonly Field" [readonly]="true" [hint]="readonlyHint()">
              <ds-input placeholder="Cannot edit" [value]="'Readonly value'" [readonly]="true" />
            </ds-form-field>
          </div>

          <div class="showcase-item">
            <h3>Loading</h3>
            <p>Field in loading state with spinner indicator.</p>
            <ds-form-field label="Loading Field" [loading]="true" [hint]="loadingHint()">
              <ds-input placeholder="Loading..." [value]="''" />
            </ds-form-field>
          </div>
        </div>
      </section>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>
        <p>Try different configurations and see real-time changes.</p>

        <div class="showcase-interactive">
          <div class="interactive-controls">
            <div class="control-group">
              <label for="variant-select">Variant:</label>
              <select
                id="variant-select"
                [(ngModel)]="currentInteractiveConfig.variant"
                class="control-input"
              >
                @for (variant of variants(); track variant) {
                  <option [value]="variant">{{ variant | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="size-select">Size:</label>
              <select
                id="size-select"
                [(ngModel)]="currentInteractiveConfig.size"
                class="control-input"
              >
                @for (size of sizes(); track size) {
                  <option [value]="size">{{ size | uppercase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="layout-select">Layout:</label>
              <select
                id="layout-select"
                [(ngModel)]="currentInteractiveConfig.layout"
                class="control-input"
              >
                @for (layout of layouts(); track layout) {
                  <option [value]="layout">{{ layout | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="position-select">Label Position:</label>
              <select
                id="position-select"
                [(ngModel)]="currentInteractiveConfig.labelPosition"
                class="control-input"
              >
                @for (position of labelPositions(); track position) {
                  <option [value]="position">{{ position | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentInteractiveConfig.required" /> Required
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentInteractiveConfig.disabled" /> Disabled
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentInteractiveConfig.loading" /> Loading
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentInteractiveConfig.showCharacterCount" />
                Character Count
              </label>
            </div>
          </div>

          <div class="interactive-preview">
            <ds-form-field
              [variant]="currentInteractiveConfig.variant"
              [size]="currentInteractiveConfig.size"
              [layout]="currentInteractiveConfig.layout"
              [labelPosition]="currentInteractiveConfig.labelPosition"
              [required]="currentInteractiveConfig.required"
              [disabled]="currentInteractiveConfig.disabled"
              [loading]="currentInteractiveConfig.loading"
              [showCharacterCount]="currentInteractiveConfig.showCharacterCount"
              [maxLength]="50"
              [value]="interactiveValue()"
              label="Interactive Field"
              [hint]="interactiveHint()"
            >
              <ds-input
                placeholder="Type here to test..."
                [value]="interactiveValue()"
                [disabled]="currentInteractiveConfig.disabled"
                (valueChange)="updateInteractiveValue($event)"
              />
            </ds-form-field>
          </div>

          <div class="showcase-output">
            <h4>Current Configuration:</h4>
            <pre>{{ currentInteractiveConfig | json }}</pre>
          </div>
        </div>
      </section>

      <!-- Form Integration -->
      <section class="showcase-section">
        <h2>Form Integration</h2>
        <p>Complete form example with Angular Reactive Forms integration.</p>

        <form [formGroup]="demoForm()" class="showcase-form">
          <div class="showcase-grid">
            <ds-form-field label="First Name" [required]="true">
              <ds-input formControlName="firstName" placeholder="Enter first name" />
            </ds-form-field>

            <ds-form-field label="Last Name" [required]="true">
              <ds-input formControlName="lastName" placeholder="Enter last name" />
            </ds-form-field>

            <ds-form-field label="Email" [required]="true">
              <ds-input type="email" formControlName="email" placeholder="Enter email address" />
            </ds-form-field>

            <ds-form-field label="Country" [required]="true" [hint]="countryHint()">
              <ds-select
                formControlName="country"
                [options]="countryOptions()"
                placeholder="Select country"
              />
            </ds-form-field>

            <ds-form-field label="Newsletter">
              <ds-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
            </ds-form-field>

            <ds-form-field label="Account Type" [required]="true" layout="horizontal">
              <ds-radio
                formControlName="accountType"
                [options]="accountTypeOptions()"
                layout="horizontal"
              />
            </ds-form-field>
          </div>

          <div class="showcase-form-actions">
            <ds-button type="submit" variant="primary" [disabled]="demoForm().invalid">
              Submit Form
            </ds-button>
            <ds-button type="button" variant="secondary" (click)="resetForm()"> Reset </ds-button>
          </div>

          <div class="showcase-output">
            <h4>Form State (for debugging):</h4>
            <pre>{{ getFormDebugInfo() | json }}</pre>
          </div>
        </form>
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
export class FormFieldShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Form Field Component';
  description =
    'Wrapper component that provides consistent layout, validation, and accessibility features for form controls.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // CONFIGURATION OPTIONS
  // =============================================================================

  variants = signal<FormFieldVariant[]>(['default', 'outlined', 'filled']);
  sizes = signal<FormFieldSize[]>(['sm', 'md', 'lg']);
  layouts = signal<FormFieldLayout[]>(['vertical', 'horizontal', 'inline']);
  labelPositions = signal<FormFieldLabelPosition[]>(['top', 'left', 'inside', 'floating']);

  // =============================================================================
  // INTERACTIVE CONFIGURATION
  // =============================================================================

  currentInteractiveConfig = {
    variant: 'default' as FormFieldVariant,
    size: 'md' as FormFieldSize,
    layout: 'vertical' as FormFieldLayout,
    labelPosition: 'top' as FormFieldLabelPosition,
    required: false,
    disabled: false,
    loading: false,
    showCharacterCount: false,
  };

  interactiveValue = signal('');

  // =============================================================================
  // DEMO FORM
  // =============================================================================

  demoForm = signal(
    new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      country: new FormControl('', [Validators.required]),
      newsletter: new FormControl(false),
      accountType: new FormControl('', [Validators.required]),
    }),
  );

  // =============================================================================
  // TEXT VALUES
  // =============================================================================

  bioValue = signal('');
  descriptionValue = signal(
    'This is getting quite long and approaching the character limit for this field.',
  );

  // =============================================================================
  // COMPUTED HINTS
  // =============================================================================

  passwordHint = computed(() => createFormFieldHint('Must be at least 8 characters', 'info'));

  phoneHint = computed(() =>
    createFormFieldHint('Include country code for international numbers', 'info'),
  );

  companyHint = computed(() => createFormFieldHint('Enter your current employer', 'info'));

  bioHint = computed(() => createFormFieldHint('Brief description about yourself', 'info'));

  countryHint = computed(() => createFormFieldHint('Select your primary residence', 'info'));

  disabledHint = computed(() => createFormFieldHint('This field cannot be modified', 'info'));

  readonlyHint = computed(() => createFormFieldHint('This field is read-only', 'info'));

  loadingHint = computed(() => createFormFieldHint('Data is being loaded...', 'info'));

  interactiveHint = computed(() =>
    createFormFieldHint('Configure the field using controls on the left', 'info'),
  );

  // =============================================================================
  // VALIDATION STATES
  // =============================================================================

  validState = computed(() => ({
    valid: true,
    errors: [],
    warnings: [],
    successMessage: 'Username is available',
    touched: true,
    dirty: true,
  }));

  invalidState = computed(() => ({
    valid: false,
    errors: ['Please enter a valid email address'],
    warnings: [],
    touched: true,
    dirty: true,
  }));

  warningState = computed(() => ({
    valid: true,
    errors: [],
    warnings: ['Password is weak. Consider using a stronger password.'],
    touched: true,
    dirty: true,
  }));

  descriptionValidation = computed(() => {
    const value = this.descriptionValue();
    const isNearLimit = value.length > 85;
    const isOverLimit = value.length > 100;

    if (isOverLimit) {
      return {
        valid: false,
        errors: ['Description exceeds maximum length'],
        warnings: [],
        touched: true,
        dirty: true,
      };
    }

    if (isNearLimit) {
      return {
        valid: true,
        errors: [],
        warnings: ['Approaching character limit'],
        touched: true,
        dirty: true,
      };
    }

    return {
      valid: true,
      errors: [],
      warnings: [],
      touched: true,
      dirty: true,
    };
  });

  // =============================================================================
  // OPTIONS
  // =============================================================================

  departmentOptions = signal([
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
  ]);

  countryOptions = signal([
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'pl', label: 'Poland' },
  ]);

  accountTypeOptions = signal([
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ]);

  // =============================================================================
  // METHODS
  // =============================================================================

  updateBioValue(value: string): void {
    this.bioValue.set(value);
  }

  updateDescriptionValue(value: string): void {
    this.descriptionValue.set(value);
  }

  updateInteractiveValue(value: string): void {
    this.interactiveValue.set(value);
  }

  resetForm(): void {
    this.demoForm().reset();
  }

  getFormDebugInfo(): any {
    const form = this.demoForm();
    return {
      valid: form.valid,
      touched: form.touched,
      dirty: form.dirty,
      values: form.value,
      errors: this.getFormErrors(form),
    };
  }

  private getFormErrors(form: FormGroup): any {
    const errors: any = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
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
          type: 'FormFieldVariant',
          defaultValue: "'default'",
          required: false,
          description: 'Visual style variant of the form field',
          examples: ['default', 'filled', 'outlined'],
        },
        {
          name: 'size',
          type: 'FormFieldSize',
          defaultValue: "'md'",
          required: false,
          description: 'Size of the form field',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'orientation',
          type: 'FormFieldLayout',
          defaultValue: "'vertical'",
          required: false,
          description: 'Layout orientation of label and control',
          examples: ['vertical', 'horizontal', 'inline'],
        },
        {
          name: 'label',
          type: 'string',
          required: false,
          description: 'Label text for the form field',
        },
        {
          name: 'helperText',
          type: 'string',
          required: false,
          description: 'Helper text to display below the control',
        },
        {
          name: 'errorText',
          type: 'string',
          required: false,
          description: 'Error message to display when validation fails',
        },
        {
          name: 'validationState',
          type: 'FormFieldValidationState',
          defaultValue: "'none'",
          required: false,
          description: 'Current validation state',
          examples: ['none', 'valid', 'invalid', 'warning'],
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the field is required',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the field is disabled',
        },
        {
          name: 'showRequiredIndicator',
          type: 'boolean',
          defaultValue: 'true',
          required: false,
          description: 'Whether to show asterisk for required fields',
        },
      ],
      outputs: [],
      methods: [
        {
          name: 'focusControl',
          signature: 'focusControl(): void',
          description: 'Focus the wrapped form control',
        },
        {
          name: 'validate',
          signature: 'validate(): void',
          description: 'Trigger validation of the wrapped control',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });
}

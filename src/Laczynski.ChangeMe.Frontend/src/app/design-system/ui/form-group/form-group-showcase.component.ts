import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { FormGroupComponent } from './form-group.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { RadioComponent } from '../radio/radio.component';
import { ButtonComponent } from '../button/button.component';

import {
  FormGroupVariant,
  FormGroupSize,
  FormGroupLayout,
  FormGroupSpacing,
  FormGroupAction,
  createFormGroupAction,
} from './form-group.model';

/**
 * Form Group Showcase Component
 *
 * Demonstrates the Form Group component in various configurations,
 * showing all variants, layouts, collapsible functionality, and real-world examples.
 */
@Component({
  selector: 'ds-form-group-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormGroupComponent,
    FormFieldComponent,
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
        <h1>Form Group Component</h1>
        <p class="showcase-description">
          Logical grouping component for related form fields with title, description, optional
          collapsing, progress tracking, and various layout options.
        </p>
      </div>

      <!-- Basic Examples -->
      <section class="showcase-section">
        <h2>Basic Form Groups</h2>
        <p>Essential form grouping examples with different configurations.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Default Group</h3>
            <p>Basic form group with title and description.</p>
            <ds-form-group
              title="Personal Information"
              description="Please provide your basic personal details"
              [required]="true"
            >
              <ds-form-field label="First Name" [required]="true">
                <ds-input placeholder="Enter first name" [value]="''" />
              </ds-form-field>
              <ds-form-field label="Last Name" [required]="true">
                <ds-input placeholder="Enter last name" [value]="''" />
              </ds-form-field>
            </ds-form-group>
          </div>

          <div class="showcase-item">
            <h3>With Actions</h3>
            <p>Form group with action buttons for additional functionality.</p>
            <ds-form-group
              title="Contact Information"
              description="Add or edit your contact details"
              [actions]="contactActions()"
            >
              <ds-form-field label="Email" [required]="true">
                <ds-input type="email" placeholder="Enter email" [value]="''" />
              </ds-form-field>
              <ds-form-field label="Phone">
                <ds-input type="tel" placeholder="Enter phone" [value]="''" />
              </ds-form-field>
            </ds-form-group>
          </div>

          <div class="showcase-item">
            <h3>Collapsible Group</h3>
            <p>Form group that can be collapsed to save space.</p>
            <ds-form-group
              title="Optional Details"
              description="Additional information (click to expand/collapse)"
              [collapsible]="true"
              [initiallyCollapsed]="true"
            >
              <ds-form-field label="Company">
                <ds-input placeholder="Enter company name" [value]="''" />
              </ds-form-field>
              <ds-form-field label="Position">
                <ds-input placeholder="Enter position" [value]="''" />
              </ds-form-field>
            </ds-form-group>
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
              <ds-form-group
                [variant]="variant"
                title="Account Settings"
                description="Configure your account preferences"
              >
                <ds-form-field label="Username" [required]="true">
                  <ds-input placeholder="Enter username" [value]="''" />
                </ds-form-field>
                <ds-form-field label="Language">
                  <ds-select [options]="languageOptions()" placeholder="Select language" />
                </ds-form-field>
              </ds-form-group>
            </div>
          }
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <p>Different form group sizes for various contexts and hierarchies.</p>

        <div class="showcase-grid">
          @for (size of sizes(); track size) {
            <div class="showcase-item">
              <h3>{{ size | uppercase }}</h3>
              <ds-form-group
                [size]="size"
                title="User Preferences"
                description="Customize your experience"
                variant="outlined"
              >
                <ds-form-field label="Theme">
                  <ds-select [options]="themeOptions()" placeholder="Select theme" />
                </ds-form-field>
                <ds-form-field label="Notifications">
                  <ds-checkbox label="Enable email notifications" />
                </ds-form-field>
              </ds-form-group>
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
              <ds-form-group
                [layout]="layout"
                title="Address Information"
                description="Enter your address details"
                variant="filled"
              >
                <ds-form-field label="Street Address" [required]="true">
                  <ds-input placeholder="Enter street address" [value]="''" />
                </ds-form-field>
                <ds-form-field label="City" [required]="true">
                  <ds-input placeholder="Enter city" [value]="''" />
                </ds-form-field>
                <ds-form-field label="Country" [required]="true">
                  <ds-select [options]="countryOptions()" placeholder="Select country" />
                </ds-form-field>
              </ds-form-group>
            </div>
          }
        </div>
      </section>

      <!-- Spacing Options -->
      <section class="showcase-section">
        <h2>Spacing Options</h2>
        <p>Different spacing between form fields for layout control.</p>

        <div class="showcase-grid">
          @for (spacing of spacingOptions(); track spacing) {
            <div class="showcase-item">
              <h3>{{ spacing | titlecase }} Spacing</h3>
              <ds-form-group
                [spacing]="spacing"
                title="Billing Information"
                description="Enter billing details"
                variant="outlined"
              >
                <ds-form-field label="Card Number" [required]="true">
                  <ds-input placeholder="1234 5678 9012 3456" [value]="''" />
                </ds-form-field>
                <ds-form-field label="Expiry Date" [required]="true">
                  <ds-input placeholder="MM/YY" [value]="''" />
                </ds-form-field>
                <ds-form-field label="CVV" [required]="true">
                  <ds-input placeholder="123" [value]="''" />
                </ds-form-field>
              </ds-form-group>
            </div>
          }
        </div>
      </section>

      <!-- Progress Tracking -->
      <section class="showcase-section">
        <h2>Progress Tracking</h2>
        <p>Form groups with progress indicators showing completion status.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>With Progress Bar</h3>
            <p>Shows completion progress as users fill out fields.</p>
            <ds-form-group
              title="Profile Setup"
              description="Complete your profile information"
              [showProgress]="true"
              variant="outlined"
            >
              <ds-form-field label="Display Name" [required]="true">
                <ds-input placeholder="Enter display name" [value]="'John Doe'" />
              </ds-form-field>
              <ds-form-field label="Bio">
                <ds-input placeholder="Tell us about yourself" [value]="''" />
              </ds-form-field>
              <ds-form-field label="Avatar">
                <ds-input placeholder="Avatar URL" [value]="''" />
              </ds-form-field>
            </ds-form-group>
          </div>

          <div class="showcase-item">
            <h3>Collapsible with Progress</h3>
            <p>Collapsible group that also tracks field completion.</p>
            <ds-form-group
              title="Advanced Settings"
              description="Optional advanced configuration"
              [collapsible]="true"
              [showProgress]="true"
              variant="filled"
            >
              <ds-form-field label="API Key">
                <ds-input placeholder="Enter API key" [value]="''" />
              </ds-form-field>
              <ds-form-field label="Webhook URL">
                <ds-input placeholder="Enter webhook URL" [value]="''" />
              </ds-form-field>
            </ds-form-group>
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
              <select id="variant-select" [(ngModel)]="currentConfig.variant" class="control-input">
                @for (variant of variants(); track variant) {
                  <option [value]="variant">{{ variant | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="size-select">Size:</label>
              <select id="size-select" [(ngModel)]="currentConfig.size" class="control-input">
                @for (size of sizes(); track size) {
                  <option [value]="size">{{ size | uppercase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="layout-select">Layout:</label>
              <select id="layout-select" [(ngModel)]="currentConfig.layout" class="control-input">
                @for (layout of layouts(); track layout) {
                  <option [value]="layout">{{ layout | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="spacing-select">Spacing:</label>
              <select id="spacing-select" [(ngModel)]="currentConfig.spacing" class="control-input">
                @for (spacing of spacingOptions(); track spacing) {
                  <option [value]="spacing">{{ spacing | titlecase }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentConfig.collapsible" /> Collapsible
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentConfig.showBorder" /> Show Border
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentConfig.showProgress" /> Show Progress
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentConfig.required" /> Required
              </label>
            </div>
          </div>

          <div class="interactive-preview">
            <ds-form-group
              [variant]="currentConfig.variant"
              [size]="currentConfig.size"
              [layout]="currentConfig.layout"
              [spacing]="currentConfig.spacing"
              [collapsible]="currentConfig.collapsible"
              [showBorder]="currentConfig.showBorder"
              [showProgress]="currentConfig.showProgress"
              [required]="currentConfig.required"
              [actions]="interactiveActions()"
              title="Interactive Form Group"
              description="Configure this group using the controls on the left"
              (toggleChange)="onToggleChange($event)"
              (actionClick)="onActionClick($event)"
            >
              <ds-form-field label="Sample Field 1" [required]="true">
                <ds-input placeholder="Type here..." [value]="''" />
              </ds-form-field>
              <ds-form-field label="Sample Field 2">
                <ds-select [options]="sampleOptions()" placeholder="Select option" />
              </ds-form-field>
              <ds-form-field label="Sample Field 3">
                <ds-checkbox label="Enable this feature" />
              </ds-form-field>
            </ds-form-group>
          </div>

          <div class="showcase-output">
            @if (lastActionSignal()) {
              <h4>Last Action:</h4>
              <pre>{{ lastActionSignal() }}</pre>
            }
          </div>
        </div>
      </section>

      <!-- Real-world Example -->
      <section class="showcase-section">
        <h2>Real-world Example</h2>
        <p>Complete form with multiple grouped sections demonstrating practical usage.</p>

        <form [formGroup]="demoForm()" class="showcase-form">
          <ds-form-group
            title="Personal Information"
            description="Basic personal details"
            variant="outlined"
            [required]="true"
          >
            <ds-form-field label="First Name" [required]="true">
              <ds-input formControlName="firstName" placeholder="Enter first name" />
            </ds-form-field>
            <ds-form-field label="Last Name" [required]="true">
              <ds-input formControlName="lastName" placeholder="Enter last name" />
            </ds-form-field>
            <ds-form-field label="Email" [required]="true">
              <ds-input type="email" formControlName="email" placeholder="Enter email" />
            </ds-form-field>
          </ds-form-group>

          <ds-form-group
            title="Address Information"
            description="Your current address"
            variant="filled"
            layout="grid"
            [required]="true"
          >
            <ds-form-field label="Street Address" [required]="true">
              <ds-input formControlName="address" placeholder="Enter street address" />
            </ds-form-field>
            <ds-form-field label="City" [required]="true">
              <ds-input formControlName="city" placeholder="Enter city" />
            </ds-form-field>
            <ds-form-field label="Country" [required]="true">
              <ds-select
                formControlName="country"
                [options]="countryOptions()"
                placeholder="Select country"
              />
            </ds-form-field>
          </ds-form-group>

          <ds-form-group
            title="Preferences"
            description="Optional settings and preferences"
            [collapsible]="true"
            [showProgress]="true"
            spacing="loose"
          >
            <ds-form-field label="Newsletter">
              <ds-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
            </ds-form-field>
            <ds-form-field label="Notification Type">
              <ds-radio
                formControlName="notificationType"
                [options]="notificationOptions()"
                layout="horizontal"
              />
            </ds-form-field>
          </ds-form-group>

          <div class="showcase-form-actions">
            <ds-button type="submit" variant="primary" [disabled]="demoForm().invalid">
              Submit Form
            </ds-button>
            <ds-button type="button" variant="secondary" (click)="resetForm()"> Reset </ds-button>
          </div>

          <div class="showcase-output">
            <h4>Form State:</h4>
            <pre>{{ getFormDebugInfo() | json }}</pre>
          </div>
        </form>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <div class="showcase-api">
          <!-- Inputs -->
          <div class="api-section">
            <h3>Inputs</h3>
            <ul>
              <li>
                <code>variant: FormGroupVariant</code>
                <span class="default-value">= 'default'</span>
                <p>Visual variant style ('default' | 'outlined' | 'filled' | 'flat')</p>
              </li>
              <li>
                <code>size: FormGroupSize</code>
                <span class="default-value">= 'md'</span>
                <p>Size of the form group ('sm' | 'md' | 'lg')</p>
              </li>
              <li>
                <code>layout: FormGroupLayout</code>
                <span class="default-value">= 'vertical'</span>
                <p>Layout orientation ('vertical' | 'horizontal' | 'grid')</p>
              </li>
              <li>
                <code>spacing: FormGroupSpacing</code>
                <span class="default-value">= 'normal'</span>
                <p>Spacing between fields ('tight' | 'normal' | 'loose')</p>
              </li>
              <li>
                <code>title: string</code>
                <span class="default-value">= ''</span>
                <p>Group title text</p>
              </li>
              <li>
                <code>description: string</code>
                <span class="default-value">= ''</span>
                <p>Group description text</p>
              </li>
              <li>
                <code>required: boolean</code>
                <span class="default-value">= false</span>
                <p>Whether group is required</p>
              </li>
              <li>
                <code>disabled: boolean</code>
                <span class="default-value">= false</span>
                <p>Whether group is disabled</p>
              </li>
              <li>
                <code>showBorder: boolean</code>
                <span class="default-value">= true</span>
                <p>Whether to show border around group</p>
              </li>
              <li>
                <code>collapsible: boolean</code>
                <span class="default-value">= false</span>
                <p>Whether group can be collapsed</p>
              </li>
              <li>
                <code>initiallyCollapsed: boolean</code>
                <span class="default-value">= false</span>
                <p>Whether group starts collapsed</p>
              </li>
              <li>
                <code>showProgress: boolean</code>
                <span class="default-value">= false</span>
                <p>Whether to show progress bar</p>
              </li>
              <li>
                <code>actions: FormGroupAction[]</code>
                <span class="default-value">= []</span>
                <p>Action buttons for the group</p>
              </li>
              <li>
                <code>customClasses: string</code>
                <span class="default-value">= ''</span>
                <p>Custom CSS classes</p>
              </li>
              <li>
                <code>groupId: string</code>
                <span class="default-value">= ''</span>
                <p>Group ID (auto-generated if not provided)</p>
              </li>
            </ul>
          </div>

          <!-- Outputs -->
          <div class="api-section">
            <h3>Outputs</h3>
            <ul>
              <li>
                <code>stateChange: FormGroupStateChangeEvent</code>
                <p>Emitted when group state changes</p>
              </li>
              <li>
                <code>toggleChange: FormGroupToggleEvent</code>
                <p>Emitted when group is toggled (collapsed/expanded)</p>
              </li>
              <li>
                <code>actionClick: FormGroupActionEvent</code>
                <p>Emitted when an action button is clicked</p>
              </li>
            </ul>
          </div>

          <!-- Methods -->
          <div class="api-section">
            <h3>Public Methods</h3>
            <ul>
              <li>
                <code>expand(): void</code>
                <p>Expand the group if it's collapsible and collapsed</p>
              </li>
              <li>
                <code>collapse(): void</code>
                <p>Collapse the group if it's collapsible and expanded</p>
              </li>
              <li>
                <code>toggleGroup(): void</code>
                <p>Toggle the collapsed state of the group</p>
              </li>
              <li>
                <code>getState(): FormGroupState</code>
                <p>Get current state of the group</p>
              </li>
              <li>
                <code>getProgress(): FormGroupProgress</code>
                <p>Get current progress information</p>
              </li>
              <li>
                <code>isCollapsed(): boolean</code>
                <p>Check if group is currently collapsed</p>
              </li>
              <li>
                <code>isExpanded(): boolean</code>
                <p>Check if group is currently expanded</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class FormGroupShowcaseComponent {
  // =============================================================================
  // CONFIGURATION OPTIONS
  // =============================================================================

  variants = signal<FormGroupVariant[]>(['default', 'outlined', 'filled', 'flat']);
  sizes = signal<FormGroupSize[]>(['sm', 'md', 'lg']);
  layouts = signal<FormGroupLayout[]>(['vertical', 'horizontal', 'grid']);
  spacingOptions = signal<FormGroupSpacing[]>(['tight', 'normal', 'loose']);

  // =============================================================================
  // INTERACTIVE CONFIGURATION
  // =============================================================================

  currentConfig = {
    variant: 'default' as FormGroupVariant,
    size: 'md' as FormGroupSize,
    layout: 'vertical' as FormGroupLayout,
    spacing: 'normal' as FormGroupSpacing,
    collapsible: false,
    showBorder: true,
    showProgress: false,
    required: false,
  };

  lastActionSignal = signal<string>('');

  // =============================================================================
  // DEMO FORM
  // =============================================================================

  demoForm = signal(
    new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      newsletter: new FormControl(false),
      notificationType: new FormControl('email', [Validators.required]),
    }),
  );

  // =============================================================================
  // OPTIONS
  // =============================================================================

  languageOptions = signal([
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'pl', label: 'Polish' },
  ]);

  themeOptions = signal([
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ]);

  countryOptions = signal([
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'pl', label: 'Poland' },
  ]);

  sampleOptions = signal([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]);

  notificationOptions = signal([
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push' },
    { value: 'none', label: 'None' },
  ]);

  // =============================================================================
  // ACTIONS
  // =============================================================================

  contactActions = computed(() => [
    createFormGroupAction('Add Contact', () => this.addContact(), {
      type: 'primary',
      icon: '➕',
    }),
    createFormGroupAction('Import', () => this.importContacts(), {
      type: 'secondary',
      icon: '📥',
    }),
  ]);

  interactiveActions = computed(() => [
    createFormGroupAction('Save', () => this.saveGroup(), {
      type: 'primary',
      icon: '💾',
    }),
    createFormGroupAction('Reset', () => this.resetGroup(), {
      type: 'secondary',
      icon: '🔄',
    }),
  ]);

  // =============================================================================
  // METHODS
  // =============================================================================

  addContact(): void {
    this.lastActionSignal.set('Contact action: Add Contact clicked');
  }

  importContacts(): void {
    this.lastActionSignal.set('Contact action: Import clicked');
  }

  saveGroup(): void {
    this.lastActionSignal.set('Interactive action: Save clicked');
  }

  resetGroup(): void {
    this.lastActionSignal.set('Interactive action: Reset clicked');
  }

  onToggleChange(event: any): void {
    this.lastActionSignal.set(`Group toggled: ${event.collapsed ? 'collapsed' : 'expanded'}`);
  }

  onActionClick(event: any): void {
    this.lastActionSignal.set(`Action clicked: ${event.action.label}`);
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
}

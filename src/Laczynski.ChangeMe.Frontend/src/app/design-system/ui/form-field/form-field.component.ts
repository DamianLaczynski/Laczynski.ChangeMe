import {
  Component,
  input,
  output,
  computed,
  signal,
  inject,
  OnInit,
  ContentChild,
  AfterContentInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, NgControl } from '@angular/forms';

import {
  FormFieldConfig,
  FormFieldVariant,
  FormFieldSize,
  FormFieldLayout,
  FormFieldLabelPosition,
  FormFieldValidation,
  FormFieldState,
  FormFieldHint,
  FormFieldStateChangeEvent,
  FormFieldValidationEvent,
  createFormFieldConfig,
  createFormFieldValidation,
  getValidationState,
  shouldShowValidation,
  getPrimaryValidationMessage,
  hasValidationMessages,
  getFormFieldClasses,
  getFormFieldAriaAttributes,
  generateFormFieldId,
} from './form-field.model';

/**
 * Form Field Component
 *
 * Wrapper component for form controls that provides labeling, validation display,
 * help text, and consistent layout. Works with all form controls.
 * Built with Angular Signals API.
 */
@Component({
  selector: 'ds-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-form-field" [class]="containerClasses()">
      <!-- Label (Top/Left Position) -->
      @if (shouldShowLabel() && (labelPosition() === 'top' || labelPosition() === 'left')) {
        <label
          [for]="controlId()"
          class="ds-form-field__label"
          [class.required]="required() && showRequired()"
        >
          {{ label() }}
          @if (required() && showRequired()) {
            <span class="ds-form-field__required" aria-label="Required field">*</span>
          }
        </label>
      }

      <!-- Field Container -->
      <div class="ds-form-field__container">
        <!-- Loading Indicator -->
        @if (loading()) {
          <div class="ds-form-field__loading" aria-label="Loading">
            <span class="ds-form-field__spinner"></span>
          </div>
        }

        <!-- Control Content (ng-content) -->
        <div class="ds-form-field__control" [id]="controlContainerId()">
          <ng-content></ng-content>
        </div>

        <!-- Floating/Inside Label -->
        @if (
          shouldShowLabel() && (labelPosition() === 'floating' || labelPosition() === 'inside')
        ) {
          <label
            [for]="controlId()"
            class="ds-form-field__label ds-form-field__label--floating"
            [class.required]="required() && showRequired()"
          >
            {{ label() }}
            @if (required() && showRequired()) {
              <span class="ds-form-field__required" aria-label="Required field">*</span>
            }
          </label>
        }
      </div>

      <!-- Hint Text -->
      @if (hint()) {
        <div
          class="ds-form-field__hint"
          [class]="'ds-form-field__hint--' + hint()!.type"
          [id]="hintId()"
        >
          @if (hint()!.icon) {
            <span class="ds-form-field__hint-icon">{{ hint()!.icon }}</span>
          }
          {{ hint()!.text }}
        </div>
      }

      <!-- Validation Messages -->
      @if (shouldShowValidationMessages()) {
        <div
          class="ds-form-field__validation"
          [class]="'ds-form-field__validation--' + currentValidationState()"
          [id]="validationId()"
          role="alert"
          [attr.aria-live]="currentValidationState() === 'invalid' ? 'assertive' : 'polite'"
        >
          @if (validationIcon()) {
            <span class="ds-form-field__validation-icon">{{ validationIcon() }}</span>
          }
          {{ primaryValidationMessage() }}
        </div>
      }

      <!-- Character Count (for text inputs) -->
      @if (showCharacterCount() && maxLength()) {
        <div class="ds-form-field__character-count" [id]="characterCountId()">
          {{ currentLength() }} / {{ maxLength() }}
        </div>
      }
    </div>
  `,
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent implements OnInit, AfterContentInit {
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  // Try to get NgControl if available
  @ContentChild(NgControl) private ngControl?: NgControl;

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Form field variant */
  variant = input<FormFieldVariant>('default');

  /** Form field size */
  size = input<FormFieldSize>('md');

  /** Layout orientation */
  layout = input<FormFieldLayout>('vertical');

  /** Label position */
  labelPosition = input<FormFieldLabelPosition>('top');

  /** Field label */
  label = input<string>('');

  /** Whether field is required */
  required = input<boolean>(false);

  /** Whether field is disabled */
  disabled = input<boolean>(false);

  /** Whether field is readonly */
  readonly = input<boolean>(false);

  /** Whether field is loading */
  loading = input<boolean>(false);

  /** Whether to show validation messages */
  showValidation = input<boolean>(true);

  /** Whether to show required indicator */
  showRequired = input<boolean>(true);

  /** Hint configuration */
  hint = input<FormFieldHint | null>(null);

  /** External validation state */
  validation = input<FormFieldValidation | null>(null);

  /** Whether to show character count */
  showCharacterCount = input<boolean>(false);

  /** Maximum character length */
  maxLength = input<number | null>(null);

  /** Current field value (for character count) */
  value = input<any>(null);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Field ID (auto-generated if not provided) */
  fieldId = input<string>('');

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  /** State change events */
  stateChange = output<FormFieldStateChangeEvent>();

  /** Validation events */
  validationChange = output<FormFieldValidationEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal field ID */
  private internalFieldId = signal<string>('');

  /** Internal validation state */
  private internalValidation = signal<FormFieldValidation>(createFormFieldValidation());

  /** Internal focused state */
  private internalFocused = signal<boolean>(false);

  /** Form control reference */
  private formControl = signal<AbstractControl | null>(null);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Final field ID */
  controlId = computed(() => this.fieldId() || this.internalFieldId());

  /** Control container ID */
  controlContainerId = computed(() => `${this.controlId()}-container`);

  /** Hint ID for accessibility */
  hintId = computed(() => `${this.controlId()}-hint`);

  /** Validation ID for accessibility */
  validationId = computed(() => `${this.controlId()}-validation`);

  /** Character count ID */
  characterCountId = computed(() => `${this.controlId()}-count`);

  /** Form field configuration */
  config = computed(
    (): FormFieldConfig =>
      createFormFieldConfig({
        variant: this.variant(),
        size: this.size(),
        layout: this.layout(),
        showValidation: this.showValidation(),
        showRequired: this.showRequired(),
        labelPosition: this.labelPosition(),
      }),
  );

  /** Current validation state */
  currentValidation = computed((): FormFieldValidation => {
    // Priority: external validation > form control validation > internal validation
    if (this.validation()) {
      return this.validation()!;
    }

    const control = this.formControl();
    if (control) {
      return this.getValidationFromControl(control);
    }

    return this.internalValidation();
  });

  /** Current form field state */
  currentState = computed(
    (): FormFieldState => ({
      disabled: this.disabled(),
      readonly: this.readonly(),
      loading: this.loading(),
      focused: this.internalFocused(),
      validation: this.currentValidation(),
    }),
  );

  /** Current validation state type */
  currentValidationState = computed(() => getValidationState(this.currentValidation()));

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = getFormFieldClasses(this.config(), this.currentState());

    if (this.customClasses()) {
      classes.push(this.customClasses());
    }

    return classes.join(' ');
  });

  /** Whether to show label */
  shouldShowLabel = computed(() => !!this.label());

  /** Whether to show validation messages */
  shouldShowValidationMessages = computed(
    () =>
      shouldShowValidation(this.currentValidation(), this.showValidation()) &&
      hasValidationMessages(this.currentValidation()),
  );

  /** Primary validation message to display */
  primaryValidationMessage = computed(() => getPrimaryValidationMessage(this.currentValidation()));

  /** Validation icon based on state */
  validationIcon = computed(() => {
    const state = this.currentValidationState();
    const icons = {
      invalid: '⚠️',
      warning: '⚠️',
      valid: '✓',
      pending: '',
    };
    return icons[state] || '';
  });

  /** Current text length for character count */
  currentLength = computed(() => {
    const value = this.value();
    return typeof value === 'string' ? value.length : 0;
  });

  /** ARIA attributes for the control */
  ariaAttributes = computed(() => {
    const describedBy: string[] = [];

    if (this.hint()) {
      describedBy.push(this.hintId());
    }

    if (this.shouldShowValidationMessages()) {
      describedBy.push(this.validationId());
    }

    if (this.showCharacterCount() && this.maxLength()) {
      describedBy.push(this.characterCountId());
    }

    return getFormFieldAriaAttributes(
      this.controlId(),
      this.currentValidation(),
      this.required(),
      describedBy,
    );
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Generate internal field ID if not provided
    if (!this.fieldId()) {
      this.internalFieldId.set(generateFormFieldId());
    }
  }

  ngAfterContentInit(): void {
    // Set up form control if NgControl is available
    if (this.ngControl?.control) {
      this.formControl.set(this.ngControl.control);
      this.setupFormControlListeners();
    }

    // Set up control element listeners
    this.setupControlElementListeners();
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Set up form control validation listeners */
  private setupFormControlListeners(): void {
    const control = this.formControl();
    if (!control) return;

    // Listen to status changes
    control.statusChanges?.subscribe(() => {
      this.emitValidationChange();
      this.cdr.markForCheck();
    });

    // Listen to value changes
    control.valueChanges?.subscribe(() => {
      this.updateTouchedAndDirty();
      this.cdr.markForCheck();
    });
  }

  /** Set up control element focus/blur listeners */
  private setupControlElementListeners(): void {
    const controlElement = this.getControlElement();
    if (!controlElement) return;

    controlElement.addEventListener('focus', () => {
      this.internalFocused.set(true);
      this.emitStateChange('focus');
    });

    controlElement.addEventListener('blur', () => {
      this.internalFocused.set(false);
      this.updateTouchedAndDirty();
      this.emitStateChange('blur');
    });

    // Apply ARIA attributes
    const ariaAttrs = this.ariaAttributes();
    Object.entries(ariaAttrs).forEach(([key, value]) => {
      controlElement.setAttribute(key, value);
    });
  }

  /** Get the actual form control element */
  private getControlElement(): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector(
      'input, select, textarea, ds-input, ds-select, ds-checkbox, ds-radio',
    );
  }

  /** Get validation state from Angular form control */
  private getValidationFromControl(control: AbstractControl): FormFieldValidation {
    const errors: string[] = [];

    if (control.errors) {
      Object.entries(control.errors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          errors.push(value);
        } else if (value === true) {
          errors.push(this.getDefaultErrorMessage(key));
        } else if (value && typeof value === 'object' && 'message' in value) {
          errors.push(value.message);
        }
      });
    }

    return {
      valid: control.valid,
      errors,
      warnings: [],
      touched: control.touched || false,
      dirty: control.dirty || false,
    };
  }

  /** Get default error message for validation key */
  private getDefaultErrorMessage(key: string): string {
    const messages: Record<string, string> = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      min: 'Value is too small',
      max: 'Value is too large',
      minlength: 'Too few characters',
      maxlength: 'Too many characters',
      pattern: 'Invalid format',
    };

    return messages[key] || `Validation error: ${key}`;
  }

  /** Update touched and dirty state from form control */
  private updateTouchedAndDirty(): void {
    const control = this.formControl();
    if (control) {
      const currentValidation = this.internalValidation();
      this.internalValidation.set({
        ...currentValidation,
        touched: control.touched || false,
        dirty: control.dirty || false,
      });
    }
  }

  /** Emit state change event */
  private emitStateChange(type: FormFieldStateChangeEvent['type']): void {
    const newState = this.currentState();

    this.stateChange.emit({
      fieldId: this.controlId(),
      state: newState,
      previousState: newState, // Could track previous state if needed
      type,
    });
  }

  /** Emit validation change event */
  private emitValidationChange(): void {
    this.validationChange.emit({
      fieldId: this.controlId(),
      validation: this.currentValidation(),
      value: this.value(),
    });
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Focus the form field control */
  focusControl(): void {
    const controlElement = this.getControlElement();
    if (controlElement && typeof controlElement.focus === 'function') {
      controlElement.focus();
    }
  }

  /** Get current validation state */
  getValidationState(): FormFieldValidation {
    return this.currentValidation();
  }

  /** Get current field state */
  getFieldState(): FormFieldState {
    return this.currentState();
  }

  /** Manually trigger validation */
  validateField(): void {
    const control = this.formControl();
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  /** Reset field state */
  resetField(): void {
    const control = this.formControl();
    if (control) {
      control.reset();
    }

    this.internalValidation.set(createFormFieldValidation());
    this.internalFocused.set(false);
  }
}

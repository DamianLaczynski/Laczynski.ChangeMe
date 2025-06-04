import {
  Component,
  input,
  output,
  model,
  computed,
  signal,
  viewChild,
  inject,
  forwardRef,
  DestroyRef,
  OnInit,
  effect,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ComponentSize,
  ComponentChangeEvent,
  ComponentFocusEvent,
  FormComponentState,
  AccessibilityConfig,
  generateComponentId,
  mergeClasses,
  createAccessibilityAttributes,
} from '../shared';

import { IconComponent } from '../shared/icon/icon.component';

import { InputType, InputValidation, validateInputValue, isInputClearable } from './input.model';

/**
 * Input change event payload
 */
export interface InputChangeEvent extends ComponentChangeEvent<string, HTMLInputElement> {
  /** Input validity state */
  valid: boolean;
}

/**
 * Input focus event payload
 */
export interface InputFocusEvent extends ComponentFocusEvent<HTMLInputElement> {}

/**
 * Input clear event payload
 */
export interface InputClearEvent {
  /** Input element reference */
  element: HTMLInputElement;
  /** Previous value before clear */
  previousValue: string;
  /** Timestamp when clear occurred */
  timestamp: number;
}

/**
 * Input enter key event payload
 */
export interface InputEnterEvent {
  /** Current input value */
  value: string;
  /** Input element reference */
  element: HTMLInputElement;
  /** Original keyboard event */
  originalEvent: KeyboardEvent;
  /** Timestamp when enter was pressed */
  timestamp: number;
}

/**
 * Input Component
 *
 * Modern input component with support for multiple types, validation,
 * icons, and accessibility features. Follows Angular Signals API patterns.
 */
@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-input-container" [class]="containerClasses()">
      <!-- Label -->
      @if (label()) {
        <label [for]="inputId()" class="ds-input-label" [class.required]="required()">
          {{ label() }}
          @if (required()) {
            <span class="ds-input-required" aria-label="Required field">*</span>
          }
        </label>
      }

      <!-- Input Wrapper -->
      <div class="ds-input-wrapper" [class]="wrapperClasses()">
        <!-- Start Icon -->
        @if (startIcon()) {
          <span
            class="ds-input-icon ds-input-icon--start"
            aria-hidden="true"
            [innerHTML]="startIcon()"
          >
          </span>
        }

        <!-- Input Element -->
        <input
          #inputElement
          [id]="inputId()"
          [type]="effectiveInputType()"
          [value]="internalValue()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [attr.maxlength]="maxLength() || null"
          [min]="min() || null"
          [max]="max() || null"
          [step]="step() || null"
          [autocomplete]="autocomplete()"
          [attr.inputmode]="inputMode()"
          [style.cursor]="computedCursor()"
          class="ds-input-field"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (keydown.enter)="onEnterKey($event)"
          [attr.aria-invalid]="accessibilityAttributes()['aria-invalid']"
          [attr.aria-describedby]="accessibilityAttributes()['aria-describedby']"
          [attr.aria-label]="accessibilityAttributes()['aria-label']"
        />

        <!-- Clear Button -->
        @if (showClearButton()) {
          <button
            type="button"
            class="ds-input-button ds-input-button--clear"
            (click)="clearInput()"
            [attr.aria-label]="'Clear ' + (label() || 'input')"
            tabindex="-1"
          >
            <app-icon name="x-mark" size="sm" [decorative]="true"></app-icon>
          </button>
        }

        <!-- End Icon -->
        @if (endIcon()) {
          <span class="ds-input-icon ds-input-icon--end" aria-hidden="true" [innerHTML]="endIcon()">
          </span>
        }

        <!-- Password Toggle -->
        @if (type() === 'password') {
          <button
            type="button"
            class="ds-input-button ds-input-button--password-toggle"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
            tabindex="-1"
          >
            <app-icon
              [name]="passwordVisible() ? 'eye-slash' : 'eye'"
              size="sm"
              [decorative]="true"
            ></app-icon>
          </button>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText() || validationState().errorMessage) {
        <div
          class="ds-input-helper"
          [class.error]="!validationState().valid"
          [id]="helperTextId()"
          [attr.role]="validationState().valid ? null : 'alert'"
        >
          {{ validationState().errorMessage || helperText() }}
        </div>
      }

      <!-- Character Counter -->
      @if (showCounter() && maxLength()) {
        <div class="ds-input-counter" [class.warning]="isNearMaxLength()">
          {{ internalValue().length }} / {{ maxLength() }}
        </div>
      }
    </div>
  `,
  styleUrl: './input.component.scss',
  host: {
    '[class.ds-input-host]': 'true',
    '[class.ds-input-host--disabled]': 'disabled()',
    '[class.ds-input-host--readonly]': 'readonly()',
    '[class.ds-input-host--invalid]': '!validationState().valid',
    '[class.ds-input-host--focused]': 'componentState().isFocused',
    '[class.ds-input-host--has-value]': 'hasValue()',
  },
})
export class InputComponent implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Input type */
  type = input<InputType>('text');

  /** Input size */
  size = input<ComponentSize>('sm');

  /** Input label */
  label = input<string>('');

  /** Input placeholder */
  placeholder = input<string>('');

  /** Helper text */
  helperText = input<string>('');

  /** Whether input is disabled */
  disabled = input<boolean>(false);

  /** Whether input is readonly */
  readonly = input<boolean>(false);

  /** Whether input is required */
  required = input<boolean>(false);

  /** Maximum character length */
  maxLength = input<number | null>(null);

  /** Minimum value (for number inputs) */
  min = input<number | null>(null);

  /** Maximum value (for number inputs) */
  max = input<number | null>(null);

  /** Step value (for number inputs) */
  step = input<number | null>(null);

  /** Start icon HTML */
  startIcon = input<string>('');

  /** End icon HTML */
  endIcon = input<string>('');

  /** Whether input is clearable */
  clearable = input<boolean>(false);

  /** Whether to show character counter */
  showCounter = input<boolean>(false);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Autocomplete attribute */
  autocomplete = input<string>('off');

  /** ARIA label for accessibility */
  ariaLabel = input<string>('');

  /** ARIA described by for accessibility */
  ariaDescribedBy = input<string>('');

  // =============================================================================
  // MODEL SIGNALS
  // =============================================================================

  /** Input value model */
  value = model<string>('');

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Emitted when input value changes */
  valueChange = output<InputChangeEvent>();

  /** Emitted when input receives focus */
  focused = output<InputFocusEvent>();

  /** Emitted when input loses focus */
  blurred = output<InputFocusEvent>();

  /** Emitted when clear button is clicked */
  cleared = output<InputClearEvent>();

  /** Emitted when enter key is pressed */
  enterKey = output<InputEnterEvent>();

  // =============================================================================
  // VIEW CHILD SIGNALS
  // =============================================================================

  /** Input element reference */
  private inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Unique component ID */
  componentId = signal(generateComponentId('ds-input'));

  /** Internal value signal */
  protected internalValue = signal<string>('');

  /** Password visibility state */
  protected passwordVisible = signal<boolean>(false);

  /** Validation state */
  protected validationState = signal<InputValidation>({ valid: true });

  /** Component state */
  componentState = signal<FormComponentState>({
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isInvalid: false,
    isRequired: false,
    isReadonly: false,
    variant: 'primary',
    size: 'md',
  });

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Input ID */
  inputId = computed(() => this.componentId());

  /** Helper text ID */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Effective input type considering password visibility */
  effectiveInputType = computed(() => {
    if (this.type() === 'password' && this.passwordVisible()) {
      return 'text';
    }
    return this.type();
  });

  /** Input mode based on type */
  inputMode = computed(() => {
    switch (this.type()) {
      case 'email':
        return 'email';
      case 'number':
        return 'numeric';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      case 'search':
        return 'search';
      default:
        return 'text';
    }
  });

  /** Whether to show clear button */
  showClearButton = computed(() => {
    return (
      this.clearable() &&
      this.hasValue() &&
      !this.disabled() &&
      !this.readonly() &&
      isInputClearable(this.type())
    );
  });

  /** Whether input has value */
  hasValue = computed(() => this.internalValue().length > 0);

  /** Whether near max length (80% threshold) */
  isNearMaxLength = computed(() => {
    const maxLen = this.maxLength();
    if (!maxLen) return false;
    return this.internalValue().length >= maxLen * 0.8;
  });

  /** Computed cursor style */
  computedCursor = computed(() => {
    if (this.disabled()) return 'not-allowed';
    if (this.readonly()) return 'default';
    return 'text';
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-input-container', `ds-input--${this.size()}`];

    if (this.disabled()) classes.push('ds-input--disabled');
    if (this.readonly()) classes.push('ds-input--readonly');
    if (!this.validationState().valid) classes.push('ds-input--error');
    if (this.componentState().isFocused) classes.push('ds-input--focused');
    if (this.hasValue()) classes.push('ds-input--has-value');

    return mergeClasses(...classes, this.customClasses());
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes = ['ds-input-wrapper'];

    if (this.startIcon()) classes.push('ds-input-wrapper--has-start-icon');
    if (this.endIcon()) classes.push('ds-input-wrapper--has-end-icon');
    if (this.showClearButton()) classes.push('ds-input-wrapper--has-clear');
    if (this.type() === 'password') classes.push('ds-input-wrapper--has-password-toggle');

    return classes.join(' ');
  });

  /** Accessibility attributes */
  accessibilityAttributes = computed(() => {
    const config: AccessibilityConfig = {
      ariaLabel: this.ariaLabel() || undefined,
      ariaDescribedBy: this.ariaDescribedBy() || this.helperTextId(),
      ariaInvalid: !this.validationState().valid,
    };
    return createAccessibilityAttributes(config);
  });

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onTouched = () => {};
  private onChange = (value: string) => {};

  writeValue(value: string | null): void {
    const newValue = value || '';
    this.internalValue.set(newValue);
    this.value.set(newValue);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.componentState.update(state => ({ ...state, isDisabled }));
  }

  // =============================================================================
  // LIFECYCLE HOOKS
  // =============================================================================

  constructor() {
    // Update component state when inputs change
    effect(() => {
      this.componentState.update(state => ({
        ...state,
        isDisabled: this.disabled(),
        isReadonly: this.readonly(),
        isRequired: this.required(),
        isInvalid: !this.validationState().valid,
        size: this.size(),
      }));
    });

    // Sync value changes
    effect(() => {
      const currentValue = this.value();
      if (currentValue !== this.internalValue()) {
        this.internalValue.set(currentValue);
        this.validateInput(currentValue);
      }
    });
  }

  ngOnInit(): void {
    // Initialize validation
    this.validateInput(this.internalValue());
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle input value changes
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.internalValue.set(value);
    this.value.set(value);
    this.onChange(value);
    this.validateInput(value);

    const changeEvent: InputChangeEvent = {
      event,
      element: target,
      timestamp: Date.now(),
      value,
      previousValue: this.internalValue(),
      valid: this.validationState().valid,
    };

    this.valueChange.emit(changeEvent);
  }

  /**
   * Handle input focus
   */
  onFocus(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: true }));

    const target = event.target as HTMLInputElement;
    const focusEvent: InputFocusEvent = {
      event,
      element: target,
      timestamp: Date.now(),
    };

    this.focused.emit(focusEvent);
  }

  /**
   * Handle input blur
   */
  onBlur(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: false }));
    this.onTouched();

    const target = event.target as HTMLInputElement;
    const blurEvent: InputFocusEvent = {
      event,
      element: target,
      timestamp: Date.now(),
    };

    this.blurred.emit(blurEvent);
  }

  /**
   * Handle enter key press
   */
  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = event.target as HTMLInputElement;

    const enterEvent: InputEnterEvent = {
      value: this.internalValue(),
      element: target,
      originalEvent: keyboardEvent,
      timestamp: Date.now(),
    };

    this.enterKey.emit(enterEvent);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Clear input value
   */
  clearInput(): void {
    const previousValue = this.internalValue();
    const target = this.inputElement().nativeElement;

    if (!target) return;

    this.internalValue.set('');
    this.value.set('');
    this.onChange('');
    this.validateInput('');

    const clearEvent: InputClearEvent = {
      element: target,
      previousValue,
      timestamp: Date.now(),
    };

    this.cleared.emit(clearEvent);
    target.focus();
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  /**
   * Focus input programmatically
   */
  focusInput(): void {
    try {
      this.inputElement().nativeElement.focus();
    } catch (error) {
      console.warn('Failed to focus input:', error);
    }
  }

  /**
   * Blur input programmatically
   */
  blurInput(): void {
    try {
      this.inputElement().nativeElement.blur();
    } catch (error) {
      console.warn('Failed to blur input:', error);
    }
  }

  /**
   * Select all text in input
   */
  selectAll(): void {
    try {
      this.inputElement().nativeElement.select();
    } catch (error) {
      console.warn('Failed to select input text:', error);
    }
  }

  /**
   * Get current validation state
   */
  getValidationState(): InputValidation {
    return { ...this.validationState() };
  }

  /**
   * Get current component state
   */
  getState(): FormComponentState {
    return { ...this.componentState() };
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /**
   * Validate input value
   */
  private validateInput(value: string): void {
    try {
      const validation = validateInputValue(value, this.type());
      this.validationState.set(validation);
    } catch (error) {
      console.warn('Input validation failed:', error);
      this.validationState.set({
        valid: false,
        errorMessage: 'Validation error occurred',
      });
    }
  }
}

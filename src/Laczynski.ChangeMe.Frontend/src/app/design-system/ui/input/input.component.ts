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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  InputConfig,
  InputType,
  InputSize,
  InputState,
  InputIconPosition,
  InputChangeEvent,
  InputFocusEvent,
  InputClearEvent,
  InputEnterEvent,
  InputValidation,
  createInputConfig,
  validateInputValue,
  getInputStateFromValidation,
  formatInputValue,
  isInputClearable,
  getInputAriaAttributes,
} from './input.model';

/**
 * Input Component
 *
 * Modern input component with support for multiple types, validation,
 * icons, and accessibility features. Follows Angular Signals API patterns.
 */
@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule],
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
          <span class="ds-input-icon ds-input-icon--start" [innerHTML]="startIcon()"></span>
        }

        <!-- Input Element -->
        <input
          #inputElement
          [id]="inputId()"
          [type]="inputType()"
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
          class="ds-input-field"
          (input)="onInput($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (keydown.enter)="onEnterKey($event)"
          [attr.aria-invalid]="ariaAttributes()['aria-invalid'] || null"
          [attr.aria-describedby]="ariaAttributes()['aria-describedby'] || null"
        />

        <!-- Clear Button -->
        @if (showClearButton()) {
          <button
            type="button"
            class="ds-input-clear"
            (click)="clearInput()"
            [attr.aria-label]="'Clear ' + (label() || 'input')"
            tabindex="-1"
          >
            ✕
          </button>
        }

        <!-- End Icon -->
        @if (endIcon()) {
          <span class="ds-input-icon ds-input-icon--end" [innerHTML]="endIcon()"></span>
        }

        <!-- Password Toggle -->
        @if (type() === 'password') {
          <button
            type="button"
            class="ds-input-password-toggle"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
            tabindex="-1"
          >
            {{ passwordVisible() ? '🙈' : '👁️' }}
          </button>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText() || validationState().errorMessage) {
        <div class="ds-input-helper" [class.error]="!validationState().valid" [id]="helperTextId()">
          {{ validationState().errorMessage || helperText() }}
        </div>
      }

      <!-- Character Counter -->
      @if (showCounter() && maxLength()) {
        <div class="ds-input-counter">{{ internalValue().length }} / {{ maxLength() }}</div>
      }
    </div>
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Input type */
  type = input<InputType>('text');

  /** Input size */
  size = input<InputSize>('md');

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

  /** Autocomplete attribute value */
  autocomplete = input<string>('off');

  // =============================================================================
  // MODEL & OUTPUTS
  // =============================================================================

  /** Input value - two-way binding */
  value = model<string>('');

  /** Value change event */
  valueChange = output<InputChangeEvent>();

  /** Focus events */
  focus = output<InputFocusEvent>();

  /** Clear event */
  clear = output<InputClearEvent>();

  /** Enter key event */
  enterKey = output<InputEnterEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  /** Input element reference */
  private inputElement = viewChild.required<HTMLInputElement>('inputElement');

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal value state */
  protected internalValue = signal<string>('');

  /** Whether input is focused */
  protected focused = signal<boolean>(false);

  /** Password visibility toggle */
  protected passwordVisible = signal<boolean>(false);

  /** Component ID for accessibility */
  private componentId = signal<string>(`ds-input-${Math.random().toString(36).substr(2, 9)}`);

  /** Validation state */
  protected validationState = signal<InputValidation>({ valid: true });

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Input ID for accessibility */
  inputId = computed(() => this.componentId());

  /** Helper text ID for accessibility */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Input type with password visibility logic */
  inputType = computed(() => {
    if (this.type() === 'password') {
      return this.passwordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  /** Input mode attribute */
  inputMode = computed(() => {
    switch (this.type()) {
      case 'email':
        return 'email';
      case 'number':
        return 'numeric';
      case 'tel':
        return 'tel';
      case 'search':
        return 'search';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  });

  /** Whether to show clear button */
  showClearButton = computed(() => {
    return (
      this.clearable() &&
      this.internalValue().length > 0 &&
      !this.disabled() &&
      !this.readonly() &&
      isInputClearable(this.type())
    );
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-input'];

    classes.push(`ds-input--${this.size()}`);

    if (this.disabled()) classes.push('ds-input--disabled');
    if (this.readonly()) classes.push('ds-input--readonly');
    if (this.focused()) classes.push('ds-input--focused');
    if (!this.validationState().valid) classes.push('ds-input--error');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes = ['ds-input-wrapper'];

    if (this.startIcon()) classes.push('has-start-icon');
    if (this.endIcon()) classes.push('has-end-icon');
    if (this.showClearButton()) classes.push('has-clear-button');
    if (this.type() === 'password') classes.push('has-password-toggle');

    return classes.join(' ');
  });

  /** ARIA attributes for accessibility */
  ariaAttributes = computed(() => {
    const describedBy: string[] = [];

    if (this.helperText() || this.validationState().errorMessage) {
      describedBy.push(this.helperTextId());
    }

    return getInputAriaAttributes(this.validationState(), describedBy);
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
    this.validateInput(newValue);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled through input signal
  }

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Initialize internal value from model
    this.internalValue.set(this.value());

    // Watch for external value changes
    // Note: In a real implementation, you might want to use effect() here
    this.validateInput(this.value());
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle input change */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let newValue = target.value;

    // Format value based on input type
    newValue = formatInputValue(newValue, this.type());

    // Update internal state
    this.internalValue.set(newValue);
    this.value.set(newValue);

    // Validate input
    this.validateInput(newValue);

    // Emit events
    this.onChange(newValue);
    this.valueChange.emit({
      value: newValue,
      element: target,
      originalEvent: event,
      valid: this.validationState().valid,
    });
  }

  /** Handle input focus */
  onFocus(event: FocusEvent): void {
    this.focused.set(true);

    this.focus.emit({
      element: event.target as HTMLInputElement,
      direction: 'in',
      originalEvent: event,
    });
  }

  /** Handle input blur */
  onBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.onTouched();

    this.focus.emit({
      element: event.target as HTMLInputElement,
      direction: 'out',
      originalEvent: event,
    });
  }

  /** Handle Enter key press */
  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    this.enterKey.emit({
      value: this.internalValue(),
      element: event.target as HTMLInputElement,
      originalEvent: keyboardEvent,
    });
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Clear input value */
  clearInput(): void {
    const previousValue = this.internalValue();
    const element = this.inputElement();

    this.internalValue.set('');
    this.value.set('');
    this.onChange('');
    this.validateInput('');

    // Focus input after clearing
    element.focus();

    this.clear.emit({
      element,
      previousValue,
    });
  }

  /** Toggle password visibility */
  togglePasswordVisibility(): void {
    this.passwordVisible.set(!this.passwordVisible());
  }

  /** Focus the input */
  focusInput(): void {
    this.inputElement().focus();
  }

  /** Blur the input */
  blurInput(): void {
    this.inputElement().blur();
  }

  /** Select all text in input */
  selectAll(): void {
    this.inputElement().select();
  }

  /** Get current validation state */
  getValidationState(): InputValidation {
    return this.validationState();
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Validate input value */
  private validateInput(value: string): void {
    const validation = validateInputValue(value, this.type());
    this.validationState.set(validation);
  }
}

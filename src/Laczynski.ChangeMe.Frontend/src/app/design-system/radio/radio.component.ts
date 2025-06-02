import {
  Component,
  input,
  output,
  model,
  computed,
  signal,
  inject,
  forwardRef,
  ElementRef,
  OnInit,
  HostListener,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ComponentSize } from '../shared';

import {
  RadioOption,
  RadioConfig,
  RadioVariant,
  RadioState,
  RadioGroupLayout,
  RadioChangeEvent,
  RadioFocusEvent,
  RadioValidation,
  RadioComponentState,
  createRadioConfig,
  createRadioState,
  validateRadioValue,
  getRadioState,
  isRadioOptionSelected,
  getSelectedRadioOption,
  getNextRadioOption,
  getRadioAriaAttributes,
  getRadioGroupAriaAttributes,
  getRadioClasses,
  generateRadioGroupName,
  RADIO_SIZE_CONFIG,
} from './radio.model';

/**
 * Radio Component
 *
 * Radio button group component for single selection from a list of options.
 * Built with Angular Signals API and comprehensive accessibility support.
 */
@Component({
  selector: 'ds-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-radio-container" [class]="containerClasses()">
      <!-- Radio Group -->
      <fieldset class="ds-radio-group" [class]="groupClasses()">
        @if (label()) {
          <legend class="ds-radio-group__legend">
            {{ label() }}
            @if (required()) {
              <span class="ds-radio__required" aria-label="Required field">*</span>
            }
          </legend>
        }

        <!-- Radio Options -->
        <div
          class="ds-radio-group__options"
          [attr.role]="groupAriaAttributes()['role']"
          [attr.aria-invalid]="groupAriaAttributes()['aria-invalid'] || null"
          [attr.aria-describedby]="groupAriaAttributes()['aria-describedby'] || null"
        >
          @for (option of options(); track option.value; let optionIndex = $index) {
            <label class="ds-radio" [class]="getOptionClasses(option)">
              <input
                type="radio"
                class="ds-radio__input"
                [name]="groupName()"
                [value]="option.value"
                [checked]="isSelected(option)"
                [disabled]="disabled() || option.disabled"
                [attr.aria-checked]="getOptionAriaAttributes(option)['aria-checked']"
                [attr.aria-invalid]="getOptionAriaAttributes(option)['aria-invalid'] || null"
                [attr.aria-describedby]="
                  getOptionAriaAttributes(option)['aria-describedby'] || null
                "
                [attr.tabindex]="getTabIndex(option, optionIndex)"
                (change)="onOptionChange(option, $event)"
                (focus)="onFocus(option, $event)"
                (blur)="onBlur(option, $event)"
                (keydown)="onKeydown(option, $event)"
              />
              <span class="ds-radio__mark"></span>
              <div class="ds-radio__content">
                <span class="ds-radio__label">{{ option.label }}</span>
                @if (option.description) {
                  <span class="ds-radio__description" [id]="getOptionDescriptionId(option)">
                    {{ option.description }}
                  </span>
                }
              </div>
            </label>
          }
        </div>
      </fieldset>

      <!-- Helper Text / Error Message -->
      @if (helperText() || validationState().errorMessage) {
        <div
          class="ds-radio__helper"
          [class.error]="!validationState().valid"
          [id]="helperTextId()"
        >
          {{ validationState().errorMessage || helperText() }}
        </div>
      }
    </div>
  `,
  styleUrl: './radio.component.scss',
})
export class RadioComponent<T = any> implements ControlValueAccessor, OnInit {
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Radio variant */
  variant = input<RadioVariant>('default');

  /** Radio size */
  size = input<ComponentSize>('md');

  /** Radio group label */
  label = input<string>('');

  /** Helper text */
  helperText = input<string>('');

  /** Radio options */
  options = input<RadioOption<T>[]>([]);

  /** Whether radio group is disabled */
  disabled = input<boolean>(false);

  /** Whether radio group is required */
  required = input<boolean>(false);

  /** Group layout */
  groupLayout = input<RadioGroupLayout>('vertical');

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Group name for radio inputs */
  name = input<string>('');

  // =============================================================================
  // MODEL & OUTPUTS
  // =============================================================================

  /** Selected value - two-way binding */
  value = model<T | null>(null);

  /** Selection change event */
  selectionChange = output<RadioChangeEvent<T>>();

  /** Focus events */
  focus = output<RadioFocusEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Component ID for accessibility */
  private componentId = signal<string>(`ds-radio-${Math.random().toString(36).substr(2, 9)}`);

  /** Validation state */
  protected validationState = signal<RadioValidation>({ valid: true });

  /** Internal selected value */
  protected internalValue = signal<T | null>(null);

  /** Currently focused option index */
  protected focusedIndex = signal<number>(-1);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Group name for radio inputs */
  groupName = computed(() => this.name() || this.componentId());

  /** Helper text ID for accessibility */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Current radio state for each option */
  optionStates = computed(() => {
    const value = this.internalValue();
    const validation = this.validationState();

    return this.options().map(option => ({
      option,
      state: getRadioState(value, option.value, option.disabled || this.disabled(), validation),
    }));
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-radio-container'];

    classes.push(`ds-radio-container--${this.size()}`);
    classes.push(`ds-radio-container--${this.variant()}`);

    if (this.disabled()) classes.push('ds-radio-container--disabled');
    if (!this.validationState().valid) classes.push('ds-radio-container--error');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Group CSS classes */
  groupClasses = computed(() => {
    const classes = ['ds-radio-group'];

    classes.push(`ds-radio-group--${this.groupLayout()}`);

    return classes.join(' ');
  });

  /** Group ARIA attributes */
  groupAriaAttributes = computed(() => {
    const describedBy: string[] = [];

    if (this.helperText() || this.validationState().errorMessage) {
      describedBy.push(this.helperTextId());
    }

    return getRadioGroupAriaAttributes(this.validationState(), describedBy);
  });

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onTouched = () => {};
  private onChange = (value: T | null) => {};

  writeValue(value: T | null): void {
    this.internalValue.set(value);
    this.value.set(value);
    this.validateValue(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
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
    const initialValue = this.value();
    this.writeValue(initialValue);
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle radio option change */
  onOptionChange(option: RadioOption<T>, event: Event): void {
    if (this.disabled() || option.disabled) return;

    const previousValue = this.internalValue();
    this.updateValue(option.value, option, event, previousValue);
  }

  /** Handle focus events */
  onFocus(option: RadioOption<T>, event: FocusEvent): void {
    const optionIndex = this.options().findIndex(opt => opt.value === option.value);
    this.focusedIndex.set(optionIndex);

    this.focus.emit({
      event,
      element: event.target as HTMLInputElement,
      timestamp: Date.now(),
      direction: 'in',
      value: option.value,
    });
  }

  /** Handle blur events */
  onBlur(option: RadioOption<T>, event: FocusEvent): void {
    this.onTouched();

    this.focus.emit({
      event,
      element: event.target as HTMLInputElement,
      timestamp: Date.now(),
      direction: 'out',
      value: option.value,
    });
  }

  /** Handle keyboard navigation */
  onKeydown(option: RadioOption<T>, event: KeyboardEvent): void {
    const currentValue = this.internalValue();
    let nextOption: RadioOption<T> | null = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextOption = getNextRadioOption(this.options(), currentValue, 'next');
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextOption = getNextRadioOption(this.options(), currentValue, 'previous');
        break;

      case ' ':
      case 'Enter':
        event.preventDefault();
        if (!option.disabled) {
          this.selectOption(option, event);
        }
        break;

      default:
        return;
    }

    if (nextOption) {
      this.selectOption(nextOption, event);
      this.focusOption(nextOption);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Update value and emit events */
  private updateValue(
    newValue: T,
    option: RadioOption<T>,
    originalEvent: Event,
    previousValue: T | null,
  ): void {
    this.internalValue.set(newValue);
    this.value.set(newValue);
    this.onChange(newValue);
    this.validateValue(newValue);

    this.selectionChange.emit({
      event: originalEvent,
      element: originalEvent.target as HTMLInputElement,
      timestamp: Date.now(),
      value: newValue,
      previousValue: previousValue || undefined,
      option,
    });
  }

  /** Select specific option */
  private selectOption(option: RadioOption<T>, originalEvent: Event): void {
    if (this.disabled() || option.disabled) return;

    const previousValue = this.internalValue();
    this.updateValue(option.value, option, originalEvent, previousValue);
  }

  /** Focus specific option */
  private focusOption(option: RadioOption<T>): void {
    const input = this.elementRef.nativeElement.querySelector(
      `input[value="${option.value}"]`,
    ) as HTMLInputElement;

    if (input) {
      input.focus();
    }
  }

  /** Check if option is selected */
  isSelected(option: RadioOption<T>): boolean {
    return isRadioOptionSelected(option, this.internalValue());
  }

  /** Get option CSS classes */
  getOptionClasses(option: RadioOption<T>): string {
    const classes = ['ds-radio'];
    const optionState = this.optionStates().find(state => state.option.value === option.value);

    classes.push(`ds-radio--${this.size()}`);
    classes.push(`ds-radio--${this.variant()}`);

    if (optionState) {
      classes.push(`ds-radio--${optionState.state}`);
    }

    if (this.disabled() || option.disabled) classes.push('ds-radio--disabled');
    if (option.customClasses) classes.push(option.customClasses);

    return classes.join(' ');
  }

  /** Get option ARIA attributes */
  getOptionAriaAttributes(option: RadioOption<T>): Record<string, string> {
    const describedBy: string[] = [];

    if (option.description) {
      describedBy.push(this.getOptionDescriptionId(option));
    }

    if (this.helperText() || this.validationState().errorMessage) {
      describedBy.push(this.helperTextId());
    }

    return getRadioAriaAttributes(
      option,
      this.internalValue(),
      this.validationState(),
      this.groupName(),
      describedBy,
    );
  }

  /** Get option description ID */
  getOptionDescriptionId(option: RadioOption<T>): string {
    return `${this.componentId()}-option-${option.value}-desc`;
  }

  /** Get tab index for option */
  getTabIndex(option: RadioOption<T>, index: number): number {
    // Only the selected option or first enabled option should be tabbable
    if (this.disabled() || option.disabled) return -1;

    const selectedOption = getSelectedRadioOption(this.options(), this.internalValue());
    if (selectedOption) {
      return option.value === selectedOption.value ? 0 : -1;
    }

    // If no selection, first enabled option is tabbable
    const firstEnabledIndex = this.options().findIndex(opt => !opt.disabled);
    return index === firstEnabledIndex ? 0 : -1;
  }

  /** Validate current value */
  private validateValue(value: T | null): void {
    const validation = validateRadioValue(value, this.required());
    this.validationState.set(validation);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Clear selection */
  clear(): void {
    this.updateValue(null as any, {} as RadioOption<T>, new Event('clear'), this.internalValue());
  }

  /** Select option by value */
  selectByValue(value: T): void {
    const option = this.options().find(opt => opt.value === value);
    if (option && !option.disabled && !this.disabled()) {
      this.selectOption(option, new Event('programmatic'));
    }
  }

  /** Focus the radio group */
  focusGroup(): void {
    const selectedOption = getSelectedRadioOption(this.options(), this.internalValue());
    const targetOption = selectedOption || this.options().find(opt => !opt.disabled);

    if (targetOption) {
      this.focusOption(targetOption);
    }
  }

  /** Get current validation state */
  getValidationState(): RadioValidation {
    return this.validationState();
  }

  /** Get selected option */
  getSelectedOption(): RadioOption<T> | null {
    return getSelectedRadioOption(this.options(), this.internalValue());
  }
}

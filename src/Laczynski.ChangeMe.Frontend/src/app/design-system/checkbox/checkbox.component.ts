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
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ComponentSize,
  ComponentFocusEvent,
  generateComponentId,
  mergeClasses,
  getSizeConfiguration,
} from '../shared';

import {
  CheckboxOption,
  CheckboxConfig,
  CheckboxVariant,
  CheckboxComponentState,
  CheckboxGroupLayout,
  CheckboxChangeEvent,
  CheckboxFocusEvent,
  CheckboxValidation,
  createCheckboxConfig,
  createCheckboxState,
  validateCheckboxValue,
  getCheckboxState,
  isCheckboxOptionSelected,
  toggleCheckboxOptionSelection,
  getIndeterminateState,
  selectAllOptions,
  deselectAllOptions,
  getCheckboxAriaAttributes,
  getCheckboxClasses,
  generateCheckboxId,
  CHECKBOX_SIZE_CONFIG,
} from './checkbox.model';

/**
 * Checkbox Component
 *
 * Versatile checkbox component supporting single checkboxes, checkbox groups,
 * indeterminate states, and comprehensive accessibility features.
 * Built with Angular Signals API and modern design system patterns.
 */
@Component({
  selector: 'ds-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-checkbox-container" [class]="containerClasses()">
      <!-- Single Checkbox -->
      @if (!isGroup()) {
        <label class="ds-checkbox" [class]="checkboxClasses()">
          <input
            type="checkbox"
            class="ds-checkbox__input"
            [checked]="internalChecked()"
            [indeterminate]="indeterminate()"
            [disabled]="disabled()"
            [attr.aria-checked]="ariaAttributes()['aria-checked']"
            [attr.aria-invalid]="ariaAttributes()['aria-invalid'] || null"
            [attr.aria-describedby]="ariaAttributes()['aria-describedby'] || null"
            (change)="onSingleCheckboxChange($event)"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
          />
          <span class="ds-checkbox__checkmark"></span>
          @if (label()) {
            <span class="ds-checkbox__label">
              {{ label() }}
              @if (required()) {
                <span class="ds-checkbox__required" aria-label="Required field">*</span>
              }
            </span>
          }
        </label>
      }

      <!-- Checkbox Group -->
      @if (isGroup()) {
        <fieldset class="ds-checkbox-group" [class]="groupClasses()">
          @if (label()) {
            <legend class="ds-checkbox-group__legend">
              {{ label() }}
              @if (required()) {
                <span class="ds-checkbox__required" aria-label="Required field">*</span>
              }
            </legend>
          }

          <!-- Select All Checkbox (if enabled) -->
          @if (showSelectAll()) {
            <label class="ds-checkbox ds-checkbox--select-all" [class]="checkboxClasses()">
              <input
                type="checkbox"
                class="ds-checkbox__input"
                [checked]="selectAllState().checked"
                [indeterminate]="selectAllState().indeterminate"
                [disabled]="disabled() || availableOptions().length === 0"
                (change)="onSelectAllChange($event)"
              />
              <span class="ds-checkbox__checkmark"></span>
              <span class="ds-checkbox__label">{{ selectAllText() }}</span>
            </label>
          }

          <!-- Option Checkboxes -->
          <div class="ds-checkbox-group__options">
            @for (option of options(); track option.value) {
              <label class="ds-checkbox" [class]="getOptionClasses(option)">
                <input
                  type="checkbox"
                  class="ds-checkbox__input"
                  [checked]="isSelected(option)"
                  [disabled]="disabled() || option.disabled"
                  [attr.aria-describedby]="
                    option.description ? getOptionDescriptionId(option) : null
                  "
                  (change)="onOptionChange(option, $event)"
                  (focus)="onFocus($event)"
                  (blur)="onBlur($event)"
                />
                <span class="ds-checkbox__checkmark"></span>
                <div class="ds-checkbox__content">
                  <span class="ds-checkbox__label">{{ option.label }}</span>
                  @if (option.description) {
                    <span class="ds-checkbox__description" [id]="getOptionDescriptionId(option)">
                      {{ option.description }}
                    </span>
                  }
                </div>
              </label>
            }
          </div>
        </fieldset>
      }

      <!-- Helper Text / Error Message -->
      @if (helperText() || validationState().errorMessage) {
        <div
          class="ds-checkbox__helper"
          [class.error]="!validationState().valid"
          [id]="helperTextId()"
        >
          {{ validationState().errorMessage || helperText() }}
        </div>
      }
    </div>
  `,
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent<T = any> implements ControlValueAccessor, OnInit {
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Checkbox variant */
  variant = input<CheckboxVariant>('default');

  /** Checkbox size */
  size = input<ComponentSize>('sm');

  /** Checkbox label */
  label = input<string>('');

  /** Helper text */
  helperText = input<string>('');

  /** Whether checkbox is disabled */
  disabled = input<boolean>(false);

  /** Whether checkbox is required */
  required = input<boolean>(false);

  /** Whether checkbox is indeterminate (single checkbox only) */
  indeterminate = input<boolean>(false);

  /** Whether this is a checkbox group */
  isGroup = input<boolean>(false);

  /** Options for checkbox group */
  options = input<CheckboxOption<T>[]>([]);

  /** Group layout */
  groupLayout = input<CheckboxGroupLayout>('vertical');

  /** Whether to show select all option (group only) */
  showSelectAll = input<boolean>(false);

  /** Select all text */
  selectAllText = input<string>('Select All');

  /** Custom CSS classes */
  customClasses = input<string>('');

  // =============================================================================
  // MODEL & OUTPUTS
  // =============================================================================

  /** Checkbox value - two-way binding */
  value = model<boolean | T[]>(false);

  /** Emitted when checkbox state changes */
  checkedChange = output<CheckboxChangeEvent<T>>();

  /** Emitted when checkbox gains/loses focus */
  focus = output<CheckboxFocusEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Component ID for accessibility */
  private componentId = signal<string>(generateCheckboxId());

  /** Validation state */
  protected validationState = signal<CheckboxValidation>({ valid: true });

  /** Internal checked state */
  protected internalChecked = signal<boolean>(false);

  /** Internal selected values for group */
  protected internalSelectedValues = signal<T[]>([]);

  /** Component state */
  protected componentState = signal<CheckboxComponentState>(createCheckboxState());

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Helper text ID for accessibility */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Available options (non-disabled) */
  availableOptions = computed(() => {
    return this.options().filter(option => !option.disabled);
  });

  /** Select all state */
  selectAllState = computed(() => {
    return getIndeterminateState(this.options(), this.internalSelectedValues());
  });

  /** Current component state */
  currentState = computed((): CheckboxComponentState => {
    return {
      ...this.componentState(),
      isChecked: this.internalChecked(),
      isIndeterminate: this.indeterminate(),
      variant: this.variant() as any,
      size: this.size(),
      checkboxState: getCheckboxState(
        this.internalChecked(),
        this.indeterminate(),
        this.disabled(),
        this.validationState(),
      ),
    };
  });

  /** Configuration */
  config = computed(() =>
    createCheckboxConfig({
      variant: this.variant(),
      size: this.size(),
      isGroup: this.isGroup(),
      groupLayout: this.groupLayout(),
    }),
  );

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-checkbox-container'];

    classes.push(`ds-checkbox--${this.size()}`);
    classes.push(`ds-checkbox--${this.variant()}`);

    if (this.disabled()) classes.push('ds-checkbox--disabled');
    if (!this.validationState().valid) classes.push('ds-checkbox--error');
    if (this.isGroup()) classes.push('ds-checkbox-container--group');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Checkbox CSS classes */
  checkboxClasses = computed(() => {
    const classes = ['ds-checkbox'];

    classes.push(`ds-checkbox--${this.size()}`);

    if (this.disabled()) classes.push('ds-checkbox--disabled');
    if (!this.validationState().valid) classes.push('ds-checkbox--error');

    return classes.join(' ');
  });

  /** Group CSS classes */
  groupClasses = computed(() => {
    const classes = ['ds-checkbox-group'];
    classes.push(`ds-checkbox-group--${this.groupLayout()}`);
    return classes.join(' ');
  });

  /** ARIA attributes */
  ariaAttributes = computed(() => {
    const describedBy = this.helperText() ? [this.helperTextId()] : [];
    return getCheckboxAriaAttributes(
      this.internalChecked(),
      this.indeterminate(),
      this.validationState(),
      describedBy,
    );
  });

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onTouched = () => {};
  private onChange = (value: boolean | T[]) => {};

  writeValue(value: boolean | T[]): void {
    if (this.isGroup()) {
      const arrayValue = Array.isArray(value) ? value : [];
      this.internalSelectedValues.set(arrayValue);
      this.value.set(arrayValue);
    } else {
      const booleanValue = Boolean(value);
      this.internalChecked.set(booleanValue);
      this.value.set(booleanValue);
    }
  }

  registerOnChange(fn: (value: boolean | T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.componentState.update(state => ({ ...state, isDisabled }));
  }

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Update component state when inputs change
    effect(() => {
      this.componentState.update(state => ({
        ...state,
        isDisabled: this.disabled(),
        isRequired: this.required(),
        variant: this.variant() as any,
        size: this.size(),
      }));
    });
  }

  ngOnInit(): void {
    // Initialize validation
    this.validateValue(this.value());
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle single checkbox changes */
  onSingleCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    this.updateValue(checked, event);
  }

  /** Handle option checkbox changes */
  onOptionChange(option: CheckboxOption<T>, event: Event): void {
    const newValues = toggleCheckboxOptionSelection(option, this.internalSelectedValues());
    this.updateValue(newValues, event, option);
  }

  /** Handle select all changes */
  onSelectAllChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    const newValues = checked ? selectAllOptions(this.options()) : deselectAllOptions<T>();

    this.updateValue(newValues, event, undefined, true);
  }

  /** Handle focus events */
  onFocus(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: true }));

    const focusEvent: CheckboxFocusEvent = {
      event,
      element: event.target as HTMLInputElement,
      timestamp: Date.now(),
      direction: 'in',
    };

    this.focus.emit(focusEvent);
  }

  /** Handle blur events */
  onBlur(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: false }));
    this.onTouched();

    const focusEvent: CheckboxFocusEvent = {
      event,
      element: event.target as HTMLInputElement,
      timestamp: Date.now(),
      direction: 'out',
    };

    this.focus.emit(focusEvent);
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Update value and emit events */
  private updateValue(
    newValue: boolean | T[],
    originalEvent: Event,
    source?: CheckboxOption<T>,
    isSelectAll?: boolean,
  ): void {
    const previousValue = this.value();

    if (this.isGroup()) {
      const arrayValue = Array.isArray(newValue) ? newValue : [];
      this.internalSelectedValues.set(arrayValue);
      this.value.set(arrayValue);
      this.onChange(arrayValue);
    } else {
      const booleanValue = Boolean(newValue);
      this.internalChecked.set(booleanValue);
      this.value.set(booleanValue);
      this.onChange(booleanValue);
    }

    this.validateValue(newValue);

    // Emit change event
    const changeEvent: CheckboxChangeEvent<T> = {
      event: originalEvent,
      element: originalEvent.target as HTMLInputElement,
      timestamp: Date.now(),
      value: newValue,
      previousValue,
      checked: newValue,
      source,
      isSelectAll,
    };

    this.checkedChange.emit(changeEvent);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Check if option is selected */
  isSelected(option: CheckboxOption<T>): boolean {
    return isCheckboxOptionSelected(option, this.internalSelectedValues());
  }

  /** Get option CSS classes */
  getOptionClasses(option: CheckboxOption<T>): string {
    const classes = ['ds-checkbox'];

    classes.push(`ds-checkbox--${this.size()}`);

    if (this.disabled() || option.disabled) classes.push('ds-checkbox--disabled');
    if (!this.validationState().valid) classes.push('ds-checkbox--error');
    if (option.customClasses) classes.push(option.customClasses);

    return classes.join(' ');
  }

  /** Get option description ID */
  getOptionDescriptionId(option: CheckboxOption<T>): string {
    return `${this.componentId()}-option-${option.value}-desc`;
  }

  /** Validate current value */
  private validateValue(value: boolean | T[]): void {
    const validation = validateCheckboxValue(value, this.required());
    this.validationState.set(validation);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Clear all selections */
  clear(): void {
    if (this.isGroup()) {
      this.updateValue([], new Event('clear'));
    } else {
      this.updateValue(false, new Event('clear'));
    }
  }

  /** Select all options (group only) */
  selectAll(): void {
    if (this.isGroup()) {
      const allValues = selectAllOptions(this.options());
      this.updateValue(allValues, new Event('selectAll'));
    }
  }

  /** Deselect all options */
  deselectAll(): void {
    this.clear();
  }

  /** Focus checkbox */
  focusCheckbox(): void {
    try {
      const input = this.elementRef.nativeElement.querySelector('input[type="checkbox"]');
      input?.focus();
    } catch (error) {
      console.warn('Failed to focus checkbox:', error);
    }
  }

  /** Get validation state */
  getValidationState(): CheckboxValidation {
    return { ...this.validationState() };
  }
}

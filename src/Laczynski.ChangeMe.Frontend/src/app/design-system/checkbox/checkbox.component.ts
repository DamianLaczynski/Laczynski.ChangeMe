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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  CheckboxOption,
  CheckboxConfig,
  CheckboxVariant,
  CheckboxSize,
  CheckboxState,
  CheckboxGroupLayout,
  CheckboxChangeEvent,
  CheckboxFocusEvent,
  CheckboxValidation,
  createCheckboxConfig,
  validateCheckboxValue,
  getCheckboxState,
  isCheckboxOptionSelected,
  toggleCheckboxOptionSelection,
  getIndeterminateState,
  selectAllOptions,
  deselectAllOptions,
  getCheckboxAriaAttributes,
} from './checkbox.model';

/**
 * Checkbox Component
 *
 * Versatile checkbox component supporting single checkboxes, checkbox groups,
 * indeterminate states, and comprehensive accessibility features.
 * Built with Angular Signals API.
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
  size = input<CheckboxSize>('md');

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

  /** Checked state (single) or selected values (group) - two-way binding */
  value = model<boolean | T[]>(false);

  /** Change event */
  checkedChange = output<CheckboxChangeEvent<T>>();

  /** Focus events */
  focus = output<CheckboxFocusEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Component ID for accessibility */
  private componentId = signal<string>(`ds-checkbox-${Math.random().toString(36).substr(2, 9)}`);

  /** Validation state */
  protected validationState = signal<CheckboxValidation>({ valid: true });

  /** Internal checked state (for single checkbox) */
  protected internalChecked = signal<boolean>(false);

  /** Internal selected values (for checkbox group) */
  protected internalSelectedValues = signal<T[]>([]);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Helper text ID for accessibility */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Available (non-disabled) options */
  availableOptions = computed(() => {
    return this.options().filter(option => !option.disabled);
  });

  /** Select all checkbox state */
  selectAllState = computed(() => {
    if (!this.isGroup()) return { checked: false, indeterminate: false };
    return getIndeterminateState(this.availableOptions(), this.internalSelectedValues());
  });

  /** Current checkbox state */
  currentState = computed((): CheckboxState => {
    const checked = this.isGroup()
      ? this.internalSelectedValues().length > 0
      : this.internalChecked();
    return getCheckboxState(checked, this.indeterminate(), this.disabled(), this.validationState());
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-checkbox-container'];

    classes.push(`ds-checkbox-container--${this.size()}`);
    classes.push(`ds-checkbox-container--${this.variant()}`);

    if (this.disabled()) classes.push('ds-checkbox-container--disabled');
    if (!this.validationState().valid) classes.push('ds-checkbox-container--error');
    if (this.isGroup()) classes.push('ds-checkbox-container--group');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Checkbox CSS classes */
  checkboxClasses = computed(() => {
    const classes = ['ds-checkbox'];

    classes.push(`ds-checkbox--${this.size()}`);
    classes.push(`ds-checkbox--${this.variant()}`);
    classes.push(`ds-checkbox--${this.currentState()}`);

    if (this.disabled()) classes.push('ds-checkbox--disabled');

    return classes.join(' ');
  });

  /** Group CSS classes */
  groupClasses = computed(() => {
    const classes = ['ds-checkbox-group'];

    classes.push(`ds-checkbox-group--${this.groupLayout()}`);

    return classes.join(' ');
  });

  /** ARIA attributes for accessibility */
  ariaAttributes = computed(() => {
    const describedBy: string[] = [];

    if (this.helperText() || this.validationState().errorMessage) {
      describedBy.push(this.helperTextId());
    }

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
      const boolValue = Boolean(value);
      this.internalChecked.set(boolValue);
      this.value.set(boolValue);
    }
    this.validateValue(value);
  }

  registerOnChange(fn: (value: boolean | T[]) => void): void {
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
    // Initialize internal state from model
    const initialValue = this.value();
    this.writeValue(initialValue);
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle single checkbox change */
  onSingleCheckboxChange(event: Event): void {
    if (this.disabled()) return;

    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    this.updateValue(checked, event);
  }

  /** Handle checkbox group option change */
  onOptionChange(option: CheckboxOption<T>, event: Event): void {
    if (this.disabled() || option.disabled) return;

    const newValues = toggleCheckboxOptionSelection(option, this.internalSelectedValues());

    this.updateValue(newValues, event, option);
  }

  /** Handle select all change */
  onSelectAllChange(event: Event): void {
    if (this.disabled()) return;

    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    const newValues = checked ? selectAllOptions(this.availableOptions()) : deselectAllOptions();

    this.updateValue(newValues, event);
  }

  /** Handle focus events */
  onFocus(event: FocusEvent): void {
    this.focus.emit({
      direction: 'in',
      originalEvent: event,
    });
  }

  /** Handle blur events */
  onBlur(event: FocusEvent): void {
    this.onTouched();

    this.focus.emit({
      direction: 'out',
      originalEvent: event,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Update internal value and emit events */
  private updateValue(
    newValue: boolean | T[],
    originalEvent: Event,
    source?: CheckboxOption<T>,
  ): void {
    if (this.isGroup()) {
      this.internalSelectedValues.set(newValue as T[]);
    } else {
      this.internalChecked.set(newValue as boolean);
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.validateValue(newValue);

    this.checkedChange.emit({
      checked: newValue,
      originalEvent,
      source,
    });
  }

  /** Check if option is selected */
  isSelected(option: CheckboxOption<T>): boolean {
    return isCheckboxOptionSelected(option, this.internalSelectedValues());
  }

  /** Get option CSS classes */
  getOptionClasses(option: CheckboxOption<T>): string {
    const classes = [this.checkboxClasses()];

    if (option.disabled) classes.push('ds-checkbox--disabled');
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
    const clearedValue = this.isGroup() ? [] : false;
    this.updateValue(clearedValue, new Event('clear'));
  }

  /** Select all options (group only) */
  selectAll(): void {
    if (!this.isGroup()) return;

    const allValues = selectAllOptions(this.availableOptions());
    this.updateValue(allValues, new Event('selectAll'));
  }

  /** Deselect all options (group only) */
  deselectAll(): void {
    if (!this.isGroup()) return;

    this.updateValue([], new Event('deselectAll'));
  }

  /** Focus the checkbox */
  focusCheckbox(): void {
    const input = this.elementRef.nativeElement.querySelector('.ds-checkbox__input');
    input?.focus();
  }

  /** Get current validation state */
  getValidationState(): CheckboxValidation {
    return this.validationState();
  }
}

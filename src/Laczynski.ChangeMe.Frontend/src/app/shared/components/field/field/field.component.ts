import { Component, OnInit, OnDestroy, input, output, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputVariant, Size, StateType } from '../../utils';
import { IconComponent } from '../../icon/icon.component';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'toggle'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'datetime-local'
  | 'week'
  | 'month'
  | 'year'
  | 'file'
  | 'color'
  | 'range'
  | 'slider'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'radio-group';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  imports: [CommonModule, IconComponent],
})
export class FieldComponent implements ControlValueAccessor, OnInit, OnDestroy {
  fieldType = input<FieldType>('text');
  variant = input<InputVariant>('filled');
  label = input<string>('');
  placeholder = input<string>('');
  helpText = input<string>('');
  errorText = input<string>('');
  warningText = input<string>('');
  successText = input<string>('');
  required = input<boolean>(false);
  disabled = model<boolean>(false);
  readonly = model<boolean>(false);
  size = input<Size>('medium');
  state = input<StateType>('info');
  name = input<string>('');
  id = model<string | number>('');
  autocomplete = input<string | null>(null);
  showClearButton = input<boolean>(true);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  inlineEdit = input<boolean>(false);
  displayValue = input<string>('');
  isEditModeValue = input<boolean>(false);

  enterEdit = output<void>();
  change = output<any>();
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();
  keyup = output<KeyboardEvent>();
  keydown = output<KeyboardEvent>();
  save = output<any>();
  cancel = output<void>();

  value: any = '';
  protected _isFocused = false;
  protected _isEditMode = false;
  protected _previousValue: any = '';
  protected _isCancelling = false;

  // ControlValueAccessor implementation
  protected onChange = (value: any) => {};
  protected onTouched = () => {};

  fieldClasses(): string {
    const classes = ['field'];

    classes.push(`field--${this.size()}`);

    classes.push(`field--${this.state()}`);

    if (this.disabled()) {
      classes.push('field--disabled');
    }

    return classes.join(' ');
  }

  get wrapperClasses(): string {
    const classes = [`input-wrapper--${this.size()}`, `input-wrapper--${this.variant()}`];

    classes.push(`input-wrapper--${this.state()}`);

    if (this.disabled()) {
      classes.push('input-wrapper--disabled');
    }

    if (this.readonly()) {
      classes.push('input-wrapper--read-only');
    }

    return classes.join(' ');
  }

  get labelClasses(): string {
    const classes = [`input-label--${this.size()}`];

    if (this.disabled()) {
      classes.push('input-label--disabled');
    }

    if (this.required()) {
      classes.push('input-label--required');
    }

    return classes.join(' ');
  }

  isFocused(): boolean {
    return this._isFocused;
  }

  ngOnInit(): void {
    if (!this.id()) {
      if (this.name()) {
        this.id.set(this.name());
      } else {
        this.id.set(this.generateFieldId());
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onFocus(event: FocusEvent): void {
    this._isFocused = true;
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this._isFocused = false;
    this.onTouched();
    this.blur.emit(event);

    // Inline edit: save on blur (but not if we're cancelling)
    if (this.inlineEdit() && this._isEditMode && !this._isCancelling) {
      this.saveChanges();
    }
    // Reset cancelling flag after blur completes
    if (this._isCancelling) {
      this._isCancelling = false;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keydown.emit(event);

    // Inline edit: handle Enter, Esc, Tab
    if (this.inlineEdit() && this._isEditMode) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.saveChanges();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.cancelChanges();
      } else if (event.key === 'Tab') {
        // Tab will trigger blur, which will save
        // Don't prevent default to allow normal tab navigation
      }
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  setReadOnlyState(isReadOnly: boolean): void {
    this.readonly.set(isReadOnly);
  }

  private generateFieldId(): string {
    return `field-${Math.random().toString(36).substr(2, 9)}`;
  }

  clear(): void {
    this.value = '';
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  // Inline edit methods
  enterEditMode(): void {
    if (this.inlineEdit() && !this.disabled() && !this.readonly()) {
      this._isEditMode = true;
      this._previousValue = this.value || '';
      this._isFocused = true;
      // Call hook for child components to perform additional actions (e.g., focus input)
      this.afterEnterEditMode();
    }
  }

  /**
   * Hook method called after entering edit mode.
   * Override this in child components to perform additional actions (e.g., focus and select input).
   */
  protected afterEnterEditMode(): void {
    // Override in child components if needed
  }

  exitEditMode(): void {
    this._isEditMode = false;
    this._isFocused = false;
  }

  saveChanges(): void {
    if (this.inlineEdit() && this._isEditMode) {
      this.onChange(this.value);
      this.change.emit(this.value);
      this.save.emit(this.value);
      this.exitEditMode();
    }
  }

  onCancelButtonMouseDown(event: MouseEvent): void {
    // Set flag BEFORE blur event fires
    if (this.inlineEdit() && this._isEditMode) {
      this._isCancelling = true;
      event.preventDefault(); // Prevent input from getting focus back
    }
  }

  cancelChanges(): void {
    if (this.inlineEdit() && this._isEditMode) {
      // Flag should already be set by mousedown, but set it again to be safe
      this._isCancelling = true;

      // Restore previous value
      const previousValue = this._previousValue;
      this.value = previousValue;
      this.onChange(previousValue);
      this.change.emit(previousValue);
      this.cancel.emit();

      // Use setTimeout to ensure value is updated before exiting edit mode
      setTimeout(() => {
        this.exitEditMode();
        this._isCancelling = false;
      }, 0);
    }
  }

  isEditMode(): boolean {
    return this._isEditMode;
  }

  getDisplayValue(): string {
    if (this.value === null || this.value === undefined) {
      return this.placeholder() || '';
    }
    return String(this.value);
  }
}

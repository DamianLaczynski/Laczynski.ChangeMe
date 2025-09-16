import { Component, forwardRef, OnInit, OnDestroy, input, output, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Size, StateType } from '../../utils';
import { InputVariant } from '@shared/components/input/input.component';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'toggle'
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
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldComponent),
      multi: true,
    },
  ],
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
  id = model<string>('');
  autocomplete = input<string | null>(null);
  showClearButton = input<boolean>(true);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');

  change = output<any>();
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();
  keyup = output<KeyboardEvent>();
  keydown = output<KeyboardEvent>();

  value: any = '';
  protected _isFocused = false;

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
  }

  onKeyUp(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keydown.emit(event);
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
}

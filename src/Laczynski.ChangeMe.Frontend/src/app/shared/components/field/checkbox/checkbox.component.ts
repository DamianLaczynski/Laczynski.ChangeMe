import { Component, forwardRef, input, model, effect, output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxStyle } from '../../utils';
import { FieldComponent } from '../field/field.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  imports: [FieldComponent, IconComponent, NgClass],
  templateUrl: './checkbox.component.html',
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends FieldComponent implements ControlValueAccessor, OnInit {
  // Component inputs
  checkboxStyle = input<CheckboxStyle>('standard');
  indeterminate = model<boolean>(false);

  constructor() {
    super();
    effect(() => {
      // Synchronize indeterminate state with the native checkbox element
      if (this.indeterminate()) {
        this.value = false;
      }
    });
  }

  get isChecked(): boolean {
    return this.value === true && !this.indeterminate();
  }

  get isUnchecked(): boolean {
    return this.value == false && !this.indeterminate();
  }

  get isIndeterminate(): boolean {
    return this.indeterminate();
  }

  get checkboxClasses(): string {
    const classes = ['checkbox'];

    classes.push(`checkbox--${this.checkboxStyle()}`);

    if (this.isChecked) {
      classes.push('checkbox--checked');
    } else if (this.isIndeterminate) {
      classes.push('checkbox--indeterminate');
    } else {
      classes.push('checkbox--unchecked');
    }

    if (this.disabled()) {
      classes.push('checkbox--disabled');
    }

    classes.push(`checkbox--${this.size()}`);

    return classes.join(' ');
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.indeterminate()) {
      // Cycle: indeterminate -> checked
      this.indeterminate.set(false);
      this.value = true;
    } else {
      // Normal toggle: unchecked <-> checked
      this.value = target.checked;
    }

    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onCheckboxClick(event: MouseEvent): void {
    // Prevent default to control the state manually
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      return;
    }
  }

  override onFocus(event: FocusEvent): void {
    this._isFocused = true;
    this.focus.emit(event);
  }

  override onBlur(event: FocusEvent): void {
    this._isFocused = false;
    this.onTouched();
    this.blur.emit(event);
  }

  // ControlValueAccessor methods
  override writeValue(value: any): void {
    this.value = value || false;
  }
}

import { Component, forwardRef, input, model, output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SwitchLabelPosition } from '../../utils';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-switch',
  imports: [CommonModule, FieldComponent],
  templateUrl: './switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent extends FieldComponent implements ControlValueAccessor, OnInit {
  // Component inputs
  labelPosition = input<SwitchLabelPosition>('after');

  get isChecked(): boolean {
    return this.value === true;
  }

  get isUnchecked(): boolean {
    return this.value == false;
  }

  get switchClasses(): string {
    const classes = ['switch'];

    if (this.isChecked) {
      classes.push('switch--checked');
    } else {
      classes.push('switch--unchecked');
    }

    if (this.disabled()) {
      classes.push('switch--disabled');
    }

    classes.push(`switch--${this.size()}`);
    classes.push(`switch--label-${this.labelPosition()}`);

    return classes.join(' ');
  }

  override get labelClasses(): string {
    const classes = ['switch-label'];

    if (this.disabled()) {
      classes.push('switch-label--disabled');
    }

    if (this.required()) {
      classes.push('switch-label--required');
    }

    classes.push(`switch-label--${this.size()}`);

    return classes.join(' ');
  }

  onSwitchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onSwitchClick(event: MouseEvent): void {
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      return;
    }
  }
  // ControlValueAccessor methods
  override writeValue(value: any): void {
    this.value = value || false;
  }
}

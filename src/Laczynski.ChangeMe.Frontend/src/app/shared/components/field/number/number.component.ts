import { Component, input, forwardRef, computed } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number',
  imports: [FieldComponent, CommonModule],
  templateUrl: './number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
  ],
})
export class NumberComponent extends FieldComponent {
  step = input<number | string>(1);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  // Determine if stepper style is "darker" (for filled/filled-gray variants)
  stepperStyle = computed(() => {
    const variant = this.variant();
    return variant === 'filled' || variant === 'filled-gray' ? 'darker' : 'default';
  });

  increment(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const currentValue = this.parseNumber(this.value);
    const stepValue = this.parseNumber(this.step());
    const newValue = currentValue + stepValue;

    // Check max constraint
    if (this.max() !== undefined && newValue > this.max()!) {
      return;
    }

    this.updateValue(newValue);
  }

  decrement(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const currentValue = this.parseNumber(this.value);
    const stepValue = this.parseNumber(this.step());
    const newValue = currentValue - stepValue;

    // Check min constraint
    if (this.min() !== undefined && newValue < this.min()!) {
      return;
    }

    this.updateValue(newValue);
  }

  private parseNumber(value: any): number {
    if (value === '' || value === null || value === undefined) {
      return 0;
    }
    const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private updateValue(newValue: number): void {
    this.value = newValue.toString();
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    let inputValue = target.value;

    // Allow empty value, minus sign, and decimal point for intermediate input
    if (inputValue === '' || inputValue === '-' || inputValue === '.') {
      this.value = inputValue;
      return;
    }

    // Validate numeric input
    const numericValue = this.parseNumber(inputValue);

    // Apply min/max constraints
    if (this.min() !== undefined && numericValue < this.min()!) {
      this.value = this.min()!.toString();
      target.value = this.value;
    } else if (this.max() !== undefined && numericValue > this.max()!) {
      this.value = this.max()!.toString();
      target.value = this.value;
    } else {
      this.value = inputValue;
    }

    this.onChange(this.value);
    this.change.emit(this.value);
  }
}

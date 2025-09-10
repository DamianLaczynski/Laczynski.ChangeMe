import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color',
  imports: [FieldComponent, ClearButtonComponent],
  templateUrl: './color.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorComponent),
      multi: true,
    },
  ],
})
export class ColorComponent extends FieldComponent implements OnInit, OnDestroy {
  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    let hexValue = target.value.trim();
    const currentValue = this.value;
    // Add # if not present
    if (hexValue && !hexValue.startsWith('#')) {
      hexValue = '#' + hexValue;
    }

    // Validate HEX format
    if (this.isValidHex(hexValue)) {
      this.value = hexValue;
      this.onChange(this.value);
      this.change.emit(this.value);
    } else {
      // Keep the invalid value in the input for user to correct
      this.value = currentValue;
    }
  }

  private isValidHex(hex: string): boolean {
    // Check if it's a valid HEX color (3 or 6 characters after #)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(hex);
  }
}

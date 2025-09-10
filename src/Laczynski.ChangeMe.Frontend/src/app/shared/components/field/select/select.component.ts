import { Component, forwardRef, input } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  imports: [FieldComponent, ClearButtonComponent],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends FieldComponent {
  options = input<Option[]>([]);
}

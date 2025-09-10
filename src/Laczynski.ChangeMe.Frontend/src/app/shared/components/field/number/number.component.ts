import { Component, input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-number',
  imports: [FieldComponent],
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
  step = input<number | string>('');
}

import { Component, input } from '@angular/core';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-number',
  imports: [FieldComponent],
  templateUrl: './number.component.html',
})
export class NumberComponent extends FieldComponent {
  step = input<number | string>('');
}

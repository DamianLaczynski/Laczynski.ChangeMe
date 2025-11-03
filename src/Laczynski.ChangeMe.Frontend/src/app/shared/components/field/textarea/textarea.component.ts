import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-textarea',
  imports: [FieldComponent],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class TextareaComponent extends FieldComponent {
  rows = input<number>(4);
  cols = input<number | null>(null);
}

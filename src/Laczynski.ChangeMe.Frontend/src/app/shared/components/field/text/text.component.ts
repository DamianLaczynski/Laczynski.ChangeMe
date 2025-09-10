import { Component, input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-text',
  imports: [FieldComponent, ClearButtonComponent],
  templateUrl: './text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    },
  ],
})
export class TextComponent extends FieldComponent {}

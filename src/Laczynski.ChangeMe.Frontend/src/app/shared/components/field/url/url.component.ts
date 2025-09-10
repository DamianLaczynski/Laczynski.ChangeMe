import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-url',
  imports: [FieldComponent, CommonModule, ClearButtonComponent],
  templateUrl: './url.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlComponent),
      multi: true,
    },
  ],
})
export class UrlComponent extends FieldComponent {}

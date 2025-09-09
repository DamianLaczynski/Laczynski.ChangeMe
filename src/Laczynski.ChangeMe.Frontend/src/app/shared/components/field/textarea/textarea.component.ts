import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-textarea',
  imports: [FieldComponent],
  templateUrl: './textarea.component.html',
})
export class TextareaComponent extends FieldComponent {}

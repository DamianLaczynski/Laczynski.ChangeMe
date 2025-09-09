import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-radio',
  imports: [FieldComponent],
  templateUrl: './radio.component.html',
})
export class RadioComponent extends FieldComponent {}

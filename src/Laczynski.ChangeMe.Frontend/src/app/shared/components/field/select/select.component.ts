import { Component, input } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  imports: [FieldComponent, ClearButtonComponent],
  templateUrl: './select.component.html',
})
export class SelectComponent extends FieldComponent {
  options = input<Option[]>([]);
}

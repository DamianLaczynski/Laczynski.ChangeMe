import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-checkbox',
  imports: [FieldComponent],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent extends FieldComponent {
  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.change.emit(this.value);
  }
}

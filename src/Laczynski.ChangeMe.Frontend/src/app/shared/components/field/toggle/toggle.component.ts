import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-toggle',
  imports: [FieldComponent],
  templateUrl: './toggle.component.html',
})
export class ToggleComponent extends FieldComponent {
  onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.change.emit(this.value);
  }
}

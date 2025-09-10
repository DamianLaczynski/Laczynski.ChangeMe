import { Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';
import { ToggleButtonComponent } from '../toggle-button.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password',
  imports: [FieldComponent, CommonModule, ClearButtonComponent, ToggleButtonComponent],
  templateUrl: './password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
      multi: true,
    },
  ],
})
export class PasswordComponent extends FieldComponent {
  showToggleButton = input<boolean>(true);

  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

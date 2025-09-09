import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';
import { ToggleButtonComponent } from '../toggle-button.component';

@Component({
  selector: 'app-password',
  imports: [
    FieldComponent,
    CommonModule,
    ClearButtonComponent,
    ToggleButtonComponent,
  ],
  templateUrl: './password.component.html',
})
export class PasswordComponent extends FieldComponent {
  showToggleButton = input<boolean>(true);

  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

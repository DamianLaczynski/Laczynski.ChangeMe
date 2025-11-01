import { Component, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';

@Component({
  selector: 'app-password',
  imports: [FieldComponent, ActionButtonComponent],
  templateUrl: './password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
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
export class PasswordComponent extends FieldComponent {
  protected showPassword = signal<boolean>(false);

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  get inputType(): string {
    return this.showPassword() ? 'text' : 'password';
  }
}

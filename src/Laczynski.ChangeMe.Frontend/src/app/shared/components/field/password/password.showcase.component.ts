import { Component } from '@angular/core';
import { PasswordComponent } from './password.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-showcase',
  imports: [PasswordComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-password
        label="Password Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        size="sm"
      ></app-password>
      <app-password
        label="Password Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="md"
      ></app-password>
      <app-password
        label="Password Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="lg"
      ></app-password>
      <app-password
        label="Password Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
        size="xl"
      ></app-password>
      <app-password
        label="Password Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
        size="xl"
      ></app-password>
    </form>
  `,
})
export class PasswordShowcaseComponent {}

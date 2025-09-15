import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailComponent } from './email.component';

@Component({
  selector: 'app-email-showcase',
  imports: [EmailComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-email
        placeholder="Enter email"
        label="Email Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        size="small"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="medium"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="large"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
      ></app-email>
    </form>
  `,
})
export class EmailShowcaseComponent {}

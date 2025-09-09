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
        size="sm"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="md"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="lg"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
        size="xl"
      ></app-email>
      <app-email
        placeholder="Enter email"
        label="Email Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
        size="xl"
      ></app-email>
    </form>
  `,
})
export class EmailShowcaseComponent {}

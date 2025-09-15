import { Component } from '@angular/core';
import { TelComponent } from './tel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tel-showcase',
  imports: [TelComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-tel
        label="Text Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        size="small"
      ></app-tel>
      <app-tel
        label="Text Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="medium"
      ></app-tel>
      <app-tel
        label="Text Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="large"
      ></app-tel>
      <app-tel
        label="Text Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
      ></app-tel>
      <app-tel
        label="Text Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
      ></app-tel>
    </form>
  `,
})
export class TelShowcaseComponent {}

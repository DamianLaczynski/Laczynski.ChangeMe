import { Component } from '@angular/core';
import { NumberComponent } from './number.component';

@Component({
  selector: 'app-number-showcase',
  imports: [NumberComponent],
  template: `
    <form>
      <app-number
        label="Number Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="Enter a number"
        state="initial"
        size="sm"
      ></app-number>
      <app-number
        label="Number Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="Enter a number"
        state="error"
        size="md"
      ></app-number>
      <app-number
        label="Number Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="Enter a number"
        state="warning"
        size="lg"
      ></app-number>
      <app-number
        label="Number Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="Enter a number"
        state="success"
        size="xl"
      ></app-number>
      <app-number
        label="Number Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="Enter a number"
        [disabled]="true"
        size="xl"
      ></app-number>
    </form>
  `,
})
export class NumberShowcaseComponent {}

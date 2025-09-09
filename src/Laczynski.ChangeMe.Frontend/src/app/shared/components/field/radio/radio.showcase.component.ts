import { Component } from '@angular/core';
import { RadioComponent } from './radio.component';

@Component({
  selector: 'app-radio-showcase',
  imports: [RadioComponent],
  template: `
    <form>
      <app-radio
        label="Radio Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        size="sm"
      ></app-radio>
      <app-radio
        label="Radio Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="md"
      ></app-radio>
      <app-radio
        label="Radio Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="lg"
      ></app-radio>
      <app-radio
        label="Radio Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
        size="xl"
      ></app-radio>
      <app-radio
        label="Radio Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
        size="xl"
      ></app-radio>
    </form>
  `,
})
export class RadioShowcaseComponent {}

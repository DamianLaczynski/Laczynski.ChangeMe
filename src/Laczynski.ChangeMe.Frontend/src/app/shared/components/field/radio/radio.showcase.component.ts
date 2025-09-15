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
        size="small"
      ></app-radio>
      <app-radio
        label="Radio Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="medium"
      ></app-radio>
      <app-radio
        label="Radio Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="large"
      ></app-radio>
      <app-radio
        label="Radio Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
      ></app-radio>
      <app-radio
        label="Radio Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
      ></app-radio>
    </form>
  `,
})
export class RadioShowcaseComponent {}

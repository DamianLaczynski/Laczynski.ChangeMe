import { Component } from '@angular/core';
import { ToggleComponent } from './toggle.component';

@Component({
  selector: 'app-toggle-showcase',
  imports: [ToggleComponent],
  template: `
    <form>
      <app-toggle
        label="Toggle Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        size="small"
      ></app-toggle>
      <app-toggle
        label="Toggle Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="medium"
      ></app-toggle>
      <app-toggle
        label="Toggle Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="large"
      ></app-toggle>
      <app-toggle
        label="Toggle Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
      ></app-toggle>
      <app-toggle
        label="Toggle Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
      ></app-toggle>
    </form>
  `,
})
export class ToggleShowcaseComponent {}

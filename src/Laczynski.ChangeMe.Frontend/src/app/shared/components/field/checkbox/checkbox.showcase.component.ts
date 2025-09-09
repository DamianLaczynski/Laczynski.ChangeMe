import { Component } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';

@Component({
  selector: 'app-checkbox-showcase',
  imports: [CheckboxComponent],
  template: `
    <form>
      <app-checkbox
        label="Checkbox Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        size="sm"
      ></app-checkbox>
      <app-checkbox
        label="Checkbox Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="md"
      ></app-checkbox>
      <app-checkbox
        label="Checkbox Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="lg"
      ></app-checkbox>
      <app-checkbox
        label="Checkbox Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
        size="xl"
      ></app-checkbox>
      <app-checkbox
        label="Checkbox Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
        size="xl"
      ></app-checkbox>
    </form>
  `,
})
export class CheckboxShowcaseComponent {}

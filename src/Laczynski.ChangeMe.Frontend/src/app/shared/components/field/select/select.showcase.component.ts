import { Component } from '@angular/core';
import { SelectComponent } from './select.component';

@Component({
  selector: 'app-select-showcase',
  imports: [SelectComponent],
  template: `
    <form>
      <app-select
        label="Select Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        [options]="options"
        size="sm"
      ></app-select>
      <app-select
        label="Select Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        [options]="options"
        size="md"
      ></app-select>
      <app-select
        label="Select Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        [options]="options"
        size="lg"
      ></app-select>
      <app-select
        label="Select Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
        [options]="options"
        size="xl"
      ></app-select>
      <app-select
        label="Select Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
        [options]="options"
        size="xl"
      ></app-select>
    </form>
  `,
})
export class SelectShowcaseComponent {
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];
}

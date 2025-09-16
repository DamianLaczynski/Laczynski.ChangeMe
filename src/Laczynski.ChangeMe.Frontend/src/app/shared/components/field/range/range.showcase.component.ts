import { Component } from '@angular/core';
import { RangeComponent } from './range.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-showcase',
  imports: [RangeComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-range
        label="Range Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [showValue]="true"
        unit="%"
        size="small"
      ></app-range>
      <app-range
        label="Range Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        [showLabels]="true"
        minLabel="Min"
        maxLabel="Max"
        size="medium"
      ></app-range>
      <app-range
        label="Range Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        [step]="10"
        [showSteps]="true"
        size="large"
      ></app-range>
      <app-range
        label="Range Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
      ></app-range>
      <app-range
        label="Range Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
      ></app-range>
    </form>
  `,
})
export class RangeShowcaseComponent {}

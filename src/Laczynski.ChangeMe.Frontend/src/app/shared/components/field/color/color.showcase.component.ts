import { Component } from '@angular/core';
import { ColorComponent } from './color.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-showcase',
  imports: [ColorComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-color
        label="Color Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="initial"
        size="sm"
      ></app-color>
      <app-color
        label="Color Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="error"
        size="md"
      ></app-color>
      <app-color
        label="Color Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="warning"
        size="lg"
      ></app-color>
      <app-color
        label="Color Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        state="success"
        size="xl"
      ></app-color>
      <app-color
        label="Color Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        [disabled]="true"
        size="xl"
      ></app-color>
    </form>
  `,
})
export class ColorShowcaseComponent {}

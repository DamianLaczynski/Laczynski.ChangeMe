import { Component } from '@angular/core';
import { TextComponent } from './text.component';

@Component({
  selector: 'app-text-showcase',
  imports: [TextComponent],
  template: `
    <form>
      <app-text
        label="Text Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        size="small"
      ></app-text>
      <app-text
        label="Text Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="medium"
      ></app-text>
      <app-text
        label="Text Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="large"
      ></app-text>
      <app-text
        label="Text Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
      ></app-text>
      <app-text
        label="Text Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
      ></app-text>
    </form>
  `,
})
export class TextShowcaseComponent {}

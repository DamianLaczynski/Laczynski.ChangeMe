import { Component } from '@angular/core';
import { TextareaComponent } from './textarea.component';

@Component({
  selector: 'app-textarea-showcase',
  imports: [TextareaComponent],
  template: `
    <form>
      <app-textarea
        label="Textarea Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        size="small"
      ></app-textarea>
      <app-textarea
        label="Textarea Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="medium"
      ></app-textarea>
      <app-textarea
        label="Textarea Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="large"
      ></app-textarea>
      <app-textarea
        label="Textarea Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
      ></app-textarea>
      <app-textarea
        label="Textarea Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
      ></app-textarea>
    </form>
  `,
})
export class TextareaShowcaseComponent {}

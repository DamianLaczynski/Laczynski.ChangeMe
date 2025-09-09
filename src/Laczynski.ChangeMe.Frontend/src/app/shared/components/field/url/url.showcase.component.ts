import { Component } from '@angular/core';
import { UrlComponent } from './url.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-showcase',
  imports: [UrlComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-url
        label="Url Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        size="sm"
      ></app-url>
      <app-url
        label="Url Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="md"
      ></app-url>
      <app-url
        label="Url Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="lg"
      ></app-url>
      <app-url
        label="Url Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
        size="xl"
      ></app-url>
      <app-url
        label="Url Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
        size="xl"
      ></app-url>
    </form>
  `,
})
export class UrlShowcaseComponent {}

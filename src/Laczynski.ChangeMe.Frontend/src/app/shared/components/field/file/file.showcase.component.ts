import { Component } from '@angular/core';
import { FileComponent } from './file.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-showcase',
  imports: [FileComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-file
        label="File Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="initial"
        [multiple]="true"
        [maxFiles]="10"
        size="sm"
      ></app-file>
      <app-file
        label="File Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="error"
        size="md"
      ></app-file>
      <app-file
        label="File Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="warning"
        size="lg"
      ></app-file>
      <app-file
        label="File Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        state="success"
        size="xl"
      ></app-file>
      <app-file
        label="File Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        placeholder="This is a placeholder text"
        [disabled]="true"
        size="xl"
      ></app-file>
    </form>
  `,
})
export class FileShowcaseComponent {}

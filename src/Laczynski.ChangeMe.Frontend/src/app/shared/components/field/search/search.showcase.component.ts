import { Component } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-showcase',
  imports: [SearchComponent, CommonModule, FormsModule],
  template: ` <form>
    <app-search
      label="Search Small"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="initial"
      size="sm"
    ></app-search>
    <app-search
      label="Search Medium"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="error"
      size="md"
    ></app-search>
    <app-search
      label="Search Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="warning"
      size="lg"
    ></app-search>
    <app-search
      label="Search Extra Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="success"
      size="xl"
    ></app-search>
    <app-search
      label="Search Extra Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      [disabled]="true"
      size="xl"
    ></app-search>
  </form>`,
})
export class SearchShowcaseComponent {}

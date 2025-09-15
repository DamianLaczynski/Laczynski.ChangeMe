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
      size="small"
    ></app-search>
    <app-search
      label="Search Medium"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="error"
      size="medium"
    ></app-search>
    <app-search
      label="Search Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="warning"
      size="large"
    ></app-search>
    <app-search
      label="Search Extra Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      state="success"
    ></app-search>
    <app-search
      label="Search Extra Large"
      helpText="This is a help text"
      errorText="This is an error text"
      warningText="This is a warning text"
      successText="This is a success text"
      [disabled]="true"
    ></app-search>
  </form>`,
})
export class SearchShowcaseComponent {}

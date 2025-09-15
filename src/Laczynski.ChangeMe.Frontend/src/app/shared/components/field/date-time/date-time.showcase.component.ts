import { Component } from '@angular/core';
import { DateTimeComponent } from './date-time.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-showcase',
  imports: [DateTimeComponent, CommonModule, FormsModule],
  template: `
    <form>
      <app-date-time
        type="datetime"
        label="Date Time Small"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
      <app-date-time
        type="datetime-local"
        placeholder="Enter date time"
        label="Date Time Medium"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
      <app-date-time
        type="date"
        placeholder="Enter date time"
        label="Date Time Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
      <app-date-time
        type="month"
        placeholder="Enter date time"
        label="Date Time Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
      <app-date-time
        type="week"
        placeholder="Enter date time"
        label="Date Time Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
      <app-date-time
        type="time"
        placeholder="Enter date time"
        label="Date Time Extra Large"
        helpText="This is a help text"
        errorText="This is an error text"
        warningText="This is a warning text"
        successText="This is a success text"
        size="small"
      ></app-date-time>
    </form>
  `,
})
export class DateTimeShowcaseComponent {}

import { Component } from '@angular/core';
import { DateComponent } from './date.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-date-showcase',

  imports: [DateComponent, FormsModule, JsonPipe, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Date Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Date component built with Fluent 2 Design System. Supports
        various date/time input types with all variants, responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date label="Standard Date Field" helpText="Select a date"></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Date with Value"
              [(ngModel)]="defaultDate"
              [ngModelOptions]="{ standalone: true }"
              helpText="Pre-filled date field"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Date Type Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Date Type Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Date"
              dateType="date"
              [(ngModel)]="dateInputs.date"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select a specific date"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Date & Time"
              dateType="datetime-local"
              [(ngModel)]="dateInputs.datetime"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select date and time"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Time"
              dateType="time"
              [(ngModel)]="dateInputs.time"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select a time"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Month"
              dateType="month"
              [(ngModel)]="dateInputs.month"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select a month and year"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Week"
              dateType="week"
              [(ngModel)]="dateInputs.week"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select a week"
            ></app-date>
          </div>
        </div>
        <div class="showcase__form-output">
          <strong>Date Type Values:</strong>
          <pre>{{ dateInputs | json }}</pre>
        </div>
      </div>

      <!-- Variant Styles -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Variant Styles</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Filled Variant"
              variant="filled"
              helpText="Default filled variant"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Filled Gray Variant"
              variant="filled-gray"
              helpText="Filled with gray background"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Underlined Variant"
              variant="underlined"
              helpText="Minimal underlined variant"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Small Date Field"
              size="small"
              helpText="Small size date field"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Medium Date Field"
              size="medium"
              helpText="Medium size date field (default)"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Large Date Field"
              size="large"
              helpText="Large size date field"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date label="Normal State" helpText="This is a normal date field"></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Error State"
              state="error"
              errorText="Date is required or invalid"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Warning State"
              state="warning"
              warningText="Date is in the past"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Success State"
              state="success"
              successText="Valid date selected"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Disabled Field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Read Only Field"
              [readonly]="true"
              [(ngModel)]="readonlyDate"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Required Field"
              [required]="true"
              helpText="This field is required"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Min/Max Constraints -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Min/Max Constraints</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Date with Min Value"
              [min]="minDate"
              [(ngModel)]="constrainedDate.minDate"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Minimum date: ' + minDate"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Date with Max Value"
              [max]="maxDate"
              [(ngModel)]="constrainedDate.maxDate"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Maximum date: ' + maxDate"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Date Range (Min & Max)"
              [min]="minDate"
              [max]="maxDate"
              [(ngModel)]="constrainedDate.rangeDate"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Range: ' + minDate + ' to ' + maxDate"
            ></app-date>
          </div>
        </div>
        <div class="showcase__form-output">
          <strong>Constrained Dates:</strong>
          <pre>{{ constrainedDate | json }}</pre>
        </div>
      </div>

      <!-- Practical Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Practical Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Birth Date"
              dateType="date"
              [max]="today"
              [(ngModel)]="practicalExamples.birthDate"
              [ngModelOptions]="{ standalone: true }"
              [required]="true"
              helpText="Must be in the past"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Appointment Date"
              dateType="date"
              [min]="today"
              [(ngModel)]="practicalExamples.appointmentDate"
              [ngModelOptions]="{ standalone: true }"
              [state]="appointmentState"
              [errorText]="appointmentError"
              [successText]="appointmentSuccess"
              helpText="Select a future date"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Meeting Time"
              dateType="datetime-local"
              [min]="currentDateTime"
              [(ngModel)]="practicalExamples.meetingTime"
              [ngModelOptions]="{ standalone: true }"
              [required]="true"
              helpText="Schedule a meeting"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Registration Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-date
                label="Event Date"
                dateType="date"
                [(ngModel)]="formData.eventDate"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [min]="today"
                helpText="Select the event date"
              ></app-date>
              <app-date
                label="Start Time"
                dateType="time"
                [(ngModel)]="formData.startTime"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Event start time"
              ></app-date>
              <app-date
                label="End Time"
                dateType="time"
                [(ngModel)]="formData.endTime"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [state]="endTimeState"
                [errorText]="endTimeError"
                helpText="Event end time (must be after start time)"
              ></app-date>
              <app-date
                label="Registration Deadline"
                dateType="date"
                [(ngModel)]="formData.registrationDeadline"
                [ngModelOptions]="{ standalone: true }"
                [max]="formData.eventDate || maxDate"
                helpText="Last date for registration"
              ></app-date>
              <div class="showcase__form-output">
                <strong>Form Values:</strong>
                <pre>{{ formData | json }}</pre>
                @if (isEventValid) {
                  <div>
                    <strong style="color: green;">✓ Event schedule is valid</strong>
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-date
              label="Small + Error"
              size="small"
              state="error"
              errorText="Date is required"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Medium + Warning"
              size="medium"
              state="warning"
              warningText="Date is close to deadline"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Large + Success"
              size="large"
              state="success"
              successText="Date confirmed"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="readonlyDate"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Large + Required + Underlined"
              size="large"
              variant="underlined"
              [required]="true"
              helpText="Large required underlined field"
            ></app-date>
          </div>
        </div>
      </div>

      <!-- Step Attribute -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Step Attribute (Time)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date
              label="Time (1 minute steps)"
              dateType="time"
              [step]="60"
              [(ngModel)]="stepExamples.minute"
              [ngModelOptions]="{ standalone: true }"
              helpText="1 minute increments"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Time (15 minute steps)"
              dateType="time"
              [step]="900"
              [(ngModel)]="stepExamples.fifteenMinutes"
              [ngModelOptions]="{ standalone: true }"
              helpText="15 minute increments"
            ></app-date>
          </div>
          <div class="showcase__item">
            <app-date
              label="Time (30 minute steps)"
              dateType="time"
              [step]="1800"
              [(ngModel)]="stepExamples.thirtyMinutes"
              [ngModelOptions]="{ standalone: true }"
              helpText="30 minute increments"
            ></app-date>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class DateShowcaseComponent {
  defaultDate = '2024-03-15';
  readonlyDate = '2024-12-31';
  today = new Date().toISOString().split('T')[0];
  currentDateTime = new Date().toISOString().slice(0, 16);

  minDate = '2024-01-01';
  maxDate = '2024-12-31';

  dateInputs = {
    date: '',
    datetime: '',
    time: '',
    month: '',
    week: '',
  };

  constrainedDate = {
    minDate: '',
    maxDate: '',
    rangeDate: '',
  };

  practicalExamples = {
    birthDate: '',
    appointmentDate: '',
    meetingTime: '',
  };

  formData = {
    eventDate: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
  };

  stepExamples = {
    minute: '',
    fifteenMinutes: '',
    thirtyMinutes: '',
  };

  get appointmentState(): 'error' | 'success' | 'info' {
    if (!this.practicalExamples.appointmentDate) return 'info';
    const selectedDate = new Date(this.practicalExamples.appointmentDate);
    const todayDate = new Date(this.today);
    return selectedDate >= todayDate ? 'success' : 'error';
  }

  get appointmentError(): string {
    return this.appointmentState === 'error' ? 'Appointment date must be in the future' : '';
  }

  get appointmentSuccess(): string {
    return this.appointmentState === 'success' ? 'Valid appointment date' : '';
  }

  get endTimeState(): 'error' | 'success' | 'info' {
    if (!this.formData.startTime || !this.formData.endTime) return 'info';
    return this.formData.endTime > this.formData.startTime ? 'success' : 'error';
  }

  get endTimeError(): string {
    return this.endTimeState === 'error' ? 'End time must be after start time' : '';
  }

  get isEventValid(): boolean {
    return !!(
      this.formData.eventDate &&
      this.formData.startTime &&
      this.formData.endTime &&
      this.endTimeState === 'success'
    );
  }
}

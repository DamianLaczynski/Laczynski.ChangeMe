import { Component } from '@angular/core';
import { DateRangeComponent, DateRange } from './date-range.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-date-range-showcase',

  imports: [DateRangeComponent, FormsModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">Date Range Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Date Range component built with Fluent 2 Design System. Select
        start and end dates with visual range preview, quick presets, and full accessibility.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              size="small"
              label="Standard Date Range"
              helpText="Select a date range"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Date Range with Value"
              [(ngModel)]="defaultRange"
              [ngModelOptions]="{ standalone: true }"
              helpText="Pre-filled date range"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Custom Separator"
              [separator]="' to '"
              [(ngModel)]="customSeparatorRange"
              [ngModelOptions]="{ standalone: true }"
              helpText="Using 'to' as separator"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Variant Styles -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Variant Styles</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Filled Variant"
              variant="filled"
              helpText="Default filled variant"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Filled Gray Variant"
              variant="filled-gray"
              helpText="Filled with gray background"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Underlined Variant"
              variant="underlined"
              helpText="Minimal underlined variant"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Small Date Range"
              size="small"
              helpText="Small size date range"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Medium Date Range"
              size="medium"
              helpText="Medium size date range (default)"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Large Date Range"
              size="large"
              helpText="Large size date range"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Normal State"
              helpText="This is a normal date range field"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Error State"
              state="error"
              errorText="Date range is required or invalid"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Warning State"
              state="warning"
              warningText="Date range exceeds recommended period"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Success State"
              state="success"
              successText="Valid date range selected"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Disabled Field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Read Only Field"
              [readonly]="true"
              [(ngModel)]="readonlyRange"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Required Field"
              [required]="true"
              helpText="This field is required"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Min/Max Constraints -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Min/Max Constraints</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Date Range with Min Value"
              [min]="minDate"
              [(ngModel)]="constrainedRanges.minRange"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Minimum date: ' + minDate"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Date Range with Max Value"
              [max]="maxDate"
              [(ngModel)]="constrainedRanges.maxRange"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Maximum date: ' + maxDate"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Constrained Range (Min & Max)"
              [min]="minDate"
              [max]="maxDate"
              [(ngModel)]="constrainedRanges.bothRange"
              [ngModelOptions]="{ standalone: true }"
              [helpText]="'Range: ' + minDate + ' to ' + maxDate"
            ></app-date-range>
          </div>
        </div>
        <div class="showcase__form-output">
          <strong>Constrained Ranges:</strong>
          <pre>{{ constrainedRanges | json }}</pre>
        </div>
      </div>

      <!-- Practical Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Practical Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="Vacation Dates"
              [(ngModel)]="practicalExamples.vacation"
              [ngModelOptions]="{ standalone: true }"
              [min]="today"
              [required]="true"
              helpText="Select your vacation period (future dates only)"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Report Period"
              [(ngModel)]="practicalExamples.report"
              [ngModelOptions]="{ standalone: true }"
              [max]="today"
              [required]="true"
              helpText="Select reporting period (past dates only)"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Project Timeline"
              [(ngModel)]="practicalExamples.project"
              [ngModelOptions]="{ standalone: true }"
              helpText="Select project start and end dates"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Booking Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-date-range
                label="Event Period"
                [(ngModel)]="formData.eventPeriod"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [min]="today"
                helpText="Select the event date range"
              ></app-date-range>

              <app-date-range
                label="Registration Period"
                [(ngModel)]="formData.registrationPeriod"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [min]="today"
                [max]="maxDate"
                helpText="Registration must close before event starts"
              ></app-date-range>

              <app-date-range
                label="Early Bird Discount Period"
                [(ngModel)]="formData.discountPeriod"
                [ngModelOptions]="{ standalone: true }"
                [min]="today"
                [max]="formData.registrationPeriod?.endDate || maxDate"
                helpText="Optional early bird discount period"
              ></app-date-range>

              <div class="showcase__form-output">
                <strong>Form Values:</strong>
                <pre>{{ formData | json }}</pre>
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
            <app-date-range
              label="Small + Error"
              size="small"
              state="error"
              errorText="Date range is required"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Medium + Warning"
              size="medium"
              state="warning"
              warningText="Range exceeds 90 days"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Large + Success"
              size="large"
              state="success"
              successText="Valid range selected"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="readonlyRange"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Large + Required + Underlined"
              size="large"
              variant="underlined"
              [required]="true"
              helpText="Large required underlined field"
            ></app-date-range>
          </div>
        </div>
      </div>

      <!-- Advanced Features -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Advanced Features</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-date-range
              label="With Quick Presets"
              [(ngModel)]="advancedExamples.withPresets"
              [ngModelOptions]="{ standalone: true }"
              helpText="Use quick preset buttons for common ranges"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="No Month/Year Picker"
              [(ngModel)]="advancedExamples.noMonthPicker"
              [ngModelOptions]="{ standalone: true }"
              [showMonthYearPicker]="false"
              helpText="Month/year selection disabled"
            ></app-date-range>
          </div>
          <div class="showcase__item">
            <app-date-range
              label="Custom Placeholder"
              [(ngModel)]="advancedExamples.customPlaceholder"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Pick your dates..."
              helpText="Custom placeholder text"
            ></app-date-range>
          </div>
        </div>
        <div class="showcase__form-output">
          <strong>Advanced Examples Values:</strong>
          <pre>{{ advancedExamples | json }}</pre>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class DateRangeShowcaseComponent {
  defaultRange: DateRange = {
    startDate: '2024-03-01',
    endDate: '2024-03-15',
  };

  customSeparatorRange: DateRange = {
    startDate: '2024-04-01',
    endDate: '2024-04-30',
  };

  readonlyRange: DateRange = {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  };

  today = new Date().toISOString().split('T')[0];
  minDate = '2024-01-01';
  maxDate = '2024-12-31';

  constrainedRanges = {
    minRange: null as DateRange | null,
    maxRange: null as DateRange | null,
    bothRange: null as DateRange | null,
  };

  practicalExamples = {
    vacation: null as DateRange | null,
    report: null as DateRange | null,
    project: null as DateRange | null,
  };

  formData = {
    eventPeriod: null as DateRange | null,
    registrationPeriod: null as DateRange | null,
    discountPeriod: null as DateRange | null,
  };

  advancedExamples = {
    withPresets: null as DateRange | null,
    noMonthPicker: null as DateRange | null,
    customPlaceholder: null as DateRange | null,
  };
}

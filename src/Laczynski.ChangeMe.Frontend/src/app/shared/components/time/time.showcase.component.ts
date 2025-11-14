import { Component, signal } from '@angular/core';
import { TimeComponent } from './time.component';
import { CommonModule } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-time-showcase',
  imports: [TimeComponent, CommonModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">Time Component Showcase</h1>
      <p class="showcase__description">
        Standalone time picker component built with Fluent 2 Design System. Provides intuitive time
        selection with hour and minute spinners, supporting both 12-hour and 24-hour formats.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>24-Hour Format (Default)</h3>
            <app-time
              [value]="timeValues.twentyFourHour()"
              [use24HourFormat]="true"
              (timeChange)="timeValues.twentyFourHour.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.twentyFourHour() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>12-Hour Format</h3>
            <app-time
              [value]="timeValues.twelveHour()"
              [use24HourFormat]="false"
              (timeChange)="timeValues.twelveHour.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.twelveHour() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>With Initial Value</h3>
            <app-time
              value="14:30"
              [use24HourFormat]="true"
              (timeChange)="timeValues.withInitial.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.withInitial() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-time
              [value]="timeValues.small()"
              [size]="'small'"
              (timeChange)="timeValues.small.set($event)"
            ></app-time>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-time
              [value]="timeValues.medium()"
              [size]="'medium'"
              (timeChange)="timeValues.medium.set($event)"
            ></app-time>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-time
              [value]="timeValues.large()"
              [size]="'large'"
              (timeChange)="timeValues.large.set($event)"
            ></app-time>
          </div>
        </div>
      </div>

      <!-- Step Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Step Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>1 Minute Steps (Default)</h3>
            <app-time
              [value]="timeValues.minuteSteps()"
              [step]="60"
              (timeChange)="timeValues.minuteSteps.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.minuteSteps() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>15 Minute Steps</h3>
            <app-time
              [value]="timeValues.fifteenMinuteSteps()"
              [step]="900"
              (timeChange)="timeValues.fifteenMinuteSteps.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.fifteenMinuteSteps() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>30 Minute Steps</h3>
            <app-time
              [value]="timeValues.thirtyMinuteSteps()"
              [step]="1800"
              (timeChange)="timeValues.thirtyMinuteSteps.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Value:</strong> {{ timeValues.thirtyMinuteSteps() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Inline Mode -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Inline Mode</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Standard Mode</h3>
            <app-time
              [value]="timeValues.standard()"
              [inline]="false"
              (timeChange)="timeValues.standard.set($event)"
            ></app-time>
          </div>
          <div class="showcase__item">
            <h3>Inline Mode</h3>
            <app-time
              [value]="timeValues.inline()"
              [inline]="true"
              (timeChange)="timeValues.inline.set($event)"
            ></app-time>
          </div>
          <div class="showcase__item">
            <h3>Inline with Label</h3>
            <app-time
              [value]="timeValues.inlineLabel()"
              [inline]="true"
              [showLabel]="true"
              label="Meeting Time"
              (timeChange)="timeValues.inlineLabel.set($event)"
            ></app-time>
          </div>
        </div>
      </div>

      <!-- Disabled State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Disabled State</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Disabled Time Picker</h3>
            <app-time
              value="09:30"
              [disabled]="true"
              (timeChange)="timeValues.disabled.set($event)"
            ></app-time>
          </div>
        </div>
      </div>

      <!-- Practical Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Practical Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Business Hours</h3>
            <app-time
              [value]="practicalExamples.businessHours()"
              [use24HourFormat]="true"
              [step]="900"
              [showLabel]="true"
              label="Business Hours"
              (timeChange)="practicalExamples.businessHours.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Time:</strong> {{ practicalExamples.businessHours() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>Meeting Time</h3>
            <app-time
              [value]="practicalExamples.meetingTime()"
              [use24HourFormat]="false"
              [showLabel]="true"
              label="Meeting Time"
              (timeChange)="practicalExamples.meetingTime.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Time:</strong> {{ practicalExamples.meetingTime() }}
            </div>
          </div>
          <div class="showcase__item">
            <h3>Appointment Time</h3>
            <app-time
              [value]="practicalExamples.appointmentTime()"
              [use24HourFormat]="true"
              [step]="1800"
              [showLabel]="true"
              label="Appointment Time"
              (timeChange)="practicalExamples.appointmentTime.set($event)"
            ></app-time>
            <div class="showcase__form-output">
              <strong>Time:</strong> {{ practicalExamples.appointmentTime() }}
            </div>
          </div>
        </div>
      </div>

      <!-- All Values -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Time Values</h2>
        <div class="showcase__form-output">
          <pre>{{ timeValues | json }}</pre>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class TimeShowcaseComponent {
  timeValues = {
    twentyFourHour: signal<string>(''),
    twelveHour: signal<string>(''),
    withInitial: signal<string>('14:30'),
    small: signal<string>(''),
    medium: signal<string>(''),
    large: signal<string>(''),
    minuteSteps: signal<string>(''),
    fifteenMinuteSteps: signal<string>(''),
    thirtyMinuteSteps: signal<string>(''),
    standard: signal<string>(''),
    inline: signal<string>(''),
    inlineLabel: signal<string>(''),
    disabled: signal<string>('09:30'),
  };

  practicalExamples = {
    businessHours: signal<string>('09:00'),
    meetingTime: signal<string>(''),
    appointmentTime: signal<string>(''),
  };
}

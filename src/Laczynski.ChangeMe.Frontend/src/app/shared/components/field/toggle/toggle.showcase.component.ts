import { Component } from '@angular/core';
import { ToggleComponent } from './toggle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-showcase',
  imports: [ToggleComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Toggle Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Toggle component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toggle
              label="Small Toggle"
              size="small"
              helpText="This is a small toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Medium Toggle"
              size="medium"
              helpText="This is a medium toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Large Toggle"
              size="large"
              helpText="This is a large toggle"
            ></app-toggle>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toggle label="Normal State" helpText="This is a normal toggle"></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Error State"
              state="error"
              errorText="This toggle has an error"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Warning State"
              state="warning"
              warningText="This toggle has a warning"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Success State"
              state="success"
              successText="This toggle is valid"
            ></app-toggle>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toggle
              label="Disabled Toggle"
              [disabled]="true"
              helpText="This toggle is disabled"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Read Only Toggle"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This toggle is read only"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Required Toggle"
              [required]="true"
              helpText="This toggle is required"
            ></app-toggle>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-toggle
                label="Email Notifications"
                [(ngModel)]="formData.emailNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive email notifications"
              ></app-toggle>
              <app-toggle
                label="SMS Notifications"
                [(ngModel)]="formData.smsNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive SMS notifications"
              ></app-toggle>
              <app-toggle
                label="Push Notifications"
                [(ngModel)]="formData.pushNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive push notifications"
              ></app-toggle>
              <app-toggle
                label="Marketing Emails"
                [(ngModel)]="formData.marketingEmails"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive marketing emails"
              ></app-toggle>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-toggle
              label="Small + Error"
              size="small"
              state="error"
              errorText="Small error toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Medium + Warning"
              size="medium"
              state="warning"
              warningText="Medium warning toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Large + Success"
              size="large"
              state="success"
              successText="Large success toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only toggle"
            ></app-toggle>
          </div>
          <div class="showcase__item">
            <app-toggle
              label="Large + Required"
              size="large"
              [required]="true"
              helpText="Large required toggle"
            ></app-toggle>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ToggleShowcaseComponent {
  value = true;

  formData = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  };
}

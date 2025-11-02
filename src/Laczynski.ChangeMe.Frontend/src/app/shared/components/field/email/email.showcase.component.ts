import { Component } from '@angular/core';
import { EmailComponent } from './email.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-email-showcase',
  imports: [EmailComponent, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Email Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Email component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-email
              label="Email Address"
              placeholder="example@domain.com"
              helpText="Enter a valid email address"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="With Default Value"
              placeholder="example@domain.com"
              [(ngModel)]="defaultValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="Email field with default value"
            ></app-email>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-email
              label="Small Email Field"
              placeholder="example@domain.com"
              size="small"
              helpText="This is a small email field"
              variant="underlined"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Medium Email Field"
              placeholder="example@domain.com"
              size="medium"
              helpText="This is a medium email field"
              variant="filled-gray"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Large Email Field"
              placeholder="example@domain.com"
              size="large"
              helpText="This is a large email field"
              variant="filled"
            ></app-email>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-email
              label="Normal State"
              placeholder="example@domain.com"
              helpText="This is a normal email field"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Error State"
              placeholder="example@domain.com"
              state="error"
              errorText="Invalid email format"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Warning State"
              placeholder="example@domain.com"
              state="warning"
              warningText="Email might be incorrect"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Success State"
              placeholder="example@domain.com"
              state="success"
              successText="Valid email format"
            ></app-email>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-email
              label="Disabled Field"
              placeholder="example@domain.com"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Read Only Field"
              placeholder="example@domain.com"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Required Field"
              placeholder="example@domain.com"
              [required]="true"
              helpText="This field is required"
            ></app-email>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-email
                label="Primary Email"
                placeholder="primary@example.com"
                [(ngModel)]="formData.primaryEmail"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your primary email address"
              ></app-email>
              <app-email
                label="Secondary Email"
                placeholder="secondary@example.com"
                [(ngModel)]="formData.secondaryEmail"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your secondary email address (optional)"
              ></app-email>
              <app-email
                label="Work Email"
                placeholder="work@company.com"
                [(ngModel)]="formData.workEmail"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your work email address"
              ></app-email>
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
            <app-email
              label="Small + Error"
              placeholder="example@domain.com"
              size="small"
              state="error"
              errorText="Invalid email"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Medium + Warning"
              placeholder="example@domain.com"
              size="medium"
              state="warning"
              warningText="Email warning"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Large + Success"
              placeholder="example@domain.com"
              size="large"
              state="success"
              successText="Valid email"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Small + Disabled"
              placeholder="example@domain.com"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Medium + Read Only"
              placeholder="example@domain.com"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-email>
          </div>
          <div class="showcase__item">
            <app-email
              label="Large + Required"
              placeholder="example@domain.com"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-email>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmailShowcaseComponent {
  value = 'user@example.com';
  defaultValue = 'contact@microsoft.com';

  formData = {
    primaryEmail: '',
    secondaryEmail: '',
    workEmail: '',
  };
}


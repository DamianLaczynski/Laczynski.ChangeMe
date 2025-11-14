import { Component } from '@angular/core';
import { TelComponent } from './tel.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-tel-showcase',
  imports: [TelComponent, FormsModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">Telephone Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Telephone component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tel
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              helpText="Enter a valid phone number"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="With Default Value"
              placeholder="+1 (555) 123-4567"
              [(ngModel)]="defaultValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="Telephone field with default value"
            ></app-tel>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tel
              label="Small Phone Field"
              placeholder="+1 (555) 123-4567"
              size="small"
              helpText="This is a small phone field"
              variant="underlined"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium Phone Field"
              placeholder="+1 (555) 123-4567"
              size="medium"
              helpText="This is a medium phone field"
              variant="filled-gray"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Large Phone Field"
              placeholder="+1 (555) 123-4567"
              size="large"
              helpText="This is a large phone field"
              variant="filled"
            ></app-tel>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tel
              label="Normal State"
              placeholder="+1 (555) 123-4567"
              helpText="This is a normal phone field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Error State"
              placeholder="+1 (555) 123-4567"
              state="error"
              errorText="Invalid phone number format"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Warning State"
              placeholder="+1 (555) 123-4567"
              state="warning"
              warningText="Phone number might be incorrect"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Success State"
              placeholder="+1 (555) 123-4567"
              state="success"
              successText="Valid phone number format"
            ></app-tel>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tel
              label="Disabled Field"
              placeholder="+1 (555) 123-4567"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Read Only Field"
              placeholder="+1 (555) 123-4567"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Required Field"
              placeholder="+1 (555) 123-4567"
              [required]="true"
              helpText="This field is required"
            ></app-tel>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-tel
                label="Mobile Phone"
                placeholder="+1 (555) 123-4567"
                [(ngModel)]="formData.mobile"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your mobile phone number"
              ></app-tel>
              <app-tel
                label="Home Phone"
                placeholder="+1 (555) 123-4567"
                [(ngModel)]="formData.home"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your home phone number (optional)"
              ></app-tel>
              <app-tel
                label="Work Phone"
                placeholder="+1 (555) 123-4567"
                [(ngModel)]="formData.work"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your work phone number"
              ></app-tel>
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
            <app-tel
              label="Small + Error"
              placeholder="+1 (555) 123-4567"
              size="small"
              state="error"
              errorText="Invalid phone"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium + Warning"
              placeholder="+1 (555) 123-4567"
              size="medium"
              state="warning"
              warningText="Phone warning"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Large + Success"
              placeholder="+1 (555) 123-4567"
              size="large"
              state="success"
              successText="Valid phone"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Small + Disabled"
              placeholder="+1 (555) 123-4567"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium + Read Only"
              placeholder="+1 (555) 123-4567"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Large + Required"
              placeholder="+1 (555) 123-4567"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-tel>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class TelShowcaseComponent {
  value = '+1 (555) 123-4567';
  defaultValue = '+1 (555) 987-6543';

  formData = {
    mobile: '',
    home: '',
    work: '',
  };
}


import { Component } from '@angular/core';
import { SelectComponent } from './select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-showcase',
  imports: [SelectComponent, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Select Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Select component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-select
              label="Small Select Field"
              [options]="options"
              size="small"
              helpText="This is a small select field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Medium Select Field"
              [options]="options"
              size="medium"
              helpText="This is a medium select field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Large Select Field"
              [options]="options"
              size="large"
              helpText="This is a large select field"
            ></app-select>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-select
              label="Normal State"
              [options]="options"
              helpText="This is a normal select field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Error State"
              [options]="options"
              state="error"
              errorText="This field has an error"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Warning State"
              [options]="options"
              state="warning"
              warningText="This field has a warning"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Success State"
              [options]="options"
              state="success"
              successText="This field is valid"
            ></app-select>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-select
              label="Disabled Field"
              [options]="options"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Read Only Field"
              [options]="options"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Required Field"
              [options]="options"
              [required]="true"
              helpText="This field is required"
            ></app-select>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-select
                label="Country"
                [options]="countryOptions"
                [(ngModel)]="formData.country"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Select your country"
              ></app-select>
              <app-select
                label="City"
                [options]="cityOptions"
                [(ngModel)]="formData.city"
                [ngModelOptions]="{ standalone: true }"
                helpText="Select your city"
              ></app-select>
              <app-select
                label="Department"
                [options]="departmentOptions"
                [(ngModel)]="formData.department"
                [ngModelOptions]="{ standalone: true }"
                helpText="Select your department"
              ></app-select>
              <app-select
                label="Experience Level"
                [options]="experienceOptions"
                [(ngModel)]="formData.experience"
                [ngModelOptions]="{ standalone: true }"
                helpText="Select your experience level"
              ></app-select>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-select
              label="Small + Error"
              [options]="options"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Medium + Warning"
              [options]="options"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Large + Success"
              [options]="options"
              size="large"
              state="success"
              successText="Large success field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Small + Disabled"
              [options]="options"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Medium + Read Only"
              [options]="options"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-select>
          </div>
          <div class="showcase__item">
            <app-select
              label="Large + Required"
              [options]="options"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-select>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SelectShowcaseComponent {
  value = '2';

  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  cityOptions = [
    { value: 'nyc', label: 'New York City' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    { value: 'phoenix', label: 'Phoenix' },
  ];

  departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
  ];

  experienceOptions = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'lead', label: 'Lead Level (10+ years)' },
  ];

  formData = {
    country: '',
    city: '',
    department: '',
    experience: '',
  };
}

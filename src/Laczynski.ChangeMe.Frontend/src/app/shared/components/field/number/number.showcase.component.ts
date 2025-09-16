import { Component } from '@angular/core';
import { NumberComponent } from './number.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-number-showcase',
  imports: [NumberComponent, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Number Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Number component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Small Number Field"
              placeholder="Enter a number"
              size="small"
              helpText="This is a small number field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Medium Number Field"
              placeholder="Enter a number"
              size="medium"
              helpText="This is a medium number field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Large Number Field"
              placeholder="Enter a number"
              size="large"
              helpText="This is a large number field"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Normal State"
              placeholder="Normal state"
              helpText="This is a normal number field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Disabled Field"
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Required Field"
              placeholder="Required field"
              [required]="true"
              helpText="This field is required"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-number
                label="Age"
                placeholder="Enter your age"
                [(ngModel)]="formData.age"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your age in years"
              ></app-number>
              <app-number
                label="Phone Number"
                placeholder="Enter phone number"
                [(ngModel)]="formData.phone"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your phone number"
              ></app-number>
              <app-number
                label="Salary"
                placeholder="Enter salary"
                [(ngModel)]="formData.salary"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your annual salary"
              ></app-number>
              <app-number
                label="Experience Years"
                placeholder="Years of experience"
                [(ngModel)]="formData.experience"
                [ngModelOptions]="{ standalone: true }"
                helpText="Years of work experience"
              ></app-number>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-number
              label="Small + Error"
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Medium + Read Only"
              placeholder="Medium read only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Large + Required"
              placeholder="Large required"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-number>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NumberShowcaseComponent {
  value = 42;

  formData = {
    age: null as number | null,
    phone: null as number | null,
    salary: null as number | null,
    experience: null as number | null,
  };
}

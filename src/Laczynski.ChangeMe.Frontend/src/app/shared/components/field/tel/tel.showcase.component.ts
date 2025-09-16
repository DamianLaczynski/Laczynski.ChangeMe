import { Component } from '@angular/core';
import { TelComponent } from './tel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tel-showcase',
  imports: [TelComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tel Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tel component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tel
              label="Small Tel Field"
              placeholder="Enter phone number"
              size="small"
              helpText="This is a small tel field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium Tel Field"
              placeholder="Enter phone number"
              size="medium"
              helpText="This is a medium tel field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Large Tel Field"
              placeholder="Enter phone number"
              size="large"
              helpText="This is a large tel field"
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
              placeholder="Normal state"
              helpText="This is a normal tel field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
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
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Required Field"
              placeholder="Required field"
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
                label="Primary Phone"
                placeholder="Enter primary phone"
                [(ngModel)]="formData.primaryPhone"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your primary phone number"
              ></app-tel>
              <app-tel
                label="Secondary Phone"
                placeholder="Enter secondary phone"
                [(ngModel)]="formData.secondaryPhone"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your secondary phone number"
              ></app-tel>
              <app-tel
                label="Emergency Contact"
                placeholder="Enter emergency contact"
                [(ngModel)]="formData.emergencyContact"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter emergency contact phone"
              ></app-tel>
              <app-tel
                label="Work Phone"
                placeholder="Enter work phone"
                [(ngModel)]="formData.workPhone"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your work phone number"
              ></app-tel>
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
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-tel>
          </div>
          <div class="showcase__item">
            <app-tel
              label="Medium + Read Only"
              placeholder="Medium read only"
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
              placeholder="Large required"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-tel>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TelShowcaseComponent {
  value = '+1 (555) 123-4567';

  formData = {
    primaryPhone: '',
    secondaryPhone: '',
    emergencyContact: '',
    workPhone: '',
  };
}

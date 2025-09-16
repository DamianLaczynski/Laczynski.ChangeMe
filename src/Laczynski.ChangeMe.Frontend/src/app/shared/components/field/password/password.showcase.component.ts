import { Component } from '@angular/core';
import { PasswordComponent } from './password.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-showcase',
  imports: [PasswordComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Password Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Password component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Small Password Field"
              placeholder="Enter password"
              size="small"
              helpText="This is a small password field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Medium Password Field"
              placeholder="Enter password"
              size="medium"
              helpText="This is a medium password field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large Password Field"
              placeholder="Enter password"
              size="large"
              helpText="This is a large password field"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Normal State"
              placeholder="Normal state"
              helpText="This is a normal password field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Disabled Field"
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Required Field"
              placeholder="Required field"
              [required]="true"
              helpText="This field is required"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-password
                label="Current Password"
                placeholder="Enter current password"
                [(ngModel)]="formData.currentPassword"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your current password"
              ></app-password>
              <app-password
                label="New Password"
                placeholder="Enter new password"
                [(ngModel)]="formData.newPassword"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter a strong new password"
              ></app-password>
              <app-password
                label="Confirm Password"
                placeholder="Confirm new password"
                [(ngModel)]="formData.confirmPassword"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Confirm your new password"
              ></app-password>
              <app-password
                label="Recovery Password"
                placeholder="Enter recovery password"
                [(ngModel)]="formData.recoveryPassword"
                [ngModelOptions]="{ standalone: true }"
                helpText="Optional recovery password"
              ></app-password>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-password
              label="Small + Error"
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Medium + Read Only"
              placeholder="Medium read only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large + Required"
              placeholder="Large required"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-password>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PasswordShowcaseComponent {
  value = '••••••••';

  formData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    recoveryPassword: '',
  };
}

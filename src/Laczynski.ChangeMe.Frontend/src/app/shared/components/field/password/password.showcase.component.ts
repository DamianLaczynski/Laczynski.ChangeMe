import { Component } from '@angular/core';
import { PasswordComponent } from './password.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-password-showcase',

  imports: [PasswordComponent, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Password Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Password component built with Fluent 2 Design System. Features
        password visibility toggle, all variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Standard Password Field"
              placeholder="Enter your password"
              helpText="Password must be at least 8 characters"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Password with Value"
              placeholder="Enter password"
              [(ngModel)]="defaultPassword"
              [ngModelOptions]="{ standalone: true }"
              helpText="Toggle visibility to see password"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- Variant Styles -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Variant Styles</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Filled Variant"
              placeholder="Enter password"
              variant="filled"
              helpText="Default filled variant"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Filled Gray Variant"
              placeholder="Enter password"
              variant="filled-gray"
              helpText="Filled with gray background"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Underlined Variant"
              placeholder="Enter password"
              variant="underlined"
              helpText="Minimal underlined variant"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Small Password Field"
              placeholder="Small password input"
              size="small"
              helpText="Small size password field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Medium Password Field"
              placeholder="Medium password input"
              size="medium"
              helpText="Medium size password field (default)"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large Password Field"
              placeholder="Large password input"
              size="large"
              helpText="Large size password field"
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
              errorText="Password must contain at least one uppercase letter"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="Password strength: Weak"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="Strong password!"
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
              [(ngModel)]="readonlyPassword"
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

      <!-- Password Strength Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Password Strength Indicator Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="Password"
              placeholder="Enter a strong password"
              [(ngModel)]="passwordWithStrength"
              [ngModelOptions]="{ standalone: true }"
              [state]="passwordStrengthState"
              [helpText]="passwordStrengthMessage"
              [errorText]="passwordStrengthState === 'error' ? passwordStrengthMessage : ''"
              [warningText]="passwordStrengthState === 'warning' ? passwordStrengthMessage : ''"
              [successText]="passwordStrengthState === 'success' ? passwordStrengthMessage : ''"
            ></app-password>
            <div class="showcase__password-strength-bar">
              <div
                class="showcase__password-strength-bar__fill"
                [attr.data-strength]="passwordStrength"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Registration Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-password
                label="Password"
                placeholder="Enter password"
                [(ngModel)]="formData.password"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Must be at least 8 characters with uppercase, lowercase, and numbers"
              ></app-password>
              <app-password
                label="Confirm Password"
                placeholder="Re-enter password"
                [(ngModel)]="formData.confirmPassword"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [state]="passwordsMatch ? 'success' : formData.confirmPassword ? 'error' : 'info'"
                [errorText]="
                  !passwordsMatch && formData.confirmPassword ? 'Passwords do not match' : ''
                "
                [successText]="passwordsMatch && formData.confirmPassword ? 'Passwords match' : ''"
                helpText="Must match the password above"
              ></app-password>
              <div class="showcase__form-output">
                <strong>Form Values:</strong>
                <pre>{{
                  {
                    password: formData.password ? '***' : '',
                    confirmPassword: formData.confirmPassword ? '***' : '',
                  } | json
                }}</pre>
                <div><strong>Passwords Match:</strong> {{ passwordsMatch ? 'Yes' : 'No' }}</div>
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
            <app-password
              label="Small + Error"
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Password is too weak"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Consider using special characters"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Strong password!"
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
              [(ngModel)]="readonlyPassword"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Large + Required + Underlined"
              placeholder="Large required"
              size="large"
              variant="underlined"
              [required]="true"
              helpText="Large required underlined field"
            ></app-password>
          </div>
        </div>
      </div>

      <!-- Autocomplete Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Autocomplete Attributes</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-password
              label="New Password"
              placeholder="Create new password"
              autocomplete="new-password"
              helpText="For registration or password creation"
            ></app-password>
          </div>
          <div class="showcase__item">
            <app-password
              label="Current Password"
              placeholder="Enter current password"
              autocomplete="current-password"
              helpText="For login or verification"
            ></app-password>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PasswordShowcaseComponent {
  defaultPassword = 'SecurePass123';
  readonlyPassword = 'ReadOnlyPassword';
  passwordWithStrength = '';

  formData = {
    password: '',
    confirmPassword: '',
  };

  get passwordsMatch(): boolean {
    return (
      this.formData.password === this.formData.confirmPassword && this.formData.password !== ''
    );
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' | '' {
    if (!this.passwordWithStrength) return '';

    const hasLower = /[a-z]/.test(this.passwordWithStrength);
    const hasUpper = /[A-Z]/.test(this.passwordWithStrength);
    const hasNumber = /\d/.test(this.passwordWithStrength);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordWithStrength);
    const isLongEnough = this.passwordWithStrength.length >= 8;

    const criteria = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(
      Boolean,
    ).length;

    if (criteria <= 2) return 'weak';
    if (criteria <= 3) return 'medium';
    return 'strong';
  }

  get passwordStrengthState(): 'error' | 'warning' | 'success' | 'info' {
    if (!this.passwordWithStrength) return 'info';

    const strength = this.passwordStrength;
    if (strength === 'weak') return 'error';
    if (strength === 'medium') return 'warning';
    return 'success';
  }

  get passwordStrengthMessage(): string {
    if (!this.passwordWithStrength) return 'Enter a password to check its strength';

    const strength = this.passwordStrength;
    if (strength === 'weak')
      return 'Password is too weak. Add uppercase, numbers, and special characters.';
    if (strength === 'medium') return 'Password strength: Medium. Consider adding more variety.';
    return 'Strong password! Good job.';
  }
}

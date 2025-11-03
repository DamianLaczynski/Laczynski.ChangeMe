import { Component } from '@angular/core';
import { TotpComponent } from './totp.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-totp-showcase',
  standalone: true,
  imports: [TotpComponent, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">TOTP Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the TOTP (Time-based One-Time Password) component built with
        Fluent 2 Design System. Features automatic focus management, paste support, and keyboard
        navigation. All variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="One-Time Password"
              helpText="Enter the 6-digit code from your authenticator app"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="TOTP Code"
              helpText="You can paste the full code or type digit by digit"
              [(ngModel)]="defaultTotp"
              [ngModelOptions]="{ standalone: true }"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Digit Count Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Digit Count Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="4-Digit Code"
              [digitsCount]="4"
              helpText="4-digit verification code"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="6-Digit Code (Default)"
              [digitsCount]="6"
              helpText="6-digit TOTP code (standard)"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="8-Digit Code"
              [digitsCount]="8"
              helpText="8-digit verification code"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="Small TOTP Field"
              size="small"
              helpText="Small size TOTP field"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Medium TOTP Field"
              size="medium"
              helpText="Medium size TOTP field (default)"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Large TOTP Field"
              size="large"
              helpText="Large size TOTP field"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Variant Styles -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Variant Styles</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="Filled Variant"
              variant="filled"
              helpText="Default filled variant"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Filled Gray Variant"
              variant="filled-gray"
              helpText="Filled with gray background"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Underlined Variant"
              variant="underlined"
              helpText="Minimal underlined variant"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp label="Normal State" helpText="This is a normal TOTP field"></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Error State"
              state="error"
              errorText="Invalid code. Please try again."
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Warning State"
              state="warning"
              warningText="Code expires in 30 seconds"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Success State"
              state="success"
              successText="Code verified successfully!"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="Disabled Field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Read Only Field"
              [readonly]="true"
              [(ngModel)]="readonlyTotp"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Required Field"
              [required]="true"
              helpText="This field is required"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Features Demo -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Features Demo</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="Keyboard Navigation"
              helpText="Use arrow keys to navigate between digits, Backspace to go back"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Paste Support"
              helpText="Try pasting a code (Ctrl+V or Cmd+V). It will auto-fill all digits."
              [(ngModel)]="pasteDemoTotp"
              [ngModelOptions]="{ standalone: true }"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Auto Focus"
              helpText="After entering a digit, focus automatically moves to the next field"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Two-Factor Authentication Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-totp
                label="Verification Code"
                placeholder="Enter 6-digit code"
                [(ngModel)]="formData.totpCode"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [state]="totpValidationState"
                [errorText]="totpValidationState === 'error' ? 'Invalid verification code' : ''"
                [successText]="totpValidationState === 'success' ? 'Code verified!' : ''"
                helpText="Enter the 6-digit code from your authenticator app"
              ></app-totp>
              <div class="showcase__form-output">
                <strong>Form Value:</strong>
                <pre>{{ { totpCode: formData.totpCode || '(empty)' } | json }}</pre>
                <div>
                  <strong>Code Length:</strong>
                  {{ formData.totpCode?.length || 0 }}/6
                </div>
                <div>
                  <strong>Is Valid:</strong>
                  {{ totpValidationState === 'success' ? 'Yes' : 'No' }}
                </div>
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
            <app-totp
              label="Small + Error"
              size="small"
              state="error"
              errorText="Invalid code"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Medium + Warning"
              size="medium"
              state="warning"
              warningText="Code expiring soon"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Large + Success"
              size="large"
              state="success"
              successText="Verified!"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="readonlyTotp"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Large + Required + Underlined"
              size="large"
              variant="underlined"
              [required]="true"
              helpText="Large required underlined field"
            ></app-totp>
          </div>
        </div>
      </div>

      <!-- Real-World Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Real-World Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-totp
              label="Google Authenticator Code"
              helpText="Enter the 6-digit code from Google Authenticator"
              [required]="true"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="Microsoft Authenticator"
              helpText="Enter code from Microsoft Authenticator app"
              variant="filled-gray"
            ></app-totp>
          </div>
          <div class="showcase__item">
            <app-totp
              label="SMS Verification Code"
              [digitsCount]="4"
              helpText="Enter the 4-digit code sent to your phone"
              variant="underlined"
            ></app-totp>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TotpShowcaseComponent {
  defaultTotp = '123456';
  readonlyTotp = '654321';
  pasteDemoTotp = '';

  formData = {
    totpCode: '',
  };

  get totpValidationState(): 'error' | 'warning' | 'success' | 'info' {
    const code = this.formData.totpCode;
    if (!code) return 'info';
    if (code.length < 6) return 'warning';
    // Simple validation: check if all digits and length is 6
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      // In real app, you would verify against server here
      return 'success';
    }
    return 'error';
  }
}

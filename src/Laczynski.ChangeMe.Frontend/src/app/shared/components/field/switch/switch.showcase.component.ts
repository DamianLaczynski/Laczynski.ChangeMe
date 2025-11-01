import { Component } from '@angular/core';
import { SwitchComponent } from './switch.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch-showcase',

  imports: [SwitchComponent, CommonModule, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Switch Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Switch component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Label Position Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Label Position Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch
              label="Label After (Default)"
              labelPosition="after"
              helpText="Label positioned after the switch"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Label Before"
              labelPosition="before"
              helpText="Label positioned before the switch"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Label Above"
              labelPosition="above"
              helpText="Label positioned above the switch"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              labelPosition="none"
              ariaLabel="Switch without visible label"
              helpText="No visible label (aria-label only)"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch
              label="Small Switch"
              size="small"
              helpText="This is a small switch"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Medium Switch"
              size="medium"
              helpText="This is a medium switch (default)"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Large Switch"
              size="large"
              helpText="This is a large switch"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch label="Normal State" helpText="This is a normal switch"></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Error State"
              state="error"
              errorText="This switch has an error"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Warning State"
              state="warning"
              warningText="This switch has a warning"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Success State"
              state="success"
              successText="This switch is valid"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch
              label="Disabled Switch (Off)"
              [disabled]="true"
              helpText="This switch is disabled"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Disabled Switch (On)"
              [disabled]="true"
              [(ngModel)]="disabledValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is disabled and checked"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Read Only Switch"
              [readonly]="true"
              [(ngModel)]="readonlyValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is read only"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Required Switch"
              [required]="true"
              helpText="This switch is required"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-switch
                label="Email Notifications"
                [(ngModel)]="formData.emailNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive email notifications"
              ></app-switch>
              <app-switch
                label="SMS Notifications"
                [(ngModel)]="formData.smsNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive SMS notifications"
              ></app-switch>
              <app-switch
                label="Push Notifications"
                [(ngModel)]="formData.pushNotifications"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive push notifications"
              ></app-switch>
              <app-switch
                label="Marketing Emails"
                [(ngModel)]="formData.marketingEmails"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive marketing emails"
              ></app-switch>
              <div class="showcase__form-output">
                <strong>Selected Values:</strong>
                <pre>{{ formData | json }}</pre>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Checked/Unchecked States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Checked & Unchecked States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch
              label="Unchecked Switch"
              [(ngModel)]="uncheckedValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is currently off"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Checked Switch"
              [(ngModel)]="checkedValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is currently on"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- Checked/Unchecked States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Checked & Unchecked States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-switch
              label="Unchecked Switch"
              [(ngModel)]="uncheckedValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is currently off"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Checked Switch"
              [(ngModel)]="checkedValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="This switch is currently on"
            ></app-switch>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-switch
              label="Small + Before + Error"
              size="small"
              labelPosition="before"
              state="error"
              errorText="Small error switch"
              [(ngModel)]="comboValue1"
              [ngModelOptions]="{ standalone: true }"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Medium + Above + Warning"
              size="medium"
              labelPosition="above"
              state="warning"
              warningText="Medium warning switch"
              [(ngModel)]="comboValue2"
              [ngModelOptions]="{ standalone: true }"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Large + After + Success"
              size="large"
              labelPosition="after"
              state="success"
              successText="Large success switch"
              [(ngModel)]="comboValue3"
              [ngModelOptions]="{ standalone: true }"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled switch"
              [(ngModel)]="comboValue4"
              [ngModelOptions]="{ standalone: true }"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="comboValue5"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only switch"
            ></app-switch>
          </div>
          <div class="showcase__item">
            <app-switch
              label="Large + Required"
              size="large"
              [required]="true"
              helpText="Large required switch"
              [(ngModel)]="comboValue6"
              [ngModelOptions]="{ standalone: true }"
            ></app-switch>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SwitchShowcaseComponent {
  uncheckedValue = false;
  checkedValue = true;
  disabledValue = true;
  readonlyValue = true;
  comboValue1 = false;
  comboValue2 = true;
  comboValue3 = false;
  comboValue4 = true;
  comboValue5 = true;
  comboValue6 = false;

  formData = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  };
}

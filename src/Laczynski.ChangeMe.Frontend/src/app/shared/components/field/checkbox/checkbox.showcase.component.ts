import { Component } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-checkbox-showcase',
  standalone: true,
  imports: [CheckboxComponent, CommonModule, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Checkbox Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Checkbox component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-checkbox
              label="Standard Checkbox"
              checkboxStyle="standard"
              [ngModel]="basicValue"
              (ngModelChange)="basicValue = $event"
              helpText="This is a standard checkbox"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Circular Checkbox"
              checkboxStyle="circular"
              [ngModel]="circularValue"
              (ngModelChange)="circularValue = $event"
              helpText="This is a circular checkbox"
            />
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-checkbox
              size="small"
              label="Small Checkbox"
              [ngModel]="smallValue"
              (ngModelChange)="smallValue = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              size="medium"
              label="Medium Checkbox"
              [ngModel]="mediumValue"
              (ngModelChange)="mediumValue = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              size="large"
              label="Large Checkbox"
              [ngModel]="largeValue"
              (ngModelChange)="largeValue = $event"
            />
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-checkbox
              label="Normal State"
              [ngModel]="normalValue"
              (ngModelChange)="normalValue = $event"
              helpText="This is a normal checkbox"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Error State"
              state="error"
              errorText="This checkbox has an error"
              [ngModel]="errorValue"
              (ngModelChange)="errorValue = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Warning State"
              state="warning"
              warningText="This checkbox has a warning"
              [ngModel]="warningValue"
              (ngModelChange)="warningValue = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Success State"
              state="success"
              successText="This checkbox is valid"
              [ngModel]="successValue"
              (ngModelChange)="successValue = $event"
            />
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-checkbox
              label="Disabled Checkbox"
              [ngModel]="disabledValue"
              (ngModelChange)="disabledValue = $event"
              [disabled]="true"
              helpText="This checkbox is disabled"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Required Checkbox"
              [ngModel]="requiredValue"
              (ngModelChange)="requiredValue = $event"
              [required]="true"
              helpText="This field is required"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Read Only Checkbox"
              [ngModel]="readonlyValue"
              (ngModelChange)="readonlyValue = $event"
              [readonly]="true"
              helpText="This checkbox is read only"
            />
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-checkbox
                label="Accept Terms and Conditions"
                [(ngModel)]="formData.acceptTerms"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="You must accept to continue"
              />
              <app-checkbox
                label="Subscribe to Newsletter"
                [(ngModel)]="formData.subscribeNewsletter"
                [ngModelOptions]="{ standalone: true }"
                helpText="Receive our weekly newsletter"
              />
              <app-checkbox
                label="Share Data with Partners"
                [(ngModel)]="formData.shareData"
                [ngModelOptions]="{ standalone: true }"
                helpText="Allow data sharing with trusted partners"
              />
              <div class="showcase__form-output">
                <strong>Selected Values:</strong>
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
            <app-checkbox
              label="Small + Standard"
              size="small"
              checkboxStyle="standard"
              [ngModel]="comboValue1"
              (ngModelChange)="comboValue1 = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Medium + Circular"
              size="medium"
              checkboxStyle="circular"
              [ngModel]="comboValue2"
              (ngModelChange)="comboValue2 = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Large + Required"
              size="large"
              [required]="true"
              [ngModel]="comboValue3"
              (ngModelChange)="comboValue3 = $event"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Small + Disabled"
              size="small"
              [disabled]="true"
              [ngModel]="comboValue4"
              (ngModelChange)="comboValue4 = $event"
              helpText="Small disabled checkbox"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Medium + Read Only"
              size="medium"
              [readonly]="true"
              [ngModel]="comboValue5"
              (ngModelChange)="comboValue5 = $event"
              helpText="Medium read only checkbox"
            />
          </div>
          <div class="showcase__item">
            <app-checkbox
              label="Large + Success"
              size="large"
              state="success"
              successText="Large success checkbox"
              [ngModel]="comboValue6"
              (ngModelChange)="comboValue6 = $event"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckboxShowcaseComponent {
  basicValue = true;
  circularValue = false;
  smallValue = true;
  mediumValue = true;
  largeValue = true;
  normalValue = true;
  errorValue = false;
  warningValue = true;
  successValue = true;
  disabledValue = true;
  requiredValue = false;
  readonlyValue = true;
  comboValue1 = false;
  comboValue2 = true;
  comboValue3 = false;
  comboValue4 = true;
  comboValue5 = true;
  comboValue6 = true;

  formData = {
    acceptTerms: false,
    subscribeNewsletter: false,
    shareData: false,
  };
}

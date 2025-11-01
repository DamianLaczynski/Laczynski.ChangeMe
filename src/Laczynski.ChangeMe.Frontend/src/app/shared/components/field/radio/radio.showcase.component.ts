import { Component } from '@angular/core';
import { RadioGroupComponent, RadioItem } from './radio-group.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-showcase',

  imports: [RadioGroupComponent, CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Radio Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Radio component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-radio-group
              direction="vertical"
              label="Choose an option"
              helpText="Select one of the following options"
              [(ngModel)]="basicValue"
              name="basic-group"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              direction="horizontal"
              label="Quick Selection"
              [(ngModel)]="horizontalValue"
              name="horizontal-group"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-radio-group
              size="small"
              label="Small Radio Group"
              [(ngModel)]="sizeValue1"
              name="size-small"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="medium"
              label="Medium Radio Group"
              [(ngModel)]="sizeValue2"
              name="size-medium"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="large"
              label="Large Radio Group"
              [(ngModel)]="sizeValue3"
              name="size-large"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-radio-group
              state="error"
              label="Error State"
              errorText="Please select an option"
              [(ngModel)]="stateValue1"
              name="state-error"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              state="warning"
              label="Warning State"
              warningText="This choice may have consequences"
              [(ngModel)]="stateValue2"
              name="state-warning"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              state="success"
              label="Success State"
              successText="Selection confirmed"
              [(ngModel)]="stateValue3"
              name="state-success"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-radio-group
              direction="vertical"
              label="Disabled Selection"
              [disabled]="true"
              [(ngModel)]="disabledValue"
              name="disabled-group"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              direction="vertical"
              label="Required Selection"
              [required]="true"
              helpText="You must select an option"
              [(ngModel)]="requiredValue"
              name="required-group"
              [items]="yesNoOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              direction="vertical"
              label="Read Only Selection"
              [readonly]="true"
              [(ngModel)]="readonlyValue"
              name="readonly-group"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>

      <!-- Layout Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Layout Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-radio-group
              direction="vertical"
              label="Label After (Default)"
              [(ngModel)]="layoutValue1"
              name="layout-after"
              [items]="layoutAfterOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              direction="horizontal"
              label="Label Below"
              [(ngModel)]="layoutValue2"
              name="layout-below"
              [items]="layoutBelowOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-radio-group
                label="Delivery Method"
                [(ngModel)]="formData.deliveryMethod"
                [ngModelOptions]="{ standalone: true }"
                name="delivery-group"
                [items]="deliveryOptions"
                [required]="true"
                helpText="Choose your preferred delivery method"
              />
              <app-radio-group
                label="Payment Method"
                direction="vertical"
                [(ngModel)]="formData.paymentMethod"
                [ngModelOptions]="{ standalone: true }"
                name="payment-group"
                [items]="paymentOptions"
                helpText="Select your payment preference"
              />
              <app-radio-group
                label="Language Preference"
                direction="vertical"
                [(ngModel)]="formData.language"
                [ngModelOptions]="{ standalone: true }"
                name="language-group"
                [items]="languageOptions"
                helpText="Choose your preferred language"
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
            <app-radio-group
              size="small"
              label="Small + Error"
              state="error"
              errorText="Small error radio"
              [(ngModel)]="comboValue1"
              name="combo-1"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="medium"
              label="Medium + Warning"
              state="warning"
              warningText="Medium warning radio"
              [(ngModel)]="comboValue2"
              name="combo-2"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="large"
              label="Large + Success"
              state="success"
              successText="Large success radio"
              [(ngModel)]="comboValue3"
              name="combo-3"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="small"
              label="Small + Disabled"
              [disabled]="true"
              [(ngModel)]="comboValue4"
              name="combo-4"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="medium"
              label="Medium + Required"
              [required]="true"
              [(ngModel)]="comboValue5"
              name="combo-5"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
          <div class="showcase__item">
            <app-radio-group
              size="large"
              label="Large + Read Only"
              [readonly]="true"
              [(ngModel)]="comboValue6"
              name="combo-6"
              [items]="basicOptions"
            ></app-radio-group>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RadioShowcaseComponent {
  // Basic options
  basicOptions: RadioItem[] = [
    { id: 1, label: 'Option 1', value: 'option1' },
    { id: 2, label: 'Option 2', value: 'option2' },
    { id: 3, label: 'Option 3', value: 'option3' },
  ];

  yesNoOptions: RadioItem[] = [
    { id: 1, label: 'Yes', value: 'yes' },
    { id: 2, label: 'No', value: 'no' },
  ];

  layoutAfterOptions: RadioItem[] = [
    { id: 1, label: 'Grid View', value: 'grid', layout: 'after' },
    { id: 2, label: 'List View', value: 'list', layout: 'after' },
    { id: 3, label: 'Compact View', value: 'compact', layout: 'after' },
  ];

  layoutBelowOptions: RadioItem[] = [
    { id: 1, label: 'Day', value: 'day', layout: 'below' },
    { id: 2, label: 'Week', value: 'week', layout: 'below' },
    { id: 3, label: 'Month', value: 'month', layout: 'below' },
  ];

  layoutIconOptions: RadioItem[] = [
    { id: 1, label: '', value: 'icon1' },
    { id: 2, label: '', value: 'icon2' },
    { id: 3, label: '', value: 'icon3' },
  ];

  // Values for different examples
  basicValue = 'option2';
  horizontalValue = 'option1';
  layoutValue1 = 'grid';
  layoutValue2 = 'week';
  sizeValue1 = 'option1';
  sizeValue2 = 'option2';
  sizeValue3 = 'option3';
  stateValue1 = '';
  stateValue2 = 'option1';
  stateValue3 = 'option2';
  requiredValue = '';
  disabledValue = 'option2';
  readonlyValue = 'option1';
  comboValue1 = '';
  comboValue2 = 'option2';
  comboValue3 = 'option3';
  comboValue4 = 'option1';
  comboValue5 = '';
  comboValue6 = 'option2';

  deliveryOptions: RadioItem[] = [
    { id: 1, label: 'Standard Shipping', value: 'standard' },
    { id: 2, label: 'Express Shipping', value: 'express' },
    { id: 3, label: 'Overnight Shipping', value: 'overnight' },
  ];

  paymentOptions: RadioItem[] = [
    { id: 1, label: 'Credit Card', value: 'credit' },
    { id: 2, label: 'PayPal', value: 'paypal' },
    { id: 3, label: 'Bank Transfer', value: 'bank' },
  ];

  languageOptions: RadioItem[] = [
    { id: 1, label: 'English', value: 'en' },
    { id: 2, label: 'Spanish', value: 'es' },
    { id: 3, label: 'French', value: 'fr' },
  ];

  formData = {
    deliveryMethod: '',
    paymentMethod: '',
    language: 'en',
  };
}

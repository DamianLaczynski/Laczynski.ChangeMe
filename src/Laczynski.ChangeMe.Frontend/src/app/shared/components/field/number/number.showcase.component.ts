import { Component } from '@angular/core';
import { NumberComponent } from './number.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-number-showcase',

  imports: [NumberComponent, FormsModule, JsonPipe, TableOfContentComponent],
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

      <!-- Stepper Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Stepper Variants (Filled Lighter)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Quantity (Step: 1)"
              placeholder="0"
              variant="filled-lighter"
              [(ngModel)]="quantity"
              [ngModelOptions]="{ standalone: true }"
              [step]="1"
              [min]="0"
              [max]="100"
              helpText="Min: 0, Max: 100, Step: 1"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Price (Step: 0.01)"
              placeholder="0.00"
              variant="filled-lighter"
              [(ngModel)]="price"
              [ngModelOptions]="{ standalone: true }"
              [step]="0.01"
              [min]="0"
              helpText="Min: 0, Step: 0.01"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Temperature (Step: 5)"
              placeholder="0"
              variant="filled-lighter"
              [(ngModel)]="temperature"
              [ngModelOptions]="{ standalone: true }"
              [step]="5"
              [min]="-50"
              [max]="50"
              helpText="Min: -50, Max: 50, Step: 5"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- Stepper Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Stepper Variants (Filled Gray)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Quantity (Step: 1)"
              placeholder="0"
              variant="filled-gray"
              [(ngModel)]="quantity"
              [ngModelOptions]="{ standalone: true }"
              [step]="1"
              [min]="0"
              [max]="100"
              helpText="Min: 0, Max: 100, Step: 1"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Price (Step: 0.01)"
              placeholder="0.00"
              variant="filled-gray"
              [(ngModel)]="price"
              [ngModelOptions]="{ standalone: true }"
              [step]="0.01"
              [min]="0"
              helpText="Min: 0, Step: 0.01"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Temperature (Step: 5)"
              placeholder="0"
              variant="filled-gray"
              [(ngModel)]="temperature"
              [ngModelOptions]="{ standalone: true }"
              [step]="5"
              [min]="-50"
              [max]="50"
              helpText="Min: -50, Max: 50, Step: 5"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- Stepper Variants - Filled -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Stepper Variants (Filled)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Quantity (Step: 1)"
              placeholder="0"
              variant="filled"
              [(ngModel)]="quantityFilled"
              [ngModelOptions]="{ standalone: true }"
              [step]="1"
              [min]="0"
              [max]="100"
              helpText="Min: 0, Max: 100, Step: 1"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Price (Step: 0.01)"
              placeholder="0.00"
              variant="filled"
              [(ngModel)]="priceFilled"
              [ngModelOptions]="{ standalone: true }"
              [step]="0.01"
              [min]="0"
              helpText="Min: 0, Step: 0.01"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Temperature (Step: 5)"
              placeholder="0"
              variant="filled"
              [(ngModel)]="temperatureFilled"
              [ngModelOptions]="{ standalone: true }"
              [step]="5"
              [min]="-50"
              [max]="50"
              helpText="Min: -50, Max: 50, Step: 5"
            ></app-number>
          </div>
        </div>
      </div>

      <!-- Stepper Variants - Underlined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Stepper Variants (Underlined)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-number
              label="Quantity (Step: 1)"
              placeholder="0"
              variant="underlined"
              [(ngModel)]="quantityUnderline"
              [ngModelOptions]="{ standalone: true }"
              [step]="1"
              [min]="0"
              [max]="100"
              helpText="Min: 0, Max: 100, Step: 1"
            ></app-number>
          </div>
          <div class="showcase__item">
            <app-number
              label="Small Size (Step: 1)"
              placeholder="0"
              variant="underlined"
              size="small"
              [(ngModel)]="quantitySmall"
              [ngModelOptions]="{ standalone: true }"
              [step]="1"
              [min]="0"
              [max]="50"
              helpText="Small size with stepper"
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
                [step]="1"
                [min]="0"
                [max]="150"
                helpText="Enter your age in years (0-150)"
              ></app-number>
              <app-number
                label="Phone Number"
                placeholder="Enter phone number"
                [(ngModel)]="formData.phone"
                [ngModelOptions]="{ standalone: true }"
                [step]="1"
                helpText="Enter your phone number"
              ></app-number>
              <app-number
                label="Salary"
                placeholder="Enter salary"
                [(ngModel)]="formData.salary"
                [ngModelOptions]="{ standalone: true }"
                [step]="1000"
                [min]="0"
                helpText="Enter your annual salary (step: 1000)"
              ></app-number>
              <app-number
                label="Experience Years"
                placeholder="Years of experience"
                [(ngModel)]="formData.experience"
                [ngModelOptions]="{ standalone: true }"
                [step]="1"
                [min]="0"
                [max]="50"
                helpText="Years of work experience (0-50)"
              ></app-number>
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

      <!-- Inline Edit Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Inline Edit</h2>
        <p class="showcase__section__description">
          Inline edit allows users to edit numbers directly by clicking on them. Changes are saved on
          blur or Enter, and can be cancelled with Escape.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Inline Edit</h3>
            <app-number
              label="Quantity"
              placeholder="Click to edit..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue1"
              [ngModelOptions]="{ standalone: true }"
              helpText="Click on the text to edit. Press Enter to save or Esc to cancel."
            ></app-number>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue1 || '(empty)' }}</strong>
            </p>
          </div>
          <div class="showcase__item">
            <h3>Inline Edit with Default Value</h3>
            <app-number
              label="Price"
              placeholder="Enter price..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue2"
              [ngModelOptions]="{ standalone: true }"
              [step]="0.01"
              helpText="Field with pre-filled value"
            ></app-number>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue2 || '(empty)' }}</strong>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class NumberShowcaseComponent {
  value = 42;

  // Stepper examples - Outline
  quantity = 10;
  price = 19.99;
  temperature = 0;

  // Stepper examples - Filled
  quantityFilled = 10;
  priceFilled = 19.99;
  temperatureFilled = 0;

  // Stepper examples - Underline
  quantityUnderline = 10;
  quantitySmall = 5;

  formData = {
    age: null as number | null,
    phone: null as number | null,
    salary: null as number | null,
    experience: null as number | null,
  };

  // Inline edit showcase values
  inlineEditValue1 = '';
  inlineEditValue2 = 99.99;
}

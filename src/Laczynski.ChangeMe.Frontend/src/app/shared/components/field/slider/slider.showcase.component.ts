import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { SliderComponent } from './slider.component';
import { FormsModule } from '@angular/forms';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-slider-showcase',

  imports: [CommonModule, SliderComponent, FormsModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">Slider Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Slider component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-slider
              [label]="'Volume'"
              [min]="0"
              [max]="100"
              [step]="1"
              [(ngModel)]="basicValue"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Brightness'"
              [min]="0"
              [max]="100"
              [(ngModel)]="basicValue2"
              helpText="Adjust screen brightness"
            />
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-slider
              [label]="'Small Slider'"
              [size]="'small'"
              [min]="0"
              [max]="100"
              [(ngModel)]="smallValue"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Medium Slider'"
              [size]="'medium'"
              [min]="0"
              [max]="100"
              [(ngModel)]="mediumValue"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Large Slider'"
              [size]="'large'"
              [min]="0"
              [max]="100"
              [(ngModel)]="largeValue"
            />
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-slider
              [label]="'Normal State'"
              [min]="0"
              [max]="100"
              [(ngModel)]="normalValue"
              helpText="This is a normal slider"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Error State'"
              [state]="'error'"
              [min]="0"
              [max]="100"
              [errorText]="'Value out of safe range'"
              [(ngModel)]="errorValue"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Warning State'"
              [state]="'warning'"
              [min]="0"
              [max]="100"
              [warningText]="'This is quite high'"
              [(ngModel)]="warningValue"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Success State'"
              [state]="'success'"
              [min]="0"
              [max]="100"
              [successText]="'Perfect setting!'"
              [(ngModel)]="successValue"
            />
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-slider
              [label]="'Disabled State'"
              [min]="0"
              [max]="100"
              [disabled]="true"
              [(ngModel)]="disabledValue"
              helpText="This slider is disabled"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Read-only State'"
              [min]="0"
              [max]="100"
              [readonly]="true"
              [(ngModel)]="readonlyValue"
              helpText="This slider is read only"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Required Slider'"
              [min]="0"
              [max]="100"
              [required]="true"
              [(ngModel)]="requiredValue"
              helpText="This field is required"
            />
          </div>
        </div>
      </div>

      <!-- Different Ranges -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Different Ranges</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-slider
              [label]="'Rating (0-10)'"
              [min]="0"
              [max]="10"
              [step]="1"
              [(ngModel)]="range10Value"
              helpText="Rate from 0 to 10"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Opacity (0-1)'"
              [min]="0"
              [max]="1"
              [step]="0.1"
              [(ngModel)]="range1Value"
              helpText="Adjust opacity from 0 to 1"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Custom Range (50-150)'"
              [min]="50"
              [max]="150"
              [step]="5"
              [(ngModel)]="customRangeValue"
              helpText="Custom range with step 5"
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
              <app-slider
                [label]="'Volume'"
                [min]="0"
                [max]="100"
                [helpText]="'Adjust the volume level'"
                [(ngModel)]="formData.volume"
                [ngModelOptions]="{ standalone: true }"
              />
              <app-slider
                [label]="'Temperature'"
                [min]="-20"
                [max]="40"
                [step]="1"
                [(ngModel)]="formData.temperature"
                [ngModelOptions]="{ standalone: true }"
                helpText="Temperature in Celsius"
              />
              <app-slider
                [label]="'Price Range'"
                [min]="0"
                [max]="1000"
                [step]="10"
                [(ngModel)]="formData.price"
                [ngModelOptions]="{ standalone: true }"
                helpText="Price range in dollars"
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
            <app-slider
              [label]="'Small + Error'"
              [size]="'small'"
              [state]="'error'"
              [min]="0"
              [max]="100"
              [errorText]="'Small error slider'"
              [(ngModel)]="comboValue1"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Medium + Warning'"
              [size]="'medium'"
              [state]="'warning'"
              [min]="0"
              [max]="100"
              [warningText]="'Medium warning slider'"
              [(ngModel)]="comboValue2"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Large + Success'"
              [size]="'large'"
              [state]="'success'"
              [min]="0"
              [max]="100"
              [successText]="'Large success slider'"
              [(ngModel)]="comboValue3"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Small + Disabled'"
              [size]="'small'"
              [disabled]="true"
              [min]="0"
              [max]="100"
              [(ngModel)]="comboValue4"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Medium + Read Only'"
              [size]="'medium'"
              [readonly]="true"
              [min]="0"
              [max]="100"
              [(ngModel)]="comboValue5"
            />
          </div>
          <div class="showcase__item">
            <app-slider
              [label]="'Large + Required'"
              [size]="'large'"
              [required]="true"
              [min]="0"
              [max]="100"
              [(ngModel)]="comboValue6"
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class SliderShowcaseComponent {
  // Basic values
  basicValue = signal(50);
  basicValue2 = signal(75);

  // Size variants
  smallValue = signal(30);
  mediumValue = signal(50);
  largeValue = signal(70);

  // State variants
  normalValue = signal(50);
  errorValue = signal(90);
  warningValue = signal(75);
  successValue = signal(80);
  disabledValue = signal(50);
  readonlyValue = signal(50);
  requiredValue = signal(50);

  // Different ranges
  range10Value = signal(5);
  range1Value = signal(0.5);
  customRangeValue = signal(100);

  // Combo values
  comboValue1 = signal(30);
  comboValue2 = signal(60);
  comboValue3 = signal(70);
  comboValue4 = signal(40);
  comboValue5 = signal(50);
  comboValue6 = signal(80);

  formData = {
    volume: 50,
    temperature: 20,
    price: 500,
  };
}

import { Component } from '@angular/core';
import { TextComponent } from './text.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-showcase',
  imports: [TextComponent, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Text Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Text component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-text
              label="Small Text Field"
              placeholder="Small text input"
              size="small"
              helpText="This is a small text field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Medium Text Field"
              placeholder="Medium text input"
              size="medium"
              helpText="This is a medium text field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Large Text Field"
              placeholder="Large text input"
              size="large"
              helpText="This is a large text field"
            ></app-text>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-text
              label="Normal State"
              placeholder="Normal state"
              helpText="This is a normal text field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
            ></app-text>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-text
              label="Disabled Field"
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Required Field"
              placeholder="Required field"
              [required]="true"
              helpText="This field is required"
            ></app-text>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-text
                label="First Name"
                placeholder="Enter first name"
                [(ngModel)]="formData.firstName"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your first name"
              ></app-text>
              <app-text
                label="Last Name"
                placeholder="Enter last name"
                [(ngModel)]="formData.lastName"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your last name"
              ></app-text>
              <app-text
                label="Email Address"
                placeholder="Enter email address"
                [(ngModel)]="formData.email"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your email address"
              ></app-text>
              <app-text
                label="Comments"
                placeholder="Enter your comments"
                [(ngModel)]="formData.comments"
                [ngModelOptions]="{ standalone: true }"
                helpText="Optional comments"
              ></app-text>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-text
              label="Small + Error"
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Medium + Read Only"
              placeholder="Medium read only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-text>
          </div>
          <div class="showcase__item">
            <app-text
              label="Large + Required"
              placeholder="Large required"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-text>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TextShowcaseComponent {
  value = 'This is a read-only value';

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    comments: '',
  };
}

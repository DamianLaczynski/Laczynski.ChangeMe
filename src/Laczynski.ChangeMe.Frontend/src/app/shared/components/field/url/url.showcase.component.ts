import { Component } from '@angular/core';
import { UrlComponent } from './url.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-showcase',
  imports: [UrlComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">URL Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the URL component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-url
              label="Small URL Field"
              placeholder="Enter URL"
              size="small"
              helpText="This is a small URL field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium URL Field"
              placeholder="Enter URL"
              size="medium"
              helpText="This is a medium URL field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Large URL Field"
              placeholder="Enter URL"
              size="large"
              helpText="This is a large URL field"
            ></app-url>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-url
              label="Normal State"
              placeholder="Normal state"
              helpText="This is a normal URL field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
            ></app-url>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-url
              label="Disabled Field"
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Required Field"
              placeholder="Required field"
              [required]="true"
              helpText="This field is required"
            ></app-url>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-url
                label="Website URL"
                placeholder="Enter website URL"
                [(ngModel)]="formData.website"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your website URL"
              ></app-url>
              <app-url
                label="LinkedIn Profile"
                placeholder="Enter LinkedIn profile"
                [(ngModel)]="formData.linkedin"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your LinkedIn profile URL"
              ></app-url>
              <app-url
                label="GitHub Profile"
                placeholder="Enter GitHub profile"
                [(ngModel)]="formData.github"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your GitHub profile URL"
              ></app-url>
              <app-url
                label="Portfolio URL"
                placeholder="Enter portfolio URL"
                [(ngModel)]="formData.portfolio"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your portfolio URL"
              ></app-url>
            </form>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-url
              label="Small + Error"
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium + Read Only"
              placeholder="Medium read only"
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Large + Required"
              placeholder="Large required"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-url>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UrlShowcaseComponent {
  value = 'https://www.example.com';

  formData = {
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
  };
}

import { Component } from '@angular/core';
import { UrlComponent } from './url.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-url-showcase',
  imports: [UrlComponent, FormsModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">URL Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the URL component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-url
              label="Website URL"
              placeholder="https://example.com"
              helpText="Enter a valid website URL"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="With Default Value"
              placeholder="https://example.com"
              [(ngModel)]="defaultValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="URL field with default value"
            ></app-url>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-url
              label="Small URL Field"
              placeholder="https://example.com"
              size="small"
              helpText="This is a small URL field"
              variant="underlined"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium URL Field"
              placeholder="https://example.com"
              size="medium"
              helpText="This is a medium URL field"
              variant="filled-gray"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Large URL Field"
              placeholder="https://example.com"
              size="large"
              helpText="This is a large URL field"
              variant="filled"
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
              placeholder="https://example.com"
              helpText="This is a normal URL field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Error State"
              placeholder="https://example.com"
              state="error"
              errorText="Invalid URL format"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Warning State"
              placeholder="https://example.com"
              state="warning"
              warningText="URL might be insecure"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Success State"
              placeholder="https://example.com"
              state="success"
              successText="Valid URL format"
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
              placeholder="https://example.com"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Read Only Field"
              placeholder="https://example.com"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Required Field"
              placeholder="https://example.com"
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
                placeholder="https://example.com"
                [(ngModel)]="formData.website"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Enter your website URL"
              ></app-url>
              <app-url
                label="GitHub Repository"
                placeholder="https://github.com/user/repo"
                [(ngModel)]="formData.github"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your GitHub repository URL"
              ></app-url>
              <app-url
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/profile"
                [(ngModel)]="formData.linkedin"
                [ngModelOptions]="{ standalone: true }"
                helpText="Enter your LinkedIn profile URL"
              ></app-url>
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
            <app-url
              label="Small + Error"
              placeholder="https://example.com"
              size="small"
              state="error"
              errorText="Invalid URL"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium + Warning"
              placeholder="https://example.com"
              size="medium"
              state="warning"
              warningText="URL warning"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Large + Success"
              placeholder="https://example.com"
              size="large"
              state="success"
              successText="Valid URL"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Small + Disabled"
              placeholder="https://example.com"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-url>
          </div>
          <div class="showcase__item">
            <app-url
              label="Medium + Read Only"
              placeholder="https://example.com"
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
              placeholder="https://example.com"
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-url>
          </div>
        </div>
      </div>

      <!-- Inline Edit Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Inline Edit</h2>
        <p class="showcase__section__description">
          Inline edit allows users to edit URL directly by clicking on it. Changes are saved on blur
          or Enter, and can be cancelled with Escape.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Inline Edit</h3>
            <app-url
              label="Website URL"
              placeholder="Click to edit..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue1"
              [ngModelOptions]="{ standalone: true }"
              helpText="Click on the text to edit. Press Enter to save or Esc to cancel."
            ></app-url>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue1 || '(empty)' }}</strong>
            </p>
          </div>
          <div class="showcase__item">
            <h3>Inline Edit with Default Value</h3>
            <app-url
              label="Homepage URL"
              placeholder="Enter URL..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue2"
              [ngModelOptions]="{ standalone: true }"
              helpText="Field with pre-filled value"
            ></app-url>
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
export class UrlShowcaseComponent {
  value = 'https://example.com';
  defaultValue = 'https://www.microsoft.com';

  formData = {
    website: '',
    github: '',
    linkedin: '',
  };

  // Inline edit showcase values
  inlineEditValue1 = '';
  inlineEditValue2 = 'https://example.com';
}


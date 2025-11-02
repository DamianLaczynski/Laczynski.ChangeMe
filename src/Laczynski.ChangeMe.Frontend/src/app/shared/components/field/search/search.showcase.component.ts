import { Component } from '@angular/core';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-search-showcase',
  imports: [SearchComponent, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Search Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Search component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-search
              label="Search"
              placeholder="Search..."
              helpText="Enter your search query"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="With Default Value"
              placeholder="Search..."
              [(ngModel)]="defaultValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="Search field with default value"
            ></app-search>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-search
              label="Small Search Field"
              placeholder="Search..."
              size="small"
              helpText="This is a small search field"
              variant="underlined"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium Search Field"
              placeholder="Search..."
              size="medium"
              helpText="This is a medium search field"
              variant="filled-gray"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Large Search Field"
              placeholder="Search..."
              size="large"
              helpText="This is a large search field"
              variant="filled"
            ></app-search>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-search
              label="Normal State"
              placeholder="Search..."
              helpText="This is a normal search field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Error State"
              placeholder="Search..."
              state="error"
              errorText="Search query is too short"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Warning State"
              placeholder="Search..."
              state="warning"
              warningText="No results found"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Success State"
              placeholder="Search..."
              state="success"
              successText="Found results"
            ></app-search>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-search
              label="Disabled Field"
              placeholder="Search..."
              [disabled]="true"
              helpText="This field is disabled"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Read Only Field"
              placeholder="Search..."
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Required Field"
              placeholder="Search..."
              [required]="true"
              helpText="This field is required"
            ></app-search>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-search
                label="Product Search"
                placeholder="Search products..."
                [(ngModel)]="formData.productSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search for products"
              ></app-search>
              <app-search
                label="User Search"
                placeholder="Search users..."
                [(ngModel)]="formData.userSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search for users"
              ></app-search>
              <app-search
                label="Document Search"
                placeholder="Search documents..."
                [(ngModel)]="formData.documentSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search for documents"
              ></app-search>
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
            <app-search
              label="Small + Error"
              placeholder="Search..."
              size="small"
              state="error"
              errorText="Invalid search"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium + Warning"
              placeholder="Search..."
              size="medium"
              state="warning"
              warningText="Search warning"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Large + Success"
              placeholder="Search..."
              size="large"
              state="success"
              successText="Search found results"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Small + Disabled"
              placeholder="Search..."
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium + Read Only"
              placeholder="Search..."
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="Medium read only field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Large + Required"
              placeholder="Search..."
              size="large"
              [required]="true"
              helpText="Large required field"
            ></app-search>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SearchShowcaseComponent {
  value = 'Sample search query';
  defaultValue = 'Default search';

  formData = {
    productSearch: '',
    userSearch: '',
    documentSearch: '',
  };
}


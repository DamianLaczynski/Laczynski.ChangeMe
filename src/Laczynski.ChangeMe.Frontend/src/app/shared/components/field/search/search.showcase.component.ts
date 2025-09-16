import { Component } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-showcase',
  imports: [SearchComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Search Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Search component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

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
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium Search Field"
              placeholder="Search..."
              size="medium"
              helpText="This is a medium search field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Large Search Field"
              placeholder="Search..."
              size="large"
              helpText="This is a large search field"
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
              placeholder="Normal state"
              helpText="This is a normal search field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Error State"
              placeholder="Error state"
              state="error"
              errorText="This field has an error"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Warning State"
              placeholder="Warning state"
              state="warning"
              warningText="This field has a warning"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Success State"
              placeholder="Success state"
              state="success"
              successText="This field is valid"
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
              placeholder="Disabled field"
              [disabled]="true"
              helpText="This field is disabled"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Read Only Field"
              placeholder="Read only field"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Required Field"
              placeholder="Required field"
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
                [required]="true"
                helpText="Search for products by name or description"
              ></app-search>
              <app-search
                label="User Search"
                placeholder="Search users..."
                [(ngModel)]="formData.userSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search for users by name or email"
              ></app-search>
              <app-search
                label="Content Search"
                placeholder="Search content..."
                [(ngModel)]="formData.contentSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search through all content"
              ></app-search>
              <app-search
                label="Document Search"
                placeholder="Search documents..."
                [(ngModel)]="formData.documentSearch"
                [ngModelOptions]="{ standalone: true }"
                helpText="Search through documents and files"
              ></app-search>
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
              placeholder="Small error"
              size="small"
              state="error"
              errorText="Small error field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium + Warning"
              placeholder="Medium warning"
              size="medium"
              state="warning"
              warningText="Medium warning field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Large + Success"
              placeholder="Large success"
              size="large"
              state="success"
              successText="Large success field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Small + Disabled"
              placeholder="Small disabled"
              size="small"
              [disabled]="true"
              helpText="Small disabled field"
            ></app-search>
          </div>
          <div class="showcase__item">
            <app-search
              label="Medium + Read Only"
              placeholder="Medium read only"
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
              placeholder="Large required"
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
  value = 'Search query example';

  formData = {
    productSearch: '',
    userSearch: '',
    contentSearch: '',
    documentSearch: '',
  };
}

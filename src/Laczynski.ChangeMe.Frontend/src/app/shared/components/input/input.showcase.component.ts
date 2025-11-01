import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'app-input-showcase',

  imports: [CommonModule, FormsModule, InputComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Input Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Input component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Label Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Label Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Small Label"
              labelSize="small"
              placeholder="Small input"
              ariaLabel="Small input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Small Bold Label"
              labelSize="small-bold"
              placeholder="Small bold input"
              ariaLabel="Small bold input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium Label"
              labelSize="medium"
              placeholder="Medium input"
              ariaLabel="Medium input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium Bold Label"
              labelSize="medium-bold"
              placeholder="Medium bold input"
              ariaLabel="Medium bold input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Large Label"
              labelSize="large"
              placeholder="Large input"
              ariaLabel="Large input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Required Field"
              labelSize="medium"
              [required]="true"
              placeholder="Required input"
              ariaLabel="Required input example"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Small (24px height)"
              labelSize="small"
              size="small"
              placeholder="Small input"
              ariaLabel="Small input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium (32px height) - Default"
              labelSize="medium"
              size="medium"
              placeholder="Medium input"
              ariaLabel="Medium input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Large (40px height)"
              labelSize="large"
              size="large"
              placeholder="Large input"
              ariaLabel="Large input example"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Style Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Filled (White Background)"
              labelSize="medium"
              variant="filled"
              placeholder="Filled input"
              ariaLabel="Filled input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Filled Gray"
              labelSize="medium"
              variant="filled-gray"
              placeholder="Filled gray input"
              ariaLabel="Filled gray input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Underlined"
              labelSize="medium"
              variant="underlined"
              placeholder="Underlined input"
              ariaLabel="Underlined input example"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Normal State"
              labelSize="medium"
              placeholder="Normal state"
              ariaLabel="Normal state input"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Error State"
              labelSize="medium"
              [error]="true"
              errorMessage="This field is required"
              placeholder="Error state"
              ariaLabel="Error state input"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Disabled State"
              labelSize="medium"
              [disabled]="true"
              placeholder="Disabled state"
              ariaLabel="Disabled state input"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- Input Types -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Input Types</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Text"
              labelSize="medium"
              type="text"
              placeholder="Enter text"
              ariaLabel="Text input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Email"
              labelSize="medium"
              type="email"
              placeholder="Enter email"
              ariaLabel="Email input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Password"
              labelSize="medium"
              type="password"
              placeholder="Enter password"
              ariaLabel="Password input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Number"
              labelSize="medium"
              type="number"
              placeholder="Enter number"
              ariaLabel="Number input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Search"
              labelSize="medium"
              type="search"
              placeholder="Search..."
              ariaLabel="Search input example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="URL"
              labelSize="medium"
              type="url"
              placeholder="Enter URL"
              ariaLabel="URL input example"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-input
              label="Small + Filled"
              labelSize="small"
              size="small"
              variant="filled"
              placeholder="Small filled"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Small + Filled Gray"
              labelSize="small"
              size="small"
              variant="filled-gray"
              placeholder="Small filled gray"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Small + Underlined"
              labelSize="small"
              size="small"
              variant="underlined"
              placeholder="Small underlined"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium + Filled"
              labelSize="medium"
              size="medium"
              variant="filled"
              placeholder="Medium filled"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium + Filled Gray"
              labelSize="medium"
              size="medium"
              variant="filled-gray"
              placeholder="Medium filled gray"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Medium + Underlined"
              labelSize="medium"
              size="medium"
              variant="underlined"
              placeholder="Medium underlined"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Large + Filled"
              labelSize="large"
              size="large"
              variant="filled"
              placeholder="Large filled"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Large + Filled Gray"
              labelSize="large"
              size="large"
              variant="filled-gray"
              placeholder="Large filled gray"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Large + Underlined"
              labelSize="large"
              size="large"
              variant="underlined"
              placeholder="Large underlined"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-input
                label="First Name"
                labelSize="medium"
                type="text"
                placeholder="Enter first name"
                [required]="true"
                ariaLabel="First name"
              >
              </app-input>
              <app-input
                label="Last Name"
                labelSize="medium"
                type="text"
                placeholder="Enter last name"
                [required]="true"
                ariaLabel="Last name"
              >
              </app-input>
              <app-input
                label="Email Address"
                labelSize="medium"
                type="email"
                placeholder="Enter email address"
                [required]="true"
                ariaLabel="Email address"
              >
              </app-input>
            </form>
          </div>
          <div class="showcase__item">
            <app-input
              label="Search Products"
              labelSize="large"
              type="search"
              placeholder="Search products..."
              size="large"
              ariaLabel="Product search"
            >
            </app-input>
          </div>
        </div>
      </div>

      <!-- Label States Showcase -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Label States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-input
              label="Normal Label"
              labelSize="medium"
              placeholder="Normal state"
              ariaLabel="Normal label example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Disabled Label"
              labelSize="medium"
              [disabled]="true"
              placeholder="Disabled state"
              ariaLabel="Disabled label example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Required Field"
              labelSize="medium"
              [required]="true"
              placeholder="Required field"
              ariaLabel="Required field example"
            >
            </app-input>
          </div>
          <div class="showcase__item">
            <app-input
              label="Read Only Field"
              labelSize="medium"
              [readOnly]="true"
              placeholder="Read only field"
              ariaLabel="Read only field example"
            >
            </app-input>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InputShowcaseComponent {
  // Component logic if needed
}

import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-showcase',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Button Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Button component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-button variant="primary" (click)="onButtonClick($event)">
              Primary Button
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button variant="secondary" (click)="onButtonClick($event)">
              Secondary Button
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button variant="outline" (click)="onButtonClick($event)">
              Outline Button
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button variant="subtle" (click)="onButtonClick($event)">
              Subtle Button
            </app-button>
          </div>
        </div>
      </div>

      <!-- Primary Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Primary Style</h2>
        <div class="showcase__grid">
          <app-button variant="primary" size="large" (click)="onButtonClick($event)">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="primary" size="medium" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="primary" size="small" (click)="onButtonClick($event)">
            <svg slot="icon" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="primary" size="small" (click)="onButtonClick($event)">
            Button
          </app-button>
        </div>

        <div class="showcase__grid">
          <app-button
            variant="primary"
            size="large"
            [iconOnly]="true"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </app-button>
          <app-button
            variant="primary"
            size="medium"
            [iconOnly]="true"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
          </app-button>
          <app-button
            variant="primary"
            size="small"
            [iconOnly]="true"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
          </app-button>
        </div>
      </div>

      <!-- Secondary Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Secondary Style (Default)</h2>
        <div class="showcase__grid">
          <app-button variant="secondary" size="large" (click)="onButtonClick($event)">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="secondary" size="medium" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="secondary" size="small" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
        </div>
      </div>

      <!-- Outline Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Outline Style</h2>
        <div class="showcase__grid">
          <app-button variant="outline" size="large" (click)="onButtonClick($event)">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="outline" size="medium" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="outline" size="small" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
        </div>
      </div>

      <!-- Subtle Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Subtle Style</h2>
        <div class="showcase__grid">
          <app-button variant="subtle" size="large" (click)="onButtonClick($event)">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="subtle" size="medium" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="subtle" size="small" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
        </div>
      </div>

      <!-- Transparent Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Transparent Style</h2>
        <div class="showcase__grid">
          <app-button variant="transparent" size="large" (click)="onButtonClick($event)">
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="transparent" size="medium" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="transparent" size="small" (click)="onButtonClick($event)">
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <app-button variant="primary" (click)="onButtonClick($event)">Normal</app-button>
          <app-button variant="primary" [selected]="true" (click)="onButtonClick($event)"
            >Selected</app-button
          >
          <app-button variant="primary" [disabled]="true" (click)="onButtonClick($event)"
            >Disabled</app-button
          >
        </div>
        <div class="showcase__grid">
          <app-button variant="secondary" (click)="onButtonClick($event)">Normal</app-button>
          <app-button variant="secondary" [selected]="true" (click)="onButtonClick($event)"
            >Selected</app-button
          >
          <app-button variant="secondary" [disabled]="true" (click)="onButtonClick($event)"
            >Disabled</app-button
          >
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-button variant="primary" size="small" (click)="onButtonClick($event)">
              Small Primary
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button
              variant="secondary"
              size="medium"
              [disabled]="true"
              (click)="onButtonClick($event)"
            >
              Medium Disabled
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button variant="outline" size="large" (click)="onButtonClick($event)">
              Large Outline
            </app-button>
          </div>
          <div class="showcase__item">
            <app-button variant="subtle" [selected]="true" (click)="onButtonClick($event)">
              Selected Subtle
            </app-button>
          </div>
        </div>
      </div>

      <!-- Full Width -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Full Width</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-button variant="primary" [fullWidth]="true" (click)="onButtonClick($event)">
              <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
              </svg>
              Full Width Button
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ButtonShowcaseComponent {
  onButtonClick(event: MouseEvent): void {
    console.log('Button clicked:', event);
  }

  constructor() {}
}

import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-showcase',
  imports: [ButtonComponent, CommonModule],
  template: `
    <div class="showcase">
      <h2>Fluent 2 Button Component Showcase</h2>

      <!-- Primary Style Variants -->
      <section class="showcase__section">
        <h3>Primary Style</h3>
        <div class="showcase__row">
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
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
            Button
          </app-button>
          <app-button variant="primary" size="small" (click)="onButtonClick($event)">
            Button
          </app-button>
        </div>

        <div class="showcase__row">
          <app-button
            variant="primary"
            size="large"
            layout="icon-only"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </app-button>
          <app-button
            variant="primary"
            size="medium"
            layout="icon-only"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
          </app-button>
          <app-button
            variant="primary"
            size="small"
            layout="icon-only"
            (click)="onButtonClick($event)"
          >
            <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
            </svg>
          </app-button>
        </div>
      </section>

      <!-- Secondary Style Variants -->
      <section class="showcase__section">
        <h3>Secondary Style (Default)</h3>
        <div class="showcase__row">
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
      </section>

      <!-- Outline Style Variants -->
      <section class="showcase__section">
        <h3>Outline Style</h3>
        <div class="showcase__row">
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
      </section>

      <!-- Subtle Style Variants -->
      <section class="showcase__section">
        <h3>Subtle Style</h3>
        <div class="showcase__row">
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
      </section>

      <!-- Transparent Style Variants -->
      <section class="showcase__section">
        <h3>Transparent Style</h3>
        <div class="showcase__row">
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
      </section>

      <!-- State Variants -->
      <section class="showcase__section">
        <h3>Button States</h3>
        <div class="showcase__row">
          <app-button variant="primary" (click)="onButtonClick($event)">Normal</app-button>
          <app-button variant="primary" [selected]="true" (click)="onButtonClick($event)"
            >Selected</app-button
          >
          <app-button variant="primary" [disabled]="true" (click)="onButtonClick($event)"
            >Disabled</app-button
          >
        </div>
        <div class="showcase__row">
          <app-button variant="secondary" (click)="onButtonClick($event)">Normal</app-button>
          <app-button variant="secondary" [selected]="true" (click)="onButtonClick($event)"
            >Selected</app-button
          >
          <app-button variant="secondary" [disabled]="true" (click)="onButtonClick($event)"
            >Disabled</app-button
          >
        </div>
      </section>

      <!-- Full Width -->
      <section class="showcase__section">
        <h3>Full Width</h3>
        <app-button variant="primary" [fullWidth]="true" (click)="onButtonClick($event)">
          <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1" fill="none" />
          </svg>
          Full Width Button
        </app-button>
      </section>
    </div>
  `,
  styles: [
    `
      .showcase {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .showcase__section {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }

      .showcase__section h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .showcase__row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .showcase__row:last-child {
        margin-bottom: 0;
      }

      h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
      }
    `,
  ],
})
export class ButtonShowcaseComponent {
  onButtonClick(event: MouseEvent): void {
    console.log('Button clicked:', event);
  }

  constructor() {}
}

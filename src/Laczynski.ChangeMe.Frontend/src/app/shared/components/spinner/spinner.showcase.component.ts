import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-spinner-showcase',
  imports: [SpinnerComponent, CommonModule, TableOfContentComponent],
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
        <h1 class="showcase__title">Spinner Component</h1>
      <p class="showcase__description">
        Spinner component based on Fluent 2 Design System - displays loading states with
        customizable sizes, states (colors), and label positions.
      </p>

      <!-- Size Variants - Default State -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Size Variants - Default State</h2>
        <p class="showcase__section__description">
          All available spinner sizes with default (brand) colors.
        </p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-tiny" state="default" />
            <span style="font-size: 12px; color: #424242;">Extra Tiny (16px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="tiny" state="default" />
            <span style="font-size: 12px; color: #424242;">Tiny (20px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-small" state="default" />
            <span style="font-size: 12px; color: #424242;">Extra Small (24px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="small" state="default" />
            <span style="font-size: 12px; color: #424242;">Small (28px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="medium" state="default" />
            <span style="font-size: 12px; color: #424242;">Medium (32px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="default" />
            <span style="font-size: 12px; color: #424242;">Large (36px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-large" state="default" />
            <span style="font-size: 12px; color: #424242;">Extra Large (40px)</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="huge" state="default" />
            <span style="font-size: 12px; color: #424242;">Huge (44px)</span>
          </div>
        </div>
      </section>

      <!-- State Variants (Colors) -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">State Variants (Colors)</h2>
        <p class="showcase__section__description">Different color states for various use cases.</p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;"
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="default" />
            <span style="font-size: 12px; color: #424242;">Default</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="info" />
            <span style="font-size: 12px; color: #424242;">Info</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="success" />
            <span style="font-size: 12px; color: #424242;">Success</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="warning" />
            <span style="font-size: 12px; color: #424242;">Warning</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="error" />
            <span style="font-size: 12px; color: #424242;">Error</span>
          </div>
        </div>
      </section>

      <!-- Inverted State -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Inverted State</h2>
        <p class="showcase__section__description">Inverted colors for dark backgrounds.</p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; background: #0F6CBD; padding: 32px; border-radius: 8px;"
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-tiny" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Extra Tiny</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="tiny" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Tiny</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-small" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Extra Small</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="small" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Small</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="medium" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Medium</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="large" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Large</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="extra-large" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Extra Large</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <app-spinner size="huge" state="inverted" />
            <span style="font-size: 12px; color: #FFFFFF;">Huge</span>
          </div>
        </div>
      </section>

      <!-- Label Position - After -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Label Position - After</h2>
        <p class="showcase__section__description">
          Spinner with label positioned after (to the right of) the spinner.
        </p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
        >
          <app-spinner size="tiny" state="default" labelPosition="after" label="Loading..." />
          <app-spinner size="small" state="success" labelPosition="after" label="Saving..." />
          <app-spinner size="medium" state="info" labelPosition="after" label="Processing..." />
          <app-spinner size="large" state="warning" labelPosition="after" label="Warning..." />
        </div>
      </section>

      <!-- Label Position - Before -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Label Position - Before</h2>
        <p class="showcase__section__description">
          Spinner with label positioned before (to the left of) the spinner.
        </p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
        >
          <app-spinner size="tiny" state="default" labelPosition="before" label="Loading..." />
          <app-spinner size="small" state="success" labelPosition="before" label="Saving..." />
          <app-spinner size="medium" state="info" labelPosition="before" label="Processing..." />
          <app-spinner size="large" state="error" labelPosition="before" label="Error..." />
        </div>
      </section>

      <!-- Label Position - Above -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Label Position - Above</h2>
        <p class="showcase__section__description">
          Spinner with label positioned above the spinner.
        </p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap;"
        >
          <app-spinner size="medium" state="default" labelPosition="above" label="Loading..." />
          <app-spinner size="medium" state="success" labelPosition="above" label="Success!" />
          <app-spinner size="medium" state="warning" labelPosition="above" label="Warning!" />
        </div>
      </section>

      <!-- Label Position - Below -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Label Position - Below</h2>
        <p class="showcase__section__description">
          Spinner with label positioned below the spinner.
        </p>

        <div
          class="showcase__demo"
          style="display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap;"
        >
          <app-spinner size="medium" state="default" labelPosition="below" label="Loading..." />
          <app-spinner size="medium" state="success" labelPosition="below" label="Success!" />
          <app-spinner size="medium" state="error" labelPosition="below" label="Error!" />
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Usage Examples</h2>
        <p class="showcase__section__description">
          Real-world usage examples of the spinner component.
        </p>

        <div class="showcase__demo" style="display: flex; flex-direction: column; gap: 32px;">
          <!-- Inline with text -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <app-spinner size="small" state="default" />
            <span style="font-size: 14px; color: #424242;">Loading data...</span>
          </div>

          <!-- Button with spinner -->
          <div
            style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0F6CBD; color: white; border-radius: 4px;"
          >
            <app-spinner size="tiny" state="inverted" />
            <span style="font-size: 14px;">Submitting</span>
          </div>

          <!-- Success state -->
          <div
            style="display: inline-flex; align-items: center; gap: 8px; padding: 12px; background: #C9EAC9; border-radius: 4px;"
          >
            <app-spinner size="small" state="success" />
            <span style="font-size: 14px; color: #107C10;">Saving changes...</span>
          </div>

          <!-- Error state -->
          <div
            style="display: inline-flex; align-items: center; gap: 8px; padding: 12px; background: #F8DADB; border-radius: 4px;"
          >
            <app-spinner size="small" state="error" />
            <span style="font-size: 14px; color: #D13438;">Operation failed, retrying...</span>
          </div>

          <!-- Centered in card -->
          <div
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; background: #F3F2F1; border-radius: 8px;"
          >
            <app-spinner
              size="large"
              state="default"
              labelPosition="below"
              label="Loading content..."
            />
          </div>

          <!-- Full page loader -->
          <div
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;"
          >
            <app-spinner
              size="extra-large"
              state="inverted"
              labelPosition="below"
              label="Please wait..."
            />
          </div>
        </div>
      </section>
      </div>
    </div>
  `,
})
export class SpinnerShowcaseComponent {}

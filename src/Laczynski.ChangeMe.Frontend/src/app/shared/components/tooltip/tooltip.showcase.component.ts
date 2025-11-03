import { Component } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tooltip-showcase',
  standalone: true,
  imports: [TooltipComponent, CommonModule, ButtonComponent, IconComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tooltip Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tooltip component built with Fluent 2 Design System. The Tooltip
        component displays helpful contextual information when users hover over or focus on an element.
        Tooltips are positioned relative to their trigger element and support multiple positions and sizes.
      </p>

      <!-- Basic Usage -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Usage</h2>
        <p class="showcase__section__description">
          Simple tooltips that appear on hover or focus with default top positioning.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <app-tooltip text="This is a helpful tooltip">
              <app-button variant="primary">Hover me</app-button>
            </app-tooltip>

            <app-tooltip text="Another tooltip example">
              <app-button variant="outline">Hover me too</app-button>
            </app-tooltip>

            <app-tooltip text="Tooltip on icon button">
              <app-button variant="subtle" [iconOnly]="true">
                <app-icon [icon]="'info'" [size]="'medium'" />
              </app-button>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- Position Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Position Variants</h2>
        <p class="showcase__section__description">
          Tooltips can be positioned above, below, to the left, or to the right of the trigger element.
        </p>
        <div class="showcase__preview">
          <div
            style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; align-items: center; justify-items: center; padding: 64px;"
          >
            <!-- Top -->
            <div style="grid-column: 2; grid-row: 1;">
              <app-tooltip text="Tooltip on top" position="top">
                <app-button variant="outline">Top</app-button>
              </app-tooltip>
            </div>

            <!-- Left -->
            <div style="grid-column: 1; grid-row: 2;">
              <app-tooltip text="Tooltip on left" position="left">
                <app-button variant="outline">Left</app-button>
              </app-tooltip>
            </div>

            <!-- Center placeholder -->
            <div style="grid-column: 2; grid-row: 2;"></div>

            <!-- Right -->
            <div style="grid-column: 3; grid-row: 2;">
              <app-tooltip text="Tooltip on right" position="right">
                <app-button variant="outline">Right</app-button>
              </app-tooltip>
            </div>

            <!-- Bottom -->
            <div style="grid-column: 2; grid-row: 3;">
              <app-tooltip text="Tooltip on bottom" position="bottom">
                <app-button variant="outline">Bottom</app-button>
              </app-tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <p class="showcase__section__description">
          Different sizes available: small, medium (default), and large. Large tooltips support multiline text.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <app-tooltip text="Small tooltip" size="small">
              <app-button variant="outline">Small</app-button>
            </app-tooltip>

            <app-tooltip text="Medium tooltip (default)" size="medium">
              <app-button variant="outline">Medium</app-button>
            </app-tooltip>

            <app-tooltip
              text="Large tooltip with longer text that can wrap to multiple lines for better readability and context."
              size="large"
            >
              <app-button variant="outline">Large</app-button>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- With Different Content Types -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Different Content Types</h2>
        <p class="showcase__section__description">
          Tooltips work with various trigger elements like buttons, icons, links, and form fields.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
            <app-tooltip text="Click to save your changes">
              <app-button variant="primary">Save</app-button>
            </app-tooltip>

            <app-tooltip text="Delete this item permanently">
              <app-button variant="outline">Delete</app-button>
            </app-tooltip>

            <div style="display: flex; gap: 8px; align-items: center;">
              <label for="tooltip-input">Username:</label>
              <app-tooltip text="Enter your username or email address">
                <input
                  id="tooltip-input"
                  type="text"
                  placeholder="Enter username"
                  style="padding: 8px 12px; border: 1px solid #D1D1D1; border-radius: 4px;"
                />
              </app-tooltip>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <app-tooltip text="More information about this feature">
                <app-icon [icon]="'info'" [size]="'medium'" style="cursor: pointer; color: #0078D4;" />
              </app-tooltip>
              <span>Click the icon for more info</span>
            </div>

            <app-tooltip text="This link opens in a new window">
              <a href="#" style="color: #0078D4; text-decoration: none;">Learn more →</a>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- Disabled State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Disabled State</h2>
        <p class="showcase__section__description">
          Tooltips can be disabled to prevent them from showing, even on hover or focus.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <app-tooltip text="This tooltip is enabled">
              <app-button variant="outline">Enabled Tooltip</app-button>
            </app-tooltip>

            <app-tooltip text="This tooltip is disabled" [disabled]="true">
              <app-button variant="outline">Disabled Tooltip</app-button>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- Custom Delay -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Delay</h2>
        <p class="showcase__section__description">
          Tooltips can have custom delay before appearing. Default is 300ms.
        </p>
        <div class="showcase__preview">
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <app-tooltip text="Immediate tooltip (0ms delay)" [delay]="0">
              <app-button variant="outline">No Delay</app-button>
            </app-tooltip>

            <app-tooltip text="Default tooltip (300ms delay)" [delay]="300">
              <app-button variant="outline">Default Delay</app-button>
            </app-tooltip>

            <app-tooltip text="Slow tooltip (1000ms delay)" [delay]="1000">
              <app-button variant="outline">Slow Delay</app-button>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- In Context Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">In Context Examples</h2>
        <p class="showcase__section__description">
          Real-world examples of how to use tooltips in common UI patterns.
        </p>
        <div class="showcase__preview">
          <div style="background: #F3F2F1; padding: 24px; border-radius: 8px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Form with Tooltips</h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <label for="email-field" style="min-width: 120px;">Email Address:</label>
                <app-tooltip text="Enter a valid email address (e.g., user@example.com)" position="right">
                  <input
                    id="email-field"
                    type="email"
                    placeholder="user@example.com"
                    style="flex: 1; padding: 8px 12px; border: 1px solid #D1D1D1; border-radius: 4px;"
                  />
                </app-tooltip>
                <app-tooltip text="Required field" position="top">
                  <span style="color: #D13438;">*</span>
                </app-tooltip>
              </div>

              <div style="display: flex; gap: 8px; align-items: center;">
                <label for="password-field" style="min-width: 120px;">Password:</label>
                <app-tooltip
                  text="Password must be at least 8 characters long and include uppercase, lowercase, and numbers"
                  position="right"
                  size="large"
                >
                  <input
                    id="password-field"
                    type="password"
                    placeholder="Enter password"
                    style="flex: 1; padding: 8px 12px; border: 1px solid #D1D1D1; border-radius: 4px;"
                  />
                </app-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Tooltip component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class TooltipShowcaseComponent {
  usageExample = `// In your component
import { TooltipComponent } from '@shared/components/tooltip';
import { ButtonComponent } from '@shared/components/button';

@Component({
  template: \`
    <!-- Basic tooltip -->
    <app-tooltip text="This is a helpful tooltip">
      <app-button variant="primary">Hover me</app-button>
    </app-tooltip>

    <!-- Tooltip with custom position -->
    <app-tooltip text="Tooltip on the right" position="right">
      <app-button variant="outline">Hover me</app-button>
    </app-tooltip>

    <!-- Tooltip with custom size -->
    <app-tooltip 
      text="Large tooltip with longer text that wraps to multiple lines" 
      size="large"
    >
      <app-button variant="outline">Hover me</app-button>
    </app-tooltip>

    <!-- Tooltip with custom delay -->
    <app-tooltip text="Slow tooltip" [delay]="1000">
      <app-button variant="outline">Hover me</app-button>
    </app-tooltip>

    <!-- Disabled tooltip -->
    <app-tooltip text="This won't show" [disabled]="true">
      <app-button variant="outline">Disabled</app-button>
    </app-tooltip>

    <!-- Tooltip on input field -->
    <app-tooltip text="Enter your username or email">
      <input type="text" placeholder="Username" />
    </app-tooltip>

    <!-- Tooltip on icon -->
    <app-tooltip text="More information">
      <app-icon [icon]="'info'" [size]="'medium'" />
    </app-tooltip>
  \`
})
export class MyComponent {}`;
}


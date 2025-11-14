import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableOfContentComponent } from './table-of-content.component';
import { CheckboxComponent } from '../field/checkbox/checkbox.component';
import { DropdownComponent } from '../field/dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-of-content-showcase',
  imports: [
    CommonModule,
    TableOfContentComponent,
    CheckboxComponent,
    DropdownComponent,
    FormsModule,
  ],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Table of Content Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Table of Content component built with Fluent 2 Design System.
        TOC automatically detects headings in a container and creates a hierarchical navigation
        structure with active section highlighting.
      </p>

      <!-- ========================================= -->
      <!-- BASIC TOC -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Table of Content</h2>
        <div class="showcase__grid showcase__grid--two-columns">
          <div class="showcase__item">
            <h3>Default TOC</h3>
            <p class="showcase__section__description">
              Automatically detects all headings (h1-h6) in the showcase container.
            </p>
            <app-table-of-content />
          </div>
          <div class="showcase__item">
            <h3>Content with Headings</h3>
            <div class="showcase__example">
              <h1 id="introduction">Introduction</h1>
              <p>This is the introduction section with some content.</p>

              <h2 id="getting-started">Getting Started</h2>
              <p>This section explains how to get started.</p>

              <h3 id="installation">Installation</h3>
              <p>Installation instructions go here.</p>

              <h3 id="configuration">Configuration</h3>
              <p>Configuration details are explained here.</p>

              <h2 id="usage">Usage</h2>
              <p>Usage examples and documentation.</p>

              <h3 id="basic-usage">Basic Usage</h3>
              <p>Basic usage examples.</p>

              <h3 id="advanced-usage">Advanced Usage</h3>
              <p>Advanced usage examples.</p>

              <h2 id="api-reference">API Reference</h2>
              <p>API documentation and reference.</p>

              <h3 id="methods">Methods</h3>
              <p>Available methods documentation.</p>

              <h3 id="properties">Properties</h3>
              <p>Component properties documentation.</p>

              <h2 id="examples">Examples</h2>
              <p>Code examples and demos.</p>

              <h2 id="conclusion">Conclusion</h2>
              <p>Final thoughts and summary.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SIZE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-table-of-content [size]="'small'" />
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-table-of-content [size]="'medium'" />
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-table-of-content [size]="'large'" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- APPEARANCE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Appearance Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Transparent</h3>
            <app-table-of-content [variant]="'transparent'" />
          </div>
          <div class="showcase__item">
            <h3>Subtle (Default)</h3>
            <app-table-of-content [variant]="'subtle'" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-table-of-content [variant]="'subtle-circular'" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-table-of-content [variant]="'filled-circular'" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SELECTION INDICATORS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicators</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Horizontal Indicator</h3>
            <app-table-of-content
              [showSelectionIndicator]="true"
              [indicatorPosition]="'horizontal'"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Default)</h3>
            <app-table-of-content
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
            />
          </div>
          <div class="showcase__item">
            <h3>No Indicator</h3>
            <app-table-of-content [showSelectionIndicator]="false" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- STICKY POSITIONING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Sticky Positioning</h2>
        <div class="showcase__grid showcase__grid--two-columns">
          <div class="showcase__item">
            <h3>Sticky TOC</h3>
            <p class="showcase__section__description">
              TOC stays visible while scrolling through the content.
            </p>
            <app-table-of-content [sticky]="true" [offsetTop]="20" />
          </div>
          <div class="showcase__item">
            <h3>Long Content</h3>
            <div class="showcase__example" style="max-height: 600px; overflow-y: auto;">
              <h1 id="sticky-section-1">Section 1</h1>
              <p>Content for section 1. Scroll to see the sticky TOC in action.</p>
              <p>More content here...</p>
              <p>Even more content...</p>

              <h2 id="sticky-section-1-1">Subsection 1.1</h2>
              <p>Subsection content.</p>

              <h2 id="sticky-section-1-2">Subsection 1.2</h2>
              <p>Another subsection.</p>

              <h1 id="sticky-section-2">Section 2</h1>
              <p>Content for section 2.</p>

              <h2 id="sticky-section-2-1">Subsection 2.1</h2>
              <p>Subsection content.</p>

              <h1 id="sticky-section-3">Section 3</h1>
              <p>Content for section 3.</p>

              <h1 id="sticky-section-4">Section 4</h1>
              <p>Content for section 4.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CONTAINER SELECTOR -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Container Selector</h2>
        <div class="showcase__grid showcase__grid--two-columns">
          <div class="showcase__item">
            <h3>Custom Container</h3>
            <p class="showcase__section__description">
              TOC can target a specific container using a CSS selector.
            </p>
            <app-table-of-content containerSelector=".custom-content" />
          </div>
          <div class="showcase__item">
            <h3>Custom Content Area</h3>
            <div class="custom-content showcase__example">
              <h1 id="custom-1">Custom Heading 1</h1>
              <p>This content is in a custom container.</p>

              <h2 id="custom-2">Custom Heading 2</h2>
              <p>More custom content.</p>

              <h3 id="custom-3">Custom Heading 3</h3>
              <p>Nested heading content.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- HEADING LEVEL FILTERING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Heading Level Filtering</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>H1 and H2 Only</h3>
            <app-table-of-content [minLevel]="1" [maxLevel]="2" />
          </div>
          <div class="showcase__item">
            <h3>H2 and H3 Only</h3>
            <app-table-of-content [minLevel]="2" [maxLevel]="3" />
          </div>
          <div class="showcase__item">
            <h3>All Levels (Default)</h3>
            <app-table-of-content [minLevel]="1" [maxLevel]="6" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- INTERACTIVE EXAMPLE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Example</h2>
        <div class="showcase__controls">
          <app-checkbox
            label="Sticky"
            [(ngModel)]="interactiveToc.sticky"
          />
          <app-checkbox
            label="Show Selection Indicator"
            [(ngModel)]="interactiveToc.showSelectionIndicator"
          />
          <app-dropdown
            [items]="sizeOptions"
            label="Size"
            [(ngModel)]="interactiveToc.size"
          />
          <app-dropdown
            [items]="variantOptions"
            label="Variant"
            [(ngModel)]="interactiveToc.variant"
          />
          <app-dropdown
            [items]="indicatorPositionOptions"
            label="Indicator Position"
            [(ngModel)]="interactiveToc.indicatorPosition"
          />
        </div>

        <div class="showcase__grid showcase__grid--two-columns" style="margin-top: 20px;">
          <div class="showcase__item">
            <h3>Interactive TOC</h3>
            <app-table-of-content
              [sticky]="interactiveToc.sticky"
              [showSelectionIndicator]="interactiveToc.showSelectionIndicator"
              [size]="interactiveToc.size"
              [variant]="interactiveToc.variant"
              [indicatorPosition]="interactiveToc.indicatorPosition"
            />
          </div>
          <div class="showcase__item">
            <h3>Content</h3>
            <div class="showcase__example">
              <h1 id="interactive-1">Interactive Section 1</h1>
              <p>This TOC updates based on the controls above.</p>

              <h2 id="interactive-1-1">Subsection 1.1</h2>
              <p>Try changing the settings to see how the TOC adapts.</p>

              <h2 id="interactive-1-2">Subsection 1.2</h2>
              <p>Scroll to see active section highlighting.</p>

              <h1 id="interactive-2">Interactive Section 2</h1>
              <p>More content for testing.</p>

              <h1 id="interactive-3">Interactive Section 3</h1>
              <p>Final section for demonstration.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- COMPLEX EXAMPLE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Complex Example</h2>
        <div class="showcase__grid showcase__grid--two-columns">
          <div class="showcase__item">
            <h3>Full Featured TOC</h3>
            <app-table-of-content
              [size]="'medium'"
              [variant]="'subtle'"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
              [sticky]="true"
              [offsetTop]="20"
            />
          </div>
          <div class="showcase__item">
            <h3>Documentation Content</h3>
            <div class="showcase__example" style="max-height: 500px; overflow-y: auto;">
              <h1 id="overview">Overview</h1>
              <p>
                This is a comprehensive documentation example showing how the Table of Content
                component works with real-world content.
              </p>

              <h2 id="features">Features</h2>
              <p>The component includes the following features:</p>

              <h3 id="auto-detection">Automatic Detection</h3>
              <p>Automatically detects all headings in the specified container.</p>

              <h3 id="hierarchical-structure">Hierarchical Structure</h3>
              <p>Builds a hierarchical structure based on heading levels.</p>

              <h3 id="active-tracking">Active Section Tracking</h3>
              <p>Tracks and highlights the currently visible section.</p>

              <h2 id="installation">Installation</h2>
              <p>Installation instructions and setup guide.</p>

              <h3 id="npm-install">NPM Installation</h3>
              <p>Install via npm package manager.</p>

              <h3 id="yarn-install">Yarn Installation</h3>
              <p>Install via yarn package manager.</p>

              <h2 id="usage">Usage</h2>
              <p>How to use the component in your application.</p>

              <h3 id="basic-usage-example">Basic Usage</h3>
              <p>Simple usage example with default settings.</p>

              <h3 id="advanced-usage-example">Advanced Usage</h3>
              <p>Advanced configuration and customization options.</p>

              <h2 id="api">API Reference</h2>
              <p>Complete API documentation.</p>

              <h3 id="inputs">Inputs</h3>
              <p>Component input properties.</p>

              <h3 id="outputs">Outputs</h3>
              <p>Component output events.</p>

              <h2 id="examples-section">Examples</h2>
              <p>Code examples and use cases.</p>

              <h2 id="faq">FAQ</h2>
              <p>Frequently asked questions.</p>

              <h2 id="support">Support</h2>
              <p>Get help and support information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TableOfContentShowcaseComponent {
  interactiveToc = {
    sticky: false,
    showSelectionIndicator: true,
    size: 'medium' as const,
    variant: 'subtle' as const,
    indicatorPosition: 'vertical' as const,
  };

  sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  variantOptions = [
    { value: 'transparent', label: 'Transparent' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'subtle-circular', label: 'Subtle Circular' },
    { value: 'filled-circular', label: 'Filled Circular' },
  ];

  indicatorPositionOptions = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
  ];
}


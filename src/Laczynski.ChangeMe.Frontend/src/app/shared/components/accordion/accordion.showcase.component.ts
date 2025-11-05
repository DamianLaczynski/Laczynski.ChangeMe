import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { TextComponent } from '../field/text/text.component';
import { EmailComponent } from '../field/email/email.component';

@Component({
  selector: 'app-accordion-showcase',
  imports: [AccordionComponent, CommonModule, ButtonComponent, TextComponent, EmailComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Accordion Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Accordion component built with Fluent 2 Design System.
        Accordions support expand/collapse functionality, multiple sizes, appearance variants,
        selection indicators, and quick actions.
      </p>

      <!-- ========================================= -->
      <!-- BASIC ACCORDIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Accordions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Collapsed</h3>
            <app-accordion label="Basic Accordion (Collapsed)">
              <p>This is the content inside the accordion panel.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Expanded</h3>
            <app-accordion label="Basic Accordion (Expanded)">
              <p>This is the content inside the accordion panel.</p>
              <p>You can put any content here.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>With Icon</h3>
            <app-accordion label="Accordion with Icon" icon="folder">
              <p>This accordion has an icon in the header.</p>
            </app-accordion>
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
            <app-accordion label="Small Accordion" size="small">
              <p>Small size accordion content.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-accordion label="Medium Accordion" size="medium">
              <p>Medium size accordion content.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-accordion label="Large Accordion" size="large">
              <p>Large size accordion content.</p>
            </app-accordion>
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
            <h3>Transparent (Default)</h3>
            <app-accordion label="Transparent Accordion" variant="transparent">
              <p>Transparent variant accordion.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-accordion label="Subtle Accordion" variant="subtle">
              <p>Subtle variant accordion.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-accordion label="Subtle Circular Accordion" variant="subtle-circular">
              <p>Subtle circular variant accordion.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-accordion label="Filled Circular Accordion" variant="filled-circular">
              <p>Filled circular variant accordion.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CHEVRON POSITIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Chevron Positions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Before (Default)</h3>
            <app-accordion label="Chevron Before" chevronPosition="before">
              <p>Chevron icon appears before the label.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>After</h3>
            <app-accordion label="Chevron After" chevronPosition="after">
              <p>Chevron icon appears after the label.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CHEVRON ICONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Chevron Icons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Custom Icons</h3>
            <app-accordion
              label="Custom Chevron Icons"
              chevronIconCollapsed="arrow_right"
              chevronIconExpanded="arrow_down"
            >
              <p>Accordion with custom chevron icons.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Custom Icons (After)</h3>
            <app-accordion
              label="Custom Icons After"
              chevronPosition="after"
              chevronIconCollapsed="star"
              chevronIconExpanded="phone"
            >
              <p>Custom chevron icons in after position.</p>
            </app-accordion>
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
            <app-accordion
              label="Horizontal Indicator"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            >
              <p>Accordion with horizontal selection indicator.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator</h3>
            <app-accordion
              label="Vertical Indicator"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            >
              <p>Accordion with vertical selection indicator.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- DISABLED STATE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Disabled State</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Disabled (Collapsed)</h3>
            <app-accordion label="Disabled Accordion" [disabled]="true">
              <p>This content won't be visible because accordion is disabled.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Disabled (Expanded)</h3>
            <app-accordion label="Disabled Accordion (Expanded)" [disabled]="true">
              <p>This accordion is disabled but was expanded programmatically.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- QUICK ACTIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Quick Actions</h3>
            <app-accordion
              label="Accordion with Quick Actions"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate"
            >
              <p>This accordion has quick actions in the header.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- COMBINED EXAMPLES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Combined Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small + Subtle Circular + Chevron After</h3>
            <app-accordion
              label="Small Subtle Circular"
              size="small"
              variant="subtle-circular"
              chevronPosition="after"
            >
              <p>Combined example with multiple options.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Large + Filled Circular + Icon</h3>
            <app-accordion
              label="Large Filled Circular"
              size="large"
              variant="filled-circular"
              icon="folder"
            >
              <p>Combined example with size, variant, and icon.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Medium + Subtle + Horizontal Indicator</h3>
            <app-accordion
              label="Medium Subtle with Indicator"
              size="medium"
              variant="subtle"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            >
              <p>Combined example with appearance and indicator.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CONTENT EXAMPLES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Content Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Simple Text</h3>
            <app-accordion label="Simple Text Content">
              <p>This is simple text content inside the accordion.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Multiple Paragraphs</h3>
            <app-accordion label="Multiple Paragraphs">
              <p>First paragraph of content.</p>
              <p>Second paragraph of content.</p>
              <p>Third paragraph of content.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>Form Content</h3>
            <app-accordion label="Form Content">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <app-text label="Name" placeholder="Enter your name" size="small" />
                <app-email label="Email" placeholder="Enter your email" size="small" />
                <app-button variant="primary" size="small">Submit</app-button>
              </div>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <h3>List Content</h3>
            <app-accordion label="List Content">
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
              </ul>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EVENT TRACKING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Tracking</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Toggle Events</h3>
            <app-accordion label="Track Toggle Events" (toggle)="onToggle($event)">
              <p>Open the browser console to see toggle events.</p>
              <p>Expanded: {{ trackedAccordionExpanded() ? 'Yes' : 'No' }}</p>
            </app-accordion>
            <div style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
              <p style="font-size: 12px; margin: 0;">
                <strong>Toggle Count:</strong> {{ toggleCount() }}
              </p>
              <p style="font-size: 12px; margin: 4px 0 0 0;">
                <strong>Last Event:</strong> {{ lastToggleEvent() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Template -->
      <ng-template #quickActionsTemplate let-node>
        <div style="display: flex; gap: 4px; align-items: center;">
          <app-button
            variant="primary"
            size="small"
            (click)="onQuickActionClick('edit'); $event.stopPropagation()"
          >
            Edit
          </app-button>
          <app-button
            variant="primary"
            size="small"
            (click)="onQuickActionClick('delete'); $event.stopPropagation()"
          >
            Delete
          </app-button>
        </div>
      </ng-template>
    </div>
  `,
})
export class AccordionShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  expandedAccordion = signal<boolean>(true);
  trackedAccordionExpanded = signal<boolean>(false);
  toggleCount = signal<number>(0);
  lastToggleEvent = signal<string>('None');

  onToggle(expanded: boolean): void {
    this.trackedAccordionExpanded.set(expanded);
    this.toggleCount.update(count => count + 1);
    this.lastToggleEvent.set(`Toggled: ${expanded ? 'Expanded' : 'Collapsed'}`);
    console.log('Accordion toggled:', expanded);
  }

  onQuickActionClick(action: string): void {
    console.log('Quick action clicked:', action);
    alert(`Quick action: ${action}`);
  }
}

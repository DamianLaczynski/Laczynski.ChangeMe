import { Component } from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-showcase',

  imports: [AccordionComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Accordion Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Accordion component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-accordion label="Small Accordion" size="small" chevronPosition="before">
              <p>This is the content of a small accordion. It can contain any HTML content.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <app-accordion label="Medium Accordion" size="medium" chevronPosition="before">
              <p>This is the content of a medium accordion. It can contain any HTML content.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <app-accordion label="Large Accordion" size="large" chevronPosition="before">
              <p>This is the content of a large accordion. It can contain any HTML content.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- Chevron Position Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Chevron Position</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-accordion label="Chevron Before Title" chevronPosition="before">
              <p>The chevron is positioned before the label text.</p>
              <p>When collapsed, the chevron points to the right.</p>
              <p>When expanded, the chevron points down.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <app-accordion label="Chevron After Title" chevronPosition="after">
              <p>The chevron is positioned after the label text.</p>
              <p>When collapsed, the chevron points down.</p>
              <p>When expanded, the chevron points up (rotated).</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- With Icon -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Icon</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-accordion label="Accordion with Icon" chevronPosition="before" icon="star">
              <p>This accordion has both an icon and a chevron on the left side.</p>
              <p>The icon is a placeholder circle that can be replaced with any icon.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <app-accordion label="Accordion with Icon" chevronPosition="after" icon="star">
              <p>This accordion has an icon on the left and a chevron on the right.</p>
              <p>The icon is a placeholder circle that can be replaced with any icon.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-accordion label="Normal Accordion">
              <p>This is a normal accordion that can be toggled.</p>
            </app-accordion>
          </div>
          <div class="showcase__item">
            <app-accordion label="Disabled Accordion" [disabled]="true">
              <p>This content cannot be accessed because the accordion is disabled.</p>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- Complex Content -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Complex Content</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-accordion label="Accordion with Rich Content" chevronPosition="before">
              <div style="padding: 16px; background-color: #F3F2F1; border-radius: 4px;">
                <h4 style="margin-top: 0;">Rich Content Example</h4>
                <p>The accordion can contain any HTML content:</p>
                <ul>
                  <li>Lists</li>
                  <li>Tables</li>
                  <li>Forms</li>
                  <li>Images</li>
                  <li>Other components</li>
                </ul>
                <p><strong>Note:</strong> The content area is fully customizable.</p>
              </div>
            </app-accordion>
          </div>
        </div>
      </div>

      <!-- Multiple Accordions (Accordion Group) -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Accordion Group</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <app-accordion label="Section 1: Getting Started" chevronPosition="before">
                <p>Introduction to the accordion component and basic usage.</p>
              </app-accordion>

              <app-accordion label="Section 2: Features" chevronPosition="before">
                <p>Explore the various features and options available:</p>
                <ul>
                  <li>Multiple size options</li>
                  <li>Chevron positioning</li>
                  <li>Icon support</li>
                  <li>Disabled state</li>
                  <li>Smooth animations</li>
                </ul>
              </app-accordion>

              <app-accordion label="Section 3: Accessibility" chevronPosition="before">
                <p>This component follows WCAG 2.1 guidelines:</p>
                <ul>
                  <li>Keyboard navigation (Enter/Space to toggle)</li>
                  <li>ARIA attributes (aria-expanded, aria-disabled)</li>
                  <li>Focus management</li>
                  <li>Screen reader support</li>
                </ul>
              </app-accordion>

              <app-accordion
                label="Section 4: Best Practices"
                chevronPosition="before"
                [disabled]="true"
              >
                <p>This section is currently disabled.</p>
              </app-accordion>
            </div>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Combinations</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-accordion label="Small Before" size="small" chevronPosition="before">
              <p>Small size with chevron before.</p>
            </app-accordion>
          </div>

          <div class="showcase__item">
            <app-accordion label="Small After" size="small" chevronPosition="after">
              <p>Small size with chevron after.</p>
            </app-accordion>
          </div>

          <div class="showcase__item">
            <app-accordion
              label="Medium Before Icon"
              size="medium"
              chevronPosition="before"
              icon="star"
            >
              <p>Medium size with chevron before and icon.</p>
            </app-accordion>
          </div>

          <div class="showcase__item">
            <app-accordion
              label="Medium After Icon"
              size="medium"
              chevronPosition="after"
              icon="star"
            >
              <p>Medium size with chevron after and icon.</p>
            </app-accordion>
          </div>

          <div class="showcase__item">
            <app-accordion label="Large Before" size="large" chevronPosition="before">
              <p>Large size with chevron before.</p>
            </app-accordion>
          </div>

          <div class="showcase__item">
            <app-accordion label="Large After" size="large" chevronPosition="after">
              <p>Large size with chevron after.</p>
            </app-accordion>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccordionShowcaseComponent {}

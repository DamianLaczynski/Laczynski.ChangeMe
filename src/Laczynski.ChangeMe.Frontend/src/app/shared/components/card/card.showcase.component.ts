import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { QuickAction, CardStyle } from '../utils';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../field/checkbox';
import { DropdownComponent } from '../field/dropdown';

@Component({
  selector: 'app-card-showcase',

  imports: [CommonModule, CardComponent, FormsModule, CheckboxComponent, DropdownComponent],
  template: `
    <div class="showcase">
      <h1>Card Component - Fluent 2 Design System</h1>

      <section class="showcase-section">
        <h2>Basic Cards</h2>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Default Card - Filled Style</h3>
            <app-card
              title="Card Title"
              subtitle="Additional metadata"
              bodyText="Copilot is an AI tool designed to improve productivity by integrating with Microsoft applications, offering content generation and task automation features."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
              [secondaryAction]="secondaryAction"
              style="filled"
            >
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Outline Style Card</h3>
            <app-card
              title="Card Title"
              subtitle="Additional metadata"
              bodyText="Copilot is an AI tool designed to improve productivity by integrating with Microsoft applications."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
              [secondaryAction]="secondaryAction"
              style="outline"
            >
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Subtle Style Card</h3>
            <app-card
              title="Card Title"
              subtitle="Additional metadata"
              bodyText="Copilot is an AI tool designed to improve productivity by integrating with Microsoft applications."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
              [secondaryAction]="secondaryAction"
              style="subtle"
            >
            </app-card>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Card States</h2>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Disabled Card</h3>
            <app-card
              title="Disabled Card"
              subtitle="This card is disabled"
              bodyText="This card is disabled and cannot be interacted with."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
              [secondaryAction]="secondaryAction"
              [disabled]="true"
            >
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Clickable Card</h3>
            <app-card
              title="Clickable Card"
              subtitle="Click anywhere on this card"
              bodyText="This card is clickable and responds to click events with hover effects."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
              [secondaryAction]="secondaryAction"
              [clickable]="true"
              (cardClick)="onCardClick($event)"
            >
            </app-card>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Cards without Footer</h2>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Card without Footer</h3>
            <app-card
              title="Simple Card"
              subtitle="No action buttons"
              bodyText="This card doesn't have any footer actions, just header and body content."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [showFooter]="false"
            >
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Card with Primary Action Only</h3>
            <app-card
              title="Single Action Card"
              subtitle="One button only"
              bodyText="This card has only a primary action button in the footer."
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
            >
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Minimal Card</h3>
            <app-card
              title="Minimal Card"
              bodyText="A minimal card with just title and body content, no subtitle or actions."
              [showQuickAction]="false"
              [showFooter]="false"
            >
            </app-card>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Custom Content Cards</h2>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Card with Custom Body</h3>
            <app-card
              title="Custom Content"
              subtitle="With custom body template"
              [showHeader]="false"
              [showFooter]="false"
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="primaryAction"
            >
              <ng-template #customBody>
                <div
                  style="padding: 12px; background: var(--Brand-Background-2-Rest, #EBF3FC); border-radius: 4px; width: 100%;"
                >
                  <p
                    style="margin: 0; color: var(--Brand-Foreground-2-Rest, #115EA3); font-size: 12px; text-align: center;"
                  >
                    <strong>Custom Body Template</strong><br />
                    You can add any custom content here, including images, charts, or complex
                    layouts.
                  </p>
                </div>
              </ng-template>
            </app-card>
          </div>

          <div class="showcase-item">
            <h3>Card with Projected Content</h3>
            <app-card
              title="Projected Content"
              subtitle="Using ng-content"
              [headerIcon]="'image'"
              [showFooter]="false"
            >
              <div style="padding: 8px; display: flex; flex-direction: column; gap: 8px;">
                <div style="padding: 8px; background: #F0F0F0; border-radius: 4px;">
                  <strong>Feature 1:</strong> Advanced analytics
                </div>
                <div style="padding: 8px; background: #F0F0F0; border-radius: 4px;">
                  <strong>Feature 2:</strong> Real-time updates
                </div>
                <div style="padding: 8px; background: #F0F0F0; border-radius: 4px;">
                  <strong>Feature 3:</strong> Team collaboration
                </div>
              </div>
            </app-card>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Card Grid Layout</h2>
        <p>Multiple cards in a responsive grid</p>

        <div class="showcase-card-grid">
          @for (card of gridCards; track card.id) {
            <app-card
              [title]="card.title"
              [subtitle]="card.subtitle"
              [bodyText]="card.body"
              [headerIcon]="'image'"
              [showQuickAction]="true"
              [primaryAction]="card.action"
              [clickable]="true"
              (cardClick)="onCardClick($event)"
            >
            </app-card>
          }
        </div>
      </section>

      <section class="showcase-section">
        <h2>Interactive Example</h2>

        <div class="showcase-controls">
          <app-checkbox label="Disabled" [(ngModel)]="interactiveCard.disabled" />
          <app-checkbox label="Clickable" [(ngModel)]="interactiveCard.clickable" />
          <app-checkbox label="Show Quick Action" [(ngModel)]="interactiveCard.showQuickAction" />
          <app-checkbox label="Show Footer" [(ngModel)]="interactiveCard.showFooter" />
          <app-dropdown
            [items]="[
              {
                value: 'filled',
                label: 'Filled',
              },
              {
                value: 'outline',
                label: 'Outline',
              },
              {
                value: 'subtle',
                label: 'Subtle',
              },
            ]"
            [(ngModel)]="interactiveCard.style"
          />
        </div>

        <div class="showcase-item" style="margin-top: 20px;">
          <app-card
            [title]="interactiveCard.title"
            [subtitle]="interactiveCard.subtitle"
            [bodyText]="interactiveCard.body"
            [headerIcon]="'image'"
            [showQuickAction]="interactiveCard.showQuickAction"
            [primaryAction]="interactiveCard.showFooter ? primaryAction : null"
            [secondaryAction]="interactiveCard.showFooter ? secondaryAction : null"
            [disabled]="interactiveCard.disabled"
            [clickable]="interactiveCard.clickable"
            [style]="interactiveCard.style"
            [showFooter]="interactiveCard.showFooter"
            (cardClick)="onCardClick($event)"
            (quickActionClick)="onQuickActionClick($event)"
          >
          </app-card>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Event Logging</h2>
        <div class="event-log">
          @for (event of eventLog; track $index) {
            <div class="event-log-item">{{ event }}</div>
          }
          @if (eventLog.length === 0) {
            <div class="event-log-empty">No events logged yet. Interact with the cards above.</div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .showcase {
        padding: 40px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .showcase h1 {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 40px;
        color: var(--Neutral-Foreground-1-Rest, #242424);
      }

      .showcase-section {
        margin-bottom: 60px;
      }

      .showcase-section h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--Neutral-Foreground-1-Rest, #242424);
      }

      .showcase-section h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--Neutral-Foreground-2-Rest, #424242);
      }

      .showcase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 24px;
        margin-top: 20px;
      }

      .showcase-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .showcase-item {
        display: flex;
        flex-direction: column;
      }

      .showcase-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 4px;
      }

      .showcase-controls label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--Neutral-Foreground-1-Rest, #242424);
      }

      .showcase-controls input[type='checkbox'],
      .showcase-controls select {
        cursor: pointer;
      }

      .event-log {
        max-height: 300px;
        overflow-y: auto;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-size: 12px;
      }

      .event-log-item {
        padding: 8px;
        margin-bottom: 4px;
        background: white;
        border-radius: 2px;
        color: var(--Neutral-Foreground-1-Rest, #242424);
      }

      .event-log-empty {
        color: var(--Neutral-Foreground-3-Rest, #616161);
        text-align: center;
        padding: 20px;
      }
    `,
  ],
})
export class CardShowcaseComponent {
  @ViewChild('imageIcon', { static: true }) imageIcon!: TemplateRef<any>;
  @ViewChild('moreIcon', { static: true }) moreIcon!: TemplateRef<any>;

  eventLog: string[] = [];

  primaryAction: QuickAction = {
    label: 'Button',
    variant: 'primary',
    action: () => this.logEvent('Primary action clicked'),
  };

  secondaryAction: QuickAction = {
    label: 'Button',
    variant: 'secondary',
    action: () => this.logEvent('Secondary action clicked'),
  };

  interactiveCard = {
    title: 'Interactive Card',
    subtitle: 'Change settings above',
    body: 'This card changes based on the controls above. Try different combinations of settings.',
    disabled: false,
    clickable: true,
    showQuickAction: true,
    showFooter: true,
    style: 'filled' as CardStyle,
  };

  gridCards = [
    {
      id: 1,
      title: 'Analytics Dashboard',
      subtitle: 'Real-time insights',
      body: 'View comprehensive analytics and metrics for your application with real-time updates.',
      action: {
        label: 'View Details',
        variant: 'primary' as const,
        action: () => this.logEvent('Analytics card clicked'),
      },
    },
    {
      id: 2,
      title: 'Team Collaboration',
      subtitle: 'Work together',
      body: 'Collaborate with your team members in real-time with advanced sharing features.',
      action: {
        label: 'Open',
        variant: 'primary' as const,
        icon: 'open',
        action: () => this.logEvent('Collaboration card clicked'),
      },
    },
    {
      id: 3,
      title: 'Document Storage',
      subtitle: 'Secure and reliable',
      body: 'Store and manage your documents with enterprise-grade security and accessibility.',
      action: {
        label: 'Browse',
        variant: 'primary' as const,
        action: () => this.logEvent('Storage card clicked'),
      },
    },
    {
      id: 4,
      title: 'Automation Tools',
      subtitle: 'Save time',
      body: 'Automate repetitive tasks and workflows to increase productivity and efficiency.',
      action: {
        label: 'Configure',
        variant: 'primary' as const,
        action: () => this.logEvent('Automation card clicked'),
      },
    },
  ];

  onCardClick(event: MouseEvent): void {
    this.logEvent('Card clicked');
  }

  onQuickActionClick(event: MouseEvent): void {
    this.logEvent('Quick action button clicked');
  }

  private logEvent(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.unshift(`[${timestamp}] ${message}`);

    // Keep only last 10 events
    if (this.eventLog.length > 10) {
      this.eventLog.pop();
    }
  }
}

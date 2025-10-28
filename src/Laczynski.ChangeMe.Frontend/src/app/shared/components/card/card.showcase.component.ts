import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card.component';
import { QuickAction } from '../utils';

@Component({
  selector: 'app-card-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
              [headerIcon]="imageIcon"
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
          <label>
            <input type="checkbox" [(ngModel)]="interactiveCard.disabled" />
            Disabled
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="interactiveCard.clickable" />
            Clickable
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="interactiveCard.showQuickAction" />
            Show Quick Action
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="interactiveCard.showFooter" />
            Show Footer
          </label>
          <label>
            Style:
            <select [(ngModel)]="interactiveCard.style">
              <option value="filled">Filled</option>
              <option value="outline">Outline</option>
              <option value="subtle">Subtle</option>
            </select>
          </label>
        </div>

        <div class="showcase-item" style="margin-top: 20px;">
          <app-card
            [title]="interactiveCard.title"
            [subtitle]="interactiveCard.subtitle"
            [bodyText]="interactiveCard.body"
            [headerIcon]="imageIcon"
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

    <!-- SVG Templates -->
    <ng-template #imageIcon>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 4C9.37258 4 4 9.37258 4 16C4 18.9242 5.04592 21.604 6.78407 23.6859L14.2303 16.233C15.2068 15.2556 16.7909 15.2556 17.7674 16.233L25.2149 23.6872C26.9537 21.6051 28 18.9248 28 16C28 9.37258 22.6274 4 16 4ZM23.8101 25.1109L16.3526 17.6466C16.1573 17.4511 15.8404 17.4511 15.6451 17.6466L8.18866 25.1098C10.2878 26.9114 13.0168 28 16 28C18.9826 28 21.7111 26.9118 23.8101 25.1109ZM2 16C2 8.26801 8.26801 2 16 2C23.732 2 30 8.26801 30 16C30 23.732 23.732 30 16 30C8.26801 30 2 23.732 2 16ZM20.5 13C19.6716 13 19 12.3284 19 11.5C19 10.6716 19.6716 10 20.5 10C21.3284 10 22 10.6716 22 11.5C22 12.3284 21.3284 13 20.5 13ZM20.5 15C22.433 15 24 13.433 24 11.5C24 9.567 22.433 8 20.5 8C18.567 8 17 9.567 17 11.5C17 13.433 18.567 15 20.5 15Z"
          fill="var(--Neutral-Foreground-1-Rest, #242424)"
        />
      </svg>
    </ng-template>

    <ng-template #moreIcon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.25 10C6.25 10.6904 5.69036 11.25 5 11.25C4.30964 11.25 3.75 10.6904 3.75 10C3.75 9.30964 4.30964 8.75 5 8.75C5.69036 8.75 6.25 9.30964 6.25 10ZM11.25 10C11.25 10.6904 10.6904 11.25 10 11.25C9.30964 11.25 8.75 10.6904 8.75 10C8.75 9.30964 9.30964 8.75 10 8.75C10.6904 8.75 11.25 9.30964 11.25 10ZM15 11.25C15.6904 11.25 16.25 10.6904 16.25 10C16.25 9.30964 15.6904 8.75 15 8.75C14.3096 8.75 13.75 9.30964 13.75 10C13.75 10.6904 14.3096 11.25 15 11.25Z"
          fill="var(--Neutral-Foreground-2-Rest, #424242)"
        />
      </svg>
    </ng-template>
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
    style: 'filled' as 'filled' | 'outline' | 'subtle',
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

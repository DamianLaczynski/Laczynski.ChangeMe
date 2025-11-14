import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollPanelComponent } from './scroll-panel.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-scroll-panel-showcase',

  imports: [CommonModule, ScrollPanelComponent, ButtonComponent, CardComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">ScrollPanel</h1>
      <p class="showcase__description">
        ScrollPanel provides a scrollable container with customizable scrollbars following the
        Fluent 2 Design System. It supports vertical, horizontal, and bidirectional scrolling with
        various scrollbar behaviors.
      </p>

      <!-- Vertical Scrolling -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Vertical Scrolling</h2>
        <p class="showcase__section__description">
          Default vertical scrolling with auto-hide scrollbars.
        </p>
        <div class="showcase__example">
          <app-scroll-panel orientation="vertical" maxHeight="400px">
            <div style="padding: 16px;">
              @for (item of items; track item.id) {
                <app-card
                  [title]="item.title"
                  [subtitle]="item.subtitle"
                  [bodyText]="item.body"
                  [attr.style]="'margin-bottom: 12px;'"
                />
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Horizontal Scrolling -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Horizontal Scrolling</h2>
        <p class="showcase__section__description">Horizontal scrolling for wide content.</p>
        <div class="showcase__example">
          <app-scroll-panel orientation="horizontal" maxHeight="400px">
            <div style="display: flex; gap: 12px; padding: 16px;">
              @for (item of items; track item.id) {
                <app-card
                  [title]="item.title"
                  [subtitle]="item.subtitle"
                  [attr.style]="'min-width: 300px; flex-shrink: 0;'"
                />
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Both Directions -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Bidirectional Scrolling</h2>
        <p class="showcase__section__description">
          Scrolling in both vertical and horizontal directions.
        </p>
        <div class="showcase__example">
          <app-scroll-panel orientation="both" maxHeight="400px">
            <div style="padding: 16px; min-width: 800px;">
              @for (item of items; track item.id) {
                <app-card
                  [title]="item.title"
                  [subtitle]="item.subtitle"
                  [bodyText]="item.body"
                  [attr.style]="'margin-bottom: 12px;'"
                />
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Scrollbar Behavior -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Scrollbar Behavior</h2>

        <h3 class="showcase__subsection-title">Auto (default) - Shows on hover</h3>
        <div class="showcase__example">
          <app-scroll-panel scrollbarBehavior="auto" maxHeight="200px">
            <div style="padding: 12px;">
              @for (item of shortItems; track item.id) {
                <p style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>

        <h3 class="showcase__subsection-title">Always - Always visible</h3>
        <div class="showcase__example">
          <app-scroll-panel scrollbarBehavior="always" maxHeight="200px">
            <div style="padding: 12px;">
              @for (item of shortItems; track item.id) {
                <p style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>

        <h3 class="showcase__subsection-title">Never - Hidden</h3>
        <div class="showcase__example">
          <app-scroll-panel scrollbarBehavior="never" maxHeight="200px">
            <div style="padding: 12px;">
              @for (item of shortItems; track item.id) {
                <p style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Sizes</h2>

        <h3 class="showcase__subsection-title">Small (200px max height)</h3>
        <div class="showcase__example">
          <app-scroll-panel size="small">
            <div style="padding: 8px;">
              @for (item of items; track item.id) {
                <p
                  style="margin: 4px 0; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 12px;"
                >
                  {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>

        <h3 class="showcase__subsection-title">Medium (400px max height)</h3>
        <div class="showcase__example">
          <app-scroll-panel size="medium">
            <div style="padding: 12px;">
              @for (item of items; track item.id) {
                <p style="margin: 8px 0; padding: 12px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>

        <h3 class="showcase__subsection-title">Large (600px max height)</h3>
        <div class="showcase__example">
          <app-scroll-panel maxHeight="600px">
            <div style="padding: 16px;">
              @for (item of items; track item.id) {
                <p
                  style="margin: 12px 0; padding: 16px; background: #f5f5f5; border-radius: 4px; font-size: 16px;"
                >
                  {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Custom Max Height -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Custom Dimensions</h2>
        <p class="showcase__section__description">
          You can override max-height and max-width with custom values.
        </p>
        <div class="showcase__example">
          <app-scroll-panel maxHeight="250px">
            <div style="padding: 12px;">
              @for (item of items; track item.id) {
                <p style="margin: 8px 0; padding: 12px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Programmatic Scrolling -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Programmatic Scrolling</h2>
        <p class="showcase__section__description">
          Control scrolling programmatically using component methods.
        </p>
        <div class="showcase__example">
          <div style="margin-bottom: 12px; display: flex; gap: 8px;">
            <app-button (click)="scrollToTop()" size="small"> Scroll to Top </app-button>
            <app-button (click)="scrollToBottom()" size="small"> Scroll to Bottom </app-button>
          </div>
          <app-scroll-panel #programmaticScroll maxHeight="400px">
            <div style="padding: 12px;">
              @for (item of items; track item.id) {
                <p style="margin: 8px 0; padding: 12px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.id }}. {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>

      <!-- Scroll Events -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Scroll Events</h2>
        <p class="showcase__section__description">Listen to scroll and scrollEnd events.</p>
        <div class="showcase__example">
          <p style="margin-bottom: 12px; padding: 12px; background: #ebf3fc; border-radius: 4px;">
            Scroll position: {{ scrollPosition }}px | Last scroll ended: {{ scrollEndCount }} times
          </p>
          <app-scroll-panel
            (scroll)="onScroll($event)"
            (scrollEnd)="onScrollEnd()"
            maxHeight="400px"
          >
            <div style="padding: 12px;">
              @for (item of items; track item.id) {
                <p style="margin: 8px 0; padding: 12px; background: #f5f5f5; border-radius: 4px;">
                  {{ item.title }} - {{ item.subtitle }}
                </p>
              }
            </div>
          </app-scroll-panel>
        </div>
      </section>
    </div>
  `,
})
export class ScrollPanelShowcaseComponent {
  programmaticScroll = viewChild<ScrollPanelComponent>('programmaticScroll');

  scrollPosition = 0;
  scrollEndCount = 0;

  items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    subtitle: `Subtitle for item ${i + 1}`,
    body: `This is the body content for item ${i + 1}. It contains some descriptive text to demonstrate the scrolling behavior.`,
  }));

  shortItems = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Short Item ${i + 1}`,
  }));

  scrollToTop(): void {
    this.programmaticScroll()?.scrollToTop();
  }

  scrollToBottom(): void {
    this.programmaticScroll()?.scrollToBottom();
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.scrollPosition = Math.round(target.scrollTop);
  }

  onScrollEnd(): void {
    this.scrollEndCount++;
  }
}
